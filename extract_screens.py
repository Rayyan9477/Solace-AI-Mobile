"""
Script to extract individual screens from composite UI design images.
Ensures each screen is extracted completely without truncation.
"""

import os
from PIL import Image
import numpy as np
from scipy import ndimage

def detect_screen_boundaries(image_array, min_gap=20, min_screen_width=300):
    """
    Detect individual screen boundaries in a composite image.
    Uses multiple strategies to detect screens in various layouts.
    
    Args:
        image_array: NumPy array of the image
        min_gap: Minimum gap between screens (pixels)
        min_screen_width: Minimum width for a valid screen
    
    Returns:
        List of tuples (x1, y1, x2, y2) representing screen boundaries
    """
    height, width = image_array.shape[:2]
    
    # Convert to grayscale if needed
    if len(image_array.shape) == 3:
        gray = np.mean(image_array, axis=2)
    else:
        gray = image_array
    
    # Strategy 1: Detect based on color/brightness gaps
    # Look for columns that are mostly background (light or dark)
    column_means = np.mean(gray, axis=0)
    column_std = np.std(gray, axis=0)
    
    # Detect gaps as columns with low variation (uniform background)
    is_gap = column_std < 5  # Low standard deviation means uniform color
    
    # Also check for white or very dark backgrounds
    is_white_gap = column_means > 240
    is_dark_gap = column_means < 15
    is_gap = is_gap | is_white_gap | is_dark_gap
    
    # Smooth the gap detection to avoid noise
    try:
        from scipy.ndimage import uniform_filter1d
        is_gap_smoothed = uniform_filter1d(is_gap.astype(float), size=10) > 0.8
    except ImportError:
        # Fallback if scipy is not available
        kernel_size = 10
        is_gap_smoothed = np.convolve(is_gap.astype(float), 
                                       np.ones(kernel_size)/kernel_size, 
                                       mode='same') > 0.8
    
    # Find transitions from screen to gap
    transitions = np.diff(is_gap_smoothed.astype(int))
    screen_starts = np.where(transitions == -1)[0] + 1
    screen_ends = np.where(transitions == 1)[0]
    
    # Handle edge cases
    if len(screen_starts) == 0 and len(screen_ends) == 0:
        # No gaps detected - might be a single large screen or tightly packed
        return detect_screens_by_aspect_ratio(image_array, min_screen_width)
    
    if not is_gap_smoothed[0] and len(screen_starts) > 0:
        screen_starts = np.concatenate([[0], screen_starts])
    elif not is_gap_smoothed[0] and len(screen_starts) == 0:
        screen_starts = np.array([0])
        
    if not is_gap_smoothed[-1] and len(screen_ends) > 0:
        screen_ends = np.concatenate([screen_ends, [width - 1]])
    elif not is_gap_smoothed[-1] and len(screen_ends) == 0:
        screen_ends = np.array([width - 1])
    
    # Pair starts and ends
    screens = []
    for start, end in zip(screen_starts, screen_ends):
        if end - start >= min_screen_width:
            # Find top and bottom boundaries for this screen
            screen_region = gray[:, start:end]
            row_means = np.mean(screen_region, axis=1)
            row_std = np.std(screen_region, axis=1)
            
            # Find content rows (not uniform background)
            is_content_row = row_std > 5
            content_rows = np.where(is_content_row)[0]
            
            if len(content_rows) > 0:
                top = max(0, content_rows[0] - 2)
                bottom = min(height - 1, content_rows[-1] + 2)
                screens.append((start, top, end, bottom))
    
    # If no screens detected, fall back to aspect ratio method
    if len(screens) == 0:
        return detect_screens_by_aspect_ratio(image_array, min_screen_width)
    
    return screens


def detect_screens_by_aspect_ratio(image_array, min_screen_width=300):
    """
    Fallback method: Split image based on typical mobile screen aspect ratio.
    
    Args:
        image_array: NumPy array of the image
        min_screen_width: Minimum width for a valid screen
    
    Returns:
        List of tuples (x1, y1, x2, y2) representing screen boundaries
    """
    height, width = image_array.shape[:2]
    
    # Common mobile aspect ratios (width:height)
    # iPhone X and newer: 9:19.5 (~0.46)
    # Standard: 9:16 (~0.56)
    aspect_ratios = [9/19.5, 9/16, 10/16, 3/4]
    
    screens = []
    
    for aspect_ratio in aspect_ratios:
        estimated_screen_width = int(height * aspect_ratio)
        
        if estimated_screen_width >= min_screen_width:
            num_screens = width // estimated_screen_width
            
            if num_screens >= 2:  # Only use if we get at least 2 screens
                for i in range(num_screens):
                    x1 = i * estimated_screen_width
                    x2 = min((i + 1) * estimated_screen_width, width)
                    
                    # Add small gap between screens
                    if i > 0:
                        x1 += 10
                    if i < num_screens - 1:
                        x2 -= 10
                    
                    if x2 - x1 >= min_screen_width:
                        screens.append((x1, 0, x2, height - 1))
                
                if len(screens) > 0:
                    break
    
    # If still no screens, return the whole image as one screen
    if len(screens) == 0:
        screens = [(0, 0, width - 1, height - 1)]
    
    return screens


def split_wide_screen(screen_bounds, img_array, max_width=450):
    """
    Split a wide screen into multiple individual screens.
    
    Args:
        screen_bounds: Tuple (x1, y1, x2, y2) of the wide screen
        img_array: NumPy array of the full image
        max_width: Maximum width for a single screen (typical mobile: 360-430px)
    
    Returns:
        List of screen boundaries
    """
    x1, y1, x2, y2 = screen_bounds
    width = x2 - x1
    height = y2 - y1
    
    if width <= max_width:
        return [screen_bounds]
    
    # For extremely wide screens (>1000px), force split based on aspect ratio
    if width > 1000:
        print(f"    Extremely wide screen detected ({width}px), forcing split...")
        # Calculate number of screens based on typical mobile width
        typical_width = 380
        num_screens = max(2, int(np.round(width / typical_width)))
        
        split_screens = []
        for i in range(num_screens):
            sx1 = x1 + int(i * width / num_screens)
            sx2 = x1 + int((i + 1) * width / num_screens)
            
            # Add small gap between screens
            if i > 0:
                sx1 += 8
            if i < num_screens - 1:
                sx2 -= 8
            
            if sx2 - sx1 >= 300:
                split_screens.append((sx1, y1, sx2, y2))
        
        return split_screens if split_screens else [screen_bounds]
    
    # Extract the wide screen region
    screen_region = img_array[y1:y2, x1:x2]
    
    # Try to detect sub-screens within this region
    sub_screens = detect_screen_boundaries(screen_region, min_screen_width=300)
    
    # Convert relative coordinates to absolute and filter
    absolute_screens = []
    for sx1, sy1, sx2, sy2 in sub_screens:
        abs_screen = (x1 + sx1, y1 + sy1, x1 + sx2, y1 + sy2)
        screen_width = abs_screen[2] - abs_screen[0]
        # Only add if it's a reasonable width (300-450px is typical mobile)
        if 300 <= screen_width <= max_width:
            absolute_screens.append(abs_screen)
    
    # If we got valid sub-screens, return them
    if len(absolute_screens) >= 2:
        return absolute_screens
    
    # Fallback: split based on standard mobile aspect ratio
    # Try multiple aspect ratios to find best fit
    aspect_ratios = [9/19.5, 9/16, 10/16]  # iPhone X, standard, slightly wider
    
    best_split = None
    best_uniformity = float('inf')
    
    for aspect_ratio in aspect_ratios:
        estimated_screen_width = int(height * aspect_ratio)
        
        if estimated_screen_width < 300:
            estimated_screen_width = 380  # Use typical mobile width
        
        num_screens = int(np.ceil(width / estimated_screen_width))
        
        # Calculate how uniform the splits would be
        avg_width = width / num_screens
        uniformity = abs(avg_width - estimated_screen_width)
        
        if uniformity < best_uniformity and 300 <= avg_width <= max_width + 50:
            best_uniformity = uniformity
            split_screens = []
            
            for i in range(num_screens):
                sx1 = x1 + int(i * width / num_screens)
                sx2 = x1 + int((i + 1) * width / num_screens)
                
                # Add small gap between screens
                if i > 0:
                    sx1 += 5
                if i < num_screens - 1:
                    sx2 -= 5
                
                if sx2 - sx1 >= 300:
                    split_screens.append((sx1, y1, sx2, y2))
            
            if split_screens:
                best_split = split_screens
    
    return best_split if best_split else [screen_bounds]


def extract_screens_from_image(image_path, output_folder, base_name):
    """
    Extract individual screens from a composite image.
    
    Args:
        image_path: Path to the composite image
        output_folder: Folder to save extracted screens
        base_name: Base name for output files
    """
    print(f"Processing: {image_path}")
    
    # Load image
    img = Image.open(image_path)
    img_array = np.array(img)
    
    print(f"  Image size: {img.size[0]}x{img.size[1]}")
    
    # Detect screen boundaries
    screens = detect_screen_boundaries(img_array)
    
    print(f"  Initially detected {len(screens)} screen(s)")
    
    # Post-process: split any wide screens
    final_screens = []
    for screen in screens:
        x1, y1, x2, y2 = screen
        width = x2 - x1
        
        # If screen is too wide, split it (450px is typical max mobile width)
        if width > 450:
            print(f"  Splitting wide screen ({width}px wide) into individual screens...")
            sub_screens = split_wide_screen(screen, img_array)
            final_screens.extend(sub_screens)
        else:
            final_screens.append(screen)
    
    print(f"  Final count: {len(final_screens)} screen(s)")
    
    # Create output folder if it doesn't exist
    os.makedirs(output_folder, exist_ok=True)
    
    # Extract and save each screen
    for idx, (x1, y1, x2, y2) in enumerate(final_screens, 1):
        # Add small padding to ensure no truncation
        padding = 2
        x1 = max(0, x1 - padding)
        y1 = max(0, y1 - padding)
        x2 = min(img.size[0], x2 + padding)
        y2 = min(img.size[1], y2 + padding)
        
        # Crop the screen
        screen_img = img.crop((x1, y1, x2, y2))
        
        # Save with descriptive name
        output_path = os.path.join(output_folder, f"{base_name}_Screen_{idx:02d}.png")
        screen_img.save(output_path, "PNG", optimize=True)
        print(f"  ✓ Extracted: {base_name}_Screen_{idx:02d}.png ({x2-x1}x{y2-y1}px)")
    
    return len(final_screens)


def process_all_images(base_dir, mode="Dark-mode"):
    """
    Process all composite images in the specified mode folder.
    
    Args:
        base_dir: Base directory containing the ui-designs folder
        mode: Either "Dark-mode" or "Light mode"
    """
    mode_dir = os.path.join(base_dir, "ui-designs", mode)
    
    # List of image files to process
    image_files = [
        ("Mental Health Assessment.png", "Mental Health Assessment"),
        ("Sign In & Sign Up.png", "Sign In & Sign Up"),
        ("Splash & Loading.png", "Splash & Loading"),
        ("Welcome Screen.png", "Welcome Screen"),
        ("🔒 AI Therapy Chatbot.png", "🔒 AI Therapy Chatbot"),
        ("🔒 Community Support.png", "🔒 Community Support"),
        ("🔒 Error & Other Utilities.png", "🔒 Error & Other Utilities"),
        ("🔒 Home & Mental Health Score.png", "🔒 Home & Mental Health Score"),
        ("🔒 Mental Health Journal.png", "🔒 Mental Health Journal"),
        ("🔒 Mindful Hours.png", "🔒 Mindful Hours"),
        ("🔒 Mindful Resources.png", "🔒 Mindful Resources"),
        ("🔒 Mood Tracker.png", "🔒 Mood Tracker"),
        ("🔒 Profile Settings & Help Center.png", "🔒 Profile Settings & Help Center"),
        ("🔒 Profile Setup & Completion.png", "🔒 Profile Setup & Completion"),
        ("🔒 Search Screen.png", "🔒 Search Screen"),
        ("🔒 Sleep Quality.png", "🔒 Sleep Quality"),
        ("🔒 Smart Notifications.png", "🔒 Smart Notifications"),
        ("🔒 Stress Management.png", "🔒 Stress Management"),
    ]
    
    total_screens = 0
    successful_files = 0
    
    print("=" * 80)
    print(f"Starting Screen Extraction Process for {mode}")
    print("=" * 80)
    print()
    
    for image_file, folder_name in image_files:
        image_path = os.path.join(mode_dir, image_file)
        output_folder = os.path.join(mode_dir, folder_name)
        
        if os.path.exists(image_path):
            try:
                # Extract base name without extension for naming
                base_name = os.path.splitext(image_file)[0].replace("🔒 ", "").replace(" ", "_")
                
                num_screens = extract_screens_from_image(image_path, output_folder, base_name)
                total_screens += num_screens
                successful_files += 1
                print()
            except Exception as e:
                print(f"  ✗ Error processing {image_file}: {str(e)}")
                print()
        else:
            print(f"  ✗ File not found: {image_file}")
            print()
    
    print("=" * 80)
    print(f"Extraction Complete for {mode}!")
    print(f"  Processed: {successful_files}/{len(image_files)} files")
    print(f"  Total screens extracted: {total_screens}")
    print("=" * 80)


if __name__ == "__main__":
    import sys
    
    # Get the base directory (parent of ui-designs)
    script_dir = os.path.dirname(os.path.abspath(__file__))
    base_dir = script_dir
    
    # Check if mode is specified via command line argument
    mode = sys.argv[1] if len(sys.argv) > 1 else "Dark-mode"
    
    # Validate mode
    if mode not in ["Dark-mode", "Light mode"]:
        print(f"Invalid mode: {mode}")
        print("Valid modes: 'Dark-mode' or 'Light mode'")
        sys.exit(1)
    
    process_all_images(base_dir, mode)

import { Image as RNImage, Dimensions, PixelRatio } from 'react-native';
import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system';
import * as ImageManipulator from 'expo-image-manipulator';

/**
 * Image optimization utilities for React Native
 * Provides WebP support, caching strategies, and performance optimizations
 */

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const pixelRatio = PixelRatio.get();

/**
 * Calculate optimal image dimensions based on screen size and pixel ratio
 */
export const calculateOptimalSize = (originalWidth, originalHeight, maxWidth = screenWidth, maxHeight = screenHeight) => {
  const targetWidth = maxWidth * pixelRatio;
  const targetHeight = maxHeight * pixelRatio;
  
  const widthRatio = targetWidth / originalWidth;
  const heightRatio = targetHeight / originalHeight;
  const ratio = Math.min(widthRatio, heightRatio, 1); // Don't upscale
  
  return {
    width: Math.round(originalWidth * ratio),
    height: Math.round(originalHeight * ratio),
    ratio,
  };
};

/**
 * Generate multiple image sizes for different screen densities
 */
export const generateImageSizes = (baseWidth, baseHeight) => {
  return {
    '1x': { width: baseWidth, height: baseHeight },
    '2x': { width: baseWidth * 2, height: baseHeight * 2 },
    '3x': { width: baseWidth * 3, height: baseHeight * 3 },
    optimal: calculateOptimalSize(baseWidth, baseHeight),
  };
};

/**
 * Optimize image quality based on content type and usage
 */
export const getOptimalQuality = (imageType, usage = 'normal') => {
  const qualityMap = {
    avatar: { high: 0.9, normal: 0.8, thumbnail: 0.6 },
    illustration: { high: 0.95, normal: 0.85, thumbnail: 0.7 },
    photo: { high: 0.9, normal: 0.8, thumbnail: 0.6 },
    icon: { high: 1.0, normal: 0.95, thumbnail: 0.8 },
    background: { high: 0.8, normal: 0.7, thumbnail: 0.5 },
  };
  
  return qualityMap[imageType]?.[usage] || 0.8;
};

/**
 * Image cache management
 */
class ImageCache {
  constructor() {
    this.cache = new Map();
    this.maxSize = 50 * 1024 * 1024; // 50MB cache limit
    this.currentSize = 0;
  }
  
  getCacheKey(uri, width, height, quality) {
    return `${uri}_${width}x${height}_q${quality}`;
  }
  
  async get(uri, options = {}) {
    const { width, height, quality = 0.8 } = options;
    const key = this.getCacheKey(uri, width, height, quality);
    
    if (this.cache.has(key)) {
      const cached = this.cache.get(key);
      if ((await FileSystem.getInfoAsync(cached.localUri)).exists) {
        return cached.localUri;
      } else {
        // Remove stale cache entry
        this.cache.delete(key);
      }
    }
    
    return null;
  }
  
  async set(uri, localUri, size, options = {}) {
    const { width, height, quality = 0.8 } = options;
    const key = this.getCacheKey(uri, width, height, quality);
    
    // Check if we need to free up space
    if (this.currentSize + size > this.maxSize) {
      await this.cleanup();
    }
    
    this.cache.set(key, {
      localUri,
      size,
      timestamp: Date.now(),
    });
    
    this.currentSize += size;
  }
  
  async cleanup(maxAge = 7 * 24 * 60 * 60 * 1000) { // 7 days
    const now = Date.now();
    const toDelete = [];
    
    for (const [key, value] of this.cache.entries()) {
      if (now - value.timestamp > maxAge) {
        toDelete.push(key);
      }
    }
    
    // Remove oldest entries if still over limit
    if (toDelete.length === 0 && this.currentSize > this.maxSize) {
      const entries = Array.from(this.cache.entries())
        .sort(([,a], [,b]) => a.timestamp - b.timestamp);
      
      toDelete.push(...entries.slice(0, Math.ceil(entries.length * 0.3)).map(([key]) => key));
    }
    
    for (const key of toDelete) {
      const cached = this.cache.get(key);
      if (cached) {
        try {
          await FileSystem.deleteAsync(cached.localUri, { idempotent: true });
        } catch (error) {
          // Ignore deletion errors
        }
        this.currentSize -= cached.size;
        this.cache.delete(key);
      }
    }
  }
  
  clear() {
    this.cache.clear();
    this.currentSize = 0;
  }
}

const imageCache = new ImageCache();

/**
 * Optimized image component with automatic resizing and caching
 */
export const OptimizedImage = ({ 
  source, 
  width, 
  height, 
  quality, 
  imageType = 'photo',
  usage = 'normal',
  placeholder,
  onLoad,
  onError,
  ...props 
}) => {
  const [optimizedSource, setOptimizedSource] = React.useState(placeholder || source);
  const [loading, setLoading] = React.useState(true);
  
  React.useEffect(() => {
    let mounted = true;
    
    const optimizeImage = async () => {
      try {
        if (!source?.uri) {
          setOptimizedSource(source);
          setLoading(false);
          return;
        }
        
        const targetQuality = quality || getOptimalQuality(imageType, usage);
        const dimensions = width && height ? { width, height } : calculateOptimalSize(width || 300, height || 300);
        
        // Check cache first
        const cachedUri = await imageCache.get(source.uri, { 
          width: dimensions.width, 
          height: dimensions.height, 
          quality: targetQuality 
        });
        
        if (cachedUri && mounted) {
          setOptimizedSource({ uri: cachedUri });
          setLoading(false);
          return;
        }
        
        // Optimize image
        const result = await ImageManipulator.manipulateAsync(
          source.uri,
          [{ resize: dimensions }],
          { 
            compress: targetQuality,
            format: ImageManipulator.SaveFormat.JPEG, // Consider WebP when supported
          }
        );
        
        if (mounted) {
          // Cache the optimized image
          const info = await FileSystem.getInfoAsync(result.uri);
          await imageCache.set(source.uri, result.uri, info.size, {
            width: dimensions.width,
            height: dimensions.height,
            quality: targetQuality,
          });
          
          setOptimizedSource({ uri: result.uri });
          setLoading(false);
          onLoad?.();
        }
      } catch (error) {
        console.error('Image optimization failed:', error);
        if (mounted) {
          setOptimizedSource(source);
          setLoading(false);
          onError?.(error);
        }
      }
    };
    
    optimizeImage();
    
    return () => {
      mounted = false;
    };
  }, [source, width, height, quality, imageType, usage]);
  
  return (
    <RNImage
      {...props}
      source={optimizedSource}
      style={[
        { width, height },
        loading && { opacity: 0.6 },
        props.style,
      ]}
    />
  );
};

/**
 * Lazy loading image component
 */
export const LazyImage = ({ 
  source, 
  placeholder,
  threshold = 50,
  ...props 
}) => {
  const [shouldLoad, setShouldLoad] = React.useState(false);
  const [inView, setInView] = React.useState(false);
  
  const onLayout = React.useCallback((event) => {
    // Simple visibility detection - in a real app, you'd use Intersection Observer equivalent
    setInView(true);
  }, []);
  
  React.useEffect(() => {
    if (inView) {
      const timer = setTimeout(() => setShouldLoad(true), threshold);
      return () => clearTimeout(timer);
    }
  }, [inView, threshold]);
  
  return (
    <OptimizedImage
      {...props}
      source={shouldLoad ? source : placeholder}
      onLayout={onLayout}
    />
  );
};

/**
 * Preload images for better UX
 */
export const preloadImages = async (imageUris, options = {}) => {
  const { maxConcurrent = 3, timeout = 10000 } = options;
  const results = [];
  
  const processImage = async (uri) => {
    try {
      const asset = Asset.fromURI(uri);
      await Promise.race([
        asset.downloadAsync(),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout')), timeout)
        ),
      ]);
      return { uri, success: true };
    } catch (error) {
      return { uri, success: false, error };
    }
  };
  
  // Process in batches to avoid overwhelming the system
  for (let i = 0; i < imageUris.length; i += maxConcurrent) {
    const batch = imageUris.slice(i, i + maxConcurrent);
    const batchResults = await Promise.all(batch.map(processImage));
    results.push(...batchResults);
  }
  
  return results;
};

/**
 * WebP support detection and fallback
 */
export const getOptimalImageFormat = () => {
  // React Native doesn't have native WebP detection
  // This would be implemented with native modules in a real app
  return {
    supportsWebP: false, // Would check native capabilities
    supportsAVIF: false,
    fallbackFormat: 'jpeg',
  };
};

/**
 * Image source URI generator with format selection
 */
export const generateImageSource = (baseUri, options = {}) => {
  const { 
    width, 
    height, 
    quality = 0.8, 
    format = 'auto',
    density = pixelRatio 
  } = options;
  
  const formats = getOptimalImageFormat();
  let selectedFormat = format;
  
  if (format === 'auto') {
    if (formats.supportsAVIF) {
      selectedFormat = 'avif';
    } else if (formats.supportsWebP) {
      selectedFormat = 'webp';
    } else {
      selectedFormat = formats.fallbackFormat;
    }
  }
  
  // This would typically generate different URLs for different formats/sizes
  // For now, return the base URI with parameters
  const params = new URLSearchParams();
  if (width) params.append('w', Math.round(width * density));
  if (height) params.append('h', Math.round(height * density));
  if (quality !== 0.8) params.append('q', Math.round(quality * 100));
  if (selectedFormat !== 'jpeg') params.append('fm', selectedFormat);
  
  const separator = baseUri.includes('?') ? '&' : '?';
  return `${baseUri}${params.toString() ? separator + params.toString() : ''}`;
};

/**
 * Image performance analytics
 */
export const trackImagePerformance = (imageUri, metrics) => {
  if (__DEV__) {
    console.log(`🖼️ Image Performance - ${imageUri}:`, {
      loadTime: `${metrics.loadTime?.toFixed(2)}ms`,
      size: `${(metrics.size / 1024).toFixed(2)}KB`,
      dimensions: `${metrics.width}x${metrics.height}`,
      cached: metrics.cached ? 'Yes' : 'No',
    });
  }
};

export default {
  OptimizedImage,
  LazyImage,
  preloadImages,
  calculateOptimalSize,
  generateImageSizes,
  getOptimalQuality,
  generateImageSource,
  trackImagePerformance,
  imageCache,
};
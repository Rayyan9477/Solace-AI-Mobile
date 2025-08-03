const fs = require("fs").promises;
const path = require("path");

class FigmaComponentAnalyzer {
  constructor() {
    this.designTokens = {
      colors: new Map(),
      typography: new Map(),
      spacing: new Map(),
      borderRadius: new Map(),
      shadows: new Map(),
    };
  }

  async analyzeFigmaData() {
    try {
      console.log("🔍 Analyzing Figma component data...");

      const figmaDataPath = path.join(__dirname, "..", "figma-data.json");
      const rawData = await fs.readFile(figmaDataPath, "utf8");
      const figmaData = JSON.parse(rawData);

      // Recursively analyze the document
      await this.analyzeNode(figmaData.document);

      // Convert Maps to Objects for JSON serialization
      const tokens = {
        colors: Object.fromEntries(this.designTokens.colors),
        typography: Object.fromEntries(this.designTokens.typography),
        spacing: Object.fromEntries(this.designTokens.spacing),
        borderRadius: Object.fromEntries(this.designTokens.borderRadius),
        shadows: Object.fromEntries(this.designTokens.shadows),
      };

      console.log("✅ Analysis complete!");
      console.log("📊 Found tokens:", {
        colors: this.designTokens.colors.size,
        typography: this.designTokens.typography.size,
        spacing: this.designTokens.spacing.size,
        borderRadius: this.designTokens.borderRadius.size,
        shadows: this.designTokens.shadows.size,
      });

      return tokens;
    } catch (error) {
      console.error("❌ Error analyzing Figma data:", error);
      throw error;
    }
  }

  async analyzeNode(node, depth = 0) {
    if (!node) return;

    // Analyze current node
    this.extractDesignTokens(node, depth);

    // Recursively analyze children
    if (node.children && Array.isArray(node.children)) {
      for (const child of node.children) {
        await this.analyzeNode(child, depth + 1);
      }
    }
  }

  extractDesignTokens(node, depth) {
    const nodeName = node.name ? node.name.toLowerCase() : "";

    // Extract colors from fills
    if (node.fills && Array.isArray(node.fills)) {
      for (const fill of node.fills) {
        if (fill.type === "SOLID" && fill.color) {
          const hexColor = this.rgbToHex(fill.color);
          const colorKey = this.generateColorKey(nodeName, hexColor);
          this.designTokens.colors.set(colorKey, hexColor);
        }
      }
    }

    // Extract colors from strokes
    if (node.strokes && Array.isArray(node.strokes)) {
      for (const stroke of node.strokes) {
        if (stroke.type === "SOLID" && stroke.color) {
          const hexColor = this.rgbToHex(stroke.color);
          const colorKey = this.generateColorKey(
            `${nodeName}_stroke`,
            hexColor,
          );
          this.designTokens.colors.set(colorKey, hexColor);
        }
      }
    }

    // Extract typography from text nodes
    if (node.type === "TEXT" && node.style) {
      const style = node.style;
      const typographyKey = this.sanitizeTokenName(nodeName || "text");

      this.designTokens.typography.set(typographyKey, {
        fontFamily: style.fontFamily || "System",
        fontSize: style.fontSize || 16,
        fontWeight: this.convertFontWeight(style.fontWeight),
        lineHeight: style.lineHeightPx || style.fontSize * 1.2,
        letterSpacing: style.letterSpacing || 0,
      });
    }

    // Extract border radius
    if (node.cornerRadius && node.cornerRadius > 0) {
      const radiusKey = this.sanitizeTokenName(`${nodeName}_radius`);
      this.designTokens.borderRadius.set(radiusKey, node.cornerRadius);
    }

    // Extract spacing from layout properties
    if (node.absoluteBoundingBox) {
      const box = node.absoluteBoundingBox;
      if (box.width && box.width > 0 && box.width < 200) {
        // Likely spacing value
        const spacingKey = this.sanitizeTokenName(`${nodeName}_width`);
        this.designTokens.spacing.set(spacingKey, Math.round(box.width));
      }
      if (box.height && box.height > 0 && box.height < 200) {
        // Likely spacing value
        const spacingKey = this.sanitizeTokenName(`${nodeName}_height`);
        this.designTokens.spacing.set(spacingKey, Math.round(box.height));
      }
    }

    // Extract shadows
    if (node.effects && Array.isArray(node.effects)) {
      for (const effect of node.effects) {
        if (effect.type === "DROP_SHADOW") {
          const shadowKey = this.sanitizeTokenName(`${nodeName}_shadow`);
          this.designTokens.shadows.set(shadowKey, {
            offsetX: effect.offset?.x || 0,
            offsetY: effect.offset?.y || 0,
            blurRadius: effect.radius || 0,
            color: effect.color ? this.rgbToHex(effect.color) : "#000000",
            opacity: effect.color?.a || 1,
          });
        }
      }
    }
  }

  generateColorKey(nodeName, hexColor) {
    // Try to categorize colors by their usage context
    const lowerName = nodeName.toLowerCase();

    if (lowerName.includes("primary") || lowerName.includes("main")) {
      return `primary_${hexColor.slice(1)}`;
    } else if (lowerName.includes("secondary")) {
      return `secondary_${hexColor.slice(1)}`;
    } else if (lowerName.includes("background") || lowerName.includes("bg")) {
      return `background_${hexColor.slice(1)}`;
    } else if (lowerName.includes("text") || lowerName.includes("title")) {
      return `text_${hexColor.slice(1)}`;
    } else if (lowerName.includes("border")) {
      return `border_${hexColor.slice(1)}`;
    } else if (lowerName.includes("blue")) {
      return `blue_${hexColor.slice(1)}`;
    } else if (lowerName.includes("teal") || lowerName.includes("cyan")) {
      return `teal_${hexColor.slice(1)}`;
    } else if (lowerName.includes("gray") || lowerName.includes("grey")) {
      return `gray_${hexColor.slice(1)}`;
    } else if (lowerName.includes("red")) {
      return `red_${hexColor.slice(1)}`;
    } else if (lowerName.includes("green")) {
      return `green_${hexColor.slice(1)}`;
    } else if (lowerName.includes("orange")) {
      return `orange_${hexColor.slice(1)}`;
    } else if (lowerName.includes("purple")) {
      return `purple_${hexColor.slice(1)}`;
    } else {
      return `color_${hexColor.slice(1)}`;
    }
  }

  sanitizeTokenName(name) {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "_")
      .replace(/_+/g, "_")
      .replace(/^_|_$/g, "");
  }

  rgbToHex(rgb) {
    const r = Math.round(rgb.r * 255);
    const g = Math.round(rgb.g * 255);
    const b = Math.round(rgb.b * 255);
    return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`.toUpperCase();
  }

  convertFontWeight(figmaWeight) {
    const weightMap = {
      100: "100",
      200: "200",
      300: "300",
      400: "400",
      500: "500",
      600: "600",
      700: "700",
      800: "800",
      900: "900",
      Thin: "100",
      "Extra Light": "200",
      Light: "300",
      Regular: "400",
      Medium: "500",
      "Semi Bold": "600",
      Bold: "700",
      "Extra Bold": "800",
      Black: "900",
    };

    return weightMap[figmaWeight] || "400";
  }

  async generateFinalTheme(tokens) {
    console.log("📝 Generating final integrated theme...");

    // Create a comprehensive theme that merges Figma tokens with our existing theme
    const themeContent = `// Final Figma Integration for Solace AI Mobile
// Generated: ${new Date().toISOString()}
// Analyzed ${Object.keys(tokens.colors).length} colors from Figma components

// Extracted Figma Design Tokens
export const figmaTokens = ${JSON.stringify(tokens, null, 2)};

// Import existing theme
import { 
  colors as baseColors, 
  typography as baseTypography,
  spacing as baseSpacing,
  borderRadius as baseBorderRadius,
  shadows as baseShadows 
} from './theme';

// Create intelligent color mapping
const createColorMapping = (figmaColors) => {
  const mapping = {
    primary: {},
    secondary: {},
    therapeutic: {
      calming: {},
      nurturing: {},
      peaceful: {},
      grounding: {},
      energizing: {},
    },
    ui: {},
  };

  // Map colors intelligently based on their hex values and names
  Object.entries(figmaColors).forEach(([key, value]) => {
    if (key.includes('blue')) {
      mapping.therapeutic.calming[key] = value;
      mapping.primary[key] = value;
    } else if (key.includes('teal') || key.includes('cyan')) {
      mapping.therapeutic.nurturing[key] = value;
      mapping.secondary[key] = value;
    } else if (key.includes('gray')) {
      mapping.therapeutic.peaceful[key] = value;
      mapping.ui[key] = value;
    } else if (key.includes('purple')) {
      mapping.therapeutic.grounding[key] = value;
    } else if (key.includes('orange') || key.includes('yellow')) {
      mapping.therapeutic.energizing[key] = value;
    } else if (key.includes('text')) {
      mapping.ui[key] = value;
    } else if (key.includes('background')) {
      mapping.ui[key] = value;
    }
  });

  return mapping;
};

const colorMapping = createColorMapping(figmaTokens.colors);

// Final integrated theme
export const integratedTheme = {
  colors: {
    ...baseColors,
    
    // Enhance with Figma colors while maintaining our therapeutic structure
    therapeutic: {
      ...baseColors.therapeutic,
      calming: {
        ...baseColors.therapeutic.calming,
        // Add Figma blue tones
        ...Object.fromEntries(
          Object.entries(colorMapping.therapeutic.calming).slice(0, 5).map(([k, v], i) => [
            [\`figma_\${i + 1}\`, v]
          ]).flat().reduce((acc, [k, v], i, arr) => {
            if (i % 2 === 0) acc.push([arr[i], arr[i + 1]]);
            return acc;
          }, [])
        ),
      },
      nurturing: {
        ...baseColors.therapeutic.nurturing,
        // Add Figma teal tones
        ...Object.fromEntries(
          Object.entries(colorMapping.therapeutic.nurturing).slice(0, 5).map(([k, v], i) => [
            [\`figma_\${i + 1}\`, v]
          ]).flat().reduce((acc, [k, v], i, arr) => {
            if (i % 2 === 0) acc.push([arr[i], arr[i + 1]]);
            return acc;
          }, [])
        ),
      },
      peaceful: {
        ...baseColors.therapeutic.peaceful,
        // Add Figma gray tones
        ...Object.fromEntries(
          Object.entries(colorMapping.therapeutic.peaceful).slice(0, 5).map(([k, v], i) => [
            [\`figma_\${i + 1}\`, v]
          ]).flat().reduce((acc, [k, v], i, arr) => {
            if (i % 2 === 0) acc.push([arr[i], arr[i + 1]]);
            return acc;
          }, [])
        ),
      },
    },
    
    // Add Figma-specific colors for direct access
    figma: figmaTokens.colors,
  },
  
  typography: {
    ...baseTypography,
    
    // Add Figma typography tokens
    figma: figmaTokens.typography,
    
    // Create enhanced typography scale
    sizes: {
      ...baseTypography.sizes,
      // Add any unique Figma font sizes
      ...Object.fromEntries(
        Object.entries(figmaTokens.typography)
          .filter(([k, v]) => v.fontSize)
          .map(([k, v]) => [\`figma_\${k}\`, v.fontSize])
      ),
    },
  },
  
  spacing: {
    ...baseSpacing,
    
    // Add Figma spacing tokens
    figma: figmaTokens.spacing,
  },
  
  borderRadius: {
    ...baseBorderRadius,
    
    // Add Figma border radius tokens
    figma: figmaTokens.borderRadius,
  },
  
  shadows: {
    ...baseShadows,
    
    // Add Figma shadow tokens
    figma: figmaTokens.shadows,
  },
};

// Export utility functions for using Figma tokens
export const getFigmaColor = (colorKey) => {
  return figmaTokens.colors[colorKey] || null;
};

export const getFigmaTypography = (typographyKey) => {
  return figmaTokens.typography[typographyKey] || null;
};

export const getFigmaSpacing = (spacingKey) => {
  return figmaTokens.spacing[spacingKey] || null;
};

// Validation function
export const validateFigmaIntegration = () => {
  const validation = {
    colorsExtracted: Object.keys(figmaTokens.colors).length > 0,
    typographyExtracted: Object.keys(figmaTokens.typography).length > 0,
    spacingExtracted: Object.keys(figmaTokens.spacing).length > 0,
    borderRadiusExtracted: Object.keys(figmaTokens.borderRadius).length > 0,
    shadowsExtracted: Object.keys(figmaTokens.shadows).length > 0,
  };
  
  const totalChecks = Object.values(validation).length;
  const passedChecks = Object.values(validation).filter(Boolean).length;
  validation.score = (passedChecks / totalChecks) * 100;
  
  return validation;
};

export default integratedTheme;
`;

    await fs.writeFile(
      path.join(__dirname, "..", "src", "styles", "figmaIntegratedTheme.js"),
      themeContent,
      "utf8",
    );

    console.log("✅ Final integrated theme generated successfully");
  }

  async integrate() {
    try {
      console.log("🚀 Starting comprehensive Figma component analysis...");

      // 1. Analyze all components and extract tokens
      const tokens = await this.analyzeFigmaData();

      // 2. Generate final integrated theme
      await this.generateFinalTheme(tokens);

      // 3. Save analysis results
      await fs.writeFile(
        path.join(__dirname, "..", "figma-analysis.json"),
        JSON.stringify(tokens, null, 2),
        "utf8",
      );

      console.log("🎉 Figma component analysis completed successfully!");

      return tokens;
    } catch (error) {
      console.error("💥 Figma component analysis failed:", error);
      throw error;
    }
  }
}

// Run integration if called directly
if (require.main === module) {
  const analyzer = new FigmaComponentAnalyzer();
  analyzer.integrate().catch(console.error);
}

module.exports = FigmaComponentAnalyzer;

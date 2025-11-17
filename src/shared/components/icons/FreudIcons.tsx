/**
 * FreudIcons - Specialized icons for Freud/Solace branding
 * Custom branded icons for the mental health app
 */

import PropTypes from "prop-types";
import React from "react";
import { Text, View } from "react-native";
import Svg, { Circle } from "react-native-svg";

/**
 * FreudDiamondLogo - 4-dot diamond logo for freud.ai
 * SVG-based brand logo matching design specifications
 */
export const FreudDiamondLogo = ({ size = 60, color = "#A67C52" }) => {
  const dotRadius = size * 0.1;
  const spacing = size * 0.3;

  return (
    <View style={{ width: size, height: size, justifyContent: "center", alignItems: "center" }}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Top dot */}
        <Circle cx={size / 2} cy={size / 2 - spacing} r={dotRadius} fill={color} />
        {/* Right dot */}
        <Circle cx={size / 2 + spacing} cy={size / 2} r={dotRadius} fill={color} />
        {/* Bottom dot */}
        <Circle cx={size / 2} cy={size / 2 + spacing} r={dotRadius} fill={color} />
        {/* Left dot */}
        <Circle cx={size / 2 - spacing} cy={size / 2} r={dotRadius} fill={color} />
      </Svg>
    </View>
  );
};

FreudDiamondLogo.propTypes = {
  size: PropTypes.number,
  color: PropTypes.string,
};

/**
 * FreudLogo - Simple text-based logo component
 * Can be replaced with actual logo asset
 */
export const FreudLogo = ({
  size = 32,
  color = "#000000",
  primaryColor,
  style,
}) => {
  // Use primaryColor if provided, otherwise use color
  const displayColor = primaryColor || color;

  return (
    <Text
      style={[
        {
          fontSize: size,
          color: displayColor,
          fontWeight: "bold",
        },
        style,
      ]}
    >
      🧠
    </Text>
  );
};

FreudLogo.propTypes = {
  size: PropTypes.number,
  color: PropTypes.string,
  primaryColor: PropTypes.string,
  style: PropTypes.object,
};

/**
 * SolaceLogo - Alternative logo component
 */
export const SolaceLogo = ({ size = 32, color = "#000000", style }) => {
  return (
    <Text
      style={[
        {
          fontSize: size,
          color,
          fontWeight: "bold",
        },
        style,
      ]}
    >
      ☮️
    </Text>
  );
};

SolaceLogo.propTypes = {
  size: PropTypes.number,
  color: PropTypes.string,
  style: PropTypes.object,
};

export default {
  FreudDiamondLogo,
  FreudLogo,
  SolaceLogo,
};

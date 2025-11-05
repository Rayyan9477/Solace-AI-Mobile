/**
 * FreudIcons - Specialized icons for Freud/Solace branding
 * Custom branded icons for the mental health app
 */

import PropTypes from "prop-types";
import React from "react";
import { Text } from "react-native";

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
  FreudLogo,
  SolaceLogo,
};

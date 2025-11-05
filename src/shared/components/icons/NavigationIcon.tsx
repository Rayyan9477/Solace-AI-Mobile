/**
 * NavigationIcon Component
 * Specialized wrapper for navigation-related icons
 * Extends MentalHealthIcon for navigation use cases
 */

import PropTypes from "prop-types";
import React from "react";

import MentalHealthIcon from "./MentalHealthIcon";

/**
 * NavigationIcon - Convenience wrapper for navigation icons
 * Maps common navigation actions to appropriate icons
 */
const NavigationIcon = ({ name, ...props }) => {
  // Map navigation-specific names if needed
  const iconMap = {
    back: "ArrowBack",
    forward: "ArrowForward",
    home: "Home",
    close: "Close",
    menu: "Menu",
  };

  const mappedName = iconMap[name?.toLowerCase()] || name;

  return <MentalHealthIcon name={mappedName} {...props} />;
};

NavigationIcon.propTypes = {
  name: PropTypes.string.isRequired,
  size: PropTypes.number,
  color: PropTypes.string,
  variant: PropTypes.oneOf(["filled", "outline"]),
  style: PropTypes.object,
};

export default NavigationIcon;

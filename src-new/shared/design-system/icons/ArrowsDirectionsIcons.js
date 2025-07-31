import React from 'react';
import PropTypes from 'prop-types';
import Svg, { 
  Path, 
  Circle, 
  Line, 
  Polyline, 
  Polygon,
  G,
} from 'react-native-svg';
import { BaseDesignTokens } from '../../design-system/DesignTokens';

// Base Arrows and Directions Icon Component
const ArrowDirectionIcon = ({ 
  name, 
  size = 24, 
  color, 
  therapeuticTheme = 'focus',
  variant = 'outline',
  strokeWidth = 2,
  style,
  testID 
}) => {
  const tokens = BaseDesignTokens;
  
  const getColor = () => {
    if (color) return color;
    
    if (therapeuticTheme) {
      const therapeuticColors = tokens.colors.therapeutic[therapeuticTheme];
      return therapeuticColors?.[600] || tokens.colors.primary[600];
    }
    
    return tokens.colors.primary[600];
  };

  const iconColor = getColor();
  const fillColor = variant === 'filled' ? iconColor : 'none';
  const strokeColor = variant === 'filled' ? 'none' : iconColor;

  const renderIcon = () => {
    switch (name) {
      // Basic Directional Arrows
      case 'arrow-up':
        return (
          <G>
            <Line x1="12" y1="19" x2="12" y2="5" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
            <Polyline points="5,12 12,5 19,12" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
          </G>
        );

      case 'arrow-down':
        return (
          <G>
            <Line x1="12" y1="5" x2="12" y2="19" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
            <Polyline points="19,12 12,19 5,12" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
          </G>
        );

      case 'arrow-left':
        return (
          <G>
            <Line x1="19" y1="12" x2="5" y2="12" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
            <Polyline points="12,19 5,12 12,5" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
          </G>
        );

      case 'arrow-right':
        return (
          <G>
            <Line x1="5" y1="12" x2="19" y2="12" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
            <Polyline points="12,5 19,12 12,19" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
          </G>
        );

      // Diagonal Arrows
      case 'arrow-up-right':
        return (
          <G>
            <Line x1="7" y1="17" x2="17" y2="7" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
            <Polyline points="7,7 17,7 17,17" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
          </G>
        );

      case 'arrow-up-left':
        return (
          <G>
            <Line x1="17" y1="17" x2="7" y2="7" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
            <Polyline points="17,7 7,7 7,17" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
          </G>
        );

      case 'arrow-down-right':
        return (
          <G>
            <Line x1="7" y1="7" x2="17" y2="17" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
            <Polyline points="17,7 17,17 7,17" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
          </G>
        );

      case 'arrow-down-left':
        return (
          <G>
            <Line x1="17" y1="7" x2="7" y2="17" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
            <Polyline points="7,7 7,17 17,17" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
          </G>
        );

      // Chevron Arrows (more compact)
      case 'chevron-up':
        return (
          <G>
            <Polyline points="18,15 12,9 6,15" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
          </G>
        );

      case 'chevron-down':
        return (
          <G>
            <Polyline points="6,9 12,15 18,9" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
          </G>
        );

      case 'chevron-left':
        return (
          <G>
            <Polyline points="15,18 9,12 15,6" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
          </G>
        );

      case 'chevron-right':
        return (
          <G>
            <Polyline points="9,18 15,12 9,6" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
          </G>
        );

      // Double Chevrons
      case 'chevrons-up':
        return (
          <G>
            <Polyline points="17,11 12,6 7,11" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
            <Polyline points="17,18 12,13 7,18" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
          </G>
        );

      case 'chevrons-down':
        return (
          <G>
            <Polyline points="7,13 12,18 17,13" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
            <Polyline points="7,6 12,11 17,6" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
          </G>
        );

      case 'chevrons-left':
        return (
          <G>
            <Polyline points="11,17 6,12 11,7" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
            <Polyline points="18,17 13,12 18,7" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
          </G>
        );

      case 'chevrons-right':
        return (
          <G>
            <Polyline points="13,17 18,12 13,7" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
            <Polyline points="6,17 11,12 6,7" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
          </G>
        );

      // Circular Arrows (refresh, rotate)
      case 'refresh-cw':
        return (
          <G>
            <Polyline points="23,4 23,10 17,10" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
            <Polyline points="1,20 1,14 7,14" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4-4.64 4.36A9 9 0 0 1 3.51 15" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
          </G>
        );

      case 'refresh-ccw':
        return (
          <G>
            <Polyline points="1,4 1,10 7,10" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
            <Polyline points="23,20 23,14 17,14" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
          </G>
        );

      case 'rotate-cw':
        return (
          <G>
            <Polyline points="23,4 23,10 17,10" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M20.49 9A9 9 0 1 0 5.64 5.64L1 10" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
          </G>
        );

      case 'rotate-ccw':
        return (
          <G>
            <Polyline points="1,4 1,10 7,10" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M3.51 9a9 9 0 1 1 14.85-3.36L23 10" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
          </G>
        );

      // Corner/Turn Arrows
      case 'corner-up-left':
        return (
          <G>
            <Polyline points="9,14 4,9 9,4" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M20 20v-7a4 4 0 0 0-4-4H4" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
          </G>
        );

      case 'corner-up-right':
        return (
          <G>
            <Polyline points="15,14 20,9 15,4" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M4 20v-7a4 4 0 0 1 4-4h12" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
          </G>
        );

      case 'corner-down-left':
        return (
          <G>
            <Polyline points="9,10 4,15 9,20" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M20 4v7a4 4 0 0 1-4 4H4" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
          </G>
        );

      case 'corner-down-right':
        return (
          <G>
            <Polyline points="15,10 20,15 15,20" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M4 4v7a4 4 0 0 0 4 4h12" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
          </G>
        );

      // Navigation Arrows
      case 'navigation':
        return (
          <G>
            <Polygon points="3,11 22,2 13,21 11,13 3,11" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
          </G>
        );

      case 'compass':
        return (
          <G>
            <Circle cx="12" cy="12" r="10" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth} />
            <Polygon points="16.24,7.76 14.12,14.12 7.76,16.24 9.88,9.88 16.24,7.76" fill={variant === 'filled' ? '#FFFFFF' : fillColor} stroke={variant === 'filled' ? '#FFFFFF' : strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
          </G>
        );

      // Move/Drag Icons
      case 'move':
        return (
          <G>
            <Polyline points="5,9 2,12 5,15" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
            <Polyline points="9,5 12,2 15,5" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
            <Polyline points="15,19 12,22 9,19" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
            <Polyline points="19,9 22,12 19,15" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
            <Line x1="2" y1="12" x2="22" y2="12" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" />
            <Line x1="12" y1="2" x2="12" y2="22" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" />
          </G>
        );

      case 'drag':
        return (
          <G>
            <Circle cx="9" cy="12" r="1" fill={strokeColor} />
            <Circle cx="15" cy="12" r="1" fill={strokeColor} />
            <Circle cx="9" cy="6" r="1" fill={strokeColor} />
            <Circle cx="15" cy="6" r="1" fill={strokeColor} />
            <Circle cx="9" cy="18" r="1" fill={strokeColor} />
            <Circle cx="15" cy="18" r="1" fill={strokeColor} />
          </G>
        );

      // Expand/Collapse
      case 'expand':
        return (
          <G>
            <Polyline points="15,3 21,3 21,9" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
            <Polyline points="9,21 3,21 3,15" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
            <Line x1="21" y1="3" x2="14" y2="10" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" />
            <Line x1="3" y1="21" x2="10" y2="14" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" />
          </G>
        );

      case 'collapse':
        return (
          <G>
            <Polyline points="10,3 4,3 4,9" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
            <Polyline points="14,21 20,21 20,15" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
            <Line x1="4" y1="3" x2="11" y2="10" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" />
            <Line x1="20" y1="21" x2="13" y2="14" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" />
          </G>
        );

      // Back/Forward Navigation
      case 'back':
        return (
          <G>
            <Polyline points="15,18 9,12 15,6" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
          </G>
        );

      case 'forward':
        return (
          <G>
            <Polyline points="9,18 15,12 9,6" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
          </G>
        );

      // Skip/Jump
      case 'skip-back':
        return (
          <G>
            <Polygon points="19,20 9,12 19,4 19,20" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
            <Line x1="5" y1="19" x2="5" y2="5" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" />
          </G>
        );

      case 'skip-forward':
        return (
          <G>
            <Polygon points="5,4 15,12 5,20 5,4" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
            <Line x1="19" y1="5" x2="19" y2="19" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" />
          </G>
        );

      // Default fallback
      default:
        return (
          <G>
            <Line x1="5" y1="12" x2="19" y2="12" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
            <Polyline points="12,5 19,12 12,19" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
          </G>
        );
    }
  };

  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      style={style}
      testID={testID || `arrow-direction-icon-${name}`}
    >
      {renderIcon()}
    </Svg>
  );
};

// Specialized Arrow and Direction Icon Components
export const ArrowUpIcon = (props) => <ArrowDirectionIcon name="arrow-up" {...props} />;
export const ArrowDownIcon = (props) => <ArrowDirectionIcon name="arrow-down" {...props} />;
export const ArrowLeftIcon = (props) => <ArrowDirectionIcon name="arrow-left" {...props} />;
export const ArrowRightIcon = (props) => <ArrowDirectionIcon name="arrow-right" {...props} />;
export const ArrowUpRightIcon = (props) => <ArrowDirectionIcon name="arrow-up-right" {...props} />;
export const ArrowUpLeftIcon = (props) => <ArrowDirectionIcon name="arrow-up-left" {...props} />;
export const ArrowDownRightIcon = (props) => <ArrowDirectionIcon name="arrow-down-right" {...props} />;
export const ArrowDownLeftIcon = (props) => <ArrowDirectionIcon name="arrow-down-left" {...props} />;
export const ChevronUpIcon = (props) => <ArrowDirectionIcon name="chevron-up" {...props} />;
export const ChevronDownIcon = (props) => <ArrowDirectionIcon name="chevron-down" {...props} />;
export const ChevronLeftIcon = (props) => <ArrowDirectionIcon name="chevron-left" {...props} />;
export const ChevronRightIcon = (props) => <ArrowDirectionIcon name="chevron-right" {...props} />;
export const ChevronsUpIcon = (props) => <ArrowDirectionIcon name="chevrons-up" {...props} />;
export const ChevronsDownIcon = (props) => <ArrowDirectionIcon name="chevrons-down" {...props} />;
export const ChevronsLeftIcon = (props) => <ArrowDirectionIcon name="chevrons-left" {...props} />;
export const ChevronsRightIcon = (props) => <ArrowDirectionIcon name="chevrons-right" {...props} />;
export const RefreshCwIcon = (props) => <ArrowDirectionIcon name="refresh-cw" {...props} />;
export const RefreshCcwIcon = (props) => <ArrowDirectionIcon name="refresh-ccw" {...props} />;
export const RotateCwIcon = (props) => <ArrowDirectionIcon name="rotate-cw" {...props} />;
export const RotateCcwIcon = (props) => <ArrowDirectionIcon name="rotate-ccw" {...props} />;
export const CornerUpLeftIcon = (props) => <ArrowDirectionIcon name="corner-up-left" {...props} />;
export const CornerUpRightIcon = (props) => <ArrowDirectionIcon name="corner-up-right" {...props} />;
export const CornerDownLeftIcon = (props) => <ArrowDirectionIcon name="corner-down-left" {...props} />;
export const CornerDownRightIcon = (props) => <ArrowDirectionIcon name="corner-down-right" {...props} />;
export const NavigationIcon = (props) => <ArrowDirectionIcon name="navigation" {...props} />;
export const CompassIcon = (props) => <ArrowDirectionIcon name="compass" {...props} />;
export const MoveIcon = (props) => <ArrowDirectionIcon name="move" {...props} />;
export const DragIcon = (props) => <ArrowDirectionIcon name="drag" {...props} />;
export const ExpandIcon = (props) => <ArrowDirectionIcon name="expand" {...props} />;
export const CollapseIcon = (props) => <ArrowDirectionIcon name="collapse" {...props} />;
export const BackIcon = (props) => <ArrowDirectionIcon name="back" {...props} />;
export const ForwardIcon = (props) => <ArrowDirectionIcon name="forward" {...props} />;
export const SkipBackIcon = (props) => <ArrowDirectionIcon name="skip-back" {...props} />;
export const SkipForwardIcon = (props) => <ArrowDirectionIcon name="skip-forward" {...props} />;

// Arrow and Direction Icon Collection
export const ArrowDirectionIconCollection = {
  // Basic Arrows
  arrowUp: ArrowUpIcon,
  arrowDown: ArrowDownIcon,
  arrowLeft: ArrowLeftIcon,
  arrowRight: ArrowRightIcon,
  
  // Diagonal Arrows
  arrowUpRight: ArrowUpRightIcon,
  arrowUpLeft: ArrowUpLeftIcon,
  arrowDownRight: ArrowDownRightIcon,
  arrowDownLeft: ArrowDownLeftIcon,
  
  // Chevrons
  chevronUp: ChevronUpIcon,
  chevronDown: ChevronDownIcon,
  chevronLeft: ChevronLeftIcon,
  chevronRight: ChevronRightIcon,
  chevronsUp: ChevronsUpIcon,
  chevronsDown: ChevronsDownIcon,
  chevronsLeft: ChevronsLeftIcon,
  chevronsRight: ChevronsRightIcon,
  
  // Circular Arrows
  refreshCw: RefreshCwIcon,
  refreshCcw: RefreshCcwIcon,
  rotateCw: RotateCwIcon,
  rotateCcw: RotateCcwIcon,
  
  // Corner Arrows
  cornerUpLeft: CornerUpLeftIcon,
  cornerUpRight: CornerUpRightIcon,
  cornerDownLeft: CornerDownLeftIcon,
  cornerDownRight: CornerDownRightIcon,
  
  // Navigation
  navigation: NavigationIcon,
  compass: CompassIcon,
  move: MoveIcon,
  drag: DragIcon,
  expand: ExpandIcon,
  collapse: CollapseIcon,
  back: BackIcon,
  forward: ForwardIcon,
  skipBack: SkipBackIcon,
  skipForward: SkipForwardIcon,
};

// PropTypes
ArrowDirectionIcon.propTypes = {
  name: PropTypes.string.isRequired,
  size: PropTypes.number,
  color: PropTypes.string,
  therapeuticTheme: PropTypes.oneOf([
    'calming', 'nurturing', 'peaceful', 'grounding', 
    'energizing', 'focus', 'mindful', 'balance'
  ]),
  variant: PropTypes.oneOf(['outline', 'filled']),
  strokeWidth: PropTypes.number,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  testID: PropTypes.string,
};

export default ArrowDirectionIcon;
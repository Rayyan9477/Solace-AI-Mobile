import React from 'react';
import PropTypes from 'prop-types';
import Svg, { 
  Path, 
  Circle, 
  Rect, 
  Line, 
  Polyline, 
  Polygon,
  G,
  Defs,
  LinearGradient,
  Stop,
} from 'react-native-svg';
import { BaseDesignTokens } from '../../design-system/DesignTokens';

// Base Data Visualization Icon Component
const DataVisualizationIcon = ({ 
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
      // Charts and Graphs
      case 'bar-chart':
        return (
          <G>
            <Line x1="12" y1="20" x2="12" y2="10" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" />
            <Line x1="18" y1="20" x2="18" y2="4" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" />
            <Line x1="6" y1="20" x2="6" y2="16" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" />
            <Circle cx="6" cy="14" r="2" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth} />
            <Circle cx="12" cy="8" r="2" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth} />
            <Circle cx="18" cy="2" r="2" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth} />
          </G>
        );

      case 'line-chart':
        return (
          <G>
            <Polyline
              points="3,17 6,11 10,16 14,6 17,11 21,7"
              fill="none"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Circle cx="3" cy="17" r="1.5" fill={strokeColor} />
            <Circle cx="6" cy="11" r="1.5" fill={strokeColor} />
            <Circle cx="10" cy="16" r="1.5" fill={strokeColor} />
            <Circle cx="14" cy="6" r="1.5" fill={strokeColor} />
            <Circle cx="17" cy="11" r="1.5" fill={strokeColor} />
            <Circle cx="21" cy="7" r="1.5" fill={strokeColor} />
          </G>
        );

      case 'area-chart':
        return (
          <G>
            <Defs>
              <LinearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <Stop offset="0%" stopColor={strokeColor} stopOpacity="0.3" />
                <Stop offset="100%" stopColor={strokeColor} stopOpacity="0.1" />
              </LinearGradient>
            </Defs>
            <Path
              d="M3 17L6 11L10 16L14 6L17 11L21 7V20H3V17Z"
              fill="url(#areaGradient)"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Polyline
              points="3,17 6,11 10,16 14,6 17,11 21,7"
              fill="none"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </G>
        );

      case 'pie-chart':
        return (
          <G>
            <Circle cx="12" cy="12" r="9" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth} />
            <Path
              d="M12 3V12L21 12"
              fill="none"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Path
              d="M12 3A9 9 0 0 1 21 12"
              fill={variant === 'filled' ? 'rgba(255,255,255,0.2)' : 'none'}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
          </G>
        );

      case 'donut-chart':
        return (
          <G>
            <Circle cx="12" cy="12" r="9" fill="none" stroke={strokeColor} strokeWidth={strokeWidth} />
            <Circle cx="12" cy="12" r="5" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth} />
            <Path
              d="M12 3A9 9 0 0 1 21 12"
              fill="none"
              stroke={strokeColor}
              strokeWidth={strokeWidth * 2}
              strokeLinecap="round"
            />
            <Path
              d="M21 12A9 9 0 0 1 12 21"
              fill="none"
              stroke={strokeColor}
              strokeWidth={strokeWidth * 1.5}
              strokeLinecap="round"
              strokeOpacity="0.7"
            />
          </G>
        );

      case 'scatter-plot':
        return (
          <G>
            <Circle cx="6" cy="16" r="2" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth} />
            <Circle cx="9" cy="12" r="2" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth} />
            <Circle cx="12" cy="8" r="2" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth} />
            <Circle cx="15" cy="14" r="2" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth} />
            <Circle cx="18" cy="6" r="2" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth} />
            <Circle cx="8" cy="18" r="1.5" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth} />
            <Circle cx="14" cy="10" r="1.5" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth} />
            <Circle cx="20" cy="15" r="1.5" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth} />
          </G>
        );

      // Progress and Analytics
      case 'progress-ring':
        return (
          <G>
            <Circle
              cx="12"
              cy="12"
              r="8"
              fill="none"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeOpacity="0.2"
            />
            <Path
              d="M12 4A8 8 0 0 1 20 12"
              fill="none"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
            <Circle cx="12" cy="12" r="3" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth} />
            <Circle cx="12" cy="12" r="1" fill={strokeColor} />
          </G>
        );

      case 'progress-bar':
        return (
          <G>
            <Rect x="3" y="10" width="18" height="4" rx="2" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth} />
            <Rect x="3" y="10" width="12" height="4" rx="2" fill={strokeColor} />
            <Circle cx="15" cy="12" r="3" fill="none" stroke={strokeColor} strokeWidth={strokeWidth} />
            <Circle cx="15" cy="12" r="1" fill={strokeColor} />
          </G>
        );

      case 'analytics':
        return (
          <G>
            <Path
              d="M3 3v18h18"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Path
              d="M7 12l3-3 4 4 5-5"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Circle cx="7" cy="12" r="1.5" fill={strokeColor} />
            <Circle cx="10" cy="9" r="1.5" fill={strokeColor} />
            <Circle cx="14" cy="13" r="1.5" fill={strokeColor} />
            <Circle cx="19" cy="8" r="1.5" fill={strokeColor} />
          </G>
        );

      case 'trending-up':
        return (
          <G>
            <Polyline
              points="22,12 18,8 13,13 2,2"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Polyline
              points="16,8 22,8 22,14"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </G>
        );

      case 'trending-down':
        return (
          <G>
            <Polyline
              points="22,12 18,16 13,11 2,22"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Polyline
              points="16,16 22,16 22,10"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </G>
        );

      // Mental Health Data Visualization
      case 'mood-graph':
        return (
          <G>
            <Rect x="2" y="2" width="20" height="16" rx="2" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth} />
            <Polyline
              points="5,14 8,8 11,12 14,6 17,10 20,7"
              fill="none"
              stroke={variant === 'filled' ? '#FFFFFF' : strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Circle cx="8" cy="8" r="1" fill={variant === 'filled' ? '#FFFFFF' : strokeColor} />
            <Circle cx="14" cy="6" r="1" fill={variant === 'filled' ? '#FFFFFF' : strokeColor} />
            <Line x1="12" y1="20" x2="12" y2="18" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" />
          </G>
        );

      case 'wellness-meter':
        return (
          <G>
            <Path
              d="M8 18A6 6 0 1 1 16 18"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
            />
            <Path
              d="M12 12L14.5 14.5"
              stroke={variant === 'filled' ? '#FFFFFF' : strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
            <Circle cx="12" cy="12" r="2" fill={variant === 'filled' ? '#FFFFFF' : fillColor} stroke={variant === 'filled' ? '#FFFFFF' : strokeColor} strokeWidth={strokeWidth} />
            <Circle cx="8" cy="15" r="1" fill={strokeColor} />
            <Circle cx="16" cy="15" r="1" fill={strokeColor} />
            <Circle cx="12" cy="9" r="1" fill={strokeColor} />
          </G>
        );

      case 'stress-level':
        return (
          <G>
            <Circle cx="12" cy="12" r="9" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth} />
            <Path
              d="M8 12c0-4 2-6 4-6s4 2 4 6"
              fill="none"
              stroke={variant === 'filled' ? '#FFFFFF' : strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
            <Path
              d="M9 16c1-2 2-3 3-3s2 1 3 3"
              stroke={variant === 'filled' ? '#FFFFFF' : strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
            <Circle cx="10" cy="10" r="1" fill={variant === 'filled' ? '#FFFFFF' : strokeColor} />
            <Circle cx="14" cy="10" r="1" fill={variant === 'filled' ? '#FFFFFF' : strokeColor} />
          </G>
        );

      // Data Tables and Lists  
      case 'data-table':
        return (
          <G>
            <Rect x="3" y="3" width="18" height="18" rx="2" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth} />
            <Line x1="3" y1="9" x2="21" y2="9" stroke={variant === 'filled' ? '#FFFFFF' : strokeColor} strokeWidth={strokeWidth} />
            <Line x1="9" y1="21" x2="9" y2="9" stroke={variant === 'filled' ? '#FFFFFF' : strokeColor} strokeWidth={strokeWidth} />
            <Line x1="15" y1="21" x2="15" y2="9" stroke={variant === 'filled' ? '#FFFFFF' : strokeColor} strokeWidth={strokeWidth} />
            <Circle cx="6" cy="6" r="1" fill={variant === 'filled' ? '#FFFFFF' : strokeColor} />
            <Circle cx="12" cy="6" r="1" fill={variant === 'filled' ? '#FFFFFF' : strokeColor} />
            <Circle cx="18" cy="6" r="1" fill={variant === 'filled' ? '#FFFFFF' : strokeColor} />
          </G>
        );

      case 'data-list':
        return (
          <G>
            <Line x1="8" y1="6" x2="21" y2="6" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" />
            <Line x1="8" y1="12" x2="21" y2="12" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" />
            <Line x1="8" y1="18" x2="21" y2="18" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" />
            <Circle cx="4" cy="6" r="2" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth} />
            <Circle cx="4" cy="12" r="2" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth} />
            <Circle cx="4" cy="18" r="2" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth} />
            <Circle cx="4" cy="6" r="0.5" fill={variant === 'filled' ? '#FFFFFF' : strokeColor} />
            <Circle cx="4" cy="12" r="0.5" fill={variant === 'filled' ? '#FFFFFF' : strokeColor} />
            <Circle cx="4" cy="18" r="0.5" fill={variant === 'filled' ? '#FFFFFF' : strokeColor} />
          </G>
        );

      // Statistical Icons
      case 'statistics':
        return (
          <G>
            <Path
              d="M3 3v18h18"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Rect x="7" y="12" width="2" height="6" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth} />
            <Rect x="11" y="8" width="2" height="10" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth} />
            <Rect x="15" y="10" width="2" height="8" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth} />
            <Rect x="19" y="6" width="2" height="12" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth} />
          </G>
        );

      case 'metrics':
        return (
          <G>
            <Circle cx="12" cy="12" r="9" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth} />
            <Path
              d="M8 12h8"
              stroke={variant === 'filled' ? '#FFFFFF' : strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
            <Path
              d="M12 8v8"
              stroke={variant === 'filled' ? '#FFFFFF' : strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
            <Path
              d="M16 8l-8 8"
              stroke={variant === 'filled' ? '#FFFFFF' : strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
            <Path
              d="M8 8l8 8"
              stroke={variant === 'filled' ? '#FFFFFF' : strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
          </G>
        );

      case 'dashboard-data':
        return (
          <G>
            <Rect x="3" y="3" width="7" height="9" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth} />
            <Rect x="14" y="3" width="7" height="5" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth} />
            <Rect x="14" y="12" width="7" height="9" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth} />
            <Rect x="3" y="16" width="7" height="5" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth} />
            <Line x1="5" y1="7" x2="8" y2="7" stroke={variant === 'filled' ? '#FFFFFF' : strokeColor} strokeWidth={strokeWidth} />
            <Line x1="16" y1="5" x2="19" y2="5" stroke={variant === 'filled' ? '#FFFFFF' : strokeColor} strokeWidth={strokeWidth} />
            <Circle cx="18" cy="16" r="1" fill={variant === 'filled' ? '#FFFFFF' : strokeColor} />
            <Circle cx="6" cy="18" r="1" fill={variant === 'filled' ? '#FFFFFF' : strokeColor} />
          </G>
        );

      // Comparison and Correlation
      case 'compare':
        return (
          <G>
            <Rect x="3" y="8" width="6" height="10" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth} />
            <Rect x="15" y="5" width="6" height="13" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth} />
            <Path
              d="M9 13h6"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
            <Polyline
              points="12,10 15,13 12,16"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </G>
        );

      case 'correlation':
        return (
          <G>
            <Circle cx="8" cy="8" r="5" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth} strokeOpacity="0.5" />
            <Circle cx="16" cy="16" r="5" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth} strokeOpacity="0.5" />
            <Path
              d="M11 11L13 13"
              stroke={strokeColor}
              strokeWidth={strokeWidth * 1.5}
              strokeLinecap="round"
            />
            <Circle cx="8" cy="8" r="2" fill={strokeColor} />
            <Circle cx="16" cy="16" r="2" fill={strokeColor} />
          </G>
        );

      // Health Data Specific
      case 'heart-rate-chart':
        return (
          <G>
            <Rect x="2" y="6" width="20" height="12" rx="2" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth} />
            <Polyline
              points="5,12 7,8 9,16 11,4 13,12 15,8 17,12 19,10"
              fill="none"
              stroke={variant === 'filled' ? '#FFFFFF' : strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Circle cx="22" cy="12" r="2" fill={strokeColor} />
          </G>
        );

      case 'sleep-chart':
        return (
          <G>
            <Path
              d="M12 3a6.364 6.364 0 0 0 9 9 9 9 0 1 1-9-9Z"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Polyline
              points="6,15 8,12 10,16 12,10 14,14"
              fill="none"
              stroke={variant === 'filled' ? '#FFFFFF' : strokeColor}
              strokeWidth={strokeWidth * 0.8}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Circle cx="8" cy="12" r="0.5" fill={variant === 'filled' ? '#FFFFFF' : strokeColor} />
            <Circle cx="12" cy="10" r="0.5" fill={variant === 'filled' ? '#FFFFFF' : strokeColor} />
          </G>
        );

      // Default fallback
      default:
        return (
          <G>
            <Line x1="12" y1="20" x2="12" y2="10" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" />
            <Line x1="18" y1="20" x2="18" y2="4" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" />
            <Line x1="6" y1="20" x2="6" y2="16" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" />
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
      testID={testID || `data-visualization-icon-${name}`}
    >
      {renderIcon()}
    </Svg>
  );
};

// Specialized Data Visualization Icon Components
export const BarChartIcon = (props) => <DataVisualizationIcon name="bar-chart" {...props} />;
export const LineChartIcon = (props) => <DataVisualizationIcon name="line-chart" {...props} />;
export const AreaChartIcon = (props) => <DataVisualizationIcon name="area-chart" {...props} />;
export const PieChartIcon = (props) => <DataVisualizationIcon name="pie-chart" {...props} />;
export const DonutChartIcon = (props) => <DataVisualizationIcon name="donut-chart" {...props} />;
export const ScatterPlotIcon = (props) => <DataVisualizationIcon name="scatter-plot" {...props} />;
export const ProgressRingIcon = (props) => <DataVisualizationIcon name="progress-ring" {...props} />;
export const ProgressBarIcon = (props) => <DataVisualizationIcon name="progress-bar" {...props} />;
export const AnalyticsIcon = (props) => <DataVisualizationIcon name="analytics" {...props} />;
export const TrendingUpIcon = (props) => <DataVisualizationIcon name="trending-up" {...props} />;
export const TrendingDownIcon = (props) => <DataVisualizationIcon name="trending-down" {...props} />;
export const MoodGraphIcon = (props) => <DataVisualizationIcon name="mood-graph" {...props} />;
export const WellnessMeterIcon = (props) => <DataVisualizationIcon name="wellness-meter" {...props} />;
export const StressLevelIcon = (props) => <DataVisualizationIcon name="stress-level" {...props} />;
export const DataTableIcon = (props) => <DataVisualizationIcon name="data-table" {...props} />;
export const DataListIcon = (props) => <DataVisualizationIcon name="data-list" {...props} />;
export const StatisticsIcon = (props) => <DataVisualizationIcon name="statistics" {...props} />;
export const MetricsIcon = (props) => <DataVisualizationIcon name="metrics" {...props} />;
export const DashboardDataIcon = (props) => <DataVisualizationIcon name="dashboard-data" {...props} />;
export const CompareIcon = (props) => <DataVisualizationIcon name="compare" {...props} />;
export const CorrelationIcon = (props) => <DataVisualizationIcon name="correlation" {...props} />;
export const HeartRateChartIcon = (props) => <DataVisualizationIcon name="heart-rate-chart" {...props} />;
export const SleepChartIcon = (props) => <DataVisualizationIcon name="sleep-chart" {...props} />;

// Data Visualization Icon Collection
export const DataVisualizationIconCollection = {
  // Charts & Graphs
  barChart: BarChartIcon,
  lineChart: LineChartIcon,
  areaChart: AreaChartIcon,
  pieChart: PieChartIcon,
  donutChart: DonutChartIcon,
  scatterPlot: ScatterPlotIcon,
  
  // Progress & Analytics
  progressRing: ProgressRingIcon,
  progressBar: ProgressBarIcon,
  analytics: AnalyticsIcon,
  trendingUp: TrendingUpIcon,
  trendingDown: TrendingDownIcon,
  
  // Mental Health Data
  moodGraph: MoodGraphIcon,
  wellnessMeter: WellnessMeterIcon,
  stressLevel: StressLevelIcon,
  
  // Data Tables
  dataTable: DataTableIcon,
  dataList: DataListIcon,
  
  // Statistics
  statistics: StatisticsIcon,
  metrics: MetricsIcon,
  dashboardData: DashboardDataIcon,
  
  // Comparison
  compare: CompareIcon,
  correlation: CorrelationIcon,
  
  // Health Charts
  heartRateChart: HeartRateChartIcon,
  sleepChart: SleepChartIcon,
};

// PropTypes
DataVisualizationIcon.propTypes = {
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

export default DataVisualizationIcon;
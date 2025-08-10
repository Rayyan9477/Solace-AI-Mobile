/**
 * Solace AI Mobile - shadcn UI Quick Actions Grid Component
 * 
 * A comprehensive quick actions component following shadcn UI patterns,
 * designed specifically for mental health app navigation and quick access.
 * 
 * Features:
 * - Grid layout with therapeutic action cards
 * - Customizable actions with icons and therapeutic theming
 * - Accessibility-first design with proper touch targets
 * - Staggered animations for visual appeal
 * - Mood-aware styling and contextual actions
 * - Haptic feedback and smooth interactions
 */

import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import PropTypes from 'prop-types';

import ShadcnCard from './Card';
import { shadcnConfig } from '../config';
import { 
  colorUtils, 
  styleUtils, 
  animationUtils, 
  accessibilityUtils,
  platformUtils 
} from '../utils';
import { useTheme } from '../../contexts/ThemeContext';
import { MentalHealthIcon, NavigationIcon } from '../../components/icons';

const screenWidth = Dimensions.get('window').width;

// Default mental health actions
const DEFAULT_ACTIONS = [
  {
    id: 'mood-check',
    title: 'Mood Check',
    description: 'Track how you feel',
    icon: 'Heart',
    therapeuticScheme: 'nurturing',
    category: 'tracking',
  },
  {
    id: 'breathing',
    title: 'Breathing',
    description: 'Guided exercises',
    icon: 'Mindfulness',
    therapeuticScheme: 'calming',
    category: 'wellness',
  },
  {
    id: 'journal',
    title: 'Journal',
    description: 'Write your thoughts',
    icon: 'Journal',
    therapeuticScheme: 'peaceful',
    category: 'reflection',
  },
  {
    id: 'therapy-chat',
    title: 'AI Therapy',
    description: 'Chat with AI therapist',
    icon: 'Brain',
    therapeuticScheme: 'grounding',
    category: 'support',
  },
  {
    id: 'progress',
    title: 'Progress',
    description: 'View your journey',
    icon: 'Insights',
    therapeuticScheme: 'energizing',
    category: 'insights',
  },
  {
    id: 'resources',
    title: 'Resources',
    description: 'Helpful tools',
    icon: 'Therapy',
    therapeuticScheme: 'nurturing',
    category: 'tools',
  },
];

const ShadcnQuickActions = ({
  actions = DEFAULT_ACTIONS,
  columns = 2,
  onActionPress,
  animated = true,
  showDescriptions = true,
  variant = 'grid',
  size = 'medium',
  currentMood,
  priorityActions,
  style,
  testID = 'shadcn-quick-actions',
  ...props
}) => {
  const { theme, isReducedMotionEnabled } = useTheme();
  
  // Animation refs for staggered entrance
  const actionAnimations = useRef(
    actions.map(() => ({
      scale: new Animated.Value(0.8),
      opacity: new Animated.Value(0),
      translateY: new Animated.Value(20),
    }))
  ).current;
  
  useEffect(() => {
    if (animated && !isReducedMotionEnabled) {
      // Create staggered entrance animation
      const animations = actionAnimations.map((anim, index) =>
        Animated.parallel([
          Animated.timing(anim.scale, {
            toValue: 1,
            duration: shadcnConfig.animations.gentle.duration,
            delay: index * 100,
            useNativeDriver: true,
          }),
          Animated.timing(anim.opacity, {
            toValue: 1,
            duration: shadcnConfig.animations.gentle.duration,
            delay: index * 100,
            useNativeDriver: true,
          }),
          Animated.timing(anim.translateY, {
            toValue: 0,
            duration: shadcnConfig.animations.gentle.duration,
            delay: index * 100,
            useNativeDriver: true,
          }),
        ])
      );
      
      Animated.stagger(50, animations).start();
    } else {
      // Set final values immediately
      actionAnimations.forEach(anim => {
        anim.scale.setValue(1);
        anim.opacity.setValue(1);
        anim.translateY.setValue(0);
      });
    }
  }, [actions, animated, isReducedMotionEnabled]);
  
  // Get action card size based on columns and screen width
  const getActionCardSize = () => {
    const margins = shadcnConfig.spacing[4] * 2; // Container margins
    const gaps = shadcnConfig.spacing[3] * (columns - 1); // Gaps between items
    const availableWidth = screenWidth - margins - gaps;
    const cardWidth = availableWidth / columns;
    
    const sizeConfigs = {
      small: {
        width: cardWidth,
        height: cardWidth * 0.8,
        iconSize: 24,
        titleSize: shadcnConfig.typography.sizes.sm.fontSize,
        padding: shadcnConfig.spacing[3],
      },
      medium: {
        width: cardWidth,
        height: cardWidth * 0.9,
        iconSize: 28,
        titleSize: shadcnConfig.typography.sizes.base.fontSize,
        padding: shadcnConfig.spacing[4],
      },
      large: {
        width: cardWidth,
        height: cardWidth,
        iconSize: 32,
        titleSize: shadcnConfig.typography.sizes.lg.fontSize,
        padding: shadcnConfig.spacing[5],
      },
    };
    
    return sizeConfigs[size] || sizeConfigs.medium;
  };
  
  const cardSize = getActionCardSize();
  
  // Sort actions based on priority and mood
  const getSortedActions = () => {
    let sortedActions = [...actions];
    
    // Prioritize actions based on current mood
    if (currentMood) {
      const moodPriorities = {
        anxious: ['breathing', 'mood-check', 'therapy-chat'],
        sad: ['journal', 'therapy-chat', 'mood-check'],
        stressed: ['breathing', 'resources', 'therapy-chat'],
        tired: ['mood-check', 'progress', 'resources'],
        happy: ['journal', 'progress', 'mood-check'],
        excited: ['mood-check', 'journal', 'progress'],
      };
      
      const priorities = moodPriorities[currentMood] || [];
      
      sortedActions.sort((a, b) => {
        const aPriority = priorities.indexOf(a.id);
        const bPriority = priorities.indexOf(b.id);
        
        if (aPriority === -1 && bPriority === -1) return 0;
        if (aPriority === -1) return 1;
        if (bPriority === -1) return -1;
        
        return aPriority - bPriority;
      });
    }
    
    // Apply custom priority actions
    if (priorityActions && priorityActions.length > 0) {
      const prioritized = [];
      const rest = [];
      
      sortedActions.forEach(action => {
        if (priorityActions.includes(action.id)) {
          prioritized.push(action);
        } else {
          rest.push(action);
        }
      });
      
      sortedActions = [...prioritized, ...rest];
    }
    
    return sortedActions;
  };
  
  const sortedActions = getSortedActions();
  
  // Handle action press
  const handleActionPress = (action) => {
    if (platformUtils.supportsHaptics()) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    onActionPress?.(action);
  };
  
  // Render action card
  const renderActionCard = (action, index) => {
    const animation = actionAnimations[index] || {
      scale: new Animated.Value(1),
      opacity: new Animated.Value(1),
      translateY: new Animated.Value(0),
    };
    
    // Get gradient colors for therapeutic scheme
    const gradientColors = colorUtils.getTherapeuticGradient(
      action.therapeuticScheme || 'calming',
      1
    );
    
    // Build accessibility props
    const accessibilityProps = accessibilityUtils.getAccessibilityProps({
      label: `${action.title}: ${action.description}`,
      hint: 'Double tap to open',
      role: 'button',
      testID: `action-${action.id}`,
    });
    
    return (
      <Animated.View
        key={action.id}
        style={{
          transform: [
            { scale: animation.scale },
            { translateY: animation.translateY },
          ],
          opacity: animation.opacity,
          width: cardSize.width,
          height: cardSize.height,
        }}
      >
        <TouchableOpacity
          style={{
            flex: 1,
            borderRadius: shadcnConfig.borderRadius.xl,
            overflow: 'hidden',
          }}
          onPress={() => handleActionPress(action)}
          activeOpacity={0.9}
          {...accessibilityProps}
        >
          <LinearGradient
            colors={gradientColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              flex: 1,
              padding: cardSize.padding,
              justifyContent: 'center',
              alignItems: 'center',
              ...platformUtils.getPlatformShadow({
                shadowOpacity: 0.1,
                shadowRadius: 8,
                elevation: 4,
              }),
            }}
          >
            {/* Icon */}
            <View style={{
              width: cardSize.iconSize + 16,
              height: cardSize.iconSize + 16,
              borderRadius: (cardSize.iconSize + 16) / 2,
              backgroundColor: colorUtils.withOpacity('#ffffff', 0.9),
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: shadcnConfig.spacing[3],
              ...platformUtils.getPlatformShadow({
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 2,
              }),
            }}>
              <MentalHealthIcon
                name={action.icon}
                size={cardSize.iconSize}
                colorScheme={action.therapeuticScheme}
              />
            </View>
            
            {/* Title */}
            <Text style={{
              fontSize: cardSize.titleSize,
              fontWeight: shadcnConfig.typography.weights.semibold,
              color: '#ffffff',
              textAlign: 'center',
              marginBottom: showDescriptions ? shadcnConfig.spacing[1] : 0,
              textShadowColor: 'rgba(0, 0, 0, 0.1)',
              textShadowOffset: { width: 0, height: 1 },
              textShadowRadius: 2,
            }}>
              {action.title}
            </Text>
            
            {/* Description */}
            {showDescriptions && (
              <Text style={{
                fontSize: shadcnConfig.typography.sizes.xs.fontSize,
                color: colorUtils.withOpacity('#ffffff', 0.9),
                textAlign: 'center',
                lineHeight: shadcnConfig.typography.sizes.xs.lineHeight,
                textShadowColor: 'rgba(0, 0, 0, 0.1)',
                textShadowOffset: { width: 0, height: 1 },
                textShadowRadius: 1,
              }}>
                {action.description}
              </Text>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    );
  };
  
  // Render grid layout
  const renderGrid = () => {
    const rows = [];
    for (let i = 0; i < sortedActions.length; i += columns) {
      const rowActions = sortedActions.slice(i, i + columns);
      rows.push(
        <View
          key={i}
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: shadcnConfig.spacing[3],
            gap: shadcnConfig.spacing[3],
          }}
        >
          {rowActions.map((action, index) => 
            renderActionCard(action, i + index)
          )}
          
          {/* Fill remaining space if odd number of items */}
          {rowActions.length < columns && (
            <View style={{ width: cardSize.width }} />
          )}
        </View>
      );
    }
    return rows;
  };
  
  // Render horizontal scroll layout
  const renderHorizontalScroll = () => (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        paddingHorizontal: shadcnConfig.spacing[4],
        gap: shadcnConfig.spacing[3],
      }}
    >
      {sortedActions.map((action, index) => 
        renderActionCard(action, index)
      )}
    </ScrollView>
  );
  
  return (
    <View
      style={[
        {
          paddingHorizontal: variant === 'grid' ? shadcnConfig.spacing[4] : 0,
        },
        style,
      ]}
      testID={testID}
      {...props}
    >
      {variant === 'grid' ? renderGrid() : renderHorizontalScroll()}
    </View>
  );
};

// Specialized quick actions variants
export const MoodBasedQuickActions = ({ currentMood, ...props }) => (
  <ShadcnQuickActions
    currentMood={currentMood}
    priorityActions={currentMood ? [
      currentMood === 'anxious' ? 'breathing' : 
      currentMood === 'sad' ? 'journal' :
      currentMood === 'stressed' ? 'breathing' :
      'mood-check'
    ] : []}
    {...props}
  />
);

export const CompactQuickActions = (props) => (
  <ShadcnQuickActions
    columns={3}
    size="small"
    showDescriptions={false}
    variant="grid"
    {...props}
  />
);

export const ScrollableQuickActions = (props) => (
  <ShadcnQuickActions
    variant="horizontal"
    columns={1}
    size="medium"
    {...props}
  />
);

export const TherapeuticQuickActions = (props) => (
  <ShadcnQuickActions
    actions={DEFAULT_ACTIONS.filter(action => 
      ['mood-check', 'breathing', 'therapy-chat', 'journal'].includes(action.id)
    )}
    columns={2}
    size="large"
    animated={true}
    {...props}
  />
);

// PropTypes
ShadcnQuickActions.propTypes = {
  actions: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    icon: PropTypes.string.isRequired,
    therapeuticScheme: PropTypes.oneOf(['calming', 'nurturing', 'peaceful', 'grounding', 'energizing']),
    category: PropTypes.string,
  })),
  columns: PropTypes.number,
  onActionPress: PropTypes.func,
  animated: PropTypes.bool,
  showDescriptions: PropTypes.bool,
  variant: PropTypes.oneOf(['grid', 'horizontal']),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  currentMood: PropTypes.string,
  priorityActions: PropTypes.arrayOf(PropTypes.string),
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  testID: PropTypes.string,
};

export default ShadcnQuickActions;
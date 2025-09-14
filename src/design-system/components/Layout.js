import React from 'react';
import { View, ScrollView, SafeAreaView, StatusBar } from 'react-native';
import { useTheme } from 'react-native-paper';
import { motion } from 'framer-motion/native';
import { LinearGradient } from 'expo-linear-gradient';

const AnimatedView = motion(View);
const AnimatedScrollView = motion(ScrollView);
const AnimatedSafeAreaView = motion(SafeAreaView);

export const Container = ({
  children,
  therapeuticColor,
  gradient = false,
  padding = 16,
  safe = true,
  scrollable = false,
  animationType = 'default',
  style,
  ...props
}) => {
  const theme = useTheme();

  const getBackgroundColor = () => {
    if (therapeuticColor && theme.colors[therapeuticColor]) {
      return gradient
        ? [theme.colors[therapeuticColor][10], theme.colors[therapeuticColor][20]]
        : theme.colors[therapeuticColor][10];
    }
    return gradient
      ? [theme.colors.background, theme.colors.surfaceVariant]
      : theme.colors.background;
  };

  const getAnimationProps = () => {
    switch (animationType) {
      case 'slide':
        return {
          initial: { opacity: 0, x: -50 },
          animate: { opacity: 1, x: 0 },
          exit: { opacity: 0, x: 50 },
          transition: { duration: 0.3 }
        };
      case 'fade':
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
          transition: { duration: 0.4 }
        };
      case 'scale':
        return {
          initial: { opacity: 0, scale: 0.95 },
          animate: { opacity: 1, scale: 1 },
          exit: { opacity: 0, scale: 0.95 },
          transition: { duration: 0.3 }
        };
      default:
        return {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0, y: -20 },
          transition: { duration: 0.3 }
        };
    }
  };

  const backgroundColor = getBackgroundColor();
  const animationProps = getAnimationProps();

  const ContainerComponent = scrollable
    ? AnimatedScrollView
    : safe
      ? AnimatedSafeAreaView
      : AnimatedView;

  const content = (
    <ContainerComponent
      {...animationProps}
      style={[
        {
          flex: 1,
          padding,
          ...(gradient ? {} : { backgroundColor })
        },
        style
      ]}
      {...(scrollable && {
        contentContainerStyle: { flexGrow: 1 },
        showsVerticalScrollIndicator: false,
        showsHorizontalScrollIndicator: false
      })}
      {...props}
    >
      {children}
    </ContainerComponent>
  );

  if (gradient && Array.isArray(backgroundColor)) {
    return (
      <LinearGradient
        colors={backgroundColor}
        style={{ flex: 1 }}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <StatusBar
          barStyle={theme.dark ? 'light-content' : 'dark-content'}
          backgroundColor={backgroundColor[0]}
        />
        {content}
      </LinearGradient>
    );
  }

  return (
    <>
      <StatusBar
        barStyle={theme.dark ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundColor}
      />
      {content}
    </>
  );
};

export const Section = ({
  children,
  title,
  spacing = 16,
  horizontal = false,
  wrap = false,
  animationType = 'stagger',
  style,
  ...props
}) => {
  const theme = useTheme();

  const getAnimationProps = () => {
    switch (animationType) {
      case 'stagger':
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          transition: {
            staggerChildren: 0.1,
            delayChildren: 0.1
          }
        };
      case 'fade':
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          transition: { duration: 0.4 }
        };
      default:
        return {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.3 }
        };
    }
  };

  const animationProps = getAnimationProps();

  return (
    <AnimatedView
      {...animationProps}
      style={[
        {
          marginVertical: spacing / 2
        },
        style
      ]}
      {...props}
    >
      {title && (
        <motion.Text
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          style={[
            theme.fonts.headingSmall,
            {
              color: theme.colors.onSurface,
              marginBottom: spacing
            }
          ]}
        >
          {title}
        </motion.Text>
      )}
      <View
        style={{
          flexDirection: horizontal ? 'row' : 'column',
          gap: spacing,
          ...(wrap && { flexWrap: 'wrap' })
        }}
      >
        {React.Children.map(children, (child, index) => (
          <motion.View
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            {child}
          </motion.View>
        ))}
      </View>
    </AnimatedView>
  );
};

export const Grid = ({
  children,
  columns = 2,
  spacing = 16,
  animationType = 'stagger',
  style,
  ...props
}) => {
  const getAnimationProps = () => {
    switch (animationType) {
      case 'stagger':
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2
          }
        };
      default:
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          transition: { duration: 0.3 }
        };
    }
  };

  const animationProps = getAnimationProps();

  return (
    <AnimatedView
      {...animationProps}
      style={[
        {
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: spacing,
          justifyContent: 'space-between'
        },
        style
      ]}
      {...props}
    >
      {React.Children.map(children, (child, index) => (
        <motion.View
          key={index}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            delay: index * 0.1,
            type: 'spring',
            stiffness: 300
          }}
          style={{
            width: `${(100 - (columns - 1) * (spacing / 2)) / columns}%`,
            minWidth: 150
          }}
        >
          {child}
        </motion.View>
      ))}
    </AnimatedView>
  );
};

export const Spacer = ({ size = 16, horizontal = false }) => {
  return (
    <View
      style={{
        [horizontal ? 'width' : 'height']: size
      }}
    />
  );
};

export default Container;
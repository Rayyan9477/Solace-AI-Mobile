import anime from "animejs";
import { motion } from "framer-motion";
import React from "react";

export const therapeuticTransitions = {
  gentle: {
    type: "spring",
    stiffness: 300,
    damping: 30,
    mass: 0.8,
  },
  calm: {
    type: "spring",
    stiffness: 200,
    damping: 25,
    mass: 1,
  },
  energetic: {
    type: "spring",
    stiffness: 400,
    damping: 20,
    mass: 0.6,
  },
  soothing: {
    type: "tween",
    duration: 0.8,
    ease: "easeOut",
  },
  mindful: {
    type: "tween",
    duration: 1.2,
    ease: "easeInOut",
  },
};

export const breathingAnimation = {
  scale: [1, 1.1, 1],
  opacity: [0.7, 1, 0.7],
  transition: {
    duration: 4,
    repeat: Infinity,
    ease: "easeInOut",
  },
};

export const meditationRipple = {
  scale: [0, 2],
  opacity: [0.8, 0],
  transition: {
    duration: 2,
    repeat: Infinity,
    ease: "easeOut",
  },
};

export const moodTransition = {
  initial: { scale: 0.8, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  exit: { scale: 1.2, opacity: 0 },
  transition: therapeuticTransitions.gentle,
};

export const staggerContainer = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

export const staggerItem = {
  initial: { y: 20, opacity: 0 },
  animate: {
    y: 0,
    opacity: 1,
    transition: therapeuticTransitions.calm,
  },
};

export const FloatingElement = ({
  children,
  intensity = "gentle",
  delay = 0,
}) => {
  const getFloatingAnimation = () => {
    switch (intensity) {
      case "gentle":
        return {
          y: [0, -8, 0],
          transition: {
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay,
          },
        };
      case "moderate":
        return {
          y: [0, -15, 0],
          x: [0, 5, 0],
          transition: {
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay,
          },
        };
      case "active":
        return {
          y: [0, -20, 0],
          x: [0, 8, 0],
          rotate: [0, 2, 0],
          transition: {
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay,
          },
        };
      default:
        return {};
    }
  };

  return <motion.View animate={getFloatingAnimation()}>{children}</motion.View>;
};

export const PulseElement = ({
  children,
  therapeuticMode = "calm",
  size = 1.05,
}) => {
  const getPulseAnimation = () => {
    switch (therapeuticMode) {
      case "calm":
        return {
          scale: [1, size, 1],
          transition: {
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          },
        };
      case "stress":
        return {
          scale: [1, size * 1.1, 1],
          transition: {
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          },
        };
      case "anxiety":
        return {
          scale: [1, size, 1],
          opacity: [0.8, 1, 0.8],
          transition: {
            duration: 1,
            repeat: Infinity,
            ease: "easeInOut",
          },
        };
      default:
        return {
          scale: [1, size, 1],
          transition: {
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          },
        };
    }
  };

  return <motion.View animate={getPulseAnimation()}>{children}</motion.View>;
};

export const BreathingCircle = ({
  size = 100,
  therapeuticColor = "#7D944D",
}) => {
  return (
    <motion.View
      animate={breathingAnimation}
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: therapeuticColor,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <motion.View
        animate={{
          scale: [0.8, 1.2, 0.8],
          opacity: [0.3, 0.1, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5,
        }}
        style={{
          width: size * 0.8,
          height: size * 0.8,
          borderRadius: (size * 0.8) / 2,
          backgroundColor: therapeuticColor,
          position: "absolute",
        }}
      />
    </motion.View>
  );
};

export const MoodWave = ({
  width = 300,
  height = 60,
  therapeuticColor = "#7D944D",
}) => {
  return (
    <motion.View
      animate={{
        scaleX: [1, 1.1, 1],
        y: [0, -5, 0],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      style={{
        width,
        height,
        backgroundColor: therapeuticColor,
        borderRadius: height / 2,
        opacity: 0.6,
      }}
    />
  );
};

export const AnimatedCounter = ({
  from,
  to,
  duration = 1000,
  therapeuticMode = "calm",
}) => {
  const [count, setCount] = React.useState(from);

  React.useEffect(() => {
    const animation = anime({
      targets: { value: from },
      value: to,
      duration,
      easing: therapeuticMode === "calm" ? "easeOutQuad" : "easeOutCubic",
      update(anim) {
        setCount(Math.round(anim.animations[0].currentValue));
      },
    });

    return () => animation.pause();
  }, [from, to, duration, therapeuticMode]);

  return (
    <motion.Text
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={
        therapeuticTransitions[therapeuticMode] || therapeuticTransitions.calm
      }
    >
      {count}
    </motion.Text>
  );
};

export const EmotionRipple = ({ therapeuticColor = "#7D944D", size = 200 }) => {
  return (
    <motion.View
      style={{
        position: "absolute",
        width: size,
        height: size,
        borderRadius: size / 2,
        borderWidth: 2,
        borderColor: therapeuticColor,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {[...Array(3)].map((_, i) => (
        <motion.View
          key={i}
          animate={meditationRipple}
          transition={{
            ...meditationRipple.transition,
            delay: i * 0.6,
          }}
          style={{
            position: "absolute",
            width: size * 0.8,
            height: size * 0.8,
            borderRadius: (size * 0.8) / 2,
            borderWidth: 1,
            borderColor: therapeuticColor,
          }}
        />
      ))}
    </motion.View>
  );
};

export const TherapeuticPageTransition = ({
  children,
  direction = "horizontal",
}) => {
  return (
    <motion.View
      initial={{
        opacity: 0,
        x: direction === "horizontal" ? 50 : 0,
        y: direction === "vertical" ? 50 : 0,
      }}
      animate={{
        opacity: 1,
        x: 0,
        y: 0,
      }}
      exit={{
        opacity: 0,
        x: direction === "horizontal" ? -50 : 0,
        y: direction === "vertical" ? -50 : 0,
      }}
      transition={therapeuticTransitions.mindful}
      style={{ flex: 1 }}
    >
      {children}
    </motion.View>
  );
};

export const LoadingSpinner = ({ therapeuticColor = "#7D944D", size = 40 }) => {
  return (
    <motion.View
      animate={{ rotate: 360 }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "linear",
      }}
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        borderWidth: 3,
        borderColor: "transparent",
        borderTopColor: therapeuticColor,
        borderRightColor: therapeuticColor,
      }}
    />
  );
};

export default {
  therapeuticTransitions,
  breathingAnimation,
  meditationRipple,
  moodTransition,
  staggerContainer,
  staggerItem,
  FloatingElement,
  PulseElement,
  BreathingCircle,
  MoodWave,
  AnimatedCounter,
  EmotionRipple,
  TherapeuticPageTransition,
  LoadingSpinner,
};

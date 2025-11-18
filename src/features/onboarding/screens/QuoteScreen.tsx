/**
 * Quote Screen - Inspirational Quote Display
 * Based on ui-designs/Dark-mode/Splash & Loading.png (Screen 3/4)
 * Shows motivational quotes during loading/onboarding
 */

import { useTheme } from "@theme/ThemeProvider";
import { FreudDiamondLogo } from "@components/icons";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
} from "react-native";

interface Quote {
  text: string;
  author: string;
  category?: string;
}

interface QuoteScreenProps {
  onComplete?: () => void;
  duration?: number;
}

const QUOTES: Quote[] = [
  {
    text: "In the midst of winter, I found there was within me an invincible summer.",
    author: "ALBERT CAMUS",
    category: "resilience"
  },
  {
    text: "You are not your illness. You have an individual story to tell. You have a name, a history, a personality. Staying yourself is part of the battle.",
    author: "JULIAN SEIFTER",
    category: "mental health"
  },
  {
    text: "The only way out is through.",
    author: "ROBERT FROST",
    category: "perseverance"
  },
  {
    text: "What mental health needs is more sunlight, more candor, and more unashamed conversation.",
    author: "GLENN CLOSE",
    category: "awareness"
  },
  {
    text: "Healing takes time, and asking for help is a courageous step.",
    author: "MARISKA HARGITAY",
    category: "healing"
  },
  {
    text: "There is hope, even when your brain tells you there isn't.",
    author: "JOHN GREEN",
    category: "hope"
  },
  {
    text: "You don't have to control your thoughts. You just have to stop letting them control you.",
    author: "DAN MILLMAN",
    category: "mindfulness"
  },
  {
    text: "Self-care is how you take your power back.",
    author: "LALAH DELIA",
    category: "self-care"
  },
];

export const QuoteScreen: React.FC<QuoteScreenProps> = ({
  onComplete,
  duration = 5000,
}) => {
  const { theme } = useTheme();
  const [currentQuote, setCurrentQuote] = useState<Quote>(
    QUOTES[Math.floor(Math.random() * QUOTES.length)]
  );

  useEffect(() => {
    if (onComplete && duration > 0) {
      const timer = setTimeout(onComplete, duration);
      return () => clearTimeout(timer);
    }
  }, [onComplete, duration]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.orange["30"],
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 40,
    },
    logoContainer: {
      marginBottom: 60,
    },
    quoteContainer: {
      alignItems: "center",
    },
    quoteText: {
      fontSize: 20,
      fontWeight: "500",
      color: "#FFFFFF",
      textAlign: "center",
      marginBottom: 32,
      lineHeight: 32,
    },
    author: {
      fontSize: 12,
      fontWeight: "600",
      color: "#FFFFFF",
      textAlign: "center",
      letterSpacing: 1.5,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.logoContainer}>
        <FreudDiamondLogo size={40} color="#FFFFFF" />
      </View>

      <View style={styles.quoteContainer}>
        <Text style={styles.quoteText}>
          "{currentQuote.text}"
        </Text>
        <Text style={styles.author}>
          — {currentQuote.author}
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default QuoteScreen;

/**
 * Enhanced Dashboard Card Component - Simplified version
 * Basic dashboard card interface without complex dependencies
 */

import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform,
} from "react-native";
import { Card, Surface, IconButton } from "react-native-paper";

const { width: screenWidth } = Dimensions.get("window");

const EnhancedDashboardCard = ({
  title,
  description,
  icon,
  onPress,
  color = "#007AFF",
  style,
}) => {
  const styles = StyleSheet.create({
    card: {
      margin: 8,
      borderRadius: 12,
      elevation: 2,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      backgroundColor: "#FFFFFF",
    },
    cardContent: {
      padding: 16,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 8,
    },
    iconContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: color,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 12,
    },
    iconText: {
      fontSize: 20,
      color: "#FFFFFF",
    },
    title: {
      fontSize: 16,
      fontWeight: "600",
      color: "#2D3748",
      flex: 1,
    },
    description: {
      fontSize: 14,
      color: "#718096",
      lineHeight: 20,
      marginTop: 4,
    },
  });

  return (
    <TouchableOpacity onPress={onPress} style={[styles.card, style]}>
      <Card style={styles.card}>
        <View style={styles.cardContent}>
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <Text style={styles.iconText}>{icon || "📊"}</Text>
            </View>
            <Text style={styles.title}>{title}</Text>
          </View>
          <Text style={styles.description}>{description}</Text>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

// Mock components for compatibility
export const DashboardCardGrid = ({ children, ...props }) => children;
export const QuickActionCards = ({ children, ...props }) => children;

export default EnhancedDashboardCard;

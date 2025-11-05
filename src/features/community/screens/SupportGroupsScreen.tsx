/**
 * Support Groups Screen - Community Support Groups
 */

import { useNavigation } from "@react-navigation/native";
import { useTheme } from "@theme/ThemeProvider";
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";

export const SupportGroupsScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();

  const groups = [
    {
      id: "1",
      name: "Anxiety Support",
      members: 1234,
      icon: "😰",
      color: theme.colors.purple?.["60"] || theme.colors.primary,
    },
    {
      id: "2",
      name: "Depression Care",
      members: 2456,
      icon: "💙",
      color: theme.colors.blue?.["60"] || theme.colors.secondary,
    },
    {
      id: "3",
      name: "LGBTQ+ Mental Health",
      members: 876,
      icon: "🏳️‍🌈",
      color: theme.colors.accent || theme.colors.primary,
    },
    {
      id: "4",
      name: "New Parents",
      members: 543,
      icon: "👶",
      color: theme.colors.tertiary || theme.colors.secondary,
    },
  ];

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background.primary,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.gray["20"],
    },
    backButton: {
      width: 40,
      height: 40,
      justifyContent: "center",
      alignItems: "center",
    },
    headerTitle: {
      flex: 1,
      fontSize: 18,
      fontWeight: "700",
      color: theme.colors.text.primary,
      textAlign: "center",
    },
    content: {
      padding: 20,
    },
    groupCard: {
      backgroundColor: theme.colors.brown["10"],
      borderRadius: 16,
      padding: 20,
      marginBottom: 12,
      flexDirection: "row",
      alignItems: "center",
    },
    groupIcon: {
      fontSize: 40,
      marginRight: 16,
    },
    groupInfo: {
      flex: 1,
    },
    groupName: {
      fontSize: 16,
      fontWeight: "700",
      color: theme.colors.text.primary,
      marginBottom: 4,
    },
    groupMembers: {
      fontSize: 13,
      color: theme.colors.text.secondary,
    },
    joinButton: {
      backgroundColor: theme.colors.green["60"],
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 12,
    },
    joinButtonText: {
      fontSize: 13,
      fontWeight: "700",
      color: "#FFFFFF",
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={{ fontSize: 20 }}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Support Groups</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content}>
        {groups.map((group) => (
          <View key={group.id} style={styles.groupCard}>
            <Text style={styles.groupIcon}>{group.icon}</Text>
            <View style={styles.groupInfo}>
              <Text style={styles.groupName}>{group.name}</Text>
              <Text style={styles.groupMembers}>{group.members} members</Text>
            </View>
            <TouchableOpacity style={styles.joinButton}>
              <Text style={styles.joinButtonText}>Join</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default SupportGroupsScreen;

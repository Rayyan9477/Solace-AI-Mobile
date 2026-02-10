/**
 * InviteFriendsScreen Component
 * @description Friend invitation with referral incentive and contacts list
 * @task Task 3.17.13: Invite Friends Screen (Screen 152)
 * @phase Phase 3C: Refactored to use theme tokens
 */

import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { palette } from "../../../shared/theme";

interface ContactItem {
  id: string;
  name: string;
  phone: string;
  initial: string;
}

interface InviteFriendsScreenProps {
  incentiveText: string;
  subtitle: string;
  contacts: ContactItem[];
  onBack: () => void;
  onAddFriends: () => void;
  onInviteContact: (id: string) => void;
}

const localColors = {
  heroBg: palette.olive[700],
  background: palette.brown[900],
  white: palette.white,
  textSecondary: `${palette.white}${palette.alpha[60]}`,
  cardBg: palette.brown[800],
  avatarBg: palette.tan[500],
  avatarText: palette.brown[900],
  addButtonBg: "transparent",
  addButtonBorder: palette.white,
  inviteBg: palette.olive[500],
} as const;

export function InviteFriendsScreen({
  incentiveText,
  subtitle,
  contacts,
  onBack,
  onAddFriends,
  onInviteContact,
}: InviteFriendsScreenProps): React.ReactElement {
  return (
    <View testID="invite-friends-screen" style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Hero Section */}
        <View style={styles.hero}>
          <TouchableOpacity
            testID="back-button"
            style={styles.backButton}
            onPress={onBack}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Text style={styles.backIcon}>{"\u2190"}</Text>
          </TouchableOpacity>
          <View style={styles.heroContent}>
            <Text style={styles.incentiveText}>{incentiveText}</Text>
            <Text style={styles.subtitle}>{subtitle}</Text>
          </View>
        </View>

        {/* Contacts Section */}
        <View style={styles.contactsSection}>
          <TouchableOpacity
            testID="add-friends-button"
            style={styles.addButton}
            onPress={onAddFriends}
            accessibilityRole="button"
            accessibilityLabel="Add Friends"
          >
            <Text style={styles.addButtonText}>Add Friends</Text>
          </TouchableOpacity>

          {contacts.map((contact) => (
            <View
              key={contact.id}
              testID={`contact-${contact.id}`}
              style={styles.contactRow}
            >
              <View style={styles.avatarCircle}>
                <Text style={styles.avatarInitial}>{contact.initial}</Text>
              </View>
              <View style={styles.contactInfo}>
                <Text style={styles.contactName}>{contact.name}</Text>
                <Text style={styles.contactPhone}>{contact.phone}</Text>
              </View>
              <TouchableOpacity
                testID={`invite-${contact.id}`}
                style={styles.inviteButton}
                onPress={() => onInviteContact(contact.id)}
                accessibilityRole="button"
                accessibilityLabel={`Invite ${contact.name}`}
              >
                <Text style={styles.inviteButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  addButton: {
    alignItems: "center",
    borderColor: localColors.addButtonBorder,
    borderRadius: 24,
    borderWidth: 1,
    marginBottom: 16,
    minHeight: 44,
    paddingVertical: 12,
  },
  addButtonText: {
    color: localColors.white,
    fontSize: 15,
    fontWeight: "600",
  },
  avatarCircle: {
    alignItems: "center",
    backgroundColor: localColors.avatarBg,
    borderRadius: 22,
    height: 44,
    justifyContent: "center",
    width: 44,
  },
  avatarInitial: {
    color: localColors.avatarText,
    fontSize: 18,
    fontWeight: "700",
  },
  backButton: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: 44,
    minWidth: 44,
  },
  backIcon: { color: localColors.white, fontSize: 24 },
  contactInfo: { flex: 1, marginLeft: 12 },
  contactName: {
    color: localColors.white,
    fontSize: 15,
    fontWeight: "600",
  },
  contactPhone: {
    color: localColors.textSecondary,
    fontSize: 13,
    marginTop: 2,
  },
  contactRow: {
    alignItems: "center",
    flexDirection: "row",
    marginTop: 12,
  },
  contactsSection: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  container: { backgroundColor: localColors.background, flex: 1 },
  hero: {
    backgroundColor: localColors.heroBg,
    paddingBottom: 32,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  heroContent: {
    alignItems: "center",
    marginTop: 24,
  },
  incentiveText: {
    color: localColors.white,
    fontSize: 26,
    fontWeight: "800",
    textAlign: "center",
  },
  inviteButton: {
    alignItems: "center",
    backgroundColor: localColors.inviteBg,
    borderRadius: 16,
    height: 32,
    justifyContent: "center",
    width: 32,
  },
  inviteButtonText: {
    color: localColors.white,
    fontSize: 18,
    fontWeight: "700",
  },
  scrollContent: { paddingBottom: 48 },
  subtitle: {
    color: `${palette.white}${palette.alpha[80]}`,
    fontSize: 14,
    marginTop: 8,
    textAlign: "center",
  },
});

export default InviteFriendsScreen;

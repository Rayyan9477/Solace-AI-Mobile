/**
 * LinkedDevicesScreen Component
 * @description 2x2 device grid with battery levels, connect/disconnect actions
 * @task Task 3.17.7: Linked Devices Screen (Screen 146)
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

interface DeviceItem {
  id: string;
  name: string;
  battery: number;
  status: "connected" | "inactive";
}

interface LinkedDevicesScreenProps {
  devices: DeviceItem[];
  onBack: () => void;
  onDeviceAction: (id: string) => void;
  onSave: () => void;
}

const localColors = {
  background: palette.brown[900],
  white: palette.white,
  cardBg: palette.brown[800],
  textSecondary: `${palette.white}${palette.alpha[60]}`,
  connected: palette.olive[500],
  inactive: palette.onboarding.step2,
  connectBg: "transparent",
  connectBorder: palette.tan[500],
  disconnectBg: palette.onboarding.step2,
  ctaButtonBg: palette.tan[500],
  ctaButtonText: palette.brown[900],
} as const;

export function LinkedDevicesScreen({
  devices,
  onBack,
  onDeviceAction,
  onSave,
}: LinkedDevicesScreenProps): React.ReactElement {
  return (
    <View testID="linked-devices-screen" style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          testID="back-button"
          style={styles.backButton}
          onPress={onBack}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Text style={styles.backIcon}>{"\u2190"}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Linked Devices</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Device Grid */}
        <View style={styles.grid}>
          {devices.map((device) => (
            <View
              key={device.id}
              testID={`device-card-${device.id}`}
              style={styles.deviceCard}
            >
              <View style={styles.deviceIcon}>
                <Text style={styles.deviceIconText}>{"\u2B55"}</Text>
              </View>
              <Text style={styles.deviceName}>{device.name}</Text>
              <Text style={styles.batteryText}>{device.battery}%</Text>
              <Text
                style={[
                  styles.statusText,
                  {
                    color:
                      device.status === "connected"
                        ? localColors.connected
                        : localColors.inactive,
                  },
                ]}
              >
                {device.status === "connected" ? "Connected" : "Inactive"}
              </Text>
              <TouchableOpacity
                testID={`action-${device.id}`}
                style={[
                  styles.actionButton,
                  device.status === "connected"
                    ? styles.disconnectButton
                    : styles.connectButton,
                ]}
                onPress={() => onDeviceAction(device.id)}
                accessibilityRole="button"
                accessibilityLabel={
                  device.status === "connected"
                    ? `Disconnect ${device.name}`
                    : `Connect ${device.name}`
                }
              >
                <Text
                  style={[
                    styles.actionButtonText,
                    device.status === "connected" && styles.disconnectText,
                  ]}
                >
                  {device.status === "connected" ? "Disconnect" : "Connect"}
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Save Button */}
        <View style={styles.footer}>
          <TouchableOpacity
            testID="save-button"
            style={styles.saveButton}
            onPress={onSave}
            accessibilityRole="button"
            accessibilityLabel="Save Settings"
          >
            <Text style={styles.saveButtonText}>Save Settings {"\u2713"}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  actionButton: {
    alignItems: "center",
    borderRadius: 16,
    justifyContent: "center",
    marginTop: 12,
    minHeight: 44,
    paddingVertical: 10,
    width: "100%",
  },
  actionButtonText: {
    color: localColors.ctaButtonBg,
    fontSize: 13,
    fontWeight: "600",
  },
  backButton: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: 44,
    minWidth: 44,
  },
  backIcon: { color: localColors.white, fontSize: 24 },
  batteryText: {
    color: localColors.textSecondary,
    fontSize: 13,
    marginTop: 4,
  },
  connectButton: {
    borderColor: localColors.connectBorder,
    borderWidth: 1,
  },
  container: { backgroundColor: localColors.background, flex: 1 },
  deviceCard: {
    alignItems: "center",
    backgroundColor: localColors.cardBg,
    borderRadius: 16,
    padding: 16,
    width: "48%",
  },
  deviceIcon: {
    alignItems: "center",
    height: 40,
    justifyContent: "center",
    width: 40,
  },
  deviceIconText: { fontSize: 24 },
  deviceName: {
    color: localColors.white,
    fontSize: 14,
    fontWeight: "600",
    marginTop: 8,
    textAlign: "center",
  },
  disconnectButton: {
    backgroundColor: localColors.disconnectBg,
  },
  disconnectText: { color: localColors.white },
  footer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    justifyContent: "space-between",
    paddingHorizontal: 24,
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  headerTitle: {
    color: localColors.white,
    fontSize: 20,
    fontWeight: "700",
    marginLeft: 12,
  },
  saveButton: {
    alignItems: "center",
    backgroundColor: localColors.ctaButtonBg,
    borderRadius: 28,
    justifyContent: "center",
    minHeight: 44,
    paddingVertical: 16,
    width: "100%",
  },
  saveButtonText: {
    color: localColors.ctaButtonText,
    fontSize: 16,
    fontWeight: "700",
  },
  scrollContent: { paddingBottom: 48, paddingTop: 24 },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    marginTop: 4,
  },
});

export default LinkedDevicesScreen;

/**
 * Crisis Support Screen - Emergency Mental Health Resources
 * Provides immediate access to crisis intervention resources
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@theme/ThemeProvider';
import { EMERGENCY_RESOURCES, SUPPORT_RESOURCES } from '../crisisConfig';

interface Resource {
  id: string;
  name: string;
  number?: string;
  keyword?: string;
  description: string;
  type: 'voice' | 'text' | 'emergency' | 'chat' | 'resource';
  priority?: number;
  specialty?: string;
  url?: string;
}

export const CrisisSupportScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const [country] = useState('US');

  const emergencyResources = EMERGENCY_RESOURCES[country] || EMERGENCY_RESOURCES.US;

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background.primary,
    },
    header: {
      backgroundColor: theme.colors.red['60'],
      paddingHorizontal: 20,
      paddingVertical: 24,
    },
    headerTop: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 16,
    },
    closeButton: {
      width: 40,
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
    },
    emergencyBadge: {
      backgroundColor: 'rgba(255,255,255,0.2)',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 12,
    },
    emergencyBadgeText: {
      fontSize: 12,
      fontWeight: '700',
      color: '#FFFFFF',
    },
    headerTitle: {
      fontSize: 28,
      fontWeight: '800',
      color: '#FFFFFF',
      marginBottom: 8,
    },
    headerSubtitle: {
      fontSize: 16,
      fontWeight: '600',
      color: '#FFFFFF',
      opacity: 0.9,
    },
    content: {
      flex: 1,
    },
    section: {
      padding: 20,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: theme.colors.text.primary,
      marginBottom: 16,
    },
    warningCard: {
      backgroundColor: theme.colors.red['20'],
      borderRadius: 16,
      padding: 20,
      marginBottom: 24,
      borderLeftWidth: 4,
      borderLeftColor: theme.colors.red['60'],
    },
    warningTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: theme.colors.red['100'],
      marginBottom: 8,
    },
    warningText: {
      fontSize: 14,
      lineHeight: 20,
      color: theme.colors.red['80'],
    },
    resourceCard: {
      backgroundColor: theme.colors.background.secondary,
      borderRadius: 16,
      padding: 20,
      marginBottom: 12,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    resourceHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    resourceIcon: {
      width: 48,
      height: 48,
      borderRadius: 24,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    resourceIconText: {
      fontSize: 24,
    },
    resourceInfo: {
      flex: 1,
    },
    resourceName: {
      fontSize: 16,
      fontWeight: '700',
      color: theme.colors.text.primary,
      marginBottom: 4,
    },
    resourceNumber: {
      fontSize: 20,
      fontWeight: '800',
      color: theme.colors.red['60'],
      marginBottom: 4,
    },
    resourceDescription: {
      fontSize: 13,
      lineHeight: 18,
      color: theme.colors.text.secondary,
      marginBottom: 12,
    },
    actionButtons: {
      flexDirection: 'row',
      gap: 8,
    },
    callButton: {
      flex: 1,
      backgroundColor: theme.colors.red['60'],
      paddingVertical: 12,
      borderRadius: 12,
      alignItems: 'center',
    },
    callButtonText: {
      fontSize: 14,
      fontWeight: '700',
      color: '#FFFFFF',
    },
    textButton: {
      flex: 1,
      backgroundColor: theme.colors.green['60'],
      paddingVertical: 12,
      borderRadius: 12,
      alignItems: 'center',
    },
    textButtonText: {
      fontSize: 14,
      fontWeight: '700',
      color: '#FFFFFF',
    },
    chatButton: {
      flex: 1,
      backgroundColor: theme.colors.purple['60'],
      paddingVertical: 12,
      borderRadius: 12,
      alignItems: 'center',
    },
    chatButtonText: {
      fontSize: 14,
      fontWeight: '700',
      color: '#FFFFFF',
    },
    supportCard: {
      backgroundColor: theme.colors.brown['10'],
      borderRadius: 16,
      padding: 16,
      marginBottom: 12,
    },
    supportName: {
      fontSize: 15,
      fontWeight: '700',
      color: theme.colors.text.primary,
      marginBottom: 4,
    },
    supportDescription: {
      fontSize: 13,
      lineHeight: 18,
      color: theme.colors.text.secondary,
      marginBottom: 8,
    },
    supportNumber: {
      fontSize: 16,
      fontWeight: '700',
      color: theme.colors.brown['80'],
    },
    specialtyBadge: {
      alignSelf: 'flex-start',
      backgroundColor: theme.colors.purple['40'],
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 8,
      marginTop: 8,
    },
    specialtyText: {
      fontSize: 11,
      fontWeight: '700',
      color: theme.colors.purple['100'],
      textTransform: 'uppercase',
    },
  });

  const handleCall = (number: string, name: string) => {
    Alert.alert(
      'Call Crisis Support',
      `Call ${name} at ${number}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Call Now',
          onPress: () => {
            Linking.openURL(`tel:${number}`).catch((err) => {
              Alert.alert('Error', 'Unable to make phone call');
            });
          },
          style: 'default',
        },
      ],
      { cancelable: true }
    );
  };

  const handleText = (number: string, keyword: string, name: string) => {
    const message = keyword ? `sms:${number}?body=${keyword}` : `sms:${number}`;
    Linking.openURL(message).catch((err) => {
      Alert.alert('Error', 'Unable to send text message');
    });
  };

  const handleOpenUrl = (url: string) => {
    Linking.openURL(url).catch((err) => {
      Alert.alert('Error', 'Unable to open link');
    });
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'emergency':
        return { icon: '🚨', bg: theme.colors.red['40'] };
      case 'voice':
        return { icon: '📞', bg: theme.colors.green['40'] };
      case 'text':
        return { icon: '💬', bg: theme.colors.blue['40'] };
      case 'chat':
        return { icon: '💻', bg: theme.colors.purple['40'] };
      default:
        return { icon: '🆘', bg: theme.colors.orange['40'] };
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => navigation.goBack()}
            accessible
            accessibilityLabel="Close"
            accessibilityRole="button"
          >
            <Text style={{ fontSize: 24, color: '#FFFFFF' }}>×</Text>
          </TouchableOpacity>
          <View style={styles.emergencyBadge}>
            <Text style={styles.emergencyBadgeText}>🆘 CRISIS SUPPORT</Text>
          </View>
        </View>
        <Text style={styles.headerTitle}>You're Not Alone</Text>
        <Text style={styles.headerSubtitle}>
          Immediate help is available 24/7
        </Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Warning Message */}
        <View style={styles.section}>
          <View style={styles.warningCard}>
            <Text style={styles.warningTitle}>⚠️ If you're in immediate danger</Text>
            <Text style={styles.warningText}>
              Call 911 or go to your nearest emergency room. These resources are here to support
              you, but emergency services can provide immediate medical assistance.
            </Text>
          </View>
        </View>

        {/* Emergency Resources */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Emergency Support</Text>

          {emergencyResources.map((resource) => {
            const iconData = getResourceIcon(resource.type);
            return (
              <View key={resource.id} style={styles.resourceCard}>
                <View style={styles.resourceHeader}>
                  <View style={[styles.resourceIcon, { backgroundColor: iconData.bg }]}>
                    <Text style={styles.resourceIconText}>{iconData.icon}</Text>
                  </View>
                  <View style={styles.resourceInfo}>
                    <Text style={styles.resourceName}>{resource.name}</Text>
                    <Text style={styles.resourceNumber}>{resource.number}</Text>
                  </View>
                </View>

                <Text style={styles.resourceDescription}>{resource.description}</Text>

                {resource.specialty && (
                  <View style={styles.specialtyBadge}>
                    <Text style={styles.specialtyText}>{resource.specialty}</Text>
                  </View>
                )}

                <View style={styles.actionButtons}>
                  {resource.type === 'voice' || resource.type === 'emergency' ? (
                    <TouchableOpacity
                      style={styles.callButton}
                      onPress={() => handleCall(resource.number!, resource.name)}
                    >
                      <Text style={styles.callButtonText}>📞 Call Now</Text>
                    </TouchableOpacity>
                  ) : null}

                  {resource.type === 'text' && resource.keyword ? (
                    <TouchableOpacity
                      style={styles.textButton}
                      onPress={() =>
                        handleText(resource.number!, resource.keyword!, resource.name)
                      }
                    >
                      <Text style={styles.textButtonText}>💬 Text {resource.keyword}</Text>
                    </TouchableOpacity>
                  ) : null}
                </View>
              </View>
            );
          })}
        </View>

        {/* Additional Support Resources */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Additional Support</Text>

          {SUPPORT_RESOURCES.map((resource) => (
            <TouchableOpacity
              key={resource.id}
              style={styles.supportCard}
              onPress={() => {
                if (resource.url) {
                  handleOpenUrl(resource.url);
                } else if (resource.number) {
                  handleCall(resource.number, resource.name);
                }
              }}
            >
              <Text style={styles.supportName}>{resource.name}</Text>
              <Text style={styles.supportDescription}>{resource.description}</Text>
              {resource.number && (
                <Text style={styles.supportNumber}>{resource.number}</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CrisisSupportScreen;

/**
 * Cross-Platform Alert Utility
 * Provides consistent alert functionality across web and native platforms
 */

import { Platform, Alert as RNAlert } from 'react-native';

export interface AlertButton {
  text: string;
  onPress?: () => void;
  style?: 'default' | 'cancel' | 'destructive';
}

/**
 * Show an alert dialog that works on both web and native platforms
 */
export const showAlert = (
  title: string,
  message?: string,
  buttons?: AlertButton[]
): void => {
  if (Platform.OS === 'web') {
    // Web implementation using browser alert/confirm
    const hasButtons = buttons && buttons.length > 0;
    
    if (hasButtons && buttons.length === 1) {
      // Single button - just show alert
      window.alert(`${title}\n\n${message || ''}`);
      buttons[0].onPress?.();
    } else if (hasButtons && buttons.length === 2) {
      // Two buttons - use confirm dialog
      const messageText = message ? `${message}\n\n` : '';
      const confirmText = buttons.find(b => b.style !== 'cancel')?.text || buttons[1].text;
      const cancelText = buttons.find(b => b.style === 'cancel')?.text || buttons[0].text;
      
      const result = window.confirm(`${title}\n\n${messageText}Press OK for "${confirmText}" or Cancel for "${cancelText}"`);
      
      if (result) {
        // User clicked OK (confirm button)
        const confirmButton = buttons.find(b => b.style !== 'cancel') || buttons[1];
        confirmButton.onPress?.();
      } else {
        // User clicked Cancel
        const cancelButton = buttons.find(b => b.style === 'cancel') || buttons[0];
        cancelButton.onPress?.();
      }
    } else {
      // No buttons or more than 2 buttons - just show alert
      window.alert(`${title}\n\n${message || ''}`);
      if (hasButtons) {
        buttons[0].onPress?.();
      }
    }
  } else {
    // Native implementation using React Native Alert
    RNAlert.alert(title, message, buttons);
  }
};

/**
 * Convenience method for simple alerts with just an OK button
 */
export const alert = (title: string, message?: string): void => {
  showAlert(title, message, [{ text: 'OK' }]);
};

/**
 * Convenience method for confirmation dialogs
 */
export const confirm = (
  title: string,
  message: string,
  onConfirm: () => void,
  onCancel?: () => void
): void => {
  showAlert(title, message, [
    { text: 'Cancel', style: 'cancel', onPress: onCancel },
    { text: 'OK', onPress: onConfirm }
  ]);
};

export default {
  alert,
  confirm,
  showAlert
};

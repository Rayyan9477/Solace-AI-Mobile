/**
 * CrisisModal Types
 * @description Type definitions for crisis support modal
 * SAFETY-CRITICAL COMPONENT
 */

import type { ViewStyle } from "react-native";

/**
 * Crisis trigger source for analytics and appropriate messaging
 */
export type CrisisTriggerSource =
  | "assessment" // Mental health assessment
  | "journal" // Journal entry content
  | "chat" // AI chatbot detection
  | "score" // Critical Freud score (< 30)
  | "manual"; // User manually accessed crisis resources

/**
 * Crisis resource information
 */
export interface CrisisResource {
  /** Resource name */
  name: string;
  /** Description of the resource */
  description: string;
  /** Contact method (phone, sms, url) */
  type: "phone" | "sms" | "url";
  /** Contact value (phone number, SMS number, or URL) */
  value: string;
  /** Display text for the contact button */
  buttonText: string;
  /** Whether this is available 24/7 */
  available24_7: boolean;
  /** Icon name or component */
  icon?: string;
}

/**
 * CrisisModal component props
 */
export interface CrisisModalProps {
  /** Whether the modal is visible */
  visible: boolean;
  /** Callback when modal is dismissed */
  onDismiss: () => void;
  /** Whether user must acknowledge before dismissing */
  requireAcknowledge?: boolean;
  /** Source that triggered the crisis modal */
  triggerSource?: CrisisTriggerSource;
  /** Custom support message (optional) */
  customMessage?: string;
  /** Test ID for component */
  testID?: string;
  /** Custom styles */
  style?: ViewStyle;
}

/**
 * Crisis resource card props
 */
export interface CrisisResourceCardProps {
  /** Resource information */
  resource: CrisisResource;
  /** Callback when resource is accessed */
  onPress: (resource: CrisisResource) => void;
  /** Test ID */
  testID?: string;
}

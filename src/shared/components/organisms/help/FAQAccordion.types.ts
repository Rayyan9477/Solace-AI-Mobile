/**
 * FAQAccordion Component Types
 * @description Expandable/collapsible FAQ accordion item
 * @task Task 2.10.2: FAQAccordion Component
 */

import type { ViewStyle } from "react-native";

export interface FAQAccordionProps {
  id: string;
  question: string;
  answer: string;
  isExpanded?: boolean;
  onPress?: (id: string) => void;
  style?: ViewStyle;
  testID?: string;
  accessibilityLabel?: string;
}

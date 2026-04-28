/**
 * Chat Organisms
 * @description Barrel exports for chat organism components
 * @task Sprint 2.7: Chat Organisms
 */

// ChatBubble
export { ChatBubble } from "./ChatBubble";
export type {
  ChatBubbleProps,
  MessageSender,
  MessageStatus,
  EmotionDetection,
  MessageReaction,
  MessageAttachment,
} from "./ChatBubble.types";
export {
  formatTimestamp,
  getStatusIcon,
  getEmotionColor,
} from "./ChatBubble.types";

// TypingIndicator
export { TypingIndicator } from "./TypingIndicator";
export type {
  TypingIndicatorProps,
  TypingIndicatorVariant,
  TypingIndicatorSize,
  DotAnimationStyle,
} from "./TypingIndicator.types";
export { sizeSpecs, getTypingText } from "./TypingIndicator.types";

// MessageInput
export { MessageInput } from "./MessageInput";
export type {
  MessageInputProps,
  InputMode,
  VoiceRecordingState,
  InputAttachment,
  VoiceRecording,
} from "./MessageInput.types";
export { formatDuration, canSendMessage } from "./MessageInput.types";

// VoiceWaveform
export { VoiceWaveform } from "./VoiceWaveform";
export type {
  VoiceWaveformProps,
  WaveformStyle,
  AnimationMode,
} from "./VoiceWaveform.types";
export {
  generateRandomWaveform,
  normalizeWaveform,
  resampleWaveform,
  formatWaveformDuration,
} from "./VoiceWaveform.types";

// Sprint 5: Chat organisms
export { ChatHeader } from "./ChatHeader";
export type { ChatHeaderProps } from "./ChatHeader";

export { ChatBubbleAction } from "./ChatBubbleAction";
export type { ChatBubbleActionProps } from "./ChatBubbleAction";

export { ReactionChip } from "./ReactionChip";
export type { ReactionChipProps } from "./ReactionChip";

export { TopicSummaryCard } from "./TopicSummaryCard";
export type { TopicSummaryCardProps, TopicSummaryItem } from "./TopicSummaryCard";

export { CbtStepper } from "./CbtStepper";
export type { CbtStepperProps, CbtStep } from "./CbtStepper";

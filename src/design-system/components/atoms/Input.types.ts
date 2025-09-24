// TypeScript interfaces for Input components
export interface TextInputProps {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  error?: boolean;
  helperText?: string;
  therapeuticColor?: 'serenityGreen' | 'empathyOrange' | 'kindPurple' | 'zenYellow' | 'optimisticGray';
  variant?: 'outlined' | 'flat';
  size?: 'small' | 'medium' | 'large';
  animationType?: 'default' | 'slide' | 'fade';
  style?: any;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  autoCorrect?: boolean;
}

export interface SearchInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onSubmit?: () => void;
  placeholder?: string;
  therapeuticColor?: 'serenityGreen' | 'empathyOrange' | 'kindPurple' | 'zenYellow' | 'optimisticGray';
  style?: any;
}

export interface TextAreaProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  rows?: number;
  therapeuticColor?: 'serenityGreen' | 'empathyOrange' | 'kindPurple' | 'zenYellow' | 'optimisticGray';
  style?: any;
}
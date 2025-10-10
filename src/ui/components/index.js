/**
 * UI Components Index - Simplified version
 * Basic component exports without complex dependencies
 */

// Simple button component
export const TherapeuticButton = ({ children, ...props }) => children;

// Simple checkbox component
export const Checkbox = ({ children, ...props }) => children;

// Simple input component
export const Input = ({ children, ...props }) => children;

// Simple card component
export const Card = ({ children, ...props }) => children;

// Simple container component
export const Container = ({ children, ...props }) => children;

// Simple text component
export const Text = ({ children, ...props }) => children;

// Simple view component
export const View = ({ children, ...props }) => children;

// Simple touchable component
export const TouchableOpacity = ({ children, ...props }) => children;

// Default export
export default {
  TherapeuticButton,
  Checkbox,
  Input,
  Card,
  Container,
  Text,
  View,
  TouchableOpacity,
};
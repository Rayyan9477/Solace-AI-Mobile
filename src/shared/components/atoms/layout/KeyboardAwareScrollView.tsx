import React, { useMemo } from "react";
import { ScrollView, TextInput } from "react-native";

const KeyboardAwareScrollView = ({
  children,
  isTherapyForm,
  isMoodTracker,
  accessibilityLabel,
  accessibilityHint,
  accessible = true,
  onFocusChange, // not used in this fallback, but kept for API parity
  ...props
}) => {
  const resolvedLabel = useMemo(() => {
    if (accessibilityLabel) return accessibilityLabel;
    if (isTherapyForm) return "Therapy form container";
    if (isMoodTracker) return "Mood tracker form container";
    return undefined;
  }, [accessibilityLabel, isTherapyForm, isMoodTracker]);

  return (
    <ScrollView
      accessible={accessible}
      accessibilityRole={props.accessibilityRole || "scrollview"}
      accessibilityLabel={resolvedLabel}
      accessibilityHint={accessibilityHint}
      {...props}
    >
      {children}
    </ScrollView>
  );
};

export const KeyboardAwareInput = (props) => <TextInput {...props} />;

export default KeyboardAwareScrollView;

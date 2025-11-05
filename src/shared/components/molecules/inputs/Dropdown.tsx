import { MentalHealthIcon } from "@shared/components/icons";
import { useTheme } from "@theme/ThemeProvider";
import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  ScrollView,
  Modal,
  Dimensions,
} from "react-native";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const Dropdown = ({
  options = [],
  selectedValue = null,
  onSelect = () => {},
  placeholder = "Select an option",
  label = "",
  disabled = false,
  variant = "default",
  accessibilityLabel,
  accessibilityHint,
}) => {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownTop, setDropdownTop] = useState(0);
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const dropdownButton = useRef();

  const toggleDropdown = () => {
    if (disabled) return;

    const toValue = isOpen ? 0 : 1;

    if (!isOpen) {
      // Measure button position for dropdown placement
      dropdownButton.current?.measure((fx, fy, width, height, px, py) => {
        setDropdownTop(py + height);
      });
    }

    Animated.timing(rotateAnim, {
      toValue,
      duration: 200,
      useNativeDriver: true,
    }).start();

    setIsOpen(!isOpen);
  };

  const selectOption = (option) => {
    onSelect(option);
    toggleDropdown();
  };

  const getTherapeuticColor = () => {
    switch (variant) {
      case "calming":
        return theme.colors.therapeutic.calming[500];
      case "nurturing":
        return theme.colors.therapeutic.nurturing[500];
      case "peaceful":
        return theme.colors.therapeutic.peaceful[500];
      case "grounding":
        return theme.colors.therapeutic.grounding[500];
      default:
        return theme.colors.primary["500"];
    }
  };

  const therapeuticColor = getTherapeuticColor();
  const selectedOption = options.find(
    (option) => option.value === selectedValue,
  );

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  return (
    <View style={styles.container}>
      {label && (
        <Text style={[styles.label, { color: theme.colors.text.primary }]}>
          {label}
        </Text>
      )}

      <TouchableOpacity
        ref={dropdownButton}
        style={[
          styles.dropdownButton,
          {
            backgroundColor: theme.colors.background.input,
            borderColor: isOpen
              ? therapeuticColor
              : theme.colors.border.primary,
            opacity: disabled ? 0.5 : 1,
          },
        ]}
        onPress={toggleDropdown}
        disabled={disabled}
        accessibilityRole="combobox"
        accessibilityState={{ expanded: isOpen }}
        accessibilityLabel={accessibilityLabel || label}
        accessibilityHint={
          accessibilityHint || "Double tap to open dropdown menu"
        }
      >
        <Text
          style={[
            styles.dropdownButtonText,
            {
              color: selectedOption
                ? theme.colors.text.primary
                : theme.colors.text.placeholder,
            },
          ]}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </Text>

        <Animated.View
          style={{
            transform: [{ rotate: rotateInterpolate }],
          }}
        >
          <MentalHealthIcon
            name="Brain"
            size={16}
            color={theme.colors.text.secondary}
            variant="outline"
          />
        </Animated.View>
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={toggleDropdown}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={toggleDropdown}
        >
          <View
            style={[
              styles.dropdownContainer,
              {
                backgroundColor: theme.colors.background.modal,
                borderColor: theme.colors.border.primary,
                top: Math.min(dropdownTop, screenHeight - 300),
                maxHeight: Math.min(250, screenHeight - dropdownTop - 50),
              },
            ]}
          >
            <ScrollView
              style={styles.optionsContainer}
              showsVerticalScrollIndicator
              nestedScrollEnabled
            >
              {options.map((option, index) => (
                <TouchableOpacity
                  key={option.value || index}
                  style={[
                    styles.option,
                    {
                      backgroundColor:
                        selectedValue === option.value
                          ? therapeuticColor + "20"
                          : "transparent",
                      borderBottomColor: theme.colors.border.secondary,
                    },
                  ]}
                  onPress={() => selectOption(option)}
                  accessibilityRole="option"
                  accessibilityState={{
                    selected: selectedValue === option.value,
                  }}
                >
                  <Text
                    style={[
                      styles.optionText,
                      {
                        color:
                          selectedValue === option.value
                            ? therapeuticColor
                            : theme.colors.text.primary,
                        fontWeight:
                          selectedValue === option.value ? "600" : "400",
                      },
                    ]}
                  >
                    {option.label}
                  </Text>

                  {selectedValue === option.value && (
                    <MentalHealthIcon
                      name="Heart"
                      size={16}
                      color={therapeuticColor}
                      variant="filled"
                    />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 6,
  },
  dropdownButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    minHeight: 44, // WCAG touch target
  },
  dropdownButtonText: {
    flex: 1,
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  dropdownContainer: {
    position: "absolute",
    left: 16,
    right: 16,
    borderRadius: 8,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  optionsContainer: {
    maxHeight: 200,
  },
  option: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    minHeight: 44, // WCAG touch target
  },
  optionText: {
    flex: 1,
    fontSize: 16,
  },
});

export default Dropdown;

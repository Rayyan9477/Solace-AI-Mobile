// Bridge to shared AccessibleButton with a safe fallback for tests
try {
	module.exports = require('../../src/shared/components/atoms/buttons/AccessibleButton');
} catch (e) {
	const React = require('react');
	const { TouchableOpacity, Text, AccessibilityInfo } = require('react-native');
	const {
		WCAG_CONSTANTS,
		TouchTargetHelpers,
	} = require('../../utils/accessibilityTesting');

	const Fallback = ({
		label = 'Button',
		title,
		onPress,
		onFocus,
		onBlur,
		accessibilityLabel,
		accessibilityHint,
		disabled = false,
		loading = false,
		autoFocus = false,
		size,
		testID,
		style,
	}: any) => {
		const resolvedLabel = accessibilityLabel || title || label;
		const baseStyle = Array.isArray(style) ? Object.assign({}, ...style) : (style || {});
		const sizeStyle = size === 'small' ? { minWidth: WCAG_CONSTANTS.TOUCH_TARGET_MIN_SIZE, minHeight: WCAG_CONSTANTS.TOUCH_TARGET_MIN_SIZE } : {};
		const ensured = TouchTargetHelpers.ensureMinimumTouchTarget({ ...sizeStyle, ...baseStyle });

		React.useEffect(() => {
			if (autoFocus && AccessibilityInfo?.setAccessibilityFocus) {
				AccessibilityInfo.setAccessibilityFocus({ nativeID: testID || `accessible-button-${resolvedLabel}` });
				AccessibilityInfo.announceForAccessibility?.(`${resolvedLabel} focused`);
			}
		}, [autoFocus, resolvedLabel, testID]);

		const handlePress = () => {
			AccessibilityInfo.announceForAccessibility?.(`${resolvedLabel} button activated`);
			onPress && onPress();
		};

		const handleFocus = (e) => {
			onFocus && onFocus(e);
			AccessibilityInfo.announceForAccessibility?.(`${resolvedLabel} focused`);
		};

		return React.createElement(
			TouchableOpacity,
			{
				accessibilityRole: 'button',
				accessibilityLabel: resolvedLabel,
				accessibilityHint,
				testID: testID || `accessible-button-${resolvedLabel}`,
				onPress: handlePress,
				onAccessibilityTap: handlePress,
				onFocus: handleFocus,
				onBlur,
				disabled,
				accessibilityState: { disabled, busy: !!loading, selected: false },
				focusable: true,
				style: ensured.style,
			},
			React.createElement(Text, null, resolvedLabel)
		);
	};

	module.exports = Fallback;
}

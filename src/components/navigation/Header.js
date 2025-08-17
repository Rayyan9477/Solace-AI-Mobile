import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../shared/theme/ThemeContext';
import Icon from '../common/Icon';
import Avatar from '../common/Avatar';

const Header = ({
  title,
  showBack = true,
  showProfile = false,
  rightAction,
  style,
  accessibilityLabel,
}) => {
  const { theme } = useTheme();
  const navigation = useNavigation();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.colors.background.surface },
        style,
      ]}
      accessibilityRole="header"
      accessibilityLabel={accessibilityLabel || `${title} screen header`}
    >
      <View style={styles.leftAction}>
        {showBack && (
          <Pressable
            onPress={() =
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel="Button"
        accessibilityHint="Double tap to activate"
      > navigation.goBack()}
            style={styles.backButton}
            accessibilityLabel="Go back"
            accessibilityRole="button"
          >
            <Icon
              name="chevron-left"
              size={28}
              color={theme.colors.text.primary}
            />
          </Pressable>
        )}
      </View>

      <Text
        style={[
          styles.title,
          { color: theme.colors.text.primary },
        ]}
        numberOfLines={1}
      >
        {title}
      </Text>

      <View style={styles.rightAction}>
        {rightAction}
        {showProfile && (
          <Pressable
            onPress={() =
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel="Button"
        accessibilityHint="Double tap to activate"
      > navigation.navigate('Profile')}
            accessibilityLabel="Go to profile"
            accessibilityRole="button"
          >
            <Avatar
              size="small"
              name="John Doe"
              style={styles.avatar}
            />
          </Pressable>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 56,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  leftAction: {
    flex: 1,
    alignItems: 'flex-start',
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  title: {
    flex: 2,
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  rightAction: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  avatar: {
    marginLeft: 8,
  },
});

export default Header;

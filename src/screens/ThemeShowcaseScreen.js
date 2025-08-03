import React, { useMemo, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  BackHandler,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../contexts/ThemeContext';

const ThemeShowcaseScreen = () => {
  const { theme, isDarkMode, toggleTheme } = useTheme();
  const navigation = useNavigation();

  // Handle hardware back button on Android
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        if (navigation.canGoBack()) {
          navigation.goBack();
          return true;
        }
        return false;
      }
    );

    return () => backHandler.remove();
  }, [navigation]);

  const ColorPalette = ({ title, colors, isObjectColors = false }) => {
    const colorItems = useMemo(() => {
      return Object.entries(colors).map(([key, value]) => (
        <View key={key} style={styles.colorItem}>
          <View 
            style={[
              styles.colorSwatch, 
              { backgroundColor: value }
            ]} 
          />
          <Text style={[styles.colorLabel, { color: theme.colors.text.secondary }]}>
            {key}
          </Text>
        </View>
      ));
    }, [colors, theme.colors.text.secondary]);

    return (
      <View style={[styles.section, { backgroundColor: theme.colors.background.card }]}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
          {title}
        </Text>
        <View style={styles.colorGrid}>
          {colorItems}
        </View>
    </View>
  );

  const TypographyShowcase = () => (
    <View style={[styles.section, { backgroundColor: theme.colors.background.card }]}>
      <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
        Typography Scale
      </Text>
      <Text style={[styles.typeExample, { 
        fontSize: theme.typography.sizes['8xl'], 
        color: theme.colors.text.primary,
        fontWeight: theme.typography.weights.bold,
      }]}>
        Heading 1
      </Text>
      <Text style={[styles.typeExample, { 
        fontSize: theme.typography.sizes['6xl'], 
        color: theme.colors.text.primary,
        fontWeight: theme.typography.weights.semiBold,
      }]}>
        Heading 2
      </Text>
      <Text style={[styles.typeExample, { 
        fontSize: theme.typography.sizes['4xl'], 
        color: theme.colors.text.primary,
        fontWeight: theme.typography.weights.medium,
      }]}>
        Heading 3
      </Text>
      <Text style={[styles.typeExample, { 
        fontSize: theme.typography.sizes.xl, 
        color: theme.colors.text.primary,
        fontWeight: theme.typography.weights.normal,
      }]}>
        Body Large - Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      </Text>
      <Text style={[styles.typeExample, { 
        fontSize: theme.typography.sizes.base, 
        color: theme.colors.text.secondary,
        fontWeight: theme.typography.weights.normal,
      }]}>
        Body Regular - Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
      </Text>
      <Text style={[styles.typeExample, { 
        fontSize: theme.typography.sizes.sm, 
        color: theme.colors.text.tertiary,
        fontWeight: theme.typography.weights.normal,
      }]}>
        Body Small - Ut enim ad minim veniam, quis nostrud exercitation.
      </Text>
    </View>
  );

  const ComponentShowcase = () => (
    <View style={[styles.section, { backgroundColor: theme.colors.background.card }]}>
      <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
        UI Components
      </Text>
      
      {/* Buttons */}
      <View style={styles.buttonGrid}>
        <TouchableOpacity 
          style={[
            styles.button, 
            styles.primaryButton,
            { backgroundColor: theme.colors.primary[500], minWidth: 44, minHeight: 44 }
          ]}
        
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel="Primary"
        accessibilityHint="Double tap to activate"
      >
          <Text style={[styles.buttonText, { color: theme.colors.text.inverse }]}>
            Primary
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[[
            styles.button, 
            styles.secondaryButton,
            { 
              backgroundColor: theme.colors.secondary[500],
              borderColor: theme.colors.secondary[500] 
            , { minWidth: 44, minHeight: 44 }]}
          ]}
        
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel="Secondary"
        accessibilityHint="Double tap to activate"
      >
          <Text style={[styles.buttonText, { color: theme.colors.text.inverse }]}>
            Secondary
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[[
            styles.button, 
            styles.outlineButton,
            { 
              backgroundColor: 'transparent',
              borderColor: theme.colors.border.primary,
              borderWidth: 1 
            , { minWidth: 44, minHeight: 44 }]}
          ]}
        
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel="Outline"
        accessibilityHint="Double tap to activate"
      >
          <Text style={[styles.buttonText, { color: theme.colors.text.primary }]}>
            Outline
          </Text>
        </TouchableOpacity>
      </View>

      {/* Cards */}
      <View style={[
        styles.card,
        { 
          backgroundColor: theme.colors.background.card,
          borderColor: theme.colors.border.primary,
          ...theme.shadows.md,
        }
      ]}>
        <Text style={[styles.cardTitle, { color: theme.colors.text.primary }]}>
          Mental Health Card
        </Text>
        <Text style={[styles.cardContent, { color: theme.colors.text.secondary }]}>
          This card demonstrates the new light mode design inspired by the Freud UI Kit with proper contrast ratios and therapeutic colors.
        </Text>
        <TouchableOpacity 
          style={[[
            styles.cardButton,
            { backgroundColor: theme.colors.therapeutic.calming[500] , { minWidth: 44, minHeight: 44 }]}
          ]}
        
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel="Learn More"
        accessibilityHint="Double tap to activate"
      >
          <Text style={[styles.cardButtonText, { color: theme.colors.text.inverse }]}>
            Learn More
          </Text>
        </TouchableOpacity>
      </View>

      {/* Input Fields */}
      <View style={styles.inputContainer}>
        <Text style={[styles.inputLabel, { color: theme.colors.text.primary }]}>
          Input Field
        </Text>
        <View style={[
          styles.input,
          { 
            backgroundColor: theme.colors.background.input,
            borderColor: theme.colors.border.primary,
          }
        ]}>
          <Text style={[styles.inputText, { color: theme.colors.text.placeholder }]}>
            Enter your thoughts here...
          </Text>
        </View>
      </View>
    </View>
  );

  const MoodShowcase = () => {
    const moodButtons = useMemo(() => {
      return Object.entries(theme.colors.mood).map(([mood, color]) => (
        <TouchableOpacity 
          key={mood} 
          style={[
            styles.moodButton,
            { 
              backgroundColor: color, 
              borderColor: theme.colors.border.muted,
              minWidth: 44, 
              minHeight: 44 
            }
          ]}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel={mood}
          accessibilityHint="Tap to select this mood"
        >
          <Text style={[styles.moodText, { color: theme.colors.text.primary }]}>
            {mood}
          </Text>
        </TouchableOpacity>
      ));
    }, [theme.colors.mood, theme.colors.border.muted, theme.colors.text.primary]);

    return (
      <View style={[styles.section, { backgroundColor: theme.colors.background.card }]}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
          Mood Palette
        </Text>
        <View style={styles.moodGrid}>
          {moodButtons}
        </View>
      </View>
    );
  };

  const TherapeuticShowcase = () => {
    const therapeuticItems = useMemo(() => {
      return Object.entries(theme.colors.therapeutic).map(([type, colors]) => (
        <View key={type} style={styles.therapeuticItem}>
          <Text style={[styles.therapeuticLabel, { color: theme.colors.text.primary }]}>
            {type}
          </Text>
          <View style={styles.therapeuticSwatches}>
            {Object.entries(colors).map(([shade, color]) => (
              <View 
                key={shade}
                style={[
                  styles.therapeuticSwatch,
                  { backgroundColor: color }
                ]}
              />
            ))}
          </View>
        </View>
      ));
    }, [theme.colors.therapeutic, theme.colors.text.primary]);

    return (
      <View style={[styles.section, { backgroundColor: theme.colors.background.card }]}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
          Therapeutic Colors
        </Text>
        <View style={styles.therapeuticGrid}>
          {therapeuticItems}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background.primary }]}>
      <View style={[styles.header, { backgroundColor: theme.colors.background.primary }]}>
        <Text style={[styles.title, { color: theme.colors.text.primary }]}>
          Freud UI Kit Light Mode
        </Text>
        <TouchableOpacity 
          style={[[
            styles.themeToggle,
            { backgroundColor: theme.colors.primary[500] , { minWidth: 44, minHeight: 44 }]}
          ]}
          onPress={toggleTheme}
        
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel="{isDarkMode ? '☀️ Light' : '🌙 Dark'}"
        accessibilityHint="Double tap to activate"
      >
          <Text style={[styles.toggleText, { color: theme.colors.text.inverse }]}>
            {isDarkMode ? '☀️ Light' : '🌙 Dark'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <ColorPalette title="Primary Colors" colors={theme.colors.primary} />
        <ColorPalette title="Secondary Colors" colors={theme.colors.secondary} />
        <ColorPalette title="Neutral Colors" colors={theme.colors.gray} />
        <ColorPalette 
          title="Status Colors" 
          colors={{
            success: theme.colors.success[500],
            warning: theme.colors.warning[500],
            error: theme.colors.error[500],
          }}
          isObjectColors={true}
        />
        
        <TypographyShowcase />
        <ComponentShowcase />
        <MoodShowcase />
        <TherapeuticShowcase />
      </ScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.primary,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  themeToggle: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 22,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  section: {
    marginHorizontal: 16,
    marginTop: 20,
    padding: 20,
    borderRadius: 22,
    shadowColor: theme.colors.text.primary,
    shadowOffset: { width: 44, height: 44 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  colorItem: {
    alignItems: 'center',
    marginBottom: 8,
  },
  colorSwatch: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginBottom: 6,
    shadowColor: theme.colors.text.primary,
    shadowOffset: { width: 44, height: 44 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  colorLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  typeExample: {
    marginBottom: 12,
  },
  buttonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  button: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    minWidth: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButton: {
    shadowColor: theme.colors.text.primary,
    shadowOffset: { width: 44, height: 44 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  secondaryButton: {
    shadowColor: theme.colors.text.primary,
    shadowOffset: { width: 44, height: 44 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  outlineButton: {
    backgroundColor: 'transparent',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  card: {
    padding: 20,
    borderRadius: 22,
    borderWidth: 1,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  cardContent: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  cardButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  cardButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    minHeight: 44,
    justifyContent: 'center',
  },
  inputText: {
    fontSize: 16,
  },
  moodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  moodButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 22,
    borderWidth: 1,
    marginBottom: 8,
  },
  moodText: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  therapeuticGrid: {
    gap: 16,
  },
  therapeuticItem: {
    alignItems: 'center',
  },
  therapeuticLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    textTransform: 'capitalize',
  },
  therapeuticSwatches: {
    flexDirection: 'row',
    gap: 4,
  },
  therapeuticSwatch: {
    width: 44, height: 44,
    borderRadius: 22,
    shadowColor: theme.colors.text.primary,
    shadowOffset: { width: 44, height: 44 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
});

export default ThemeShowcaseScreen;

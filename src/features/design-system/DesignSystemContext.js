import React, { createContext, useContext, useState, useEffect } from 'react';
import { BaseDesignTokens, DesignSystemManager, PredefinedThemes } from './DesignTokens';

const DesignSystemContext = createContext({
  designTokens: BaseDesignTokens,
  currentTheme: 'default',
  customizations: {},
  setTheme: () => {},
  updateTokens: () => {},
  resetToDefault: () => {},
  saveCustomization: () => {},
  loadCustomization: () => {},
  isLoading: false,
});

export const useDesignSystem = () => {
  const context = useContext(DesignSystemContext);
  if (!context) {
    throw new Error('useDesignSystem must be used within a DesignSystemProvider');
  }
  return context;
};

export const DesignSystemProvider = ({ children }) => {
  const [designTokens, setDesignTokens] = useState(BaseDesignTokens);
  const [currentTheme, setCurrentTheme] = useState('default');
  const [customizations, setCustomizations] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSavedCustomizations();
  }, []);

  const loadSavedCustomizations = async () => {
    setIsLoading(true);
    try {
      const savedCustomizations = await DesignSystemManager.loadCustomTokens();
      if (savedCustomizations) {
        setCustomizations(savedCustomizations);
        const mergedTokens = DesignSystemManager.mergeTokens(
          BaseDesignTokens, 
          savedCustomizations
        );
        setDesignTokens(mergedTokens);
        setCurrentTheme(savedCustomizations.themeName || 'default');
      }
    } catch (error) {
      console.error('Error loading design system customizations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const setTheme = async (themeName) => {
    try {
      const themedTokens = DesignSystemManager.applyPredefinedTheme(
        BaseDesignTokens, 
        themeName
      );
      
      const mergedTokens = DesignSystemManager.mergeTokens(
        themedTokens, 
        customizations
      );
      
      setDesignTokens(mergedTokens);
      setCurrentTheme(themeName);
      
      // Save the theme selection
      const updatedCustomizations = {
        ...customizations,
        themeName,
      };
      
      setCustomizations(updatedCustomizations);
      await DesignSystemManager.saveCustomTokens(updatedCustomizations);
    } catch (error) {
      console.error('Error setting theme:', error);
    }
  };

  const updateTokens = async (tokenUpdates) => {
    try {
      const updatedCustomizations = {
        ...customizations,
        ...tokenUpdates,
      };
      
      const mergedTokens = DesignSystemManager.mergeTokens(
        BaseDesignTokens, 
        updatedCustomizations
      );
      
      // Apply current theme if set
      const finalTokens = currentTheme !== 'default' 
        ? DesignSystemManager.applyPredefinedTheme(mergedTokens, currentTheme)
        : mergedTokens;
      
      setDesignTokens(finalTokens);
      setCustomizations(updatedCustomizations);
      
      await DesignSystemManager.saveCustomTokens(updatedCustomizations);
    } catch (error) {
      console.error('Error updating design tokens:', error);
    }
  };

  const resetToDefault = async () => {
    try {
      await DesignSystemManager.resetToDefault();
      setDesignTokens(BaseDesignTokens);
      setCurrentTheme('default');
      setCustomizations({});
    } catch (error) {
      console.error('Error resetting to default:', error);
    }
  };

  const saveCustomization = async (customizationData) => {
    try {
      const updatedCustomizations = {
        ...customizations,
        ...customizationData,
      };
      
      setCustomizations(updatedCustomizations);
      await DesignSystemManager.saveCustomTokens(updatedCustomizations);
      return true;
    } catch (error) {
      console.error('Error saving customization:', error);
      return false;
    }
  };

  const loadCustomization = async () => {
    return await loadSavedCustomizations();
  };

  // Helper function to get a token value by path (e.g., 'colors.primary.500')
  const getToken = (path) => {
    return path.split('.').reduce((obj, key) => obj?.[key], designTokens);
  };

  // Helper function to resolve design token references
  const resolveTokenValue = (value) => {
    if (typeof value === 'string' && value.includes('.')) {
      // Check if it's a token reference (e.g., 'primary.500')
      const tokenValue = getToken(value);
      return tokenValue || value;
    }
    return value;
  };

  const contextValue = {
    designTokens,
    currentTheme,
    customizations,
    setTheme,
    updateTokens,
    resetToDefault,
    saveCustomization,
    loadCustomization,
    isLoading,
    getToken,
    resolveTokenValue,
    predefinedThemes: PredefinedThemes,
  };

  return (
    <DesignSystemContext.Provider value={contextValue}>
      {children}
    </DesignSystemContext.Provider>
  );
};

export default DesignSystemProvider;
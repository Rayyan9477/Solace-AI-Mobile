import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import SimpleCard from '../ui/SimpleCard';

// DEPRECATED: ModernCard has been replaced with professional SimpleCard
// This component now redirects to SimpleCard for production-ready UI
const ModernCard = ({ children, title, subtitle, ...props }) => {
  // Show deprecation warning in development
  if (__DEV__) {
    console.warn(
      'ModernCard is deprecated and has been replaced with SimpleCard for professional UI. ' +
      'Please use SimpleCard instead for production-ready mental health app design.'
    );
  }

  // Redirect to professional SimpleCard component
  return (
    <SimpleCard title={title} subtitle={subtitle} {...props}>
      {children}
    </SimpleCard>
  );
};

export default ModernCard;
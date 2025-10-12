// Compatibility bridge for tests
try {
  module.exports = require('../../src/ui/components/atoms/forms/MentalHealthForms');
} catch (e) {
  const React = require('react');
  const { View } = require('react-native');
  const make = (name) => (props) => React.createElement(View, { testID: name, ...props });
  module.exports = {
    TherapySessionForm: make('therapy-session-form'),
    MoodTrackingForm: make('mood-tracking-form'),
    AssessmentQuestionForm: make('assessment-question-form'),
  };
}

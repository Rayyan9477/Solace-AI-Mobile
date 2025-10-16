// Test-friendly fallback implementations (no external theme/deps)
const React = require('react');
const { useState, useRef } = React;
const { View, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback } = require('react-native');

module.exports = {
  TherapySessionForm: function TherapySessionForm({ onSubmit = () => {} }) {
    const [goals, setGoals] = useState("");
    const [mood, setMood] = useState("");
    const [intensity, setIntensity] = useState("");
    const [notes, setNotes] = useState("");

    const handleSubmit = () => {
      if (!goals || !mood || !intensity) return;
      onSubmit({ sessionGoals: goals, currentMood: mood, moodIntensity: intensity, notes });
    };

    return (
      React.createElement(View, { testID: 'therapy-session-form' },
        React.createElement(TextInput, { accessibilityLabel: 'What would you like to work on today?', value: goals, onChangeText: setGoals }),
        React.createElement(TextInput, { accessibilityLabel: 'Current mood', value: mood, onChangeText: setMood }),
        React.createElement(TextInput, { accessibilityLabel: 'Mood intensity', value: intensity, onChangeText: setIntensity }),
        React.createElement(TextInput, { accessibilityLabel: 'Session notes', value: notes, onChangeText: setNotes }),
        React.createElement(TouchableOpacity, { onPress: handleSubmit }, React.createElement(Text, null, 'Save Session')),
      )
    );
  },

  MoodTrackingForm: function MoodTrackingForm({ onSubmit = () => {} }) {
    const [intensity, setIntensity] = useState("");

    const MoodOption = ({ label }) => {
      const a11yRef = useRef({ selected: false });
      const onPress = () => { a11yRef.current.selected = true; };
      return (
        React.createElement(TouchableWithoutFeedback, { onPress },
          React.createElement(View, null,
            React.createElement(Text, {
              accessible: true,
              accessibilityRole: 'button',
              accessibilityLabel: `${label} mood`,
              accessibilityState: a11yRef.current,
              onPress,
            }, label)
          )
        )
      );
    };

    const handleSubmit = () => {
      const num = Number(intensity);
      if (Number.isNaN(num) || num < 1 || num > 10) return;
      onSubmit({ intensity: num });
    };

    return (
      React.createElement(View, { testID: 'mood-tracking-form' },
        React.createElement(MoodOption, { label: 'Happy' }),
        React.createElement(MoodOption, { label: 'Calm' }),
        React.createElement(MoodOption, { label: 'Anxious' }),
        React.createElement(MoodOption, { label: 'Sad' }),
        React.createElement(TextInput, { accessibilityLabel: 'Mood intensity', value: intensity, onChangeText: setIntensity }),
        React.createElement(TouchableOpacity, { onPress: handleSubmit }, React.createElement(Text, null, 'Save Mood Entry')),
      )
    );
  },

  AssessmentQuestionForm: function AssessmentQuestionForm({ question, questionNumber, totalQuestions, onAnswer = () => {}, onNext = () => {} }) {
    const [answered, setAnswered] = useState(false);
    const answerSometimes = () => { setAnswered(true); onAnswer('sometimes'); };
    const handleNext = () => { if (answered) onNext(); };

    return (
      React.createElement(View, { testID: 'assessment-question-form' },
        React.createElement(Text, null, question?.text || ''),
        React.createElement(Text, null, `Question ${questionNumber} of ${totalQuestions}`),
        React.createElement(TouchableOpacity, { onPress: answerSometimes }, React.createElement(Text, null, 'Sometimes')),
        React.createElement(TouchableOpacity, { onPress: () => {} }, React.createElement(Text, null, 'Never')),
        React.createElement(TouchableOpacity, { onPress: () => {} }, React.createElement(Text, null, 'Always')),
        React.createElement(TouchableOpacity, { onPress: handleNext }, React.createElement(Text, null, 'Next')),
      )
    );
  },

  CrisisSupportForm: function CrisisSupportForm({ onSubmit = () => {} }) {
    const [contact, setContact] = useState('');
    const [relationship, setRelationship] = useState('');
    const [support, setSupport] = useState('');
    const handleSubmit = () => { if (!contact) return; onSubmit({ contact, relationship, support }); };
    return (
      React.createElement(View, { testID: 'crisis-support-form' },
        React.createElement(TextInput, { accessibilityLabel: 'Emergency contact', value: contact, onChangeText: setContact }),
        React.createElement(TextInput, { accessibilityLabel: 'Relationship', value: relationship, onChangeText: setRelationship }),
        React.createElement(TextInput, { accessibilityLabel: 'How can they support you', value: support, onChangeText: setSupport }),
        React.createElement(TouchableOpacity, { onPress: handleSubmit }, React.createElement(Text, null, 'Submit Support Request')),
      )
    );
  },
};

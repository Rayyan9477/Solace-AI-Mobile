import React from 'react';
import styled from 'styled-components';
import { useTheme } from './theme';

const AppContainer = styled.div`
  min-height: 100vh;
  background-color: ${props => props.theme.colors.background.primary};
  color: ${props => props.theme.colors.text.primary};
  transition: all 0.3s ease;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
`;

const Header = styled.header`
  background-color: ${props => props.theme.colors.background.secondary};
  padding: ${props => props.theme.spacing[6]};
  border-bottom: 1px solid ${props => props.theme.colors.border.primary};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 2rem;
  font-weight: 700;
  color: ${props => props.theme.colors.primary[600]};
`;

const ThemeToggle = styled.button`
  background-color: ${props => props.theme.colors.primary[500]};
  color: ${props => props.theme.colors.text.inverse};
  border: none;
  padding: ${props => props.theme.spacing[3]} ${props => props.theme.spacing[4]};
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 600;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => props.theme.colors.primary[600]};
    transform: translateY(-1px);
  }
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${props => props.theme.spacing[8]};
`;

const Section = styled.section`
  margin-bottom: ${props => props.theme.spacing[12]};
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: ${props => props.theme.spacing[6]};
  color: ${props => props.theme.colors.text.primary};
`;

const ColorGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${props => props.theme.spacing[6]};
  margin-bottom: ${props => props.theme.spacing[8]};
`;

const ColorCard = styled.div`
  background-color: ${props => props.theme.colors.background.secondary};
  border: 1px solid ${props => props.theme.colors.border.primary};
  border-radius: 12px;
  padding: ${props => props.theme.spacing[6]};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const ColorTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: ${props => props.theme.spacing[4]};
  color: ${props => props.theme.colors.text.primary};
`;

const ColorSwatches = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: ${props => props.theme.spacing[2]};
`;

const ColorSwatch = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 6px;
  background-color: ${props => props.color};
  border: 1px solid ${props => props.theme.colors.border.secondary};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  color: ${props => props.textColor || 'transparent'};
  font-weight: 600;
`;

const MoodColorGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: ${props => props.theme.spacing[4]};
`;

const MoodCard = styled.div`
  background-color: ${props => props.color};
  border-radius: 12px;
  padding: ${props => props.theme.spacing[4]};
  text-align: center;
  border: 1px solid ${props => props.theme.colors.border.primary};
`;

const MoodLabel = styled.div`
  font-size: 0.9rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text.primary};
  margin-top: ${props => props.theme.spacing[2]};
`;

const ComponentDemo = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${props => props.theme.spacing[6]};
`;

const DemoCard = styled.div`
  background-color: ${props => props.theme.colors.background.secondary};
  border: 1px solid ${props => props.theme.colors.border.primary};
  border-radius: 12px;
  padding: ${props => props.theme.spacing[6]};
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Button = styled.button`
  background-color: ${props => props.theme.colors[props.variant || 'primary'][500]};
  color: ${props => props.theme.colors.text.inverse};
  border: none;
  padding: ${props => props.theme.spacing[3]} ${props => props.theme.spacing[6]};
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 600;
  margin: ${props => props.theme.spacing[2]};
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => props.theme.colors[props.variant || 'primary'][600]};
    transform: translateY(-1px);
  }
`;

const Input = styled.input`
  width: 100%;
  padding: ${props => props.theme.spacing[3]};
  border: 1px solid ${props => props.theme.colors.border.primary};
  border-radius: 8px;
  background-color: ${props => props.theme.colors.background.primary};
  color: ${props => props.theme.colors.text.primary};
  font-size: 0.9rem;
  margin: ${props => props.theme.spacing[2]} 0;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary[500]};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary[100]};
  }
  
  &::placeholder {
    color: ${props => props.theme.colors.text.tertiary};
  }
`;

const ThemePreview = () => {
  const { theme, isDarkMode, toggleTheme } = useTheme();

  const renderColorPalette = (colorName, colors) => (
    <ColorCard key={colorName} theme={theme}>
      <ColorTitle theme={theme}>{colorName.charAt(0).toUpperCase() + colorName.slice(1)}</ColorTitle>
      <ColorSwatches theme={theme}>
        {Object.entries(colors).map(([shade, color]) => (
          <ColorSwatch
            key={shade}
            color={color}
            theme={theme}
            textColor={shade >= 500 ? '#fff' : '#000'}
          >
            {shade}
          </ColorSwatch>
        ))}
      </ColorSwatches>
    </ColorCard>
  );

  return (
    <AppContainer theme={theme}>
      <Header theme={theme}>
        <Title theme={theme}>🧠 Solace AI - Theme Preview</Title>
        <ThemeToggle theme={theme} onClick={toggleTheme}>
          {isDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </ThemeToggle>
      </Header>
      
      <Container theme={theme}>
        <Section theme={theme}>
          <SectionTitle theme={theme}>Color Palette</SectionTitle>
          <ColorGrid theme={theme}>
            {renderColorPalette('primary', theme.colors.primary)}
            {renderColorPalette('secondary', theme.colors.secondary)}
            {renderColorPalette('success', theme.colors.success)}
            {renderColorPalette('warning', theme.colors.warning)}
            {renderColorPalette('error', theme.colors.error)}
            {renderColorPalette('gray', theme.colors.gray)}
          </ColorGrid>
        </Section>

        <Section theme={theme}>
          <SectionTitle theme={theme}>Mood Colors</SectionTitle>
          <MoodColorGrid theme={theme}>
            {Object.entries(theme.colors.mood).map(([mood, color]) => (
              <MoodCard key={mood} color={color} theme={theme}>
                <div style={{ fontSize: '2rem' }}>
                  {mood === 'happy' ? '😊' : mood === 'calm' ? '😌' : mood === 'anxious' ? '😰' : 
                   mood === 'sad' ? '😢' : mood === 'angry' ? '😠' : mood === 'neutral' ? '😐' :
                   mood === 'excited' ? '🤩' : mood === 'tired' ? '😴' : mood === 'stressed' ? '😓' : '😊'}
                </div>
                <MoodLabel theme={theme}>{mood.charAt(0).toUpperCase() + mood.slice(1)}</MoodLabel>
              </MoodCard>
            ))}
          </MoodColorGrid>
        </Section>

        <Section theme={theme}>
          <SectionTitle theme={theme}>Component Previews</SectionTitle>
          <ComponentDemo theme={theme}>
            <DemoCard theme={theme}>
              <h4 style={{ margin: `0 0 ${theme.spacing[4]} 0`, color: theme.colors.text.primary }}>
                Buttons
              </h4>
              <Button theme={theme} variant="primary">Primary Button</Button>
              <Button theme={theme} variant="secondary">Secondary Button</Button>
              <Button theme={theme} variant="success">Success Button</Button>
              <Button theme={theme} variant="warning">Warning Button</Button>
              <Button theme={theme} variant="error">Error Button</Button>
            </DemoCard>

            <DemoCard theme={theme}>
              <h4 style={{ margin: `0 0 ${theme.spacing[4]} 0`, color: theme.colors.text.primary }}>
                Form Elements
              </h4>
              <Input theme={theme} placeholder="Enter your name" />
              <Input theme={theme} placeholder="Enter your email" type="email" />
              <Input theme={theme} placeholder="Enter your message" />
            </DemoCard>

            <DemoCard theme={theme}>
              <h4 style={{ margin: `0 0 ${theme.spacing[4]} 0`, color: theme.colors.text.primary }}>
                Typography
              </h4>
              <h1 style={{ color: theme.colors.text.primary, fontSize: '2rem', margin: `${theme.spacing[2]} 0` }}>
                Heading 1
              </h1>
              <h2 style={{ color: theme.colors.text.primary, fontSize: '1.5rem', margin: `${theme.spacing[2]} 0` }}>
                Heading 2
              </h2>
              <p style={{ color: theme.colors.text.secondary, margin: `${theme.spacing[2]} 0` }}>
                This is a paragraph with secondary text color for better hierarchy.
              </p>
              <p style={{ color: theme.colors.text.tertiary, fontSize: '0.9rem', margin: `${theme.spacing[2]} 0` }}>
                This is smaller tertiary text used for less important information.
              </p>
            </DemoCard>

            <DemoCard theme={theme}>
              <h4 style={{ margin: `0 0 ${theme.spacing[4]} 0`, color: theme.colors.text.primary }}>
                Mental Health Features
              </h4>
              <div style={{ 
                background: theme.colors.mood.calm, 
                padding: theme.spacing[4], 
                borderRadius: '8px', 
                marginBottom: theme.spacing[3],
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: theme.spacing[2] }}>😌</div>
                <div style={{ color: theme.colors.text.primary, fontWeight: '600' }}>Feeling Calm</div>
              </div>
              <div style={{ 
                background: theme.colors.mood.happy, 
                padding: theme.spacing[4], 
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: theme.spacing[2] }}>😊</div>
                <div style={{ color: theme.colors.text.primary, fontWeight: '600' }}>Feeling Happy</div>
              </div>
            </DemoCard>
          </ComponentDemo>
        </Section>

        <Section theme={theme}>
          <SectionTitle theme={theme}>Theme Information</SectionTitle>
          <DemoCard theme={theme}>
            <h4 style={{ margin: `0 0 ${theme.spacing[4]} 0`, color: theme.colors.text.primary }}>
              Current Theme: {isDarkMode ? 'Dark Mode 🌙' : 'Light Mode ☀️'}
            </h4>
            <p style={{ color: theme.colors.text.secondary, margin: `${theme.spacing[2]} 0` }}>
              <strong>Features:</strong>
            </p>
            <ul style={{ color: theme.colors.text.secondary, paddingLeft: theme.spacing[6] }}>
              <li>🎨 Freud UI Kit inspired color palette</li>
              <li>♿ WCAG AA accessibility compliant</li>
              <li>💚 Mental health focused design</li>
              <li>🌙 Complete dark mode support</li>
              <li>🎭 Mood-based color system</li>
              <li>🧘 Therapeutic color choices</li>
              <li>⚡ Smooth theme transitions</li>
              <li>📱 Mobile-first design system</li>
            </ul>
          </DemoCard>
        </Section>
      </Container>
    </AppContainer>
  );
};

export default ThemePreview;

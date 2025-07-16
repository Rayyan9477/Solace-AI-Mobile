// scripts/fix-form-validation.js
const fs = require('fs');
const path = require('path');

// Track changes
let totalFixed = 0;
const fixedFiles = [];

// Check if file needs form validation
function needsFormValidation(content) {
  const hasInput = /<(TextInput|Input)[^>]*>/g.test(content);
  const hasValidation = /validate|validation|error|isValid|setError|yup|formik/i.test(content);
  
  return hasInput && !hasValidation;
}

// Validation patterns
const validationRules = {
  email: {
    pattern: /type=['"]email['"]|placeholder=['"][^"']*email[^"']*['"]/i,
    validator: `
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return 'Email is required';
    if (!emailRegex.test(email)) return 'Please enter a valid email address';
    return '';
  };`
  },
  password: {
    pattern: /type=['"]password['"]|secureTextEntry|placeholder=['"][^"']*password[^"']*['"]/i,
    validator: `
  const validatePassword = (password) => {
    if (!password) return 'Password is required';
    if (password.length < 8) return 'Password must be at least 8 characters';
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      return 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
    }
    return '';
  };`
  },
  required: {
    pattern: /required|placeholder=['"][^"']*name[^"']*['"]|placeholder=['"][^"']*text[^"']*['"]/i,
    validator: `
  const validateRequired = (value, fieldName = 'Field') => {
    if (!value || value.trim() === '') return \`\${fieldName} is required\`;
    return '';
  };`
  }
};

// Add validation state to component
function addValidationState(content, filePath) {
  let modifiedContent = content;
  let changesMade = false;
  
  // Extract component name
  const componentNameMatch = filePath.match(/([^/\\]+)\.(js|jsx)$/);
  const componentName = componentNameMatch ? componentNameMatch[1] : 'Component';
  
  // Find functional component pattern
  const functionalComponentRegex = new RegExp(`const\\s+${componentName}\\s*=\\s*\\([^)]*\\)\\s*=>\\s*{`);
  let match = modifiedContent.match(functionalComponentRegex);
  
  if (!match) {
    // Try alternative patterns
    const altPattern = /const\s+\w+\s*=\s*\([^)]*\)\s*=>\s*{/;
    match = modifiedContent.match(altPattern);
  }
  
  if (match) {
    const componentStart = modifiedContent.indexOf(match[0]);
    const bodyStart = modifiedContent.indexOf('{', componentStart) + 1;
    
    // Detect input types and add appropriate validation
    let validators = [];
    let errorStates = [];
    
    // Check for email inputs
    if (validationRules.email.pattern.test(modifiedContent)) {
      validators.push(validationRules.email.validator);
      errorStates.push('const [emailError, setEmailError] = React.useState(\'\');');
    }
    
    // Check for password inputs
    if (validationRules.password.pattern.test(modifiedContent)) {
      validators.push(validationRules.password.validator);
      errorStates.push('const [passwordError, setPasswordError] = React.useState(\'\');');
    }
    
    // Check for other required fields
    if (validationRules.required.pattern.test(modifiedContent)) {
      validators.push(validationRules.required.validator);
      errorStates.push('const [fieldErrors, setFieldErrors] = React.useState({});');
    }
    
    if (validators.length > 0) {
      // Add validation states and functions
      const validationCode = `
  // Validation states
  ${errorStates.join('\n  ')}
  
  // Validation functions
  ${validators.join('\n  ')}
  
  // Validate all fields
  const validateForm = () => {
    let isValid = true;
    const errors = {};
    
    // Add specific validation calls based on detected inputs
    ${validationRules.email.pattern.test(modifiedContent) ? `
    const emailErr = validateEmail(email || '');
    if (emailErr) {
      setEmailError(emailErr);
      isValid = false;
    } else {
      setEmailError('');
    }` : ''}
    
    ${validationRules.password.pattern.test(modifiedContent) ? `
    const passwordErr = validatePassword(password || '');
    if (passwordErr) {
      setPasswordError(passwordErr);
      isValid = false;
    } else {
      setPasswordError('');
    }` : ''}
    
    return isValid;
  };
`;
      
      // Insert validation code after component body start
      const beforeBody = modifiedContent.substring(0, bodyStart);
      const afterBody = modifiedContent.substring(bodyStart);
      
      modifiedContent = beforeBody + validationCode + afterBody;
      changesMade = true;
      
      // Add error display to JSX
      const returnPattern = /return\s*\(\s*(<[\s\S]+?>[\s\S]+?<\/[\s\S]+?>)\s*\)/;
      const returnMatch = modifiedContent.match(returnPattern);
      
      if (returnMatch) {
        const jsxContent = returnMatch[1];
        
        // Find TextInput components and add error styling
        let modifiedJSX = jsxContent;
        
        // Add error text components after inputs
        if (validationRules.email.pattern.test(modifiedContent)) {
          modifiedJSX = modifiedJSX.replace(
            /<TextInput[^>]*type=['"]email['"][^>]*>/g,
            (match) => {
              return `${match}
        {emailError ? (
          <Text style={{ color: 'red', fontSize: 12, marginTop: 4 }}>
            {emailError}
          </Text>
        ) : null}`;
            }
          );
        }
        
        if (validationRules.password.pattern.test(modifiedContent)) {
          modifiedJSX = modifiedJSX.replace(
            /<TextInput[^>]*secureTextEntry[^>]*>/g,
            (match) => {
              return `${match}
        {passwordError ? (
          <Text style={{ color: 'red', fontSize: 12, marginTop: 4 }}>
            {passwordError}
          </Text>
        ) : null}`;
            }
          );
        }
        
        const modifiedReturn = `return (
    ${modifiedJSX}
  )`;
        
        modifiedContent = modifiedContent.replace(returnMatch[0], modifiedReturn);
      }
      
      // Update submit/onPress handlers to include validation
      modifiedContent = modifiedContent.replace(
        /onPress=\{[^}]*submit[^}]*\}/gi,
        (match) => {
          if (match.includes('validateForm')) {
            return match; // Already has validation
          }
          
          const funcName = match.match(/onPress=\{([^}]+)\}/)?.[1];
          if (funcName) {
            return `onPress={() => {
              if (validateForm()) {
                ${funcName}();
              }
            }}`;
          }
          return match;
        }
      );
    }
  }
  
  return { content: modifiedContent, changesMade };
}

// Fix form validation in a file
function fixFormValidationInFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;
    
    // Check if file needs fixing
    if (!needsFormValidation(content)) {
      return;
    }
    
    // Add validation
    const { content: modifiedContent, changesMade } = addValidationState(content, filePath);
    content = modifiedContent;
    
    // Write changes if any were made
    if (changesMade && content !== originalContent) {
      fs.writeFileSync(filePath, content);
      totalFixed++;
      fixedFiles.push(filePath);
      console.log(`✅ Fixed form validation in: ${filePath}`);
    }
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
  }
}

// Process directory recursively
function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && !file.includes('node_modules') && !file.startsWith('.')) {
      processDirectory(filePath);
    } else if ((file.endsWith('.js') || file.endsWith('.jsx')) && !file.includes('.test.')) {
      fixFormValidationInFile(filePath);
    }
  });
}

// Main execution
console.log('🔧 Starting Form Validation Fix...\n');

const srcDir = path.join(__dirname, '..', 'src');
if (fs.existsSync(srcDir)) {
  processDirectory(srcDir);
  
  console.log('\n📊 Summary:');
  console.log(`Total files fixed: ${totalFixed}`);
  
  if (fixedFiles.length > 0) {
    console.log('\n📝 Fixed files:');
    fixedFiles.forEach(file => {
      console.log(`  - ${file}`);
    });
  }
  
  console.log('\n✨ Form validation fix completed!');
} else {
  console.error('❌ Source directory not found!');
  process.exit(1);
} 
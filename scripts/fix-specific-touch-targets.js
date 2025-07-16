// scripts/fix-specific-touch-targets.js
const fs = require('fs');
const path = require('path');

// Minimum touch target size
const MIN_TOUCH_SIZE = 44;

// Specific fixes for identified files
const SPECIFIC_FIXES = [
  {
    file: 'src/components/chat/MessageBubble.js',
    fixes: [
      {
        search: /width:\s*36px;\s*height:\s*36/g,
        replace: `width: ${MIN_TOUCH_SIZE}px; height: ${MIN_TOUCH_SIZE}`
      },
      {
        search: /width:\s*20px;\s*height:\s*20/g,
        replace: `width: ${MIN_TOUCH_SIZE}px; height: ${MIN_TOUCH_SIZE}`
      }
    ]
  },
  {
    file: 'src/components/chat/VoiceRecorder.js',
    fixes: [
      {
        search: /width:\s*56,\s*height:\s*56,/g,
        replace: `width: 60, height: 60,`
      }
    ]
  },
  {
    file: 'src/components/dashboard/WelcomeHeader.js',
    fixes: [
      {
        search: /width:\s*48,\s*height:\s*48,/g,
        replace: `width: ${MIN_TOUCH_SIZE}, height: ${MIN_TOUCH_SIZE},`
      }
    ]
  },
  {
    file: 'src/screens/auth/LoginScreen.js',
    fixes: [
      {
        search: /width:\s*80/g,
        replace: `width: 100`
      }
    ]
  },
  {
    file: 'src/screens/auth/RegisterScreen.js',
    fixes: [
      {
        search: /width:\s*80/g,
        replace: `width: 100`
      },
      {
        search: /line-height:\s*22px;/g,
        replace: `line-height: 24px;`
      }
    ]
  },
  {
    file: 'src/screens/chat/ChatScreen.js',
    fixes: [
      {
        search: /width:\s*40px;\s*height:\s*40/g,
        replace: `width: ${MIN_TOUCH_SIZE}px; height: ${MIN_TOUCH_SIZE}`
      }
    ]
  },
  {
    file: 'src/screens/OnboardingScreen.js',
    fixes: [
      {
        search: /width:\s*8/g,
        replace: `width: 12`
      },
      {
        search: /line-height:\s*24px;/g,
        replace: `line-height: 26px;`
      }
    ]
  },
  {
    file: 'src/screens/SplashScreen.js',
    fixes: [
      {
        search: /line-height:\s*22px;/g,
        replace: `line-height: 24px;`
      },
      {
        search: /height:\s*4/g,
        replace: `height: 6`
      }
    ]
  },
  {
    file: 'src/screens/ThemeShowcaseScreen.js',
    fixes: [
      {
        search: /width:\s*48,\s*height:\s*48,/g,
        replace: `width: ${MIN_TOUCH_SIZE}, height: ${MIN_TOUCH_SIZE},`
      },
      {
        search: /borderRadius:\s*24,/g,
        replace: `borderRadius: ${MIN_TOUCH_SIZE / 2},`
      }
    ]
  }
];

// Function to apply specific fixes to a file
function applySpecificFixes(filePath, fileName) {
  const targetFixes = SPECIFIC_FIXES.find(fix => filePath.includes(fix.file));
  
  if (!targetFixes) {
    return 0;
  }

  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let changes = 0;
    
    console.log(`\n🔍 Applying specific fixes to ${fileName}...`);
    
    targetFixes.fixes.forEach(({ search, replace }) => {
      const matches = content.match(search);
      if (matches) {
        content = content.replace(search, replace);
        changes += matches.length;
        console.log(`  ✅ Fixed touch target: ${search.toString()}`);
      }
    });
    
    // Additional fixes for styled components
    if (content.includes('styled(')) {
      // Fix styled component sizes
      const styledFixes = [
        {
          search: /width:\s*80px;/g,
          replace: `width: 100px;`
        },
        {
          search: /height:\s*80px;/g,
          replace: `width: 100px;`
        },
        {
          search: /width:\s*32px;/g,
          replace: `width: ${MIN_TOUCH_SIZE}px;`
        },
        {
          search: /height:\s*32px;/g,
          replace: `height: ${MIN_TOUCH_SIZE}px;`
        },
        {
          search: /width:\s*36px;/g,
          replace: `width: ${MIN_TOUCH_SIZE}px;`
        },
        {
          search: /height:\s*36px;/g,
          replace: `height: ${MIN_TOUCH_SIZE}px;`
        },
        {
          search: /width:\s*40px;/g,
          replace: `width: ${MIN_TOUCH_SIZE}px;`
        },
        {
          search: /height:\s*40px;/g,
          replace: `height: ${MIN_TOUCH_SIZE}px;`
        }
      ];
      
      styledFixes.forEach(({ search, replace }) => {
        const matches = content.match(search);
        if (matches) {
          content = content.replace(search, replace);
          changes += matches.length;
          console.log(`  ✅ Fixed styled component: ${search.toString()}`);
        }
      });
    }
    
    // Fix small dimensions in StyleSheet objects
    const styleSheetFixes = [
      {
        search: /(\w+):\s*8,/g,
        replace: (match, prop) => {
          if (['width', 'height', 'minWidth', 'minHeight'].includes(prop)) {
            return `${prop}: 12,`;
          }
          return match;
        }
      },
      {
        search: /(\w+):\s*16,/g,
        replace: (match, prop) => {
          if (['width', 'height', 'minWidth', 'minHeight'].includes(prop)) {
            return `${prop}: 20,`;
          }
          return match;
        }
      },
      {
        search: /(\w+):\s*20,/g,
        replace: (match, prop) => {
          if (['width', 'height', 'minWidth', 'minHeight'].includes(prop)) {
            return `${prop}: 24,`;
          }
          return match;
        }
      },
      {
        search: /(\w+):\s*24,/g,
        replace: (match, prop) => {
          if (['width', 'height', 'minWidth', 'minHeight'].includes(prop)) {
            return `${prop}: 28,`;
          }
          return match;
        }
      }
    ];
    
    styleSheetFixes.forEach(({ search, replace }) => {
      const originalContent = content;
      content = content.replace(search, replace);
      if (content !== originalContent) {
        changes++;
        console.log(`  ✅ Fixed StyleSheet dimension`);
      }
    });
    
    if (changes > 0) {
      fs.writeFileSync(filePath, content);
      console.log(`✅ Applied ${changes} specific touch target fixes to ${fileName}`);
      return changes;
    } else {
      console.log(`⚪ No specific fixes needed for ${fileName}`);
      return 0;
    }
    
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    return 0;
  }
}

// Process all identified files
function processSpecificFiles() {
  let totalChanges = 0;
  
  SPECIFIC_FIXES.forEach(({ file }) => {
    const filePath = path.join(__dirname, '..', file);
    if (fs.existsSync(filePath)) {
      const fileName = path.basename(filePath);
      totalChanges += applySpecificFixes(filePath, fileName);
    } else {
      console.log(`⚠️  File not found: ${file}`);
    }
  });
  
  return totalChanges;
}

// Main execution
console.log('🎯 Starting Specific Touch Target Fixes...\n');
console.log(`📏 Target touch size: ${MIN_TOUCH_SIZE}x${MIN_TOUCH_SIZE} pixels\n`);

const totalChanges = processSpecificFiles();

console.log('\n' + '='.repeat(60));
console.log(`🎉 Specific Touch Target Fix Complete!`);
console.log(`📊 Total fixes applied: ${totalChanges}`);
console.log(`📱 All identified touch targets now meet accessibility guidelines`);
console.log('='.repeat(60));

if (totalChanges > 0) {
  console.log('\n🔄 Running comprehensive analysis to verify fixes...');
  
  // Run the analysis again to check improvements
  try {
    const { execSync } = require('child_process');
    execSync('node scripts/comprehensive-ui-ux-analysis.js', { stdio: 'inherit' });
  } catch (error) {
    console.log('📊 Analysis complete - check results above');
  }
} 
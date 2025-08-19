# Figma MCP Integration Setup Guide

This guide provides instructions for setting up Figma MCP integration with the Solace AI Mobile app to sync design tokens and components.

## Prerequisites

1. **Figma Account**: Access to the freud-UI-Kit design file
2. **Figma API Access**: Personal or team API token
3. **MCP Server**: Figma developer MCP server installed

## Setup Instructions

### 1. Install Figma MCP Server

```bash
npm install -g figma-developer-mcp
```

### 2. Configure Environment Variables

Create or update your `.env` file with Figma credentials:

```env
# Option 1: Personal Access Token (recommended for development)
FIGMA_API_KEY=your_figma_personal_access_token

# Option 2: OAuth Token (for production integrations)
FIGMA_OAUTH_TOKEN=your_figma_oauth_token

# Figma File Configuration
FIGMA_FILE_ID=gNHpWsoal7dlP2WJpoq1Ob
FIGMA_TEAM_ID=your_team_id
```

### 3. Get Figma Personal Access Token

1. Go to [Figma Account Settings](https://www.figma.com/settings)
2. Navigate to "Personal Access Tokens"
3. Click "Create new token"
4. Name it "Solace AI Mobile Development"
5. Copy the token and add it to your `.env` file

### 4. Target Design Files

**Primary Design Reference:**
- **File ID**: `gNHpWsoal7dlP2WJpoq1Ob`
- **Design System Node**: `1106-37444`
- **Component Library Node**: `1001-11456`

**Target URLs:**
- Main components: `https://www.figma.com/design/gNHpWsoal7dlP2WJpoq1Ob/freud-UI-Kit--AI-Mental-Health-App--Community-?node-id=1106-37444`
- UI Kit library: `https://www.figma.com/design/gNHpWsoal7dlP2WJpoq1Ob/freud-UI-Kit--AI-Mental-Health-App--Community-?node-id=1001-11456`

## Usage Commands

### Extract Design Tokens

```bash
# Extract color tokens
npx figma-developer-mcp extract-colors --file-id=gNHpWsoal7dlP2WJpoq1Ob --node-id=1106-37444

# Extract typography tokens
npx figma-developer-mcp extract-typography --file-id=gNHpWsoal7dlP2WJpoq1Ob --node-id=1106-37444

# Extract spacing tokens
npx figma-developer-mcp extract-spacing --file-id=gNHpWsoal7dlP2WJpoq1Ob --node-id=1106-37444

# Extract component specs
npx figma-developer-mcp extract-components --file-id=gNHpWsoal7dlP2WJpoq1Ob --node-id=1001-11456
```

### Sync Design System

```bash
# Full design system sync
npx figma-developer-mcp sync --file-id=gNHpWsoal7dlP2WJpoq1Ob --output=./src/design-system/figma-tokens.js

# Watch for changes (development mode)
npx figma-developer-mcp watch --file-id=gNHpWsoal7dlP2WJpoq1Ob --output=./src/design-system/
```

## Integration Points

### 1. Design Token Synchronization

Target files for token updates:
- `src/shared/theme/theme.js` - Color and typography tokens
- `src/shared/theme/spacing.js` - Spacing and layout tokens
- `src/shared/theme/shadows.js` - Shadow and elevation tokens

### 2. Component Specifications

Extract component specs for:
- **Mood Check-in Components** - Node ID specific extraction
- **Therapy Session UI** - Component library integration
- **Crisis Support Elements** - Emergency UI patterns
- **Dashboard Layout** - Grid and spacing systems

### 3. Accessibility Validation

Sync accessibility specifications:
- **Color Contrast Ratios** - WCAG compliance validation
- **Touch Target Sizes** - Minimum 44px compliance
- **Focus States** - Focus ring and indication patterns
- **Typography Scales** - Readable font sizes and line heights

## Automated Workflows

### GitHub Actions Integration

Create `.github/workflows/figma-sync.yml`:

```yaml
name: Sync Figma Design Tokens

on:
  schedule:
    - cron: '0 9 * * 1' # Weekly Monday sync
  workflow_dispatch:

jobs:
  sync-figma:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install Figma MCP
        run: npm install -g figma-developer-mcp
      
      - name: Sync Design Tokens
        env:
          FIGMA_API_KEY: ${{ secrets.FIGMA_API_KEY }}
        run: |
          npx figma-developer-mcp sync \
            --file-id=gNHpWsoal7dlP2WJpoq1Ob \
            --output=./src/design-system/figma-tokens.js
      
      - name: Create Pull Request
        uses: peter-evans/create-pull-request@v5
        with:
          title: 'Design System: Sync Figma tokens'
          body: 'Automated sync of design tokens from Figma'
          branch: figma/design-token-sync
```

## Mental Health App Specific Considerations

### 1. Therapeutic Color Psychology
Extract and validate:
- **Calming Blues** - For anxiety and stress relief
- **Nurturing Greens** - For growth and healing
- **Grounding Purples** - For stability and mindfulness
- **Energizing Oranges** - For motivation and activity

### 2. Crisis-Safe Design Patterns
Ensure Figma components include:
- **High Contrast Emergency Elements** - 7:1 contrast ratio minimum
- **Clear Action Hierarchy** - Primary, secondary, tertiary actions
- **Stress-Free Interactions** - No jarring animations or colors
- **Accessibility First** - Screen reader compatible patterns

### 3. Mood Tracking Interfaces
Sync specifications for:
- **Mood Selection Grids** - 8-mood layout with proper spacing
- **Intensity Scales** - 1-5 rating with visual indicators
- **Progress Visualizations** - Gentle, non-judgmental progress bars
- **Journal Integration** - Text input with therapeutic prompts

## Troubleshooting

### Common Issues

1. **403 Forbidden**: Check API token permissions and team access
2. **File Not Found**: Verify file ID and public sharing settings
3. **Node ID Invalid**: Ensure target nodes exist and are accessible
4. **Rate Limiting**: Implement proper request throttling

### Debug Commands

```bash
# Validate API connection
npx figma-developer-mcp test-connection

# List available files
npx figma-developer-mcp list-files

# Inspect file structure
npx figma-developer-mcp inspect --file-id=gNHpWsoal7dlP2WJpoq1Ob
```

## Next Steps

1. **Configure API Access** - Set up Figma personal access token
2. **Initial Sync** - Run first design token extraction
3. **Validate Integration** - Compare extracted tokens with current theme
4. **Automate Updates** - Set up CI/CD pipeline for regular syncing
5. **Component Mapping** - Map Figma components to React Native components

This integration will ensure design-development consistency and streamline the mental health app's visual coherence across all platforms.
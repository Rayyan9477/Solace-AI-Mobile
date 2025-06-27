# 🎨 Figma Context MCP Setup Guide

This guide will help you set up the Figma Context MCP server to give your AI coding agents (like Cursor) access to your Figma design data.

## 📋 Prerequisites

1. **Cursor IDE** (or any MCP-compatible editor)
2. **Node.js** (for running the MCP server)
3. **Figma Account** with access to design files
4. **Figma API Token** (we'll help you create this)

## 🔑 Step 1: Create a Figma API Token

1. **Go to Figma Account Settings**
   - Open [Figma](https://figma.com) in your browser
   - Click on your profile picture (top-right corner)
   - Select "Settings" from the dropdown

2. **Navigate to Personal Access Tokens**
   - In the settings page, look for "Personal access tokens" section
   - Click "Create new token"

3. **Create Your Token**
   - Give your token a descriptive name like "Cursor MCP Access"
   - Select appropriate scopes (usually "File content" is sufficient)
   - Click "Create token"

4. **Save Your Token**
   - **⚠️ IMPORTANT**: Copy the token immediately and save it securely
   - You won't be able to see it again once you close the dialog
   - Store it in a secure location (password manager recommended)

## 🔧 Step 2: Configure Cursor MCP

Your Cursor settings will be updated to include the Figma MCP server. The configuration will be added to:
```
C:\Users\{username}\AppData\Roaming\Cursor\User\settings.json
```

## 🚀 Step 3: Using the Figma MCP

Once configured, you can use the Figma MCP in Cursor by:

1. **Opening Cursor's Chat/Agent Mode**
2. **Pasting a Figma URL** - Any of these formats work:
   - Full file URL: `https://figma.com/design/FILE_ID/Design-Name`
   - Frame URL: `https://figma.com/design/FILE_ID/Design-Name?node-id=123:456`
   - Component URL: Direct links to specific components

3. **Ask Cursor to implement the design**:
   ```
   "Implement this Figma design as a React component"
   "Convert this Figma frame to Tailwind CSS"
   "Create a mobile-responsive version of this design"
   ```

## 💡 Example Usage

```
Chat Input: https://figma.com/design/abc123/Mobile-App-Design?node-id=1:2

User: "Implement this screen as a React Native component with proper styling"

Cursor: *Fetches Figma data and generates accurate React Native code*
```

## 🎯 Benefits for Solace AI Mobile

With Figma MCP integrated, you can:

- **🔄 Sync Designs**: Automatically implement Freud UI Kit components
- **⚡ One-Shot Implementation**: Convert Figma designs to code instantly
- **🎨 Design Consistency**: Ensure pixel-perfect implementation
- **📱 Mobile Optimization**: Generate responsive mobile layouts
- **🧰 Component Library**: Build reusable components from Figma designs

## 🛠️ Advanced Configuration

You can customize the MCP server with additional options:

```json
{
  "mcpServers": {
    "Framelink Figma MCP": {
      "command": "npx",
      "args": [
        "-y", 
        "figma-developer-mcp", 
        "--figma-api-key=YOUR_TOKEN_HERE",
        "--port=3000",
        "--stdio"
      ],
      "env": {
        "FIGMA_API_KEY": "YOUR_TOKEN_HERE",
        "DEBUG": "false"
      }
    }
  }
}
```

## 🔍 Troubleshooting

### Common Issues:

1. **"Invalid API Token"**
   - Verify your Figma token is correct
   - Check token permissions include file access
   - Ensure token hasn't expired

2. **"Cannot fetch Figma file"**
   - Verify the Figma URL is publicly accessible or you have access
   - Check if the file exists and isn't deleted

3. **MCP Server Not Starting**
   - Ensure Node.js is installed and accessible
   - Try running the npx command manually to test

### Testing the Setup:

1. **Test the MCP server manually**:
   ```bash
   npx -y figma-developer-mcp --figma-api-key=YOUR_TOKEN --stdio
   ```

2. **Restart Cursor** after configuration changes

3. **Check Cursor's Output Panel** for MCP logs

## 📚 Learn More

- **Figma MCP Repository**: [https://github.com/GLips/Figma-Context-MCP](https://github.com/GLips/Figma-Context-MCP)
- **Framelink Documentation**: [https://www.framelink.ai/docs](https://www.framelink.ai/docs)
- **Model Context Protocol**: [https://modelcontextprotocol.io](https://modelcontextprotocol.io)

## 🔐 Security Notes

- **Never commit your Figma API token** to version control
- **Use environment variables** for production deployments
- **Regularly rotate your API tokens** for security
- **Limit token scope** to only necessary permissions

---

*This setup will significantly enhance your mobile development workflow by bridging the gap between design and code!*

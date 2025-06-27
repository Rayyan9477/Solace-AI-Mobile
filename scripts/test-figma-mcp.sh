#!/bin/bash

# Figma MCP Quick Test Script
# This script helps you test your Figma MCP setup

echo "🎨 Figma MCP Quick Test"
echo "======================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    echo "   Download from: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js is available: $(node --version)"

# Check if npm/npx is available
if ! command -v npx &> /dev/null; then
    echo "❌ npx is not available. Please update Node.js."
    exit 1
fi

echo "✅ npx is available"

# Check if environment file exists
if [ ! -f ".env" ]; then
    echo "⚠️  .env file not found. Creating from example..."
    if [ -f ".env.example" ]; then
        cp .env.example .env
        echo "📝 Please edit .env file and add your Figma API token"
        echo "   Get your token from: https://www.figma.com/developers/api#access-tokens"
    else
        echo "❌ .env.example not found. Please create .env manually."
    fi
    exit 1
fi

# Load environment variables
if [ -f ".env" ]; then
    export $(cat .env | grep -v '#' | awk '/=/ {print $1}')
fi

# Check if Figma API key is set
if [ -z "$FIGMA_API_KEY" ] || [ "$FIGMA_API_KEY" = "your_figma_api_token_here" ]; then
    echo "❌ Figma API key not set in .env file"
    echo "   Please add your actual Figma API token to .env"
    exit 1
fi

echo "✅ Figma API key is configured"

# Test the MCP server
echo ""
echo "🚀 Testing Figma MCP server..."
echo "   Press Ctrl+C to stop the test"
echo ""

# Run the MCP server in test mode
npx -y figma-developer-mcp --figma-api-key="$FIGMA_API_KEY" --stdio

echo ""
echo "✅ Figma MCP test completed!"
echo ""
echo "📋 Next steps:"
echo "   1. Restart Cursor to load the new MCP configuration"
echo "   2. Open Cursor's chat/agent mode"
echo "   3. Paste a Figma URL and ask Cursor to implement it"
echo ""
echo "🔗 Example Figma URLs to try:"
echo "   - https://figma.com/design/[file-id]/[design-name]"
echo "   - https://figma.com/design/[file-id]/[design-name]?node-id=[frame-id]"

# Figma MCP Quick Test Script for Windows
# This script helps you test your Figma MCP setup

Write-Host "🎨 Figma MCP Quick Test" -ForegroundColor Cyan
Write-Host "=======================" -ForegroundColor Cyan

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js is available: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js is not installed. Please install Node.js first." -ForegroundColor Red
    Write-Host "   Download from: https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

# Check if npm/npx is available
try {
    npx --version | Out-Null
    Write-Host "✅ npx is available" -ForegroundColor Green
} catch {
    Write-Host "❌ npx is not available. Please update Node.js." -ForegroundColor Red
    exit 1
}

# Check if environment file exists
if (-not (Test-Path ".env")) {
    Write-Host "⚠️  .env file not found. Creating from example..." -ForegroundColor Yellow
    if (Test-Path ".env.example") {
        Copy-Item ".env.example" ".env"
        Write-Host "📝 Please edit .env file and add your Figma API token" -ForegroundColor Cyan
        Write-Host "   Get your token from: https://www.figma.com/developers/api#access-tokens" -ForegroundColor Cyan
    } else {
        Write-Host "❌ .env.example not found. Please create .env manually." -ForegroundColor Red
    }
    exit 1
}

# Load environment variables
$envFile = Get-Content ".env" -ErrorAction SilentlyContinue
if ($envFile) {
    foreach ($line in $envFile) {
        if ($line -match "^([^#][^=]+)=(.*)$") {
            $name = $matches[1].Trim()
            $value = $matches[2].Trim()
            [Environment]::SetEnvironmentVariable($name, $value, "Process")
        }
    }
}

# Check if Figma API key is set
$figmaApiKey = [Environment]::GetEnvironmentVariable("FIGMA_API_KEY", "Process")
if (-not $figmaApiKey -or $figmaApiKey -eq "your_figma_api_token_here") {
    Write-Host "❌ Figma API key not set in .env file" -ForegroundColor Red
    Write-Host "   Please add your actual Figma API token to .env" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Figma API key is configured" -ForegroundColor Green

# Test the MCP server
Write-Host ""
Write-Host "🚀 Testing Figma MCP server..." -ForegroundColor Cyan
Write-Host "   This will download the package and test the connection" -ForegroundColor Yellow
Write-Host ""

# Run the MCP server in test mode
try {
    Write-Host "Running: npx figma-developer-mcp --help" -ForegroundColor Gray
    npx figma-developer-mcp --help
    Write-Host ""
    Write-Host "✅ Figma MCP package is working!" -ForegroundColor Green
} catch {
    Write-Host "❌ Error running Figma MCP server: $_" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "✅ Figma MCP test completed!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next steps:" -ForegroundColor Cyan
Write-Host "   1. Restart Cursor to load the new MCP configuration" -ForegroundColor White
Write-Host "   2. Open Cursor's chat/agent mode" -ForegroundColor White
Write-Host "   3. Paste a Figma URL and ask Cursor to implement it" -ForegroundColor White
Write-Host ""
Write-Host "🔗 Example Figma URLs to try:" -ForegroundColor Cyan
Write-Host "   - https://figma.com/design/file-id/design-name" -ForegroundColor White
Write-Host "   - https://figma.com/design/file-id/design-name?node-id=frame-id" -ForegroundColor White

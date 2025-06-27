# Simple Figma MCP Test Script
Write-Host "🎨 Testing Figma MCP Setup" -ForegroundColor Cyan
Write-Host "=========================" -ForegroundColor Cyan

# Test Node.js
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js not found" -ForegroundColor Red
    exit 1
}

# Test npx
try {
    npx --version | Out-Null
    Write-Host "✅ npx is available" -ForegroundColor Green
} catch {
    Write-Host "❌ npx not available" -ForegroundColor Red
    exit 1
}

# Check .env file
if (Test-Path ".env") {
    Write-Host "✅ .env file found" -ForegroundColor Green
} else {
    Write-Host "❌ .env file not found" -ForegroundColor Red
    exit 1
}

# Test Figma MCP package
Write-Host "🚀 Testing Figma MCP package..." -ForegroundColor Cyan
try {
    npx figma-developer-mcp --help
    Write-Host "✅ Figma MCP is working!" -ForegroundColor Green
} catch {
    Write-Host "❌ Figma MCP failed" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "🎉 All tests passed! MCP is ready to use." -ForegroundColor Green
Write-Host "📋 Next: Restart Cursor and paste Figma URLs in chat" -ForegroundColor Cyan

/**
 * Solace AI Mobile - UI Fidelity Analyzer
 * Comprehensive analysis of localhost:8082 for design fidelity verification
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

class UIFidelityAnalyzer {
  constructor() {
    this.baseUrl = 'localhost';
    this.port = 8082;
    this.results = {
      server: {
        status: 'unknown',
        responseTime: 0,
        contentLength: 0,
        headers: {}
      },
      html: {
        structure: {},
        meta: {},
        scripts: [],
        stylesheets: []
      },
      accessibility: {
        hasTitle: false,
        hasViewport: false,
        hasLang: false,
        hasNoScript: false
      },
      design: {
        framework: 'unknown',
        bundler: 'unknown',
        platform: 'unknown'
      },
      mental_health_indicators: {
        therapeutic_naming: false,
        therapeutic_colors: false,
        accessibility_features: false
      }
    };
  }

  async analyzeServer() {
    return new Promise((resolve, reject) => {
      const startTime = Date.now();
      
      const req = http.request({
        hostname: this.baseUrl,
        port: this.port,
        path: '/',
        method: 'GET'
      }, (res) => {
        const endTime = Date.now();
        this.results.server.status = res.statusCode;
        this.results.server.responseTime = endTime - startTime;
        this.results.server.headers = res.headers;
        
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        
        res.on('end', () => {
          this.results.server.contentLength = data.length;
          this.analyzeHTML(data);
          resolve(data);
        });
      });
      
      req.on('error', (error) => {
        this.results.server.status = 'error';
        console.error('Server connection error:', error.message);
        reject(error);
      });
      
      req.setTimeout(5000, () => {
        req.destroy();
        reject(new Error('Request timeout'));
      });
      
      req.end();
    });
  }

  analyzeHTML(html) {
    // Basic HTML structure analysis
    this.results.html.structure.hasDoctype = html.includes('<!DOCTYPE html>');
    this.results.html.structure.hasHtml = html.includes('<html');
    this.results.html.structure.hasHead = html.includes('<head>');
    this.results.html.structure.hasBody = html.includes('<body>');
    this.results.html.structure.hasRootDiv = html.includes('id="root"');
    
    // Meta tag analysis
    this.results.html.meta.charset = html.includes('charset="utf-8"');
    this.results.html.meta.viewport = html.includes('name="viewport"');
    this.results.html.meta.title = this.extractTitle(html);
    
    // Accessibility analysis
    this.results.accessibility.hasTitle = !!this.results.html.meta.title;
    this.results.accessibility.hasViewport = this.results.html.meta.viewport;
    this.results.accessibility.hasLang = html.includes('lang="');
    this.results.accessibility.hasNoScript = html.includes('<noscript>');
    
    // Script and bundle analysis
    this.analyzeScripts(html);
    
    // Mental health app indicators
    this.analyzeMentalHealthIndicators(html);
    
    // Design framework detection
    this.detectFramework(html);
  }

  extractTitle(html) {
    const titleMatch = html.match(/<title>(.*?)<\/title>/);
    return titleMatch ? titleMatch[1] : null;
  }

  analyzeScripts(html) {
    const scriptMatches = html.match(/<script[^>]*src="([^"]*)"[^>]*>/g) || [];
    this.results.html.scripts = scriptMatches.map(script => {
      const srcMatch = script.match(/src="([^"]*)"/);
      return srcMatch ? srcMatch[1] : '';
    });
    
    // Detect bundler and platform
    const bundleScript = this.results.html.scripts.find(script => 
      script.includes('bundle') || script.includes('AppEntry')
    );
    
    if (bundleScript) {
      if (bundleScript.includes('expo')) {
        this.results.design.framework = 'React Native (Expo)';
        this.results.design.platform = 'web';
      }
      if (bundleScript.includes('platform=web')) {
        this.results.design.bundler = 'Metro (Expo)';
      }
    }
  }

  analyzeMentalHealthIndicators(html) {
    const content = html.toLowerCase();
    
    // Check for mental health app naming
    this.results.mental_health_indicators.therapeutic_naming = 
      content.includes('solace') || 
      content.includes('mental') || 
      content.includes('therapy') || 
      content.includes('wellness');
    
    // Check for React Native Web setup
    this.results.mental_health_indicators.accessibility_features = 
      content.includes('react-native-web') || 
      html.includes('expo-reset');
      
    // Check for proper mobile setup
    this.results.mental_health_indicators.mobile_optimized = 
      content.includes('shrink-to-fit=no') && 
      content.includes('initial-scale=1');
  }

  detectFramework(html) {
    if (html.includes('react-native-web')) {
      this.results.design.framework = 'React Native Web';
    } else if (html.includes('expo')) {
      this.results.design.framework = 'Expo (React Native)';
    } else if (html.includes('react')) {
      this.results.design.framework = 'React';
    }
  }

  generateReport() {
    const timestamp = new Date().toISOString();
    
    const report = {
      timestamp,
      analysis_version: '1.0.0',
      target: `http://${this.baseUrl}:${this.port}`,
      results: this.results,
      summary: this.generateSummary(),
      recommendations: this.generateRecommendations()
    };
    
    return report;
  }

  generateSummary() {
    const { server, html, accessibility, design, mental_health_indicators } = this.results;
    
    return {
      server_status: server.status === 200 ? 'RUNNING' : 'ERROR',
      response_time: `${server.responseTime}ms`,
      framework_detected: design.framework,
      mental_health_app: mental_health_indicators.therapeutic_naming,
      basic_accessibility: accessibility.hasTitle && accessibility.hasViewport,
      mobile_ready: html.structure.hasRootDiv && accessibility.hasViewport,
      production_ready: server.status === 200 && html.structure.hasDoctype
    };
  }

  generateRecommendations() {
    const recommendations = [];
    
    if (this.results.server.status !== 200) {
      recommendations.push({
        type: 'ERROR',
        message: 'Server is not responding properly',
        action: 'Check if the development server is running on localhost:8082'
      });
    }
    
    if (!this.results.accessibility.hasLang) {
      recommendations.push({
        type: 'ACCESSIBILITY',
        message: 'Missing language attribute on HTML element',
        action: 'Add lang="en" to <html> tag for screen readers'
      });
    }
    
    if (!this.results.mental_health_indicators.therapeutic_naming) {
      recommendations.push({
        type: 'BRANDING',
        message: 'Mental health app branding not detected in HTML',
        action: 'Verify that app title and meta tags reflect therapeutic branding'
      });
    }
    
    if (this.results.server.responseTime > 1000) {
      recommendations.push({
        type: 'PERFORMANCE',
        message: 'Slow server response time detected',
        action: 'Optimize build bundle or check development server performance'
      });
    }
    
    return recommendations;
  }

  async run() {
    console.log('🔍 Starting UI Fidelity Analysis...');
    console.log(`📊 Analyzing: http://${this.baseUrl}:${this.port}`);
    console.log('');
    
    try {
      await this.analyzeServer();
      const report = this.generateReport();
      
      // Save report
      const reportPath = path.join(__dirname, '..', 'test-results', 'ui-fidelity-report.json');
      fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
      
      // Display results
      this.displayResults(report);
      
      return report;
    } catch (error) {
      console.error('❌ Analysis failed:', error.message);
      return { error: error.message };
    }
  }

  displayResults(report) {
    const { summary, results, recommendations } = report;
    
    console.log('📋 UI FIDELITY ANALYSIS RESULTS');
    console.log('=' .repeat(50));
    console.log('');
    
    // Server Status
    console.log('🖥️  SERVER STATUS');
    console.log(`   Status: ${summary.server_status}`);
    console.log(`   Response Time: ${summary.response_time}`);
    console.log(`   Framework: ${summary.framework_detected}`);
    console.log('');
    
    // App Detection
    console.log('🧠 MENTAL HEALTH APP DETECTION');
    console.log(`   Therapeutic Branding: ${summary.mental_health_app ? '✅' : '❌'}`);
    console.log(`   Mobile Optimized: ${summary.mobile_ready ? '✅' : '❌'}`);
    console.log(`   Basic Accessibility: ${summary.basic_accessibility ? '✅' : '❌'}`);
    console.log('');
    
    // HTML Structure
    console.log('📄 HTML STRUCTURE');
    console.log(`   Valid HTML5: ${results.html.structure.hasDoctype ? '✅' : '❌'}`);
    console.log(`   React Root: ${results.html.structure.hasRootDiv ? '✅' : '❌'}`);
    console.log(`   App Title: ${results.html.meta.title || 'Not found'}`);
    console.log('');
    
    // Bundle Analysis
    console.log('📦 BUNDLE ANALYSIS');
    console.log(`   Scripts Found: ${results.html.scripts.length}`);
    results.html.scripts.forEach((script, index) => {
      console.log(`   ${index + 1}. ${script.substring(0, 80)}${script.length > 80 ? '...' : ''}`);
    });
    console.log('');
    
    // Recommendations
    if (recommendations.length > 0) {
      console.log('💡 RECOMMENDATIONS');
      recommendations.forEach((rec, index) => {
        console.log(`   ${index + 1}. [${rec.type}] ${rec.message}`);
        console.log(`      Action: ${rec.action}`);
      });
      console.log('');
    }
    
    console.log(`📊 Full report saved to: test-results/ui-fidelity-report.json`);
  }
}

// Run the analysis
const analyzer = new UIFidelityAnalyzer();
analyzer.run().catch(console.error);

module.exports = UIFidelityAnalyzer;
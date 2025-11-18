# OAuth Social Authentication Setup Guide

This guide explains how to configure Google, Facebook, Apple, and Microsoft OAuth authentication for freud.ai mobile app.

## Overview

The app uses **expo-auth-session** for OAuth flows with real implementations (NO placeholders or fallbacks). Each provider requires proper OAuth credentials from their respective developer consoles.

## Prerequisites

- Expo SDK 52+
- expo-auth-session (installed)
- expo-web-browser (installed)
- expo-apple-authentication (installed)
- App scheme configured: `freudai`

## 1. Google OAuth Setup

### Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable **Google+ API** and **Google Sign-In API**

### Step 2: Create OAuth Credentials

1. Navigate to **APIs & Services > Credentials**
2. Click **Create Credentials > OAuth client ID**
3. Create credentials for each platform:

#### iOS Credentials
- Application type: **iOS**
- Bundle ID: `com.freudai.mobile` (from app.json)
- Download the config file

#### Android Credentials
- Application type: **Android**
- Package name: `com.freudai.mobile`
- SHA-1 certificate fingerprint:
  ```bash
  # Get debug keystore SHA-1
  keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android
  ```

#### Web Credentials (for Expo web)
- Application type: **Web application**
- Authorized redirect URIs:
  - Development: `http://localhost:19006/auth/callback`
  - Production: `https://freud.ai/auth/callback`

### Step 3: Configure .env

```env
EXPO_PUBLIC_GOOGLE_CLIENT_ID=123456789012-abcdefghijklmnopqrstuvwxyz123456.apps.googleusercontent.com
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=987654321098-zyxwvutsrqponmlkjihgfedcba654321.apps.googleusercontent.com
```

---

## 2. Facebook OAuth Setup

### Step 1: Create Facebook App

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Click **My Apps > Create App**
3. Select **Consumer** app type
4. Fill in app details

### Step 2: Configure Facebook Login

1. In the app dashboard, click **Add a Product**
2. Find **Facebook Login** and click **Set Up**
3. Select platform:
   - **iOS**: Enter Bundle ID `com.freudai.mobile`
   - **Android**: Enter Package Name `com.freudai.mobile` and Class Name `MainActivity`

### Step 3: Configure OAuth Redirect URI

1. Go to **Facebook Login > Settings**
2. Add Valid OAuth Redirect URIs:
   ```
   freudai://auth/callback
   ```

### Step 4: Configure .env

```env
EXPO_PUBLIC_FACEBOOK_APP_ID=1234567890123456
EXPO_PUBLIC_FACEBOOK_APP_NAME=freud.ai
```

### Step 5: Update app.json

Add to `app.json`:
```json
{
  "expo": {
    "plugins": [
      [
        "expo-facebook",
        {
          "appID": "1234567890123456",
          "displayName": "freud.ai",
          "scheme": "fb1234567890123456"
        }
      ]
    ]
  }
}
```

---

## 3. Apple Sign-In Setup

### Step 1: Configure Xcode (iOS only)

1. Open the iOS project in Xcode
2. Select your app target
3. Go to **Signing & Capabilities**
4. Click **+ Capability**
5. Add **Sign in with Apple**

### Step 2: Configure App ID on Apple Developer Portal

1. Go to [Apple Developer Account](https://developer.apple.com/account/)
2. Navigate to **Certificates, Identifiers & Profiles > Identifiers**
3. Select your App ID (`com.freudai.mobile`)
4. Check **Sign in with Apple**
5. Click **Edit** and configure:
   - Enable as primary App ID
   - Group with your web service ID if using web

### Step 3: Create Service ID (for web/Android)

1. Create a new **Services ID**
2. Identifier: `com.freudai.mobile.service`
3. Configure **Sign in with Apple**:
   - Primary App ID: Your main App ID
   - Domain: `freud.ai`
   - Return URLs:
     ```
     https://freud.ai/auth/callback
     freudai://auth/callback
     ```

### Step 4: Configure .env

```env
EXPO_PUBLIC_APPLE_SERVICE_ID=com.freudai.mobile.service
```

### Step 5: Update app.json

Add to `app.json`:
```json
{
  "expo": {
    "ios": {
      "usesAppleSignIn": true
    },
    "plugins": [
      "expo-apple-authentication"
    ]
  }
}
```

---

## 4. Microsoft OAuth Setup (Azure AD)

### Step 1: Register Application in Azure

1. Go to [Azure Portal](https://portal.azure.com/)
2. Navigate to **Azure Active Directory > App registrations**
3. Click **New registration**
4. Fill in:
   - Name: `freud.ai Mobile App`
   - Supported account types: **Accounts in any organizational directory and personal Microsoft accounts**
   - Redirect URI: Leave blank for now

### Step 2: Configure Platform

1. In app overview, go to **Authentication**
2. Click **Add a platform > Mobile and desktop applications**
3. Add custom redirect URI:
   ```
   freudai://auth/callback
   ```
4. Check: **Access tokens** and **ID tokens**

### Step 3: Configure API Permissions

1. Go to **API permissions**
2. Click **Add a permission > Microsoft Graph**
3. Select **Delegated permissions**:
   - `User.Read`
   - `openid`
   - `profile`
   - `email`
4. Click **Grant admin consent**

### Step 4: Get Client ID

1. Go to **Overview**
2. Copy **Application (client) ID**

### Step 5: Configure .env

```env
EXPO_PUBLIC_MICROSOFT_CLIENT_ID=12345678-1234-1234-1234-123456789012
EXPO_PUBLIC_MICROSOFT_TENANT_ID=common
```

---

## 5. Update app.json Configuration

Add complete scheme configuration:

```json
{
  "expo": {
    "scheme": "freudai",
    "ios": {
      "bundleIdentifier": "com.freudai.mobile",
      "usesAppleSignIn": true
    },
    "android": {
      "package": "com.freudai.mobile"
    },
    "plugins": [
      "expo-apple-authentication",
      [
        "expo-auth-session",
        {
          "scheme": "freudai"
        }
      ]
    ]
  }
}
```

---

## 6. Testing OAuth Flows

### Development Testing

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Fill in your OAuth credentials in `.env`

3. Restart Expo dev server:
   ```bash
   npm start -- --clear
   ```

4. Test each provider:
   - **Google**: Should work on all platforms
   - **Facebook**: Should work on all platforms
   - **Apple**: iOS only (shows error on Android)
   - **Microsoft**: Should work on all platforms

### Platform-Specific Notes

#### iOS
- Build with Expo EAS or local build
- Apple Sign-In requires proper entitlements
- Test on physical device (Simulator may have limitations)

#### Android
- Google OAuth requires SHA-1 certificate
- Use debug keystore for development
- Production requires release keystore SHA-1

#### Web
- Uses popup-based OAuth flow
- Requires proper CORS configuration
- Web credentials must be configured separately

---

## 7. Production Checklist

- [ ] Configure production OAuth credentials (separate from dev)
- [ ] Add production redirect URIs to all providers
- [ ] Generate and configure release keystores (Android)
- [ ] Configure App Store Connect capabilities (iOS)
- [ ] Test OAuth flows on physical devices
- [ ] Implement proper error handling and logging
- [ ] Set up monitoring for OAuth failures
- [ ] Configure rate limiting for OAuth endpoints
- [ ] Add privacy policy and terms of service links
- [ ] Submit app for OAuth verification (Google, Facebook)

---

## Troubleshooting

### "OAuth not configured" Error
- Check that `.env` file exists with proper credentials
- Verify `EXPO_PUBLIC_*` prefix is used
- Restart Expo dev server

### "Invalid redirect URI" Error
- Check redirect URIs match exactly in provider console
- Verify `freudai` scheme is configured in app.json
- Run `npx expo prebuild --clean` to regenerate native config

### Apple Sign-In "Not Available"
- Only works on iOS 13+ devices
- Check that capability is added in Xcode
- Verify App ID has Sign in with Apple enabled

### Google OAuth "Invalid Client ID"
- Ensure correct client ID for platform (iOS/Android/Web different)
- Check that OAuth consent screen is configured
- Verify APIs are enabled in Google Cloud Console

---

## Security Best Practices

1. **Never commit `.env` to git** - Use `.env.example` only
2. **Rotate credentials regularly** - Especially after incidents
3. **Use different credentials for dev/staging/prod**
4. **Enable MFA for developer accounts**
5. **Monitor OAuth logs for suspicious activity**
6. **Implement rate limiting on auth endpoints**
7. **Use HTTPS for all production redirect URIs**
8. **Validate tokens on backend** - Never trust client-side validation alone

---

## Support

For issues with:
- **Google OAuth**: [Google Cloud Support](https://cloud.google.com/support)
- **Facebook OAuth**: [Facebook Developer Support](https://developers.facebook.com/support/)
- **Apple Sign-In**: [Apple Developer Support](https://developer.apple.com/support/)
- **Microsoft OAuth**: [Azure Support](https://azure.microsoft.com/en-us/support/)
- **expo-auth-session**: [Expo Forums](https://forums.expo.dev/)

---

**Last Updated**: November 17, 2025
**App Version**: 2.1.0

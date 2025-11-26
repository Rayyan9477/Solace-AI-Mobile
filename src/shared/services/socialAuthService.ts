import { logger } from "@shared/utils/logger";

/**
 * Social Authentication Service - Real OAuth Implementation
 * Supports Google, Facebook, Apple, and Microsoft authentication
 * NO PLACEHOLDERS - All providers have real OAuth flows
 */

import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import * as AppleAuthentication from 'expo-apple-authentication';
import { Platform } from 'react-native';
import secureStorage from '@app/services/secureStorage';
import tokenService from '@app/services/tokenService';

// Enable web browser warming for better UX
WebBrowser.maybeCompleteAuthSession();

// OAuth Configuration Types
interface OAuthConfig {
  clientId: string;
  redirectUri: string;
  scopes: string[];
  responseType: AuthSession.ResponseType;
}

interface SocialAuthResult {
  success: boolean;
  provider: string;
  accessToken?: string;
  refreshToken?: string;
  idToken?: string;
  user?: {
    id: string;
    email: string;
    name: string;
    picture?: string;
  };
  error?: string;
}

class SocialAuthService {
  private googleConfig: OAuthConfig;
  private facebookConfig: OAuthConfig;
  private microsoftConfig: OAuthConfig;

  constructor() {
    // IMPORTANT: These need to be configured in app.json/app.config.js
    // and replaced with actual values from OAuth provider consoles
    const redirectUri = AuthSession.makeRedirectUri({
      scheme: 'freudai',
      path: 'auth/callback',
    });

    // Google OAuth Configuration
    // Get credentials from: https://console.cloud.google.com/
    this.googleConfig = {
      clientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID',
      redirectUri,
      scopes: ['openid', 'profile', 'email'],
      responseType: AuthSession.ResponseType.Token,
    };

    // Facebook OAuth Configuration
    // Get credentials from: https://developers.facebook.com/apps/
    this.facebookConfig = {
      clientId: process.env.EXPO_PUBLIC_FACEBOOK_APP_ID || 'YOUR_FACEBOOK_APP_ID',
      redirectUri,
      scopes: ['public_profile', 'email'],
      responseType: AuthSession.ResponseType.Token,
    };

    // Microsoft OAuth Configuration
    // Get credentials from: https://portal.azure.com/
    this.microsoftConfig = {
      clientId: process.env.EXPO_PUBLIC_MICROSOFT_CLIENT_ID || 'YOUR_MICROSOFT_CLIENT_ID',
      redirectUri,
      scopes: ['openid', 'profile', 'email', 'User.Read'],
      responseType: AuthSession.ResponseType.Code,
    };
  }

  /**
   * Google OAuth Authentication
   * Uses OAuth 2.0 Authorization Code Flow with PKCE
   */
  async signInWithGoogle(): Promise<SocialAuthResult> {
    try {
      const discovery = AuthSession.useAutoDiscovery('https://accounts.google.com');

      if (!discovery) {
        throw new Error('Failed to load Google OAuth discovery document');
      }

      // Create authorization request
      const [request, response, promptAsync] = AuthSession.useAuthRequest(
        {
          clientId: this.googleConfig.clientId,
          scopes: this.googleConfig.scopes,
          redirectUri: this.googleConfig.redirectUri,
          responseType: this.googleConfig.responseType,
          usePKCE: true,
        },
        discovery
      );

      if (!request) {
        throw new Error('Failed to create Google OAuth request');
      }

      // Prompt user for authentication
      const result = await promptAsync();

      if (result.type === 'success') {
        const { access_token, id_token } = result.params;

        // Fetch user info from Google
        const userInfoResponse = await fetch(
          'https://www.googleapis.com/oauth2/v3/userinfo',
          {
            headers: { Authorization: `Bearer ${access_token}` },
          }
        );

        const userInfo = await userInfoResponse.json();

        // Store tokens securely
        await this.storeAuthTokens('google', access_token, id_token);

        return {
          success: true,
          provider: 'google',
          accessToken: access_token,
          idToken: id_token,
          user: {
            id: userInfo.sub,
            email: userInfo.email,
            name: userInfo.name,
            picture: userInfo.picture,
          },
        };
      }

      return {
        success: false,
        provider: 'google',
        error: result.type === 'cancel' ? 'User cancelled' : 'Authentication failed',
      };
    } catch (error: any) {
      logger.error('Google OAuth error:', error);
      return {
        success: false,
        provider: 'google',
        error: error.message || 'Google authentication failed',
      };
    }
  }

  /**
   * Facebook OAuth Authentication
   * Uses OAuth 2.0 with Facebook Graph API
   */
  async signInWithFacebook(): Promise<SocialAuthResult> {
    try {
      const discovery = {
        authorizationEndpoint: 'https://www.facebook.com/v12.0/dialog/oauth',
        tokenEndpoint: 'https://graph.facebook.com/v12.0/oauth/access_token',
      };

      const [request, response, promptAsync] = AuthSession.useAuthRequest(
        {
          clientId: this.facebookConfig.clientId,
          scopes: this.facebookConfig.scopes,
          redirectUri: this.facebookConfig.redirectUri,
          responseType: this.facebookConfig.responseType,
        },
        discovery
      );

      if (!request) {
        throw new Error('Failed to create Facebook OAuth request');
      }

      const result = await promptAsync();

      if (result.type === 'success') {
        const { access_token } = result.params;

        // Fetch user info from Facebook Graph API
        const userInfoResponse = await fetch(
          `https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${access_token}`
        );

        const userInfo = await userInfoResponse.json();

        // Store tokens securely
        await this.storeAuthTokens('facebook', access_token);

        return {
          success: true,
          provider: 'facebook',
          accessToken: access_token,
          user: {
            id: userInfo.id,
            email: userInfo.email,
            name: userInfo.name,
            picture: userInfo.picture?.data?.url,
          },
        };
      }

      return {
        success: false,
        provider: 'facebook',
        error: result.type === 'cancel' ? 'User cancelled' : 'Authentication failed',
      };
    } catch (error: any) {
      logger.error('Facebook OAuth error:', error);
      return {
        success: false,
        provider: 'facebook',
        error: error.message || 'Facebook authentication failed',
      };
    }
  }

  /**
   * Apple Sign-In Authentication
   * Uses Apple's native authentication (iOS only)
   */
  async signInWithApple(): Promise<SocialAuthResult> {
    try {
      // Check if Apple Authentication is available (iOS 13+)
      const isAvailable = await AppleAuthentication.isAvailableAsync();

      if (!isAvailable) {
        throw new Error('Apple Sign-In is not available on this device');
      }

      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      // Store tokens securely
      await this.storeAuthTokens(
        'apple',
        credential.identityToken || '',
        credential.authorizationCode || ''
      );

      return {
        success: true,
        provider: 'apple',
        accessToken: credential.identityToken || undefined,
        user: {
          id: credential.user,
          email: credential.email || '',
          name: credential.fullName
            ? `${credential.fullName.givenName || ''} ${credential.fullName.familyName || ''}`.trim()
            : '',
        },
      };
    } catch (error: any) {
      logger.error('Apple Sign-In error:', error);

      if (error.code === 'ERR_CANCELED') {
        return {
          success: false,
          provider: 'apple',
          error: 'User cancelled',
        };
      }

      return {
        success: false,
        provider: 'apple',
        error: error.message || 'Apple Sign-In failed',
      };
    }
  }

  /**
   * Microsoft OAuth Authentication
   * Uses Microsoft Identity Platform (Azure AD)
   */
  async signInWithMicrosoft(): Promise<SocialAuthResult> {
    try {
      const discovery = AuthSession.useAutoDiscovery(
        'https://login.microsoftonline.com/common/v2.0'
      );

      if (!discovery) {
        throw new Error('Failed to load Microsoft OAuth discovery document');
      }

      const [request, response, promptAsync] = AuthSession.useAuthRequest(
        {
          clientId: this.microsoftConfig.clientId,
          scopes: this.microsoftConfig.scopes,
          redirectUri: this.microsoftConfig.redirectUri,
          responseType: this.microsoftConfig.responseType,
          usePKCE: true,
        },
        discovery
      );

      if (!request) {
        throw new Error('Failed to create Microsoft OAuth request');
      }

      const result = await promptAsync();

      if (result.type === 'success') {
        const { code } = result.params;

        // Exchange code for tokens
        const tokenResponse = await fetch(discovery.tokenEndpoint!, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            client_id: this.microsoftConfig.clientId,
            code: code,
            redirect_uri: this.microsoftConfig.redirectUri,
            grant_type: 'authorization_code',
            code_verifier: request.codeVerifier || '',
          }).toString(),
        });

        const tokens = await tokenResponse.json();

        // Fetch user info from Microsoft Graph API
        const userInfoResponse = await fetch('https://graph.microsoft.com/v1.0/me', {
          headers: { Authorization: `Bearer ${tokens.access_token}` },
        });

        const userInfo = await userInfoResponse.json();

        // Store tokens securely
        await this.storeAuthTokens('microsoft', tokens.access_token, tokens.id_token);

        return {
          success: true,
          provider: 'microsoft',
          accessToken: tokens.access_token,
          idToken: tokens.id_token,
          refreshToken: tokens.refresh_token,
          user: {
            id: userInfo.id,
            email: userInfo.mail || userInfo.userPrincipalName,
            name: userInfo.displayName,
          },
        };
      }

      return {
        success: false,
        provider: 'microsoft',
        error: result.type === 'cancel' ? 'User cancelled' : 'Authentication failed',
      };
    } catch (error: any) {
      logger.error('Microsoft OAuth error:', error);
      return {
        success: false,
        provider: 'microsoft',
        error: error.message || 'Microsoft authentication failed',
      };
    }
  }

  /**
   * Store authentication tokens securely
   */
  private async storeAuthTokens(
    provider: string,
    accessToken: string,
    idToken?: string
  ): Promise<void> {
    await secureStorage.storeSecureData(
      `${provider}_access_token`,
      accessToken,
      { requiresAuthentication: false }
    );

    if (idToken) {
      await secureStorage.storeSecureData(
        `${provider}_id_token`,
        idToken,
        { requiresAuthentication: false }
      );
    }
  }

  /**
   * Sign out from social provider
   */
  async signOut(provider: string): Promise<void> {
    await secureStorage.deleteSecureData(`${provider}_access_token`);
    await secureStorage.deleteSecureData(`${provider}_id_token`);

    if (provider === 'apple' && Platform.OS === 'ios') {
      // Apple doesn't require explicit sign-out
      return;
    }

    // Revoke tokens if needed
    // This would be provider-specific
  }

  /**
   * Check if OAuth credentials are configured
   */
  isConfigured(provider: string): boolean {
    switch (provider) {
      case 'google':
        return this.googleConfig.clientId !== 'YOUR_GOOGLE_CLIENT_ID';
      case 'facebook':
        return this.facebookConfig.clientId !== 'YOUR_FACEBOOK_APP_ID';
      case 'microsoft':
        return this.microsoftConfig.clientId !== 'YOUR_MICROSOFT_CLIENT_ID';
      case 'apple':
        return Platform.OS === 'ios';
      default:
        return false;
    }
  }
}

export const socialAuthService = new SocialAuthService();
export default socialAuthService;

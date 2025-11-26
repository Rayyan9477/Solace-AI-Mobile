import { logger } from "@shared/utils/logger";

/**
 * Social Authentication Hooks - Real OAuth Implementation
 * Uses expo-auth-session for Google, Facebook, Microsoft
 * Uses expo-apple-authentication for Apple Sign-In
 */

import { useState, useEffect } from 'react';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import * as AppleAuthentication from 'expo-apple-authentication';
import { Platform } from 'react-native';
import secureStorage from '@app/services/secureStorage';

WebBrowser.maybeCompleteAuthSession();

interface AuthResult {
  success: boolean;
  provider: string;
  accessToken?: string;
  idToken?: string;
  user?: {
    id: string;
    email: string;
    name: string;
    picture?: string;
  };
  error?: string;
}

/**
 * Google OAuth Hook
 */
export const useGoogleAuth = () => {
  const [loading, setLoading] = useState(false);

  const discovery = AuthSession.useAutoDiscovery('https://accounts.google.com');

  const redirectUri = AuthSession.makeRedirectUri({
    scheme: 'freudai',
    path: 'auth/callback',
  });

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID || '',
      scopes: ['openid', 'profile', 'email'],
      redirectUri,
      responseType: AuthSession.ResponseType.Token,
      usePKCE: true,
    },
    discovery
  );

  useEffect(() => {
    if (response?.type === 'success') {
      handleGoogleResponse(response);
    } else if (response?.type === 'error') {
      setLoading(false);
    }
  }, [response]);

  const handleGoogleResponse = async (response: AuthSession.AuthSessionResult) => {
    if (response.type === 'success') {
      const { access_token, id_token } = response.params;

      try {
        // Fetch user info
        const userResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${access_token}` },
        });
        const userInfo = await userResponse.json();

        // Store tokens
        await secureStorage.storeSecureData('google_access_token', access_token, {
          requiresAuthentication: false,
        });
        if (id_token) {
          await secureStorage.storeSecureData('google_id_token', id_token, {
            requiresAuthentication: false,
          });
        }

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
      } catch (error) {
        logger.error('Google user info error:', error);
        return { success: false, provider: 'google', error: 'Failed to fetch user info' };
      } finally {
        setLoading(false);
      }
    }
  };

  const signIn = async (): Promise<AuthResult | null> => {
    if (!request) {
      return { success: false, provider: 'google', error: 'OAuth not configured' };
    }

    setLoading(true);
    const result = await promptAsync();

    if (result.type === 'success') {
      return handleGoogleResponse(result) as Promise<AuthResult>;
    } else if (result.type === 'cancel') {
      setLoading(false);
      return { success: false, provider: 'google', error: 'User cancelled' };
    } else {
      setLoading(false);
      return { success: false, provider: 'google', error: 'Authentication failed' };
    }
  };

  return { signIn, loading, request };
};

/**
 * Facebook OAuth Hook
 */
export const useFacebookAuth = () => {
  const [loading, setLoading] = useState(false);

  const discovery = {
    authorizationEndpoint: 'https://www.facebook.com/v18.0/dialog/oauth',
    tokenEndpoint: 'https://graph.facebook.com/v18.0/oauth/access_token',
  };

  const redirectUri = AuthSession.makeRedirectUri({
    scheme: 'freudai',
    path: 'auth/callback',
  });

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: process.env.EXPO_PUBLIC_FACEBOOK_APP_ID || '',
      scopes: ['public_profile', 'email'],
      redirectUri,
      responseType: AuthSession.ResponseType.Token,
    },
    discovery
  );

  useEffect(() => {
    if (response?.type === 'success') {
      handleFacebookResponse(response);
    } else if (response?.type === 'error') {
      setLoading(false);
    }
  }, [response]);

  const handleFacebookResponse = async (response: AuthSession.AuthSessionResult) => {
    if (response.type === 'success') {
      const { access_token } = response.params;

      try {
        // Fetch user info
        const userResponse = await fetch(
          `https://graph.facebook.com/me?fields=id,name,email,picture.type(large)&access_token=${access_token}`
        );
        const userInfo = await userResponse.json();

        // Store token
        await secureStorage.storeSecureData('facebook_access_token', access_token, {
          requiresAuthentication: false,
        });

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
      } catch (error) {
        logger.error('Facebook user info error:', error);
        return { success: false, provider: 'facebook', error: 'Failed to fetch user info' };
      } finally {
        setLoading(false);
      }
    }
  };

  const signIn = async (): Promise<AuthResult | null> => {
    if (!request) {
      return { success: false, provider: 'facebook', error: 'OAuth not configured' };
    }

    setLoading(true);
    const result = await promptAsync();

    if (result.type === 'success') {
      return handleFacebookResponse(result) as Promise<AuthResult>;
    } else if (result.type === 'cancel') {
      setLoading(false);
      return { success: false, provider: 'facebook', error: 'User cancelled' };
    } else {
      setLoading(false);
      return { success: false, provider: 'facebook', error: 'Authentication failed' };
    }
  };

  return { signIn, loading, request };
};

/**
 * Microsoft OAuth Hook
 */
export const useMicrosoftAuth = () => {
  const [loading, setLoading] = useState(false);

  const discovery = AuthSession.useAutoDiscovery(
    'https://login.microsoftonline.com/common/v2.0'
  );

  const redirectUri = AuthSession.makeRedirectUri({
    scheme: 'freudai',
    path: 'auth/callback',
  });

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: process.env.EXPO_PUBLIC_MICROSOFT_CLIENT_ID || '',
      scopes: ['openid', 'profile', 'email', 'User.Read'],
      redirectUri,
      responseType: AuthSession.ResponseType.Code,
      usePKCE: true,
    },
    discovery
  );

  useEffect(() => {
    if (response?.type === 'success') {
      handleMicrosoftResponse(response);
    } else if (response?.type === 'error') {
      setLoading(false);
    }
  }, [response]);

  const handleMicrosoftResponse = async (response: AuthSession.AuthSessionResult) => {
    if (response.type === 'success' && discovery) {
      const { code } = response.params;

      try {
        // Exchange code for tokens
        const tokenResponse = await fetch(discovery.tokenEndpoint!, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            client_id: process.env.EXPO_PUBLIC_MICROSOFT_CLIENT_ID || '',
            code: code,
            redirect_uri: redirectUri,
            grant_type: 'authorization_code',
            code_verifier: request?.codeVerifier || '',
          }).toString(),
        });

        const tokens = await tokenResponse.json();

        // Fetch user info
        const userResponse = await fetch('https://graph.microsoft.com/v1.0/me', {
          headers: { Authorization: `Bearer ${tokens.access_token}` },
        });
        const userInfo = await userResponse.json();

        // Store tokens
        await secureStorage.storeSecureData('microsoft_access_token', tokens.access_token, {
          requiresAuthentication: false,
        });
        if (tokens.id_token) {
          await secureStorage.storeSecureData('microsoft_id_token', tokens.id_token, {
            requiresAuthentication: false,
          });
        }

        return {
          success: true,
          provider: 'microsoft',
          accessToken: tokens.access_token,
          idToken: tokens.id_token,
          user: {
            id: userInfo.id,
            email: userInfo.mail || userInfo.userPrincipalName,
            name: userInfo.displayName,
          },
        };
      } catch (error) {
        logger.error('Microsoft auth error:', error);
        return { success: false, provider: 'microsoft', error: 'Authentication failed' };
      } finally {
        setLoading(false);
      }
    }
  };

  const signIn = async (): Promise<AuthResult | null> => {
    if (!request) {
      return { success: false, provider: 'microsoft', error: 'OAuth not configured' };
    }

    setLoading(true);
    const result = await promptAsync();

    if (result.type === 'success') {
      return handleMicrosoftResponse(result) as Promise<AuthResult>;
    } else if (result.type === 'cancel') {
      setLoading(false);
      return { success: false, provider: 'microsoft', error: 'User cancelled' };
    } else {
      setLoading(false);
      return { success: false, provider: 'microsoft', error: 'Authentication failed' };
    }
  };

  return { signIn, loading, request };
};

/**
 * Apple Sign-In Hook (iOS only)
 */
export const useAppleAuth = () => {
  const [loading, setLoading] = useState(false);
  const [isAvailable, setIsAvailable] = useState(false);

  useEffect(() => {
    checkAvailability();
  }, []);

  const checkAvailability = async () => {
    if (Platform.OS === 'ios') {
      const available = await AppleAuthentication.isAvailableAsync();
      setIsAvailable(available);
    }
  };

  const signIn = async (): Promise<AuthResult> => {
    if (!isAvailable) {
      return {
        success: false,
        provider: 'apple',
        error: 'Apple Sign-In not available on this device',
      };
    }

    setLoading(true);

    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      // Store tokens
      if (credential.identityToken) {
        await secureStorage.storeSecureData('apple_identity_token', credential.identityToken, {
          requiresAuthentication: false,
        });
      }
      if (credential.authorizationCode) {
        await secureStorage.storeSecureData('apple_auth_code', credential.authorizationCode, {
          requiresAuthentication: false,
        });
      }

      setLoading(false);

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
      setLoading(false);

      if (error.code === 'ERR_CANCELED') {
        return { success: false, provider: 'apple', error: 'User cancelled' };
      }

      return {
        success: false,
        provider: 'apple',
        error: error.message || 'Apple Sign-In failed',
      };
    }
  };

  return { signIn, loading, isAvailable };
};

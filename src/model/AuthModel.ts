import { Platform } from 'react-native';
import * as Keychain from 'react-native-keychain';

export interface User {
  id: string;
  email: string;
  name: string;
  photo?: string;
}

export class AuthModel {
  private static instance: AuthModel;
  private isInitialized: boolean = false;
  private googleAuth: any = null;
  private readonly TOKEN_KEY = 'authToken';

  private constructor() {
    this.initializeGoogleSignIn();
  }

  public static getInstance(): AuthModel {
    if (!AuthModel.instance) {
      AuthModel.instance = new AuthModel();
    }
    return AuthModel.instance;
  }

  private async initializeGoogleSignIn() {
    if (!this.isInitialized) {
      // Load the Google Sign-In script
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);

      script.onload = () => {
        // @ts-ignore
        this.googleAuth = window.google.accounts.oauth2;
        this.isInitialized = true;
      };
    }
  }

  public async signIn(): Promise<User> {
    try {
      if (!this.isInitialized) {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for script to load
      }

      return new Promise((resolve, reject) => {
        // @ts-ignore
        const response = window.google.accounts.oauth2.initCodeClient({
          client_id: '815896979301-e3g83j8auqaorren5eb8qokbffa2qugi.apps.googleusercontent.com',
          scope: 'email profile',
          callback: async (response: any) => {
            try {
              if (response.code) {
                // Exchange code for tokens
                const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                  },
                  body: new URLSearchParams({
                    code: response.code,
                    client_id: '815896979301-e3g83j8auqaorren5eb8qokbffa2qugi.apps.googleusercontent.com',
                    client_secret: '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',
                    redirect_uri: window.location.origin,
                    grant_type: 'authorization_code',
                  }),
                });

                const tokens = await tokenResponse.json();
                await this.storeToken(tokens.access_token);

                // Get user info
                const userInfo = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
                  headers: {
                    Authorization: `Bearer ${tokens.access_token}`,
                  },
                });

                const userData = await userInfo.json();
                resolve({
                  id: userData.id,
                  email: userData.email,
                  name: userData.name,
                  photo: userData.picture,
                });
              } else {
                reject(new Error('Failed to get authorization code'));
              }
            } catch (error) {
              reject(error);
            }
          },
        });

        response.requestCode();
      });
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  }

  public async signOut(): Promise<void> {
    try {
      await this.removeToken();
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  }

  public async getCurrentUser(): Promise<User | null> {
    try {
      const token = await this.getToken();
      if (!token) return null;

      const userInfo = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const userData = await userInfo.json();
      return {
        id: userData.id,
        email: userData.email,
        name: userData.name,
        photo: userData.picture,
      };
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }

  private async storeToken(token: string): Promise<void> {
    try {
      if (Platform.OS === 'web') {
        localStorage.setItem(this.TOKEN_KEY, token);
      } else {
        await Keychain.setGenericPassword(this.TOKEN_KEY, token);
      }
    } catch (error) {
      console.error('Store token error:', error);
      throw error;
    }
  }

  private async removeToken(): Promise<void> {
    try {
      if (Platform.OS === 'web') {
        localStorage.removeItem(this.TOKEN_KEY);
      } else {
        await Keychain.resetGenericPassword();
      }
    } catch (error) {
      console.error('Remove token error:', error);
      throw error;
    }
  }

  public async getToken(): Promise<string | null> {
    try {
      if (Platform.OS === 'web') {
        return localStorage.getItem(this.TOKEN_KEY);
      } else {
        const credentials = await Keychain.getGenericPassword();
        return credentials ? credentials.password : null;
      }
    } catch (error) {
      console.error('Get token error:', error);
      return null;
    }
  }
} 
import { GoogleSignin } from '@react-native-google-signin/google-signin';
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
      GoogleSignin.configure({
        webClientId: 'YOUR_WEB_CLIENT_ID', // Replace with your Google Web Client ID
        scopes: ['profile', 'email'],
      });
      this.isInitialized = true;
    }
  }

  public async signIn(): Promise<User> {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      
      const user: User = {
        id: userInfo.user.id,
        email: userInfo.user.email,
        name: userInfo.user.name || '',
        photo: userInfo.user.photo || '',

      };

      // Store the access token securely
      const { accessToken } = await GoogleSignin.getTokens();
      await this.storeToken(accessToken);

      return user;
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  }

  public async signOut(): Promise<void> {
    try {
      await GoogleSignin.signOut();
      await this.removeToken();
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  }

  public async getCurrentUser(): Promise<User | null> {
    try {
      const isSignedIn = await GoogleSignin.isSignedIn();
      if (!isSignedIn) return null;

      const userInfo = await GoogleSignin.signInSilently();
      return {
        id: userInfo.user.id,
        email: userInfo.user.email,
        name: userInfo.user.name || '',
        photo: userInfo.user.photo || '',

      };
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }

  private async storeToken(token: string): Promise<void> {
    try {
      await Keychain.setGenericPassword('authToken', token);
    } catch (error) {
      console.error('Store token error:', error);
      throw error;
    }
  }

  private async removeToken(): Promise<void> {
    try {
      await Keychain.resetGenericPassword();
    } catch (error) {
      console.error('Remove token error:', error);
      throw error;
    }
  }

  public async getToken(): Promise<string | null> {
    try {
      const credentials = await Keychain.getGenericPassword();
      return credentials ? credentials.password : null;
    } catch (error) {
      console.error('Get token error:', error);
      return null;
    }
  }
} 
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { AuthPresenter, AuthView } from '../presenter/AuthPresenter';
import { User } from '../model/AuthModel';

export const LoginScreen: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [presenter] = useState(() => new AuthPresenter(new LoginScreenView(setUser, setLoading, setError)));

  useEffect(() => {
    presenter.checkAuthState();
  }, []);

  const handleSignIn = async () => {
    setError(null);
    await presenter.signIn();
  };

  const handleSignOut = async () => {
    setError(null);
    await presenter.signOut();
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          {user ? (
            <View style={styles.userContainer}>
              <Text style={styles.welcomeText}>Welcome, {user.name}!</Text>
              <Text style={styles.emailText}>{user.email}</Text>
              <TouchableOpacity style={styles.button} onPress={handleSignOut}>
                <Text style={styles.buttonText}>Sign Out</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.loginContainer}>
              <Text style={styles.title}>Welcome to MVP Google Sign-In</Text>
              <TouchableOpacity style={styles.button} onPress={handleSignIn}>
                <Text style={styles.buttonText}>Sign in with Google</Text>
              </TouchableOpacity>
            </View>
          )}
          {error && <Text style={styles.errorText}>{error}</Text>}
        </>
      )}
    </View>
  );
};

class LoginScreenView implements AuthView {
  constructor(
    private setUser: (user: User | null) => void,
    private setLoading: (loading: boolean) => void,
    private setError: (error: string | null) => void
  ) {}

  onSignInSuccess(user: User): void {
    this.setUser(user);
    this.setError(null);
  }

  onSignInError(error: Error): void {
    this.setError(error.message);
  }

  onSignOutSuccess(): void {
    this.setUser(null);
    this.setError(null);
  }

  onSignOutError(error: Error): void {
    this.setError(error.message);
  }

  onLoadingStart(): void {
    this.setLoading(true);
  }

  onLoadingEnd(): void {
    this.setLoading(false);
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  loginContainer: {
    alignItems: 'center',
  },
  userContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  emailText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#4285f4',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 5,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: '#ff0000',
    marginTop: 10,
    textAlign: 'center',
  },
}); 
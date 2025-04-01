import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { AuthPresenter, AuthView } from '../presenter/AuthPresenter';
import { User } from '../model/AuthModel';

export const LoginScreen: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [presenter] = useState(() => new AuthPresenter(new LoginScreenView(this)));

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
  constructor(private screen: LoginScreen) {}

  onSignInSuccess(user: User): void {
    this.screen.setState({ user, error: null });
  }

  onSignInError(error: Error): void {
    this.screen.setState({ error: error.message });
  }

  onSignOutSuccess(): void {
    this.screen.setState({ user: null, error: null });
  }

  onSignOutError(error: Error): void {
    this.screen.setState({ error: error.message });
  }

  onLoadingStart(): void {
    this.screen.setState({ loading: true });
  }

  onLoadingEnd(): void {
    this.screen.setState({ loading: false });
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
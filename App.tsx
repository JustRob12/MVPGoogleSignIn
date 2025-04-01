import React from 'react';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import { LoginScreen } from './src/view/LoginScreen';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <LoginScreen />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
}); 
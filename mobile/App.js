import React from 'react';
import { StyleSheet, View } from 'react-native';
import Index from './pages/Index';
import './assets/styles/globals.css'

export default function App() {
  return (
    <View style={styles.container}>
      <Index/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '2e2e2e',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

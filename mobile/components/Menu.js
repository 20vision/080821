import React from 'react';
import { StyleSheet, Button, View, SafeAreaView, Text, Alert } from 'react-native';


const App = () => (
     <View>
      <Button
        color="red"
        onPress={() => Alert.alert('Simple Button pressed')}
      />
    </View>
);

const styles = StyleSheet.create({
    button: {
      flex: 1,
      padding: 20,
    },
  });
  

export default App;
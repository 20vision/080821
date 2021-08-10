import React, { Component } from 'react';
import { StyleSheet, Button, View, Image, Text, Alert } from 'react-native';
import Menu from '../components/Menu'

export default class ButtonBasics extends Component {
  _onPressButton() {
    <View>
      <Menu/>
    </View>
  }
  render() {
    return (
      <View style={styles.button}>
        <Button
          color= '#2e2e2e'
          title= 'Discover'
          onPress={this._onPressButton}
        />
      </View>
    );
  };
}

const styles = StyleSheet.create({
    button: {
      marginTop: '20px',
      marginLeft: '20px',
      alignItems: 'baseline'
    },
  });


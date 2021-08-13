import React, { Component } from 'react';
import { StyleSheet, Button, View, Image, Text, Alert } from 'react-native';
import Menu from '../components/Menu'


function Default(props) {
  return (
    <View styles= {styles.base}>
      <View style={styles.button}>
        <Button
          color= '#2e2e2e'
          title= 'Discover'
        />
      </View>
      <View style={styles.context}>
          
      </View>
    </View>
    );
  };


const styles = StyleSheet.create({
    
    base:{
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-around',
    },
    
    button: {
      Top: '20px',
      Left: '20px',
    },

    context: {
      color: '1BE107',
      height: '20',
      width: '20',
    },
  });

export default Default;
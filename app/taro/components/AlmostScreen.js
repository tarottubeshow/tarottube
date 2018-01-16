import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { Image, StyleSheet, Text, View  } from 'react-native'

import COLORS from 'taro/colors'

class AlmostScreen extends Component {

  static propTypes = {

  }

  render = () => {
    return (
      <View style={ styles.parent }>
        <Image
          style={ styles.logo }
          source={require('img/logo_long_blue_red.png')}
        />
        <Text style={ styles.heading }>
          The Read Will Begin Shortly
        </Text>
      </View>
    )
  }

}

const styles = StyleSheet.create({
  parent: {
    backgroundColor: COLORS.white,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heading: {
    color: COLORS.red,
    fontWeight: 'bold',
    fontSize: 24,
    marginBottom: 10,
  },
  logo: {
    width: 260,
    height: 43,
    marginBottom: 20,
  },
})

export default AlmostScreen

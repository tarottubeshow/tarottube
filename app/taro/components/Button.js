import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

import COLORS from 'taro/colors'
import * as proputil from 'taro/util/proputil'
import GradientBackground from 'taro/components/GradientBackground'

const COLOR_SETS = {
  yellow: [COLORS.yellowLight, COLORS.yellow],
  orange: [COLORS.orangeLight, COLORS.orange],
  purple: [COLORS.purpleLight, COLORS.purple],
  green: [COLORS.greenLight, COLORS.green],
  blue: [COLORS.blueLight, COLORS.blue],
  peach: [COLORS.peachLight, COLORS.peach],
}

class Button extends Component {

  static props = {
    color: PropTypes.string,
    children: proputil.CHILDREN_TYPE,
    text: PropTypes.string,
    style: proputil.STYLE_TYPE,
  }

  render = () => {
    const {
      color,
      onPress,
      style,
    } = this.props
    return (
      <TouchableOpacity
        onPress={ onPress }
      >
        <View style={ [styles.shadow, style] }>
          <GradientBackground
            style={ [styles.button, style] }
            stops={ COLOR_SETS[ color || 'yellow' ]  }
          >
            { this.renderInside() }
          </GradientBackground>
        </View>
      </TouchableOpacity>
    )
  }

  renderInside = () => {
    const {
      children,
      text,
    } = this.props
    if(text != null) {
      return (
        <Text style={ styles.buttonText }>
          { text }
        </Text>
      )
    } else {
      return children
    }
  }

}

const styles = StyleSheet.create({
  shadow: {
    shadowColor: '#000',
    shadowOffset: {width: 2, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 3,
    backgroundColor: 'transparent',
  },
  button: {
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 20,
    paddingRight: 20,
    borderRadius: 100,
    overflow: 'hidden',
  },
  buttonText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: COLORS.black,
    backgroundColor: 'transparent',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 1,
  },
})

export default Button

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect as reduxConnect } from 'react-redux'

import { Image, StyleSheet, Text, View } from 'react-native'

import COLORS from 'taro/colors'
import AmbientGradientBackground from 'taro/components/AmbientGradientBackground'
import Button from 'taro/components/Button'
import Timer from 'taro/components/Timer'
import * as metautil from 'taro/util/metautil'
import * as proputil from 'taro/util/proputil'
import { LOGO_LONG_WHITE } from 'taro/Images'

class StreamEndedScreen extends Component {

  static propTypes = {
    onReplay: PropTypes.func,
    missed: PropTypes.bool,
    style: proputil.STYLE_TYPE,
  }

  getNote = () => {
    const {
      missed,
    } = this.props
    if(missed) {
      return "You missed the stream!"
    } else {
      return "Thanks for tuning in!"
    }
  }

  onReplay = () => {
    this.props.onReplay()
  }

  render = () => {
    const {
      style,
    } = this.props
    return (
      <AmbientGradientBackground style={ [style, styles.parent] }>
        <View style={ styles.top }/>
        <Image
          style={ styles.logo }
          source={ LOGO_LONG_WHITE }
        />
        <Text style={ styles.note }>
          { this.getNote() }
        </Text>
        <View style={ styles.bottom }>
          <Button
            text="Replay"
            onPress={ this.onReplay }
            style={ styles.bottomButton }
            color="yellow"
          />
        </View>
      </AmbientGradientBackground>
    )
  }
}

const styles = StyleSheet.create({
  parent: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 260,
    height: 43,
  },
  note: {
    backgroundColor: 'transparent',
    color: COLORS.white,
    fontSize: 24,
    marginTop: 20,
    backgroundColor: 'transparent',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 1,
  },
  timer: {
    marginTop: 10,
  },
  top: {
    flexGrow: 1,
  },
  bottom: {
    flexGrow: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    paddingBottom: 20,
  },
  bottomButton: {
    width: 300,
    marginTop: 10,
  },
})

export default StreamEndedScreen

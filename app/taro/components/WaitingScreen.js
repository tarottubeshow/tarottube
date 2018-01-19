import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect as reduxConnect } from 'react-redux'

import { Image, StyleSheet, Text, View } from 'react-native'

import COLORS from 'taro/colors'
import AmbientGradientBackground from 'taro/components/AmbientGradientBackground'
import Button from 'taro/components/Button'
import Timer from 'taro/components/Timer'
import { LOGO_LONG_WHITE } from 'taro/Images'

class WaitingScreen extends Component {

  static propTypes = {
    onReplay: PropTypes.func,
    timeslot: PropTypes.object,
    isFuture: PropTypes.bool,
  }

  onReplayLatest = () => {
    this.props.onReplay()
  }

  render = () => {
    return (
      <AmbientGradientBackground style={ styles.parent }>
        <View style={ styles.top }/>
        <Image
          style={ styles.logo }
          source={ LOGO_LONG_WHITE }
        />
        { this.renderTimer() }
        <View style={ styles.bottom }>
          <Button
            text="Replay Latest"
            onPress={ this.onReplayLatest }
            style={ styles.bottomButton }
            color="yellow"
          />
        </View>
      </AmbientGradientBackground>
    )
  }

  renderTimer = () => {
    const {
      isFuture,
      timeslot,
    } = this.props
    if(isFuture) {
      return (
        <Timer
          style={ styles.timer }
          time={ timeslot.getStartTime() }
        />
      )
    } else {
      return (
        <Text style={ styles.soon }>
          will begin shortly!
        </Text>
      )
    }
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
  soon: {
    backgroundColor: 'transparent',
    color: COLORS.white,
    fontSize: 32,
    marginTop: 0,
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

export default WaitingScreen

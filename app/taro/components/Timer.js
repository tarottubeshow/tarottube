import React, { Component } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { connect as reduxConnect } from 'react-redux'

import { Image, StyleSheet, Text, View } from 'react-native'

import COLORS from 'taro/colors'
import GradientBackground from 'taro/components/gradient/GradientBackground'
import * as proputil from 'taro/util/proputil'
import * as scheduleutil from 'taro/util/scheduleutil'

class TimerDigit extends Component {

  static propTypes = {
    children: proputil.CHILDREN_TYPE,
  }

  render = () => {
    const {
      children,
    } = this.props
    return (
      <View style={ styles.shadow }>
        <GradientBackground
          style={ [styles.digitHolder] }
          stops={ [ COLORS.yellowLight, COLORS.yellow ] }>
          <Text style={ styles.digit }>
            { children }
          </Text>
        </GradientBackground>
      </View>
    )
  }

}

class TimerSeperator extends Component {

  render = () => {
    return (
      <Text style={ styles.seperator }>:</Text>
    )
  }

}

class Timer extends Component {

  static propTypes = {
    time: PropTypes.object,
    style: proputil.STYLE_TYPE,
  }

  state = {
    now: new Date(),
  }

  componentDidMount = () => {
    this._ticker = new scheduleutil.Ticker(100, this.tick)
  }

  componentWillUnmount = () => {
    this._ticker.stop()
  }

  tick = () => {
    this.setState({now: new Date()})
  }

  render = () => {
    const {
      time,
      style,
    } = this.props
    const {
      now,
    } = this.state
    const delta = (time - now)
    const duration = moment.duration(delta)
    const d = duration.days()
    const h = duration.hours()
    const m = duration.minutes()
    const s = duration.seconds()
    const h1 = Math.floor(h / 10)
    const h2 = h % 10
    const m1 = Math.floor(m / 10)
    const m2 = m % 10
    const s1 = Math.floor(s / 10)
    const s2 = s % 10
    return (
      <View style={ [styles.parent, style] }>
        <TimerDigit>{ h1 }</TimerDigit>
        <TimerDigit>{ h2 }</TimerDigit>
        <TimerSeperator />
        <TimerDigit>{ m1 }</TimerDigit>
        <TimerDigit>{ m2 }</TimerDigit>
        <TimerSeperator />
        <TimerDigit>{ s1 }</TimerDigit>
        <TimerDigit>{ s2 }</TimerDigit>
      </View>
    )
  }

}

const styles = StyleSheet.create({
  parent: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  seperator: {
    color: COLORS.yellow,
    fontSize: 48,
    fontWeight: 'bold',
    backgroundColor: 'transparent',
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {width: 2, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 1,
    backgroundColor: 'transparent',
  },
  digitHolder: {
    borderRadius: 5,
    margin: 2,
    width: 32,
    height: 54,
    overflow: 'hidden',
  },
  digit: {
    color: COLORS.black,
    padding: 5,
    fontSize: 36,
    fontWeight: 'bold',
    width: 32,
    textAlign: 'center',
    backgroundColor: 'transparent',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 1,
  },
})

export default Timer

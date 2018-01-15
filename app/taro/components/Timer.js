import React, { Component } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { connect as reduxConnect } from 'react-redux'

import { Image, StyleSheet, Text, View } from 'react-native'

import COLORS from 'taro/colors'

class Timer extends Component {

  static propTypes = {
    time: PropTypes.object,
  }

  state = {
    now: new Date(),
  }

  componentDidMount = () => {
    this.timer = global.setInterval(this.computeState, 100)
  }

  componentWillUnmount = () => {
    global.clearInterval(this.timer)
  }

  computeState = () => {
    this.setState({now: new Date()})
  }

  render = () => {
    const delta = (this.props.time - this.state.now)
    const duration = moment.duration(delta)
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
      <View style={ styles.parent }>
        <View style={ styles.digitHolder }>
          <Text style={ styles.digit }>
            { h1 }
          </Text>
        </View>
        <View style={ styles.digitHolder }>
          <Text style={ styles.digit }>
            { h2 }
          </Text>
        </View>

        <Text style={ styles.seperator }>:</Text>

        <View style={ styles.digitHolder }>
          <Text style={ styles.digit }>
            { m1 }
          </Text>
        </View>
        <View style={ styles.digitHolder }>
          <Text style={ styles.digit }>
            { m2 }
          </Text>
        </View>

        <Text style={ styles.seperator }>:</Text>

        <View style={ styles.digitHolder }>
          <Text style={ styles.digit }>
            { s1 }
          </Text>
        </View>

        <View style={ styles.digitHolder }>
          <Text style={ styles.digit }>
            { s2 }
          </Text>
        </View>
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
    color: COLORS.blue,
    fontSize: 48,
    fontWeight: 'bold',
  },
  digitHolder: {
    backgroundColor: COLORS.blue,
    borderRadius: 5,
    margin: 2,
    width: 32,
    overflow: 'hidden',

  },
  digit: {
    color: COLORS.white,
    padding: 5,
    fontSize: 36,
    fontWeight: 'bold',
    width: 32,
    textAlign: 'center',
  },
})

export default Timer

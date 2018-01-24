import React, { Component } from 'react'
import PropTypes from 'prop-types'
import interpolate from 'color-interpolate'
import { View, StyleSheet } from 'react-native'

import COLORS from 'taro/colors'
import GradientBackground from 'taro/components/gradient/GradientBackground'
import * as proputil from 'taro/util/proputil'
import * as scheduleutil from 'taro/util/scheduleutil'

const TOP_COLORMAP = interpolate([
  COLORS.blue,
  COLORS.purple,
  COLORS.peach,
  COLORS.blue,
])
const BOTTOM_COLORMAP = interpolate([
  COLORS.blueLight,
  COLORS.purpleLight,
  COLORS.peachLight,
  COLORS.blueLight,
])
const PERIOD = 20000

class AmbientGradientBackground extends Component {

  static propTypes = {
    style: proputil.STYLE_TYPE,
    children: proputil.CHILDREN_TYPE,
  }

  state = {
    topColor: COLORS.orange,
    bottomColor: COLORS.orangeLight,
  }

  componentDidMount = () => {
    this._ticker = new scheduleutil.Ticker(25, this.tick)
  }

  componentWillUnmount = () => {
    this._ticker.stop()
  }

  tick = (time) => {
    const position = time / PERIOD
    const truncated = position - Math.floor(position)
    const topColor = TOP_COLORMAP(truncated)
    const bottomColor = BOTTOM_COLORMAP(truncated)
    this.setState({
      topColor,
      bottomColor,
    })
  }

  render = () => {
    const {
      children,
      style,
    } = this.props
    const {
      topColor,
      bottomColor,
    } = this.state
    return (
      <GradientBackground
        style={ style }
        stops={ [topColor, bottomColor] }
      >
        { children }
      </GradientBackground>
    )
  }

}

export default AmbientGradientBackground

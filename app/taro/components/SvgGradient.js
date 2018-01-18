import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { View, StyleSheet } from 'react-native'
import { Svg } from 'expo'

import COLORS from 'taro/colors'
import * as proputil from 'taro/util/proputil'

class SvgGradient extends Component {

  static props = {
    style: proputil.STYLE_TYPE,
    stops: PropTypes.array,
  }

  render = () => {
    // TODO: alternate gradient angles
    const {
      style,
    } = this.props
    return (
      <Svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        style={ style }
      >
      <Svg.Defs>
        <Svg.LinearGradient
          id="fill"
          x1="0"
          y1="0"
          x2="100"
          y2="100"
        >
          { this.renderStops() }
        </Svg.LinearGradient>
      </Svg.Defs>
      <Svg.Rect
        x="0"
        y="0"
        width="100"
        height="100"
        fill="url(#fill)"
      />
    </Svg>
    )
  }

  renderStops = () => {
    var {
      stops,
    } = this.props

    if(stops == null || stops.length == 0) {
      stops = [COLORS.black, COLORS.white]
    } else if(stops.length == 1) {
      stops = [stops[0], stops[0]]
    }

    const stopElements = []
    for(const i in stops) {
      const stop = stops[i]
      let offset = 100 * i / (stops.length - 1)
      // TODO: alternate offsets
      stopElements.push(
        <Svg.Stop
          offset={ `${ offset }%` }
          stopColor={ stop }
          key={ `stop_${ i }` }
        />
      )
    }
    return stopElements
  }
}

const styles = StyleSheet.create({
  parent: {
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  stretch: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
})

export default SvgGradient

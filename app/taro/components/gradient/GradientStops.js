import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { Svg } from 'expo'

import COLORS from 'taro/colors'

class GradientStops extends Component {

  static props = {
    id: PropTypes.string,
    stops: PropTypes.array,
    p1: PropTypes.array,
    p2: PropTypes.array,
  }

  render = () => {
    // TODO: angles
    const {
      id,
      p1,
      p2,
    } = this.props
    return (
      <Svg.LinearGradient
        id={ id }
        x1={ p1[0] }
        y1={ p1[1] }
        x2={ p2[0] }
        y2={ p2[1] }
      >
        { this.renderStops() }
      </Svg.LinearGradient>
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

export default GradientStops

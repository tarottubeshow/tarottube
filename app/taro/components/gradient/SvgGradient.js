import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { View, StyleSheet } from 'react-native'
import { Svg } from 'expo'

import * as proputil from 'taro/util/proputil'
import GradientStops from 'taro/components/gradient/GradientStops'

class SvgGradient extends Component {

  static props = {
    style: proputil.STYLE_TYPE,
    stops: PropTypes.array,
  }

  render = () => {
    // TODO: alternate gradient angles
    const {
      stops,
      style,
    } = this.props
    return (
      <Svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        style={ style }
      >
        <Svg.Defs>
          <GradientStops
            id="fill"
            p1={ [0, 0] }
            p2={ [100, 100] }
            stops={ stops }
          />
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

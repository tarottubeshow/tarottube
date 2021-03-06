import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { View, StyleSheet } from 'react-native'

import SvgGradient from 'taro/components/gradient/SvgGradient'
import * as proputil from 'taro/util/proputil'
import * as deviceutil from 'taro/util/deviceutil'

class GradientBackground extends Component {

  static propTypes = {
    style: proputil.STYLE_TYPE,
    children: proputil.CHILDREN_TYPE,
    stops: PropTypes.array,
  }

  render = () => {
    if(deviceutil.isIos()) {
      return this.renderIos()
    } else {
      return this.renderAndroid()
    }
  }

  renderAndroid = () => {
    const {
      children,
      style,
      stops,
    } = this.props
    return (
      <View
        style={ [
          {
            backgroundColor: stops[0],
          },
          style,
        ] }
        ref={ this._initRoot }
      >
        { children }
      </View>
    )
  }

  renderIos = () => {
    const {
      children,
      style,
      stops,
    } = this.props
    return (
      <View
        style={ [
          styles.parent,
          style,
        ] }
        ref={ this._initRoot }
      >
        { children }
        <SvgGradient
          stops={ stops }
          style={ styles.gradient }
        />
      </View>
    )
  }

  _initRoot = (c) => {
    this._root = c
  }

  setNativeProps = (nativeProps) => {
    this._root.setNativeProps(nativeProps);
  }

}

const styles = StyleSheet.create({
  gradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
  },
  content: {
    zIndex: 100,
  },
})

export default GradientBackground

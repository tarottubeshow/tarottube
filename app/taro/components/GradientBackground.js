import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { Platform, View, StyleSheet } from 'react-native'

import SvgGradient from 'taro/components/SvgGradient'
import * as proputil from 'taro/util/proputil'

class GradientBackground extends Component {

  static propTypes = {
    style: proputil.STYLE_TYPE,
    children: proputil.CHILDREN_TYPE,
    stops: PropTypes.array,
  }

  render = () => {
    if(Platform.OS === 'ios') {
      return this.renderIos()
    } else {
      return this.renderAndroid()
    }
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

  renderAndroid = () => {
    const {
      children,
      style,
      stops,
    } = this.props
    return (
      <View
        style={ [
          style,
          { backgroundColor: stops[0] }
        ] }
        ref={ this._initRoot }
      >
        { children }
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
})

export default GradientBackground

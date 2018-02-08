import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect as reduxConnect } from 'react-redux'

import { Platform } from 'react-native'
import * as NB from 'native-base'

import * as metautil from 'taro/util/metautil'
import * as proputil from 'taro/util/proputil'
import RoutableComponent from 'taro/hoc/RoutableComponent'

class TitledScreenView extends Component {

  static propTypes = {
    onBack: PropTypes.func,

    title: PropTypes.string,
    children: proputil.CHILDREN_TYPE,

    leftIcon: PropTypes.string,
    rightIcon: PropTypes.string,
    onRightIconClick: PropTypes.func,

    goBack: PropTypes.func,
    safeTop: PropTypes.number,
  }

  getToolbarPadding = () => {
    if(Platform.OS == 'ios') {
      return {}
    } else {
      const safeTop = this.props.safeTop
      return {
        paddingTop: safeTop,
        height: 40 + safeTop,
      }
    }
  }

  onBack = () => {
    const {
      onBack,
      goBack,
    } = this.props
    if(onBack != null) {
      onBack()
    }
    goBack()
  }

  render = () => {
    const {
      children,
    } = this.props
    return (
      <NB.Container>
        { this.renderHeader() }
        { children }
      </NB.Container>
    )
  }

  renderHeader = () => {
    const {
      title,
    } = this.props
    return (
      <NB.Header
        style={ this.getToolbarPadding() }
      >
        <NB.Left>
          { this.renderBack() }
        </NB.Left>
        <NB.Body>
          <NB.Title>
            { title }
          </NB.Title>
        </NB.Body>
        <NB.Right>
          { this.renderRight() }
        </NB.Right>
      </NB.Header>
    )
  }

  renderBack = () => {
    const {
      leftIcon,
    } = this.props
    return (
      <NB.Button
        transparent
        onPress={ this.onBack }
      >
        <NB.Icon
          name={(leftIcon || 'ios-arrow-back')}
        />
      </NB.Button>
    )
  }

  renderRight = () => {
    const {
      rightIcon,
      onRightIconClick,
    } = this.props
    if(rightIcon == null) {
      return
    }

    return (
      <NB.Button
        transparent
        onPress={ onRightIconClick }
      >
        <NB.Icon name={ rightIcon } />
      </NB.Button>
    )
  }

}

const TitledScreen = metautil.applyHocs(
  TitledScreenView,
  RoutableComponent,
  reduxConnect(
    (state, props) => ({
      safeTop: state.Device.safeTop,
    }),
    (dispatch, props) => ({
    }),
  ),
)

export default TitledScreen

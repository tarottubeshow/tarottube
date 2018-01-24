import React, { Component } from 'react'
import PropTypes from 'prop-types'

import * as NB from 'native-base'

import * as metautil from 'taro/util/metautil'
import * as proputil from 'taro/util/proputil'
import RoutableComponent from 'taro/hoc/RoutableComponent'

class TitledScreenView extends Component {

  static propTypes = {
    backRoute: PropTypes.object,
    onBack: PropTypes.func,

    title: PropTypes.string,
    children: proputil.CHILDREN_TYPE,

    goto: PropTypes.func,
  }

  onBack = () => {
    const {
      backRoute,
      onBack,
      goto,
    } = this.props
    if(onBack != null) {
      onBack()
    }
    if(backRoute != null) {
      goto(backRoute)
    }
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
      <NB.Header>
        <NB.Left>
          { this.renderBack() }
        </NB.Left>
        <NB.Body>
          <NB.Title>
            { title }
          </NB.Title>
        </NB.Body>
        <NB.Right />
      </NB.Header>
    )
  }

  renderBack = () => {
    return (
      <NB.Button
        transparent
        onPress={ this.onBack }
      >
        <NB.Icon name='ios-arrow-back' />
      </NB.Button>
    )
  }

}

const TitledScreen = metautil.applyHocs(
  TitledScreenView,
  RoutableComponent,
)

export default TitledScreen

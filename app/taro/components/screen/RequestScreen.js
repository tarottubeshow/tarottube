import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect as reduxConnect } from 'react-redux'

import * as NB from 'native-base'

import * as metautil from 'taro/util/metautil'
import RoutableComponent from 'taro/hoc/RoutableComponent'
import TrackedComponent from 'taro/hoc/TrackedComponent'
import TitledScreen from 'taro/components/TitledScreen'

class RequestScreenView extends Component {

  static propTypes = {
    goto: PropTypes.func,
  }

  render = () => {
    const homeRoute = {
      context: 'home',
    }
    return (
      <TitledScreen
        title="Request"
        backRoute={ homeRoute }
      >
        { this.renderMain() }
      </TitledScreen>
    )
  }

  renderMain = () => {
    return (
      <NB.Content>
      </NB.Content>
    )
  }

}

const RequestScreen = metautil.applyHocs(
  RequestScreenView,
  RoutableComponent,
  TrackedComponent("RequestScreen"),
)

export default RequestScreen

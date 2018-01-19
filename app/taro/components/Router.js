import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect as reduxConnect } from 'react-redux'
import { View } from 'react-native'

import ActiveTimeslotSelector from 'taro/components/ActiveTimeslotSelector'
import VideoReplayer from 'taro/components/VideoReplayer'

import { applyHocs } from 'taro/util/metautil'

class RouterView extends Component {

  static propTypes = {
    route: PropTypes.object,
  }

  render = () => {
    const {
      route,
    } = this.props
    if(route.context == 'home') {
      return <ActiveTimeslotSelector />
    } else {
      return <VideoReplayer />
    }
  }

}

const Router = applyHocs(
  RouterView,
  reduxConnect(
    (state, props) => ({
      route: state.Router,
    }),
    (dispatch, props) => ({
    }),
  ),
)

export default Router

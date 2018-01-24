import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect as reduxConnect } from 'react-redux'
import { View } from 'react-native'

import ActiveTimeslotSelector from 'taro/components/ActiveTimeslotSelector'
import IntroScreen from 'taro/components/IntroScreen'
import FaqScreen from 'taro/components/FaqScreen'
import HamburgerScreen from 'taro/components/HamburgerScreen'
import ReplayLatestScreen from 'taro/components/ReplayLatestScreen'

import { applyHocs } from 'taro/util/metautil'

class RouterView extends Component {

  static propTypes = {
    route: PropTypes.object,
  }

  render = () => {
    const {
      route,
    } = this.props
    if(route.context == 'replay') {
      return <ReplayLatestScreen
        route={ route }
      />
    } else if(route.context == 'intro') {
      return <IntroScreen
        route={ route }
      />
    } else if(route.context == 'faq') {
      return <FaqScreen
        route={ route }
      />
    } else if(route.context == 'hamburger') {
      return <HamburgerScreen
        route={ route }
      />
    } else {
      return <ActiveTimeslotSelector
        route={ route }
      />
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

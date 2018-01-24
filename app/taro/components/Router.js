import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect as reduxConnect } from 'react-redux'
import { View } from 'react-native'

import ActiveTimeslotSelector from 'taro/components/ActiveTimeslotSelector'
import IntroScreen from 'taro/components/IntroScreen'
import FaqScreen from 'taro/components/FaqScreen'
import HamburgerScreen from 'taro/components/HamburgerScreen'
import ReplayLatestScreen from 'taro/components/ReplayLatestScreen'
import ArchivesScreen from 'taro/components/ArchivesScreen'
import TimeslotScreen from 'taro/components/TimeslotScreen'

import { applyHocs } from 'taro/util/metautil'

const ROUTE_MAP = {
  replay: ReplayLatestScreen,
  intro: IntroScreen,
  faq: FaqScreen,
  hamburger: HamburgerScreen,
  archives: ArchivesScreen,
  timeslot: TimeslotScreen,
}

class RouterView extends Component {

  static propTypes = {
    route: PropTypes.object,
  }

  render = () => {
    const {
      route,
    } = this.props
    const cls = ROUTE_MAP[route.context]
    if(cls != null) {
      return React.createElement(cls, {
        route: route,
      })
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

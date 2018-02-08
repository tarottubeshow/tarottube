import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect as reduxConnect } from 'react-redux'
import { View } from 'react-native'

import ActiveTimeslotSelector from 'taro/components/screen/ActiveTimeslotSelector'
import IntroScreen from 'taro/components/screen/IntroScreen'
import FaqScreen from 'taro/components/screen/FaqScreen'
import FaqListScreen from 'taro/components/screen/FaqListScreen'
import HamburgerScreen from 'taro/components/screen/HamburgerScreen'
import ReplayLatestScreen from 'taro/components/screen/ReplayLatestScreen'
import ArchivesScreen from 'taro/components/screen/ArchivesScreen'
import TimeslotScreen from 'taro/components/screen/TimeslotScreen'
import RequestScreen from 'taro/components/screen/RequestScreen'

import { applyHocs } from 'taro/util/metautil'

const ROUTE_MAP = {
  replay: ReplayLatestScreen,
  intro: IntroScreen,
  faqList: FaqListScreen,
  faq: FaqScreen,
  hamburger: HamburgerScreen,
  archives: ArchivesScreen,
  timeslot: TimeslotScreen,
  request: RequestScreen,
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

import React, { Component } from 'react'
import PropTypes from 'prop-types'

import * as metautil from 'taro/util/metautil'
import ApiInvoker from 'taro/hoc/ApiInvoker'
import Promised from 'taro/components/control/Promised'
import TimeslotScreen from 'taro/components/screen/TimeslotScreen'
import TIMESLOT_API from 'taro/api/TimeslotApi'

class ReplayLatestScreenView extends Component {

  render = () => {
    const {
      timeslot,
    } = this.props
    return (
      <Promised
        promises={ [ timeslot ] }
        render={ this.renderReady }
      />
    )
  }

  renderReady = ([ timeslot ]) => {
    console.log(timeslot)
    return (
      <TimeslotScreen
        timeslot={ timeslot }
      />
    )
  }

}

const ReplayLatestScreen = metautil.applyHocs(
    ReplayLatestScreenView,
    ApiInvoker(
      (props) => ({
        timeslot: {
          api: TIMESLOT_API.getLatest,
          params: {},
          key: 'ReplayLatestScreen.timeslot',
        },
      }),
    )
)

export default ReplayLatestScreen

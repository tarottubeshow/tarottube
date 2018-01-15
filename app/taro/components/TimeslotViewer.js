import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect as reduxConnect } from 'react-redux'

import { Text } from 'react-native'

import { applyHocs } from 'taro/util/metautil'
import WaitingScreen from 'taro/components/WaitingScreen'

const QUALITY = 'high' // TODO: how to choose appropriate quality

class TimeslotViewerView extends Component {

  static propTypes = {
    time: PropTypes.instanceOf(Date),
    timeslot: PropTypes.object,
    timeslotKey: PropTypes.string,
  }

  render = () => {
    const {
      time,
      timeslot,
    } = this.props

    if(timeslot.getStartTime() > time) {
      return (
        <WaitingScreen
          timeslotKey={ timeslot.stream_key }
        />
      )
    } else if(!timeslot.isReady(QUALITY)) {
      return (
        <Text>ALMOST</Text>
      )
    } else {
      return (
        <Text>READY</Text>
      )
    }


  }

}

const TimeslotViewer = applyHocs(
  TimeslotViewerView,
  reduxConnect(
    (state, props) => ({
      time: state.Time,
      timeslot: state.Firebase.timeslots[props.timeslotKey],
    }),
    (dispatch, props) => ({
    }),
  ),
)

export default TimeslotViewer

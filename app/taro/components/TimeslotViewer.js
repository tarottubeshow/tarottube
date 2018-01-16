import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect as reduxConnect } from 'react-redux'

import { Text } from 'react-native'

import { applyHocs } from 'taro/util/metautil'
import AlmostScreen from 'taro/components/AlmostScreen'
import LiveVideoPlayer from 'taro/components/LiveVideoPlayer'
import WaitingScreen from 'taro/components/WaitingScreen'

const QUALITY = 'high' // TODO: how to choose appropriate quality

class TimeslotViewerView extends Component {

  static propTypes = {
    time: PropTypes.instanceOf(Date),
    timeslot: PropTypes.object,
    timeslotKey: PropTypes.string,
  }

  state = {
    complete: false,
  }

  onFinish = () => {
    this.setState({
      complete: true,
    })
  }

  render = () => {
    const {
      time,
      timeslot,
    } = this.props
    const {
      complete,
    } = this.state

    if(timeslot.getStartTime() > time) {
      return (
        <WaitingScreen
          timeslot={ timeslot }
        />
      )
    } else if(!timeslot.isReady(QUALITY)) {
      return (
        <AlmostScreen />
      )
    } else if(!complete) {
      return (
        <LiveVideoPlayer
          timeslot={ timeslot }
          onFinish={ this.onFinish }
        />
      )
    } else {
      return <Text>COMPLETE</Text>
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

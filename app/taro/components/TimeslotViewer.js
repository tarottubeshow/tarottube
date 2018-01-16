import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect as reduxConnect } from 'react-redux'

import { Text } from 'react-native'

import { applyHocs } from 'taro/util/metautil'
import { getPlaylist } from 'taro/reducers/FirebaseReducer'
import AlmostScreen from 'taro/components/AlmostScreen'
import LiveVideoPlayer from 'taro/components/LiveVideoPlayer'
import WaitingScreen from 'taro/components/WaitingScreen'

const QUALITY = 'high' // TODO: how to choose appropriate quality

class TimeslotViewerView extends Component {

  static propTypes = {
    time: PropTypes.instanceOf(Date),
    timeslot: PropTypes.object,
    hlsStream: PropTypes.object,
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
      hlsStream,
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
    } else if(hlsStream == null) {
      return (
        <AlmostScreen />
      )
    } else if(!complete) {
      return (
        <LiveVideoPlayer
          timeslot={ timeslot }
          onFinish={ this.onFinish }
          quality={ QUALITY }
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
    (state, props) => {
      return {
        hlsStream: getPlaylist(state, props.timeslot, 'm3u8', QUALITY),
      }
    },
    (dispatch, props) => ({
    }),
  ),
)

export default TimeslotViewer

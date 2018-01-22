import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect as reduxConnect } from 'react-redux'

import { View, StyleSheet, Text } from 'react-native'

import * as metautil from 'taro/util/metautil'
import { getPlaylist } from 'taro/reducers/FirebaseReducer'
import LiveVideoPlayer from 'taro/components/LiveVideoPlayer'
import StreamEndedScreen from 'taro/components/StreamEndedScreen'
import WaitingScreen from 'taro/components/WaitingScreen'
import * as RouterActions from 'taro/actions/RouterActions'

const QUALITY = 'high' // TODO: how to choose appropriate quality

class TimeslotViewerView extends Component {

  static propTypes = {
    assumeSeen: PropTypes.bool,
    onReplay: PropTypes.func,
    time: PropTypes.instanceOf(Date),
    timeslot: PropTypes.object,
    hlsStream: PropTypes.object,
    rtmpStream: PropTypes.object,
  }

  state = {
    playState: 'new',
  }

  isPlayerComplete = () => {
    const {
      playState,
    } = this.state
    return (playState == 'complete')
  }

  isStreamReady = () => {
    const {
      hlsStream,
    } = this.props
    return (
      hlsStream != null
    )
  }

  isStreamOver = () => {
    const {
      rtmpStream,
    } = this.props
    return (
      rtmpStream != null
      &&
      !rtmpStream.isStreaming()
    )
  }

  onLiveVideoStart = () => {
    this.setState({
      playState: 'playing',
    })
  }

  onLiveVideoFinish = () => {
    this.setState({
      playState: 'complete',
    })
  }

  render = () => {
    return (
      <View style={ styles.stack }>
        { this.renderBase() }
        { this.renderVideo() }
      </View>
    )
  }

  renderBase = () => {
    const {
      assumeSeen,
      time,
      timeslot,
      onReplay
    } = this.props

    const isFuture = timeslot.getStartTime() > time
    const hasStream = this.isStreamReady()
    const isStreamOver = this.isStreamOver()
    const isComplete = this.isPlayerComplete()

    if(isStreamOver || isComplete) {
      const isMissed = (
        !isComplete
        &&
        !assumeSeen
      )
      return (
        <StreamEndedScreen
          missed={ isMissed }
          style={ [styles.stack, styles.lower] }
          onReplay={ onReplay }
        />
      )
    } else {
      return (
        <WaitingScreen
          timeslot={ timeslot }
          isFuture={ isFuture }
          style={ [styles.stack, styles.lower] }
          onReplay={ onReplay }
        />
      )
    }
  }

  renderVideo = () => {
    const {
      timeslot,
    } = this.props
    const {
      playState,
    } = this.state

    if(!this.isStreamReady()) {
      return null
    }

    const isPlayerNew = (playState == 'new')
    const isPlayerComplete = this.isPlayerComplete()
    const playerIdle = (isPlayerNew || isPlayerComplete)
    const isStreamOver = this.isStreamOver()
    if(playerIdle && isStreamOver) {
      return null
    }

    return (
      <LiveVideoPlayer
        timeslot={ timeslot }
        onStart={ this.onLiveVideoStart }
        onFinish={ this.onLiveVideoFinish }
        quality={ QUALITY }
        style={ [styles.stack, styles.upper] }
      />
    )
  }

}

const TimeslotViewer = metautil.applyHocs(
  TimeslotViewerView,
  reduxConnect(
    (state, props) => {
      return {
        hlsStream: getPlaylist(state, props.timeslot, 'm3u8', QUALITY),
        rtmpStream: getPlaylist(state, props.timeslot, 'rtmp', QUALITY),
      }
    },
    (dispatch, props) => ({
      onReplay: () => {
        dispatch(RouterActions.requestRouteChange({
          context: 'replay',
        }))
      }
    }),
  ),
)

const styles = StyleSheet.create({
  stack: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
    height: '100%',
    width: '100%',
  },
  upper: {
    zIndex: 100,
  },
  lower: {
    zIndex: 50,
  }
})

export default TimeslotViewer

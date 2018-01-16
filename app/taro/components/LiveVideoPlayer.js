import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect as reduxConnect } from 'react-redux'

import { Image, StyleSheet, Text, View  } from 'react-native'
import { Video } from 'expo'

import COLORS from 'taro/colors'
import { applyHocs } from 'taro/util/metautil'
import { getPlaylist } from 'taro/reducers/FirebaseReducer'

const END_STREAM_DELTA = 10000

class LiveVideoPlayerView extends Component {

  static propTypes = {
    quality: PropTypes.string,
    onFinish: PropTypes.func,
    timeslot: PropTypes.object,
    rtmpStream: PropTypes.object,
    hlsStream: PropTypes.object,
  }

  initVideoRef = (videoRef) => {
    if(videoRef) {
      const {
        quality,
        timeslot,
      } = this.props
      async function initializeVideo(that) {
        const loadResult = await videoRef.loadAsync(
          { uri: timeslot.getUri(quality) },
          {},
          false,
        )
        console.log("GOT LOAD RESULT")
        console.log(loadResult)
        const playResult = await videoRef.playFromPositionAsync(0)
        console.log("GOT PLAY RESULT")
        console.log(playResult)
      }
      initializeVideo(this)
    }
  }

  onPlaybackStatusUpdate = (event) => {
    const {
      onFinish,
      hlsStream,
      rtmpStream,
    } = this.props
    const position = event.positionMillis
    const duration = hlsStream.getDuration()
    const realTimestamp = hlsStream.getRealTimestamp(position)
    const isStreaming = rtmpStream.isStreaming()
    this.setState({
      position: position,
      duration: duration,
      realTimestamp: realTimestamp,
      isStreaming: isStreaming,
    })
    console.log(`play: ${ isStreaming } ${ position }/${ duration } (${ realTimestamp })`)
    if(!isStreaming && ((duration - position) < END_STREAM_DELTA)) {
      onFinish()
    }
  }

  onError = (event) => {
    console.log("onError")
    console.log(event)
  }

  render = () => {
    const {
      timeslot,
    } = this.props
    return (
      <View style={ styles.parent }>
        <Video
          ref={ this.initVideoRef }
          rate={ 1.0 }
          volume={ 1.0 }
          resizeMode="cover"
          style={ styles.video }
          onPlaybackStatusUpdate={ this.onPlaybackStatusUpdate }
          onReadyForDisplay={ this.onReadyForDisplay }
          onError={ this.onError }
        />
      </View>
    )



  }
}

const styles = StyleSheet.create({
  parent: {
    backgroundColor: COLORS.white,
  },
  video: {
    width: "100%",
    height: "100%",
  },
})

const LiveVideoPlayer = applyHocs(
  LiveVideoPlayerView,
  reduxConnect(
    (state, props) => {
      return {
        rtmpStream: getPlaylist(state, props.timeslot, 'rtmp', 'high'),
        hlsStream: getPlaylist(state, props.timeslot, 'm3u8', 'high'),
      }
    },
    (dispatch, props) => ({
    }),
  ),
)

export default LiveVideoPlayer

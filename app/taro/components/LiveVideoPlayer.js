import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { Image, StyleSheet, Text, View  } from 'react-native'
import { Video } from 'expo'

import COLORS from 'taro/colors'

const QUALITY = 'high'
const END_STREAM_DELTA = 10000

class LiveVideoPlayer extends Component {

  static propTypes = {
    onFinish: PropTypes.func,
    timeslot: PropTypes.object,
  }

  initVideoRef = (videoRef) => {
    if(videoRef) {
      const {
        timeslot,
      } = this.props
      async function initializeVideo(that) {
        const loadResult = await videoRef.loadAsync(
          { uri: timeslot.getUri(QUALITY) },
          {},
          false,
        )
        const playResult = await videoRef.playFromPositionAsync(0)
        that.setState({
          playing: true,
        })
      }
      initializeVideo(this)
    }
  }

  onPlaybackStatusUpdate = (event) => {
    const {
      timeslot,
      onFinish,
    } = this.props
    const position = event.positionMillis
    const duration = event.playableDurationMillis
    const knownDuration = timeslot.getDuration(QUALITY)
    const knownDurationMillis = Math.floor(knownDuration * 1000)
    const isStreaming = timeslot.isStreaming(QUALITY)
    this.setState({
      position: position,
      duration: knownDurationMillis,
    })
    if(!isStreaming && ((knownDurationMillis - position) < END_STREAM_DELTA)) {
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

export default LiveVideoPlayer

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import interpolate from 'color-interpolate'
import { connect as reduxConnect } from 'react-redux'

import {
  Animated,
  StyleSheet,
  View,
} from 'react-native'
import { Video } from 'expo'

import COLORS from 'taro/colors'
import GradientBackground from 'taro/components/GradientBackground'
import * as FirebaseReducer from 'taro/reducers/FirebaseReducer'
import * as metautil from 'taro/util/metautil'
import * as scheduleutil from 'taro/util/scheduleutil'
import * as proputil from 'taro/util/proputil'

const END_STREAM_DELTA = 10000

const TOP_COLORMAP = interpolate([
  COLORS.greenLight,
  COLORS.yellowLight,
  COLORS.peachLight,
])
const BOTTOM_COLORMAP = interpolate([
  COLORS.green,
  COLORS.yellow,
  COLORS.peach,
])

const DELTA_HEALTH_OK = 20000 // 20 seconds
const DELTA_HEALTH_BAD = 120000 // 2 minutes

class HealthStatusIndicator extends Component {

  state = {
    now: new Date(),
  }

  componentDidMount = () => {
    this._ticker = new scheduleutil.Ticker(1000, this.tick)
  }

  componentWillUnmount = () => {
    this._ticker.stop()
  }

  tick = () => {
    this.setState({ now: new Date() })
  }

  render = () => {
    const {
      realTimestamp,
    } = this.props
    const {
      now,
    } = this.state

    let delta
    if(realTimestamp == null) {
      delta = DELTA_HEALTH_BAD
    } else {
      delta = now - realTimestamp
    }

    let health = (delta - DELTA_HEALTH_OK) / (DELTA_HEALTH_BAD - DELTA_HEALTH_OK)
    health = Math.max(health, 0)
    health = Math.min(health, 1)

    const topColor = TOP_COLORMAP(health)
    const bottomColor = BOTTOM_COLORMAP(health)

    return (
      <GradientBackground
        style={ styles.healthInidicator }
        stops={ [topColor, bottomColor] }
      />
    )
  }
}

class LiveVideoPlayerView extends Component {

  static propTypes = {
    quality: PropTypes.string,
    onStart: PropTypes.func,
    onFinish: PropTypes.func,
    timeslot: PropTypes.object,
    rtmpStream: PropTypes.object,
    hlsStream: PropTypes.object,
    style: proputil.STYLE_TYPE,
  }

  state = {
    fade: new Animated.Value(0),
    realTimestamp: null,
  }

  componentDidMount() {
    const {
      onStart,
    } = this.props

    Animated.timing(
      this.state.fade,
      {
        toValue: 1,
        duration: 5000,
      },
    ).start()

    onStart()
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
      style,
      quality,
      timeslot,
    } = this.props
    const {
      fade,
      realTimestamp,
    } = this.state
    return (
      <View style={ style }>
        <Animated.View style={{
          opacity: fade,
        }}>
          <Video
            source={ { uri: timeslot.getUri(quality) } }
            shouldPlay={ true }
            rate={ 1.0 }
            volume={ 1.0 }
            resizeMode="cover"
            style={ styles.video }
            onPlaybackStatusUpdate={ this.onPlaybackStatusUpdate }
            onReadyForDisplay={ this.onReadyForDisplay }
            onError={ this.onError }
          />
          <HealthStatusIndicator
            realTimestamp={ realTimestamp }
          />
        </Animated.View>
      </View>
    )



  }
}

const styles = StyleSheet.create({
  video: {
    width: "100%",
    height: "100%",
  },
  healthInidicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 5,
  }
})

const LiveVideoPlayer = metautil.applyHocs(
  LiveVideoPlayerView,
  reduxConnect(
    (state, props) => ({
      rtmpStream: FirebaseReducer.getPlaylist(
        state,
        props.timeslot,
        'rtmp',
        'high',
      ), // use high, because we care about the original timestamps
      hlsStream: FirebaseReducer.getPlaylist(
        state,
        props.timeslot,
        'm3u8',
        'high',
      ), // use high, because we want to know if it is really streaming
    }),
    (dispatch, props) => ({
    }),
  ),
)

export default LiveVideoPlayer

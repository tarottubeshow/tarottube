import React, { Component } from 'react'
import PropTypes from 'prop-types'
import interpolate from 'color-interpolate'
import { connect as reduxConnect } from 'react-redux'

import {
  Animated,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import { Video } from 'expo'

import COLORS from 'taro/colors'
import GradientBackground from 'taro/components/gradient/GradientBackground'
import * as FirebaseReducer from 'taro/reducers/FirebaseReducer'
import * as metautil from 'taro/util/metautil'
import * as scheduleutil from 'taro/util/scheduleutil'
import * as proputil from 'taro/util/proputil'
import * as randomutil from 'taro/util/randomutil'
import TrackedComponent from 'taro/hoc/TrackedComponent'
import VIEW_COUNTER from 'taro/controllers/ViewCounter'
import FirebaseWatcher from 'taro/hoc/FirebaseWatcher'

const END_STREAM_DELTA = 10000 // 10 seconds

const DELTA_HEALTH_OK = 20000 // 20 seconds
const DELTA_HEALTH_BAD = 120000 // 2 minutes

const COMPUTE_HEALTH_POLL_FREQ = 1000 // 1 second
const HEALTH_TRACK_POLL_FREQ = 60000 // 1 minute

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

class HealthStatusIndicator extends Component {

  static propTypes = {
    realTimestamp: PropTypes.any,
    onHealthUpdate: PropTypes.func,
  }

  state = {
    delta: 0,
    health: 1,
  }

  componentDidMount = () => {
    this._ticker = new scheduleutil.Ticker(
      COMPUTE_HEALTH_POLL_FREQ,
      this.onTick,
    )
  }

  componentWillUnmount = () => {
    this._ticker.stop()
  }

  onTick = () => {
    const {
      realTimestamp,
      onHealthUpdate,
    } = this.props
    const now = new Date()

    let delta
    if(realTimestamp == null) {
      delta = DELTA_HEALTH_BAD
    } else {
      delta = now - realTimestamp
    }

    let health = (delta - DELTA_HEALTH_OK) / (DELTA_HEALTH_BAD - DELTA_HEALTH_OK)
    health = Math.max(health, 0)
    health = Math.min(health, 1)

    const healthState = {
      delta,
      health,
    }
    this.setState(healthState)
    onHealthUpdate(healthState)
  }

  render = () => {
    const {
      health,
    } = this.state

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
    started: false,
    health: null,
  }

  componentDidMount = () => {
    const {
      timeslot,
    } = this.props
    this._ticker = new scheduleutil.Ticker(
      HEALTH_TRACK_POLL_FREQ,
      this.onHealthPostTick,
      false,
    )
    VIEW_COUNTER.onView(timeslot.stream_key, true)
  }

  componentWillUnmount = () => {
    this._ticker.stop()
  }

  onError = (event) => {
    console.log("onError")
    console.log(event)
  }

  onHealthUpdate = (health) => {
    this.setState({
      health: health,
    })
  }

  onHealthPostTick = () => {
    const {
      track,
    } = this.props
    const {
      health,
    } = this.state
    if(health != null) {
      track('LiveVideoPlayer Health', health)
    }
  }

  onPlaybackStatusUpdate = (event) => {
    const {
      onFinish,
      hlsStream,
      rtmpStream,
    } = this.props
    const {
      started,
    } = this.state

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
    if(!started && position > 0) {
      this.onStart()
    }
    if(!isStreaming && ((duration - position) < END_STREAM_DELTA)) {
      this.onFinish()
    }
  }

  onFinish = () => {
    const {
      onFinish,
    } = this.props
    onFinish()
  }

  onStart = () => {
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
    this.setState({
      started: true,
    })
    onStart()
  }

  render = () => {
    const {
      style,
      quality,
      timeslot,
      track,
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
            onHealthUpdate={ this.onHealthUpdate }
          />
          { this.renderCount() }
        </Animated.View>
      </View>
    )
  }

  renderCount = () => {
    const {
      viewing,
    } = this.props
    if(viewing != null && viewing > 0) {
      return (
        <Text style={ styles.viewingCount }>
          { viewing }
        </Text>
      )
    }
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
  },
  viewingCount: {
    position: 'absolute',
    top: 30,
    left: 10,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 3,
    paddingBottom: 3,
    color: '#fff',
    backgroundColor: COLORS.purple,
    borderRadius: 10,
    overflow: 'hidden',
  },
})

const LiveVideoPlayer = metautil.applyHocs(
  LiveVideoPlayerView,
  TrackedComponent("LiveVideoPlayer"),
  FirebaseWatcher((props) => ({
    viewing: {
      firebaseKey: `viewCounts/${ props.timeslot.stream_key }/viewing_count`,
      refKey: 'LiveVideoPlayer.viewing',
    },
  })),
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

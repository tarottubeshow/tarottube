import React, { Component } from 'react'
import PropTypes from 'prop-types'
import interpolate from 'color-interpolate'
import { connect as reduxConnect } from 'react-redux'

import {
  Animated,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native'
import { Svg, Video } from 'expo'

import * as Images from 'taro/Images'
import * as metautil from 'taro/util/metautil'
import * as proputil from 'taro/util/proputil'
import COLORS from 'taro/colors'
import TRACKER from 'taro/tracking'
import Button from 'taro/components/Button'
import LoadingBlock from 'taro/components/LoadingBlock'
import RoutableComponent from 'taro/hoc/RoutableComponent'

const PLAYABLE_COLORMAP = interpolate([
  COLORS.blueLight,
  COLORS.blue,
])
const POSITION_COLORMAP = interpolate([
  COLORS.greenLight,
  COLORS.green,
])

class ProgressIndicatorBar extends Component {

  static propTypes = {
    color: PropTypes.string,
    percentage: PropTypes.number,
  }

  render = () => {
    const {
      color,
      percentage,
    } = this.props
    return (
      <View
        style={ {
          width: `${ 100 * percentage }%`,
          position: 'absolute',
          left: 0,
          bottom: 0,
          top: 0,
          backgroundColor: color,
        } }
      />
    )
  }

}

class ProgressIndicator extends Component {

  static propTypes = {
    position: PropTypes.number,
    duration: PropTypes.number,
    playable: PropTypes.number,
  }

  render = () => {
    const {
      position,
      duration,
      playable,
    } = this.props
    const positionPercent = (position / duration)
    const playablePercent = (playable / duration)
    return (
      <View style={ styles.progressIndicator }>
        <ProgressIndicatorBar
          percentage={ 100 }
          color={ COLORS.yellow }
        />
        <ProgressIndicatorBar
          percentage={ playablePercent }
          color={ PLAYABLE_COLORMAP(playablePercent) }
        />
        <ProgressIndicatorBar
          percentage={ positionPercent }
          color={ POSITION_COLORMAP(positionPercent) }
        />
      </View>
    )
  }

}

class VideoPlayerView extends Component {

  static propTypes = {
    context: PropTypes.string,
    uri: PropTypes.string,

    autoBack: PropTypes.bool,
    backRoute: PropTypes.object,
    hideClose: PropTypes.bool,

    onBack: PropTypes.func,
    onEnd: PropTypes.func,

    style: proputil.STYLE_TYPE,

    goto: PropTypes.func,
  }

  state = {
    fade: new Animated.Value(0),
    started: false,
    ended: false,
    position: 0,
    duration: 1,
    playable: 0,
  }

  componentDidMount = () => {
    this.track('Mounted VideoPlayerView')
  }

  track = (name, params) => {
    const {
      uri,
      context,
    } = this.props
    TRACKER.track(name, {
      uri: uri,
      context: context,
      ...params,
    })
  }

  goBack = () => {
    const {
      backRoute,
      goto,
      onBack,
    } = this.props
    if(onBack != null) {
      onBack()
    }
    if(backRoute != null) {
      goto(backRoute)
    }
  }

  onPlaybackStatusUpdate = (event) => {
    const {
      ended,
      started,
    } = this.state
    const position = event.positionMillis
    const duration = event.durationMillis || 1
    let playable = Math.max(
      position,
      event.playableDurationMillis || 0,
    )
    if(position == 0) {
      playable = 0 // for some reason it jumps around at 0
    }

    const newStarted = (position > 0)
    const newEnded = (position != 0 && position >= duration)

    this.setState({
      position,
      duration,
      playable,
      started: newStarted,
      ended: newEnded,
    })
    if(!started && newStarted) {
      this.onStart()
    }
    if(!ended && newEnded) {
      this.onEnd()
    }
  }

  onEnd = () => {
    const {
      onEnd,
      autoBack,
    } = this.props

    this.track('VideoPlayerView Ended')

    if(onEnd != null) {
      onEnd()
    }

    if(autoBack) {
      this.goBack()
    }
  }

  onStart = () => {
    Animated.timing(
      this.state.fade,
      {
        toValue: 1,
        duration: 1000,
      },
    ).start()
  }

  onRestart = () => {
    this.track('Restarted VideoPlayerView')
    this._videoRef.setPositionAsync(0)
  }

  render = () => {
    const {
      style,
    } = this.props
    const {
      fade,
    } = this.state
    return (
      <View style={ style }>
        { this.renderLoading() }
        <Animated.View style={{
          opacity: fade,
          zIndex: 100,
        }}>
          { this.renderPlayer() }
          { this.renderProgressIndicator() }
        </Animated.View>
        { this.renderStopButton() }
        { this.renderEndActions() }
      </View>
    )

  }

  renderEndActions = () => {
    const {
      ended,
    } = this.state
    if(ended) {
      return (
        <View style={ styles.endActions }>
          <Button
            color="yellow"
            text="Done"
            onPress={ this.goBack }
            style={ styles.endActionButton }
          />
          <Button
            color="yellow"
            text="Replay"
            onPress={ this.onRestart }
            style={ styles.endActionButton }
          />
        </View>
      )
    }
  }

  renderLoading = () => {
    const {
      ended,
    } = this.state
    if(!ended) {
      return (
        <View style={ styles.loading }>
          <LoadingBlock />
        </View>
      )
    }
  }

  renderPlayer = () => {
    const {
      uri,
    } = this.props
    const {
      ended,
    } = this.state
    const videoStyle = [ styles.video ]
    if(ended) {
      videoStyle.push(styles.videoEnded)
    }
    return (
      <Video
        ref={ (videoRef) => { this._videoRef = videoRef } }
        source={ { uri: uri } }
        shouldPlay={ true }
        rate={ 1.0 }
        volume={ 1.0 }
        resizeMode="cover"
        style={ videoStyle }
        onPlaybackStatusUpdate={ this.onPlaybackStatusUpdate }
        onReadyForDisplay={ this.onReadyForDisplay }
        onError={ this.onError }
        progressUpdateIntervalMillis={ 25 }
      />
    )
  }

  renderProgressIndicator = () => {
    const {
      position,
      duration,
      playable,
    } = this.state
    return (
      <ProgressIndicator
        position={ position }
        duration={ duration }
        playable={ playable }
      />
    )
  }

  renderStopButton = () => {
    const {
      hideClose,
    } = this.props
    const {
      ended,
    } = this.state

    if(ended) {
      return
    }

    if(hideClose) {
      return
    }

    return (
      <TouchableOpacity
        style={ styles.close }
        onPress={ this.goBack }
      >
        <Image
          style={ styles.close }
          source={ Images.CLOSE_BUTTON }
        />
      </TouchableOpacity>
    )
  }

}

const styles = StyleSheet.create({
  video: {
    width: "100%",
    height: "100%",
    zIndex: 100,
  },
  videoEnded: {
    opacity: 0.5,
  },
  progressIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 5,
    zIndex: 200,
  },
  close: {
    position: 'absolute',
    top: 20,
    left: 5,
    width: 32,
    height: 32,
    zIndex: 500,
    opacity: 0.5,
  },
  endActions: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 300,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  endActionButton: {
    width: 300,
    margin: 2,
  },
  loading: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 50,
  },
})

const VideoPlayer = metautil.applyHocs(
  VideoPlayerView,
  RoutableComponent,
)

export default VideoPlayer

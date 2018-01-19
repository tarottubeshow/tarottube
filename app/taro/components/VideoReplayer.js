import React, { Component } from 'react'
import PropTypes from 'prop-types'
import interpolate from 'color-interpolate'
import { connect as reduxConnect } from 'react-redux'

import {
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native'
import { Svg, Video } from 'expo'

import * as Images from 'taro/Images'
import * as RouterActions from 'taro/actions/RouterActions'
import * as metautil from 'taro/util/metautil'
import * as proputil from 'taro/util/proputil'
import COLORS from 'taro/colors'
import TRACKER from 'taro/tracking'
import Button from 'taro/components/Button'
import GradientBackground from 'taro/components/GradientBackground'

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

class VideoReplayerView extends Component {

  static propTypes = {
    onStop: PropTypes.func,
    style: proputil.STYLE_TYPE,
  }

  state = {
    position: 0,
    duration: 1,
    playable: 0,
  }

  componentDidMount = () => {
    TRACKER.track('Mounted VideoReplayerView')
  }

  isEnded = () => {
    const {
      position,
      duration,
    } = this.state
    return position != 0 && position >= duration
  }

  onPlaybackStatusUpdate = (event) => {
    const position = event.positionMillis
    const duration = event.durationMillis || 1
    let playable = Math.max(
      position,
      event.playableDurationMillis || 0,
    )
    if(position == 0) {
      playable = 0 // for some reason it jumps around at 0
    }
    this.setState({
      position,
      duration,
      playable,
    })
  }

  onRestart = () => {
    this._videoRef.setPositionAsync(0)
    componentDidMount = () => {
      TRACKER.track('Restarted Video')
    }
  }

  render = () => {
    const {
      style,
    } = this.props
    return (
      <GradientBackground
        stops={ [COLORS.purpleLight, COLORS.purple] }
      >
        <View style={ style }>
          { this.renderPlayer() }
          { this.renderStopButton() }
          { this.renderProgressIndicator() }
          { this.renderEndActions() }
        </View>
      </GradientBackground>
    )

  }

  renderEndActions = () => {
    if(this.isEnded()) {
      const {
        onStop,
      } = this.props
      return (
        <View style={ styles.endActions }>
          <Button
            color="yellow"
            text="Done"
            onPress={ onStop }
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

  renderPlayer = () => {
    const videoStyle = [ styles.video ]
    if(this.isEnded()) {
      videoStyle.push(styles.videoEnded)
    }
    const url = `${ global.CONFIG['URL']['API'] }/video/latest.mp4`
    return (
      <Video
        ref={ (videoRef) => { this._videoRef = videoRef } }
        source={ { uri: url } }
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
    if(!this.isEnded()) {
      const {
        onStop,
      } = this.props
      return (
        <TouchableOpacity
          style={ styles.close }
          onPress={ onStop }
        >
          <Image
            style={ styles.close }
            source={ Images.CLOSE_BUTTON }
          />
        </TouchableOpacity>
      )
    }
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
    top: 12,
    left: 5,
    width: 32,
    height: 32,
    zIndex: 500,
    opacity: 0.7,
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
})

const VideoReplayer = metautil.applyHocs(
  VideoReplayerView,
  reduxConnect(
    (state, props) => ({
    }),
    (dispatch, props) => ({
      onStop: () => {
        dispatch(RouterActions.requestRouteChange({
          context: 'home',
        }))
      }
    }),
  ),
)

export default VideoReplayer

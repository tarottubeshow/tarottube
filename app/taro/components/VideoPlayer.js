import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect as reduxConnect } from 'react-redux'

import {
  Animated,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { Svg, Video } from 'expo'
import * as ixh from 'react-native-iphone-x-helper'

import * as Images from 'taro/Images'
import * as metautil from 'taro/util/metautil'
import * as proputil from 'taro/util/proputil'
import * as deviceutil from 'taro/util/deviceutil'
import COLORS from 'taro/colors'
import Button from 'taro/components/form/Button'
import LoadingBlock from 'taro/components/control/LoadingBlock'
import RoutableComponent from 'taro/hoc/RoutableComponent'
import TitledScreen from 'taro/components/TitledScreen'
import TrackedComponent from 'taro/hoc/TrackedComponent'

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
          color={ COLORS.blue }
        />
        <ProgressIndicatorBar
          percentage={ positionPercent }
          color={ COLORS.green }
        />
      </View>
    )
  }

}

class VideoPlayerView extends Component {

  static propTypes = {
    context: PropTypes.string,
    uri: PropTypes.string,
    views: PropTypes.number,

    autoBack: PropTypes.bool,
    hideClose: PropTypes.bool,

    onBack: PropTypes.func,
    onEnd: PropTypes.func,

    goBack: PropTypes.func,
  }

  state = {
    fade: new Animated.Value(0),
    started: false,
    ended: false,
    position: 0,
    duration: 1,
    playable: 0,
  }

  goBack = (reason) => {
    const {
      onBack,
      goBack,
      track,
    } = this.props
    track('VideoPlayer exit', {
      reason: reason,
    })
    if(onBack != null) {
      onBack({
        reason: reason,
      })
    }
    goBack()
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

    if(!ended) {
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
  }

  onEnd = () => {
    const {
      onEnd,
      autoBack,
      track,
    } = this.props

    track('VideoPlayerView Ended')

    if(onEnd != null) {
      onEnd()
    }

    if(autoBack) {
      this.goBack('auto')
    }
  }

  onStart = () => {
    if(deviceutil.isIos()) {
      Animated.timing(
        this.state.fade,
        {
          toValue: 1,
          duration: 1000,
        },
      ).start()
    }
  }

  onRestart = () => {
    const {
      track,
    } = this.props
    track('Restarted VideoPlayerView')
    this._videoRef.setPositionAsync(0)
    this.setState({
      ended: false,
    })
  }

  render = () => {
    if(deviceutil.isIos()) {
      return this.renderIos()
    } else {
      return this.renderAndroid()
    }
  }

  renderAndroid = () => {
    const {
      hideClose,
    } = this.props
    if(hideClose) {
      return this.renderAndroidBody()
    } else {
      return (
        <TitledScreen
          onBack={ this.goBack }
          title=""
          leftIcon="ios-close"
        >
          { this.renderAndroidBody() }
        </TitledScreen>
      )
    }
  }

  renderAndroidBody = () => {
    const {
      started,
      ended,
    } = this.state
    const loadingComponent = (!started) ? this.renderLoading() : null
    const endActionsComponent = (ended) ? this.renderEndActions() : null
    return (
      <View style={ styles.videoContainer }>
        <View style={{
          display: (started && !ended) ? 'flex' : 'none',
          flex: 1,
        }}>
          { this.renderUnanimatedPlayer() }
        </View>
        { loadingComponent }
        { endActionsComponent }
      </View>
    )
  }

  renderIos = () => {
    return (
      <View style={ styles.videoContainer }>
        { this.renderLoading() }
        { this.renderAnimatedPlayer() }
        { this.renderStopButton() }
        { this.renderCount() }
        { this.renderEndActions() }
      </View>
    )
  }

  renderAnimatedPlayer = () => {
    const {
      fade,
    } = this.state
    return (
      <Animated.View
        style={[
          styles.videoContainer,
          {
            opacity: fade,
            zIndex: 100,
          }
        ]}
        key="ANIMATED"
      >
        { this.renderPlayer() }
        { this.renderProgressIndicator() }
      </Animated.View>
    )
  }

  renderUnanimatedPlayer = () => {
    const {
      style,
    } = this.props
    const {
      started,
      ended,
    } = this.state
    return (
      <View style={ styles.video }>
        { this.renderPlayer() }
        { this.renderProgressIndicator() }
      </View>
    )

  }

  renderCount = () => {
    const {
      views,
    } = this.props
    if(views != null && views > 0) {
      return (
        <Text style={ styles.viewCount }>
          { views }
        </Text>
      )
    }
  }

  renderEndActions = () => {
    const {
      ended,
    } = this.state
    if(ended) {
      return (
        <View
          style={ styles.endActions }
          key='ENDACTIONS'
        >
          <Button
            color="yellow"
            text="Done"
            onPress={ () => this.goBack('done') }
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
        onError={ this.onError }
        key='VIDEO'
        userNativeControls
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
        key='PROGRESS'
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
        onPress={ () => this.goBack('stop') }
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
  videoContainer: {
    flex: 1,
    ...deviceutil.ifIos({
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      top: 0,
      zIndex: 100,
    }),
  },
  video: {
    flex: 1,
  },
  videoEnded: {
    ...deviceutil.ifIos({
      opacity: 0.5,
    }),
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
    top: 5,
    left: 5,
    width: 32,
    height: 32,
    zIndex: 500,
    opacity: 0.5,
    ...ixh.ifIphoneX({
      top: 5,
      left: 10,
    }),
  },
  endActions: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    ...deviceutil.ifIos({
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 300,
    }),
  },
  endActionButton: {
    width: 300,
    margin: 2,
  },
  loading: {
    ...deviceutil.ifAndroid({
      flex: 1,
    }),
    ...deviceutil.ifIos({
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 50,
    }),
  },
  viewCount: {
    zIndex: 200,
    position: 'absolute',
    top: 12,
    right: 20,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 3,
    paddingBottom: 3,
    color: '#fff',
    backgroundColor: COLORS.blueLight,
    borderRadius: 10,
    overflow: 'hidden',
  },
})

const VideoPlayer = metautil.applyHocs(
  VideoPlayerView,
  RoutableComponent,
  TrackedComponent("VideoPlayer", {
    propMaker: (props) => ({
      uri: props.uri,
      context: props.context,
    }),
  }),
)

export default VideoPlayer

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Provider as ReduxProvider } from 'react-redux'
import { connect as reduxConnect } from 'react-redux'
import { AppState, View, WebView, StyleSheet } from 'react-native'

import Router from 'taro/components/Router'
import Promised from 'taro/components/Promised'
import { buildStore } from 'taro/store/Store'
import { applyHocs } from 'taro/util/metautil'
import {
  hasValueAsPromiseState,
  readyBoolAsPromiseState,
} from 'taro/util/promiseutil'
import { Audio } from 'expo'

import { appStart } from 'taro/actions/AppLifecycle'

const buildMain = ({
  reducers,
  middlewares,
}) => {

  const store = buildStore(reducers, middlewares)

  // AppContainer essentially just makes sure all the necessary components of
  // application state are in place before moving forward

  class AppContainerView extends Component {

    static propTypes = {
      isActive: PropTypes.bool,
      deviceReady: PropTypes.bool,
      routerReady: PropTypes.bool,
      timeslots: PropTypes.object,
    }

    state = {
      analyticsLoaded: false,
    }

    initAnalytics = (webView) => {
      this._analytics = webView
      this.onAnalyticsEvent()
    }

    onAnalyticsEvent = () => {
      console.log("posting message")
      this._analytics.postMessage('fuck you')
    }

    onAnalyticsLoaded = () => {
      console.log('analytics loaded')
      this.setState({
        analyticsLoaded: true,
      })
      this.onAnalyticsEvent()
    }

    onAnalyticsMessage = (event) => {
      console.log("got analytics message")
      console.log(event.nativeEvent.data)
    }

    render = () => {
      const {
        deviceReady,
        routerReady,
        timeslots,
      } = this.props
      const {
        analyticsLoaded,
      } = this.state
      return (
        <View style={ styles.main }>
          { this.renderAnalyticsBridge() }
          <Promised
            promises={ [
              readyBoolAsPromiseState(analyticsLoaded),
              readyBoolAsPromiseState(deviceReady),
              readyBoolAsPromiseState(routerReady),
              hasValueAsPromiseState(timeslots),
            ] }
            render={ this.renderReady }
          />
        </View>
      )
    }

    renderAnalyticsBridge = () => {
      const url = `${ global.CONFIG.URL.API }/embed/analytics.html`
      return (
        <WebView
          ref={ this.initAnalytics }
          source={{ uri: url }}
          style={ styles.analytics }
          onLoad={ this.onAnalyticsLoaded }
          onMessage={ this.onAnalyticsMessage }
        />
      )
    }

    renderReady = () => {
      const {
        isActive,
      } = this.props
      return (
        <Router
          isActive={ isActive }
        />
      )
    }

  }

  const AppContainer = applyHocs(
    AppContainerView,
    reduxConnect(
      (state, props) => ({
        routerReady: state.Router.ready,
        deviceReady: state.Device.ready,
        timeslots: state.Firebase.timeslots,
      }),
      (dispatch, props) => ({
      }),
    ),
  )

  class AppStateManagerView extends Component {

    static propTypes = {
      onStart: PropTypes.func.isRequired,
    }

    state = {
      appState: AppState.currentState
    }

    componentDidMount = () => {
      this.props.onStart()
      this.enableAudio()
      AppState.addEventListener('change', this._handleAppStateChange)
    }

    componentWillUnmount() {
      AppState.removeEventListener('change', this._handleAppStateChange)
    }

    _handleAppStateChange = (nextAppState) => {
      const {
        appState,
      } = this.state
      if (appState.match(/inactive|background/) && nextAppState === 'active') {
        this.enableAudio()
      }
      this.setState({ appState: nextAppState })
    }

    enableAudio = () => {
      Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        playsInSilentLockedModeIOS: true,
        allowsRecordingIOS: false,
        interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
        shouldDuckAndroid: false,
        interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
      }).then(() => {
        return Audio.setIsEnabledAsync(true)
      })
    }

    render = () => {
      const {
        isActive,
      } = this.state
      return (
        <AppContainer
          isActive={ isActive }
        />
      )
    }
  }

  const AppStateManager = applyHocs(
    AppStateManagerView,
    reduxConnect(
      (state, props) => ({
      }),
      (dispatch, props) => ({
        onStart: () => {
          dispatch(appStart())
        }
      }),
    ),
  )

  // Main contains all of the necessarry context providers
  // for the application

  class Main extends Component {

    render = () => {
      return (
        <ReduxProvider store={ store }>
          <AppStateManager />
        </ReduxProvider>
      )
    }

  }

  return Main
}

const styles = StyleSheet.create({
  main: {
    width: "100%",
    height: "100%",
  },
  analytics: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 100,
    height: 100,
  },
})

export default buildMain

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Provider as ReduxProvider } from 'react-redux'
import { connect as reduxConnect } from 'react-redux'
import { AppState } from 'react-native'

import Router from 'taro/components/Router'
import Promised from 'taro/components/control/Promised'
import { buildStore } from 'taro/store/Store'
import { applyHocs } from 'taro/util/metautil'
import {
  hasValueAsPromiseState,
  readyBoolAsPromiseState,
} from 'taro/util/promiseutil'

import * as AppLifecycle from 'taro/actions/AppLifecycle'
import * as AudioController from 'taro/controllers/AudioController'
import * as FontManager from 'taro/controllers/FontManager'

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

    render = () => {
      const {
        deviceReady,
        routerReady,
        timeslots,
      } = this.props
      return (
        <Promised
          promises={ [
            readyBoolAsPromiseState(deviceReady),
            readyBoolAsPromiseState(routerReady),
            hasValueAsPromiseState(timeslots),
          ] }
          render={ this.renderReady }
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
      onStart: PropTypes.func,
    }

    state = {
      appState: AppState.currentState
    }

    componentDidMount = () => {
      this.onStart()
      AppState.addEventListener('change', this._handleAppStateChange)
    }

    componentWillUnmount() {
      AppState.removeEventListener('change', this._handleAppStateChange)
    }

    onStart = () => {
      const {
        onStart,
      } = this.props
      onStart()
      AudioController.enable()
      FontManager.init()
    }

    onResume = () => {
      const {
        onResume,
      } = this.props
      onResume()
      AudioController.enable()
    }

    _handleAppStateChange = (nextAppState) => {
      const {
        appState,
      } = this.state
      if (appState.match(/inactive|background/) && nextAppState === 'active') {
        this.onResume()
      }
      this.setState({ appState: nextAppState })
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
          dispatch(AppLifecycle.appStart())
        },
        onResume: () => {
          dispatch(AppLifecycle.appResume())
        },
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

export default buildMain

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Provider as ReduxProvider } from 'react-redux'
import { connect as reduxConnect } from 'react-redux'
import { View } from 'react-native'

import Router from 'taro/components/Router'
import Promised from 'taro/components/Promised'
import { buildStore } from 'taro/store/Store'
import { applyHocs } from 'taro/util/metautil'
import {
  hasValueAsPromiseState,
  readyBoolAsPromiseState,
} from 'taro/util/promiseutil'

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
      return <Router />
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

  // AppStarter simply fires the start event

  class AppStarterView extends Component {

    static propTypes = {
      onStart: PropTypes.func.isRequired,
    }

    componentDidMount = () => {
      this.props.onStart()
    }

    render = () => {
      return (
        <AppContainer />
      )
    }
  }

  const AppStarter = applyHocs(
    AppStarterView,
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
          <AppStarter />
        </ReduxProvider>
      )
    }

  }

  return Main
}

export default buildMain

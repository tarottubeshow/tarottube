import React, { Component } from 'react'
import { connect as reduxConnect } from 'react-redux'

import * as metautil from 'taro/util/metautil'
import * as RouterActions from 'taro/actions/RouterActions'

const RoutableComponent = (cls) => {

  return metautil.applyHocs(
    cls,
    reduxConnect(
      (state, props) => ({
      }),
      (dispatch, props) => ({
        goBack: () => {
          dispatch(RouterActions.requestBack())
        },
        goto: (route) => {
          dispatch(RouterActions.requestRouteChange(route))
        }
      }),
    ),
  )

}

export default RoutableComponent

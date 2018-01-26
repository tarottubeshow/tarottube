import React, { Component } from 'react'
import { connect as reduxConnect } from 'react-redux'

import * as metautil from 'taro/util/metautil'
import * as FirebaseActions from 'taro/actions/FirebaseActions'

const FirebaseWatcher = (makeWatchSpecs) => (cls) => {

  class Wrapped extends Component {

    componentDidMount = () => {
      const {
        __watchSpecs__,
        __observe__,
      } = this.props
      for(const watchSpecKey in __watchSpecs__) {
        const watchSpec = __watchSpecs__[watchSpecKey]
        __observe__(watchSpec)
      }
    }

    componentWillUnmount = () => {
      const {
        __watchSpecs__,
        __unobserve__,
      } = this.props
      for(const watchSpecKey in __watchSpecs__) {
        const watchSpec = __watchSpecs__[watchSpecKey]
        __unobserve__(watchSpec)
      }
    }

    render = () => {
      return React.createElement(cls, this.props)
    }

  }

  return metautil.applyHocs(
    Wrapped,
    reduxConnect(
      (state, props) => {
        const watchSpecs = makeWatchSpecs(props)
        const output = {
          __watchSpecs__: watchSpecs,
        }
        for(const watchSpecKey in watchSpecs) {
          const watchSpec = watchSpecs[watchSpecKey]
          output[watchSpecKey] = state.Firebase[watchSpec.refKey]
        }
        return output
      },
      (dispatch, props) => ({
        __observe__: (watchSpec) => dispatch(
          FirebaseActions.observeFirebaseValue(watchSpec)
        ),
        __unobserve__: (watchSpec) => dispatch(
          FirebaseActions.unobserveFirebaseValue(watchSpec)
        ),
      }),
    ),
  )

}

export default FirebaseWatcher

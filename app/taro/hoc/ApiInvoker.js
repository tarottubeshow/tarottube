import React, { Component } from 'react'
import { connect as reduxConnect } from 'react-redux'

import * as ApiStore from 'taro/actions/ApiStore'
import * as metautil from 'taro/util/metautil'

const ApiInvoker = (makeApiSpecs) => (cls) => {

  class Wrapped extends Component {

    componentDidMount = () => {
      const {
        __apiSpecs__,
        __fetch__,
      } = this.props
      for(const apiSpecKey in __apiSpecs__) {
        const apiSpec = __apiSpecs__[apiSpecKey]
        __fetch__(apiSpec)
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
        const apiSpecs = makeApiSpecs(props)
        const output = {
          __apiSpecs__: apiSpecs,
        }
        for(const apiSpecKey in apiSpecs) {
          const apiSpec = apiSpecs[apiSpecKey]
          output[apiSpecKey] = state.ApiStore[apiSpec.key]
        }
        return output
      },
      (dispatch, props) => ({
        __fetch__: (apiSpec) => dispatch(
          // TODO: add param to action for api store reducer
          ApiStore.wrapApiAction(
            apiSpec.api.action(apiSpec.params),
            apiSpec.key,
          )
        ),
      }),
    ),
  )

}

export default ApiInvoker

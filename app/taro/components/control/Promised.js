import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { View } from 'react-native'

import { CHILDREN_TYPE } from 'taro/util/proputil'
import { combinePromiseStates } from 'taro/util/promiseutil'
import ErrorBlock from 'taro/components/control/ErrorBlock'
import LoadingBlock from 'taro/components/control/LoadingBlock'

class Promised extends Component {

  static propTypes = {
    render: PropTypes.func,
    children: CHILDREN_TYPE,

    renderLoading: PropTypes.func,
    loadingComponent: PropTypes.any,

    promises: PropTypes.array,
  }

  render = () => {
    const {
      promises,
    } = this.props
    const combinedPromise = combinePromiseStates(promises)
    if (!combinedPromise.settled) {
      return this.renderLoading()
    }
    else if (combinedPromise.rejected) {
      return <ErrorBlock error={ combinedPromise.reason } />
    } else {
      return this.renderReady(combinedPromise.value)
    }
  }

  renderLoading = () => {
    const {
      renderLoading,
      loadingComponent,
    } = this.props
    if (renderLoading != null) {
      return renderLoading()
    } else if(loadingComponent != null) {
      return React.createElement(loadingComponent, {})
    } else {
      return (
        <LoadingBlock />
      )
    }
  }

  renderReady = (values) => {
    const {
      children,
      render,
    } = this.props
    if (render != null) {
      return render(values)
    }
    else {
      return (
        <View>
          { children }
        </View>
      )
    }
  }

}

export default Promised

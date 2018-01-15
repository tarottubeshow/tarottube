import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect as reduxConnect } from 'react-redux'

import ActiveTimeslotSelector from 'taro/components/ActiveTimeslotSelector'

import { applyHocs } from 'taro/util/metautil'

class RouterView extends Component {

  static propTypes = {
    route: PropTypes.object,
  }

  render = () => {
    // TODO: other routes
    return <ActiveTimeslotSelector />
  }

}

const Router = applyHocs(
  RouterView,
  reduxConnect(
    (state, props) => ({
      route: state.Router,
    }),
    (dispatch, props) => ({
    }),
  ),
)

export default Router

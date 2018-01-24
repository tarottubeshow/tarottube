import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect as reduxConnect } from 'react-redux'
import { values } from 'lodash/object'

import TimeslotViewer from 'taro/components/screen/TimeslotViewer'
import { applyHocs } from 'taro/util/metautil'
import { pickFunc } from 'taro/util/funcutil'
import { sorted } from 'taro/util/iterutil'
import * as NotificationsController from 'taro/controllers/NotificationsController'

class ActiveTimeslotSelectorView extends Component {

  static propTypes = {
    route: PropTypes.object,
    time: PropTypes.instanceOf(Date),
    timeslots: PropTypes.object,
  }

  componentDidMount = () => {
    NotificationsController.maybeRequest()
  }

  getCurrentTimeslot = () => {
    const {
      time,
      timeslots,
    } = this.props
    const ordered = sorted({
      list: values(timeslots),
      key: pickFunc('end_time'),
    })
    for(const timeslot of ordered) {
      if(timeslot.getEndTime() > time) {
        return timeslot
      }
    }
  }

  render = () => {
    const {
      route,
      time,
    } = this.props
    const currentTimeslot = this.getCurrentTimeslot()
    return (
      <TimeslotViewer
        key={ `timeslot=${ currentTimeslot.stream_key }` }
        assumeSeen={ route.assumeSeen }
        time={ time }
        timeslot={ currentTimeslot }
      />
    )
  }

}

const ActiveTimeslotSelector = applyHocs(
  ActiveTimeslotSelectorView,
  reduxConnect(
    (state, props) => ({
      time: state.Time,
      timeslots: state.Firebase.timeslots,
    }),
    (dispatch, props) => ({
    }),
  ),
)

export default ActiveTimeslotSelector

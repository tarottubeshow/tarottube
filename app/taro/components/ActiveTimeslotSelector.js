import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect as reduxConnect } from 'react-redux'
import { values } from 'lodash/object'

import TimeslotViewer from 'taro/components/TimeslotViewer'
import { applyHocs } from 'taro/util/metautil'
import { pickFunc } from 'taro/util/funcutil'
import { sorted } from 'taro/util/iterutil'

class ActiveTimeslotSelectorView extends Component {

  static propTypes = {
    time: PropTypes.instanceOf(Date),
    timeslots: PropTypes.object,
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
      time,
    } = this.props
    const currentTimeslot = this.getCurrentTimeslot()
    return (
      <TimeslotViewer
        timeslotKey={ currentTimeslot.stream_key }
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

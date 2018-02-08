import React, { Component } from 'react'
import PropTypes from 'prop-types'

import * as metautil from 'taro/util/metautil'
import FirebaseWatcher from 'taro/hoc/FirebaseWatcher'
import VideoPlayer from 'taro/components/VideoPlayer'
import VIEW_COUNTER from 'taro/controllers/ViewCounter'

class TimeslotScreenView extends Component {

  static propTypes = {
    timeslot: PropTypes.object,
    route: PropTypes.object,

    views: PropTypes.number,
  }

  componentDidMount = () => {
    const timeslot = this.getTimeslot()
    VIEW_COUNTER.onView(timeslot.stream_key, 'archive')
  }

  getTimeslot = () => {
    const {
      route,
      timeslot,
    } = this.props
    if(timeslot != null) {
      return timeslot
    } else {
      return route.timeslot
    }
  }

  render = () => {
    const {
      views,
    } = this.props

    const timeslot = this.getTimeslot()
    const uri = timeslot.video_url
    return (
      <VideoPlayer
        context={ `timeslot:${ timeslot.stream_key }` }
        uri={ uri }
        views={ views }
      />
    )
  }

}

const TimeslotScreen = metautil.applyHocs(
  TimeslotScreenView,
  FirebaseWatcher((props) => {
    const timeslot = props.timeslot || props.route.timeslot
    return {
      views: {
        firebaseKey: `viewCounts/${ timeslot.stream_key }/views`,
        refKey: 'TimeslotScreen.views',
      },
    }
  }),
)

export default TimeslotScreen

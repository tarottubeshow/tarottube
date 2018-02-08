import React, { Component } from 'react'
import PropTypes from 'prop-types'

import * as metautil from 'taro/util/metautil'
import FirebaseWatcher from 'taro/hoc/FirebaseWatcher'
import VideoPlayer from 'taro/components/VideoPlayer'
import VIEW_COUNTER from 'taro/controllers/ViewCounter'

class TimeslotScreenView extends Component {

  static propTypes = {
    route: PropTypes.object,

    views: PropTypes.number,
  }

  componentDidMount = () => {
    const {
      route,
    } = this.props
    const timeslot = route.timeslot
    VIEW_COUNTER.onView(timeslot.stream_key, 'archive')
  }

  render = () => {
    const {
      route,
      views,
    } = this.props
    const backRoute = {
      context: 'archives',
    }
    const timeslot = route.timeslot
    const uri = timeslot.video_url
    return (
      <VideoPlayer
        backRoute={ backRoute }
        context={ `timeslot:${ timeslot.stream_key }` }
        uri={ uri }
        views={ views }
      />
    )
  }

}

const TimeslotScreen = metautil.applyHocs(
  TimeslotScreenView,
  FirebaseWatcher((props) => ({
    views: {
      firebaseKey: `viewCounts/${ props.route.timeslot.stream_key }/views`,
      refKey: 'TimeslotScreen.views',
    },
  })),
)

export default TimeslotScreen

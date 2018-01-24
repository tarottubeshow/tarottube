import React, { Component } from 'react'
import PropTypes from 'prop-types'

import VideoPlayer from 'taro/components/VideoPlayer'

class TimeslotScreen extends Component {

  static propTypes = {
    route: PropTypes.object,
  }

  render = () => {
    const {
      route,
    } = this.props
    const backRoute = {
      context: 'archives',
    }
    const timeslot = route.timeslot
    const uri = timeslot.video_url
    console.log(uri)
    return (
      <VideoPlayer
        backRoute={ backRoute }
        context={ `timeslot:${ timeslot.stream_key }` }
        uri={ uri }
      />
    )
  }

}

export default TimeslotScreen

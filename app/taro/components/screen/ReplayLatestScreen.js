import React, { Component } from 'react'
import PropTypes from 'prop-types'

import VideoPlayer from 'taro/components/VideoPlayer'

class ReplayLatestScreen extends Component {

  render = () => {
    const uri = `${ global.CONFIG['URL']['API'] }/video/latest.mp4`
    const backRoute = {
      context: 'home',
      assumeSeen: true,
    }
    return (
      <VideoPlayer
        backRoute={ backRoute }
        context="ReplayLatestScreen"
        uri={ uri }
      />
    )
  }

}

export default ReplayLatestScreen

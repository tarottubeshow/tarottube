import React, { Component } from 'react'
import PropTypes from 'prop-types'

import * as NagManager from 'taro/controllers/NagManager'
import VideoPlayer from 'taro/components/VideoPlayer'

class IntroScreen extends Component {

  onEnd = () => {
    NagManager.setSeen(NagManager.SEEN_INTRO_VIDEO)
  }

  render = () => {
    const uri = `${ global.CONFIG['URL']['API'] }/video/intro.mp4`
    const backRoute = {
      context: 'home',
    }
    return (
      <VideoPlayer
        autoBack={ true }
        onBack={ this.onEnd }
        backRoute={ backRoute }
        context="IntroVideo"
        uri={ uri }
      />
    )
  }

}

export default IntroScreen

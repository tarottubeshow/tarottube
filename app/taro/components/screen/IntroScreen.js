import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { StyleSheet } from 'react-native'

import * as NagManager from 'taro/controllers/NagManager'
import VideoPlayer from 'taro/components/VideoPlayer'
import * as metautil from 'taro/util/metautil'
import TrackedComponent from 'taro/hoc/TrackedComponent'

class IntroScreenView extends Component {

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
        style={ styles.video }
      />
    )
  }

}

const styles = StyleSheet.create({
  video: {
    flex: 1,
  }
})

const IntroScreen = metautil.applyHocs(
    IntroScreenView,
    TrackedComponent("Intro Screen"),
)

export default IntroScreen

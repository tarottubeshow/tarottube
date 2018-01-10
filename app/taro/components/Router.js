import React, { Component } from 'react'

import { View } from 'react-native'

import { Video } from 'expo'

class Router extends Component {

  static propTypes = {
  }

  onPlaybackStatusUpdate = (v) => {
    console.log(v)
  }

  render = () => {
    return <Video
      source={{uri: "http://tarottube.com/frags/hls/live09.m3u8"}}
      rate={1.0}
      volume={1.0}
      shouldPlay
      resizeMode={Video.RESIZE_MODE_COVER}
      onPlaybackStatusUpdate={this.onPlaybackStatusUpdate}
      style={{
        width: "100%",
        height: "100%",
      }}
    />
  }

}

export default Router

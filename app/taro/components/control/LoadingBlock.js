import React, { Component } from 'react'

import {
  Image,
  View,
  StyleSheet,
} from 'react-native'

import * as Images from 'taro/Images'
import COLORS from 'taro/colors'
import AmbientGradientBackground from 'taro/components/gradient/AmbientGradientBackground'

class LoadingBlock extends Component {

  render = () => {
    return (
      <View style={ styles.loading }>
        <Image
          source={ Images.LOADING_GIF }
        />
      </View>
    )
  }

}

const styles = StyleSheet.create({

  loading: {
    backgroundColor: COLORS.brightPurple,
    height: "100%",
    width: "100%",
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },

})

export default LoadingBlock

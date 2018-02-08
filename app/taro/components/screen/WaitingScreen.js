import React, { Component } from 'react'
import PropTypes from 'prop-types'

import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import * as ixh from 'react-native-iphone-x-helper'

import COLORS from 'taro/colors'
import TRACKER from 'taro/tracking'
import AmbientGradientBackground from 'taro/components/gradient/AmbientGradientBackground'
import Button from 'taro/components/form/Button'
import Timer from 'taro/components/Timer'
import * as Images from 'taro/Images'
import * as metautil from 'taro/util/metautil'
import RoutableComponent from 'taro/hoc/RoutableComponent'

class WaitingScreenView extends Component {

  static propTypes = {
    timeslot: PropTypes.object,
    mode: PropTypes.string,

    goto: PropTypes.func,
    safeTop: PropTypes.number,
  }

  componentDidMount = () => {
    TRACKER.track('Mounted WaitingScreen')
  }

  onReplayLatest = () => {
    this.props.onReplay()
  }

  render = () => {
    return (
      <AmbientGradientBackground style={ styles.parent }>
        <View style={ styles.top }>
          { this.renderHamburger() }
          <View style={ styles.topSpacer } />
          { this.renderHelpButton() }
        </View>
        <Image
          style={ styles.logo }
          source={ Images.LOGO_LONG_WHITE }
        />
        { this.renderMain() }
        <View style={ styles.bottom }>
          { this.renderReplayButton() }
        </View>
      </AmbientGradientBackground>
    )
  }

  renderReplayButton = () => {
    const {
      goto,
      mode,
    } = this.props
    if(mode == 'soon') {
      return null
    }

    let text
    if(mode == 'countdown') {
      text = "Play Latest"
    } else {
      text = "Replay"
    }

    const route = {
      context: 'replay',
    }

    return (
      <Button
        text={ text }
        onPress={ () => goto(route) }
        style={ styles.bottomButton }
        color="yellow"
      />
    )
  }

  renderHamburger = () => {
    const {
      goto,
    } = this.props
    const route = {
      context: 'hamburger',
    }
    return (
      <TouchableOpacity
        onPress={ () => goto(route) }
        style={ styles.hamburger }
      >
        <Image
          style={ styles.hamburger }
          source={ Images.HAMBURGER_BUTTON }
        />
      </TouchableOpacity>
    )
  }

  renderHelpButton = () => {
    const {
      goto,
    } = this.props
    const route = {
      context: 'faq',
    }
    return (
      <TouchableOpacity
        onPress={ () => goto(route) }
        style={ styles.help }
      >
        <Image
          style={ styles.help }
          source={ Images.HELP_BUTTON }
        />
      </TouchableOpacity>
    )
  }

  renderMain = () => {
    const {
      mode,
      timeslot,
    } = this.props
    if(mode == 'countdown') {
      return (
        <Timer
          style={ styles.timer }
          time={ timeslot.getStartTime() }
        />
      )
    } else {
      let note
      if(mode == 'soon') {
        note = "will begin shortly!"
      } else if(mode == 'missed') {
        note = "You missed the stream!"
      } else if(mode == 'over') {
        note = "Thanks for tuning in!"
      }
      return (
        <Text style={ styles.note }>
          { note }
        </Text>
      )
    }
  }

  renderTimer = () => {
    const {
      isFuture,
      timeslot,
    } = this.props
    if(isFuture) {

    } else {
      return (
        <Text style={ styles.soon }>
          will begin shortly!
        </Text>
      )
    }
  }

}

const styles = StyleSheet.create({
  parent: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 260,
    height: 43,
  },
  note: {
    backgroundColor: 'transparent',
    color: COLORS.white,
    fontSize: 24,
    marginTop: 20,
    backgroundColor: 'transparent',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 1,
  },
  timer: {
    marginTop: 10,
  },
  top: {
    flexGrow: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingLeft: 12,
    paddingRight: 10,
    paddingTop: 10,
    ...ixh.ifIphoneX({
      paddingLeft: 22,
      paddingRight: 20,
    }),
  },
  topSpacer: {
    flexGrow: 1,
  },
  bottom: {
    flexGrow: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    paddingBottom: 20,
  },
  bottomButton: {
    width: 300,
    marginTop: 10,
  },
  hamburger: {
    width: 32,
    height: 32,
  },
  help: {
    width: 32,
    height: 32,
  },
})

const WaitingScreen = metautil.applyHocs(
  WaitingScreenView,
  RoutableComponent,
)

export default WaitingScreen

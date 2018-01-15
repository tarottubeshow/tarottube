import React, { Component } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { connect as reduxConnect } from 'react-redux'

import { Image, StyleSheet, Text, View } from 'react-native'

import COLORS from 'taro/colors'
import Timer from 'taro/components/Timer'
import { applyHocs } from 'taro/util/metautil'

class WaitingScreenView extends Component {

  static propTypes = {
    timeslotKey: PropTypes.string,
    timeslot: PropTypes.object,
  }

  render = () => {
    const {
      timeslot,
    } = this.props

    return (
      <View style={ styles.parent }>
        <Image
          style={ styles.logo }
          source={require('img/logo_long_blue_red.png')}
        />
        <Text style={ styles.heading }>
          Next Reading
        </Text>
        <Timer time={ timeslot.getStartTime() } />
        <Text style={ styles.timerDetail }>
          ({ timeslot.getStartTime().calendar() })
        </Text>
      </View>
    )

  }

}

const styles = StyleSheet.create({
  parent: {
    backgroundColor: COLORS.white,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heading: {
    color: COLORS.red,
    fontWeight: 'bold',
    fontSize: 24,
    marginBottom: 10,
  },
  timerDetail: {
    color: COLORS.orange,
    fontSize: 18,
    marginTop: 10,
  },
  logo: {
    width: 260,
    height: 43,
    marginBottom: 20,
  },
})

const WaitingScreen = applyHocs(
  WaitingScreenView,
  reduxConnect(
    (state, props) => ({
      timeslot: state.Firebase.timeslots[props.timeslotKey],
    }),
    (dispatch, props) => ({
    }),
  ),
)

export default WaitingScreen

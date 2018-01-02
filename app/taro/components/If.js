import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { View } from 'react-native'

import {
  CHILDREN_TYPE,
} from 'taro/util/proputil'

class If extends Component {

  static propTypes = {
    children: CHILDREN_TYPE,
    condition: PropTypes.bool,
  }

  render = () => {
    const {
      children,
      condition,
    } = this.props
    if(condition) {
      return (
        <View>
          { children }
        </View>
      )
    } else {
      return (
        <View />
      )
    }
  }

}

export default If

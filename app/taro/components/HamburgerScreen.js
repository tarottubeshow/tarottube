import React, { Component } from 'react'
import PropTypes from 'prop-types'

import * as NB from 'native-base'

import * as metautil from 'taro/util/metautil'
import TitledScreen from 'taro/components/TitledScreen'
import RoutableComponent from 'taro/hoc/RoutableComponent'

const ACTIONS = [
  {
    name: "Past Broadcasts",
    route: {
      context: 'archives',
    }
  },
  {
    name: "Request a Reading",
    route: {
      context: 'request',
    }
  },
  {
    name: "FAQs",
    route: {
      context: 'faq',
    }
  },
]

class HamburgerScreenView extends Component {

  render = () => {
    const homeRoute = {
      context: 'home',
    }
    return (
      <TitledScreen
        title="Tarot Tube Menu"
        backRoute={ homeRoute }
      >
        { this.renderMain() }
      </TitledScreen>
    )
  }

  renderMain = () => {
    return (
      <NB.Content>
        <NB.List>
          { ACTIONS.map(this.renderListItem) }
        </NB.List>
      </NB.Content>
    )
  }

  renderListItem = (action, i) => {
    const {
      goto,
    } = this.props
    return (
      <NB.ListItem
        key={ `nav_${ i }` }
        onPress={ () => goto(action.route) }
      >
        <NB.Text>{ action.name }</NB.Text>
      </NB.ListItem>
    )
  }

}

const HamburgerScreen = metautil.applyHocs(
  HamburgerScreenView,
  RoutableComponent,
)

export default HamburgerScreen

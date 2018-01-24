import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect as reduxConnect } from 'react-redux'

import {
  Content,
  Container,
  Header,
  Title,
  Footer,
  FooterTab,
  Button,
  Left,
  Right,
  Body,
  Icon,
  Text,
  List,
  ListItem,
} from 'native-base'

import * as metautil from 'taro/util/metautil'
import * as RouterActions from 'taro/actions/RouterActions'

class HamburgerScreenView extends Component {

  static propTypes = {
    goto: PropTypes.func,
  }

  onBack = () => {
    const {
      goto,
    } = this.props
    goto({
      context: 'home',
    })
  }

  render = () => {
    return (
      <Container>
        { this.renderHeader() }
        { this.renderMain() }
      </Container>
    )
  }

  renderHeader = () => {
    return (
      <Header>
        <Left>
          <Button
            transparent
            onPress={ this.onBack }
          >
            <Icon name='ios-arrow-back' />
          </Button>
        </Left>
        <Body>
          <Title>Tarot Tube Menu</Title>
        </Body>
        <Right />
      </Header>
    )
  }

  renderMain = () => {
    const {
      goto,
    } = this.props
    const faqRoute = {
      context: 'faq',
    }
    const archiveRoute = {
      context: 'archives',
    }
    return (
      <Content>
        <List>
          <ListItem
            onPress={ () => goto(faqRoute) }
          >
            <Text>FAQs</Text>
          </ListItem>
          <ListItem
            onPress={ () => goto(archiveRoute) }
          >
            <Text>Past Broadcasts</Text>
          </ListItem>
        </List>
      </Content>
    )
  }

}

const HamburgerScreen = metautil.applyHocs(
  HamburgerScreenView,
  reduxConnect(
    (state, props) => ({
    }),
    (dispatch, props) => ({
      goto: (route) => {
        dispatch(RouterActions.requestRouteChange(route))
      }
    }),
  ),
)

export default HamburgerScreen

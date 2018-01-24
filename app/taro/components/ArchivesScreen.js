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
import * as proputil from 'taro/util/proputil'
import * as RouterActions from 'taro/actions/RouterActions'
import * as MRA from 'taro/actions/ModelRegistryActions'
import * as MRR from 'taro/reducers/ModelRegistryReducer'
import Promised from 'taro/components/Promised'
import TimeslotList from 'taro/models/TimeslotList'

class ArchivesScreenView extends Component {

  static propTypes = {
    timeslots: PropTypes.array,
    promise: proputil.PROMISE_STATE_TYPE,
  }

  componentDidMount = () => {
    this.props.__init__()
  }

  onBack = () => {
    const {
      goto,
    } = this.props
    goto({
      context: 'hamburger',
    })
  }

  onSelect = (timeslot) => {
    const {
      goto,
    } = this.props
    goto({
      context: 'timeslot',
      timeslot: timeslot,
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
          <Title>Past Broadcasts</Title>
        </Body>
        <Right />
      </Header>
    )
  }

  renderMain = () => {
    const {
      promise,
    } = this.props
    return (
      <Promised
        promises={ [ promise ] }
        render={ this.renderListReady }
      />
    )
  }

  renderListReady = () => {
    const {
      timeslots,
    } = this.props
    return (
      <Content>
        <List>
          { timeslots.map(this.renderListItem) }
        </List>
      </Content>
    )
  }

  renderListItem = (timeslot) => {
    return (
      <ListItem
        key={ `timeslot_${ timeslot.stream_key }` }
        onPress={ () => this.onSelect(timeslot) }
      >
        <Text>{ timeslot.name }</Text>
      </ListItem>
    )
  }

}

const ArchivesScreen = metautil.applyHocs(
  ArchivesScreenView,
  reduxConnect(
    (state, props) => ({
      promise: MRR.getModelPromise(state, TimeslotList),
      timeslots: MRR.getRelatedModels(state, TimeslotList, null, 'timeslots'),
    }),
    (dispatch, props) => ({
      __init__: () => {
        dispatch(MRA.loadModel(TimeslotList, {cache: false}))
      },
      goto: (route) => {
        dispatch(RouterActions.requestRouteChange(route))
      }
    }),
  ),
)

export default ArchivesScreen

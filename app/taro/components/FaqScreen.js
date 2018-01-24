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
import {
  View,
  StyleSheet,
} from 'react-native'

import * as metautil from 'taro/util/metautil'
import * as proputil from 'taro/util/proputil'
import * as RouterActions from 'taro/actions/RouterActions'
import * as MRA from 'taro/actions/ModelRegistryActions'
import * as MRR from 'taro/reducers/ModelRegistryReducer'
import Promised from 'taro/components/Promised'
import VideoPlayer from 'taro/components/VideoPlayer'
import FaqList from 'taro/models/FaqList'

class FaqLinkList extends Component {

  static propTypes = {
    faqPromise: proputil.PROMISE_STATE_TYPE,
    faqs: PropTypes.array,
    onSelect: PropTypes.func,
  }

  render = () => {
    const {
      faqPromise,
    } = this.props
    return (
      <Promised
        promises={ [ faqPromise ] }
        render={ this.renderListReady }
      />
    )
  }

  renderListReady = () => {
    const {
      faqs,
    } = this.props
    return (
      <Content>
        <List>
          { faqs.map(this.renderListItem) }
        </List>
      </Content>
    )
  }

  renderListItem = (faq) => {
    const {
      onSelect,
    } = this.props
    return (
      <ListItem
        key={ `faq_${ faq.id }` }
        onPress={ () => onSelect(faq) }
      >
        <Text>{ faq.title }</Text>
      </ListItem>
    )
  }

}

class FaqViewer extends Component {

  static propTypes = {
    onBack: PropTypes.func,
    faq: PropTypes.object,
  }

  render = () => {
    const {
      faq,
      onBack,
    } = this.props
    return (
      <View style={ styles.video }>
        <VideoPlayer
          context={ `faq:${ faq.id }` }
          uri={ faq.url }
          hideClose={ true }
          onBack={ onBack }
        />
      </View>
    )
  }

}

class FaqScreenView extends Component {

  static propTypes = {
    __init__: PropTypes.func,
    faqs: PropTypes.array,
    faqPromise: proputil.PROMISE_STATE_TYPE,
  }

  state = {
    faq: null,
  }

  componentDidMount = () => {
    this.props.__init__()
  }

  onBack = () => {
    const {
      goto,
    } = this.props
    const {
      faq,
    } = this.state

    if(faq == null) {
      goto({
        context: 'home',
      })
    } else {
      this.setState({
        faq: null,
      })
    }

  }

  onSelectFaq = (faq) => {
    this.setState({
      faq: faq,
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
    const {
      faq,
    } = this.state

    let title
    if(faq == null) {
      title = "FAQs"
    } else {
      title = faq.title
    }

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
          <Title>{ title }</Title>
        </Body>
        <Right />
      </Header>
    )
  }

  renderMain = () => {
    const {
      faqPromise,
      faqs,
    } = this.props
    const {
      faq,
    } = this.state
    if(faq == null) {
      return (
        <FaqLinkList
          faqs={ faqs }
          faqPromise={ faqPromise }
          onSelect={ this.onSelectFaq }
        />
      )
    } else {
      return (
        <FaqViewer
          faq={ faq }
          onBack={ this.onBack }
        />
      )
    }
  }

}

const FaqScreen = metautil.applyHocs(
  FaqScreenView,
  reduxConnect(
    (state, props) => ({
      faqPromise: MRR.getModelPromise(state, FaqList),
      faqs: MRR.getRelatedModels(state, FaqList, null, 'faqs'),
    }),
    (dispatch, props) => ({
      __init__: () => {
        dispatch(MRA.loadModel(FaqList, {cache: false}))
      },
      goto: (route) => {
        dispatch(RouterActions.requestRouteChange(route))
      }
    }),
  ),
)

const styles = StyleSheet.create({
  video: {
    flex: 1,
  },
})

export default FaqScreen

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect as reduxConnect } from 'react-redux'

import * as NB from 'native-base'
import {
  View,
  StyleSheet,
} from 'react-native'

import * as metautil from 'taro/util/metautil'
import * as proputil from 'taro/util/proputil'
import * as MRA from 'taro/actions/ModelRegistryActions'
import * as MRR from 'taro/reducers/ModelRegistryReducer'
import Promised from 'taro/components/Promised'
import VideoPlayer from 'taro/components/VideoPlayer'
import FaqList from 'taro/models/FaqList'
import TitledScreen from 'taro/components/TitledScreen'
import RoutableComponent from 'taro/hoc/RoutableComponent'
import TrackedComponent from 'taro/hoc/TrackedComponent'

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
      <NB.Content>
        <NB.List>
          { faqs.map(this.renderListItem) }
        </NB.List>
      </NB.Content>
    )
  }

  renderListItem = (faq) => {
    const {
      onSelect,
    } = this.props
    return (
      <NB.ListItem
        key={ `faq_${ faq.id }` }
        onPress={ () => onSelect(faq) }
      >
        <NB.Text>{ faq.title }</NB.Text>
      </NB.ListItem>
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

    goto: PropTypes.func,
    track: PropTypes.func,
  }

  state = {
    faq: null,
  }

  componentDidMount = () => {
    this.props.__init__()
  }

  getTitle = () => {
    const {
      faq,
    } = this.state
    let title
    if(faq == null) {
      return "FAQs"
    } else {
      return faq.title
    }
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
    const {
      track,
    } = this.props
    track("Selected FAQ", {
      id: faq.id,
      title: faq.title,
    })
    this.setState({
      faq: faq,
    })
  }

  render = () => {
    return (
      <TitledScreen
        onBack={ this.onBack }
        title={ this.getTitle() }
      >
        { this.renderMain() }
      </TitledScreen>
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
  RoutableComponent,
  TrackedComponent('FAQ Screen'),
  reduxConnect(
    (state, props) => ({
      faqPromise: MRR.getModelPromise(state, FaqList),
      faqs: MRR.getRelatedModels(state, FaqList, null, 'faqs'),
    }),
    (dispatch, props) => ({
      __init__: () => {
        dispatch(MRA.loadModel(FaqList, {cache: false}))
      },
    }),
  ),
)

const styles = StyleSheet.create({
  video: {
    flex: 1,
  },
})

export default FaqScreen

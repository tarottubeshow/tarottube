import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect as reduxConnect } from 'react-redux'

import * as NB from 'native-base'
import { View } from 'react-native'

import * as metautil from 'taro/util/metautil'
import * as proputil from 'taro/util/proputil'
import * as MRA from 'taro/actions/ModelRegistryActions'
import * as MRR from 'taro/reducers/ModelRegistryReducer'
import Promised from 'taro/components/control/Promised'
import VideoPlayer from 'taro/components/VideoPlayer'
import FaqList from 'taro/models/FaqList'
import TitledScreen from 'taro/components/TitledScreen'
import RoutableComponent from 'taro/hoc/RoutableComponent'
import TrackedComponent from 'taro/hoc/TrackedComponent'

class FaqListScreenView extends Component {

  static propTypes = {
    __init__: PropTypes.func,
    faqs: PropTypes.array,
    faqPromise: proputil.PROMISE_STATE_TYPE,

    goto: PropTypes.func,
  }

  componentDidMount = () => {
    this.props.__init__()
  }

  onSelectFaq = (faq) => {
    const {
      goto,
    } = this.props
    goto({
      context: 'faq',
      faq: faq,
    })
  }

  render = () => {
    const {
      faqPromise,
    } = this.props
    return (
      <TitledScreen
        title="FAQs"
      >
        <Promised
          promises={ [ faqPromise ] }
          render={ this.renderListReady }
        />
      </TitledScreen>
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
        onPress={ () => this.onSelectFaq(faq) }
      >
        <NB.Text>{ faq.title }</NB.Text>
      </NB.ListItem>
    )
  }

}

const FaqListScreen = metautil.applyHocs(
  FaqListScreenView,
  RoutableComponent,
  TrackedComponent('FAQ List Screen'),
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

export default FaqListScreen

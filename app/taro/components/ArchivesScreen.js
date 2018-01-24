import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect as reduxConnect } from 'react-redux'

import * as NB from 'native-base'

import * as metautil from 'taro/util/metautil'
import * as proputil from 'taro/util/proputil'
import * as MRA from 'taro/actions/ModelRegistryActions'
import * as MRR from 'taro/reducers/ModelRegistryReducer'
import Promised from 'taro/components/Promised'
import TimeslotList from 'taro/models/TimeslotList'
import TitledScreen from 'taro/components/TitledScreen'
import RoutableComponent from 'taro/hoc/RoutableComponent'

class ArchivesScreenView extends Component {

  static propTypes = {
    timeslots: PropTypes.array,
    promise: proputil.PROMISE_STATE_TYPE,

    goto: PropTypes.func,
  }

  componentDidMount = () => {
    this.props.__init__()
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
    const hamburgerRoute = {
      context: 'hamburger',
    }
    return (
      <TitledScreen
        backRoute={ hamburgerRoute }
        title="Past Broadcasts"
      >
        { this.renderMain() }
      </TitledScreen>
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
      <NB.Content>
        <NB.List>
          { timeslots.map(this.renderListItem) }
        </NB.List>
      </NB.Content>
    )
  }

  renderListItem = (timeslot) => {
    return (
      <NB.ListItem
        key={ `timeslot_${ timeslot.stream_key }` }
        onPress={ () => this.onSelect(timeslot) }
      >
        <NB.Text>{ timeslot.name }</NB.Text>
      </NB.ListItem>
    )
  }

}

const ArchivesScreen = metautil.applyHocs(
  ArchivesScreenView,
  RoutableComponent,
  reduxConnect(
    (state, props) => ({
      promise: MRR.getModelPromise(state, TimeslotList),
      timeslots: MRR.getRelatedModels(state, TimeslotList, null, 'timeslots'),
    }),
    (dispatch, props) => ({
      __init__: () => {
        dispatch(MRA.loadModel(TimeslotList, {cache: false}))
      },
    }),
  ),
)

export default ArchivesScreen

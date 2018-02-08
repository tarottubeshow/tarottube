import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect as reduxConnect } from 'react-redux'

import { View, Image, StyleSheet } from 'react-native'
import * as NB from 'native-base'

import COLORS from 'taro/colors'
import * as Images from 'taro/Images'
import * as metautil from 'taro/util/metautil'
import RoutableComponent from 'taro/hoc/RoutableComponent'
import TrackedComponent from 'taro/hoc/TrackedComponent'
import TitledScreen from 'taro/components/TitledScreen'
import BoundTextArea from 'taro/components/form/BoundTextArea'
import BoundTextField from 'taro/components/form/BoundTextField'
import BoundForm from 'taro/components/form/BoundForm'
import READING_REQUEST_API from 'taro/api/ReadingRequestApi'

class RequestScreenView extends Component {

  static propTypes = {
    goto: PropTypes.func,
  }

  state = {
    values: {},
    sent: false,
  }

  onChange = (values) => {
    this.setState({
      values,
    })
  }

  onSubmit = () => {
    const {
      values,
    } = this.state
    READING_REQUEST_API.submit.exec({
      name: values.name,
      question: values.question,
    })
    this.setState({
      sent: true,
    })
  }

  render = () => {
    const {
      sent,
    } = this.state

    let rightIcon
    if(!sent) {
      rightIcon = 'ios-send'
    }
    return (
      <TitledScreen
        title="Request"
        rightIcon={ rightIcon }
        onRightIconClick={ this.onSubmit }
      >
        { this.renderMain() }
      </TitledScreen>
    )
  }

  renderMain = () => {
    const {
      sent,
    } = this.state
    if(sent) {
      return this.renderThanks()
    } else {
      return this.renderForm()
    }
  }

  renderThanks = () => {
    return (
      <View style={ styles.thanks }>
        <Image
          style={ styles.thanksImage }
          source={ Images.THUMBUP_GIF }
        />
      </View>
    )
  }

  renderForm = () => {
    const {
      values,
    } = this.state
    return (
      <NB.Content>
        <BoundForm
          onChange={ this.onChange }
          values={ values }
        >
          <BoundTextField
            bindName="name"
            label="Your Name (Feel free to make it up!)"
          />
          <BoundTextArea
            bindName="question"
            label="Your Question:"
            numberOfLines={ 14 }
          />
        </BoundForm>
      </NB.Content>
    )
  }

}

const RequestScreen = metautil.applyHocs(
  RequestScreenView,
  RoutableComponent,
  TrackedComponent("RequestScreen"),
)

const styles = StyleSheet.create({

  thanks: {
    backgroundColor: COLORS.brightPurple,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },

})


export default RequestScreen

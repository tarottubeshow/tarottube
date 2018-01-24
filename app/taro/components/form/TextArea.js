import React, { Component } from 'react'
import PropTypes from 'prop-types'
import * as lodashObject from 'lodash/object'

import { View, StyleSheet } from 'react-native'
import * as NB from 'native-base'

const PRESETS = {
  email: {
    keyboardType: 'email-address',
    autoCorrect: false,
    autoCapitalize: 'none',
  },
  password: {
    secureTextEntry: true,
    autoCorrect: false,
    autoCapitalize: 'none',
  },
}

class TextArea extends Component {

  static propTypes = {
    disabled: PropTypes.bool,
    label: PropTypes.string.isRequired,
    numberOfLines: PropTypes.number,
    preset: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    style: PropTypes.object,
    value: PropTypes.any,

    // pass-through values
    autoCapitalize: PropTypes.string,
    autoCorrect: PropTypes.bool,
    autoFocus: PropTypes.bool,
    blurOnSubmit: PropTypes.bool,
    caretHidden: PropTypes.bool,
    keyboardType: PropTypes.string,
    returnKeyType: PropTypes.string,
    secureTextEntry: PropTypes.bool,
    selectTextOnFocus: PropTypes.bool,

    // pass-through events
    onBlur: PropTypes.func,
    onEndEditing: PropTypes.func,
    onFocus: PropTypes.func,
    onSubmitEditing: PropTypes.func,
  }

  static defaultProps = {
    autoCapitalize: 'sentences',
    autoCorrect: true,
    autoFocus: false,
    blurOnSubmit: false,
    caretHidden: false,
    numberOfLines: 8,
    keyboardType: 'default',
    returnKeyType: null,
    secureTextEntry: false,
    selectTextOnFocus: false,
  }

  render = () => {
    const {
      disabled,
      label,
      numberOfLines,
      preset,
      onChange,
      style,
      value,
    } = this.props

    var options = lodashObject.pick(this.props, [
      'autoCapitalize',
      'autoCorrect',
      'autoFocus',
      'blurOnSubmit',
      'caretHidden',
      'editable',
      'keyboardType',
      'returnKeyType',
      'secureTextEntry',
      'selectTextOnFocus',
    ])

    var events = lodashObject.pick(this.props, [
      'onBlur',
      'onEndEditing',
      'onFocus',
      'onSubmitEditing',
    ])

    if(preset != null) {
      options = {
        ...options,
        ...PRESETS[preset],
      }
    }

    return (
      <View
        style={ styles.parent }
      >
        <NB.Text
          style={ styles.label }
        >
          { label }
        </NB.Text>
        <View
          style={ styles.textSpace }
        >
          <NB.Textarea
            style={ {
              height: 20 * numberOfLines,
            } }
            disabled={ disabled }
            onChangeText={ onChange }
            value={ value }
            { ...options }
            { ...events }
          />
        </View>
      </View>
    )
  }

}

const styles = StyleSheet.create({

  parent: {
    marginTop: 20,

    marginLeft: 5,
    marginRight: 5,
  },

  label: {
    color: '#999999',
    marginBottom: 2,
  },

  textSpace: {
    borderWidth: 1,
    borderColor: '#cccccc',
  },

})

export default TextArea

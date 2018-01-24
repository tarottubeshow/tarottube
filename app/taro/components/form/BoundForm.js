import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { View } from 'react-native'

import { CHILDREN_TYPE } from 'taro/util/proputil'

class BoundForm extends Component {

  static propTypes = {
    onChange: PropTypes.func.isRequired,
    onSubmit: PropTypes.func,
    errors: PropTypes.object,
    values: PropTypes.object,
    children: CHILDREN_TYPE,
  }

  static defaultProps = {
    errors: null,
    values: null,
    children: [],
    onSubmit: null,
  }

  static childContextTypes = {
    boundFormDelegate: PropTypes.object.isRequired,
  }

  getChildContext = () => ({
    boundFormDelegate: this,
  })

  getError = (name) => {
    const errors = this.props.errors || {}
    return errors[name]
  }

  getValue = (name) => this.props.values[name]

  onChange = (key, value) => {
    const values = { ...this.props.values }
    values[key] = value
    return this.props.onChange(values)
  }

  onSubmit = () => {
    this.props.onSubmit(this.props.values)
  }

  render = () => {
    const {
      children,
    } = this.props
    return (
      <View>
        { children }
      </View>
    )
  }

}

class StatefulBoundForm extends Component {
  static propTypes = {
    initialValues: PropTypes.object,
    onSubmit: PropTypes.func.isRequired,
    children: CHILDREN_TYPE,
  }

  static defaultProps = {
    initialValues: {},
  }

  state = {
    values: this.props.initialValues,
  }

  onChange = values => {
    console.log(values)
    this.setState({ values })
  }

  onSubmit = () => {
    this.props.onSubmit(this.state.values)
  }

  filteredProps = () => {
    const props = { ...this.props }
    delete props.onSubmit
    delete props.initialValues
    return props
  }

  render = () => (
    <BoundForm
      values={ this.state.values }
      onChange={ this.onChange }
      onSubmit={ this.onSubmit }
      { ...this.filteredProps() }
    >
      { this.props.children }
    </BoundForm>
    )

}

const bindInput = ({
  ComponentToWrap,
  defaultValue,
  bindPropMaker,
  valuePropMaker,
  otherPropMaker,
  renderInput,
}) => {
  class BoundInputComponent extends Component {

    static propTypes = {
      bindName: PropTypes.string.isRequired,
    }

    static contextTypes = {
      boundFormDelegate: PropTypes.object.isRequired,
    }

    getBindProps = () => {
      return bindPropMaker(this.onChange)
    }

    getFilteredProps = () => {
      const props = { ...this.props }
      delete props.bindName
      return props
    }

    getOtherProps = () => {
      if (otherPropMaker != null) {
        return otherPropMaker({
          ...this.props,
          onSubmit: this.onSubmit,
        })
      }
      else {
        return {}
      }
    }

    getValueProps = (value, error) => {
      return valuePropMaker(value, error)
    }

    onChange = (value) => {
      this.context.boundFormDelegate.onChange(
        this.props.bindName,
        value,
      )
    }

    onSubmit = () => {
      this.context.boundFormDelegate.onSubmit()
    }

    render = () => {
      const delegate = this.context.boundFormDelegate
      const value = (
        delegate.getValue(this.props.bindName)
        || defaultValue
      )
      const error = delegate.getError(this.props.bindName)
      if( renderInput != null ) {
        return renderInput({
          ...this.props,
          onChange: this.onChange,
          onSubmit: this.onSubmit,
        })
      } else {
        const valueProps = this.getValueProps(value, error)
        const bindProps = this.getBindProps()
        const otherProps = this.getOtherProps()
        const filteredProps = this.getFilteredProps()
        return (
          <ComponentToWrap
          { ...valueProps }
          { ...bindProps }
          { ...otherProps }
          { ...filteredProps }
          />
        )
      }
    }
  }

  return BoundInputComponent
}

export default BoundForm
export {
  StatefulBoundForm,

  bindInput,
}

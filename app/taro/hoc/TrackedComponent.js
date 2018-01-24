import React, { Component } from 'react'

import TRACKER from 'taro/tracking'

const TrackedComponent = (clsName, options={}) => (cls) => {

  class Wrapped extends Component {

    componentDidMount = () => {
      this.track(`Mounted ${ clsName }`)
    }

    makeProps = () => {
      if(options.propMaker != null) {
        return options.propMaker(this.props)
      } else {
        return {}
      }
    }

    track = (name, props) => {
      const combinedProps = {
        name: clsName,
        ...this.makeProps(),
        ...props,
      }
      TRACKER.track(name, combinedProps)
    }

    render = () => {
      return React.createElement(cls, {
        track: this.track,
        ...this.props,
      })
    }

  }

  return Wrapped

}

export default TrackedComponent

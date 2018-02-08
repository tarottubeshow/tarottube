import React, { Component } from 'react'
import PropTypes from 'prop-types'

import * as metautil from 'taro/util/metautil'
import VideoPlayer from 'taro/components/VideoPlayer'
import TrackedComponent from 'taro/hoc/TrackedComponent'

class FaqScreenView extends Component {

  static propTypes = {
    route: PropTypes.object,
  }

  render = () => {
    const {
      route,
    } = this.props
    const faq = route.faq
    return (
      <VideoPlayer
        context={ `faq:${ faq.id }` }
        uri={ faq.url }
      />
    )
  }

}

const FaqScreen = metautil.applyHocs(
  FaqScreenView,
  TrackedComponent('FAQ Screen', {
    propMaker: (props) => ({
      faq: props.route.faq.title,
    }),
  }),
)

export default FaqScreen

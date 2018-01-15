import React from 'react'

import middlewares from 'taro/store'
import reducers from 'taro/reducers'

import buildMain from 'taro/components/Main'

require('./config.js')

const Main = buildMain({
  reducers,
  middlewares,
})

export default Main

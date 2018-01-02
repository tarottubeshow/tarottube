import React from 'react'

import middlewares from 'taro/store'
import reducers from 'taro/reducers'

import buildMain from 'taro/components/Main'

const Main = buildMain({
  reducers,
  middlewares,
})

export default Main

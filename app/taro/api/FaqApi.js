import * as Api from 'taro/api/Api'

import FaqList from 'taro/models/FaqList'

const FAQ_API = Api.makeApiWrapper('taro.Faq', {

  get: () => Api.get({
    path: `faq`,
    cls: FaqList,
  }),

})

export default FAQ_API

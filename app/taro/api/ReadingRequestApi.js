import * as Api from 'taro/api/Api'

const READING_REQUEST_API = Api.makeApiWrapper('taro.ReadingRequest', {

  submit: ({
    name,
    question,
  }) => Api.post({
    path: `reading-request`,
    data: {
      name,
      question,
    },
  }),

})

export default READING_REQUEST_API

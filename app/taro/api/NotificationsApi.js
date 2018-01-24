import * as Api from 'taro/api/Api'

const NOTIFICATIONS_API = Api.makeApiWrapper('taro.Notifications', {

  subscribe: ({ token }) => Api.post({
    path: `notifications/subscribe`,
    data: {
      token,
    },
  }),

})

export default NOTIFICATIONS_API

import BaseModel from 'taro/models/BaseModel'

class Faq extends BaseModel {

  static key = 'Faq'

  constructor({
    id,
    order,
    title,
    url,
  }) {
    super()
    this.id = id
    this.order = order
    this.title = title
    this.url = url
  }

}

export default Faq

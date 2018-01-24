import BaseModel from 'taro/models/BaseModel'
import Faq from 'taro/models/Faq'

class FaqList extends BaseModel {

  static key = 'FaqList'

  static extractId = (target) => {
    return '*'
  }

  static relationships = {
    faqs: {
      cls: Faq,
      map: (faqs) => (
        faqs.map((faq) => ({
          id: faq.id,
        }))
      ),
    },
  }

  constructor({
    faqs,
  }) {
    super()
    this.faqs = faqs
  }

  getId = () => {
    return '*'
  }

}

export default FaqList

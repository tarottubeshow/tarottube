import * as firebase from 'firebase'
import uniqueId from 'react-native-unique-id'

class ViewCounter {

  getViewKey(streamKey) {
    return `viewCounts/${ streamKey }/views`
  }

  getViewingKey(streamKey) {
    return `viewCounts/${ streamKey }/viewing`
  }

  async onView(streamKey, live=true) {
    await this.write(
      this.getViewKey(streamKey)
    )
    if(live) {
      await this.write(
        this.getViewingKey(streamKey)
      )
    }
  }

  async getGuid() {
    return `${ await uniqueId() }`
  }

  async getRef(key) {
    const shardKey = global.CONFIG.FIREBASE.shard
    const guid = await this.getGuid()
    const ref = firebase.database().ref(`${ shardKey }/${ key }/${ guid }`)
    return ref
  }

  async write(key, value) {
    if(value == null) {
      value = await this.getGuid()
    }
    const ref = await this.getRef(key)
    ref.set(value)
  }

}

const VIEW_COUNTER = new ViewCounter()

export default VIEW_COUNTER

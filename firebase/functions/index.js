const functions = require('firebase-functions')

const admin = require('firebase-admin')
admin.initializeApp(functions.config().firebase)

const randomInt = (min, max) => {
  const val = Math.random()
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(val * (max - min + 1)) + min
}

const writeViewCount = (event, key) => {
  const data = event.data
  const parent = data.ref.parent
  const count = data.numChildren()
  const fuxxed = VIEW_MULTIPLIER * count + randomInt(0, VIEW_MULTIPLIER)
  return parent.child(key).set(fuxxed)
}

const VIEW_MULTIPLIER = 5

const DB = functions.database.instance('tarottube-prd')

exports.countViews = DB
  .ref('{shard}/viewCounts/{streamKey}/views')
  .onWrite((event) => {
    return writeViewCount(event, 'views_count')
  }
)

exports.countViewing = DB
  .ref('{shard}/viewCounts/{streamKey}/viewing')
  .onWrite((event) => {
    return writeViewCount(event, 'viewing_count')
  }
)

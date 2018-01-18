class Ticker {

  constructor(delay, fn) {
    this.delay = delay
    this.fn = fn
    this.cumulative = 0
    this.start()
    this.fn(0)
  }

  tick = () => {
    this.cumulative += this.delay
    this.fn(this.cumulative)
    this._schedule()
  }

  start = () => {
    this._schedule()
  }

  stop = () => {
    this._unschedule()
  }

  _schedule = () => {
    this._req = global.setTimeout(this.tick, this.delay)
  }

  _unschedule = () => {
    global.clearTimeout(this._req)
  }


}

export {
  Ticker,
}

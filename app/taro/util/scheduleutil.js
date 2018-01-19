class Ticker {

  constructor(delay, fn, initial=true) {
    this.delay = delay
    this.fn = fn
    this.cumulative = 0
    this.start()
    if(initial) {
      this.fn(0)
    }
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

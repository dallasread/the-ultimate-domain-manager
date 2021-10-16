import localForage from 'localforage'

class LocalCache {
  constructor () {
    this.db = localForage.createInstance({
      name: 'the-ultimate-domain-manager'
    })
  }

  set (key, value) {
    return this.db.setItem(key, value)
  }

  get (key) {
    return this.db.getItem(key)
  }

  reset () {
    return this.db.clear()
  }
}

export default LocalCache

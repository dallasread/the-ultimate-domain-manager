import localForage from 'localforage'

class LocalStore {
  constructor () {
    this.db = localForage.createInstance({
      name: 'the-ultimate-domain-manager'
    })
  }

  setItem (key, value) {
    return this.db.setItem(key, value)
  }

  getItem (key) {
    return this.db.getItem(key)
  }

  reset () {
    return this.db.clear()
  }
}

export default LocalStore

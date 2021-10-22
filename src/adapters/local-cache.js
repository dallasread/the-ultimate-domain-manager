import localForage from 'localforage'

class LocalCacheAdapter {
  constructor () {
    this.db = localForage.createInstance({
      name: 'the-ultimate-domain-manager'
    })
  }

  save (state) {
    return this.db.setItem('data', state)
  }

  restore () {
    return this.db.getItem('data')
  }

  reset () {
    return this.db.clear()
  }
}

export default LocalCacheAdapter

import Presenters from '@/lib/presenters.js'

class Commands {
  constructor (state, queries, dnsimpleAdapter, localStore) {
    this.state = state
    this.queries = queries
    this.dnsimpleAdapter = dnsimpleAdapter
    this.localStore = localStore
    this.presenters = new Presenters()
  }

  authenticate (accessToken) {
    return new Promise((resolve, reject) => {
      this.dnsimpleAdapter.fetchUser({ accessToken }).then((response) => {
        response.account.accessToken = accessToken

        this._upsertById('accounts', response.account)

        resolve()
      }).catch(reject)
    })
  }

  logout () {
    this.state.removeAll('accounts', this.state.findAll('accounts'))
    this.state.removeAll('domains', this.state.findAll('domains'))
  }

  authorize (code) {
    return new Promise((resolve, reject) => {
      this.dnsimpleAdapter.fetchAccessToken(code).then((accessToken) => {
        if (!accessToken) {
          return reject(new Error('Unauthorized'))
        }

        this.authenticate(accessToken)
          .then(resolve)
          .catch(reject)
      }).catch(reject)
    })
  }

  fetchDomain (accessToken, name) {
    return this.dnsimpleAdapter.fetchDomain(accessToken, name)
      .then((domain) => this._upsertById('domains', domain))
  }

  fetchDomains (accessToken) {
    return this.dnsimpleAdapter.fetchDomains(accessToken)
      .then((domains) => {
        domains.forEach((domain) => this._upsertById('domains', domain))
      })
  }

  restoreLocal () {
    return new Promise((resolve, reject) => {
      this.localStore.getItem('data').then((data) => {
        if (data) {
          this.state.add('accounts', data.accounts || [])
          this.state.add('domains', data.domains || [])
        }

        resolve()
      }).catch(reject)
    })
  }

  saveLocal () {
    this.localStore.setItem('data', {
      accounts: this.state.findAll('accounts')
        .map((account) => this.presenters.accountToJSON(account)),
      domains: this.state.findAll('domains')
        .map((domain) => this.presenters.domainToJSON(domain))
    })
  }

  _upsertById (model, data) {
    const existing = this.state.find(model, (item) => item.id === data.id)

    if (existing) {
      for (const key in data) {
        existing[key] = data[key]
      }
    } else {
      this.state.add(model, [data])
    }

    this.saveLocal()
  }
}

export default Commands

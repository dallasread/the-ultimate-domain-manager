class Commands {
  constructor (state, queries, dnsimpleAdapter, localCache, presenters) {
    this.state = state
    this.queries = queries
    this.dnsimpleAdapter = dnsimpleAdapter
    this.localCache = localCache
    this.presenters = presenters
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
    this.state.removeAll('accounts', this.queries.listAccounts())
    this.state.removeAll('domains', this.queries.listDomains())
    return this.localCache.reset()
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
      this.localCache.get('data').then((data) => {
        if (data) {
          this.state.add('accounts', data.accounts || [])
          this.state.add('domains', data.domains || [])
        }

        resolve()
      }).catch(reject)
    })
  }

  saveLocal () {
    this.localCache.set('data', {
      accounts: this.queries.listAccounts()
        .map((account) => this.presenters.accountToJSON(account)),
      domains: this.queries.listDomains()
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

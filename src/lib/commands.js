class Commands {
  constructor (state, queries, dnsimpleAdapter) {
    this.state = state
    this.queries = queries
    this.dnsimpleAdapter = dnsimpleAdapter
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
        this.authenticate(accessToken)
          .then(resolve)
          .catch(reject)
      }).catch(reject)
    })
  }

  fetchDomain (name) {
    const accessToken = this.queries.getAccessToken()
    return this.dnsimpleAdapter.fetchDomain(accessToken, name)
      .then((domain) => this._upsertById('domains', domain))
  }

  fetchDomains () {
    const accessToken = this.queries.getAccessToken()

    return this.dnsimpleAdapter.fetchDomains(accessToken)
      .then((domains) => {
        domains.forEach((domain) => this._upsertById('domains', domain))
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
  }
}

export default Commands

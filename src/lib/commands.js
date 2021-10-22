import debouncedPromise from '@/lib/utils/functions/debounced-promise.js'

class Commands {
  constructor (options) {
    for (const key in options) {
      this[key] = options[key]
    }
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

  logout () {
    this.state.removeAll('accounts', this.queries.listAccounts())
    this.state.removeAll('domains', this.queries.listDomains())
    return this.localCacheAdapter.reset()
  }

  fetchDomain (account, name) {
    return this.dnsimpleAdapter.fetchDomain(account, name)
      .then((domain) => {
        domain.provider = 'dnsimple.com'
        this._upsertById('domains', domain)
      })
  }

  fetchDomains (account) {
    return this.dnsimpleAdapter.fetchDomains(account)
      .then((domains) => {
        domains.forEach((domain) => {
          domain.provider = 'dnsimple.com'
          this._upsertById('domains', domain)
        })
      })
  }

  fetchLiveNameServers (domain) {
    return new Promise((resolve, reject) => {
      this.zoneVisionAdapter.fetchNameServers(domain).then((nameServers) => {
        this._upsertById('domains', { id: domain.id, liveNameServers: nameServers || [] })
        resolve()
      }).catch(reject)
    })
  }

  fetchNameServers (account, domain) {
    return new Promise((resolve, reject) => {
      this.dnsimpleAdapter.fetchNameServers(account, domain).then((nameServers) => {
        this._upsertById('domains', { id: domain.id, nameServers: nameServers || [] })
        resolve()
      }).catch(reject)
    })
  }

  updateNameServers (accessToken, domain, nameServers) {
    return this.dnsimpleAdapter.updateNameServers(accessToken, domain.name, nameServers)
      .then(() => {
        this._upsertById('domains', { id: domain.id, nameServers: nameServers || [] })
      })
  }

  fetchRecords (account, domain) {
    return this.dnsimpleAdapter.fetchRecords(account, domain.name)
      .then((records) => {
        records.forEach((record) => this._upsertById('records', record))
      })
  }

  restoreLocal () {
    return new Promise((resolve, reject) => {
      this.localCacheAdapter.restore().then((data) => {
        if (data) {
          this.state.add('accounts', data.accounts || [])
          this.state.add('domains', data.domains || [])
        }

        resolve()
      }).catch(reject)
    })
  }

  saveLocal () {
    return debouncedPromise(() => {
      this.localCacheAdapter.save(this.queries.stateToLocal())
    }, 300, this)
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

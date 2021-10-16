const SORT_BY_NAME = (a, b) => a.name.localeCompare(b.name)

class Queries {
  constructor (state, dnsimpleAdapter) {
    this.state = state
    this.dnsimpleAdapter = dnsimpleAdapter
  }

  listDomains () {
    return this.state.findAll('domains').sort(SORT_BY_NAME)
  }

  listAccounts () {
    return this.state.findAll('accounts').sort(SORT_BY_NAME)
  }

  getDomain (name) {
    return this.state.find('domains', (domain) => domain.name === name)
  }

  oauthUrl () {
    return this.dnsimpleAdapter.oauthUrl()
  }

  getAccessToken () {
    const account = this.state.findAll('accounts')[0]

    if (account) {
      return account.accessToken
    }
  }
}

export default Queries

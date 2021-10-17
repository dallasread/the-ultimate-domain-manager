const SORT_BY_NAME = (a, b) => a.name.localeCompare(b.name)
const SORT_BY_EXPIRES_AND_NAME = (queries) => {
  return (a, b) => {
    if (queries.isExpiring(a) && !queries.isExpiring(b)) return -1
    if (!queries.isExpiring(a) && queries.isExpiring(b)) return 1

    if (queries.isExpiring(a) && queries.isExpiring(b)) {
      if (queries.expiresAt(a).getTime() < queries.expiresAt(b).getTime()) return -1
      if (queries.expiresAt(a).getTime() > queries.expiresAt(b).getTime()) return 1
    }

    return SORT_BY_NAME(a, b)
  }
}

class Queries {
  constructor (state, dnsimpleAdapter) {
    this.state = state
    this.dnsimpleAdapter = dnsimpleAdapter
  }

  listDomains () {
    return this.state.findAll('domains').sort(SORT_BY_EXPIRES_AND_NAME(this))
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

  isRegistered (domain) {
    return domain.state === 'registered'
  }

  isExpiring (domain) {
    return this.isRegistered(domain) && this.daysTilExpiry(domain) < 60
  }

  expiresAt (domain) {
    return new Date(domain.expires_on)
  }

  daysTilExpiry (domain) {
    const diff = this.expiresAt(domain).getTime() - new Date()
    return Math.round(diff / (1000 * 60 * 60 * 24))
  }

  getAccessToken () {
    const account = this.state.findAll('accounts')[0]

    if (account) {
      return account.accessToken
    }
  }
}

export default Queries

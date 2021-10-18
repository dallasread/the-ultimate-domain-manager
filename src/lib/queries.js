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

const MATCH_HOSTNAME = /[\w-]+\.\w+$/gi

function uniq (value, index, self) {
  return self.indexOf(value) === index
}

class Queries {
  constructor (state, dnsimpleAdapter, serviceIdentifier) {
    this.state = state
    this.dnsimpleAdapter = dnsimpleAdapter
    this.serviceIdentifier = serviceIdentifier
  }

  listDomains () {
    return this.state.findAll('domains').sort(SORT_BY_EXPIRES_AND_NAME(this))
  }

  listAccounts () {
    return this.state.findAll('accounts')
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

  isPropagating (domain) {
    const currentNameServers = (domain.nameServers || []).sort()
    const liveNameServers = (domain.liveNameServers || []).sort()
    return currentNameServers.length && liveNameServers.length && JSON.stringify(currentNameServers) !== JSON.stringify(liveNameServers)
  }

  expiresAt (domain) {
    return new Date(domain.expires_on)
  }

  daysTilExpiry (domain) {
    const diff = this.expiresAt(domain).getTime() - new Date()
    return Math.round(diff / (1000 * 60 * 60 * 24))
  }

  getAccount () {
    return this.state.findAll('accounts')[0]
  }

  isProvider (domain, provider) {
    return domain.provider === provider
  }

  isNotServedByProvider (domain) {
    const nameServers = this.commonLiveNameServers(domain)
    return nameServers.length && nameServers.indexOf(domain.provider) === -1
  }

  shouldBeServedByProvider (domain) {
    if (!this.isRegistered(domain)) {
      return false
    }

    const nameServers = this.commonLiveNameServers(domain)
    return nameServers.length && nameServers.indexOf(domain.provider) === -1
  }

  commonLiveNameServers (domain) {
    return (domain.liveNameServers || []).map((nameServer) => {
      return nameServer.match(MATCH_HOSTNAME)[0]
    }).filter(uniq)
  }

  recordsForZone (zoneName) {
    return this.state.findAll('records', (r) => r.zone_id === zoneName)
  }

  findInstalledServices (domain, records) {
    return this.serviceIdentifier.parse(domain, records)
  }
}

export default Queries

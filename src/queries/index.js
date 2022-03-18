import sortByExpiresAndName from './sorters/sort-by-expires-and-name'
import matchesHostname from './filters/matches-hostname.js'
import uniq from './filters/uniq.js'

class Queries {
  constructor (options) {
    for (const key in options) {
      this[key] = options[key]
    }
  }

  listDomains () {
    return this.state.findAll('domains').sort(sortByExpiresAndName(this))
  }

  listAccounts () {
    return this.state.findAll('accounts')
  }

  getDomain (name) {
    return this.state.find('domains', (domain) => domain.name === name)
  }

  listTLDs () {
    const tlds = this.listDomains().map((domain) => this.parseTLD(domain.name))

    return [...new Set(tlds)]
  }

  parseTLD (name) {
    return name.substring(name.lastIndexOf('.') + 1, name.length)
  }

  oauthUrl () {
    return this.dnsimpleAdapter.oauthUrl()
  }

  isRegistered (domain) {
    return domain.state === 'registered'
  }

  isAutoRenew (domain) {
    return domain.auto_renew === true
  }

  isImminent (domain) {
    return this.daysTilExpiry(domain) < 60
  }

  isAutoRenewing (domain) {
    return this.isRegistered(domain) && this.isImminent(domain) && this.isAutoRenew(domain)
  }

  isExpiring (domain) {
    return this.isRegistered(domain) && this.isImminent(domain) && !this.isAutoRenew(domain)
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

  getProvider (domain) {
    return {
      nameServers: ['ns1.dnsimple.com', 'ns2.dnsimple.com', 'ns3.dnsimple.com', 'ns4.dnsimple.com']
    }
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
    return (domain.liveNameServers || []).map(matchesHostname).filter(uniq)
  }

  recordsForZone (zoneName) {
    return this.state.findAll('records', (r) => r.zone_id === zoneName)
  }

  findInstalledServices (domain, records) {
    return this.serviceIdentifier.parse(records)
  }

  prettyExpiresDate (domain) {
    const date = new Date(domain.expires_on)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  }
}

export default Queries

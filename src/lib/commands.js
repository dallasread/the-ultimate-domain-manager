class Commands {
  constructor (queries, dnsimpleAdapter) {
    this.dnsimpleAdapter = dnsimpleAdapter
    this.queries = queries
  }

  authenticate () {
    return this.dnsimpleAdapter.authenticate()
  }

  logout () {
    return this.dnsimpleAdapter.logout()
  }

  authorize () {
    return this.dnsimpleAdapter.authorize()
  }

  getDomain (name) {
    return this.dnsimpleAdapter.getDomain(name)
  }

  fetchDomains () {
    return this.dnsimpleAdapter.fetchDomains(name)
  }
}

export default Commands

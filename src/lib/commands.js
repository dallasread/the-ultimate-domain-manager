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

  fetchDomain (name) {
    return this.dnsimpleAdapter.fetchDomain(name)
  }

  fetchDomains () {
    return this.dnsimpleAdapter.fetchDomains()
  }
}

export default Commands

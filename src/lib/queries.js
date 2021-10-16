const SORT_BY_NAME = (a, b) => a.name.localeCompare(b.name)

class Queries {
  constructor (dnsimpleAdapter) {
    this.dnsimpleAdapter = dnsimpleAdapter
  }

  getCurrentUser () {
    return this.dnsimpleAdapter.user
  }

  listDomains () {
    return this.dnsimpleAdapter.domains.sort(SORT_BY_NAME)
  }

  getDomain (name) {
    return this.dnsimpleAdapter.domains.find((domain) => domain.name === name)
  }
}

export default Queries

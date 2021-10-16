class Queries {
  constructor (dnsimpleAdapter) {
    this.dnsimpleAdapter = dnsimpleAdapter
  }

  getCurrentUser () {
    return this.dnsimpleAdapter.user
  }

  listDomains () {
    return this.dnsimpleAdapter.listDomains()
  }
}

export default Queries

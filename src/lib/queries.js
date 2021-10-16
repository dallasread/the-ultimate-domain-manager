class Queries {
  constructor (dnsimpleAdapter) {
    this.dnsimpleAdapter = dnsimpleAdapter
  }

  getCurrentUser () {
    return this.dnsimpleAdapter.user
  }
}

export default Queries

const DOMAINS = [
  { id: 181984, account_id: 1385, registrant_id: 2715, name: 'example.com', unicode_name: 'example.com', state: 'registered', auto_renew: false, private_whois: false, expires_on: '2021-06-05', expires_at: '2021-06-05T02:15:00Z', created_at: '2020-06-04T19:15:14Z', updated_at: '2020-06-04T19:15:21Z' },
  { id: 181984, account_id: 1385, registrant_id: 2715, name: 'foo-bar.com', unicode_name: 'foo-bar.com', state: 'registered', auto_renew: false, private_whois: false, expires_on: '2021-06-05', expires_at: '2021-06-05T02:15:00Z', created_at: '2020-06-04T19:15:14Z', updated_at: '2020-06-04T19:15:21Z' }
]

class DNSimpleAPI {
  constructor () {
    this.data = {}
    this.user = null
  }

  authorize () {
    return Promise.resolve()
  }

  authenticate () {
    this.user = {}

    if (this.user) {
      return Promise.resolve()
    } else {
      return Promise.reject(new Error('Unauthorized'))
    }
  }

  listDomains () {
    return Promise.resolve({
      domains: DOMAINS
    })
  }

  getDomain (name) {
    return Promise.resolve({
      domain: DOMAINS.find((d) => d.name === name)
    })
  }

  logout () {
    this.user = null
    return Promise.resolve()
  }
}

export default DNSimpleAPI

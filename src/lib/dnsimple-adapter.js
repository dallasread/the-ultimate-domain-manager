class DNSimpleAdapter {
  constructor (fetch) {
    this.user = {}
    this.domains = []
    this._fetch = fetch
  }

  authorize () {
    return Promise.resolve()
  }

  authenticate () {
    if (this.user) {
      return Promise.resolve()
    } else {
      return Promise.reject(new Error('Unauthorized'))
    }
  }

  fetchDomains () {
    return new Promise((resolve, reject) => {
      this._fetcher('/4521/domains').then((response) => {
        response.data.forEach((item) => this._setDomain(item))
        resolve(this.domains)
      }).catch(reject)
    })
  }

  fetchDomain (name) {
    return new Promise((resolve, reject) => {
      this._fetcher(`/4521/domains/${name}`).then((response) => {
        const domain = this._setDomain(response.data)
        resolve(domain)
      }).catch(reject)
    })
  }

  logout () {
    this.user = null
    this.domains = []
    return Promise.resolve()
  }

  _setDomain (data) {
    let domain = this.domains.find((d) => d.name === data.name)

    if (domain) {
      for (const key in data) {
        domain[key] = data[key]
      }
    } else {
      domain = data
      this.domains.push(domain)
    }

    return domain
  }

  _fetcher (path, method = 'GET') {
    const proxy = 'https://thawing-brushlands-90182.herokuapp.com'
    const url = `https://api.dnsimple.com/v2${path}`

    return new Promise((resolve, reject) => {
      this._fetch.call(window, `${proxy}/${url}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer S93yNoMP7497DFAzrjRgRt2EaompJ4Nz'
        }
        // body: JSON.stringify(user)
      }).then((response) => {
        response.json().then((json) => {
          resolve(json)
        })
      }).catch(reject)
    })
  }
}

export default DNSimpleAdapter

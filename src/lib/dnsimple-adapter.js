const fetcher = (url, options) => {
  const proxy = 'https://thawing-brushlands-90182.herokuapp.com'

  return new Promise((resolve, reject) => {
    fetch(`${proxy}/${url}`, options).then((response) => {
      response.json().then((json) => {
        resolve(json)
      })
    }).catch(reject)
  })
}

class DNSimpleAdapter {
  constructor () {
    this.user = {}
    this.domains = []
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
      fetcher('https://api.dnsimple.com/v2/4521/domains', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer S93yNoMP7497DFAzrjRgRt2EaompJ4Nz'
        }
        // body: JSON.stringify(user)
      }).then((response) => {
        this.domains = response.data
        resolve(this.domains)
      }).catch(reject)
    })
  }

  listDomains () {
    return this.domains
  }

  getDomain (name) {
    return Promise.resolve({
      domain: this.domains.find((d) => d.name === name)
    })
  }

  logout () {
    this.user = null
    return Promise.resolve()
  }
}

export default DNSimpleAdapter

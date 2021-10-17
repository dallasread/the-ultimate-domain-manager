const BASE_URL = window.location.href.substr(0, window.location.href.lastIndexOf('/'))
const OAUTH_RESPONSE_TYPE = 'code'
const OAUTH_GRANT_TYPE = 'authorization_code'
const OAUTH_REDIRECT_URL = `${BASE_URL}/auth`
const OAUTH_STATE = 'RANDOM'

// const OAUTH_CLIENT_ID = 'cbde777b80c127be'
// const OAUTH_CLIENT_SECRET = atob('Q21TaVh6YmlQWTkxZloxZjRaNEZCc2R0NEt2QjBGcmg')
// const DNSIMPLE_API = 'https://api.dnsimple.com/v2'
// const DNSIMPLE_APP = 'https://dnsimple.com'

const OAUTH_CLIENT_ID = '10ae7b4e4d1d69a4'
const OAUTH_CLIENT_SECRET = '0XSVDAf2YfEemHpE22XuupjX2ESDNJVb'
const DNSIMPLE_API = 'https://api.sandbox.dnsimple.com/v2'
const DNSIMPLE_APP = 'https://sandbox.dnsimple.com'

class DNSimpleAdapter {
  constructor (fetch) {
    this._fetch = fetch
  }

  fetchAccessToken (code) {
    return new Promise((resolve, reject) => {
      this._fetcher('POST', '/oauth/access_token', null, {
        grant_type: OAUTH_GRANT_TYPE,
        client_id: OAUTH_CLIENT_ID,
        client_secret: OAUTH_CLIENT_SECRET,
        redirect_uri: OAUTH_REDIRECT_URL,
        state: OAUTH_STATE,
        code
      }).then((response) => {
        if (response.message) {
          return reject(new Error(response.message))
        }

        resolve(response.access_token)
      }).catch(reject)
    })
  }

  fetchUser (auth) {
    return new Promise((resolve, reject) => {
      this._fetcher('GET', '/whoami', auth.accessToken).then((response) => {
        if (response.message) {
          return reject(response.message)
        }

        resolve(response.data)
      }).catch(reject)
    })
  }

  fetchDomains (account) {
    return new Promise((resolve, reject) => {
      this._fetcher('GET', `/${account.id}/domains`, account.accessToken).then((response) => {
        resolve(response.data)
      }).catch(reject)
    })
  }

  fetchDomain (account, name) {
    return new Promise((resolve, reject) => {
      this._fetcher('GET', `/${account.id}/domains/${name}`, account.accessToken).then((response) => {
        resolve(response.data)
      }).catch(reject)
    })
  }

  fetchNameServers (account, name) {
    return new Promise((resolve, reject) => {
      this._fetcher('GET', `/${account.id}/registrar/domains/${name}/delegation`, account.accessToken).then((response) => {
        resolve(response.data)
      }).catch(reject)
    })
  }

  updateNameServers (account, name, nameServers) {
    return new Promise((resolve, reject) => {
      this._fetcher('PUT', `/${account.id}/registrar/domains/${name}/delegation`, account.accessToken, nameServers).then((response) => {
        resolve(response.data)
      }).catch(reject)
    })
  }

  oauthUrl () {
    const url = new URL(`${DNSIMPLE_APP}/oauth/authorize`)

    url.searchParams.append('response_type', OAUTH_RESPONSE_TYPE)
    url.searchParams.append('redirect_uri', OAUTH_REDIRECT_URL)
    url.searchParams.append('client_id', OAUTH_CLIENT_ID)
    url.searchParams.append('state', OAUTH_STATE)

    return url.href
  }

  _fetcher (method, path, accessToken, data) {
    // console.log('FETCH', method, path)

    const proxy = 'https://thawing-brushlands-90182.herokuapp.com'
    const url = `${DNSIMPLE_API}${path}`
    const headers = { 'Content-Type': 'application/json' }
    const options = { method, headers }

    if (data) {
      options.body = JSON.stringify(data)
    }

    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`
    }

    return new Promise((resolve, reject) => {
      this._fetch.call(window, `${proxy}/${url}`, options).then((response) => {
        response.json()
          .then(resolve)
          .catch(reject)
      }).catch(reject)
    })
  }
}

// DNSimpleAdapter.prototype._fetcher = () => {
//   return Promise.resolve()
// }

export default DNSimpleAdapter

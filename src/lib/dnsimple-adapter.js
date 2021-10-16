const OAUTH_RESPONSE_TYPE = 'code'
const OAUTH_GRANT_TYPE = 'authorization_code'
const OAUTH_REDIRECT_URL = 'http://localhost:8080/auth'
const OAUTH_CLIENT_ID = 'cbde777b80c127be'
const OAUTH_CLIENT_SECRET = 'CmSiXzbiPY91fZ1f4Z4FBsdt4KvB0Frh'
const OAUTH_STATE = 'RANDOM'

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
        if (response.error_description) {
          return reject(new Error(response.error_description))
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

  fetchDomains (accessToken) {
    return new Promise((resolve, reject) => {
      this._fetcher('GET', '/4521/domains', accessToken).then((response) => {
        resolve(response.data)
      }).catch(reject)
    })
  }

  fetchDomain (accessToken, name) {
    return new Promise((resolve, reject) => {
      this._fetcher('GET', `/4521/domains/${name}`, accessToken).then((response) => {
        resolve(response.data)
      }).catch(reject)
    })
  }

  oauthUrl () {
    const url = new URL('https://dnsimple.com/oauth/authorize')

    url.searchParams.append('response_type', OAUTH_RESPONSE_TYPE)
    url.searchParams.append('redirect_uri', OAUTH_REDIRECT_URL)
    url.searchParams.append('client_id', OAUTH_CLIENT_ID)
    url.searchParams.append('state', OAUTH_STATE)

    return url.href
  }

  _fetcher (method, path, accessToken, data) {
    const proxy = 'https://thawing-brushlands-90182.herokuapp.com'
    const url = `https://api.dnsimple.com/v2${path}`
    const headers = { 'Content-Type': 'application/json' }
    const options = { method, headers }

    if (data) {
      options.body = JSON.stringify(data)
    }

    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`
    }

    console.log('FETCH', method, path)

    return new Promise((resolve, reject) => {
      this._fetch.call(window, `${proxy}/${url}`, options).then((response) => {
        response.json()
          .then(resolve)
          .catch(reject)
      }).catch(reject)
    })
  }
}

export default DNSimpleAdapter

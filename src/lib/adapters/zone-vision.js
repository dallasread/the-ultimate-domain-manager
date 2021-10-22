class ZoneVisionAdapter {
  constructor (fetch) {
    this._fetch = fetch
  }

  fetchNameServers (domain) {
    return new Promise((resolve, reject) => {
      this._fetch.call(window, `https://api.zone.vision/query/${domain.name}`).then((response) => {
        response.json()
          .then((json) => {
            const nameServers = json.parent['name-servers'].map((n) => n.name.slice(0, -1))
            resolve(nameServers)
          })
          .catch(reject)
      }).catch(reject)
    })
  }
}

export default ZoneVisionAdapter

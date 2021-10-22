import localForage from 'localforage'

class LocalCacheAdapter {
  constructor () {
    this.db = localForage.createInstance({
      name: 'the-ultimate-domain-manager'
    })
  }

  save (accounts, domains, records) {
    return this.db.setItem('data', {
      accounts: (accounts || []).map((account) => {
        return {
          provider: account.provider,
          id: account.id,
          email: account.email,
          plan_identifier: account.plan_identifier,
          created_at: account.created_at,
          updated_at: account.updated_at,
          accessToken: account.accessToken
        }
      }),
      domains: (domains || []).map((domain) => {
        return {
          provider: domain.provider,
          id: domain.id,
          account_id: domain.account_id,
          registrant_id: domain.registrant_id,
          name: domain.name,
          unicode_name: domain.unicode_name,
          state: domain.state,
          auto_renew: domain.auto_renew,
          private_whois: domain.private_whois,
          expires_on: domain.expires_on,
          expires_at: domain.expires_at,
          created_at: domain.created_at,
          updated_at: domain.updated_at,
          nameServers: (domain.nameServers || []).map((ns) => `${ns}`),
          liveNameServers: (domain.liveNameServers || []).map((ns) => `${ns}`)
        }
      }),
      records: (records || []).map((record) => {
        return {
          content: record.content,
          created_at: record.created_at,
          id: record.id,
          name: record.name,
          parent_id: record.parent_id,
          priority: record.priority,
          regions: (record.regions || []).map((region) => `${region}`),
          system_record: record.system_record,
          ttl: record.ttl,
          type: record.type,
          updated_at: record.updated_at,
          zone_id: record.zone_id
        }
      })
    })
  }

  restore () {
    return this.db.getItem('data')
  }

  reset () {
    return this.db.clear()
  }
}

export default LocalCacheAdapter

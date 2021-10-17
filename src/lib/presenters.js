class Presenters {
  accountToJSON (account) {
    return {
      provider: account.provider,
      id: account.id,
      email: account.email,
      plan_identifier: account.plan_identifier,
      created_at: account.created_at,
      updated_at: account.updated_at,
      accessToken: account.accessToken
    }
  }

  domainToJSON (domain) {
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
      nameServers: (domain.nameServers || []).map((ns) => `${ns}`)
    }
  }

  prettyDate (str) {
    const date = new Date(str)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  }
}

export default Presenters

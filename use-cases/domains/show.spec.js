import { mountApp } from '../helper.js'

describe('Domains: Show', () => {
  let domain
  let account
  let dnsimpleAdapter

  beforeEach(() => {
    domain = { id: 181984, account_id: 1385, registrant_id: 2715, name: 'example.com', unicode_name: 'example.com', state: 'registered', auto_renew: false, private_whois: false, expires_on: '2021-06-05', expires_at: '2021-06-05T02:15:00Z', created_at: '2020-06-04T19:15:14Z', updated_at: '2020-06-04T19:15:21Z' }
    account = { accessToken: 'abc-123' }
    dnsimpleAdapter = {
      fetchUser () { return Promise.resolve({ account }) },
      fetchDomain () {
        return Promise.resolve(domain)
      },
      fetchDomains () {
        return Promise.resolve([
          domain,
          { id: 181985, account_id: 1385, registrant_id: 2715, name: 'foo-bar.com', unicode_name: 'foo-bar.com', state: 'registered', auto_renew: false, private_whois: false, expires_on: '2021-06-05', expires_at: '2021-06-05T02:15:00Z', created_at: '2020-06-04T19:15:14Z', updated_at: '2020-06-04T19:15:21Z' }
        ])
      },
      fetchRecords: () => Promise.resolve([])
    }
  })

  it('can visit a domain', async () => {
    const app = await mountApp('/domains', { accounts: [account], domains: [], records: [] }, dnsimpleAdapter)

    await app.click('[aria-label="Manage example.com"]')

    expect(app.text()).toContain('Your domain expires')
  })

  describe('dates', () => {
    it('shows the expiry date', async () => {
      const app = await mountApp('/domains', { accounts: [account], domains: [], records: [] }, dnsimpleAdapter)

      await app.click('[aria-label="Manage example.com"]')

      expect(app.text()).toContain('Your domain expires')
    })

    it('shows the renewal date', async () => {
      domain.auto_renew = true
      const app = await mountApp('/domains', { accounts: [account], domains: [], records: [] }, dnsimpleAdapter)

      await app.click('[aria-label="Manage example.com"]')

      expect(app.text()).toContain('Your domain will renew')
    })
  })

  describe('name servers', () => {
    it('shows the current DNS provider', async () => {
      const zoneVisionAdapter = {
        fetchNameServers: () => Promise.resolve(['ns1.dnsimple.com', 'ns2.dnsimple.com'])
      }
      const app = await mountApp('/domains', { accounts: [account], domains: [], records: [] }, dnsimpleAdapter, null, zoneVisionAdapter)

      await app.click('[aria-label="Manage example.com"]')

      expect(app.text()).toContain('Resolution provided by dnsimple.com')
    })

    it('shows a warning if the current provider is not DNSimple', async () => {
      const zoneVisionAdapter = {
        fetchNameServers: () => Promise.resolve(['ns1.cloudflare.com'])
      }
      const app = await mountApp('/domains', { accounts: [account], domains: [], records: [] }, dnsimpleAdapter, null, zoneVisionAdapter)

      await app.click('[aria-label="Manage example.com"]')

      expect(app.text()).toContain('Your domain is not served by DNSimple.')
    })

    it('can point to DNSimple', async () => {
      const zoneVisionAdapter = {
        fetchNameServers: () => Promise.resolve(['ns1.cloudflare.com'])
      }
      dnsimpleAdapter.updateNameServers = () => Promise.resolve()
      const app = await mountApp('/domains', { accounts: [account], domains: [], records: [] }, dnsimpleAdapter, null, zoneVisionAdapter)

      await app.click('[aria-label="Manage example.com"]')
      await app.click('[aria-label="Point to DNSimple"]')

      expect(app.text()).toContain('Resolution provided by dnsimple.com')
    })
  })
})

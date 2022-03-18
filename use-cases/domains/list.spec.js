import { mountApp } from '../helper.js'

describe('Domains: List', () => {
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
      }
    }
  })

  it('displays a list of my domains', async () => {
    const app = await mountApp('/domains', {
      state: { accounts: [account], domains: [], records: [] },
      dnsimpleAdapter
    })

    expect(app.text()).toContain('example.com')
  })

  it('saves the domains to local storage', async () => {
    const app = await mountApp('/domains', {
      state: { accounts: [account], domains: [], records: [] },
      dnsimpleAdapter
    })
    await app.wait()

    const data = await app.vm.commands.localCacheAdapter.restore()

    expect(data.domains[0].name).toContain('example.com')
  })

  it('restores the domains from local storage', async () => {
    dnsimpleAdapter.fetchDomains = () => Promise.resolve([])
    const app = await mountApp('/domains', {
      state: { accounts: [], domains: [], records: [] },
      dnsimpleAdapter,
      localCacheAdapterData: {
        accounts: [{ accessToken: 'abc-123' }],
        domains: [{ name: 'foo.bar' }]
      }
    })

    expect(app.text()).toContain('foo.bar')
  })

  it('can search the domains', async () => {
    const app = await mountApp('/domains', {
      state: { accounts: [account], domains: [], records: [] },
      dnsimpleAdapter
    })

    const input = app.find('input[aria-label="Domain search"]')
    await input.setValue('example')
    await app.wait()

    expect(app.findAll('[aria-label^="Manage"]').length).toEqual(1)
    expect(app.find('[aria-label="Manage example.com"]').text()).toContain('example.com')
  })

  it('sorts by expired, auto-renewing, then alphabetical', async () => {
    dnsimpleAdapter.fetchDomains = () => Promise.resolve([])
    const expiringSoon = new Date().setDate(-1)
    const app = await mountApp('/domains', {
      state: { accounts: [], domains: [], records: [] },
      dnsimpleAdapter,
      localCacheAdapterData: {
        accounts: [{ accessToken: 'abc-123' }],
        domains: [
          { name: 'bar.baz' },
          { name: 'abc.com' },
          { name: 'auto-renewing.com', state: 'registered', auto_renew: true, expires_on: expiringSoon },
          { name: 'expiring.com', state: 'registered', expires_on: expiringSoon }
        ]
      }
    })

    const links = app.findAll('[aria-label^="Manage"]')
    const domainNames = links.map((link) => link.find('[aria-label="Name"]').text())

    expect(domainNames).toEqual(['expiring.com', 'auto-renewing.com', 'abc.com', 'bar.baz'])
  })

  it('shows the expiry date', async () => {
    const app = await mountApp('/domains', {
      state: { accounts: [account], domains: [], records: [] },
      dnsimpleAdapter
    })

    expect(app.text()).toContain('Expires in')
  })

  it('shows the auto-renewal date', async () => {
    domain.auto_renew = true
    const app = await mountApp('/domains', {
      state: { accounts: [account], domains: [], records: [] },
      dnsimpleAdapter
    })

    expect(app.text()).toContain('Renews within')
  })

  it('provides a one-click to search by TLD', async () => {
    const domainName = 'example.app'
    const app = await mountApp('/domains', {
      state: { accounts: [account], domains: [{ name: domainName }], records: [] },
      dnsimpleAdapter
    })

    const input = app.find('input[aria-label="Domain search"]')
    await input.setValue('should show no results')
    expect(app.text()).not.toContain(domainName)

    await app.click('[aria-label="Search for .app"]')

    expect(app.text()).toContain(domainName)
  })
})

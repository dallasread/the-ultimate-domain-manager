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
    const app = await mountApp('/domains', { accounts: [account], domains: [] }, dnsimpleAdapter)

    expect(app.text()).toContain('example.com')
  })

  it('saves the domains to local storage', async () => {
    const app = await mountApp('/domains', { accounts: [account], domains: [] }, dnsimpleAdapter)
    await app.wait()

    const data = await app.vm.commands.localCache.get('data')

    expect(data.domains[0].name).toContain('example.com')
  })

  it('restores the domains from local storage', async () => {
    dnsimpleAdapter.fetchDomains = () => Promise.resolve([])
    const app = await mountApp('/domains', { accounts: [], domains: [] }, dnsimpleAdapter, {
      accounts: [{ accessToken: 'abc-123' }],
      domains: [{ name: 'foo.bar' }]
    })

    expect(app.text()).toContain('foo.bar')
  })

  it('can search the domains', async () => {
    const app = await mountApp('/domains', { accounts: [account], domains: [] }, dnsimpleAdapter)

    const input = app.find('input[aria-label="Domain search"]')
    await input.setValue('example')
    await app.wait()

    expect(app.findAll('[aria-label^="Manage"]').length).toEqual(1)
    expect(app.find('[aria-label="Manage example.com"]').text()).toContain('example.com')
  })

//     it('sorts by expired, then alphabetical', () => {
//       dnsimpleAdapter.fetchDomains = () => Promise.resolve([])
//       const expiringSoon = new Date()
//       expiringSoon.setDate(-5)
//       const app = await mountApp('/domains', { accounts: [], domains: [] }, dnsimpleAdapter, {
//         accounts: [{ accessToken: 'abc-123' }],
//         domains: [{ name: 'bar.baz' }, { name: 'foo.bar', expires_on: expiringSoon.toLocaleDateString() }]
//       })
//
//       expect(app.text()).toContain('foo.bar')
//     })
})

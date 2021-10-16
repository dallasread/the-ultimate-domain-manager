import { mountApp } from './helper.js'
const domain = { id: 181984, account_id: 1385, registrant_id: 2715, name: 'example.com', unicode_name: 'example.com', state: 'registered', auto_renew: false, private_whois: false, expires_on: '2021-06-05', expires_at: '2021-06-05T02:15:00Z', created_at: '2020-06-04T19:15:14Z', updated_at: '2020-06-04T19:15:21Z' }
const dnsimpleAdapter = {
  fetchUser (account) { return Promise.resolve({ account }) },
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

describe('See my domains', () => {
  it('displays a list of my domains', async () => {
    const app = await mountApp('/domains', null, dnsimpleAdapter)

    expect(app.text()).toContain('example.com')
  })

  it('can search the domains', async () => {
    const app = await mountApp('/domains', null, dnsimpleAdapter)

    const input = app.find('input[aria-label="Domain search"]')
    await input.setValue('example')

    expect(app.findAll('[aria-label^="Manage"]').length).toEqual(1)
    expect(app.find('[aria-label="Manage example.com"]').text()).toEqual('example.com')
  })

  it('can visit a domain', async () => {
    const app = await mountApp('/domains', null, dnsimpleAdapter)

    await app.click('[aria-label="Manage example.com"]')

    expect(app.text()).toContain('name servers')
  })
})

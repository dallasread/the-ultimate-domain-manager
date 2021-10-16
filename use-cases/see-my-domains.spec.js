import { mountApp, flushPromises } from './helper.js'

const DOMAINS = [
  { id: 181984, account_id: 1385, registrant_id: 2715, name: 'example.com', unicode_name: 'example.com', state: 'registered', auto_renew: false, private_whois: false, expires_on: '2021-06-05', expires_at: '2021-06-05T02:15:00Z', created_at: '2020-06-04T19:15:14Z', updated_at: '2020-06-04T19:15:21Z' },
  { id: 181984, account_id: 1385, registrant_id: 2715, name: 'foo-bar.com', unicode_name: 'foo-bar.com', state: 'registered', auto_renew: false, private_whois: false, expires_on: '2021-06-05', expires_at: '2021-06-05T02:15:00Z', created_at: '2020-06-04T19:15:14Z', updated_at: '2020-06-04T19:15:21Z' }
]
const dnsimpleAdapter = {
  domains: DOMAINS,
  authenticate () { return Promise.resolve() },
  fetchDomains () { return Promise.resolve() },
  fetchDomain () {
    return Promise.resolve(DOMAINS[0])
  }
}

describe('See my domains', () => {
  it('displays a list of my domains', async () => {
    const app = await mountApp('/domains', dnsimpleAdapter)
    await flushPromises()

    expect(app.text()).toContain('example.com')
  })

  it('can search the domains', async () => {
    const app = await mountApp('/domains', dnsimpleAdapter)
    await flushPromises()

    const input = app.find('input[aria-label="Domain search"]')
    await input.setValue('example')

    expect(app.findAll('[aria-label^="Manage"]').length).toEqual(1)
    expect(app.find('[aria-label="Manage example.com"]').text()).toEqual(DOMAINS[0].name)
  })

  it('can visit a domain', async () => {
    const app = await mountApp('/domains', dnsimpleAdapter)
    await flushPromises()

    await app.find('[aria-label="Manage example.com"]').trigger('click')
    await flushPromises()

    expect(app.text()).toContain('name servers')
  })
})

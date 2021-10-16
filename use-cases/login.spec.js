import { mountApp, flushPromises } from './helper.js'

describe('Log in', () => {
  it('shows a button that points to the DNSimple OAuth flow', async () => {
    const dnsimpleAdapter = { authenticate () { return Promise.reject() } }
    const app = await mountApp('/login', dnsimpleAdapter)

    const button = app.find('a[aria-label="Connect via DNSimple"]')
    expect(button.text()).toEqual('Connect via DNSimple')
    expect(button.element.href).toMatch('https://dnsimple.com/oauth/authorize')
    expect(button.element.href).toMatch('response_type=')
    expect(button.element.href).toMatch('redirect_uri=')
    expect(button.element.href).toMatch('client_id=')
    expect(button.element.href).toMatch('state=')
  })

  it('redirects to the domains page when authorized', async () => {
    const dnsimpleAdapter = {
      authenticate: jest.fn(() => Promise.resolve()),
      authorize: jest.fn(() => Promise.resolve()),
      listDomains: jest.fn(() => Promise.resolve({ domains: [{ id: 181984, account_id: 1385, registrant_id: 2715, name: 'example.com', unicode_name: 'example.com', state: 'registered', auto_renew: false, private_whois: false, expires_on: '2021-06-05', expires_at: '2021-06-05T02:15:00Z', created_at: '2020-06-04T19:15:14Z', updated_at: '2020-06-04T19:15:21Z' }] }))
    }
    const app = await mountApp('/auth?code=AUTHCODE', dnsimpleAdapter)

    expect(app.text()).toContain('example.com')
  })

  it('shows an error if the user is not authenticated with DNSimple', async () => {
    const expectedError = 'You are unauthorized'
    const dnsimpleAdapter = { authenticate () { return Promise.reject() }, authorize: jest.fn(() => Promise.reject(expectedError)) }
    const app = await mountApp('/auth?code=AUTHCODE', dnsimpleAdapter)

    await flushPromises()

    expect(app.find('[aria-label="Unauthorized"]').text()).toEqual(expectedError)
    expect(app.findAll('[aria-label="Log in"]').length).toEqual(1)
  })
})

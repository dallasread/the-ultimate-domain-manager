import { mountApp } from '../helper.js'

describe('Auth: Log in', () => {
  it('shows a button that points to the DNSimple OAuth flow', async () => {
    const app = await mountApp('/login')

    const button = app.find('a[aria-label="Connect via DNSimple"]')
    expect(button.text()).toEqual('Connect via DNSimple')
    expect(button.element.href).toMatch('https://dnsimple.com/oauth/authorize')
    expect(button.element.href).toMatch('response_type=')
    expect(button.element.href).toMatch('redirect_uri=')
    expect(button.element.href).toMatch('client_id=')
    expect(button.element.href).toMatch('state=')
  })

  it('redirects to the domains page when authorized', async () => {
    const account = { accessToken: 'abc-123' }
    const app = await mountApp('/auth?code=AUTHCODE', {
      accounts: [account],
      domains: []
    }, {
      fetchUser (account) { return Promise.resolve({ account }) },
      fetchAccessToken () { return Promise.resolve(account.accessToken) },
      fetchDomains () { return Promise.resolve([{ name: 'example.com' }]) }
    })

    expect(app.text()).toContain('example.com')
  })

  it('shows an error if the user is not authenticated with DNSimple', async () => {
    const expectedError = 'You are unauthorized'
    const app = await mountApp('/auth?code=AUTHCODE', null, {
      fetchAccessToken () { return Promise.reject(new Error(expectedError)) }
    })

    await app.wait()

    expect(app.find('[aria-label="Unauthorized"]').text()).toEqual(expectedError)
    expect(app.findAll('[aria-label="Log in"]').length).toEqual(1)
  })
})

import { mountApp, flushPromises } from '../../spec/helper.js'

describe('Log in', () => {
  it('shows a button that points to the DNSimple OAuth flow', async () => {
    const dnsimpleAdapter = { authenticate () { return Promise.reject() } }
    const wrapper = await mountApp('/login', dnsimpleAdapter)

    const button = wrapper.find('a[aria-label="Connect via DNSimple"]')
    expect(button.text()).toEqual('Connect via DNSimple')
    expect(button.element.href).toMatch('https://dnsimple.com/oauth/authorize')
    expect(button.element.href).toMatch('response_type=')
    expect(button.element.href).toMatch('redirect_uri=')
    expect(button.element.href).toMatch('client_id=')
    expect(button.element.href).toMatch('state=')
  })

  it('redirects to the domains page when authorized', async () => {
    const dnsimpleAdapter = { authenticate () { return Promise.reject() }, authorize: jest.fn(() => Promise.resolve()) }
    const wrapper = await mountApp('/auth?code=AUTHCODE', dnsimpleAdapter)

    expect(wrapper.vm.$router.push).toHaveBeenCalledWith('/domains')
  })

  it('shows an error if the user is not authenticated with DNSimple', async () => {
    const expectedError = 'You are unauthorized'
    const dnsimpleAdapter = { authenticate () { return Promise.reject() }, authorize: jest.fn(() => Promise.reject(expectedError)) }
    const wrapper = await mountApp('/auth?code=AUTHCODE', dnsimpleAdapter)

    await flushPromises()

    expect(wrapper.find('[aria-label="Unauthorized"]').text()).toEqual(expectedError)
    expect(wrapper.findAll('[aria-label="Log in"]').length).toEqual(1)
  })
})

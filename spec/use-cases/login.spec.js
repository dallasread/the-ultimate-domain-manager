import { mountApp } from '../../spec/helper.js'
import App from '@/components/App/component.vue'

describe('Log in to a DNSimple account', () => {
  it('shows a button that points to the DNSimple OAuth flow', async () => {
    const wrapper = await mountApp('/')

    const button = wrapper.find('a[aria-label="Connect via DNSimple"]')
    expect(button.text()).toEqual('Connect via DNSimple')
    expect(button.element.href).toMatch('https://dnsimple.com/oauth/authorize')
    expect(button.element.href).toMatch('response_type=')
    expect(button.element.href).toMatch('redirect_uri=')
    expect(button.element.href).toMatch('client_id=')
    expect(button.element.href).toMatch('state=')
  })

  //   it('authorizes the access token supplied by DNSimple', async () => {
  //     const wrapper = await mountApp('/auth?code=AUTHCODE')
  //
  //     expect(wrapper.text()).toMatch('Search...')
  //   })

//   it('shows an error if the user is not authenticated with DNSimple', async () => {
//     const wrapper = await mountApp('/auth?error_description=Error')
//
//     expect(wrapper.findAll('[aria-label="Unauthorized"]').length).toEqual(1)
//   })
})

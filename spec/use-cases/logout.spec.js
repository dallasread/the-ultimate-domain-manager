import { nextTick } from 'vue'
import { mountApp } from '../../spec/helper.js'

describe('Log out', () => {
  it('redirects to the domains page', async () => {
    const dnsimpleAdapter = { user: {}, authenticate () { return Promise.resolve() }, logout () { this.user = null; return Promise.resolve() } }
    const wrapper = await mountApp('/domains', dnsimpleAdapter)

    const button = wrapper.find('a[aria-label="Log out"]')
    await button.trigger('click')
    await nextTick()

    expect(wrapper.vm.$router.push).toHaveBeenCalledWith('/')
  })

  it('resets the keychain', async () => {
    const dnsimpleAdapter = { user: {}, authenticate () { return Promise.resolve() }, logout () { this.user = null; return Promise.resolve() } }
    const wrapper = await mountApp('/domains', dnsimpleAdapter)

    const button = wrapper.find('a[aria-label="Log out"]')
    await button.trigger('click')
    await nextTick()

    expect(dnsimpleAdapter.user).toEqual(null)
  })

  it('redirects if already logged out', async () => {
    const dnsimpleAdapter = { authenticate () { return Promise.reject() } }
    const wrapper = await mountApp('/domains', dnsimpleAdapter)

    expect(wrapper.findAll('a[aria-label="Log out"]').length).toEqual(0)
    expect(wrapper.vm.$router.push).toHaveBeenCalledWith('/')
  })

//   it('redirects to the log in page', async () => {
//     const wrapper = await mountApp('/auth?code=AUTHCODE')
//
//     expect(wrapper.vm.$router.push).toHaveBeenCalledWith('/domains')
//   })
//
//   it('removes the authentication cookie', async () => {
//     const wrapper = await mountApp('/auth?code=AUTHCODE')
//
//     expect(wrapper.vm.$router.push).toHaveBeenCalledWith('/domains')
//   })
})

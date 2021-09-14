import { mountApp, flushPromises } from '../../spec/helper.js'

describe('Log out', () => {
  it('redirects to the domains page', async () => {
    const dnsimpleAdapter = {
      user: {},
      authenticate () { return Promise.resolve() },
      listDomains () { return Promise.resolve() },
      logout () { return Promise.resolve() }
    }
    const wrapper = await mountApp('/domains', dnsimpleAdapter)

    const button = wrapper.find('a[aria-label="Log out"]')
    await button.trigger('click')
    await flushPromises()

    expect(wrapper.vm.$router.push).toHaveBeenCalledWith('/')
  })

  it('redirects if already logged out', async () => {
    const dnsimpleAdapter = {
      authenticate () { return Promise.reject() },
      listDomains () { return Promise.resolve() },
      logout () { return Promise.resolve() }
    }
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

import { mountApp, flushPromises } from './helper.js'

describe('Log out', () => {
  it('redirects to the login page', async () => {
    const app = await mountApp('/domains')

    await app.find('a[aria-label="Log out"]').trigger('click')
    await flushPromises()

    expect(app.findAll('[aria-label="Connect via DNSimple"]').length).toEqual(1)
  })

  it('redirects to login page if already logged out', async () => {
    const dnsimpleAdapter = {
      authenticate () { return Promise.reject() },
      listDomains () { return Promise.resolve() },
      logout () { return Promise.resolve() }
    }
    const app = await mountApp('/domains', dnsimpleAdapter)

    expect(app.findAll('a[aria-label="Log out"]').length).toEqual(0)
    expect(app.findAll('[aria-label="Connect via DNSimple"]').length).toEqual(1)
  })

//   it('redirects to the log in page', async () => {
//     const app = await mountApp('/auth?code=AUTHCODE')
//
//     expect(app.vm.$router.push).toHaveBeenCalledWith('/domains')
//   })
//
//   it('removes the authentication cookie', async () => {
//     const app = await mountApp('/auth?code=AUTHCODE')
//
//     expect(app.vm.$router.push).toHaveBeenCalledWith('/domains')
//   })
})

import { mountApp } from '../helper.js'

describe('Auth: Log out', () => {
  it('redirects to the login page', async () => {
    const app = await mountApp('/domains', {
      state: {
        domains: [{ name: 'example.com' }],
        accounts: [{ accessToken: 'abc-123' }]
      }
    })

    await app.click('a[aria-label="Log out"]')

    expect(app.findAll('[aria-label="Connect via DNSimple"]').length).toEqual(1)
  })

  it('redirects to login page if already logged out', async () => {
    const app = await mountApp('/domains', {
      dnsimpleAdapter: {
        fetchUser (account) { return Promise.reject(new Error('Unauthorized')) }
      }
    })

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

import { nextTick } from 'vue'
import { mountApp } from '../../spec/helper.js'

describe('See my domains', () => {
  it('displays a list of my domains', async () => {
    const expectedDomain = 'example.com'
    const dnsimpleAdapter = {
      authenticate () { return Promise.resolve() },
      listDomains () {
        return Promise.resolve({
          domains: [{
            id: 181984,
            account_id: 1385,
            registrant_id: 2715,
            name: expectedDomain,
            unicode_name: expectedDomain,
            state: 'registered',
            auto_renew: false,
            private_whois: false,
            expires_on: '2021-06-05',
            expires_at: '2021-06-05T02:15:00Z',
            created_at: '2020-06-04T19:15:14Z',
            updated_at: '2020-06-04T19:15:21Z'
          }]
        })
      }
    }
    const wrapper = await mountApp('/domains', dnsimpleAdapter)
    await nextTick()
    await nextTick()

    expect(wrapper.text()).toContain(expectedDomain)
  })

//   it('can search the domains', async () => {
//     const dnsimpleAdapter = { authenticate () { return Promise.reject() } }
//     const wrapper = await mountApp('/', dnsimpleAdapter)
//
//     const button = wrapper.find('a[aria-label="Connect via DNSimple"]')
//     expect(button.text()).toEqual('Connect via DNSimple')
//   })
})

import { nextTick } from 'vue'
import { mountApp } from '../../spec/helper.js'

const dnsimpleAdapter = {
  authenticate () { return Promise.resolve() },
  listDomains () {
    return Promise.resolve({
      domains: [
        { id: 181984, account_id: 1385, registrant_id: 2715, name: 'example.com', unicode_name: 'example.com', state: 'registered', auto_renew: false, private_whois: false, expires_on: '2021-06-05', expires_at: '2021-06-05T02:15:00Z', created_at: '2020-06-04T19:15:14Z', updated_at: '2020-06-04T19:15:21Z' },
        { id: 181984, account_id: 1385, registrant_id: 2715, name: 'foo-bar.com', unicode_name: 'foo-bar.com', state: 'registered', auto_renew: false, private_whois: false, expires_on: '2021-06-05', expires_at: '2021-06-05T02:15:00Z', created_at: '2020-06-04T19:15:14Z', updated_at: '2020-06-04T19:15:21Z' }
      ]
    })
  }
}

describe('See my domains', () => {
  it('displays a list of my domains', async () => {
    const wrapper = await mountApp('/domains', dnsimpleAdapter)
    await nextTick()
    await nextTick()

    expect(wrapper.text()).toContain('example.com')
  })

  it('can search the domains', async () => {
    const wrapper = await mountApp('/domains', dnsimpleAdapter)
    await nextTick()
    await nextTick()

    const input = wrapper.find('input[aria-label="Domain search"]')
    await input.setValue('example')

    expect(wrapper.findAll('[aria-label^="Manage"]').length).toEqual(1)
    expect(wrapper.find('[aria-label="Manage example.com"]').text()).toEqual('Go')
  })
})

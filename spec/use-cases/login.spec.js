import { mountApp } from '../../spec/helper.js'
import App from '@/components/App/component.vue'

describe('Log in', () => {
  it('can successfully log in to a DNSimple account', async () => {
    const wrapper = await mountApp('/')
    expect(wrapper.text()).toMatch('Welcome')
  })
})

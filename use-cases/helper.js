import { mount, flushPromises } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import App from '@/components/app/component.vue'
import DNSimpleAdapter from '@/lib/dnsimple-adapter'
import { routes } from '@/router'

class FakeDNSimpleAdapter extends DNSimpleAdapter {
  _fetcher (method, url) {
    // console.log(method, url)
    return Promise.resolve({})
  }
}

window.document = {}

const mountApp = async (path, state, dnsimpleAdapter) => {
  const router = createRouter({
    history: createMemoryHistory(),
    routes
  })

  router.push(path || '/')
  await router.isReady()

  const fakeDNSimpleAdapter = new FakeDNSimpleAdapter()

  for (const key in dnsimpleAdapter) {
    fakeDNSimpleAdapter[key] = dnsimpleAdapter[key]
  }

  const app = await mount(App, {
    global: {
      plugins: [router]
    },
    propsData: {
      _state: state,
      _dnsimpleAdapter: fakeDNSimpleAdapter
    }
  })

  await flushPromises()

  return app
}

export {
  flushPromises,
  mountApp
}

import { mount, flushPromises } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import App from '@/app/component.vue'
import DNSimpleAdapter from '@/adapters/dnsimple.js'
import ZoneVisionAdapter from '@/adapters/zone-vision.js'
import LocalCacheAdapter from '@/adapters/local-cache.js'
import State from '@/state/index.js'
import { routes } from '@/app/router'

class FakeDNSimpleAdapter extends DNSimpleAdapter {
  _fetcher (method, url) {
    // console.log(method, url)
    return Promise.resolve({})
  }
}

class FakeZoneVisionAdapter extends ZoneVisionAdapter {
  fetchNameServers () {
    return Promise.resolve([])
  }
}

const mountApp = async (path, options) => {
  options = options || {}

  const localCacheAdapter = new LocalCacheAdapter()

  await localCacheAdapter.reset()

  if (options.localCacheAdapterData) {
    await localCacheAdapter.save(options.localCacheAdapterData)
  }

  const router = createRouter({
    history: createMemoryHistory(),
    routes
  })

  router.push(path || '/')
  await router.isReady()

  const fakeDNSimpleAdapter = new FakeDNSimpleAdapter()

  if (options.dnsimpleAdapter) {
    for (const key in options.dnsimpleAdapter) {
      fakeDNSimpleAdapter[key] = options.dnsimpleAdapter[key]
    }
  }

  const fakeZoneVisionAdapter = new FakeZoneVisionAdapter()

  fakeZoneVisionAdapter._fetch = () => Promise.resolve({})

  if (options.zoneVisionAdapter) {
    for (const key in options.zoneVisionAdapter) {
      fakeZoneVisionAdapter[key] = options.zoneVisionAdapter[key]
    }
  }

  const app = await mount(App, {
    global: {
      plugins: [router]
    },
    propsData: {
      state: new State(options.state || { accounts: [], domains: [], records: [] }),
      dnsimpleAdapter: fakeDNSimpleAdapter,
      zoneVisionAdapter: fakeZoneVisionAdapter
    }
  })

  app.click = async (el) => {
    const $el = await app.find(el)
    await $el.trigger('click')
    await app.wait()
  }

  app.submit = async (el) => {
    const $el = await app.find(el)
    await $el.trigger('submit')
    await app.wait()
  }

  jest.useFakeTimers()

  app.wait = async () => {
    jest.runAllTimers()
    return flushPromises()
  }

  await app.wait()

  return app
}

export {
  mountApp
}

import { mount, flushPromises } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import App from '@/components/app/component.vue'
import DNSimpleAdapter from '@/lib/adapters/dnsimple.js'
import ZoneVisionAdapter from '@/lib/adapters/zone-vision.js'
import LocalCacheAdapter from '@/lib/adapters/local-cache.js'
import State from '@/lib/state.js'
import { routes } from '@/router'

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

const mountApp = async (path, state, dnsimpleAdapter, localCacheAdapterData, zoneVisionAdapter) => {
  const localCacheAdapter = new LocalCacheAdapter()

  await localCacheAdapter.reset()

  if (localCacheAdapterData) {
    await localCacheAdapter.save(localCacheAdapterData)
  }

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

  const fakeZoneVisionAdapter = new FakeZoneVisionAdapter()

  fakeZoneVisionAdapter._fetch = () => Promise.resolve({})

  for (const key in zoneVisionAdapter) {
    fakeZoneVisionAdapter[key] = zoneVisionAdapter[key]
  }

  const app = await mount(App, {
    global: {
      plugins: [router]
    },
    propsData: {
      state: new State(state || { accounts: [], domains: [], records: [] }),
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

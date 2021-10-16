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

  app.wait = async () => {
    await flushPromises()
  }

  await app.wait()

  return app
}

export {
  mountApp
}

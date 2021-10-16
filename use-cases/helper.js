import { mount, flushPromises } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import App from '@/components/app/component.vue'
import Queries from '@/lib/queries.js'
import Commands from '@/lib/commands.js'
import { routes } from '@/router'

window.document = {}

const mountApp = async (path, dnsimpleAdapter) => {
  const router = createRouter({
    history: createMemoryHistory(),
    routes
  })

  router.push(path || '/')
  await router.isReady()

  const app = await mount(App, {
    global: {
      plugins: [router]
    },
    propsData: {
      _dnsimpleAdapter: dnsimpleAdapter
    }
  })

  await flushPromises()

  return app
}

export {
  flushPromises,
  mountApp
}

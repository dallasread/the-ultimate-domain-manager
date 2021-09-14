import { mount, flushPromises } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import App from '@/components/app/component.vue'
import { routes } from '@/router'

window.document = {}

class DNSimpleAPI {
  authorize () {
    return Promise.resolve()
  }
}

const mountApp = async (path, dnsimpleAPI) => {
  const router = createRouter({
    history: createMemoryHistory(),
    routes
  })
  router.push(path || '/')
  await router.isReady()

  const app = await mount(App, {
    global: {
      plugins: [router],
      mocks: {
        $router: { push: jest.fn() }
      }
    },
    data () {
      return {
        api: dnsimpleAPI || new DNSimpleAPI()
      }
    }
  })

  return app
}

export {
  flushPromises,
  mountApp
}

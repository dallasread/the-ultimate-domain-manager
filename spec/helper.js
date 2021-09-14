import { mount, flushPromises } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import App from '@/components/app/component.vue'
import { routes } from '@/router'

window.document = {}

const mountApp = async (path) => {
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
        // $router: { push: jest.fn() }
      }
    }
  })

  return app
}

export {
  flushPromises,
  mountApp
}

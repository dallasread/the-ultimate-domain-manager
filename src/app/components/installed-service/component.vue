<template>
  <a
    href="javascript:;"
    :aria-label="'Manage Service ' + service.id"
    :class="`service block with-padding ${isOpen ? 'open' : ''}`"
    @click="toggle"
  >
    <div class="img-wrapper">
      <img :src="`data:image/png;base64,${service.logo}`">
    </div>
    <div
      v-if="isOpen"
      class="table-wrapper"
    >
      <table class="table fadeIn">
        <thead>
          <tr>
            <th>Name</th>
            <th>TTL</th>
            <th>Type</th>
            <th>Target</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="record in service.domainRecords"
            :key="`${domain.id}-${record.id}`"
          >
            <td>
              <span class="purple">{{ record.name }}.{{ domain.name }}.</span>
            </td>
            <td>
              {{ record.ttl }}
            </td>
            <td>
              {{ record.type }}
            </td>
            <td>
              <span class="purple">{{ record.content }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div
      v-else
      class="meta"
    >
      <span
        aria-label="Summary"
      >{{ service.summary }}</span>
      <!-- <svg
        class="arrow"
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      ><path d="M4.555 5.168A1 1 0 003 6v8a1 1 0 001.555.832L10 11.202V14a1 1 0 001.555.832l6-4a1 1 0 000-1.664l-6-4A1 1 0 0010 6v2.798l-5.445-3.63z" /></svg> -->
    </div>
  </a>
</template>

<script>
export default {
  props: {
    domain: {
      type: Object,
      default: () => {}
    },
    service: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      isOpen: false
    }
  },
  methods: {
    toggle () {
      this.isOpen = !this.isOpen
    }
  }
}
</script>

import { execSync } from 'child_process'
import { readFileSync, readdirSync, writeFileSync } from 'fs'

const DNSIMPLE_SERVICES_TMP_PATH = 'tmp/dnsimple-services'
const DNSIMPLE_SERVICES_VENDOR_PATH = 'src/vendor/dnsimple-services.json'

const getDirectories = (source) => {
  return readdirSync(source, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)
}

function base64Encode (file) {
  const bitmap = readFileSync(file)
  return new Buffer(bitmap).toString('base64')
}

const run = () => {
  console.log(`Emptying ${DNSIMPLE_SERVICES_TMP_PATH}...`)
  execSync(`rm -rf ${DNSIMPLE_SERVICES_TMP_PATH}`)

  console.log('Cloning "dnsimple-services"...')
  execSync(`git clone git@github.com:dnsimple/dnsimple-services.git ${DNSIMPLE_SERVICES_TMP_PATH}`)

  console.log('Finding services...')
  const serviceName = getDirectories(`${DNSIMPLE_SERVICES_TMP_PATH}/services`)
  const services = []

  serviceName.forEach((serviceName) => {
    console.log(`Importing ${serviceName}...`)

    const data = JSON.parse(readFileSync(`${DNSIMPLE_SERVICES_TMP_PATH}/services/${serviceName}/config.json`))

    if (data.config.deprecated) {
      return
    }

    const service = data.config

    service.records = data.records
    service.logo = base64Encode(`${DNSIMPLE_SERVICES_TMP_PATH}/services/${serviceName}/logo.png`)

    services.push(service)
  })

  writeFileSync(DNSIMPLE_SERVICES_VENDOR_PATH, JSON.stringify(services, null, 4))
  console.log('Done!')
}

run()

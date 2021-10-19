const serviceWildcardRatio = (service) => {
  return (
    (service.records.filter((r) => r.content.slice(-2) === '}}').length * 2) +
    service.records.filter((r) => r.content.slice(0, 2) === '{{').length
  ) / service.records.length
}

const includesAny = (str, arr) => {
  return arr.filter((item) => str.indexOf(item) !== -1).length
}

const recordsMatchServiceName = (service, domainRecords) => {
  return domainRecords.filter((domainRecord) => {
    const serviceNames = service.name.split('-').filter((str) => str.length > 2).map((str) => str.toLowerCase())
    const domainRecordName = domainRecord.name.toLowerCase()
    const domainRecordContent = domainRecord.content.toLowerCase()

    return includesAny(domainRecordName, serviceNames) || includesAny(domainRecordContent, serviceNames)
  }).length
}

const SORT_BY_RECORD_NAME_MATCHABILTIY = (domainRecords) => {
  return (a, b) => {
    if (recordsMatchServiceName(a, domainRecords) && !recordsMatchServiceName(b, domainRecords)) return -1
    if (!recordsMatchServiceName(a, domainRecords) && recordsMatchServiceName(b, domainRecords)) return 1
    return 0
  }
}

const SORT_BY_WILDNESS = (a, b) => {
  if (serviceWildcardRatio(a) > serviceWildcardRatio(b)) return 1
  if (serviceWildcardRatio(a) < serviceWildcardRatio(b)) return -1

  if (a.records.length > b.records.length) return -1
  if (a.records.length < b.records.length) return 1

  return 0
}

class ServiceIdentifier {
  constructor (services) {
    this.services = services
  }

  parse (domainRecords) {
    const identified = []
    const usedRecords = []
    const services = [].concat(this.services)
      .sort(SORT_BY_WILDNESS)
      .sort(SORT_BY_RECORD_NAME_MATCHABILTIY(domainRecords))

    for (let i = 0; i < services.length; i++) {
      const service = services[i]
      const recordsForService = []

      service.records.forEach((serviceRecord) => {
        const foundDomainRecord = this._findDomainRecordForServiceRecord(
          serviceRecord,
          domainRecords.filter((r) => usedRecords.map((r) => r.id).indexOf(r.id) === -1),
          service['default-subdomain']
        )

        if (foundDomainRecord) {
          recordsForService.push(foundDomainRecord)
        }
      })

      if (recordsForService.length === service.records.length) {
        usedRecords.push.apply(usedRecords, recordsForService)

        identified.push({
          name: service.name,
          logo: service.logo,
          summary: this._description(recordsForService)
        })

        i--
      }
    }

    return identified
  }

  _findDomainRecordForServiceRecord (serviceRecord, domainRecords, defaultSubdomain) {
    for (var i = 0; i < domainRecords.length; i++) {
      const domainRecord = domainRecords[i]

      if (this._isDomainRecordForServiceRecord(domainRecord, serviceRecord, defaultSubdomain)) {
        return domainRecord
      }
    }
  }

  _isDomainRecordForServiceRecord (domainRecord, serviceRecord, defaultSubdomain) {
    if (domainRecord.type !== serviceRecord.type) {
      return false
    }

    if (domainRecord.ttl !== serviceRecord.ttl) {
      return false
    }

    if (serviceRecord.prio && domainRecord.priority !== serviceRecord.prio) {
      return false
    }

    const expectedServiceRecordName = serviceRecord.name || defaultSubdomain || ''

    if (!expectedServiceRecordName || !domainRecord.name) {
      if (expectedServiceRecordName || domainRecord.name !== '') {
        return false
      }
    } else if (expectedServiceRecordName.indexOf('*') !== -1) {
      if (!domainRecord.name.length) {
        return false
      }
    } else {
      serviceRecord.nameMatcher = serviceRecord.nameMatcher || new RegExp(expectedServiceRecordName.replace(/{{.+}}/, '.+'))

      if (!serviceRecord.nameMatcher.exec(domainRecord.name)) {
        return false
      }
    }

    serviceRecord.contentMatcher = serviceRecord.contentMatcher || new RegExp(serviceRecord.content.replace(/{{.+}}/, '.+'))

    return serviceRecord.contentMatcher.exec(domainRecord.content)
  }

  _description (records) {
    if (records.length === 1) {
      return records[0].content
    }

    return `${records.length} records`
  }
}

export default ServiceIdentifier

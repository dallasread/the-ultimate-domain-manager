const serviceWildcardRatio = (service) => {
  return (
    (service.records.filter((r) => r.content.slice(-2) === '}}').length * 2) +
    service.records.filter((r) => r.content.slice(0, 2) === '{{').length
  ) / service.records.length
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

    this.services.sort(SORT_BY_WILDNESS).forEach((service) => {
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
      }
    })

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

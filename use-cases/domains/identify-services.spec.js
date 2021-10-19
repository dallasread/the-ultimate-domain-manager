import ServiceIdentifier from '@/lib/service-identifier.js'

describe('Domains: Identify services', () => {
  it('finds services based on simple matching name/content/type', () => {
    const subject = new ServiceIdentifier([{
      name: 'amazon-elasticbeanstalk',
      label: 'AWS Elastic Beanstalk',
      description: 'Amazon Elastic Beanstalk is an easy way for you to quickly deploy and manage applications in the AWS cloud',
      category: 'infrastructure',
      records: [
        {
          name: 'my',
          type: 'CNAME',
          content: 'my.elasticbeanstalk.com',
          ttl: 3600
        }
      ],
      logo: '...'
    }])

    expect(subject.parse([
      {
        id: 69061,
        zone_id: 'example.com',
        parent_id: null,
        name: 'my',
        content: 'my.elasticbeanstalk.com',
        ttl: 3600,
        priority: null,
        type: 'CNAME',
        regions: [
          'global'
        ],
        system_record: true,
        created_at: '2016-03-22T10:20:53Z',
        updated_at: '2016-03-22T10:20:53Z'
      }
    ])).toEqual([
      {
        name: 'amazon-elasticbeanstalk',
        logo: '...',
        summary: 'my.elasticbeanstalk.com'
      }
    ])
  })

  it('does not find a service based on differing name', () => {
    const subject = new ServiceIdentifier([{
      name: 'amazon-elasticbeanstalk',
      label: 'AWS Elastic Beanstalk',
      description: 'Amazon Elastic Beanstalk is an easy way for you to quickly deploy and manage applications in the AWS cloud',
      category: 'infrastructure',
      records: [
        {
          name: 'my',
          type: 'CNAME',
          content: 'my.elasticbeanstalk.com',
          ttl: 3600
        }
      ],
      logo: '...'
    }])

    expect(subject.parse([
      {
        id: 69061,
        zone_id: 'example.com',
        parent_id: null,
        name: 'NOMATCH',
        content: 'my.elasticbeanstalk.com',
        ttl: 3600,
        priority: null,
        type: 'CNAME',
        regions: [
          'global'
        ],
        system_record: true,
        created_at: '2016-03-22T10:20:53Z',
        updated_at: '2016-03-22T10:20:53Z'
      }
    ])).toEqual([])
  })

  it('does not find a service based on differing content', () => {
    const subject = new ServiceIdentifier([{
      name: 'amazon-elasticbeanstalk',
      label: 'AWS Elastic Beanstalk',
      description: 'Amazon Elastic Beanstalk is an easy way for you to quickly deploy and manage applications in the AWS cloud',
      category: 'infrastructure',
      records: [
        {
          name: 'my',
          type: 'CNAME',
          content: 'my.elasticbeanstalk.com',
          ttl: 3600
        }
      ],
      logo: '...'
    }])

    expect(subject.parse([
      {
        id: 69061,
        zone_id: 'example.com',
        parent_id: null,
        name: 'my',
        content: 'NOMATCH.elasticbeanstalk.com',
        ttl: 3600,
        priority: null,
        type: 'CNAME',
        regions: [
          'global'
        ],
        system_record: true,
        created_at: '2016-03-22T10:20:53Z',
        updated_at: '2016-03-22T10:20:53Z'
      }
    ])).toEqual([])
  })

  it('does not find a service based on differing type', () => {
    const subject = new ServiceIdentifier([{
      name: 'amazon-elasticbeanstalk',
      label: 'AWS Elastic Beanstalk',
      description: 'Amazon Elastic Beanstalk is an easy way for you to quickly deploy and manage applications in the AWS cloud',
      category: 'infrastructure',
      records: [
        {
          name: 'my',
          type: 'CNAME',
          content: 'my.elasticbeanstalk.com',
          ttl: 3600
        }
      ],
      logo: '...'
    }])

    expect(subject.parse([
      {
        id: 69061,
        zone_id: 'example.com',
        parent_id: null,
        name: 'my',
        content: 'my.elasticbeanstalk.com',
        ttl: 3600,
        priority: null,
        type: 'A',
        regions: [
          'global'
        ],
        system_record: true,
        created_at: '2016-03-22T10:20:53Z',
        updated_at: '2016-03-22T10:20:53Z'
      }
    ])).toEqual([])
  })

  it('finds services based on dynamic content', () => {
    const subject = new ServiceIdentifier([{
      name: 'amazon-elasticbeanstalk',
      label: 'AWS Elastic Beanstalk',
      description: 'Amazon Elastic Beanstalk is an easy way for you to quickly deploy and manage applications in the AWS cloud',
      category: 'infrastructure',
      records: [
        {
          name: 'my',
          type: 'CNAME',
          content: '{{site}}.elasticbeanstalk.com',
          ttl: 3600
        }
      ],
      logo: '...'
    }])

    expect(subject.parse([
      {
        id: 69061,
        zone_id: 'example.com',
        parent_id: null,
        name: 'my',
        content: 'my-app.elasticbeanstalk.com',
        ttl: 3600,
        priority: null,
        type: 'CNAME',
        regions: [
          'global'
        ],
        system_record: true,
        created_at: '2016-03-22T10:20:53Z',
        updated_at: '2016-03-22T10:20:53Z'
      }
    ])).toEqual([
      {
        name: 'amazon-elasticbeanstalk',
        logo: '...',
        summary: 'my-app.elasticbeanstalk.com'
      }
    ])
  })

  it('finds services based multiple records', () => {
    const subject = new ServiceIdentifier([{
      name: 'amazon-elasticbeanstalk',
      label: 'AWS Elastic Beanstalk',
      description: 'Amazon Elastic Beanstalk is an easy way for you to quickly deploy and manage applications in the AWS cloud',
      category: 'infrastructure',
      records: [
        {
          name: 'my',
          type: 'A',
          content: '1.1.1.1',
          ttl: 3600
        },
        {
          name: 'bob',
          type: 'CNAME',
          content: 'bob.elasticbeanstalk.com',
          ttl: 3600
        }
      ],
      logo: '...'
    }])

    expect(subject.parse([
      {
        id: 69062,
        zone_id: 'example.com',
        parent_id: null,
        name: 'my',
        content: '1.1.1.1',
        ttl: 3600,
        priority: null,
        type: 'A',
        regions: [
          'global'
        ],
        system_record: true,
        created_at: '2016-03-22T10:20:53Z',
        updated_at: '2016-03-22T10:20:53Z'
      },
      {
        id: 69061,
        zone_id: 'example.com',
        parent_id: null,
        name: 'bob',
        content: 'bob.elasticbeanstalk.com',
        ttl: 3600,
        priority: null,
        type: 'CNAME',
        regions: [
          'global'
        ],
        system_record: true,
        created_at: '2016-03-22T10:20:53Z',
        updated_at: '2016-03-22T10:20:53Z'
      }
    ])).toEqual([
      {
        name: 'amazon-elasticbeanstalk',
        logo: '...',
        summary: '2 records'
      }
    ])
  })

  it('finds services on an apex', () => {
    const subject = new ServiceIdentifier([{
      name: 'amazon-elasticbeanstalk',
      label: 'AWS Elastic Beanstalk',
      description: 'Amazon Elastic Beanstalk is an easy way for you to quickly deploy and manage applications in the AWS cloud',
      category: 'infrastructure',
      records: [
        {
          name: '',
          type: 'ALIAS',
          content: 'my-app.elasticbeanstalk.com',
          ttl: 3600
        }
      ],
      logo: '...'
    }])

    expect(subject.parse([
      {
        id: 69061,
        zone_id: 'example.com',
        parent_id: null,
        name: '',
        content: 'my-app.elasticbeanstalk.com',
        ttl: 3600,
        priority: null,
        type: 'ALIAS',
        regions: [
          'global'
        ],
        system_record: true,
        created_at: '2016-03-22T10:20:53Z',
        updated_at: '2016-03-22T10:20:53Z'
      }
    ])).toEqual([
      {
        name: 'amazon-elasticbeanstalk',
        logo: '...',
        summary: 'my-app.elasticbeanstalk.com'
      }
    ])
  })

  it('finds services based on a default-subdomain', () => {
    const subject = new ServiceIdentifier([{
      name: 'amazon-elasticbeanstalk',
      label: 'AWS Elastic Beanstalk',
      description: 'Amazon Elastic Beanstalk is an easy way for you to quickly deploy and manage applications in the AWS cloud',
      category: 'infrastructure',
      'default-subdomain': 'blog',
      records: [
        {
          type: 'CNAME',
          content: 'blog.elasticbeanstalk.com',
          ttl: 3600
        }
      ],
      logo: '...'
    }])

    expect(subject.parse([
      {
        id: 69061,
        zone_id: 'example.com',
        parent_id: null,
        name: 'blog',
        content: 'blog.elasticbeanstalk.com',
        ttl: 3600,
        priority: null,
        type: 'CNAME',
        regions: [
          'global'
        ],
        system_record: true,
        created_at: '2016-03-22T10:20:53Z',
        updated_at: '2016-03-22T10:20:53Z'
      }
    ])).toEqual([
      {
        name: 'amazon-elasticbeanstalk',
        logo: '...',
        summary: 'blog.elasticbeanstalk.com'
      }
    ])
  })

  it.todo('finds the same service multiple times')
  it.todo('finds services that have records with the service name in them')
})

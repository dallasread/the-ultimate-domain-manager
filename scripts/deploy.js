/* eslint-disable no-console */
const execa = require('execa')
const fs = require('fs')
const changelog = require('../changelog.json')
const version = Object.keys(changelog)[0]

const deploy = async (target, version) => {
  try {
    await execa('git', ['checkout', '--orphan', 'gh-pages'])

    console.log('Building started...')

    await execa('npm', ['run', 'build'])
    await execa('cp', [target + '/index.html', target + '/404.html'])

    await execa('git', ['--work-tree', target, 'add', '--all'])
    await execa('git', ['--work-tree', target, 'commit', '-m', `Publish ${version}`])

    console.log('Pushing to gh-pages...')

    await execa('git', ['push', 'origin', 'HEAD:gh-pages', '--force'])
    await execa('rm', ['-r', target])
    await execa('rm', ['-rf', '.git/gc.log'])
    await execa('git', ['checkout', '-f', 'master'])
    await execa('git', ['branch', '-D', 'gh-pages'])

    console.log('Successfully deployed, check your settings')
  } catch (e) {
    console.log(e.message)
    process.exit(1)
  }
}

deploy('dist', `${version}: ${changelog[version]}`)

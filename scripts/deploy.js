/* eslint-disable no-console */

const execa = require('execa')
const fs = require('fs')
const deployBranch = 'gh-pages'
const masterBranch = 'master'

const refresh = async () => {
  console.log('🌱 Creating fresh branch...')

  await execa('git', ['checkout', '--orphan', deployBranch])
}

const build = async () => {
  console.log('🔨 Building...')

  await execa('npm', ['run', 'build'])
  await execa('git', ['--work-tree', 'dist', 'add', '--all'])
  await execa('git', ['--work-tree', 'dist', 'commit', '-m', deployBranch, '--no-verify'])
}

const push = async () => {
  console.log('🌏 Deploying...')

  await execa('git', ['push', 'origin', `HEAD:${deployBranch}`, '--force'])
  await execa('rm', ['-r', 'dist'])
  await execa('rm', ['-rf', '.git/gc.log'])
  await execa('git', ['checkout', '-f', masterBranch])
  await execa('git', ['branch', '-D', deployBranch])
}

const done = () => {
  console.log('✅ Deployed!')
}

Promise.resolve()
  .then(refresh)
  .then(build)
  .then(push)
  .then(done)
  .catch((e) => {
    console.log(e.message)
    process.exit(1)
  })

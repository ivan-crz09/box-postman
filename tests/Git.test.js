const cp = require('child_process')

jest.mock('child_process')

const Git = require('../src/Git')

describe('#constructor', () => {
  test('should accept a path', () => {
    const path = {
      folder: 'folder',
      branch: 'branch',
      source: 'source'
    }
    const git = new Git(path)

    expect(git.destination).toEqual(path.folder)
    expect(git.branch).toEqual(path.branch)
    expect(git.source).toEqual(path.source)
  })
})

describe('.pull', () => {
  test('should make a fresh pull', async () => {
    const path = {
      folder: 'destination',
      branch: 'branch',
      source: 'source'
    }

    console.log = jest.fn()

    const fs = {
      existsSync: () => false
    }

    cp.spawnSync.mockReturnValue({
      stderr: Buffer.alloc(0),
      stdout: Buffer.alloc(0)
    })

    const git = new Git(path, fs)
    await git.pull()

    expect(cp.spawnSync).toHaveBeenCalledWith('git', ['clone', '--depth', 1, '--branch', 'branch', 'source', 'destination'])
  })

  test('should override existing pulls', async () => {
    const path = {
      folder: 'destination',
      branch: 'branch',
      source: 'source'
    }

    const fs = {
      existsSync: () => true
    }

    cp.spawnSync.mockReturnValue({
      stderr: Buffer.alloc(0),
      stdout: Buffer.alloc(0)
    })

    const git = new Git(path, fs)
    await git.pull()

    expect(cp.spawnSync).toHaveBeenCalledWith('git', ['pull'], { cwd: 'destination' })
  })
})

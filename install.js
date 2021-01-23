const {promisify} = require('util')
const path = require('path');
const fs = require('fs')
const os = require('os')
const axios = require('axios').default
const tar = require('tar')
const { pipeline } = require('stream')

const rm = promisify(fs.rm)
const move = promisify(fs.rename)

const platform = os.platform()
const url = 'https://github.com/go-task/task/releases/latest/download/'
const binaries = {
   darwin: 'task_darwin_amd64.tar.gz',
   linux: 'task_linux_amd64.tar.gz',
   win32: 'task_windows_amd64.tar.gz'
}

const install = async () => {
  try {
      console.log('attempting to install taskfile.dev')
      const file = binaries[platform]
      const resp = await axios.request({
          url: url + file,
          method: 'get',
          responseType: 'stream'
      })

      pipeline(resp.data, fs.createWriteStream(file), async () => {
          await tar.x({
              file,
          })
          await rm(file)
          await move(path.join(__dirname, 'task'), path.join(__dirname, 'bin', 'task'))

      })
  } catch (error) {
        console.error(`failed to install taskfile.dev ${error}`)
  }
}

install().then(() => console.log('taskfile.dev installed successfully')).catch((err) => console.error(`failed to install ${err}`))
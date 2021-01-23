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
const url = 'https://github.com/k0kubun/sqldef/releases/latest/download/'
const binaries = {
   darwin: 'psqldef_darwin_amd64.tar.gz',
   linux: 'psqldef_linux_amd64.tar.gz',
   win32: 'psqldef_windows_amd64.tar.gz'
}

const install = async () => {
  try {
      console.log('attempting to install psqldef')
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
          await move(path.join(__dirname, 'psqldef'), path.join(__dirname, 'bin', 'psqldef'))

      })
  } catch (error) {
        console.error(`failed to install psqldef ${error}`)
  }
}

install().then(() => console.log('psqldef installed successfully')).catch((err) => console.error(`failed to install ${err}`))
const directory = '20190830'

const express = require('express')
const app = express()

const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}))

const compression = require('compression')
app.use(compression({
  threshold: 0,
  level: 9,
  memLevel: 9
}))

// CORSを許可する
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})

const showTime = () => {
  const time = new Date()
  const z = (v) => {
    const s = '00' + v
    return s.substr(s.length - 2, 2)
  }
  return time.getFullYear() + '/' + (time.getMonth() + 1) + '/' + time.getDate() + ' ' + z(time.getHours()) + ':' + z(time.getMinutes()) + ':' + z(time.getSeconds())
}

const path = require('path')
const NeDB = require('nedb')

const createDB = (id) => {
  return new NeDB({
    filename: path.join(__dirname, '/asset/database/' + directory + '/' + id + '.db'),
    autoload: true
  })
}

app.post('/api/zip', (req, res) => {
  const zip = req.body.zip
  console.log('[' + showTime() + '] /api/zip')
  if (zip.match(/^[0-9]{3}-?[0-9]{4}$/g)) {
    const zipCode = zip.replace(/-/g, '')
    createDB(zipCode.slice(0, -4)).findOne({zipCode}, (err, docs) => {
      return res.json({zip: docs, err: (err ? true : false)})
    })
  } else {
    return res.json({err: true})
  }
})

app.listen(3001)

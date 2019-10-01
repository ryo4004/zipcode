const fs = require('fs')
const path = require('path')
const NeDB = require('nedb')

const directory = '20190830'

console.time('search')

const zip = '9402023'

const createDB = (id) => {
  return new NeDB({
    filename: path.join(__dirname, '/database/' + directory + '/' + id + '.db'),
    autoload: true
  })
}

createDB(zip.slice(0,-4)).find({zip}, (err, docs) => {
  console.log(err, docs)
  console.timeEnd('search')
})

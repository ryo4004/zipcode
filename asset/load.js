const fs = require('fs')
const path = require('path')
const NeDB = require('nedb')

const zipDB = new NeDB({
  filename: path.join(__dirname, './database.db'),
  autoload: true
})

console.time('search')

zipDB.find({zip: '9402023'}, (err, docs) => {
  console.log(err, docs)
  console.timeEnd('search')
})

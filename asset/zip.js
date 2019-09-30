const fs = require('fs')
const path = require('path')
const NeDB = require('nedb')

// const tempDB = new NeDB({
//   filename: path.join(__dirname, './temp.db'),
//   autoload: true
// })

const directory = '20190830'

const zipCSV = fs.readFileSync('./' + directory + '/KEN_ALL.CSV', 'utf-8')

const zipline = zipCSV.split('\n')

const rem = (text) => text.slice(0,-1).slice(1)

const dbObject = {}

const createDB = (id) => {
  return new NeDB({
    filename: path.join(__dirname, '/zip/' + id + '.db'),
    autoload: true
  })
}

const setItem = (id, item) => {
  return new Promise((resolve, reject) => {
    const db = createDB(id)
    db.insert(item, () => {
      resolve()
    })
  })
}

const make = async () => {
  
  let count = 0
  let count2 = 0
  let pastZipCode = ''

  console.time('insert')

  for (let i = 0; i < zipline.length; i++) {

    const list = zipline[i].split(',')
    let address = ''
    const zipCode = rem(list[2])
    const place = rem(list[8])
  
    if (pastZipCode !== zipCode) {
      // update zip code
      pastZipCode = zipCode
  
      if (place.match(/[（）]/g)) {
        if (place.match(/）/g)) {
          if (place.match(/（/g)) {
            // "（ ）" あり
            address = rem(list[6]) + rem(list[7]) + place.replace(/（.*/g, '')
          } else {
            // "）" のみ
            // 使用しない
          }
        } else {
          // "（" ではじまり閉じかっこなし
          address = rem(list[6]) + rem(list[7]) + place.replace(/（.*/g, '')
        }
      } else {
        // 通常
        if (!place.match(/^[０-９]/g)) {
          if (!place.match(/第?[０-９]/g)) {
            address = rem(list[6]) + rem(list[7])
            + place.replace(/以下に掲載がない場合/g, '').replace(/の次に番地がくる場合/g, '')
          } else {
            // 岩手県和賀郡西和賀町
            // 岩手県九戸郡洋野町種市
            if (place.match(/、/g)) {
              address = rem(list[6]) + rem(list[7])
              + place.replace(/[０-９].*/g, '')
            } else if (place.match(/地割/g)) {
              address = rem(list[6]) + rem(list[7])
              + place.replace(/[０-９].*/g, '')
            } else {
              address = rem(list[6]) + rem(list[7])
              + place.replace(/以下に掲載がない場合/g, '').replace(/の次に番地がくる場合/g, '')
            }
          }
        } else {
          address = rem(list[6]) + rem(list[7])
          + place.replace(/以下に掲載がない場合/g, '').replace(/の次に番地がくる場合/g, '')
        }
      }
  
      if (address !== '') {
        const item = {zip: zipCode, address}
        await setItem(zipCode.slice(0,-4), item)
        // 160066.017ms
        // 195669.770ms
      } else {
        // console.log(rem(list[2]), rem(list[6]), rem(list[7]), rem(list[8]))
        console.log('a')
        count++
      }
  
    } else {
      count2++
    }

    if (i % 100 === 0) {
      console.log(' ', i, count2)
      count2 = 0
    } else {
      process.stdout.write('*')
    }

    if (zipline.length - 1 === i) {
      console.log('finish')
      console.timeEnd('insert')
      console.log(count)
    }
  }
}

make()
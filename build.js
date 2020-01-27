const axios = require('axios')
const fs = require('fs')
const _ = require('lodash')
const pinyin = require('pinyin')

const request = axios.create({
  baseURL: 'http://lab.isaaclin.cn/nCoV/'
})

request.get('/api/overall').then(data => {
  const result = JSON.stringify(data.data.results[0], null, 2)
  fs.writeFileSync('./src/data/overall.json', result)
})

request.get('/api/area').then(data => {
  const provinces = _.uniqBy(_.reverse(data.data.results), 'provinceName')
  const result = JSON.stringify(provinces.map(p => {
    return {
      ...p,
      provincePinyin: pinyin(p.provinceShortName)
    }
  }), null, 2)
  fs.writeFileSync('./src/data/area.json', result)
})
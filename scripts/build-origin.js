const axios = require('axios')

const papa = require('papaparse');
const fs = require('fs')


// const getCitiesByProvince = (name) => {
//   const provinceName = name.slice(0, 2)
//   const code = _.get(provinceByName, [provinceName, 'province'])
//   return citiesByProvince[code] || []
// }
//
// const loadCountries = async data => {
//   const countries = data
//     .match(/window.getListByCountryTypeService2 = (.*?)}catch/)[1]
//   fs.writeFileSync('./src/data/countries.json', countries)
// }
//
// const loadOverall = async data => {
//   const overall = data
//     .match(/window.getStatisticsService = (.*?)}catch/)[1]
//   fs.writeFileSync('./src/data/overall.json', overall)
// }
//
// const loadCityList = async data => {
//   const cityList = data
//     .match(/window.getAreaStat = (.*?)}catch/)[1]
//   const provinces = JSON.parse(cityList)
//   const result = JSON.stringify(provinces.map(p => {
//     if (p.provinceShortName === '陕西') {
//       p.pinyin = 'shanxi1'
//     } else if (p.provinceShortName === '重庆') {
//       p.pinyin = 'chongqing'
//     } else if (p.provinceShortName === '西藏') {
//       p.pinyin = 'xizang'
//     }
//     const cities = getCitiesByProvince(p.provinceName)
//     const citiesByName = _.keyBy(cities.reverse(), city => city.name.slice(0, 2))
//     return {
//       pinyin: pinyin(p.provinceShortName, {
//         style: pinyin.STYLE_NORMAL
//       }).map(x => x[0]).join(''),
//       name: p.provinceShortName,
//       ...p,
//       cities: p.cities.map(city => {
//         let fullCityName = city.cityName
//         const cityName = city.cityName.slice(0, 2)
//         if (citiesByName[cityName]) {
//           fullCityName = citiesByName[cityName].name
//         }
//         return {
//           ...city,
//           fullCityName
//         }
//       })
//     }
//   }), null, 2)
//   fs.writeFileSync('./src/data/area.json', result)
// }


// const loadCsv = async data => {
//   console.log(data)
// }
//
// let times = 0
// async function request () {
//   return axios.get("https://cors-anywhere.herokuapp.com/https://docs.google.com/spreadsheets/d/e/2PACX-1vTWq32Sh-nuY61nzNCYauMYbiOZhIE8TfnyRhu1hnVs-i-oLdOO65Ax0VHDtcctn44l7NEUhy7gHZUm/pub?output=csv").then(({ data: html }) => {
//     return Promise.all([
//       loadCsv(html)
//     ])
//   }).catch(e => {
//     console.log('Retry')
//     if (times++ > 1) {
//       throw e
//     }
//     return request()
//   })
// }
//
// request().catch(e => {
//   console.log(e)
//   process.exit(1)
// })
//

let url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTWq32Sh-nuY61nzNCYauMYbiOZhIE8TfnyRhu1hnVs-i-oLdOO65Ax0VHDtcctn44l7NEUhy7gHZUm/pub?output=csv"

let webdriver = require("selenium-webdriver");
const {Builder, By, Key, until} = require('selenium-webdriver');
const firefox = require('selenium-webdriver/firefox');
require("geckodriver");// Application Server
let options = new firefox.Options().addArguments('--headless');
(async function example() {
    let driver = await new Builder().forBrowser('chrome').build();
    try {
        await driver.get(url)
        console.log(driver.getPageSource() )
    } finally {
        await driver.quit();
    }
})();
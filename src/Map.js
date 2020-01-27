import React from 'react'
import ReactEcharts from 'echarts-for-react'
import provinces from './data/area.json'
import { keyBy } from 'lodash'

const provincesByName = keyBy(provinces, 'provinceShortName')

require('echarts/map/js/china.js')

function Map () {
  const getOption = (province) => {
    const data = !province ? provinces.map(p => ({
      name: p.provinceShortName,
      value: p.confirmedCount
    })) : provincesByName[province || '山西'].cities.map(city => ({
      name: city.cityName,
      value: city.confirmedCount
    }))
    return {
      visualMap: {
        show: true,
        type: 'piecewise',
        min: 0,
        max: 2000,
        align: 'right',
        top: 'middle',
        right: 0,
        inRange: {
          color: [
            '#f57d7d',
            '#9c0505'
          ]
        },
        pieces: [
          {min: 1000},
          {min: 500, max: 999},
          {min: 100, max: 499},
          {min: 10, max: 99},
          {min: 1, max: 9},
        ],
        // "inverse": false,
        // "splitNumber": 5,
        // "orient": "vertical",
        showLabel: true,
        itemWidth: 10,
        itemHeight: 10,
        // "borderWidth": 0
      },
      series: [{
        left: 10,
        type: 'map',
        name: '确诊人数',
        label: {
          show: true,
          position: 'top',
          margin: 8,
          fontSize: 5,
        },
        mapType: 'china',
        data,
        // zoom: 1,
        roam: false,
        showLegendSymbol: false,
        emphasis: {},
        rippleEffect: {
          show: true,
          brushType: 'stroke',
          scale: 2.5,
          period: 4
        }
      }]
    }
  }
  return (
    <ReactEcharts option={getOption()} />
  )
}

export default Map

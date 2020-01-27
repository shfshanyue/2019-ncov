import React from 'react'
import ReactEcharts from 'echarts-for-react'

import 'echarts/map/js/china.js'
import 'echarts/map/js/province/shanxi'

function Map ({ province, data }) {
  if (province) {
    require(`echarts/map/js/province/${province.pinyin}`)
  }

  const getOption = () => {
    return {
      visualMap: {
        show: true,
        type: 'piecewise',
        min: 0,
        max: 2000,
        align: 'right',
        top: province ? 0 : '40%',
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
        orient: province ? 'horizontal' : 'vertical',
        showLabel: true,
        itemWidth: 10,
        itemHeight: 10,
        textStyle: {
          fontSize: 10
        }
        // "borderWidth": 0
      },
      series: [{
        left: 'center',
        type: 'map',
        name: '确诊人数',
        silent: true,
        label: {
          show: true,
          position: 'inside',
          // margin: 8,
          fontSize: province ? 10 : 6,
        },
        mapType: province ? province.name : 'china',
        data,
        zoom: 1.2,
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
    <ReactEcharts option={getOption()} lazyUpdate={true} />
  )
}

export default Map

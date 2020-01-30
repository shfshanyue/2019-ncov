import React from 'react'
import ReactEcharts from 'echarts-for-react'

import 'echarts/map/js/china.js'

function Map ({ province, data, onClick }) {
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
        left: province ? 0 : 'auto',
        inRange: {
          color: [
            '#ffc0b1',
            '#ff8c71',
            '#ef1717',
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
        // silent: true,
        label: {
          show: true,
          position: 'inside',
          // margin: 8,
          fontSize: 6
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
    <ReactEcharts option={getOption()} lazyUpdate={true} onEvents={{
      click (e) {
        onClick(e.name)
      }
    }} />
  )
}

export default Map

import React, { useEffect, useState } from 'react'
import ReactEcharts from 'echarts-for-react/lib/core'
import echarts from 'echarts/lib/echarts'

import 'echarts/lib/chart/map'
import 'echarts/lib/component/visualMap'

function Map ({ province, data, onClick }) {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    if (province) {
      import(`echarts/map/json/province/${province.pinyin}.json`).then(map => {
        echarts.registerMap(province.pinyin, map.default)
        setLoading(false)
      })
    } else {
      import(`echarts/map/json/china.json`).then(map => {
        echarts.registerMap('china', map.default)
        setLoading(false)
      })
    }
  }, [province])

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
        padding: 5,
        // "inverse": false,
        // "splitNumber": 5,
        orient: province ? 'horizontal' : 'vertical',
        showLabel: province ? false : true,
        text: ['高', '低'],
        itemWidth: 10,
        itemHeight: 10,
        textStyle: {
          fontSize: 10
        }
        // "borderWidth": 0
      },
      series: [{
        left: 'center',
        // top: '15%',
        // bottom: '10%',
        type: 'map',
        name: '确诊人数',
        silent: province ? true : false,
        label: {
          show: true,
          position: 'inside',
          // margin: 8,
          fontSize: 6
        },
        mapType: province ? province.pinyin : 'china',
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
    loading ? <div className="loading">地图正在加载中...</div> :
    <ReactEcharts
      echarts={echarts}
      option={getOption()}
      lazyUpdate={true}
      onEvents={{
        click (e) {
          onClick(e.name)
        }
      }}
    />
  )
}

export default Map

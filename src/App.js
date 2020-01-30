import React, { useState, Suspense, useEffect } from 'react'
import keyBy from 'lodash.keyby'
import dayjs from 'dayjs'

import all from './data/overall'
import provinces from './data/area'

import Tag from './Tag'

import './App.css'

const Map = React.lazy(() => import('./Map'))

const provincesByName = keyBy(provinces, 'name')
const provincesByPinyin = keyBy(provinces, 'pinyin')

function App() {
  const [province, _setProvince] = useState(null)

  const setProvinceByUrl = () => {
    const p = window.location.pathname.slice(1)
    _setProvince(p ? provincesByPinyin[p] : null)
  }

  useEffect(() => {
    setProvinceByUrl()
    window.addEventListener('popstate', setProvinceByUrl)
    return () => {
      window.removeEventListener('popstate', setProvinceByUrl)
    }
  }, [])

  const setProvince = (p) => {
    _setProvince(p)
    window.history.pushState(null, null, p ? p.pinyin : '/')
  }

  const data = !province ? provinces.map(p => ({
    name: p.provinceShortName,
    value: p.confirmedCount
  })) : provincesByName[province.name].cities.map(city => ({
    name: city.fullCityName,
    value: city.confirmedCount
  }))

  const area = province ? provincesByName[province.name].cities : provinces
  const overall = province ? province : all

  const renderArea = () => {
    return area.map(x => (
      <div className="province" key={x.name || x.cityName} onClick={() => {
        // 表示在省一级
        if (x.name) {
          setProvince(x)
        }
      }}>
        <div className={`area ${x.name ? 'active' : ''}`}>
          { x.name || x.cityName }
        </div>
        <div className="confirmed">{ x.confirmedCount }</div>
        <div className="death">{ x.deadCount }</div>
        <div className="cured">{ x.curedCount }</div>
      </div>
    ))
  }

  return (
    <div>
      <header>
        <h1>
          <small>新型冠状病毒</small>
          <br />
          疫情实时动态 · { province ? province.name : '省市地图' }
        </h1>
        <i>By 山月 (数据来源于丁香园)</i>
      </header>
      <div className="card">
        <h2>
          统计 { province ? `· ${province.name}` : false }
          <span className="due">
            截止时间: {dayjs(all.modifyTime).format('YYYY-MM-DD HH:mm')}
          </span>
        </h2>
        <div>
          <div className="row">
            <Tag number={overall.confirmedCount}>
              确诊
            </Tag>
            <Tag number={overall.suspectedCount || '-'}>
              疑似
            </Tag>
          {/* </div>
          <div className="row"> */}
            <Tag number={overall.deadCount}>
              死亡
            </Tag>
            <Tag number={overall.curedCount}>
              治愈
            </Tag>
          </div>
        </div>
      </div>
      <div className="card">
        <h2>疫情地图 { province ? `· ${province.name}` : false }
        {
          province ? <small
            style={{
              color: '#f60',
              position: 'absolute',
              right: 0,
              top: '50%',
              transform: 'translateY(-50%)',
            }}
            onClick={() => setProvince(null)}
          >返回全国</small> : null
        }
        </h2>
        <Suspense fallback={<div className="loading">地图正在加载中...</div>}>
          <Map province={province} data={data} onClick={name => {
            const p = provincesByName[name]
            if (p) {
              setProvince(p)
            }
          }} />
        </Suspense>
        <div className="province header">
          <div className="area">地区</div>
          <div className="confirmed">确诊</div>
          <div className="death">死亡</div>
          <div className="cured">治愈</div>
        </div>
        { renderArea() }
      </div>
      <div className="card info">
        <h2>信息汇总</h2>
        <li>
          <a href="https://m.yangshipin.cn/static/2020/c0126.html">疫情24小时 | 与疫情赛跑</a>
        </li>
        <li><a href="http://2019ncov.nosugartech.com/">确诊患者同行查询工具</a></li>
        <li><a href="https://news.qq.com/zt2020/page/feiyan.htm">腾讯新闻新冠疫情实时动态</a></li>
        <li><a href="https://3g.dxy.cn/newh5/view/pneumonia">丁香园新冠疫情实时动态</a></li>
        <li><a href="https://vp.fact.qq.com/home">新型冠状病毒实时辟谣</a></li>
        <li><a href="https://promo.guahao.com/topic/pneumonia">微医抗击疫情实时救助</a></li>
      </div>
      <div className="fallback">
        <div>
          代码仓库: <a href="https://github.com/shfshanyue/2019-ncov">shfshanyue/2019-ncov</a>
        </div>
      </div>
    </div>
  );
}

export default App;

import React, { useState, Suspense, useEffect } from 'react'
import keyBy from 'lodash.keyby'
import dayjs from 'dayjs'
import 'dayjs/locale/en-au'
import relativeTime from 'dayjs/plugin/relativeTime'

import all from './data/overall'
import provinces from './data/area'

import Tag from './Tag'
import ReactGA from 'react-ga';
import './App.css'
import axios from 'axios'
import Papa from "papaparse";

dayjs.extend(relativeTime)


ReactGA.initialize('UA-160673543-1');
ReactGA.pageview(window.location.pathname + window.location.search);

const Map = React.lazy(() => import('./Map'))

const provincesByName = keyBy(provinces, 'name')
const provincesByPinyin = keyBy(provinces, 'pinyin')

const fetcher = (url) => axios(url).then(data => {
  return data.data.data
})

function New ({ title, summary, sourceUrl, pubDate, pubDateStr }) {
  return (
    <div className="new">
      <div className="new-date">
        <div className="relative">
          {dayjs(pubDate).locale('en-au').fromNow()}
        </div>
        {dayjs(pubDate).format('YYYY-MM-DD HH:mm')}
      </div>
      <a className="title" href={sourceUrl}>{ title }</a>
      <div className="summary">{ summary.slice(0, 100) }...</div>
    </div>
  )
}

function News ({ province }) {
  const [len, setLen] = useState(8)
  const [news, setNews] = useState([])

  useEffect(() => {
    fetcher(`https://file1.dxycdn.com/2020/0130/492/3393874921745912795-115.json?t=${46341925 + Math.random()}`).then(news => {
      setNews(news)
    })
  }, [])

  return (
    <div className="card">
      <h2>实时动态</h2>
      {
        news
          .filter(n => province ? province.provinceShortName === (n.provinceName && n.provinceName.slice(0, 2)) : true)
          .slice(0, len)
          .map(n => <New {...n} key={n.id} />)
      }
      <div className="more" onClick={() => { setLen() }}>点击查看全部动态</div>
    </div>
  )
}

function Summary () {
  return (
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
  )
}

function Stat ({ modifyTime, confirmedCount, suspectedCount, deadCount, curedCount, name, quanguoTrendChart, hbFeiHbTrendChart ,data}) {
    if(data){
        confirmedCount = 0;

        deadCount = 0;
        curedCount = 0;
        for (let i = 1; i < data.length; i++) {
            confirmedCount += parseInt(data[i][1])
            deadCount += parseInt(data[i][2])
            curedCount += parseInt(data[i][3])
    }}
    else
    {
        confirmedCount = 0;

        deadCount = 0;
        curedCount = 0;
    }


    return (

    <div className="card">
      <h2>
        Status {name ? `· ${name}` : false}
        {/*<span className="due">*/}
          {/*Updated Time: {dayjs(modifyTime).format('YYYY-MM-DD HH:mm')}*/}
        {/*</span>*/}
      </h2>
      <div className="row">
        <Tag number={confirmedCount}>
          Confirmed
        </Tag>
        {/*<Tag number={suspectedCount || '-'}>*/}
          {/*疑似*/}
        {/*</Tag>*/}
        <Tag number={deadCount}>
          Deaths
        </Tag>
        <Tag number={curedCount}>
          Recovered
        </Tag>
      </div>
      {/*<div>*/}
        {/*<img width="100%" src={quanguoTrendChart[0].imgUrl} alt="" />*/}
      {/*</div>*/}
      {/*<div>*/}
        {/*<img width="100%" src={hbFeiHbTrendChart[0].imgUrl} alt="" />*/}
      {/*</div>*/}
    </div>
  )
}

function Fallback () {
  return (
    <div className="fallback">
      <div>
        代码仓库: <a href="https://github.com/shfshanyue/2019-ncov">shfshanyue/2019-ncov</a>
      </div>
    </div>
  )
}

function Area ({ area, onChange,data }) {
  const renderArea = () => {
      let translate = {
          "NSW":"New South Wales",
          "ACT":"Australian Capital Territory",
          "NT":"Northern Territory",
          "WA":"Western Australia",
          "VIC":"Victoria",
          "QLD":"Queensland",
          "SA":"South Australia",
          "TAS":"Tasmania"
      };
    return data.map(x => (
      <div className="province" key={x.name || x.cityName} onClick={() => {
        // 表示在省一级
        // if (x.name) {
        //   onChange(x)
        // }
      }}>
        {/*<div className={`area ${x.name ? 'active' : ''}`}>*/}
          {/*{ x.name || x.cityName }*/}
        {/*</div>*/}
        {/*<div className="confirmed">{ x.confirmedCount }</div>*/}
        {/*<div className="death">{ x.deadCount }</div>*/}
        {/*<div className="cured">{ x.curedCount }</div>*/}
          <div className={"area"}>
              { translate[x[0]] }
          </div>
          <div className="confirmed">{ x[1] }</div>
          <div className="death">{ x[2] }</div>
          <div className="cured">{ x[3] }</div>
      </div>
    ))
  }

  return (
    <>
      <div className="province header">
        <div className="area">State</div>
        <div className="confirmed">Confirmed</div>
        <div className="death">Death</div>
        <div className="cured">Recovered</div>
      </div>
      { renderArea() }
    </>
  )
}

function Header ({ province }) {
  return (
    <header>
      <div className="bg"></div>
      <h1>
        <small>COVID-19</small>
        <br />
        Australia Status · { province ? province.name : 'State Details' }
      </h1>
      <i>By Monash Group?</i>
    </header>
  )
}

function App () {
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
    const [ myData, setMyData] = useState(null);
    useEffect(() => {

        Papa.parse("https://docs.google.com/spreadsheets/d/e/2PACX-1vTWq32Sh-nuY61nzNCYauMYbiOZhIE8TfnyRhu1hnVs-i-oLdOO65Ax0VHDtcctn44l7NEUhy7gHZUm/pub?output=csv", {
            download: true,
            complete: function(results) {

                setMyData(results.data)

            }
        });})
  useEffect(() => {
    if (province) {
      window.document.title = `Convid-19 Live Status | ${province.name}`
    }
  }, [province])

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
  if(myData){
  return (
    <div>
      <Header province={province} />
      <Stat { ...{ ...all, ...overall } } name={province && province.name} data={myData} />
      <div className="card">
        <h2>Infected Map { province ? `· ${province.name}` : false }
        {
          province ? <small
            onClick={() => setProvince(null)}
          >Return</small> : null
        }
        </h2>
        <Suspense fallback={<div className="loading">Loading...</div>}>
          <Map province={province} data={data} onClick={name => {
            const p = provincesByName[name]
            if (p) {
              setProvince(p)
            }
          }} newDate={myData}/>
          {/*{*/}
            {/*province ? false :*/}
              {/*<div className="tip">*/}
                {/*Click on the state to check state details.*/}
              {/*</div>*/}
          {/*}*/}
        </Suspense>
        <Area area={area} onChange={setProvince} data={myData} />
      </div>
      <News province={province} />
      <Summary />
      <Fallback />
    </div>
  )}
  else{
        return null
  }
}

export default App;

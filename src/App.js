import React, { useState, Suspense, useEffect, useLayoutEffect } from "react";
import keyBy from "lodash.keyby";
import dayjs from "dayjs";
import "dayjs/locale/en-au";
import relativeTime from "dayjs/plugin/relativeTime";

import country from "./data/country";
import testedCases from "./data/testedCases";
import all from "./data/overall";
import provinces from "./data/area";
import Tag from "./Tag";

import MbMap from "./ConfirmedMap";
import "./App.css";
import axios from "axios";
import Papa from "papaparse";

import ReactGA from "react-ga";
import CanvasJSReact from "./assets/canvasjs.react";

import { TwitterTimelineEmbed } from "react-twitter-embed";

import Grid from "@material-ui/core/Grid";
import NewsTimeline from "./NewsTimeline";

let CanvasJSChart = CanvasJSReact.CanvasJSChart;
dayjs.extend(relativeTime);
ReactGA.initialize("UA-160673543-1");

ReactGA.pageview(window.location.pathname + window.location.search);

const GoogleMap = React.lazy(() => import("./GoogleMap"));

const provincesByName = keyBy(provinces, "name");
const provincesByPinyin = keyBy(provinces, "pinyin");

const fetcher = url =>
  axios(url).then(data => {
    return data.data.data;
  });

function HistoryGraph({ countryData }) {
  let newData = [[{ type: "date", label: "Day" }, "New Cases", "Deaths"]];
  let today = Date.now();
  const [loading, setLoading] = useState(true);
  const [options, setOptions] = useState(null);
  const [newOpts, setNewOpts] = useState(null);
  useEffect(() => {
    let monthTrans = {
      0: "Jan",
      1: "Feb",
      2: "Mar",
      3: "Apr",
      4: "May",
      5: "Jun",
      6: "Jul",
      7: "Aug",
      8: "Sept",
      9: "Oct",
      10: "Nov",
      11: "Dec"
    };
    let historyData = [
      {
        type: "spline",
        name: "Confirmed",
        showInLegend: true,
        dataPoints: []
      },
      {
        type: "spline",
        name: "Deaths",
        showInLegend: true,
        dataPoints: []
      },
      {
        type: "spline",
        name: "Recovered",
        showInLegend: true,
        dataPoints: []
      },
      {
        type: "spline",
        name: "Existing",
        showInLegend: true,
        dataPoints: []
      }
    ];
    let newData = [
      {
        type: "stackedColumn",
        name: "New Case",
        showInLegend: true,
        dataPoints: []
      },
      {
        type: "stackedColumn",
        name: "Deaths",
        showInLegend: true,
        dataPoints: []
      }
    ];
    let pre = [];
    for (let key in countryData) {
      let arr = key.split("-");
      let date = new Date(arr[0], arr[1] - 1, arr[2]);
      if ((today - date) / (1000 * 3600 * 24) <= 14) {
        let labelName =
          monthTrans[date.getMonth()] + " " + date.getDate().toString();
        historyData[0]["dataPoints"].push({
          y: countryData[key][0],
          label: labelName
        });
        historyData[1]["dataPoints"].push({
          y: countryData[key][2],
          label: labelName
        });
        historyData[2]["dataPoints"].push({
          y: countryData[key][1],
          label: labelName
        });
        historyData[3]["dataPoints"].push({
          y: countryData[key][3],
          label: labelName
        });
        newData[0]["dataPoints"].push({
          y: countryData[key][0] - pre[0],
          label: labelName
        });
        newData[1]["dataPoints"].push({
          y: countryData[key][2] - pre[2],
          label: labelName
        });
      }
      pre = countryData[key];
    }
    setOptions({
      animationEnabled: true,
      height: 260,
      title: {
        text: "Australian COVID-19 Trend",
        fontSize: 20
      },
      legend: {
        verticalAlign: "top"
      },
      toolTip: {
        shared: true
        // content:"{label}, {name}: {y}" ,
      },

      data: historyData
    });
    setNewOpts({
      data: newData,
      animationEnabled: true,
      height: 260,
      title: {
        text: "Australia Covid-19 New Cases vs Deaths Chart (last two weeks)",
        fontSize: 20
      },
      legend: {
        verticalAlign: "top"
      },
      toolTip: {
        shared: true
        // content:"{label}, {name}: {y}" ,
      }
    });
    // newData.push([historyData[2][0],historyData[2][1]-historyData[1][1],historyData[2][2]-historyData[1][2]])
    // for(let i = 3; i < historyData.length; i++) {
    //     newData.push([historyData[i][0], historyData[i][1] - historyData[i - 1][1], historyData[i][2]-historyData[i-1][2]])
    // }

    setLoading(false);
  }, [countryData]);

  return loading ? (
    <div className="loading">Loading...</div>
  ) : (
    <div className="card">
      <h2>Status Graph</h2>
      <CanvasJSChart options={options} />
      <CanvasJSChart options={newOpts} />
      {/*<Chart*/}
      {/*width={'100%'}*/}
      {/*height={'400px'}*/}
      {/*chartType="LineChart"*/}
      {/*loader={<div>Loading Chart...</div>}*/}
      {/*data={historyData}*/}
      {/*options={options}*/}
      {/*rootProps={{ 'data-testid': '3' }}*/}
      {/*/>*/}
      {/*<Chart*/}
      {/*width={'100%'}*/}
      {/*height={'400px'}*/}
      {/*chartType="ColumnChart"*/}
      {/*data={newData}*/}
      {/*options={newOptions}*/}

      {/*/>*/}
    </div>
  );
}

function New({ title, contentSnippet, link, pubDate, pubDateStr }) {
  return (
    <div className="new">
      <div className="new-date">
        <div className="relative">
          {dayjs(pubDate)
            .locale("en-au")
            .fromNow()}
        </div>
        {dayjs(pubDate).format("YYYY-MM-DD HH:mm")}
      </div>
      <a href={link} className="title">
        {title}
      </a>
      <div className="summary">{contentSnippet.split("&nbsp;")[0]}...</div>
    </div>
  );
}

function News({ province }) {
  let Parser = require("rss-parser");

  const [len, setLen] = useState(3);
  const [news, setNews] = useState([]);

  useEffect(() => {
    let parser = new Parser({
      headers: { "Access-Control-Allow-Origin": "*" }
    });
    const CORS_PROXY = "https://cors-anywhere.herokuapp.com/";
    parser.parseURL(
      CORS_PROXY +
        "https://news.google.com/rss/search?q=COVID%2019-Australia&hl=en-US&gl=AU&ceid=AU:en",
      function(err, feed) {
        if (err) throw err;
        // console.log(feed.title);
        // feed.items.forEach(function(entry) {
        //     console.log(entry);
        // })
        setNews(feed.items);
      }
    );
  }, []);

  return (
    <div className="card">
      <h2>News Feed</h2>
      {news.slice(0, len).map(n => (
        <New {...n} key={n.id} />
      ))}
      <div
        className="more"
        onClick={() => {
          setLen(len + 2);
        }}
      >
        <i>
          <u>Click for more news...</u>
        </i>
      </div>
    </div>
  );
}

function Tweets({ province }) {
  return (
    <div className="card">
      <h2>Twitter Feed</h2>
      <div className="centerContent">
        <div className="selfCenter standardWidth">
          <TwitterTimelineEmbed
            sourceType="list"
            ownerScreenName="kLSAUPZszP2n6zX"
            slug="COVID19-Australia"
            options={{
              height: 450
            }}
            noHeader="true"
            noFooter="true"
          />
        </div>
      </div>
    </div>
  );
}

function ExposureSites() {
  return <div></div>;
}

function Stat({
  modifyTime,
  confirmedCount,
  suspectedCount,
  deadCount,
  curedCount,
  name,
  quanguoTrendChart,
  hbFeiHbTrendChart,
  data,
  countryData
}) {
  let confCountIncrease = 0;
  let deadCountIncrease = 0;
  let curedCountIncrease = 0;
  if (data && countryData) {
    confirmedCount = 0;

    deadCount = 0;
    curedCount = 0;

    for (let i = 0; i < data.length; i++) {
      confirmedCount += parseInt(data[i][1]);
      deadCount += parseInt(data[i][2]);
      curedCount += parseInt(data[i][3]);
    }
    let lastTotal =
      countryData[
        Object.keys(countryData)[Object.keys(countryData).length - 1]
      ];
    confCountIncrease = confirmedCount - lastTotal[0];
    deadCountIncrease = deadCount - lastTotal[2];
    curedCountIncrease = curedCount - lastTotal[1];
  } else {
    confirmedCount = 0;

    deadCount = 0;
    curedCount = 0;
  }

  return (
    <div className="card">
      <h2>
        Status {name ? `· ${name}` : false}
        <span className="due">Update Hourly</span>
      </h2>
      <div className="row">
        <Tag
          number={confirmedCount}
          fColor={"#e74c3c"}
          increased={confCountIncrease}
        >
          Confirmed
        </Tag>
        {/*<Tag number={suspectedCount || '-'}>*/}
        {/*疑似*/}
        {/*</Tag>*/}
        <Tag
          number={deadCount}
          fColor={"#a93226"}
          increased={deadCountIncrease}
        >
          Deaths
        </Tag>
        <Tag
          number={curedCount}
          fColor={"#00b321"}
          increased={curedCountIncrease}
        >
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
  );
}

function Fallback() {
  return (
    <div className="fallback">
      <div>
        Forked From:{" "}
        <a href="https://github.com/shfshanyue/2019-ncov">
          shfshanyue/2019-ncov
        </a>
      </div>

      <div>
        Our GitHub:{" "}
        <a href="https://github.com/covid-19-au/covid-19-au.github.io">
          covid-19-au
        </a>
      </div>
      <div>
        This site is developed by a{" "}
        <a href="https://github.com/covid-19-au/covid-19-au.github.io/blob/dev/README.md">
          volunteer team
        </a>{" "}
        from Faculty of IT, Monash University for non-commercial use only.
      </div>
      <div>
        <a href="https://www.webfreecounter.com/" target="_blank">
          <img
            src="https://www.webfreecounter.com/hit.php?id=gevkadfx&nd=6&style=1"
            border="0"
            alt="hit counter"
          />
        </a>
      </div>
    </div>
  );
}

function Area({ area, onChange, data }) {
  const renderArea = () => {
    let latest =
      testedCases[
        Object.keys(testedCases)[Object.keys(testedCases).length - 1]
      ];

    return data.map(x => (
      <div className="province" key={x.name || x.cityName}>
        {/*<div className={`area ${x.name ? 'active' : ''}`}>*/}
        {/*{ x.name || x.cityName }*/}
        {/*</div>*/}
        {/*<div className="confirmed">{ x.confirmedCount }</div>*/}
        {/*<div className="death">{ x.deadCount }</div>*/}
        {/*<div className="cured">{ x.curedCount }</div>*/}
        <div className={"area"}>
          <strong>{x[0]}</strong>
        </div>
        <div className="confirmed">
          <strong>{x[1]}</strong>
        </div>
        <div className="death">
          <strong>{x[2]}</strong>
        </div>
        <div className="cured">
          <strong>{x[3]}</strong>
        </div>
        <div className="tested">{latest[x[0]]}</div>
      </div>
    ));
  };

  return (
    <>
      <div className="province header">
        <div className="area header">State</div>
        <div className="confirmed header">Confirmed</div>
        <div className="death header">Death</div>
        <div className="cured header">Recovered</div>
        <div className="tested header">*Tested</div>
      </div>
      {renderArea()}
    </>
  );
}

function Header({ province }) {
  return (
    <header>
      <div className="bg"></div>
      <h1
        style={{
          fontSize: "120%"
        }}
      >
        COVID-19 Real-time Report in Australia
      </h1>
      {/*<i>By Students from Monash</i>*/}
    </header>
  );
}

function App() {
  const [province, _setProvince] = useState(null);
  const setProvinceByUrl = () => {
    const p = window.location.pathname.slice(1);
    _setProvince(p ? provincesByPinyin[p] : null);
  };

  useEffect(() => {
    setProvinceByUrl();
    window.addEventListener("popstate", setProvinceByUrl);
    return () => {
      window.removeEventListener("popstate", setProvinceByUrl);
    };
  }, []);

  const [gspace, _setGspace] = useState(0);
  const setGspace = () => {
    const p = window.innerWidth;
    _setGspace(p > 1280 ? 2 : 0);
  };

  useEffect(() => {
    setGspace();
    window.addEventListener("resize", setGspace);
    return () => {
      window.removeEventListener("resize", setGspace);
    };
  }, []);

  const [myData, setMyData] = useState(null);
  useEffect(() => {
    Papa.parse(
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vTWq32Sh-nuY61nzNCYauMYbiOZhIE8TfnyRhu1hnVs-i-oLdOO65Ax0VHDtcctn44l7NEUhy7gHZUm/pub?output=csv",
      {
        download: true,
        complete: function(results) {
          // console.log("requested");
          results.data.splice(0, 1);
          let sortedData = results.data.sort((a, b) => {
            return b[1] - a[1];
          });

          setMyData(results.data);
        }
      }
    );
  }, [province]);
  useEffect(() => {
    if (province) {
      window.document.title = `Covid-19 Live Status | ${province.name}`;
    }
  }, [province]);

  const setProvince = p => {
    _setProvince(p);
    window.history.pushState(null, null, p ? p.pinyin : "/");
  };

  const data = !province
    ? provinces.map(p => ({
        name: p.provinceShortName,
        value: p.confirmedCount
      }))
    : provincesByName[province.name].cities.map(city => ({
        name: city.fullCityName,
        value: city.confirmedCount
      }));

  const area = province ? provincesByName[province.name].cities : provinces;
  const overall = province ? province : all;
  if (myData) {
    return (
      <div>
        <Grid container spacing={gspace} justify="center" wrap="wrap">
          <Grid item xs={12}>
            <Header province={province} />
          </Grid>
          <Grid item xs={12} sm={12} md={10} lg={6} xl={5}>
            <Stat
              {...{ ...all, ...overall }}
              name={province && province.name}
              data={myData}
              countryData={country}
            />
            <div className="card">
              <h2>
                Infection Map {province ? `· ${province.name}` : false}
                {province ? (
                  <small onClick={() => setProvince(null)}>Return</small>
                ) : null}
              </h2>
              <Suspense fallback={<div className="loading">Loading...</div>}>
                <GoogleMap
                  province={province}
                  data={data}
                  onClick={name => {
                    const p = provincesByName[name];
                    if (p) {
                      setProvince(p);
                    }
                  }}
                  newData={myData}
                />
                {/*{*/}
                {/*province ? false :*/}
                {/*<div className="tip">*/}
                {/*Click on the state to check state details.*/}
                {/*</div>*/}
                {/*}*/}
              </Suspense>
              <Area area={area} onChange={setProvince} data={myData} />
              <a
                style={{
                  fontSize: "50%",
                  float: "right",
                  color: "lightgrey"
                }}
                href="https://www.theaustralian.com.au"
              >
                Data: @The Australian
              </a>
              <span style={{ fontSize: "60%" }} className="due">
                *Tested cases are updated daily.
              </span>
            </div>
          </Grid>
          <Grid item xs={12} sm={12} md={10} lg={6} xl={5}>
            <NewsTimeline></NewsTimeline>
            <MbMap />
          </Grid>
          <Grid item xs={12} sm={12} md={10} lg={6} xl={5}>
            <HistoryGraph countryData={country} />
          </Grid>

          <Grid item xs={12} sm={12} md={10} lg={6} xl={5}>
            <Tweets province={province} />
          </Grid>
          {/*<Grid item xs={12} sm={12} md={10} lg={6} xl={5}>*/}
          {/*<News />*/}
          {/*</Grid>*/}
          <Grid item xs={12}>
            <ExposureSites />
          </Grid>
          <Grid item xs={12}>
            <Fallback />
          </Grid>
        </Grid>
      </div>
    );
  } else {
    return null;
  }
}

export default App;

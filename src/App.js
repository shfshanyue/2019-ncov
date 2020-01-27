import React from 'react';
import './App.css';
import overall from './data/overall'

import Map from './Map'
import Tag from './Tag'
import dayjs from 'dayjs'

function App() {
  return (
    <div>
      <header>
        <h1>
          肺炎疫情实时动态
        </h1>
      </header>
      <div class="card">
        <h2>
          统计
          <span className="due">
            截止时间: { dayjs(overall.modifyTime).format('YYYY-MM-DD HH:mm') }
          </span>
        </h2>
        <div>
          <div class="row">
            <Tag>
              确诊: { overall.confirmed } 例
            </Tag>
            <Tag>
              疑似: { overall.suspect } 例
            </Tag>
          </div>
          <div class="row">
            <Tag>
              死亡: { overall.death } 例
            </Tag>
            <Tag>
              治愈: { overall.cured } 例
            </Tag>
          </div>
        </div>
      </div>
      <div class="card">
        <h2>疫情地图</h2>
        <Map />
      </div>
    </div>
  );
}

export default App;

import React from 'react';
import caseNews from "./data/timelinedata";
import keyBy from "lodash.keyby";
import { Timeline, TimelineItem } from "vertical-timeline-component-for-react";
import "./Timeline.css"

function NewsTimeline() {
    const timelineNews = keyBy(caseNews, "rank");
    return (
        <div className="card">
            <h2>News Timeline</h2>
            <Timeline lineColor={'#ddd'}>
                <TimelineItem
                    key="001"
                    dateText={timelineNews["1"].date + " " + timelineNews["1"].time}
                    dateInnerStyle={{ background: '#cb4335' }}
                    style={{ color: '#61b8ff' }}
                ><a href={timelineNews["1"].url}> <h3 style={{ color: ' #2980b9 ' }} >{timelineNews["1"].title}</h3></a>
                    <h4 style={{ color: ' #5d6d7e ' }}>{timelineNews["1"].source}</h4>
                </TimelineItem>
                <TimelineItem
                    key="002"
                    dateText={timelineNews["2"].date + " " + timelineNews["2"].time}
                    dateInnerStyle={{ background: '#e74c3c' }}
                    style={{ color: '#61b8ff' }}
                ><a href={timelineNews["2"].url}> <h3 style={{ color: ' #2980b9 ' }}>{timelineNews["2"].title}</h3></a>
                    <h4 style={{ color: ' #5d6d7e ' }}>{timelineNews["2"].source}</h4>
                </TimelineItem>
                <TimelineItem
                    key="003"
                    dateText={timelineNews["3"].date + " " + timelineNews["3"].time}
                    dateInnerStyle={{ background: '#ec7063' }}
                    style={{ color: '#61b8ff' }}
                ><a href={timelineNews["3"].url}> <h3 style={{ color: ' #2980b9 ' }}>{timelineNews["3"].title}</h3></a>
                    <h4 style={{ color: ' #5d6d7e ' }}>{timelineNews["3"].source}</h4>
                </TimelineItem>
                <TimelineItem
                    key="004"
                    dateText={timelineNews["4"].date + " " + timelineNews["4"].time}
                    dateInnerStyle={{ background: '#f1948a' }}
                    style={{ color: '#61b8ff' }}
                ><a href={timelineNews["4"].url}> <h3 style={{ color: ' #2980b9 ' }}>{timelineNews["4"].title}</h3></a>
                    <h4 style={{ color: ' #5d6d7e ' }}>{timelineNews["4"].source}</h4>
                </TimelineItem>
                <TimelineItem
                    key="005"
                    dateText={timelineNews["5"].date + " " + timelineNews["5"].time}
                    dateInnerStyle={{ background: '#f5b7b1' }}
                    style={{ color: '#61b8ff' }}
                ><a href={timelineNews["5"].url}> <h3 style={{ color: ' #2980b9 ' }}>{timelineNews["5"].title}</h3></a>
                    <h4 style={{ color: ' #5d6d7e ' }}>{timelineNews["5"].source}</h4>
                </TimelineItem>
            </Timeline >
            <span className="due">Time in AEDT, last updated at {timelineNews["0"].updateTime}</span>


        </div >
    )
}
export default NewsTimeline
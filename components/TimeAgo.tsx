'use client';

import TimeAgoComponent from "react-timeago"

 export default function TimeAgo({date}:{date:Date | string}){
    const safeDate = typeof date === "string" ? new Date(date) :date;
    return (
    <TimeAgoComponent date={safeDate}/>
    )
}


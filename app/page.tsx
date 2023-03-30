"use client";

import "react-big-calendar/lib/css/react-big-calendar.css";
import { Calendar, dateFnsLocalizer } from 'react-big-calendar'
import format from 'date-fns/format'
import parse from 'date-fns/parse'
import startOfWeek from 'date-fns/startOfWeek'
import getDay from 'date-fns/getDay'
import enUS from 'date-fns/locale/en-US'
import { useChangeDate, useCurrentDate, useEvents } from "./events";
import { ConfigForm } from "./ConfigForm";
import { AddEventsPrompt } from "./AddEventsPrompt";
import { ClearEvents } from "./ClearEvents";
import Link from "next/link";

const locales = {
  'en-US': enUS,
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
})

export default function Home() {
  const events = useEvents();
  const date = useCurrentDate();
  const changeDate = useChangeDate();

  return (
    <div>
    <main className="flex">
      <Calendar
        date={date}
        onNavigate={changeDate}
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ margin: "1rem", height: "calc(100vh - 2rem)", width: "calc(100vw - 300px - 2rem)" }}
        eventPropGetter={(event) => {
          const backgroundColor = event.color;
          return { style: { backgroundColor } }
        }}
      />

      <div className="m-2 w-[284px] relative">
        <ConfigForm />
        <AddEventsPrompt />
        <div className="flex flex-col absolute bottom-0">
          <ClearEvents />
          <Link  className="border-2 m-2 p-2 border-zinc-800 rounded-xl text-center" href="https://github.com/NWylynko/gpt-calendar">Github Repository</Link>
          <Link  className="border-2 m-2 p-2 border-zinc-800 rounded-xl text-center" href="https://nick.wylynko.com">Technical Demo by Nick Wylynko</Link>
        </div>
      </div>

    </main>
    </div>
  )
}

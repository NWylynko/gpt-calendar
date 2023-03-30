"use client";

import "react-big-calendar/lib/css/react-big-calendar.css";
import { Calendar, dateFnsLocalizer } from 'react-big-calendar'
import format from 'date-fns/format'
import parse from 'date-fns/parse'
import startOfWeek from 'date-fns/startOfWeek'
import getDay from 'date-fns/getDay'
import enUS from 'date-fns/locale/en-US'
import { useEvents } from "./events";
import { ConfigForm } from "./ConfigForm";
import { AddEventsPrompt } from "./AddEventsPrompt";

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
  return (
    <main className="flex">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ margin: "1rem", height: "calc(100vh - 2rem)", width: "calc(100vw - 300px - 2rem)" }}
      />

      <div className="m-2 w-[284px]">
        <ConfigForm />
        <AddEventsPrompt />
      </div>

    </main>
  )
}

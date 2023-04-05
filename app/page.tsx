"use client";

import "react-big-calendar/lib/css/react-big-calendar.css";
import { Calendar, dateFnsLocalizer } from 'react-big-calendar'
import format from 'date-fns/format'
import parse from 'date-fns/parse'
import startOfWeek from 'date-fns/startOfWeek'
import getDay from 'date-fns/getDay'
import enUS from 'date-fns/locale/en-US'
import { useChangeDate, useCurrentDate, useEvents } from "./events";
import styled from "styled-components";
import { PromptSection } from "./PromptSection";

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
        {/* @ts-ignore */}
        <StyledCalendar
          date={date}
          onNavigate={changeDate}
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: "calc(100vh - 2rem)"}}
          eventPropGetter={(event) => {
            // @ts-ignore
            const backgroundColor = event.color;
            return { style: { backgroundColor } }
          }}
        />

        <div className="hidden md:block">
          <PromptSection />
        </div>


      </main>
      <div className="btm-nav border-t border-t-black md:hidden p-4 z-[500000]">
        <label htmlFor="my-modal" className="btn bg-white text-black hover:bg-white">OPEN GPT PROMPT</label>
      </div>
    </div>
  )
}

const StyledCalendar = styled(Calendar)`
  margin: 1rem;
  height: calc(100vh - 2rem);
  width: calc(100vw - 300px - 2rem);

  @media (max-width: 768px) {
    height: calc(100vh - 2rem);
    width: calc(100vw - 2rem);
  }
`;
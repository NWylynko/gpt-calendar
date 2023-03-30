"use client"

import { useClearEvents } from "./events"


export const ClearEvents = () => {
  const clearEvents = useClearEvents()

  return <button className="border-2 m-2 p-2 border-zinc-800 rounded-xl" onClick={clearEvents}>Clear Events</button>
}
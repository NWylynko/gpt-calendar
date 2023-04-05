"use client";

import { ConfigForm } from "./ConfigForm";
import { AddEventsPrompt } from "./AddEventsPrompt";
import { ClearEvents } from "./ClearEvents";
import Link from "next/link";

export const PromptSection = () => {
  return (
    <div className="p-2 w-[300px] h-full flex flex-col justify-between">
      <div className="flex flex-col">
        <ConfigForm />
        <AddEventsPrompt />
      </div>

      <div className="flex flex-col">
        <ClearEvents />
        <Link className="border-2 m-2 p-2 border-zinc-800 rounded-xl text-center" href="https://github.com/NWylynko/gpt-calendar">Github Repository</Link>
        <Link className="border-2 m-2 p-2 border-zinc-800 rounded-xl text-center" href="https://nick.wylynko.com">Technical Demo by Nick Wylynko</Link>
      </div>
    </div>
  );
};

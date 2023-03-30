"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { usePromptGPT } from "./events";

const schema = z.object({
  prompt: z.string().nonempty().max(1000),
})

export const AddEventsPrompt = () => {

  const promptGPT = usePromptGPT()

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });

  const onSubmit = form.handleSubmit((data) => {
    promptGPT(data.prompt)
  })

  return (
    <form className="m-2" onSubmit={onSubmit}>
      <label>Describe one or more events to add to your calendar</label>
      <textarea className="border-2 border-zinc-800 rounded-xl w-full p-2" rows={10} {...form.register("prompt")} />
      <button type="submit" className="border-2 p-2 border-zinc-800 rounded-xl w-full">Generate</button>
    </form>
  )
}
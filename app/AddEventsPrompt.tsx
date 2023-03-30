"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useConfig, usePromptGPT, useRawResponse } from "./events";
import { useState } from "react";
import { ErrorMessage } from "@hookform/error-message";
import { AiOutlineLoading } from "@react-icons/all-files/ai/AiOutlineLoading"

const schema = z.object({
  prompt: z.string().nonempty().max(1000),
})

export const AddEventsPrompt = () => {

  const promptGPT = usePromptGPT()
  const config = useConfig()
  const rawResponse = useRawResponse()
  const [errorMessage, setErrorMessage] = useState<string>()

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      await promptGPT(data.prompt)
    } catch (error: any) {
      setErrorMessage(error.message)
    }
  })

  const loading = form.formState.isSubmitting;
  const disabled = !config || loading

  return (
    <form className="m-2" onSubmit={onSubmit}>
      <label>Describe one or more events to add to your calendar</label>
      <textarea className="border-2 border-zinc-800 rounded-xl w-full p-2" rows={10} {...form.register("prompt")} disabled={disabled} />
      <ErrorMessage errors={form.formState.errors} name="prompt" />
      <button type="submit" className="border-2 p-2 border-zinc-800 rounded-xl w-full flex justify-center text-center gap-4" disabled={disabled}>
        {loading ? <span>Generating</span> : <span>Generate</span>}
        {loading ? <AiOutlineLoading className="animate-spin" size={24} /> : <></>}
      </button>
      {errorMessage && <><div className="text-red-500">{errorMessage}</div><div className="text-red-500">{rawResponse}</div></>}
    </form>
  )
}
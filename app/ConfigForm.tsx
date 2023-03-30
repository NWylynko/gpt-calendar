"use client";

import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useConfig, useSetConfig } from "./events";
import Link from "next/link";

const configSchema = z.object({
  apiKey: z.string().nonempty(),
});

export type Config = z.infer<typeof configSchema>;

export const ConfigForm = () => {

  const config = useConfig();
  const setConfig = useSetConfig();

  const form = useForm<z.infer<typeof configSchema>>({
    resolver: zodResolver(configSchema),
    defaultValues: config,
  })

  return (
    <form onSubmit={form.handleSubmit(setConfig)} className="flex flex-col">
      <label>GPT Api Key - <Link className="text-blue-300 hover:underline" href="https://platform.openai.com/account/api-keys">Get yours here</Link></label>
      <input type="password" {...form.register("apiKey")} className="border-2 m-2 p-2 border-zinc-800 rounded-xl" />
      <ErrorMessage errors={form.formState.errors} name="apiKey" />

      <button type="submit" className="border-2 m-2 p-2 border-zinc-800 rounded-xl">Save</button>
    </form>
  )
}
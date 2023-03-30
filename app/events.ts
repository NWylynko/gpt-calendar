import { z } from "zod";
import { create } from "zustand";
import parseDate from "date-fns/parseJSON";
import { Config } from "./ConfigForm";
import { persist, createJSONStorage } from 'zustand/middleware'
import { getGPT } from "./openai";

const eventSchema = z.object({
  allDay: z.boolean(),
  title: z.string(),
  start: z.string().transform(parseDate),
  end: z.string().transform(parseDate),
})
const eventsSchema = z.array(eventSchema);

type Event = z.infer<typeof eventSchema>;
type Events = z.infer<typeof eventsSchema>;

type EventsStore = {
  events: Events;
  promptGPT: (message: string) => Promise<void>;
  config: Partial<Config>;
  setConfig: (newConfig: Config) => void;
  clearEvents: () => void;
}

const useEventsStore = create<EventsStore>()(
  persist(
    (set, get) => {
      return {
        events: [],
        promptGPT: async (message: string) => {
          const { apiKey } = get().config;
          if (!apiKey) {
            throw new Error("No API key set");
          }
          const openai = getGPT(apiKey);
          const completion = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [
              {
                "role": "system",
                content: "You are a virtual assistant that helps people with their calendar",
              },
              {
                "role": "user",
                "content": message,
              },
              {
                "role": "user",
                "content": `The current date is ${new Date().toISOString()} and I am in the timezone of ${Intl.DateTimeFormat().resolvedOptions().timeZone}`,
              },
              {
                "role": "user",
                // "content": `Respond with just the events in the format of a json array with the following format: {"allDay": boolean, "title": string, "start": ISO Format string, "end": ISO Format string}`
                content: `Respond with only a json array, generate the events with the following format: [{"allDay": boolean, "title": string, "start": ISO Format string, "end": ISO Format string}], do not add any further comment`
              }
            ],
            n: 1,
            max_tokens: 1000,
          });

          const response = completion.data.choices[0].message?.content

          if (!response) {
            throw new Error("No message returned from GPT-3");
          }

          const unParsedEvents = JSON.parse(response);

          console.log({ unParsedEvents })

          const events = eventsSchema.parse(unParsedEvents);

          console.log({ events })

          set(() => ({ events: [...get().events, ...events] }));
        },
        config: {
          apiKey: undefined
        },
        setConfig: (newConfig: Config) => set({ config: newConfig }),
        clearEvents: () =>  { set({ events: [] }) }
      }
    },
    {
      name: 'events',
      storage: createJSONStorage(() => localStorage),
    }
  )
)

export const useEvents = () => useEventsStore((state) => state.events);
export const useSetConfig = () => useEventsStore((state) => state.setConfig);
export const useConfig = () => useEventsStore((state) => state.config);
export const usePromptGPT = () => useEventsStore((state) => state.promptGPT);
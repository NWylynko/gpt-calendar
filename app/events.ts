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
  rawGPTResponse: string;
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
                content: `You are a virtual calendar assistant, you help create peoples calendars, you only respond with pure json (do not respond with code block). the event format for events is [{"allDay": boolean, "title": string, "start": ISO Format string, "end": ISO Format string}]`,
              },
              {
                "role": "user",
                "content": `The current date is ${new Date().toISOString()} and I am in the timezone of ${Intl.DateTimeFormat().resolvedOptions().timeZone} apply the events to the current time`,
              },
              {
                "role": "user",
                "content": `Respond with only a json array, create an event or events that are sufficient for the users request of "${message}", do not add any further comment`
              },
            ],
            n: 1,
            max_tokens: 1000,
          });

          const response = completion.data.choices[0].message?.content

          if (!response) {
            throw new Error("No message returned from GPT-3");
          }

          set({ rawGPTResponse: response })

          const unParsedEvents = JSON.parse(response);

          console.log({ unParsedEvents })

          const events = eventsSchema.parse(unParsedEvents);

          console.log({ events })

          set(() => ({ events: [...get().events, ...events] }));
        },
        rawGPTResponse: "",
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

export const useEvents = () => useEventsStore((store) => store.events);
export const useSetConfig = () => useEventsStore((store) => store.setConfig);
export const useConfig = () => useEventsStore((store) => store.config);
export const usePromptGPT = () => useEventsStore((store) => store.promptGPT);
export const useClearEvents = () => useEventsStore((store) => store.clearEvents)
export const useRawResponse = () => useEventsStore((store) => store.rawGPTResponse)
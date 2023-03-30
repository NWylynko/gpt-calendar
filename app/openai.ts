

import { OpenAIApi } from "openai";
import { Configuration } from "openai";

export const getGPT = (apiKey: string) => {
  const configuration = new Configuration({
    apiKey,
  });
  
  const openai = new OpenAIApi(configuration);

  return openai
}
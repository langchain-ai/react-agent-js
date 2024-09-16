import { TavilySearchResults } from "@langchain/community/tools/tavily_search";
import { ensureConfig } from "@langchain/core/runnables";
import { DynamicStructuredTool } from "@langchain/core/tools";
import { initChatModel } from "langchain/chat_models/universal";
import { z } from "zod";
import { ensureConfiguration } from "./configuration.js";
import { getMessageText } from "./utils.js";

const scrapeWebpage = new DynamicStructuredTool({
  name: "scrapeWebpage",
  description:
    "Scrape the given webpage and return a summary of text based on the instructions.",
  schema: z.object({
    url: z.string().describe("The URL of the webpage to scrape."),
    instructions: z
      .string()
      .describe(
        "The instructions to give to the scraper. An LLM will be used to respond using the instructions and the scraped text.",
      ),
  }),
  func: async ({ url, instructions }): Promise<string> => {
    const response = await fetch(url);
    const webText = await response.text();
    const config = ensureConfig();
    const configuration = ensureConfiguration(config);
    const model = await initChatModel(configuration.modelName);
    const responseMsg = await model.invoke(
      [
        [
          "system",
          `You are a helpful web scraper AI assistant. You are working in extractive Q&A mode, meaning you refrain from making overly abstractive responses.
Respond to the user's instructions.
Based on the provided webpage. If you are unable to answer the question, let the user know. Do not guess.
Provide citations and direct quotes when possible.

<webpage_text>
${webText}
</webpage_text>

System time: ${new Date().toISOString()}`,
        ],
        ["user", instructions],
      ],
      config,
    );
    return getMessageText(responseMsg);
  },
});

const searchTavily = new TavilySearchResults({
  maxResults: 5,
  apiKey: process.env.TAVILY_API_KEY,
});

export const TOOLS = [scrapeWebpage, searchTavily];

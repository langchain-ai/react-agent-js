import { ensureConfiguration } from "./configuration.js";
import { ensureConfig } from "@langchain/core/runnables";
import { initChatModel } from "langchain/chat_models/universal";
import { getMessageText } from "./utils.js";
import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";

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

// Note, in a real use case, you'd want to use a more robust search API.
const searchDuckduckgo = new DynamicStructuredTool({
  name: "searchDuckduckgo",
  description:
    "Search DuckDuckGo for the given query and return the JSON response. Results are limited, as this is the free public API.",
  schema: z.object({
    query: z.string().describe("The search query to send to DuckDuckGo"),
  }),
  func: async ({ query }): Promise<any> => {
    const response = await fetch(
      `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json`,
    );
    const result = await response.json();

    delete result.meta;
    return result;
  },
});

const searchWikipedia = new DynamicStructuredTool({
  name: "searchWikipedia",
  description:
    "Search Wikipedia for the given query and return the JSON response.",
  schema: z.object({
    query: z.string().describe("The search query to send to Wikipedia"),
  }),
  func: async ({ query }): Promise<any> => {
    const url = "https://en.wikipedia.org/w/api.php";
    const params = new URLSearchParams({
      action: "query",
      list: "search",
      srsearch: query,
      format: "json",
    });
    const response = await fetch(`${url}?${params}`);
    return await response.json();
  },
});

export const TOOLS = [scrapeWebpage, searchDuckduckgo, searchWikipedia];

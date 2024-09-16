/**
 * Define the configurable parameters for the agent.
 */

import { SYSTEM_PROMPT } from "./prompts.js";

export interface Configuration {
  /**
   * The system prompt to be used by the agent.
   */
  systemPrompt: string;

  /**
   * The name of the language model to be used by the agent.
   */
  modelName: string;

  /**
   * The name of the model to be used for the scraper tool.
   */
  scraperToolModelName: string;
}

export function ensureConfiguration(config: any): Configuration {
  /**
   * Ensure the defaults are populated.
   */
  const configurable = config.get("configurable") || {};
  return {
    systemPrompt: configurable.get("systemPrompt") || SYSTEM_PROMPT,
    modelName: configurable.get("modelName", "claude-3-5-sonnet-20240620"),
    scraperToolModelName: configurable.get(
      "scraperToolModelName",
      "accounts/fireworks/models/firefunction-v2"
    ),
  };
}

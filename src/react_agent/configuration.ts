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
}

export function ensureConfiguration(config: any): Configuration {
  /**
   * Ensure the defaults are populated.
   */
  const configurable = config["configurable"] ?? {};
  return {
    systemPrompt: configurable["systemPrompt"] ?? SYSTEM_PROMPT,
    modelName: configurable["modelName"] ?? "claude-3-5-sonnet-20240620",
  };
}

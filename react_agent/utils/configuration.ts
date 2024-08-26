/**
 * Define the configurable parameters for the agent.
 */

export interface Configuration {
  systemPrompt: string;
  modelName: string;
  scraperToolModelName: string;
}

export function ensureConfigurable(config: any): Configuration {
  /**
   * Ensure the defaults are populated.
   */
  const configurable = config["configurable"] ?? {};
  return {
    systemPrompt:
      configurable["systemPrompt"] ?? "You are a helpful AI assistant.",
    modelName: configurable["modelName"] ?? "claude-3-5-sonnet-20240620",
    scraperToolModelName:
      configurable["scraperToolModelName"] ??
      "accounts/fireworks/models/firefunction-v2",
  };
}

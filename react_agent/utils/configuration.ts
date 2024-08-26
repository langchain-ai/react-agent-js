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
  const configurable = config.get("configurable") || {};
  return {
    systemPrompt:
      configurable.get(
        "systemPrompt",
        "You are a helpful AI assistant.\nSystem time: {systemTime}",
      ) || "",
    modelName: configurable.get("modelName", "claude-3-5-sonnet-20240620"),
    scraperToolModelName: configurable.get(
      "scraperToolModelName",
      "accounts/fireworks/models/firefunction-v2",
    ),
  };
}

import { initChatModel } from "langchain/chat_models/universal";
import { AIMessage } from "@langchain/core/messages";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { RunnableConfig } from "@langchain/core/runnables";
import { StateGraph } from "@langchain/langgraph";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { ensureConfiguration } from "./configuration.js";
import { StateT, State } from "./state.js";
import { TOOLS } from "./tools.js";
import { BaseMessage } from "@langchain/core/messages";

// Define the function that calls the model
async function callModel(
  state: StateT,
  config: RunnableConfig,
): Promise<{ messages: AIMessage[] }> {
  /**Call the LLM powering our "agent".**/
  const configuration = ensureConfiguration(config);
  // Feel free to customize the prompt, model, and other logic!
  const prompt = ChatPromptTemplate.fromMessages([
    ["system", configuration.systemPrompt],
    ["placeholder", "{messages}"],
  ]);
  const model = (await initChatModel(configuration.modelName)).bindTools(TOOLS);

  const messageValue = await prompt.invoke(
    { ...state, system_time: new Date().toISOString() },
    config,
  );
  const response: AIMessage = await model.invoke(messageValue, config);
  if (state.is_last_step && response.tool_calls) {
    return {
      messages: [
        new AIMessage({
          id: response.id,
          content:
            "Sorry, I could not find an answer to your question in the specified number of steps.",
        }),
      ],
    };
  }
  // We return a list, because this will get added to the existing list
  return { messages: [response] };
}

// Define the function that determines whether to continue or not
function routeModelOutput(state: StateT): string {
  const messages = state.messages;
  const lastMessage = messages[messages.length - 1];
  // If the LLM is invoking tools, route there.
  if ((lastMessage as AIMessage)?.tool_calls?.length || 0 > 0) {
    return "tools";
  }
  // Otherwise end the graph.
  else {
    return "__end__";
  }
}

// Define a new graph
const workflow = new StateGraph(State)
  // Define the two nodes we will cycle between
  .addNode("callModel", callModel)
  .addNode("tools", new ToolNode<{ messages: BaseMessage[] }>(TOOLS))
  // Set the entrypoint as `callModel`
  // This means that this node is the first one called
  .addEdge("__start__", "callModel")
  .addConditionalEdges(
    // First, we define the edges' source node. We use `callModel`.
    // This means these are the edges taken after the `callModel` node is called.
    "callModel",
    // Next, we pass in the function that will determine the sink node(s), which
    // will be called after the source node is called.
    routeModelOutput,
  )
  // This means that after `tools` is called, `callModel` node is called next.
  .addEdge("tools", "callModel");

// Finally, we compile it!
// This compiles it into a graph you can invoke and deploy.
export const graph = workflow.compile({
  interruptBefore: [], // if you want to update the state before calling the tools
  interruptAfter: [],
});

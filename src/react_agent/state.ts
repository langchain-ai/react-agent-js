import { BaseMessage } from "@langchain/core/messages";
import { Annotation } from "@langchain/langgraph";
import { messagesStateReducer } from "@langchain/langgraph";

// This defines the schema exposed to the end-uer
export const InputState = Annotation.Root({
  messages: Annotation<BaseMessage[]>,
});

// This is the primary state of your agent, where you can store any information
export const StateAnnotation = Annotation.Root({
  /**
   * Messages track the primary execution state of the agent.

    Typically accumulates a pattern of:

    1. HumanMessage - user input
    2. AIMessage with .tool_calls - agent picking tool(s) to use to collect
         information
    3. ToolMessage(s) - the responses (or errors) from the executed tools
    
        (... repeat steps 2 and 3 as needed ...)
    4. AIMessage without .tool_calls - agent responding in unstructured
        format to the user.

    5. HumanMessage - user responds with the next conversational turn.

        (... repeat steps 2-5 as needed ... )
    
    Merges two lists of messages, updating existing messages by ID.

    By default, this ensures the state is "append-only", unless the
    new message has the same ID as an existing message.

    Returns:
        A new list of messages with the messages from \`right\` merged into \`left\`.
        If a message in \`right\` has the same ID as a message in \`left\`, the
        message from \`right\` will replace the message from \`left\`.`
   */
  messages: Annotation<BaseMessage[]>({
    reducer: messagesStateReducer,
    default: () => [],
  }),
  // Feel free to add additional attributes to your state as needed.
  // Common examples include retrieved documents, extracted entities, API connections, etc.
});

export type State = typeof StateAnnotation.State;

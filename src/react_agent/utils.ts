import { BaseMessage } from "@langchain/core/messages";

export function getMessageText(msg: BaseMessage): string {
  /**Get the text content of a message. */
  const content = msg.content;
  if (typeof content === "string") {
    return content;
  } else {
    const txts = (content as any[]).map((c) =>
      typeof c === "string" ? c : c.text || "",
    );
    return txts.join("").trim();
  }
}

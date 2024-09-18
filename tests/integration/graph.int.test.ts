import { it } from "@jest/globals";
import { BaseMessage } from "@langchain/core/messages";

import { graph } from "../../src/react_agent/graph.js";

it("Simple runthrough", async () => {
  const res = await graph.invoke({
    messages: [
      {
        role: "user",
        content: "What is the current weather in SF?",
      },
    ],
  });
  console.log(res);
  expect(
    res.messages.find((message: BaseMessage) => message._getType() === "tool"),
  ).toBeDefined();
});

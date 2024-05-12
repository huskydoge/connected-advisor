import ChatCompletionRequestMessage from "openai";

export const sendMessage = async (
  messages: ChatCompletionRequestMessage[],
  tools: any
) => {
  try {
    console.log("sendMessage", messages, tools);
    const response = await fetch("/api/openai/createMessage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ messages, tools }),
    });

    return await response.json();
  } catch (error) {
    console.log(error);
  }
};

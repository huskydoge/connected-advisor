import { useToast } from "@apideck/components";
import ChatCompletionRequestMessage from "openai";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { sendMessage } from "./sendMessage";
import { Height } from "@mui/icons-material";
import { AdvisorDetails } from "../interface";
import {
  fuzzySearchAdvisorDetails,
  fuzzySearchAdvisor,
} from "../wrapped_api/fetchAdvisor";

import { fetchConnectionByName } from "../wrapped_api/fetchConnection";

interface ContextProps {
  messages: ChatCompletionRequestMessage[];
  addMessage: (content: string) => Promise<void>;
  isLoadingAnswer: boolean;
}

const NUM = 3;

// tool
const fuzzySearch = async (query: string): Promise<string> => {
  // 这里应该是调用实际的搜索 API
  // 返回模拟的搜索结果
  const results = await fuzzySearchAdvisor(query);
  console.log("from API", results);
  // get the first of the results, which is a json object, we need to convert it to a string
  console.log("results", JSON.stringify(results[0]));
  return JSON.stringify(results.slice(0, NUM));
};

const searchConnByName = async (
  name1: string,
  name2: string
): Promise<string> => {
  const results = await fetchConnectionByName(name1, name2);
  console.log("from API", results);
  return JSON.stringify(results);
};

const ChatsContext = createContext<Partial<ContextProps>>({});

export function MessagesProvider({ children }: { children: ReactNode }) {
  const { addToast } = useToast();
  const [messages, setMessages] = useState<ChatCompletionRequestMessage[]>([]);
  const [isLoadingAnswer, setIsLoadingAnswer] = useState(false);

  useEffect(() => {
    const initializeChat = () => {
      const systemMessage: ChatCompletionRequestMessage = {
        role: "system",
        content:
          "You are an assistant to help student choose suitable advisor. When given a advisor Id, You should always remember to render the url 'http://localhost:3000/main/{advisor._id}' to user for them to view this advisor at Connected Advisors(our website). Remember, the id is the id of advisor! Not connection!",
      };
      const welcomeMessage: ChatCompletionRequestMessage = {
        role: "assistant",
        content: "Hi, How can I help you today?",
      };
      setMessages([systemMessage, welcomeMessage]);
    };

    // When no messages are present, we initialize the chat the system message and the welcome message
    // We hide the system message from the user in the UI
    if (!messages?.length) {
      initializeChat();
    }
  }, [messages?.length, setMessages]);

  const addMessage = async (content: string) => {
    setIsLoadingAnswer(true);
    const tools = [
      {
        type: "function",
        function: {
          name: "fuzzySearchAdvisor",
          description:
            "Search for an advisor by a query string in the advisor database",
          parameters: {
            type: "object",
            properties: {
              query: {
                type: "string",
                description: "which could be name, affiliation, tags, position",
              },
            },
            required: ["query"],
          },
        },
      },
      {
        type: "function",
        function: {
          name: "searchConnByName",
          description: "Search connection between two advisors by their name",
          parameters: {
            type: "object",
            properties: {
              name1: {
                type: "string",
                description: "first advisor name",
              },
              name2: {
                type: "string",
                description: "second advisor name",
              },
            },
            required: ["name1", "name2"],
          },
        },
      },
    ];
    try {
      const newMessage: ChatCompletionRequestMessage = {
        role: "user",
        content,
      };
      const newMessages = [...messages, newMessage];

      // Add the user message to the state so we can see it immediately
      setMessages(newMessages);

      const { data } = await sendMessage(newMessages, tools);
      console.log("data", data.choices[0]);
      let reply = data.choices[0].message;
      console.log("reply1", reply);
      while (reply.tool_calls) {
        const toolCalls = reply.tool_calls;
        // Step 3: call the function
        // Note: the JSON response may not always be valid; be sure to handle errors
        newMessages.push(reply); // extend conversation with assistant response
        for (const toolCall of toolCalls) {
          const functionName = toolCall.function.name;

          if (functionName === "searchConnByName") {
            const functionToCall = searchConnByName;
            const functionArgs = JSON.parse(toolCall.function.arguments);
            const functionResponse = await functionToCall(
              functionArgs.name1,
              functionArgs.name2
            );
            newMessages.push({
              tool_call_id: toolCall.id,
              role: "tool",
              name: functionName,
              content: functionResponse,
            }); // extend conversation with function response
            console.log("newMessages after tool call", newMessages);
          } else {
            const functionToCall = fuzzySearch;
            const functionArgs = JSON.parse(toolCall.function.arguments);
            const functionResponse = await functionToCall(functionArgs.query);

            newMessages.push({
              tool_call_id: toolCall.id,
              role: "tool",
              name: functionName,
              content: functionResponse,
            }); // extend conversation with function response
            console.log("newMessages after tool call", newMessages);
            console.log("reply2", reply);
          }
        }
        const { data } = await sendMessage(newMessages, tools);
        reply = data.choices[0].message;
        console.log("reply2", reply);
      }
      // Add the assistant message to the state
      setMessages([...newMessages, reply]);
    } catch (error) {
      // Show error when something goes wrong
      addToast({ title: "An error occurred", type: "error" });
    } finally {
      setIsLoadingAnswer(false);
    }
  };

  return (
    <ChatsContext.Provider value={{ messages, addMessage, isLoadingAnswer }}>
      {children}
    </ChatsContext.Provider>
  );
}

export const useMessages = () => {
  return useContext(ChatsContext) as ContextProps;
};

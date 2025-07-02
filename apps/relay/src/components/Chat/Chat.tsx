import { Message, useChat } from "@ai-sdk/react";
import { Button } from "@telegraph/button";
import { Icon } from "@telegraph/icon";
import { Stack } from "@telegraph/layout";
import { TextArea } from "@telegraph/textarea";
import { Tooltip } from "@telegraph/tooltip";
import { Text } from "@telegraph/typography";
import { LoaderCircle, Send, Trash } from "lucide-react";
import { useRouter } from "next/router";
import { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { deleteChatFromStorage } from "@/utils/chatStorage";

import "./Chat.css";

type ChatProps = {
  chat: ReturnType<typeof useChat>;
};

const Chat = ({ chat }: ChatProps) => {
  const { messages, input, handleInputChange, handleSubmit } = chat;

  // Ref for the scrollable message container
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);

  const router = useRouter();

  // Keep the scroll position pinned to the bottom when messages change
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages]);

  const formatMessage = (message: Message) => {
    // If the message has no content yet, show a loading placeholder
    if (!message.content) return "Loading";

    if (typeof message.content === "string") {
      // 1. Remove complete fenced code blocks (``` ... ```)
      let cleaned = message.content.replace(/```[\s\S]*?```/g, "");

      // 2. If there is an unmatched opening fence (e.g. streaming hasn't delivered the closing fence yet),
      //    strip everything from the first "```" onwards. This prevents partially streamed code from showing.
      const unmatchedFenceIndex = cleaned.indexOf("```");
      if (unmatchedFenceIndex !== -1) {
        cleaned = cleaned.slice(0, unmatchedFenceIndex);
      }

      // 3. Remove inline code wrapped in single backticks `code`
      cleaned = cleaned.replace(/`[^`]*`/g, "");

      // 4. Trim the result – if nothing is left, fall back to the loading text
      cleaned = cleaned.trim();

      return cleaned.length > 0 ? cleaned : "Loading";
    }

    // Non-string message content (e.g. structured JSON) – stringify for display
    return JSON.stringify(message.content);
  };

  /**
   * Remove the current chat from localStorage and navigate to a fresh chat.
   *
   * Steps:
   * 1. Delete the persisted messages for this chat (if it exists).
   * 2. Clear the in-memory messages so the UI updates instantly.
   * 3. Update the URL to **not** include a `cid` which triggers `useChat`
   *    to generate a brand-new chat id in the parent page.
   */
  const handleDelete = () => {
    // 1. Remove from storage (if we have an id already)
    if (chat.id) deleteChatFromStorage(chat.id);

    // 2. Clear the local messages so the UI resets immediately
    chat.setMessages([]);

    // 3. Navigate to a clean chat (same behaviour as the "New Chat" button)
    if (router && router.replace) {
      router.replace({ pathname: router.pathname }, undefined, {
        shallow: true,
      });
    }
  };

  return (
    <Stack
      w="full"
      direction="column"
      maxW="140"
      h="full"
      style={{
        maxHeight: "100vh",
      }}
    >
      <Stack
        direction="column"
        p="4"
        gap="2"
        align="flex-start"
        h="full"
        style={{
          overflowY: "auto",
        }}
        tgphRef={messagesContainerRef}
      >
        {messages.map((message) => {
          const formattedMessage = formatMessage(message);
          return (
            <Stack
              bg={message.role === "user" ? "surface-1" : "black"}
              data-tgph-appearance={message.role === "user" ? "light" : "dark"}
              px="3"
              py="2"
              rounded="4"
              border="px"
              ml={message.role === "user" ? "auto" : "0"}
              key={message.id}
            >
              {formattedMessage === "Loading" ? (
                <Icon
                  icon={LoaderCircle}
                  alt="Loading"
                  data-tgph-button-loading-icon
                />
              ) : (
                <Text as="span" data-tgph-markdown>
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {formattedMessage}
                  </ReactMarkdown>
                </Text>
              )}
            </Stack>
          );
        })}
      </Stack>
      <Stack w="full" direction="column">
        <Stack
          align="center"
          justify="space-between"
          px="4"
          py="2"
          borderTop="px"
          borderBottom="px"
        >
          <Tooltip label="Delete chat">
            <Button
              icon={{ icon: Trash, alt: "Delete chat" }}
              variant="ghost"
              onClick={() => {
                handleDelete();
              }}
            />
          </Tooltip>
          <Button
            trailingIcon={{ icon: Send, "aria-hidden": true }}
            variant="ghost"
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            Send
          </Button>
        </Stack>
        <TextArea
          as="textarea"
          value={input}
          placeholder="Ask me to build a component..."
          onChange={(e) => handleInputChange(e)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleSubmit();
            }
          }}
          px="6"
          py="4"
          h="40"
          bg="surface-1"
          border="0"
          rounded="0"
          w="full"
          data-chat-textarea
        />
      </Stack>
    </Stack>
  );
};

export { Chat };

import { Box, Stack } from "@telegraph/layout";
import { Text } from "@telegraph/typography";
import { TextArea } from "@telegraph/textarea";
import { useChat } from "@ai-sdk/react";
import { useMemo } from "react";
import dynamic from "next/dynamic";

const CodeRenderer = dynamic(
  () => import("../CodeRenderer").then((m) => m.CodeRenderer),
  {
    ssr: false,
  }
);

const Chat = () => {
  const { messages, input, handleInputChange, handleSubmit } = useChat();

  // Extract the most recent React/TSX code block returned by the assistant
  // This is derived state – we compute it from the latest messages array, so no extra local state needed.
  const generatedReactCode = useMemo(() => {
    // Traverse messages from newest to oldest to get the latest generated code
    for (let i = messages.length - 1; i >= 0; i -= 1) {
      const msg = messages[i];
      if (msg.role === "assistant" && typeof msg.content === "string") {
        // Look for a fenced code block: ```tsx ... ``` (tsx / jsx / js also acceptable)
        const match = msg.content.match(
          /```(?:t?sx|jsx|javascript)?\s*\n([\s\S]*?)\n```/
        );
        if (match) {
          return match[1].trim();
        }
      }
    }
    return null;
  }, [messages]);

  return (
    <Stack w="full">
      <Stack
        h="full"
        bg="surface-2"
        w="full"
        direction="column"
        style={{ minHeight: "100vh" }}
        maxW="140"
      >
        <Stack direction="column" mt="auto">
          <Stack direction="column" p="4" gap="2" align="flex-start">
            {messages.map((message) => (
              <Stack
                bg={message.role === "user" ? "surface-1" : "black"}
                data-tgph-appearance={
                  message.role === "user" ? "light" : "dark"
                }
                px="3"
                py="2"
                rounded="4"
                border="px"
                ml={message.role === "user" ? "auto" : "0"}
                key={message.id}
              >
                <Text as="span">
                  {typeof message.content === "string"
                    ? message.content
                    : JSON.stringify(message.content)}
                </Text>
              </Stack>
            ))}
          </Stack>
          <Stack w="full">
            {/* <button onClick={() => generateCode.run()}>Generate Code</button> */}
            <TextArea
              as="textarea"
              value={input}
              onChange={(e) => handleInputChange(e)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
              h="40"
              bg="surface-1"
              rounded="0"
              w="full"
            />
          </Stack>
        </Stack>
      </Stack>
      {/* Preview the extracted React code (optional). Remove or replace with custom rendering as needed. */}
      {generatedReactCode && (
        <Stack
          bg="surface-1"
          w="full"
          p="4"
          border="px"
          rounded="4"
          direction="column"
          mt="4"
          gap="4"
        >
          <Stack direction="column">
            <Text as="span" weight="semi-bold" mb="2">
              Generated React Code
            </Text>
            <Box as="pre" style={{ whiteSpace: "pre-wrap" }}>
              {generatedReactCode}
            </Box>
          </Stack>

          {/* Live preview */}
          <Stack direction="column">
            <Text as="span" weight="semi-bold" mb="2">
              Live Preview
            </Text>
            <Box border="px" rounded="2" p="3">
              <CodeRenderer code={generatedReactCode} />
            </Box>
          </Stack>
        </Stack>
      )}
    </Stack>
  );
};

export { Chat };

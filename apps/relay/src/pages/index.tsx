import { Message, useChat } from "@ai-sdk/react";
import { Button } from "@telegraph/button";
import { Box, Stack } from "@telegraph/layout";
import { Plus, LogOut } from "lucide-react";
import { useRouter } from "next/router";
import { useEffect, useMemo } from "react";

import { Chat } from "@/components/Chat";
import { PreviousChats } from "@/components/PreviousChats";
import { Viewer } from "@/components/Viewer";
import { saveChatToStorage } from "@/utils/chatStorage";

export default function Home() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('relay_session');
      router.push('/login');
    }
  };

  // Extract chat id (cid) from the query string if present – e.g. /?cid=abc123
  const chatIdFromUrl = useMemo(() => {
    if (typeof window === "undefined") return undefined;
    return typeof router.query.cid === "string" ? router.query.cid : undefined;
  }, [router.query.cid]);

  // Initialise useChat with the id (may be undefined and generated later by the hook itself)
  const chat = useChat({ id: chatIdFromUrl });

  /*
   * ----------------------------------------------------------------------------
   * Persist chat messages whenever they change
   * ----------------------------------------------------------------------------
   */
  useEffect(() => {
    if (!chat.id) return;

    saveChatToStorage(chat.id, chat.messages);
  }, [chat.id, chat.messages]);

  /*
   * ----------------------------------------------------------------------------
   * Load existing messages from localStorage (only once after mount)
   * ----------------------------------------------------------------------------
   */
  useEffect(() => {
    if (!chat.id) return;

    // Only restore if there are no messages yet (fresh chat instance)
    if (chat.messages.length > 0) return;

    try {
      const stored = localStorage.getItem(`chat_${chat.id}`);
      if (stored) {
        const parsed: Message[] = JSON.parse(stored);
        // Guard: basic shape check (array & objects with role/content)
        if (Array.isArray(parsed)) {
          chat.setMessages(parsed);
        }
      }
    } catch {
      /* ignore JSON parse errors */
    }
    // We only want this effect to run once when chat.id stabilises
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chat.id]);

  /*
   * ----------------------------------------------------------------------------
   * Update the URL with the generated chat id so the conversation can be shared
   * ----------------------------------------------------------------------------
   */
  useEffect(() => {
    if (!router.isReady || !chat.id) return;

    const currentCid =
      typeof router.query.cid === "string" ? router.query.cid : undefined;
    if (currentCid === chat.id) return;
    const otherQuery = { ...router.query };

    router.replace(
      { pathname: router.pathname, query: { ...otherQuery, cid: chat.id } },
      undefined,
      {
        shallow: true,
      },
    );
  }, [chat.id, router]);

  return (
    <Stack>
      <Stack
        h="full"
        borderRight="px"
        w="full"
        maxW="140"
        direction="column"
        justify="space-between"
        style={{
          minHeight: "100vh",
        }}
      >
        <Stack
          align="center"
          px="4"
          minH="14"
          borderBottom="px"
          direction="row"
          justify="space-between"
        >
          <Box w="60">
            <PreviousChats />
          </Box>
          <Stack direction="row" gap="2" align="center">
            <Button
              color="accent"
              trailingIcon={{ icon: Plus, "aria-hidden": true }}
              size="2"
              onClick={() => {
                router.replace({ pathname: router.pathname }, undefined, {
                  shallow: true,
                });
              }}
            >
              New Chat
            </Button>
            <Button
              variant="ghost"
              icon={{ icon: LogOut, alt: "Logout" }}
              size="2"
              onClick={handleLogout}
            />
          </Stack>
        </Stack>
        <Chat chat={chat} />
      </Stack>
      <Stack w="full">
        <Viewer chat={chat} />
      </Stack>
    </Stack>
  );
}

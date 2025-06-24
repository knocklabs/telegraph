import { useEffect, useState } from "react";
import {
  getStoredChats,
  CHAT_STORAGE_EVENT,
  deleteChatFromStorage,
  CHAT_STORAGE_PREFIX,
} from "@/utils/chatStorage";

// Helper: sort chats by the createdAt timestamp of their first message (newest → oldest)
function sortChats<T extends { messages: { createdAt?: Date | string }[] }>(
  chats: T[]
) {
  return [...chats].sort((a, b) => {
    const aDate = a.messages[0]?.createdAt
      ? new Date(a.messages[0].createdAt as string).getTime()
      : 0;
    const bDate = b.messages[0]?.createdAt
      ? new Date(b.messages[0].createdAt as string).getTime()
      : 0;
    return bDate - aDate; // Descending – newest first
  });
}

// Helper: remove chats that have no messages **unless** they are the active chat
function cleanupEmptyChats(activeChatId?: string) {
  if (typeof window === "undefined" || !window.localStorage) return;

  for (let i = 0; i < localStorage.length; i += 1) {
    const key = localStorage.key(i);
    if (!key || !key.startsWith(CHAT_STORAGE_PREFIX)) continue;

    const id = key.slice(CHAT_STORAGE_PREFIX.length);
    if (activeChatId && id === activeChatId) continue; // keep active chat even if empty

    const raw = localStorage.getItem(key);

    // Remove outright if the value is missing / null
    if (!raw) {
      deleteChatFromStorage(id);
      continue;
    }

    try {
      const messages = JSON.parse(raw);
      if (Array.isArray(messages) && messages.length === 0) {
        deleteChatFromStorage(id);
      }
    } catch {
      /* Malformed entry – remove it */
      deleteChatFromStorage(id);
    }
  }
}

/**
 * React hook that returns an up-to-date list of chats saved in localStorage.
 *
 * Chats are
 *  • Sorted by their creation date (newest first)
 *  • Automatically cleaned up if they are empty **and not** the active chat
 *
 * The hook re-runs when:
 *  • The current document writes/deletes chats via the helper functions
 *  • Any other tab updates localStorage (native `storage` event)
 */
export function useStoredChats(activeChatId?: string) {
  const [chats, setChats] = useState(() => sortChats(getStoredChats()));

  useEffect(() => {
    function refresh() {
      cleanupEmptyChats(activeChatId);
      setChats(sortChats(getStoredChats()));
    }

    // Initial cleanup on mount
    cleanupEmptyChats(activeChatId);

    // Update when another document modifies storage
    window.addEventListener("storage", refresh);
    // Update when this document broadcasts a change
    window.addEventListener(CHAT_STORAGE_EVENT, refresh as EventListener);

    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener(CHAT_STORAGE_EVENT, refresh as EventListener);
    };
    // Re-create listeners when the active chat changes so we honour the exclusion rule
  }, [activeChatId]);

  return chats;
}

import { Message } from "@ai-sdk/react";

/**
 * Prefix used for all chat keys in localStorage.
 * E.g. a chat with id "abc123" is stored as `chat_abc123`.
 */
export const CHAT_STORAGE_PREFIX = "chat_";

/** Custom event name emitted whenever a chat is added, updated or removed */
export const CHAT_STORAGE_EVENT = "chat-storage";

/**
 * Dispatch a custom event so listeners (hooks/components) in the same tab can
 * react immediately to changes. The native `storage` event only fires across
 * documents, not within the same page that made the change.
 */
function broadcastChatStorageChange() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(CHAT_STORAGE_EVENT));
}

/**
 * Reads every key in localStorage that starts with `chat_` and returns the
 * parsed messages alongside the chat id.
 *
 * NOTE: This function only works in a browser environment. When executed on
 * the server it will always return an empty array.
 */
export function getStoredChats(): { id: string; messages: Message[] }[] {
  if (typeof window === "undefined" || !window.localStorage) return [];

  const chats: { id: string; messages: Message[] }[] = [];

  for (let i = 0; i < localStorage.length; i += 1) {
    const key = localStorage.key(i);
    if (!key || !key.startsWith(CHAT_STORAGE_PREFIX)) continue;

    const raw = localStorage.getItem(key);
    if (!raw) continue;

    try {
      const messages: Message[] = JSON.parse(raw);
      // Skip chats that have no messages stored – they are effectively empty
      if (messages.length === 0) continue;
      const id = key.slice(CHAT_STORAGE_PREFIX.length);
      chats.push({ id, messages });
    } catch {
      // Ignore malformed entries – may happen if the user manually manipulates storage.
    }
  }

  return chats;
}

/** Persist a chat (insert or update). */
export function saveChatToStorage(id: string, messages: Message[]): void {
  if (typeof window === "undefined") return;
  // Avoid writing empty message arrays – this would overwrite existing content
  if (messages.length === 0) return;
  try {
    localStorage.setItem(
      `${CHAT_STORAGE_PREFIX}${id}`,
      JSON.stringify(messages)
    );
    broadcastChatStorageChange();
  } catch {
    /* ignore quota or serialisation errors */
  }
}

/** Remove a chat from localStorage. */
export function deleteChatFromStorage(id: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(`${CHAT_STORAGE_PREFIX}${id}`);
    broadcastChatStorageChange();
  } catch {
    /* ignore */
  }
}

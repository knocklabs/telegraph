import { useStoredChats } from "@/hooks/useStoredChats";
import { useRouter } from "next/router";
import { Combobox } from "@telegraph/combobox";

const PreviousChats = () => {
  const router = useRouter();
  const activeChatId =
    typeof router.query.cid === "string" ? router.query.cid : undefined;
  const storedChats = useStoredChats(activeChatId);

  return (
    <Combobox.Root
      value={activeChatId}
      onValueChange={(value) => {
        router.replace({ pathname: router.pathname, query: { cid: value } });
      }}
      placeholder="Search previous chats"
    >
      <Combobox.Trigger />
      <Combobox.Content>
        <Combobox.Search />
        <Combobox.Empty>No previous chats</Combobox.Empty>
        <Combobox.Options>
          {storedChats.map((chat) => (
            <Combobox.Option key={chat.id} value={chat.id}>
              {chat?.messages?.[0]?.content || chat.id}
            </Combobox.Option>
          ))}
        </Combobox.Options>
      </Combobox.Content>
    </Combobox.Root>
  );
};

export { PreviousChats };

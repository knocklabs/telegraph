import { Chat } from "@/components/Chat";
import { Stack } from "@telegraph/layout";

export default function Home() {
  return (
    <Stack>
      <Stack
        h="full"
        borderRight="px"
        bg="surface-1"
        w="full"
        style={{
          minHeight: "100vh",
        }}
      >
        <Chat />
      </Stack>
    </Stack>
  );
}

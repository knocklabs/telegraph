import type { Meta } from "@storybook/react";
import { Button } from "@telegraph/button";
import { Heading } from "@telegraph/typography";

import { Modal as TelegraphModal } from "./Modal";

const meta: Meta<typeof TelegraphModal> = {
  title: "Components/Modal",
  // component: TelegraphModal,
};
export default meta;

export const Modal = {
  render: () => (
    <TelegraphModal.Root open={true}>
      <TelegraphModal.Content>
        <TelegraphModal.Header>
          <Heading as="h2" size="3">
            Modal title
          </Heading>
          <TelegraphModal.Close />
        </TelegraphModal.Header>
        <TelegraphModal.Body>Modal body</TelegraphModal.Body>
        <TelegraphModal.Footer>
          <Button variant="outline">Cancel</Button>
          <Button color="accent">Save</Button>
        </TelegraphModal.Footer>
      </TelegraphModal.Content>
    </TelegraphModal.Root>
  ),
};

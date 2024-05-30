"use client";
import { Heading } from "@telegraph/typography";
import { Button } from "@telegraph/button";
import { Icon, Lucide } from "@telegraph/icon";

export default function Home() {
  return (
    <div className="tgph">
      <Icon
        icon={Lucide.Bed}
        alt="add icon"
        color="blue"
        size="9"
        variant="secondary"
      />
      <Icon
        icon={Lucide.Bell}
        alt="add icon"
        color="blue"
        size="9"
        variant="secondary"
      />
      <Button
        color="blue"
        leadingIcon={{ icon: Lucide.Info, alt: "Add" }}
        variant="solid"
      >
        Button
      </Button>
      <Heading color="blue" as="h2">
        Heading
      </Heading>
    </div>
  );
}

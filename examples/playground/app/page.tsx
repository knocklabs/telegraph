"use client";
import { Heading } from "@telegraph/typography";
import { Button } from "@telegraph/button";
import { Icon, addSharp, chevronDown } from "@telegraph/icon";
import { Field } from "@telegraph/form";
import { TextField } from "@telegraph/text-field";
import React from "react";

export default function Home() {
  const [value, setValue] = React.useState<string>("");
  return (
    <main className="tgph">
      <Field
        label="Label"
        value={value}
        onChange={setValue}
        error={true}
      />
      <Icon
        alt="add icon"
        icon={addSharp}
        color="red"
        size="9"
        variant="primary"
      />
      <div style={{ display: "block", gap: "0rem" }}>
        <Button.Root color="red" variant="solid" size="2">
          <Button.Icon icon={addSharp} alt="create" />
        </Button.Root>
        <Button.Root color="red" variant="solid" size="2">
          <Button.Text>Button</Button.Text>
        </Button.Root>
        <Button.Root color="red" variant="solid">
          <Button.Icon icon={addSharp} alt="create" />
          <Button.Text>Button</Button.Text>
        </Button.Root>
        <Button.Root color="red" variant="soft" size="2">
          <Button.Text>Button</Button.Text>
          <Button.Icon icon={chevronDown} alt="Arrow pointing down" />
        </Button.Root>
        <Button.Root color="gray" variant="outline" size="2">
          <Button.Icon icon={addSharp} alt="create" />
          <Button.Text>Button</Button.Text>
          <Button.Icon icon={chevronDown} alt="Arrow pointing down" />
        </Button.Root>
        <Button icon={{ icon: addSharp, alt: "create" }} color="accent" />
      </div>
      <Heading as="h3" size="9">
        Heading
      </Heading>
      <Heading as="h3" size="8">
        Heading
      </Heading>
      <Heading as="h3" size="7">
        Heading
      </Heading>
      <Heading as="h3" size="6">
        Heading
      </Heading>
      <Heading as="h3" size="5">
        Heading
      </Heading>
      <Heading as="h3" size="4">
        Heading
      </Heading>
      <Heading as="h3" size="3">
        Heading
      </Heading>
      <Heading as="h3" size="2">
        Heading
      </Heading>
      <Heading as="h3" size="1">
        Heading
      </Heading>
      <Heading as="h3" size="0">
        Heading
      </Heading>
      <Heading as="h3">Heading</Heading>
      <Heading as="h3" color="red">
        Heading
      </Heading>
      <Heading as="h3" color="beige">
        Heading
      </Heading>
      <Heading as="h3" color="blue">
        Heading
      </Heading>
      <Heading as="h3" color="green">
        Heading
      </Heading>
      <Heading as="h3" color="yellow">
        Heading
      </Heading>
      <Heading as="h3" color="accent">
        Heading
      </Heading>
      <Heading as="h3" align="left">
        Heading
      </Heading>
      <Heading as="h3" align="center">
        Heading
      </Heading>
      <Heading as="h3" align="right">
        Heading
      </Heading>
    </main>
  );
}

"use client"
import { Heading } from "@telegraph/typography";
import { Button } from "@telegraph/button";

export default function Home() {
  return (
    <main>
      <Button.Root color="red" variant="ghost">
        <Button.Text>Button</Button.Text>
      </Button.Root>
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

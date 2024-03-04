"use client";
import { Heading } from "@telegraph/typography";
import { Button } from "@telegraph/button";
import { Icon, addSharp, chevronDown } from "@telegraph/icon";
import { Tag } from "@telegraph/tag";

export default function Home() {
  return (
    <main className="tgph">
      <div style={{ margin: "80px 200px" }}>
        <div>
          <Tag text="Tag" size="1" color="default" />
          <Tag text="Tag" size="1" color="accent" />
          <Tag text="Tag" size="1" color="red" />
          <Tag text="Tag" size="1" color="green" />
          <Tag text="Tag" size="1" color="blue" />
          <Tag text="Tag" size="1" color="yellow" />
        </div>
        <div>
          <Tag text="Tag" size="2" color="default" />
          <Tag text="Tag" size="2" color="accent" />
          <Tag text="Tag" size="2" color="red" />
          <Tag text="Tag" size="2" color="green" />
          <Tag text="Tag" size="2" color="blue" />
          <Tag text="Tag" size="2" color="yellow" />
        </div>
        <div>
          <Tag text="Tag" size="2" color="default" variant="solid" />
          <Tag text="Tag" size="2" color="accent" variant="solid" />
          <Tag text="Tag" size="2" color="red" variant="solid" />
          <Tag text="Tag" size="2" color="green" variant="solid" />
          <Tag text="Tag" size="2" color="blue" variant="solid" />
          <Tag text="Tag" size="2" color="yellow" variant="solid" />
        </div>
        <div>
          <Tag
            text="Tag"
            size="2"
            color="default"
            variant="solid"
            icon={{ icon: addSharp }}
          />
          <Tag
            text="Tag"
            size="2"
            color="accent"
            variant="solid"
            icon={{ icon: addSharp }}
          />
          <Tag
            text="Tag"
            size="2"
            color="red"
            variant="solid"
            icon={{ icon: addSharp }}
          />
          <Tag
            text="Tag"
            size="2"
            color="green"
            variant="solid"
            icon={{ icon: addSharp }}
          />
          <Tag
            text="Tag"
            size="2"
            color="blue"
            variant="solid"
            icon={{ icon: addSharp }}
          />
          <Tag
            text="Tag"
            size="2"
            color="yellow"
            variant="solid"
            icon={{ icon: addSharp }}
          />
        </div>
        <div>
          <Tag
            text="Tag"
            size="2"
            color="default"
            variant="soft"
            icon={{ icon: addSharp }}
          />
          <Tag
            text="Tag"
            size="2"
            color="accent"
            variant="soft"
            icon={{ icon: addSharp }}
          />
          <Tag
            text="Tag"
            size="2"
            color="red"
            variant="soft"
            icon={{ icon: addSharp }}
          />
          <Tag
            text="Tag"
            size="2"
            color="green"
            variant="soft"
            icon={{ icon: addSharp }}
          />
          <Tag
            text="Tag"
            size="2"
            color="blue"
            variant="soft"
            icon={{ icon: addSharp }}
          />
          <Tag
            text="Tag"
            size="2"
            color="yellow"
            variant="soft"
            icon={{ icon: addSharp }}
          />
        </div>
        <div>
          <Tag
            text="Tag"
            size="2"
            color="default"
            variant="soft"
            icon={{ icon: addSharp }}
            onCopy={() => {}}
          />
          <Tag
            text="Tag"
            size="2"
            color="gray"
            variant="soft"
            icon={{ icon: addSharp }}
            onCopy={() => {}}
          />
          <Tag
            text="Tag"
            size="2"
            color="accent"
            variant="soft"
            icon={{ icon: addSharp }}
            onCopy={() => {}}
          />
          <Tag
            text="Tag"
            size="2"
            color="red"
            variant="soft"
            icon={{ icon: addSharp }}
            onCopy={() => {}}
          />
          <Tag
            text="Tag"
            size="2"
            color="green"
            variant="soft"
            icon={{ icon: addSharp }}
            onCopy={() => {}}
          />
          <Tag
            text="Tag"
            size="2"
            color="blue"
            variant="soft"
            icon={{ icon: addSharp }}
            onCopy={() => {}}
          />
          <Tag
            text="Tag"
            size="2"
            color="yellow"
            variant="soft"
            icon={{ icon: addSharp }}
            onCopy={() => {}}
          />
        </div>
      </div>
      <Icon
        alt="add icon"
        icon={addSharp}
        color="red"
        size="9"
        variant="primary"
      />
      <div style={{ display: "block", gap: "0rem" }}>
        <div>
          <Button.Root color="green" variant="solid">
            <Button.Icon icon={addSharp} alt="create" />
            <Button.Text>Button</Button.Text>
          </Button.Root>
          <Button.Root color="blue" variant="solid">
            <Button.Icon icon={addSharp} alt="create" />
            <Button.Text>Button</Button.Text>
          </Button.Root>
          <Button.Root color="yellow" variant="solid">
            <Button.Icon icon={addSharp} alt="create" />
            <Button.Text>Button</Button.Text>
          </Button.Root>
        </div>
        <div>
          <Button.Root color="green" variant="soft">
            <Button.Icon icon={addSharp} alt="create" />
            <Button.Text>Button</Button.Text>
          </Button.Root>
          <Button.Root color="blue" variant="soft">
            <Button.Icon icon={addSharp} alt="create" />
            <Button.Text>Button</Button.Text>
          </Button.Root>
          <Button.Root color="yellow" variant="soft">
            <Button.Icon icon={addSharp} alt="create" />
            <Button.Text>Button</Button.Text>
          </Button.Root>
        </div>
        <div>
          <Button.Root color="green" variant="outline">
            <Button.Icon icon={addSharp} alt="create" />
            <Button.Text>Button</Button.Text>
          </Button.Root>
          <Button.Root color="blue" variant="outline">
            <Button.Icon icon={addSharp} alt="create" />
            <Button.Text>Button</Button.Text>
          </Button.Root>
          <Button.Root color="yellow" variant="outline">
            <Button.Icon icon={addSharp} alt="create" />
            <Button.Text>Button</Button.Text>
          </Button.Root>
        </div>
        <div>
          <Button.Root color="green" variant="ghost">
            <Button.Icon icon={addSharp} alt="create" />
            <Button.Text>Button</Button.Text>
          </Button.Root>
          <Button.Root color="blue" variant="ghost">
            <Button.Icon icon={addSharp} alt="create" />
            <Button.Text>Button</Button.Text>
          </Button.Root>
          <Button.Root color="yellow" variant="ghost">
            <Button.Icon icon={addSharp} alt="create" />
            <Button.Text>Button</Button.Text>
          </Button.Root>
        </div>
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

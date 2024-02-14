"use client";
import { Heading } from "@telegraph/typography";
import { Icon, addSharp } from "@telegraph/icon";
export default function Home() {
  return (
    <main>
      {/* Un-scoped Components w/o telegraph styles */}
      <div>
        <button>hi</button>
        <Heading as="h1" size="9" color="red">
          Heading
        </Heading>
        <Icon icon={addSharp} alt="create" color="blue" />
      </div>
      {/* Scoped Components w/ telegraph styles */}
      <div className="tgph">
        <button>hi</button>
        <Heading as="h1" size="9" color="red">
          Heading
        </Heading>
        <Icon icon={addSharp} alt="create" color="blue"/>
      </div>
    </main>
  );
}

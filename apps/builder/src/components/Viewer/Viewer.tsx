import { Stack } from "@telegraph/layout";

type ViewerProps = {
  code: string;
};

const Viewer = ({ code }: ViewerProps) => {
  return <Stack w="full" dangerouslySetInnerHTML={{ __html: code }} />;
};

export { Viewer };

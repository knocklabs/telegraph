import { button } from "./Button.css";

type ButtonProps = {
  variant: "solid" | "outline" | "ghost";
  children: React.ReactNode;
};

const Button = ({ variant, children }: ButtonProps) => {
  return <button className={button({ variant })}>{children}</button>;
};

export { Button };

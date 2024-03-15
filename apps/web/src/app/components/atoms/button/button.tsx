import { ButtonProps } from "./types";


export function Button({ children, ...props }: ButtonProps) {
  return <button {...props}>{children}</button>;
}
import { Button, Link } from "@mui/material";
import React from "react";

interface FileButtonProps {
  href: string;
  children?: string | JSX.Element | JSX.Element[];
}
export default function FileButton({ href, children }: FileButtonProps) {
  return (
    <Link target="_blank" href={href}>
      <Button color="secondary" disabled={!href}>
        {children}
      </Button>
    </Link>
  );
}

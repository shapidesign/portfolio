"use client";

import { memo, type KeyboardEvent, type ReactNode } from "react";

type SpecimenTextProps = Readonly<{
  as?: "span" | "p" | "h2";
  id?: string;
  className?: string;
  multiline?: boolean;
  children: ReactNode;
}>;

function SpecimenTextBase({
  as: Tag = "span",
  id,
  className,
  multiline = false,
  children,
}: SpecimenTextProps) {
  return (
    <Tag
      id={id}
      className={className ? `kt-live ${className}` : "kt-live"}
      contentEditable="plaintext-only"
      suppressContentEditableWarning
      spellCheck={false}
      onKeyDown={(event: KeyboardEvent) => {
        if (!multiline && event.key === "Enter") event.preventDefault();
      }}
    >
      {children}
    </Tag>
  );
}

// ponytail: skip later renders so typing survives controls and form updates. A refresh remounts the original text.
export const SpecimenText = memo(SpecimenTextBase, () => true);

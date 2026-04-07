import type { Metadata } from "next";
import { WorkVisitMarker } from "@/components/ui/WorkVisitMarker";

export const metadata: Metadata = {
  title: "Work",
};

export default function WorkLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <WorkVisitMarker />
      {children}
    </>
  );
}

import { WorkVisitMarker } from "@/components/ui/WorkVisitMarker";

export default function WorkLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <WorkVisitMarker />
      {children}
    </>
  );
}

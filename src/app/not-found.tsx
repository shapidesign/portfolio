import Link from "next/link";
import { GeometricAccent } from "@/components/ui/GeometricAccent";

export default function NotFound() {
  return (
    <main className="section content-wrap not-found-page">
      <div className="not-found-shapes" aria-hidden>
        <GeometricAccent variant="square" color="primary" size={64} />
        <GeometricAccent variant="circle" color="blue" size={64} />
        <GeometricAccent variant="triangle" color="secondary" size={64} />
      </div>
      <h1>404</h1>
      <p className="lead">This page doesn&apos;t exist — but plenty of good work does.</p>
      <div className="not-found-actions">
        <Link href="/" className="button button-primary">
          Back to Home
        </Link>
        <Link href="/work" className="button button-ghost">
          View Work
        </Link>
      </div>
    </main>
  );
}

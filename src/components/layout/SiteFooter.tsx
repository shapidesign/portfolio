import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="content-wrap footer-row">
        <p className="footer-copy">Visual creator portfolio by Yehonatan Shapira.</p>
        <div className="footer-links">
          <Link href="/work">Work</Link>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
        </div>
      </div>
    </footer>
  );
}

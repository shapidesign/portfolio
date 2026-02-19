import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="content-wrap footer-row">
        <p className="footer-copy">Portfolio by Yehonatan Shapira.</p>
        <div className="footer-links">
          <Link href="/work">Work</Link>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
          <a
            href="https://www.linkedin.com/in/yehonatan-shapira"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn profile"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  );
}

/** Canonical public site URL (www — primary domain on Vercel). */
export const SITE_ORIGIN = "https://www.alefsofit.com";

/** Hostname shown in OG artwork and form subjects (apex, no scheme). */
export const SITE_HOST = "alefsofit.com";

export const SITE_NAME = "Alef Sofit — Yehonatan Shapira";

/** Former portfolio hostnames — redirect to SITE_ORIGIN when the site is served on them. */
export const LEGACY_REDIRECT_HOSTS = ["shapidesign.com", "www.shapidesign.com"] as const;

/** Inline script for <head> — runs before paint when the build is served on a legacy host. */
export const LEGACY_DOMAIN_REDIRECT_SCRIPT = `(function(){var h=location.hostname;var legacy=${JSON.stringify(LEGACY_REDIRECT_HOSTS)};if(legacy.indexOf(h)!==-1){location.replace("${SITE_ORIGIN}"+location.pathname+location.search+location.hash);}})();`;

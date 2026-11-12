import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { defineConfig } from "vite";

const SITE = "https://www.umersyedahmed.com";

function checkoutMode() {
  const mode = process.env.VITE_CHECKOUT_MODE;
  return mode === "test" || mode === "live" ? mode : "demo";
}

function stripTestNotices(html) {
  return html.replace(
    /<([a-zA-Z0-9]+)(\s[^>]*\btest-notice\b[^>]*)>[\s\S]*?<\/\1>/g,
    "",
  );
}

function hideDemoOnly(html) {
  return html.replace(
    /<([a-zA-Z0-9]+)([^>]*\bdemo-only\b[^>]*)>/g,
    (full, tag, attrs) => {
      if (/\shidden(\s|=|>|$)/.test(attrs)) return full;
      return `<${tag}${attrs} hidden>`;
    },
  );
}

function showTestNotices(html) {
  return html.replace(
    /(<[a-zA-Z0-9]+\s[^>]*\btest-notice\b[^>]*)\s+hidden/g,
    "$1",
  );
}

const siteFlags = {
  name: "site-flags",
  transformIndexHtml(html) {
    const mode = checkoutMode();
    let out = html;
    if (mode === "test") {
      out = showTestNotices(out);
      out = hideDemoOnly(out);
    } else {
      out = stripTestNotices(out);
    }
    if (mode === "live") {
      out = hideDemoOnly(out);
      out = out.replace('id="live-pay-note" hidden', 'id="live-pay-note"');
    }
    const noindex =
      process.env.VITE_NOINDEX === "true"
        ? '<meta name="robots" content="noindex, nofollow" />'
        : "";
    return out.replace("<!--noindex-->", noindex);
  },
  closeBundle() {
    const noindex = process.env.VITE_NOINDEX === "true";
    const body = noindex
      ? "User-agent: *\nDisallow: /\n"
      : `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`;
    writeFileSync(resolve(__dirname, "dist/robots.txt"), body);
  },
};

export default defineConfig({
  base: "/",
  plugins: [siteFlags],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        checkoutSuccess: resolve(__dirname, "checkout/success.html"),
        checkoutCancel: resolve(__dirname, "checkout/cancel.html"),
        privacy: resolve(__dirname, "privacy.html"),
        terms: resolve(__dirname, "terms.html"),
      },
    },
  },
});

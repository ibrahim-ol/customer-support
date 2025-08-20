import { PropsWithChildren, type FC } from "hono/jsx";
import { Config } from "./config.ts";
import { html } from "hono/html";

export function BaseLayout(props: PropsWithChildren) {
  return html`
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
        <style type="text/tailwindcss">
          @theme {
            --color-black: #000000;
            --color-charcoal: #111827;
            --color-slate: #374151;
            --color-neutral: #6b7280;
            --color-light-gray: #d1d5db;
            --color-off-white: #f3f4f6;
            --color-white: #ffffff;

            /* ===== Accent ===== */
            --color-accent: #06b6d4; /* Accent – buttons, links, key highlights */
            --color-accent-dark: #0e7490; /* Dark accent – button hover, active states */
            --color-accent-light: #67e8f9; /* Light accent – subtle highlights, gradient blends */
          }
        </style>
        <title>${Config.APP_NAME}</title>
      </head>
      <body>
        ${props.children}
      </body>
    </html>
  `;
}

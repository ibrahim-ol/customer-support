import { PropsWithChildren, type FC } from "hono/jsx";
import { html } from "hono/html";
import { render } from "hono/jsx/dom";
import { Constants } from "./constants.ts";

export function BaseLayout(props: PropsWithChildren<{ scriptName?: string }>) {
  const script = props.scriptName
    ? html`<div id="root"></div>
        <script type="module" src="/static/fe/${props.scriptName}.js"></script>`
    : "";
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
            --color-accent: #06b6d4;
            --color-accent-dark: #0e7490;
            --color-accent-light: #67e8f9;
          }
        </style>
        <title>${Constants.APP_NAME}</title>
      </head>
      <body>
        ${props.children} ${script}
      </body>
    </html>
  `;
}

export function RenderClientView({ name }: { name: string }) {
  return <BaseLayout scriptName={name} />;
}

export function setupView(App: FC) {
  if (typeof document !== "undefined") {
    const root = document.getElementById("root");
    render(<App />, root!);
  }
}

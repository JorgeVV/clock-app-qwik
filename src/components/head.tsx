import { component$ } from "@builder.io/qwik";
import type { DocumentLink } from "@builder.io/qwik-city";
import { useDocumentHead, useLocation } from "@builder.io/qwik-city";
import inter300 from "~/assets/fonts/inter/inter-v12-latin-300.woff2";
import inter700 from "~/assets/fonts/inter/inter-v12-latin-700.woff2";
import interRegular from "~/assets/fonts/inter/inter-v12-latin-regular.woff2";

export const Head = component$(() => {
  const head = useDocumentHead();
  const loc = useLocation();

  const links: Array<DocumentLink> = [
    { rel: "icon", href: "/favicon.png", type: "image/png" },
    ...[inter700, interRegular, inter300].map((font) => ({
      rel: "preload",
      href: font,
      as: "font",
      type: "font/woff2",
      crossorigin: "",
    })),
    ...head.links,
  ];

  return (
    <head>
      <meta charSet="utf-8" />
      <title>{head.title ? head.title : "Clock App"}</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="canonical" href={loc.href} />

      {links.map((l) => (
        <link {...l} />
      ))}

      {head.meta.map((m) => (
        <meta {...m} />
      ))}

      {head.styles.map((s) => (
        <style {...s.props} dangerouslySetInnerHTML={s.style} />
      ))}
    </head>
  );
});

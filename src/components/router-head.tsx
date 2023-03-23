import { component$ } from "@builder.io/qwik";
import {
  useDocumentHead,
  useLocation,
  type DocumentLink,
} from "@builder.io/qwik-city";
import inter300 from "~/assets/fonts/inter/inter-v12-latin-300.woff2";
import inter700 from "~/assets/fonts/inter/inter-v12-latin-700.woff2";
import interRegular from "~/assets/fonts/inter/inter-v12-latin-regular.woff2";

/**
 * The RouterHead component is placed inside of the document `<head>` element.
 */
export const RouterHead = component$(() => {
  const head = useDocumentHead();
  const loc = useLocation();

  const links: Array<DocumentLink> = [
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
    <>
      <meta charSet="utf-8" />
      <link rel="manifest" href="/manifest.json" />
      <title>{head.title ? head.title : "Clock App"}</title>

      <link rel="canonical" href={loc.url.href} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel="icon" type="image/png" href="/favicon.png" />

      {links.map((l) => (
        <link key={l.key} {...l} />
      ))}

      {head.meta.map((m) => (
        <meta key={m.key} {...m} />
      ))}

      {head.styles.map((s) => (
        <style key={s.key} {...s.props} dangerouslySetInnerHTML={s.style} />
      ))}
    </>
  );
});

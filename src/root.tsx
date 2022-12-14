import { component$ } from "@builder.io/qwik";
import { QwikCity, RouterOutlet } from "@builder.io/qwik-city";
import { Head } from "~/components/head";

import "~/global.css";

export default component$(() => {
  return (
    <QwikCity>
      <Head />
      <body class="bs-full bg-black antialiased">
        <RouterOutlet />
      </body>
    </QwikCity>
  );
});

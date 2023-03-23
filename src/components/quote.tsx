import { component$, useSignal } from "@builder.io/qwik";
import { server$ } from "@builder.io/qwik-city";
import { getQuote } from "~/api";

export interface QuoteProps {
  quote: { author: string; content: string };
}

const refreshQuote = server$(getQuote);

export const Quote = component$((props: QuoteProps) => {
  const { quote: defaultQuote } = props;
  const quote = useSignal(defaultQuote);
  const refreshingQuote = useSignal(false);

  return (
    <div class="flex items-start tablet:max-is-xl">
      <figure class="shrink text-body-thin tablet:text-body">
        <blockquote>
          <p class="before:content-[open-quote] after:content-[close-quote]">
            {quote.value.content}
          </p>
        </blockquote>
        <cite class="inline-block font-bold not-italic mbs-2">
          {quote.value.author}
        </cite>
      </figure>
      <form
        class="shrink-0"
        preventdefault:submit
        onSubmit$={async () => {
          refreshingQuote.value = true;
          quote.value = await refreshQuote();
          refreshingQuote.value = false;
        }}
      >
        <button
          class="-m-4 p-4 -mis-0"
          type="submit"
          disabled={refreshingQuote.value}
        >
          <span class="sr-only">Refresh quote</span>
          <svg aria-hidden="true" width="18" height="18" viewBox="0 0 18 18">
            <path
              d="M7.188 10.667a.208.208 0 01.147.355l-2.344 2.206a5.826 5.826 0 009.578-2.488l2.387.746A8.322 8.322 0 013.17 14.94l-2.149 2.022a.208.208 0 01-.355-.148v-6.148h6.52zm7.617-7.63L16.978.958a.208.208 0 01.355.146v6.23h-6.498a.208.208 0 01-.147-.356L13 4.765A5.825 5.825 0 003.43 7.26l-2.386-.746a8.32 8.32 0 0113.76-3.477z"
              fill="#FFF"
              fill-rule="nonzero"
              opacity=".5"
            />
          </svg>
        </button>
      </form>
    </div>
  );
});

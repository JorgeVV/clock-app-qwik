import type { Signal } from "@builder.io/qwik";
import { component$ } from "@builder.io/qwik";
import { useLocation } from "@builder.io/qwik-city";

interface DetailsButtonProps {
  isDetailsVisible: Signal<boolean>;
}

export const DetailsButton = component$((props: DetailsButtonProps) => {
  const { isDetailsVisible } = props;
  const loc = useLocation();
  return (
    <form
      preventdefault:submit
      onSubmit$={() => {
        isDetailsVisible.value = !isDetailsVisible.value;
        const url = new URL(loc.url.href);
        url.searchParams.set("showDetails", `${isDetailsVisible.value}`);
        history.replaceState(null, "", url);
      }}
    >
      <input
        type="hidden"
        name="showDetails"
        required
        value={`${!isDetailsVisible.value}`}
      />
      <button
        class={[
          "group flex items-center rounded-full bg-white p-1 text-button-thin font-bold uppercase text-black/50 pis-4 space-i-4",
          "tablet:p-2 tablet:text-button tablet:pis-7 tablet:space-i-3",
        ]}
      >
        <span class="min-is-[6ch]">
          {isDetailsVisible.value ? "Less" : "More"}
        </span>
        <svg
          class={[
            "fill-current transform stroke-white text-gray transition-colors-transform duration-300 bs-8 is-8 group-hover:text-gray/50 group-active:text-gray/50",
            "tablet:bs-10 tablet:is-10",
            isDetailsVisible.value ? "rotate-180" : "",
          ].join(" ")}
          height={32}
          width={32}
          viewBox="0 0 40 40"
          aria-hidden="true"
        >
          <g fill="none" fill-rule="evenodd">
            <circle fill="currentColor" cx="20" cy="20" r="20" />
            <path
              stroke-width="2"
              d="M14 23l6-6 6 6"
              transform="rotate(180, 20, 20)"
            />
          </g>
        </svg>
      </button>
    </form>
  );
});

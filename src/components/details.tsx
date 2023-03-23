import type { Signal } from "@builder.io/qwik";
import { component$, Fragment } from "@builder.io/qwik";
import type { EndpointData } from "~/api";

export interface DetailsProps {
  details: EndpointData["timeInfo"]["details"];
  daytime: "day" | "night";
  detailsRef: Signal<HTMLElement | undefined>;
}

export const Details = component$((props: DetailsProps) => {
  const { details, daytime, detailsRef } = props;

  return (
    <dl
      ref={detailsRef}
      key="details"
      class={[
        "grid grid-cols-1 items-center gap-y-4 backdrop-blur-lg backdrop-brightness-150 is-full pli-6.5 plb-12",
        "tablet:grid-flow-col tablet:grid-cols-2 tablet:grid-rows-2 tablet:gap-x-10 tablet:gap-y-12 tablet:plb-29 tablet:pis-16",
        "desktop:grid-cols-details desktop:gap-x-24 desktop:gap-y-12 desktop:plb-18 desktop:pis-41",
        daytime === "day" ? "bg-white/75 text-gray" : "bg-black/75 text-white",
      ]}
    >
      {details.map((field, i) => (
        <Fragment key={field.key}>
          <div
            key={field.key}
            class={[
              "flex items-center justify-between",
              "tablet:flex-col tablet:items-start",
            ]}
          >
            <dt
              class={[
                "text-h6-thin uppercase leading-5",
                "tablet:text-h6 tablet:leading-7",
              ]}
            >
              {field.label}
            </dt>
            <dd
              class={[
                "break-all text-h2-thin font-bold text-end",
                "tablet:text-h2-medium tablet:text-start",
                "desktop:text-h2",
              ]}
            >
              {field.value}
            </dd>
          </div>
          {i === 1 && (
            <div
              key="divider"
              class="hidden justify-center self-center bs-full is-full desktop:row-span-2 desktop:flex"
            >
              <div
                class={[
                  "bs-full is-px",
                  { day: "bg-gray/25", night: "bg-white/25" }[daytime],
                ]}
              />
            </div>
          )}
        </Fragment>
      ))}
    </dl>
  );
});

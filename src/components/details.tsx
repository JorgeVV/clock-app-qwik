import { component$, Fragment, Ref } from "@builder.io/qwik";
import { EndpointData } from "../api";

export interface DetailsProps {
  details: EndpointData["timeInfo"]["details"];
  timeStore: {
    daytime: "day" | "night";
  };
  detailsRef: Ref<HTMLElement>;
}

export const Details = component$((props: DetailsProps) => {
  const { details, timeStore, detailsRef } = props;

  return (
    <dl
      ref={detailsRef}
      key="details"
      class={[
        "backdrop-blur-lg backdrop-brightness-150 grid grid-cols-1 items-center gap-y-4 is-full pli-6.5 plb-12",
        "tablet:grid-flow-col tablet:grid-cols-2 tablet:grid-rows-2 tablet:gap-x-10 tablet:plb-29 tablet:pis-16 tablet:gap-y-12",
        "desktop:plb-18 desktop:pis-41 desktop:grid-cols-details desktop:gap-x-24 desktop:gap-y-12",
        timeStore.daytime === "day"
          ? "bg-white/75 text-gray"
          : "bg-black/75 text-white",
      ]}
    >
      {details.map((field, i) => (
        <Fragment>
          <div
            key={field.key}
            class={[
              "flex justify-between items-center",
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
                "text-end text-h2-thin font-bold break-all",
                "tablet:text-start tablet:text-h2-medium",
                "desktop:text-h2",
              ]}
            >
              {field.value}
            </dd>
          </div>
          {i === 1 && (
            <div
              key="divider"
              class="hidden desktop:flex bs-full is-full desktop:row-span-2 self-center justify-center"
            >
              <div
                class={[
                  "bs-full is-px",
                  {
                    day: "bg-gray/25",
                    night: "bg-white/25",
                  }[timeStore.daytime],
                ]}
              />
            </div>
          )}
        </Fragment>
      ))}
    </dl>
  );
});

import type { NoSerialize } from "@builder.io/qwik";
import {
  component$,
  noSerialize,
  useSignal,
  useTask$,
  useVisibleTask$,
} from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { routeLoader$, useDocumentHead } from "@builder.io/qwik-city";
import type { Flipper } from "flip-toolkit";
import type { EndpointData } from "~/api";
import { getLocationInfo, getQuote, getTimeInfo } from "~/api";
import {
  BackgroundImage,
  backgroundImages,
} from "~/components/background-image";
import { Details } from "~/components/details";
import { DetailsButton } from "~/components/details-button";
import { Quote } from "~/components/quote";
import { Time } from "~/components/time";
import {
  animateOpacity,
  createFlipper,
  getGreetingAndDaytime,
  getIpAddressFromHeaders,
} from "~/utils";

export const useData = routeLoader$(
  async ({ request, url, platform }): Promise<EndpointData> => {
    const showDetails = url.searchParams.get("showDetails") === "true";
    const clientIpAddress = getIpAddressFromHeaders(
      request.headers,
      platform.ip
    );
    const [timeInfo, locationInfo, quote] = await Promise.all([
      getTimeInfo(clientIpAddress),
      getLocationInfo(clientIpAddress),
      getQuote(),
    ]);

    const { daytime, greeting, time } = getGreetingAndDaytime(
      timeInfo.utc_datetime,
      timeInfo.timezone
    );
    const { country_code: countryCode, city } = locationInfo;
    const location = `In ${city}, ${countryCode}`;

    return {
      showDetails,
      greeting,
      location,
      quote: {
        id: quote._id,
        author: quote.author,
        content: quote.content,
      },
      timeInfo: {
        daytime,
        time,
        abbreviation: timeInfo.abbreviation,
        details: [
          {
            key: "timezone",
            label: "Current timezone",
            value: timeInfo.timezone,
          },
          {
            key: "day-of-year",
            label: "Day of the year",
            value: timeInfo.day_of_year,
          },
          {
            key: "day-of-week",
            label: "Day of the week",
            value: timeInfo.day_of_week,
          },
          {
            key: "week-number",
            label: "Week number",
            value: timeInfo.week_number,
          },
        ],
      },
    };
  }
);

export default component$(() => {
  const quoteContainerEl = useSignal<HTMLDivElement>();
  const timeContainerEl = useSignal<HTMLDivElement>();
  const detailsContainerEl = useSignal<HTMLDivElement>();
  const parentContainerEl = useSignal<HTMLDivElement>();
  const data = useData();
  const isDetailsVisible = useSignal(data.value.showDetails);
  const greeting = useSignal(data.value.greeting);
  const daytime = useSignal(data.value.timeInfo.daytime);
  const time = useSignal(data.value.timeInfo.time);
  const documentHead = useDocumentHead();

  const flipper = useSignal<NoSerialize<Flipper>>();

  useVisibleTask$(() => {
    const timer = setInterval(() => {
      const currentDate = new Date();
      const timezone = data.value.timeInfo.details.find(
        ({ key }) => key === "timezone"
      )?.value;
      ({
        greeting: greeting.value,
        time: time.value,
        daytime: daytime.value,
      } = getGreetingAndDaytime(currentDate.toISOString(), timezone));
      (documentHead as any).title = `Clock App - ${time.value} ${location}`;
    }, 1000);

    return () => clearInterval(timer);
  });

  // Initialize Flipper
  useVisibleTask$(() => {
    const instance = createFlipper(parentContainerEl.value!);

    instance.addFlipped({
      element: timeContainerEl.value!,
      flipId: "time",
      children: undefined,
      translate: true,
      shouldFlip(_, { reduceMotion }) {
        return !reduceMotion;
      },
    });

    flipper.value = noSerialize(instance);
  });

  // Set FLIP animation to Quote component
  useVisibleTask$(({ track }) => {
    const quoteEl = track(() => quoteContainerEl.value);
    if (flipper.value && quoteEl) {
      flipper.value.addFlipped({
        element: quoteEl,
        flipId: "quote",
        children: undefined,
        opacity: true,
        onAppear: (el) => animateOpacity(el, "in"),
        onExit(el, _index, removeElement) {
          el.setAttribute("aria-hidden", "true");
          // Disable button while transitioning
          const button = el.querySelector("button");
          console.assert(button, "There is no button to disable");
          button!.disabled = true;
          animateOpacity(el, "out", removeElement);
        },
      });
    }
  });

  // Set FLIP animation to Details component
  useVisibleTask$(({ track }) => {
    const detailsEl = track(() => detailsContainerEl.value);
    if (flipper.value && detailsEl) {
      flipper.value.addFlipped({
        element: detailsEl,
        flipId: "details",
        children: undefined,
        opacity: true,
        onAppear: (el, _index, decisionData) => {
          if (decisionData?.current?.reduceMotion) {
            el.style.opacity = "1";
          } else {
            animateOpacity(el, "in");
          }
        },
        onExit(el, _index, removeElement, decisionData) {
          if (decisionData?.current?.reduceMotion) {
            return removeElement();
          }

          el.setAttribute("aria-hidden", "true");
          el.style.pointerEvents = "none";
          animateOpacity(el, "out", removeElement);
        },
      });
    }
  });

  useTask$(({ track }) => {
    track(() => isDetailsVisible.value);
    flipper.value?.recordBeforeUpdate();
  });

  useVisibleTask$(({ track }) => {
    track(() => isDetailsVisible.value);
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    flipper.value?.update(null, { reduceMotion: mediaQuery.matches });
  });

  return (
    <main class="relative text-white bs-full is-full">
      <BackgroundImage daytime={daytime.value} />
      <div
        ref={parentContainerEl}
        class="relative flex flex-col overflow-y-auto bs-full is-full"
      >
        <div
          class={[
            "flex flex-1 flex-col justify-start bs-full pli-6.5",
            "tablet:pli-16",
            "desktop:pli-40",
            "pbs-8 tablet:pbs-20 desktop:pbs-14",
          ]}
        >
          {!isDetailsVisible.value && (
            <div ref={quoteContainerEl} key="quote" class="mbe-auto">
              <Quote quote={data.value.quote} />
            </div>
          )}
          <div
            ref={timeContainerEl}
            key="time"
            class={[
              "flex flex-col items-start pbe-10 space-b-12 odd:mbs-auto even:mbs-10",
              "tablet:pbe-16 tablet:space-b-20",
              "desktop:flex-row desktop:items-end desktop:justify-between desktop:space-b-0",
              isDetailsVisible.value ? "desktop:pbe-14" : "desktop:pbe-24",
            ]}
          >
            <Time
              abbreviation={data.value.timeInfo.abbreviation}
              location={data.value.location}
              time={time.value}
              daytime={daytime.value}
              greeting={greeting.value}
            />
            <DetailsButton isDetailsVisible={isDetailsVisible} />
          </div>
        </div>
        {isDetailsVisible.value && (
          <Details
            daytime={daytime.value}
            details={data.value.timeInfo.details}
            detailsRef={detailsContainerEl}
          />
        )}
      </div>
    </main>
  );
});

export const head: DocumentHead = ({ resolveValue }) => {
  const { timeInfo, location } = resolveValue(useData);
  const { daytime } = timeInfo;
  return {
    title: `Clock App - ${timeInfo.time} ${location}`,
    links: [
      {
        rel: "preload",
        href: backgroundImages[daytime].mobile,
        as: "image",
        media: "(max-width: 767.9px)",
        fetchpriority: "high",
      },
      {
        rel: "preload",
        href: backgroundImages[daytime].tablet,
        as: "image",
        media: "(min-width: 768px) and (max-width: 1439.9px)",
        fetchpriority: "high",
      },
      {
        rel: "preload",
        href: backgroundImages[daytime].desktop,
        as: "image",
        media: "(min-width: 1440px)",
        fetchpriority: "high",
      },
    ],
  };
};

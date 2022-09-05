import type { NoSerialize, Ref } from "@builder.io/qwik";
import {
  component$,
  Fragment,
  noSerialize,
  Resource,
  useClientEffect$,
  useRef,
  useStore,
  useWatch$,
} from "@builder.io/qwik";
import type { DocumentHead, RequestHandler } from "@builder.io/qwik-city";
import { useEndpoint } from "@builder.io/qwik-city";
import clsx from "clsx";
import { Flipper } from "flip-toolkit";
import { promiseHash } from "remix-utils";
import { getLocationInfo, getQuote, getTimeInfo } from "../api";
import {
  animateOpacity,
  clearKeysFromHtmlElement,
  getGreetingAndDaytime,
  getIpAddressFromHeaders,
} from "../utils";

export const backgroundImages = {
  day: {
    mobile: "/assets/mobile/bg-image-daytime.webp",
    tablet: "/assets/tablet/bg-image-daytime.webp",
    desktop: "/assets/desktop/bg-image-daytime.webp",
  },
  night: {
    mobile: "/assets/mobile/bg-image-nighttime.webp",
    tablet: "/assets/tablet/bg-image-nighttime.webp",
    desktop: "/assets/desktop/bg-image-nighttime.webp",
  },
};

interface EndpointData {
  showDetails: boolean;
  quote: {
    id: string;
    author: string;
    text: string;
  };
  location: string;
  greeting: string;
  timeInfo: {
    daytime: "day" | "night";
    time: string;
    abbreviation: string;
    details: Array<{ key: string; label: string; value: string }>;
  };
}

export const onGet: RequestHandler<EndpointData> = async ({
  request,
  url,
  platform,
}) => {
  const showDetails = url.searchParams.get("showDetails") === "true";
  const clientIpAddress = getIpAddressFromHeaders(request.headers, platform.ip);
  const { timeInfo, locationInfo, quote } = await promiseHash({
    timeInfo: getTimeInfo(clientIpAddress),
    locationInfo: getLocationInfo(clientIpAddress),
    quote: getQuote(),
  });

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
      id: quote.id,
      author: quote.author,
      text: quote.en,
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
};

export default component$(() => {
  const resource = useEndpoint<typeof onGet>();

  return (
    <Resource
      value={resource}
      onRejected={() => <div>Error</div>}
      onResolved={(data) => <Main {...data} />}
    />
  );
});

export const Main = component$((props: EndpointData) => {
  const {
    timeInfo,
    quote,
    greeting: defaultGreeting,
    location,
    showDetails,
  } = props;
  const {
    daytime: defaultDayTime,
    time: defaultTime,
    abbreviation,
    details,
  } = timeInfo;
  const quoteContainerEl = useRef<HTMLDivElement>();
  const timeContainerEl = useRef<HTMLDivElement>();
  const detailsContainerEl = useRef<HTMLDivElement>();
  const parentContainerEl = useRef<HTMLDivElement>();
  const detailsStore = useStore({ isVisible: showDetails });

  const timeStore = useStore({
    greeting: defaultGreeting,
    daytime: defaultDayTime,
    time: defaultTime,
  });

  const flipperStore = useStore<{ flipper: NoSerialize<Flipper> }>({
    flipper: undefined,
  });

  useClientEffect$(() => {
    const timer = setInterval(() => {
      const currentDate = new Date();
      const timezone = details.find(({ key }) => key === "timezone")?.value;
      const updatedValues = getGreetingAndDaytime(
        currentDate.toISOString(),
        timezone
      );
      Object.assign(timeStore, updatedValues);
    }, 1000);

    return () => clearInterval(timer);
  });

  useClientEffect$(() => {
    const flipper = new Flipper({
      element: parentContainerEl.current!,
      handleEnterUpdateDelete({
        animateEnteringElements,
        animateExitingElements,
        animateFlippedElements,
        hideEnteringElements,
      }) {
        hideEnteringElements();
        animateExitingElements();
        animateEnteringElements();
        animateFlippedElements();
      },
    });

    flipper.addFlipped({
      element: timeContainerEl.current!,
      flipId: "time",
      children: undefined,
      translate: true,
      shouldFlip(_, { reduceMotion }) {
        return !reduceMotion;
      },
    });

    flipperStore.flipper = noSerialize(flipper);
  });

  useClientEffect$(({ track }) => {
    const quoteEl = track(quoteContainerEl, "current");
    if (flipperStore.flipper && quoteEl) {
      flipperStore.flipper.addFlipped({
        element: quoteEl,
        flipId: "quote",
        children: undefined,
        opacity: true,
        onAppear: (el) => animateOpacity(el, "in"),
        onExit(el, _index, removeElement) {
          // Needs to clear qwik injected attributes because this element is
          // already discarded by qwik but its diff algorithm gets confussed by
          // its presence.
          clearKeysFromHtmlElement(el);
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

  useClientEffect$(({ track }) => {
    const detailsEl = track(detailsContainerEl, "current");
    if (flipperStore.flipper && detailsEl) {
      flipperStore.flipper.addFlipped({
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
            removeElement();
          }

          // Needs to clear qwik injected attributes because this element is
          // already discarded by qwik but its diff algorithm gets confussed by
          // its presence.
          clearKeysFromHtmlElement(el);
          el.setAttribute("aria-hidden", "true");
          el.style.pointerEvents = "none";
          animateOpacity(el, "out", removeElement);
        },
      });
    }
  });

  useWatch$(({ track }) => {
    track(detailsStore, "isVisible");
    flipperStore.flipper?.recordBeforeUpdate();
  });

  useClientEffect$(({ track }) => {
    track(detailsStore, "isVisible");
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    flipperStore.flipper?.update(undefined, {
      reduceMotion: mediaQuery.matches,
    });
  });

  return (
    <main class="relative text-white bs-full is-full">
      <BackgroundImage daytime={timeStore.daytime} />
      <div
        ref={parentContainerEl}
        class="relative bs-full is-full flex flex-col overflow-y-auto"
      >
        <div
          class={clsx(
            "flex flex-col justify-start bs-full pli-6.5 flex-1",
            "tablet:pli-16",
            "desktop:pli-40",
            "pbs-8 tablet:pbs-20 desktop:pbs-14"
          )}
        >
          {!detailsStore.isVisible && (
            <div ref={quoteContainerEl} key="quote" class="mbe-auto">
              <Quote quote={quote} />
            </div>
          )}
          <div
            ref={timeContainerEl}
            key="time"
            class={clsx(
              "flex flex-col items-start pbe-10 space-b-12 even:mbs-10 odd:mbs-auto",
              "tablet:pbe-16 tablet:space-b-20",
              "desktop:flex-row desktop:items-end desktop:justify-between desktop:space-b-0",
              detailsStore.isVisible ? "desktop:pbe-14" : "desktop:pbe-24"
            )}
          >
            <Time
              abbreviation={abbreviation}
              location={location}
              timeStore={timeStore}
            />
            <form
              preventdefault:submit
              onSubmit$={() => {
                detailsStore.isVisible = !detailsStore.isVisible;
                const url = new URL(document.location.href);
                url.searchParams.set(
                  "showDetails",
                  `${detailsStore.isVisible}`
                );
                history.replaceState(null, "", url);
              }}
            >
              <input
                type="hidden"
                name="showDetails"
                value={`${!detailsStore.isVisible}`}
              />
              <button
                class={clsx(
                  "group flex items-center rounded-full bg-white p-1 text-button-thin font-bold uppercase text-black/50 pis-4 space-i-4",
                  "tablet:p-2 tablet:text-button tablet:pis-7 tablet:space-i-3"
                )}
              >
                <span class="min-is-[6ch]">
                  {detailsStore.isVisible ? "Less" : "More"}
                </span>
                <svg
                  class={clsx(
                    "fill-current transform text-gray stroke-white transition-colors-transform duration-300 bs-8 is-8 group-hover:text-gray/50 group-active:text-gray/50",
                    detailsStore.isVisible && "rotate-180",
                    "tablet:bs-10 tablet:is-10"
                  )}
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
          </div>
        </div>
        {detailsStore.isVisible && (
          <Details
            timeStore={timeStore}
            details={details}
            detailsRef={detailsContainerEl}
          />
        )}
      </div>
    </main>
  );
});

export const Details = component$(
  (props: {
    details: EndpointData["timeInfo"]["details"];
    timeStore: {
      daytime: "day" | "night";
    };
    detailsRef: Ref<HTMLElement>;
  }) => {
    const { details, timeStore, detailsRef } = props;

    return (
      <dl
        ref={detailsRef}
        key="details"
        class={clsx(
          "backdrop-blur-lg backdrop-brightness-150 grid grid-cols-1 items-center gap-y-4 is-full pli-6.5 plb-12",
          "tablet:grid-flow-col tablet:grid-cols-2 tablet:grid-rows-2 tablet:gap-x-10 tablet:plb-29 tablet:pis-16 tablet:gap-y-12",
          "desktop:plb-18 desktop:pis-41 desktop:grid-cols-details desktop:gap-x-24 desktop:gap-y-12",
          timeStore.daytime === "day"
            ? "bg-white/75 text-gray"
            : "bg-black/75 text-white"
        )}
      >
        {details.map((field, i) => (
          <Fragment>
            <div
              key={field.key}
              class={clsx(
                "flex justify-between items-center",
                "tablet:flex-col tablet:items-start"
              )}
            >
              <dt
                class={clsx(
                  "text-h6-thin uppercase leading-5",
                  "tablet:text-h6 tablet:leading-7"
                )}
              >
                {field.label}
              </dt>
              <dd
                class={clsx(
                  "text-end text-h2-thin font-bold break-all",
                  "tablet:text-start tablet:text-h2-medium",
                  "desktop:text-h2"
                )}
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
                  class={clsx(
                    "bs-full is-px",
                    timeStore.daytime === "day" ? "bg-gray/25" : "bg-white/25"
                  )}
                />
              </div>
            )}
          </Fragment>
        ))}
      </dl>
    );
  }
);

export const Time = (props: {
  timeStore: {
    time: string;
    greeting: string;
    daytime: "day" | "night";
  };
  abbreviation: string;
  location: string;
}) => {
  const { abbreviation, location, timeStore } = props;
  const { greeting, time, daytime } = timeStore;
  const iconPath =
    daytime === "day" ? (
      <path
        d="M11.78 19.417c.594 0 1.083.449 1.146 1.026l.006.125v1.842a1.152 1.152 0 01-2.296.125l-.007-.125v-1.842c0-.636.516-1.151 1.152-1.151zM6.382 17.18a1.15 1.15 0 01.09 1.527l-.09.1-1.302 1.303a1.152 1.152 0 01-1.718-1.528l.09-.1 1.302-1.302a1.15 1.15 0 011.628 0zm12.427 0l1.303 1.303a1.15 1.15 0 11-1.628 1.627L17.18 18.81a1.15 1.15 0 111.628-1.628zM11.781 5.879a5.908 5.908 0 015.901 5.902 5.908 5.908 0 01-5.901 5.902 5.908 5.908 0 01-5.902-5.902 5.908 5.908 0 015.902-5.902zm10.63 4.75a1.151 1.151 0 110 2.303h-1.843a1.151 1.151 0 110-2.303h1.842zm-19.418 0a1.151 1.151 0 01.126 2.296l-.125.007H1.15a1.151 1.151 0 01-.125-2.296l.125-.007h1.842zm1.985-7.268l.1.09 1.303 1.302a1.151 1.151 0 01-1.528 1.718l-.1-.09L3.45 5.08A1.15 1.15 0 014.978 3.36zm15.133.09c.45.449.45 1.178 0 1.628L18.808 6.38a1.151 1.151 0 11-1.628-1.628l1.303-1.303c.449-.449 1.178-.449 1.628 0zM11.781 0c.636 0 1.151.515 1.151 1.151v1.843a1.152 1.152 0 01-2.303 0V1.15C10.63.515 11.145 0 11.781 0z"
        fill="#FFF"
        fill-rule="nonzero"
      />
    ) : (
      <path
        d="M22.157 17.366a.802.802 0 00-.891-.248 8.463 8.463 0 01-2.866.482c-4.853 0-8.8-3.949-8.8-8.8a8.773 8.773 0 013.856-7.274.801.801 0 00-.334-1.454A7.766 7.766 0 0012 0C5.382 0 0 5.382 0 12s5.382 12 12 12c4.2 0 8.02-2.134 10.218-5.709a.805.805 0 00-.061-.925z"
        fill="#FFF"
        fill-rule="nonzero"
      />
    );

  return (
    <h1 class="flex flex-col space-b-4">
      <div class="flex uppercase text-h4-thin space-i-4 tablet:text-h5 desktop:text-h4">
        <svg
          aria-hidden="true"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          {iconPath}
        </svg>
        <span>
          {greeting}
          <span class="sr-only tablet:not-sr-only">, it's currently</span>
        </span>
      </div>
      <time
        class="flex items-baseline font-bold text-h1-thin space-i-2 tablet:text-h1-middle desktop:text-h1"
        dateTime={time}
      >
        <span>{time}</span>
        <span class="font-light text-sub-thin tablet:text-sub">
          {abbreviation}
        </span>
      </time>
      <p class="font-bold uppercase text-h6 tablet:text-h5 desktop:text-h3">
        {location}
      </p>
    </h1>
  );
};

export const Quote = (props: { quote: { author: string; text: string } }) => {
  const { quote } = props;
  return (
    <div class="flex items-start tablet:max-is-xl">
      <figure class="shrink text-body-thin tablet:text-body">
        <blockquote>
          <p class="before:content-[open-quote] after:content-[close-quote]">
            {quote.text}
          </p>
        </blockquote>
        <cite class="inline-block not-italic font-bold mbs-2">
          {quote.author}
        </cite>
      </figure>
      <form class="shrink-0">
        <button class="p-4 -m-4 -mis-0" type="submit">
          <span class="sr-only">Refresh quote</span>
          <svg
            aria-hidden="true"
            width="18"
            height="18"
            viewBox="0 0 18 18"
            xmlns="http://www.w3.org/2000/svg"
          >
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
};

export const BackgroundImage = (props: { daytime: "day" | "night" }) => {
  const { daytime } = props;
  return (
    <>
      <picture>
        <source
          srcSet={`${backgroundImages[daytime].desktop} 1440w`}
          media="(min-width: 1440px)"
          sizes="100vw"
          width={1440}
          height={900}
        />
        <source
          srcSet={`${backgroundImages[daytime].tablet} 768w`}
          media="(min-width: 768px)"
          sizes="100vw"
          width={768}
          height={1024}
        />
        <img
          src={backgroundImages[daytime].mobile}
          alt=""
          class="absolute inset-0 object-cover"
          srcSet={`${backgroundImages[daytime].mobile} 375w`}
          sizes="100vw"
          style={{ width: "100%", height: "100%" }}
          width={375}
          height={667}
        />
      </picture>
      <div class="absolute inset-0 bg-black/40" />
    </>
  );
};

export const head: DocumentHead<EndpointData> = ({ data }) => {
  const { timeInfo } = data;
  const { daytime } = timeInfo;
  return {
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

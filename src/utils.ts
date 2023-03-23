import { Flipper, spring } from "flip-toolkit";
import { getClientIPAddress } from "remix-utils";

export function getGreetingAndDaytime(datetime: string, timeZone?: string) {
  const date = new Date(datetime);
  const dateTimeFormatter = new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone,
  });
  const formattedParts = dateTimeFormatter.formatToParts(date);
  const hours = formattedParts.find(({ type }) => type === "hour")!.value!;
  const minutes = formattedParts.find(({ type }) => type === "minute")!.value!;
  const hoursNumber = +hours;
  const daytime: "day" | "night" =
    hoursNumber >= 5 && hoursNumber < 18 ? "day" : "night";
  const time = `${hours === "24" ? "00" : hours}:${minutes}`;
  const greeting =
    hoursNumber >= 5 && hoursNumber < 12
      ? "Good morning"
      : hoursNumber >= 12 && hoursNumber < 18
      ? "Good afternoon"
      : "Good evening";

  return { daytime, greeting, time };
}

export function createFlipper(element: HTMLElement) {
  const flipper = new Flipper({
    element,
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

  return flipper;
}

export function animateOpacity(
  element: HTMLElement,
  stage: "in" | "out",
  onComplete?: VoidFunction
) {
  spring({
    onComplete,
    values: { opacity: stage === "in" ? [0, 1] : [1, 0] },
    onUpdate(values) {
      if (typeof values === "number") return;
      element.style.opacity = values.opacity.toString();
    },
  });
}

export function getIpAddressFromHeaders(headers: Headers, fallback?: string) {
  let clientIpAddress = getClientIPAddress(headers) ?? fallback;

  if (!clientIpAddress || ["127.0.0.1", "::1"].includes(clientIpAddress)) {
    clientIpAddress = "66.203.113.173";
    console.warn(
      "Couldn't get IP from request. Using hardcoded IP:",
      clientIpAddress
    );
  }

  return clientIpAddress;
}

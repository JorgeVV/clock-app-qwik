import { spring } from "flip-toolkit";
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

export function clearKeysFromHtmlElement(element: HTMLElement) {
  element.removeAttribute("q:key");
  for (const symbol of Object.getOwnPropertySymbols(element)) {
    delete element[symbol as unknown as keyof HTMLElement];
  }
}

export function getIpAddressFromHeaders(headers: Headers) {
  let clientIpAddress = getClientIPAddress(headers);
  if (!clientIpAddress || clientIpAddress === "::1") {
    clientIpAddress = "190.248.167.145";
  }
  return clientIpAddress;
}

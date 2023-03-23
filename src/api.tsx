interface TimeInfo {
  utc_datetime: string;
  raw_offset: number;
  abbreviation: string;
  timezone: string;
  day_of_year: string;
  day_of_week: string;
  week_number: string;
}

export async function getTimeInfo(clientIp: string) {
  const response = await fetch(`https://worldtimeapi.org/api/ip/${clientIp}`);
  return response.json() as Promise<TimeInfo>;
}

interface QuoteInfo {
  _id: string;
  author: string;
  content: string;
}

export async function getQuote() {
  const response = await fetch(`https://api.quotable.io/random`);
  return response.json() as Promise<QuoteInfo>;
}

interface LocationInfo {
  country_code: string;
  countryCode: string;
  city: string;
}

export async function getLocationInfo(clientIp: string) {
  const response = await fetch(`https://ipwho.is/${clientIp}`);
  return response.json() as Promise<LocationInfo>;
}

export interface EndpointData {
  showDetails: boolean;
  quote: {
    id: string;
    author: string;
    content: string;
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

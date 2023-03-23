import { component$ } from "@builder.io/qwik";

export interface TimeProps {
  time: string;
  greeting: string;
  daytime: "day" | "night";
  abbreviation: string;
  location: string;
}

export const Time = component$((props: TimeProps) => {
  const { abbreviation, location, greeting, time, daytime } = props;
  const iconPathD =
    daytime === "day"
      ? "M11.78 19.417c.594 0 1.083.449 1.146 1.026l.006.125v1.842a1.152 1.152 0 01-2.296.125l-.007-.125v-1.842c0-.636.516-1.151 1.152-1.151zM6.382 17.18a1.15 1.15 0 01.09 1.527l-.09.1-1.302 1.303a1.152 1.152 0 01-1.718-1.528l.09-.1 1.302-1.302a1.15 1.15 0 011.628 0zm12.427 0l1.303 1.303a1.15 1.15 0 11-1.628 1.627L17.18 18.81a1.15 1.15 0 111.628-1.628zM11.781 5.879a5.908 5.908 0 015.901 5.902 5.908 5.908 0 01-5.901 5.902 5.908 5.908 0 01-5.902-5.902 5.908 5.908 0 015.902-5.902zm10.63 4.75a1.151 1.151 0 110 2.303h-1.843a1.151 1.151 0 110-2.303h1.842zm-19.418 0a1.151 1.151 0 01.126 2.296l-.125.007H1.15a1.151 1.151 0 01-.125-2.296l.125-.007h1.842zm1.985-7.268l.1.09 1.303 1.302a1.151 1.151 0 01-1.528 1.718l-.1-.09L3.45 5.08A1.15 1.15 0 014.978 3.36zm15.133.09c.45.449.45 1.178 0 1.628L18.808 6.38a1.151 1.151 0 11-1.628-1.628l1.303-1.303c.449-.449 1.178-.449 1.628 0zM11.781 0c.636 0 1.151.515 1.151 1.151v1.843a1.152 1.152 0 01-2.303 0V1.15C10.63.515 11.145 0 11.781 0z"
      : "M22.157 17.366a.802.802 0 00-.891-.248 8.463 8.463 0 01-2.866.482c-4.853 0-8.8-3.949-8.8-8.8a8.773 8.773 0 013.856-7.274.801.801 0 00-.334-1.454A7.766 7.766 0 0012 0C5.382 0 0 5.382 0 12s5.382 12 12 12c4.2 0 8.02-2.134 10.218-5.709a.805.805 0 00-.061-.925z";

  return (
    <h1 class="flex flex-col space-b-4">
      <div class="flex text-h4-thin uppercase space-i-4 tablet:text-h5 desktop:text-h4">
        <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24">
          <path d={iconPathD} fill="#FFF" fill-rule="nonzero" />
        </svg>
        <span>
          {greeting}
          <span class="sr-only tablet:not-sr-only">, it's currently</span>
        </span>
      </div>
      <time
        class="flex items-baseline text-h1-thin font-bold space-i-2 tablet:text-h1-middle desktop:text-h1"
        dateTime={time}
      >
        <span>{time}</span>
        <span class="text-sub-thin font-light tablet:text-sub">
          {abbreviation}
        </span>
      </time>
      <p class="text-h6 font-bold uppercase tablet:text-h5 desktop:text-h3">
        {location}
      </p>
    </h1>
  );
});

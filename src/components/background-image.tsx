import { component$ } from "@builder.io/qwik";
import bgDesktopDaytime from "~/assets/desktop/bg-image-daytime.webp";
import bgDesktopNighttime from "~/assets/desktop/bg-image-nighttime.webp";
import bgMobileDaytime from "~/assets/mobile/bg-image-daytime.webp";
import bgMobileNighttime from "~/assets/mobile/bg-image-nighttime.webp";
import bgTabletDaytime from "~/assets/tablet/bg-image-daytime.webp";
import bgTabletNighttime from "~/assets/tablet/bg-image-nighttime.webp";

export const backgroundImages = {
  day: {
    mobile: bgMobileDaytime,
    tablet: bgTabletDaytime,
    desktop: bgDesktopDaytime,
  },
  night: {
    mobile: bgMobileNighttime,
    tablet: bgTabletNighttime,
    desktop: bgDesktopNighttime,
  },
};

export interface BackgroundImageProps {
  daytime: "day" | "night";
}

export const BackgroundImage = component$((props: BackgroundImageProps) => {
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
          class="absolute inset-0 object-cover bs-full is-full"
          srcSet={`${backgroundImages[daytime].mobile} 375w`}
          sizes="100vw"
          width={375}
          height={667}
        />
      </picture>
      <div class="absolute inset-0 bg-black/40" />
    </>
  );
});

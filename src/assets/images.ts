// Central image registry: src + alt live here so alt text stays consistent.
// Aspect ratio / layout styles belong in the component, not here.
import astroLogo from "./astro.svg";
import background from "./background.svg";

export const images = {
	astroLogo: {
		src: astroLogo,
		alt: "Astro Homepage",
	},
	// Decorative: empty alt on purpose.
	background: {
		src: background,
		alt: "",
	},
} as const;

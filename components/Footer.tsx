import GitHub from "./IconGithub.tsx";

export function Footer() {
  return (
    <footer
      class="w-11/12 max-w-5xl mx-auto mt-24 sm:!mt-28 mb-8 flex items-center justify-between"
    >
      <span class="flex items-center gap-4">
        <a
          class="flex items-center gap-2 text-gray-700"
          href="https://fresh.deno.dev"
        >
          <a href="https://fresh.deno.dev">
            <img
              width="197"
              height="37"
              src="https://fresh.deno.dev/fresh-badge.svg"
            />
          </a>
        </a>
        <a
          class="hover:underline flex gap-2 items-center"
          href="https://github.com/vikiival/shop"
        >
          <GitHub class="h-5 w-5 text-gray-500" />
          Source
        </a>
      </span>
      <a
        class="text-sm text-gray-400 hidden items-center gap-2 sm:!flex"
        href="https://kodadot.xyz"
      >
        Powered by
        <svg
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          role="img"
          width={28 / 32 * 20}
          height={20}
          preserveAspectRatio="xMidYMid meet"
          viewBox="0 0 256 256"
        >
          <image href="/logo.svg" height="256" width="256" />
        </svg>
        <span class="text-gray-600">
          KodaDot
        </span>
      </a>
    </footer>
  );
}

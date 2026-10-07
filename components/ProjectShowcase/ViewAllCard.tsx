import Link from "next/link";
import { SHOWCASE_CARD_CLASS, VIEW_ALL_CARD } from "./projectShowcase.config";

/**
 * Final carousel slide — same shell as project cards, CTA to the archive.
 */
export default function ViewAllCard() {
  return (
    <article className={SHOWCASE_CARD_CLASS}>
      <Link
        href={VIEW_ALL_CARD.href}
        className="group block h-full w-full outline-none focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 rounded-2xl transition-transform duration-200 hover:-translate-y-1"
        aria-label={VIEW_ALL_CARD.title}
      >
        <div className="showcase-panel flex h-full flex-col justify-between gap-5 rounded-2xl border border-white/20 bg-zinc-950/40 backdrop-blur-xl p-5 sm:gap-6 sm:p-6 lg:p-7 transition-colors group-hover:border-white/30">
          <div className="min-h-0 flex-1 space-y-3">
            <span className="font-mono text-[10px] tracking-[0.28em] text-white uppercase">
              {VIEW_ALL_CARD.eyebrow}
            </span>
            <h3 className="font-mono text-xl tracking-tight text-white sm:text-2xl">
              {VIEW_ALL_CARD.title}
            </h3>
            <p className="line-clamp-3 text-sm leading-relaxed text-white">
              {VIEW_ALL_CARD.body}
            </p>
          </div>

          <div className="flex items-center justify-between gap-3 border-t border-white/10 pt-4">
            <span className="font-mono text-xs tracking-[0.18em] text-white uppercase transition-colors group-hover:text-white/80">
              {VIEW_ALL_CARD.cta}
            </span>
            <span
              aria-hidden
              className="font-mono text-xl text-white transition-transform group-hover:translate-x-1.5 group-hover:text-white"
            >
              →
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}

import Image from 'next/image'

export function CoverSection() {
  return (
    <section className="min-h-screen bg-[#0D1117] relative overflow-hidden flex flex-col justify-between px-6 md:px-16 py-12">
      {/* Decorative circles */}
      <div className="absolute -bottom-32 -right-20 w-[520px] h-[520px] rounded-full border border-[#C9A24B]/[0.08] pointer-events-none" />
      <div className="absolute -bottom-48 -right-40 w-[720px] h-[720px] rounded-full border border-white/[0.04] pointer-events-none" />

      {/* Top bar */}
      <div className="max-w-[760px] mx-auto w-full flex justify-between items-start">
        <div className="flex items-center gap-2.5">
          <Image src="/logo.png" alt="The Coast" width={20} height={20} className="opacity-60" />
          <span className="text-[#C9A24B] text-[11px] font-extrabold tracking-[0.22em] uppercase">
            The Coast
          </span>
        </div>
        <span className="text-white/25 text-[11px] tracking-wider">Brand Education Series</span>
      </div>

      {/* Content */}
      <div className="max-w-[760px] mx-auto w-full flex-1 flex flex-col justify-center py-16">
        <span className="text-[#C9A24B] text-[11px] font-semibold tracking-[0.18em] uppercase mb-7">
          Brand Intelligence
        </span>
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.05] tracking-tight mb-7">
          The 3-Second
          <br />
          Test
        </h1>
        <p className="text-white/55 text-lg font-light leading-relaxed mb-9 max-w-lg">
          How customers judge your brand before you say a word
        </p>
        <div className="w-10 h-px bg-[#C9A24B]/60 mb-7" />
        <p className="text-white/45 text-sm leading-relaxed max-w-lg">
          Your customers have already decided whether to trust your brand before they&apos;ve read a single word. They&apos;re not evaluating your copy or your offer &mdash; they&apos;re reacting to everything else. This guide explains what they&apos;re reacting to, and how to engineer it.
        </p>
      </div>

      {/* Scroll cue */}
      <div className="max-w-[760px] mx-auto w-full flex items-center gap-2 text-white/25 text-xs tracking-wider animate-bounce">
        <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
          <path d="M10 4v12M4 10l6 6 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Scroll to read
      </div>
    </section>
  )
}

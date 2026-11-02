import {useCallback, useRef, useState, type CSSProperties, type FormEvent} from 'react';
import {accentColor, bio, discColor, faces, nav, page, person, press, subscribe} from './content';
import {FaceCanvas, type Mood} from './face/FaceCanvas';
import {useFitHeadline, useTheme} from './hooks';

function Header({dark, onToggle}: {dark: boolean; onToggle: () => void}) {
  return (
    <header className="relative z-40 flex items-center justify-between gap-2 px-[clamp(16px,2.4vw,36px)] pt-[clamp(14px,2.4vh,24px)] sm:gap-4">
      <a href="#" className="flex items-center gap-2 font-display text-[15px] font-bold tracking-[-0.01em] sm:gap-2.5">
        <span className="relative size-8 overflow-hidden rounded-full bg-disc">
          <img src={faces.base.src} alt="" className="absolute top-[-2%] left-[-30%] w-[160%] max-w-none" />
        </span>
        {/* Below 360px only the avatar fits beside the nav; the handle stays for screen readers. */}
        <span className="sr-only min-[360px]:not-sr-only">{person.handle}</span>
      </a>
      <nav aria-label={page.menu} className="flex items-center gap-1 sm:gap-1.5">
        {nav.map((l, i) => (
          <a
            key={l.href}
            href={l.href}
            className={`rounded-full px-2.5 py-2 text-ui font-semibold uppercase transition-colors sm:px-3.5 ${
              i === 0 ? 'bg-ink text-page' : 'hover:bg-line'
            }`}
          >
            {l.label}
          </a>
        ))}
        <button
          type="button"
          onClick={onToggle}
          aria-pressed={dark}
          aria-label={page.modoOscuro}
          className="ml-1 flex h-7 w-12 shrink-0 items-center rounded-full bg-sun p-1 sm:ml-2"
        >
          <span
            className={`size-5 rounded-full bg-ink transition-transform duration-300 ${dark ? 'translate-x-5' : ''}`}
          />
        </button>
      </nav>
    </header>
  );
}

function Subscribe() {
  const [done, setDone] = useState(false);
  const submit = (e: FormEvent) => {
    e.preventDefault();
    setDone(true);
  };
  return (
    <form onSubmit={submit} className="w-full max-w-[380px]">
      <label htmlFor="email" className="mb-2.5 block text-micro font-medium uppercase text-mute">
        {subscribe.etiqueta}
      </label>
      <div aria-live="polite">
        {done ? (
          <p className="flex min-h-11 items-center rounded-full bg-ink px-5 py-2 text-[14px] font-medium text-page">
            {subscribe.respuesta}
          </p>
        ) : (
          <div className="flex h-11 gap-1.5">
            <input
              id="email"
              type="email"
              required
              placeholder={subscribe.placeholder}
              className="min-w-0 flex-1 rounded-full border border-line bg-field px-5 text-[14px] outline-none placeholder:text-mute focus:border-ink"
            />
            <button
              type="submit"
              className="rounded-full bg-disc px-5 text-ui font-semibold uppercase text-white transition-transform active:scale-95"
            >
              {subscribe.boton}
            </button>
          </div>
        )}
      </div>
    </form>
  );
}

function MoodMeter({mood}: {mood: Mood}) {
  const p = mood.patience;
  return (
    <div className="w-full max-w-[380px] space-y-3">
      <div className="flex items-baseline justify-between text-micro uppercase">
        <span className="text-mute">{page.animo}</span>
        {/* Only the mood label is announced; the patience % changes too often to read out. */}
        <span aria-live="polite" className="font-display text-[15px] font-bold tracking-[-0.01em] normal-case">
          {faces[mood.face].mood}
        </span>
      </div>
      <div>
        <div className="mb-1.5 flex justify-between text-micro uppercase text-mute">
          <span>{page.paciencia}</span>
          <span className="tabular-nums">{p}%</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-line">
          <div
            className="h-full rounded-full transition-[width] duration-150"
            style={{width: `${p}%`, background: `color-mix(in oklab, var(--disc) ${p}%, #e8412c)`}}
          />
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [dark, toggle] = useTheme();
  const title = useFitHeadline<HTMLHeadingElement>();
  const stageRef = useRef<HTMLDivElement>(null);
  const [mood, setMood] = useState<Mood>({face: 'base', patience: 100, pulls: 0});
  const onMood = useCallback((m: Mood) => setMood(m), []);

  return (
    <div
      className="flex min-h-[100svh] flex-col bg-page text-ink"
      style={{'--disc': discColor, '--sun': accentColor} as CSSProperties}
    >
      <Header dark={dark} onToggle={toggle} />

      <main className="relative isolate flex flex-1 flex-col px-[clamp(16px,2.4vw,36px)] pt-[clamp(20px,5vh,56px)] text-center">
        {/* self-center: a flex item is blockified, so without it the h1 stretches and the fit measures the container. */}
        <h1 ref={title} className="headline relative z-0 self-center text-[18vw] md:whitespace-nowrap">
          <span className="block md:inline">{person.greeting}</span>
          <span className="marker">{person.name}</span>
        </h1>

        <div className="relative grid flex-1 grid-cols-1 items-end gap-x-8 gap-y-8 text-left md:grid-cols-[1fr_auto_1fr]">
          <div ref={stageRef} className="stage relative mx-auto aspect-square w-[min(100%,580px)] md:order-2 md:w-[min(46vw,78svh)]">
            {/* On phones there is no room beside the head for one line, so the note wraps into the free top-right corner. */}
            <p
              className={`hint absolute top-[12%] right-0 max-w-[4.2em] rotate-6 font-serif text-[15px] leading-[1.05] italic md:top-[24%] md:right-[-8%] md:max-w-none md:text-[clamp(17px,1.5vw,22px)] md:leading-normal ${
                mood.pulls ? 'translate-y-2 opacity-0' : ''
              }`}
            >
              {page.nota[0]} <br className="md:hidden" />
              {page.nota[1]}
              <svg viewBox="0 0 60 40" className="ml-2 block h-8 w-12 -scale-x-100 md:ml-6" fill="none" aria-hidden>
                <path d="M4 4c18 2 34 12 44 30" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                <path d="M40 31l8 4 1-9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </p>
          </div>

          <div className="relative z-10 max-w-[380px] space-y-3 pb-[clamp(20px,5vh,48px)] text-lede md:order-1">
            {bio.map((b, i) => (
              <p key={i} className={i === 0 ? 'font-display text-[1.25em] font-bold tracking-[-0.015em]' : 'text-mute'}>
                {b}
              </p>
            ))}
          </div>

          <div className="relative z-10 flex flex-col gap-7 pb-[clamp(20px,5vh,48px)] md:order-3 md:items-end">
            <MoodMeter mood={mood} />
            <Subscribe />
          </div>
        </div>

        <FaceCanvas stageRef={stageRef} discColor={discColor} onMood={onMood} />
      </main>

      <footer className="relative z-10 border-t border-line px-[clamp(16px,2.4vw,36px)] py-5">
        <ul className="flex flex-wrap items-center justify-between gap-x-8 gap-y-3 text-mute">
          <li className="text-micro font-medium uppercase">{page.prensa}</li>
          {press.map((p: {name: string; font: string; href?: string}) => (
            <li key={p.name} className={`text-wordmark ${p.font}`}>
              {p.href ? (
                <a href={p.href} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-ink">
                  {p.name}
                </a>
              ) : (
                p.name
              )}
            </li>
          ))}
        </ul>
      </footer>
    </div>
  );
}

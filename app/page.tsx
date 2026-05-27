import Image from "next/image";
import SignupForm from "@/components/SignupForm";
import QRCodeImage from "@/components/QRCode";
import {
  RecycleIcon,
  BrushIcon,
  HeartIcon,
  BriefcaseIcon,
  PeaceIcon,
  CalendarIcon,
  ClockIcon,
  PinIcon,
  MailIcon,
  InstagramIcon,
  PhoneIcon,
} from "@/components/Icons";

const PHONE = "769-243-0309";
const PHONE_TEL = "+17692430309";
const EMAIL = "cosetteproductions@gmail.com";
const IG = "cosette.productions";
const LOCATION_NAME = "Thee Herbal Blessing";
const LOCATION_ADDR = "614 N Farish St, Jackson, MS";

const PERKS = [
  { Icon: RecycleIcon, label: "Give Back" },
  { Icon: BrushIcon, label: "Express Your Art" },
  { Icon: HeartIcon, label: "Support Local" },
  { Icon: BriefcaseIcon, label: "Build Your Portfolio" },
  { Icon: PeaceIcon, label: "Be Part Of Something Bigger" },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-ink text-cream grain overflow-hidden">
      {/* =================== HERO (mimics top half of flyer) =================== */}
      <section className="relative max-w-6xl mx-auto px-6 pt-10 pb-16">
        {/* Top row: "Cosette Productions presents..." + splash callout */}
        <div className="flex items-start justify-between gap-4 mb-8">
          <div>
            <h2 className="font-script text-3xl md:text-4xl text-cream">
              Cosette Productions
            </h2>
            <p className="uppercase tracking-[0.4em] text-gold text-xs md:text-sm mt-1">
              ····· Presents ·····
            </p>
          </div>

          {/* Gold splash with handwritten tagline (top right) */}
          <div className="relative w-40 h-40 md:w-48 md:h-48 -mt-4 -mr-2">
            <div className="absolute inset-0 brush-splash bg-gold" />
            <div className="absolute inset-0 flex items-center justify-center text-center px-4">
              <span className="font-brush text-ink text-sm md:text-base leading-tight rotate-[-6deg]">
                MAKE YOUR MARK.
                <br />
                BUILD OUR
                <br />
                COMMUNITY.
              </span>
            </div>
          </div>
        </div>

        {/* Headline */}
        <h1 className="font-display text-6xl md:text-8xl leading-[0.9] tracking-wide">
          <span className="block text-cream">LOOKING FOR</span>
          <span className="block text-gold-grad text-7xl md:text-[9rem] mt-2">
            VOLUNTEERS!
          </span>
        </h1>

        {/* Description + logo */}
        <div className="mt-10 grid md:grid-cols-2 gap-10 items-center">
          <p className="text-cream/85 text-lg leading-relaxed max-w-md">
            We're bringing art to life and transforming a community space
            through the power of creativity! Join us in painting a mural for a
            local client and leave a lasting impact where it matters most.
          </p>

          <div className="flex flex-col items-center md:items-end">
            <Image
              src="/assets/example.jpg"
              alt="The House of Ferro-Chata logo"
              width={320}
              height={280}
              className="opacity-95"
              priority
            />
          </div>
        </div>
      </section>

      {/* =================== PERKS BAR (cream brush block) =================== */}
      <section className="relative -mt-2">
        <div className="relative h-64 md:h-48">
          <div className="absolute inset-x-0 top-0 h-full brush-block bg-cream" />
          <div className="relative h-full max-w-6xl mx-auto px-8 flex flex-wrap items-center justify-center md:justify-between gap-y-6 gap-x-4">
            {PERKS.map(({ Icon, label }) => (
              <div key={label} className="flex flex-col items-center text-center w-1/2 sm:w-1/3 md:w-auto">
                <Icon className="w-9 h-9 stroke-ink" />
                <span className="text-ink font-bold uppercase tracking-wider text-xs mt-2 max-w-[110px] leading-tight">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =================== THE SPACE =================== */}
      <section className="max-w-5xl mx-auto px-6 pt-16">
        <div className="text-center mb-6">
          <p className="uppercase tracking-[0.4em] text-gold text-xs">This is the canvas</p>
          <h3 className="font-display text-3xl md:text-4xl mt-2">THE SPACE WE'RE TRANSFORMING</h3>
        </div>
        <div className="relative rounded-xl overflow-hidden border-2 border-gold/40 shadow-2xl shadow-gold/10">
          <Image
            src="/assets/logo.png"
            alt="Inside The House of Ferro-Chata at Thee Herbal Blessing"
            width={1600}
            height={1000}
            className="w-full h-auto"
          />
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-ink/90 to-transparent p-4">
            <p className="font-brush text-cream text-lg">Help us bring this wall to life.</p>
          </div>
        </div>
      </section>

      {/* =================== EVENT INFO =================== */}
      <section className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-12 items-start">
        <div>
          <h2 className="font-display text-5xl md:text-6xl leading-none">
            <span className="block">ALL SKILL LEVELS</span>
            <span className="gold-underline">WELCOME!</span>
          </h2>

          {/* Mini brush splash like the "Paint. Collaborate. Inspire. Together." block */}
          <div className="relative mt-10 inline-block">
            <div className="relative w-72 h-44">
              <div className="absolute inset-0 brush-splash bg-ink border-2 border-gold" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
                <span className="font-display text-cream text-2xl leading-tight">PAINT.</span>
                <span className="font-display text-cream text-2xl leading-tight">COLLABORATE.</span>
                <span className="font-display text-cream text-2xl leading-tight">INSPIRE.</span>
                <span className="font-display text-gold text-3xl mt-1">TOGETHER.</span>
              </div>
            </div>
          </div>
        </div>

        <ul className="space-y-5 text-lg">
          <li className="flex items-start gap-4">
            <CalendarIcon className="w-7 h-7 stroke-gold flex-none mt-1" />
            <div>
              <div className="uppercase tracking-widest text-gold text-sm">Date</div>
              <div className="text-cream">To Be Announced</div>
            </div>
          </li>
          <li className="flex items-start gap-4">
            <ClockIcon className="w-7 h-7 stroke-gold flex-none mt-1" />
            <div>
              <div className="uppercase tracking-widest text-gold text-sm">Time</div>
              <div className="text-cream">To Be Announced</div>
            </div>
          </li>
          <li className="flex items-start gap-4">
            <PinIcon className="w-7 h-7 stroke-gold flex-none mt-1" />
            <div>
              <div className="uppercase tracking-widest text-gold text-sm">Location</div>
              <div className="text-cream font-semibold">{LOCATION_NAME}</div>
              <div className="text-cream/80 text-base">{LOCATION_ADDR}</div>
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(
                  `${LOCATION_NAME} ${LOCATION_ADDR}`,
                )}`}
                target="_blank"
                rel="noreferrer"
                className="text-gold underline text-sm hover:text-gold-light"
              >
                Open in Maps →
              </a>
            </div>
          </li>
          <li className="pt-2 italic text-cream/70">*Snacks &amp; drinks provided!</li>
        </ul>
      </section>

      {/* =================== SIGN-UP FORM =================== */}
      <section id="signup" className="max-w-3xl mx-auto px-6 pb-16">
        <div className="text-center mb-8">
          <h2 className="font-display text-5xl md:text-6xl">
            <span className="block text-cream">LET'S CREATE</span>
            <span className="block text-gold">SOMETHING BEAUTIFUL.</span>
          </h2>
          <p className="text-cream/70 mt-4">
            Sign up below and we'll email you the volunteer waiver and an
            hours-tracking sheet right away.
          </p>
        </div>
        <SignupForm />
      </section>

      {/* =================== CONNECT FOOTER =================== */}
      <footer className="bg-cream text-ink mt-10">
        <div className="max-w-6xl mx-auto px-6 py-14 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h3 className="font-display text-4xl tracking-wide">
              INTERESTED? <span className="text-gold-dark">LET'S CONNECT!</span>
            </h3>
            <ul className="mt-6 space-y-3 text-lg">
              <li className="flex items-center gap-3">
                <MailIcon className="w-6 h-6 stroke-ink" />
                <a href={`mailto:${EMAIL}`} className="hover:underline">
                  {EMAIL}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <InstagramIcon className="w-6 h-6 stroke-ink" />
                <a
                  href={`https://instagram.com/${IG}`}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:underline"
                >
                  @{IG}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <PhoneIcon className="w-6 h-6 stroke-ink" />
                <a href={`tel:${PHONE_TEL}`} className="hover:underline">
                  ({PHONE.slice(0, 3)}) {PHONE.slice(4, 7)}-{PHONE.slice(8)}
                </a>
              </li>
            </ul>
          </div>

          <div className="flex flex-col items-center md:items-end">
            <QRCodeImage size={220} />
            <p className="mt-4 font-brush text-ink text-lg text-center md:text-right">
              Scan to sign up
              <br />
              or learn more!
            </p>
          </div>
        </div>

        <div className="bg-ink text-cream/60 text-center text-xs py-4">
          © {new Date().getFullYear()} Cosette Productions · Built with love for{" "}
          {LOCATION_NAME}
        </div>
      </footer>
    </main>
  );
}

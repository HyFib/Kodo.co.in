"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const dishes = [
  {
    name: "The Grainfather",
    kicker: "01 · SMILES BETWEEN BUNS",
    description:
      "A gloriously stacked millet-bun burger with a crisp veg patty, gooey cheese and our sunshine sauce.",
    image: "/food/millet-burger.png",
    alt: "A millet-bun burger stacked with vegetables, cheese and a crisp patty",
    tags: ["Millet bun", "Big crunch", "Saucy"],
  },
  {
    name: "Smiling Momo-ments",
    kicker: "02 · LITTLE POCKETS OF JOY",
    description:
      "Golden millet momos, pan-seared for the good kind of crunch and made for a bright chutney dunk.",
    image: "/food/millet-momos.png",
    alt: "Golden pan-seared millet momos with tomato chilli chutney",
    tags: ["Pan-seared", "Chutney dip", "Shareable"],
  },
  {
    name: "Smilin’ Wraps",
    kicker: "03 · ROLL WITH THE GOOD STUFF",
    description:
      "A toasted millet flatbread loaded with paneer, charred corn, crisp veg and creamy green chutney.",
    image: "/food/millet-wraps.png",
    alt: "Toasted millet wraps filled with paneer and colourful vegetables",
    tags: ["Millet wrap", "Paneer", "Fresh crunch"],
  },
] as const;

export default function Home() {
  const [activeDish, setActiveDish] = useState(0);

  useEffect(() => {
    const updateScrollEffects = () => {
      const pageHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = pageHeight > 0 ? window.scrollY / pageHeight : 0;
      document.documentElement.style.setProperty(
        "--scroll-progress",
        progress.toString(),
      );
      document.documentElement.style.setProperty(
        "--hero-shift",
        `${Math.min(window.scrollY * 0.1, 72)}px`,
      );
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const index = Number(
              (entry.target as HTMLElement).dataset.dishIndex,
            );
            setActiveDish(index);
          }
        }
      },
      { rootMargin: "-38% 0px -38% 0px", threshold: 0 },
    );

    const steps = document.querySelectorAll<HTMLElement>("[data-dish-index]");
    steps.forEach((step) => observer.observe(step));
    window.addEventListener("scroll", updateScrollEffects, { passive: true });
    updateScrollEffects();

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", updateScrollEffects);
    };
  }, []);

  return (
    <div className="site-shell">
      <div className="scroll-progress" aria-hidden="true" />

      <header className="topbar">
        <a className="brand" href="#home" aria-label="Kodo home">
          <Image
            src="/brand/kodo-wordmark.png"
            alt="KODO"
            width={900}
            height={415}
            priority
          />
        </a>
        <nav className="nav-links" aria-label="Primary navigation">
          <a href="#menu">The good stuff</a>
          <a href="#millet-way">The millet way</a>
        </nav>
        <a className="nav-cta" href="#visit">
          Find your smile
          <span aria-hidden="true">↗</span>
        </a>
      </header>

      <main>
        <section className="hero" id="home">
          <div className="grain grain-one" aria-hidden="true" />
          <div className="grain grain-two" aria-hidden="true" />
          <div className="grain grain-three" aria-hidden="true" />

          <div className="hero-copy">
            <p className="eyebrow">THE MILLET WAY · THENI</p>
            <h1>
              Food that
              <span>smiles back.</span>
            </h1>
            <p className="hero-intro">
              Globally loved quick bites, reimagined with millets and a whole
              lot of joy.
            </p>
            <div className="hero-actions">
              <a className="button button-dark" href="#menu">
                Scroll for a bite
                <span aria-hidden="true">↓</span>
              </a>
              <span className="tiny-note">0% Guilt · 100% Smiles</span>
            </div>
          </div>

          <div className="hero-visual-wrap">
            <div className="hero-visual">
              <Image
                src="/food/millet-burger.png"
                alt="A craveable Kodo millet burger"
                fill
                priority
                sizes="(max-width: 760px) 92vw, 52vw"
              />
              <div className="hero-sticker" aria-hidden="true">
                <span className="sticker-eyes">••</span>
                <span>Made to smile</span>
              </div>
            </div>
            <p className="hero-caption">
              <span>01</span>
              Built different.
              <br />
              Bites familiar.
            </p>
          </div>
        </section>

        <div className="ticker" aria-hidden="true">
          <div className="ticker-track">
            <span>MILLETS</span><i>☺</i><span>HEALTH</span><i>☺</i>
            <span>SMILES</span><i>☺</i><span>THE MILLET WAY</span><i>☺</i>
            <span>MILLETS</span><i>☺</i><span>HEALTH</span><i>☺</i>
            <span>SMILES</span><i>☺</i><span>THE MILLET WAY</span><i>☺</i>
          </div>
        </div>

        <section className="menu-intro" id="menu">
          <p className="eyebrow">HUNGRY YET?</p>
          <h2>
            Meet the
            <span>mood food.</span>
          </h2>
          <p>
            Millets have entered their main-character era. Scroll slowly — each
            bite deserves its moment.
          </p>
        </section>

        <section className="dish-story" aria-label="Kodo dish highlights">
          <div className="dish-stage">
            <div className="dish-images">
              {dishes.map((dish, index) => (
                <figure
                  className="dish-image"
                  data-active={activeDish === index}
                  aria-hidden={activeDish !== index}
                  key={dish.name}
                >
                  <Image
                    src={dish.image}
                    alt={dish.alt}
                    fill
                    sizes="(max-width: 860px) 94vw, 56vw"
                  />
                </figure>
              ))}
              <div className="dish-index" aria-hidden="true">
                <span>0{activeDish + 1}</span>
                <span>03</span>
              </div>
            </div>
          </div>

          <div className="dish-steps">
            {dishes.map((dish, index) => (
              <article
                className={`dish-step ${activeDish === index ? "is-active" : ""}`}
                data-dish-index={index}
                key={dish.name}
              >
                <div className="step-thumb">
                  <Image
                    src={dish.image}
                    alt={dish.alt}
                    fill
                    sizes="92vw"
                  />
                </div>
                <p className="eyebrow">{dish.kicker}</p>
                <h3>{dish.name}</h3>
                <p>{dish.description}</p>
                <ul aria-label={`${dish.name} highlights`}>
                  {dish.tags.map((tag) => (
                    <li key={tag}>{tag}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="millet-way" id="millet-way">
          <div className="way-heading">
            <p className="eyebrow">WHY MILLETS?</p>
            <h2>
              Old grain.
              <span>New grin.</span>
            </h2>
          </div>
          <div className="way-copy">
            <p>
              We take a proudly local grain and let it play in burgers, momos,
              wraps and all the quick bites you already love.
            </p>
            <p className="way-punchline">Heritage, with its hair down.</p>
          </div>
          <div className="smile-mark" aria-hidden="true">
            <span />
            <span />
            <b />
          </div>
        </section>

        <section className="manifesto">
          <div className="badge-wrap">
            <Image
              src="/brand/kodo-badge.png"
              alt="Kodo — The Millet Way, millets, health, smiles"
              width={900}
              height={900}
            />
          </div>
          <div className="manifesto-copy">
            <p className="eyebrow">THE QUICK-BITE MANIFESTO</p>
            <h2>Better eating should still feel like a treat.</h2>
            <p>
              No lectures. No sad little plates. Just familiar favourites,
              millet-powered and made with a big, bright point of view.
            </p>
            <a className="text-link" href="#visit">
              Come eat happy <span aria-hidden="true">↗</span>
            </a>
          </div>
        </section>

        <section className="visit" id="visit">
          <p className="eyebrow">THENI, TAMIL NADU</p>
          <h2>Pull up a chair.</h2>
          <div className="visit-bottom">
            <p>Quick bites. Big millet energy. Smiles served all day.</p>
            <div className="tamil-mark">
              <Image
                src="/brand/kodo-tamil.png"
                alt="Kodo in Tamil"
                width={900}
                height={405}
              />
            </div>
          </div>
        </section>
      </main>

      <footer>
        <a className="footer-brand" href="#home" aria-label="Back to top">
          <Image
            src="/brand/kodo-wordmark.png"
            alt="KODO"
            width={900}
            height={415}
          />
        </a>
        <p>Millets. Health. Smiles.</p>
        <a href="#home">Back to top ↑</a>
      </footer>
    </div>
  );
}

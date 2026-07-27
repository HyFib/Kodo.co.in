import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { menuCategories } from "./menu-data";
import "./menu.css";

export const metadata: Metadata = {
  title: "KODO Menu — The Millet Way",
  description:
    "Explore KODO burgers, pizzas, momos, millet pasta, munchies, coffee and more.",
};

const swiggyOrderUrl = process.env.NEXT_PUBLIC_SWIGGY_ORDER_URL;
const safeSwiggyOrderUrl =
  swiggyOrderUrl &&
  /^https:\/\/(?:www\.)?swiggy\.com\//i.test(swiggyOrderUrl)
    ? swiggyOrderUrl
    : null;

export default function MenuPage() {
  return (
    <div className="menu-page" id="top">
      <header className="menu-topbar">
        <Link className="menu-brand" href="/" aria-label="KODO home">
          <Image
            src="/brand/kodo-wordmark.png"
            alt="KODO"
            width={900}
            height={415}
            priority
            unoptimized
          />
        </Link>
        <nav aria-label="Menu page navigation">
          <Link href="/">Home</Link>
          <a href="#full-menu">Full menu</a>
        </nav>
        <a className="menu-order-mini" href="#swiggy">
          Order soon <span aria-hidden="true">↗</span>
        </a>
      </header>

      <main>
        <section className="menu-hero">
          <div className="menu-hero-copy">
            <p className="menu-eyebrow">THE KODO MENU · THENI</p>
            <h1>
              Pick your
              <span>happy.</span>
            </h1>
            <p>
              Millet-powered comfort food with familiar flavours, big crunch
              and absolutely no boring bites.
            </p>
            <a className="menu-primary-button" href="#full-menu">
              Explore the menu <span aria-hidden="true">↓</span>
            </a>
          </div>

          <div className="menu-hero-object" aria-hidden="true">
            <div className="menu-hero-card">
              <Image
                src="/food/millet-burger.jpg"
                alt=""
                fill
                priority
                unoptimized
                sizes="(max-width: 760px) 88vw, 48vw"
              />
              <span className="menu-hero-stamp">MILLET MADE ☺</span>
            </div>
            <div className="menu-hero-shadow" />
          </div>
        </section>

        <nav className="category-rail" aria-label="Menu categories">
          {menuCategories.map((category) => (
            <a href={`#${category.id}`} key={category.id}>
              {category.title}
            </a>
          ))}
        </nav>

        <section className="menu-section" id="full-menu">
          <div className="menu-section-heading">
            <p className="menu-eyebrow">THE WHOLE HAPPY LOT</p>
            <h2>What are you smiling for?</h2>
            <div className="diet-legend" aria-label="Dietary markers">
              <span>
                <i className="diet-dot veg" aria-hidden="true" /> Vegetarian
              </span>
              <span>
                <i className="diet-dot non-veg" aria-hidden="true" /> Non-vegetarian
              </span>
            </div>
          </div>

          <div className="menu-card-grid">
            {menuCategories.map((category, index) => (
              <article
                className={`menu-card menu-card-${category.tone} ${
                  category.image ? "menu-card-featured" : ""
                }`}
                id={category.id}
                key={category.id}
                style={{ "--card-order": index } as CSSProperties}
              >
                <div className="menu-card-face">
                  <div className="menu-card-heading">
                    <p>{category.kicker}</p>
                    <h3>{category.title}</h3>
                    <span aria-hidden="true">0{index + 1}</span>
                  </div>

                  {category.image && (
                    <div className="menu-card-image">
                      <Image
                        src={category.image.src}
                        alt={category.image.alt}
                        fill
                        unoptimized
                        sizes="(max-width: 760px) 88vw, 38vw"
                      />
                    </div>
                  )}

                  <ul>
                    {category.items.map((item) => (
                      <li key={`${category.id}-${item.name}`}>
                        <i
                          className={`diet-dot ${item.kind}`}
                          aria-hidden="true"
                        />
                        <span>{item.name}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="swiggy-panel" id="swiggy">
          <div>
            <p className="menu-eyebrow">DELIVERY, NEXT</p>
            <h2>Send the millet way to your doorway.</h2>
            <p>
              The ordering connection is ready for KODO&apos;s official Swiggy
              restaurant link.
            </p>
          </div>
          {safeSwiggyOrderUrl ? (
            <a
              className="swiggy-button"
              href={safeSwiggyOrderUrl}
              target="_blank"
              rel="noreferrer"
            >
              Open KODO on Swiggy <span aria-hidden="true">↗</span>
            </a>
          ) : (
            <button
              className="swiggy-button swiggy-button-placeholder"
              type="button"
              disabled
            >
              Swiggy link coming soon
            </button>
          )}
        </section>
      </main>

      <footer className="menu-footer">
        <Link className="menu-brand" href="/" aria-label="KODO home">
          <Image
            src="/brand/kodo-wordmark.png"
            alt="KODO"
            width={900}
            height={415}
            unoptimized
          />
        </Link>
        <p>Millets. Health. Smiles.</p>
        <a href="#top">Back to top ↑</a>
      </footer>
    </div>
  );
}

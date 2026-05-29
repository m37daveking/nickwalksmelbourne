import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const customStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter+Tight:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

  :root {
    --paper: #ECE6DB;
    --paper-2: #E4DDD0;
    --ink: #1A1814;
    --ink-soft: #4A453D;
    --line: #C9C0B0;
    --cobalt: #2B4FC9;
    --green: #1F6B3F;
    --amber: #E07A18;
    --orange: #E04820;
    --coral: #F45A55;
    --pink: #F49AB8;
    --violet: #7A5AC9;
    --indigo: #3A3FB0;
    --cyan: #7BB8E8;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body {
    background: var(--paper);
    color: var(--ink);
    font-family: 'Inter Tight', sans-serif;
    -webkit-font-smoothing: antialiased;
  }
  body {
    background-image:
      radial-gradient(ellipse 1400px 900px at 50% 0%, rgba(255,250,240,0.5), transparent 60%),
      radial-gradient(ellipse 1200px 800px at 100% 100%, rgba(0,0,0,0.04), transparent 60%);
    min-height: 100vh;
    overflow-x: hidden;
  }
  a { color: inherit; text-decoration: none; }

  .ribbon-nav {
    display: flex; align-items: center; justify-content: space-between;
    padding: 28px 56px;
    position: sticky; top: 0; z-index: 100;
    backdrop-filter: blur(8px);
    background: rgba(236,230,219,0.75);
    border-bottom: 1px solid transparent;
    transition: border-color .3s;
  }
  .ribbon-nav.scrolled { border-bottom-color: var(--line); }

  .logo { display: flex; align-items: center; gap: 12px; font-weight: 600; font-size: 17px; letter-spacing: -0.01em; }
  .logo-mark {
    width: 34px; height: 18px; border-radius: 999px;
    background: linear-gradient(90deg, var(--cobalt) 0%, var(--cobalt) 33%, var(--coral) 33%, var(--coral) 66%, var(--amber) 66%, var(--amber) 100%);
    position: relative;
  }
  .logo-mark::after {
    content: ""; position: absolute; inset: 0; border-radius: 999px;
    background: linear-gradient(180deg, rgba(255,255,255,0.35), transparent 40%, rgba(0,0,0,0.15));
  }
  .nav-links { display: flex; gap: 36px; font-size: 14px; color: var(--ink-soft); font-weight: 500; }
  .nav-links a { transition: color .2s; position: relative; }
  .nav-links a:hover { color: var(--ink); }
  .nav-links a::after { content: ""; position: absolute; left: 0; bottom: -4px; height: 1px; width: 0; background: var(--ink); transition: width .25s; }
  .nav-links a:hover::after { width: 100%; }
  .nav-cta { display: flex; align-items: center; gap: 14px; }
  .nav-cta .sign-in { font-size: 14px; color: var(--ink-soft); font-weight: 500; cursor: pointer; }
  .nav-cta .sign-in:hover { color: var(--ink); }

  .pill {
    display: inline-flex; align-items: center; justify-content: center;
    height: 44px; padding: 0 22px; border-radius: 999px;
    font-family: 'Inter Tight', sans-serif; font-weight: 600; font-size: 14px; letter-spacing: -0.005em;
    border: none; cursor: pointer; position: relative; overflow: hidden;
    transition: transform .25s cubic-bezier(.2,.8,.2,1), box-shadow .25s;
    color: #fff;
  }
  .pill:hover { transform: translateY(-1px); box-shadow: 0 10px 28px rgba(26,24,20,0.18); }
  .pill:active { transform: translateY(0); }
  .pill.primary {
    background:
      linear-gradient(180deg, rgba(255,255,255,0.22) 0%, transparent 35%, rgba(0,0,0,0.18) 100%),
      linear-gradient(90deg, var(--cobalt) 0%, var(--cobalt) 34%, var(--coral) 34%, var(--coral) 67%, var(--amber) 67%, var(--amber) 100%);
    color: #fff;
    box-shadow: 0 2px 0 rgba(0,0,0,0.15), 0 8px 22px rgba(26,24,20,0.12);
  }
  .pill.ghost {
    background: transparent; color: var(--ink); border: 1px solid var(--ink);
  }
  .pill.ghost:hover { background: var(--ink); color: var(--paper); }
  .pill.small { height: 36px; padding: 0 16px; font-size: 13px; }

  .hero {
    padding: 80px 56px 120px;
    display: grid; grid-template-columns: 1.1fr 1fr; gap: 80px; align-items: center;
    position: relative;
  }
  .eyebrow {
    display: inline-flex; align-items: center; gap: 10px;
    font-family: 'JetBrains Mono', monospace; font-size: 11px; text-transform: uppercase; letter-spacing: 0.14em;
    color: var(--ink-soft); margin-bottom: 32px;
  }
  .eyebrow-dot { width: 8px; height: 8px; border-radius: 999px; background: linear-gradient(90deg, var(--coral), var(--amber)); }
  h1 {
    font-family: 'Instrument Serif', serif;
    font-weight: 400;
    font-size: 96px; line-height: 0.95; letter-spacing: -0.025em;
    margin-bottom: 32px;
  }
  h1 em { font-style: italic; background: linear-gradient(90deg, var(--cobalt), var(--violet) 40%, var(--coral) 70%, var(--amber)); -webkit-background-clip: text; background-clip: text; color: transparent; }
  .hero p.lede {
    font-size: 19px; line-height: 1.5; color: var(--ink-soft); max-width: 480px; margin-bottom: 40px;
  }
  .hero-ctas { display: flex; gap: 14px; align-items: center; margin-bottom: 48px; }
  .hero-meta { display: flex; gap: 32px; font-size: 13px; color: var(--ink-soft); }
  .hero-meta-item { display: flex; align-items: center; gap: 8px; }
  .hero-meta-item svg { width: 14px; height: 14px; stroke: var(--ink-soft); }

  .composition {
    position: relative; height: 620px;
    display: flex; align-items: center; justify-content: center;
  }
  .ribbon-strip {
    position: absolute; border-radius: 999px; overflow: hidden;
    box-shadow: 0 20px 60px rgba(26,24,20,0.15), inset 0 1px 0 rgba(255,255,255,0.15);
  }
  .ribbon-strip::after {
    content: ""; position: absolute; inset: 0; border-radius: 999px;
    background: linear-gradient(180deg, rgba(255,255,255,0.25) 0%, transparent 30%, transparent 70%, rgba(0,0,0,0.2) 100%);
    pointer-events: none;
  }
  .ribbon-1 {
    width: 520px; height: 120px;
    top: 40px; left: 20px;
    transform: rotate(-12deg);
    background: linear-gradient(90deg, var(--cobalt) 0%, var(--cobalt) 28%, var(--green) 28%, var(--green) 55%, var(--amber) 55%, var(--amber) 100%);
    animation: float1 9s ease-in-out infinite;
  }
  .ribbon-2 {
    width: 540px; height: 120px;
    top: 200px; left: -10px;
    transform: rotate(14deg);
    background: linear-gradient(90deg, var(--amber) 0%, var(--amber) 25%, var(--coral) 25%, var(--coral) 55%, var(--pink) 55%, var(--pink) 80%, var(--violet) 80%, var(--violet) 100%);
    animation: float2 11s ease-in-out infinite;
  }
  .ribbon-3 {
    width: 500px; height: 120px;
    top: 360px; left: 40px;
    transform: rotate(-10deg);
    background: linear-gradient(90deg, var(--violet) 0%, var(--violet) 30%, var(--indigo) 30%, var(--indigo) 60%, var(--cyan) 60%, var(--cyan) 100%);
    animation: float1 10s ease-in-out infinite -2s;
  }
  .ribbon-4 {
    width: 460px; height: 120px;
    top: 500px; left: 0px;
    transform: rotate(6deg);
    background: linear-gradient(90deg, var(--cyan) 0%, var(--cyan) 45%, #fff 45%, #fff 65%, var(--ink) 65%, var(--ink) 100%);
    animation: float2 12s ease-in-out infinite -3s;
  }
  @keyframes float1 {
    0%, 100% { transform: rotate(-12deg) translateY(0); }
    50% { transform: rotate(-11deg) translateY(-8px); }
  }
  @keyframes float2 {
    0%, 100% { transform: rotate(14deg) translateY(0); }
    50% { transform: rotate(13deg) translateY(-10px); }
  }
  .ribbon-3 { animation-name: float1; }
  .ribbon-4 { animation-name: float2; }

  .logos {
    padding: 40px 56px 80px;
    border-top: 1px solid var(--line);
  }
  .logos-label {
    font-family: 'JetBrains Mono', monospace; font-size: 11px; text-transform: uppercase; letter-spacing: 0.14em;
    color: var(--ink-soft); text-align: center; margin-bottom: 32px;
  }
  .logos-grid {
    display: grid; grid-template-columns: repeat(6, 1fr); gap: 48px; align-items: center;
    opacity: 0.75;
  }
  .logo-item {
    font-family: 'Instrument Serif', serif; font-size: 24px; text-align: center; color: var(--ink);
    letter-spacing: -0.01em;
  }
  .logo-item.mono { font-family: 'JetBrains Mono', monospace; font-size: 14px; font-weight: 500; letter-spacing: 0; }
  .logo-item.bold { font-family: 'Inter Tight', sans-serif; font-weight: 700; font-size: 20px; letter-spacing: -0.02em; }

  .features { padding: 140px 56px; position: relative; }
  .section-head {
    display: grid; grid-template-columns: 1fr 1fr; gap: 80px; margin-bottom: 80px; align-items: end;
  }
  .section-head h2 {
    font-family: 'Instrument Serif', serif; font-weight: 400;
    font-size: 72px; line-height: 0.98; letter-spacing: -0.02em;
  }
  .section-head h2 em { font-style: italic; color: var(--coral); }
  .section-head p { font-size: 17px; line-height: 1.55; color: var(--ink-soft); max-width: 460px; }

  .features-grid {
    display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px;
    background: var(--line);
    border-top: 1px solid var(--line); border-bottom: 1px solid var(--line);
  }
  .feature {
    background: var(--paper);
    padding: 48px 36px;
    min-height: 320px;
    display: flex; flex-direction: column; justify-content: space-between; gap: 32px;
    transition: background .3s;
    cursor: default;
    position: relative;
  }
  .feature:hover { background: var(--paper-2); }
  .feature-ribbon {
    width: 88px; height: 36px; border-radius: 999px; position: relative; overflow: hidden;
    box-shadow: inset 0 1px 0 rgba(255,255,255,0.2), 0 4px 14px rgba(26,24,20,0.1);
  }
  .feature-ribbon::after {
    content: ""; position: absolute; inset: 0; border-radius: 999px;
    background: linear-gradient(180deg, rgba(255,255,255,0.25), transparent 35%, rgba(0,0,0,0.2));
  }
  .fr-1 { background: linear-gradient(90deg, var(--cobalt) 0%, var(--cobalt) 45%, var(--green) 45%, var(--green) 100%); }
  .fr-2 { background: linear-gradient(90deg, var(--amber) 0%, var(--amber) 40%, var(--coral) 40%, var(--coral) 75%, var(--pink) 75%, var(--pink) 100%); }
  .fr-3 { background: linear-gradient(90deg, var(--violet) 0%, var(--violet) 50%, var(--indigo) 50%, var(--indigo) 100%); }
  .fr-4 { background: linear-gradient(90deg, var(--cyan) 0%, var(--cyan) 50%, var(--ink) 50%, var(--ink) 100%); }
  .fr-5 { background: linear-gradient(90deg, var(--green) 0%, var(--green) 40%, var(--amber) 40%, var(--amber) 100%); }
  .fr-6 { background: linear-gradient(90deg, var(--coral) 0%, var(--coral) 33%, var(--violet) 33%, var(--violet) 66%, var(--cobalt) 66%, var(--cobalt) 100%); }
  .feature h3 {
    font-family: 'Instrument Serif', serif; font-weight: 400;
    font-size: 32px; line-height: 1.05; letter-spacing: -0.015em; margin-bottom: 12px;
  }
  .feature p { font-size: 15px; line-height: 1.55; color: var(--ink-soft); }
  .feature-idx {
    position: absolute; top: 20px; right: 24px;
    font-family: 'JetBrains Mono', monospace; font-size: 11px; color: var(--ink-soft); letter-spacing: 0.1em;
  }

  .showcase {
    padding: 140px 56px;
    background: var(--ink); color: var(--paper);
    position: relative; overflow: hidden;
  }
  .showcase::before {
    content: ""; position: absolute; top: -100px; right: -100px; width: 500px; height: 120px;
    border-radius: 999px;
    background: linear-gradient(90deg, var(--coral) 0%, var(--coral) 33%, var(--amber) 33%, var(--amber) 66%, var(--pink) 66%, var(--pink) 100%);
    transform: rotate(18deg); opacity: 0.85;
  }
  .showcase::after {
    content: ""; position: absolute; bottom: -80px; left: -120px; width: 480px; height: 100px;
    border-radius: 999px;
    background: linear-gradient(90deg, var(--cobalt) 0%, var(--cobalt) 40%, var(--violet) 40%, var(--violet) 70%, var(--cyan) 70%, var(--cyan) 100%);
    transform: rotate(-14deg); opacity: 0.8;
  }
  .showcase-inner { position: relative; z-index: 2; max-width: 1080px; margin: 0 auto; text-align: center; }
  .showcase-eyebrow {
    font-family: 'JetBrains Mono', monospace; font-size: 11px; text-transform: uppercase; letter-spacing: 0.14em;
    opacity: 0.6; margin-bottom: 28px;
  }
  .showcase h2 {
    font-family: 'Instrument Serif', serif; font-weight: 400;
    font-size: 88px; line-height: 0.98; letter-spacing: -0.025em; margin-bottom: 32px;
  }
  .showcase h2 em { font-style: italic; background: linear-gradient(90deg, var(--amber), var(--coral) 40%, var(--pink) 70%, var(--violet)); -webkit-background-clip: text; background-clip: text; color: transparent; }
  .showcase p { font-size: 18px; line-height: 1.55; color: rgba(236,230,219,0.7); max-width: 560px; margin: 0 auto 48px; }

  .canvas-demo {
    margin-top: 72px;
    background: #0F0D0A; border-radius: 20px;
    padding: 24px;
    border: 1px solid rgba(255,255,255,0.08);
    text-align: left;
    max-width: 980px; margin-left: auto; margin-right: auto;
    box-shadow: 0 40px 80px rgba(0,0,0,0.4);
  }
  .canvas-top {
    display: flex; align-items: center; gap: 12px; padding-bottom: 16px; border-bottom: 1px solid rgba(255,255,255,0.06);
    margin-bottom: 20px;
  }
  .canvas-dots { display: flex; gap: 6px; }
  .canvas-dots span { width: 10px; height: 10px; border-radius: 999px; background: rgba(255,255,255,0.15); }
  .canvas-title { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: rgba(236,230,219,0.5); margin-left: 12px; }
  .canvas-grid {
    display: grid; grid-template-columns: 1fr 2fr; gap: 20px; min-height: 340px;
  }
  .canvas-panel {
    background: rgba(255,255,255,0.03); border-radius: 12px; padding: 18px;
    border: 1px solid rgba(255,255,255,0.04);
  }
  .canvas-panel h4 {
    font-family: 'JetBrains Mono', monospace; font-size: 10px; text-transform: uppercase; letter-spacing: 0.14em;
    color: rgba(236,230,219,0.5); margin-bottom: 16px; font-weight: 500;
  }
  .token-row {
    display: flex; align-items: center; gap: 10px; padding: 8px 0;
    font-family: 'JetBrains Mono', monospace; font-size: 12px; color: rgba(236,230,219,0.8);
  }
  .token-swatch { width: 18px; height: 18px; border-radius: 6px; flex-shrink: 0; }
  .preview-area {
    display: flex; align-items: center; justify-content: center;
    background: radial-gradient(ellipse at center, rgba(255,255,255,0.04), transparent 70%);
    border-radius: 8px; min-height: 280px; position: relative;
  }
  .preview-ribbons { display: flex; flex-direction: column; gap: 14px; }
  .pv-ribbon { width: 280px; height: 56px; border-radius: 999px; overflow: hidden; position: relative; box-shadow: 0 10px 30px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.15); }
  .pv-ribbon::after { content: ""; position: absolute; inset: 0; border-radius: 999px; background: linear-gradient(180deg, rgba(255,255,255,0.2), transparent 35%, rgba(0,0,0,0.25)); }
  .pv1 { background: linear-gradient(90deg, var(--cobalt) 0%, var(--cobalt) 40%, var(--amber) 40%, var(--amber) 100%); }
  .pv2 { background: linear-gradient(90deg, var(--coral) 0%, var(--coral) 33%, var(--pink) 33%, var(--pink) 66%, var(--violet) 66%, var(--violet) 100%); }
  .pv3 { background: linear-gradient(90deg, var(--green) 0%, var(--green) 50%, var(--cyan) 50%, var(--cyan) 100%); }

  .pricing { padding: 140px 56px; }
  .pricing-head { text-align: center; margin-bottom: 80px; }
  .pricing-head h2 {
    font-family: 'Instrument Serif', serif; font-weight: 400;
    font-size: 72px; line-height: 0.98; letter-spacing: -0.02em; margin-bottom: 16px;
  }
  .pricing-head h2 em { font-style: italic; color: var(--cobalt); }
  .pricing-head p { font-size: 17px; color: var(--ink-soft); max-width: 520px; margin: 0 auto; }
  .pricing-grid {
    display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; max-width: 1200px; margin: 0 auto;
  }
  .price-card {
    background: var(--paper);
    border: 1px solid var(--line);
    border-radius: 20px; padding: 36px 32px;
    display: flex; flex-direction: column; gap: 28px;
    transition: transform .3s, box-shadow .3s;
    position: relative;
  }
  .price-card:hover { transform: translateY(-4px); box-shadow: 0 20px 50px rgba(26,24,20,0.08); }
  .price-card.featured {
    background: var(--ink); color: var(--paper); border-color: var(--ink);
  }
  .price-ribbon {
    width: 64px; height: 28px; border-radius: 999px; overflow: hidden; position: relative;
    box-shadow: inset 0 1px 0 rgba(255,255,255,0.2);
  }
  .price-ribbon::after { content: ""; position: absolute; inset: 0; border-radius: 999px; background: linear-gradient(180deg, rgba(255,255,255,0.25), transparent 40%, rgba(0,0,0,0.2)); }
  .pr-starter { background: linear-gradient(90deg, var(--cyan) 0%, var(--cyan) 50%, var(--cobalt) 50%, var(--cobalt) 100%); }
  .pr-studio { background: linear-gradient(90deg, var(--amber) 0%, var(--amber) 33%, var(--coral) 33%, var(--coral) 66%, var(--violet) 66%, var(--violet) 100%); }
  .pr-scale { background: linear-gradient(90deg, var(--green) 0%, var(--green) 40%, var(--indigo) 40%, var(--indigo) 100%); }
  .price-card h3 {
    font-family: 'Instrument Serif', serif; font-weight: 400; font-size: 28px; letter-spacing: -0.015em;
  }
  .price-amount { display: flex; align-items: baseline; gap: 6px; }
  .price-amount .num { font-family: 'Instrument Serif', serif; font-size: 56px; line-height: 1; letter-spacing: -0.02em; }
  .price-amount .per { font-size: 14px; opacity: 0.65; }
  .price-desc { font-size: 14px; line-height: 1.5; opacity: 0.7; }
  .price-feats { list-style: none; display: flex; flex-direction: column; gap: 12px; font-size: 14px; }
  .price-feats li { display: flex; align-items: center; gap: 10px; }
  .price-feats li::before {
    content: ""; width: 16px; height: 6px; border-radius: 999px; flex-shrink: 0;
    background: linear-gradient(90deg, var(--coral) 0%, var(--coral) 50%, var(--amber) 50%, var(--amber) 100%);
  }
  .price-card.featured .price-feats li::before { background: linear-gradient(90deg, var(--amber) 0%, var(--amber) 50%, var(--pink) 50%, var(--pink) 100%); }
  .price-card.featured .pill-ghost-featured {
    background: var(--paper); color: var(--ink); border: none;
  }

  .testimonial {
    padding: 140px 56px;
    display: grid; grid-template-columns: 1fr 1.3fr; gap: 80px; align-items: center;
    border-top: 1px solid var(--line);
  }
  .testimonial-visual {
    position: relative; height: 400px; display: flex; align-items: center; justify-content: center;
  }
  .tv-ribbon {
    position: absolute; width: 320px; height: 80px; border-radius: 999px; overflow: hidden;
    box-shadow: 0 20px 50px rgba(26,24,20,0.15), inset 0 1px 0 rgba(255,255,255,0.15);
  }
  .tv-ribbon::after { content: ""; position: absolute; inset: 0; border-radius: 999px; background: linear-gradient(180deg, rgba(255,255,255,0.25), transparent 35%, rgba(0,0,0,0.2)); }
  .tv1 { top: 80px; left: 10px; transform: rotate(-10deg); background: linear-gradient(90deg, var(--cobalt) 0%, var(--cobalt) 35%, var(--amber) 35%, var(--amber) 100%); }
  .tv2 { top: 180px; left: 40px; transform: rotate(8deg); background: linear-gradient(90deg, var(--coral) 0%, var(--coral) 40%, var(--pink) 40%, var(--pink) 70%, var(--violet) 70%, var(--violet) 100%); }
  .tv3 { top: 280px; left: 20px; transform: rotate(-6deg); background: linear-gradient(90deg, var(--green) 0%, var(--green) 55%, var(--cyan) 55%, var(--cyan) 100%); }
  blockquote {
    font-family: 'Instrument Serif', serif; font-weight: 400;
    font-size: 44px; line-height: 1.15; letter-spacing: -0.015em; margin-bottom: 32px;
  }
  blockquote em { font-style: italic; color: var(--coral); }
  .testimonial-author { display: flex; align-items: center; gap: 16px; }
  .ta-avatar {
    width: 48px; height: 48px; border-radius: 999px;
    background: linear-gradient(135deg, var(--amber), var(--coral));
    display: flex; align-items: center; justify-content: center;
    color: #fff; font-weight: 600; font-size: 16px;
  }
  .ta-info .name { font-weight: 600; font-size: 15px; }
  .ta-info .role { font-size: 13px; color: var(--ink-soft); margin-top: 2px; }

  .final-cta {
    margin: 80px 56px 120px;
    background: var(--paper-2);
    border-radius: 32px; padding: 96px 64px; text-align: center;
    position: relative; overflow: hidden;
  }
  .final-cta::before {
    content: ""; position: absolute; top: -60px; left: -60px; width: 360px; height: 90px;
    border-radius: 999px;
    background: linear-gradient(90deg, var(--cobalt) 0%, var(--cobalt) 40%, var(--green) 40%, var(--green) 100%);
    transform: rotate(-20deg);
  }
  .final-cta::after {
    content: ""; position: absolute; bottom: -60px; right: -60px; width: 360px; height: 90px;
    border-radius: 999px;
    background: linear-gradient(90deg, var(--amber) 0%, var(--amber) 33%, var(--coral) 33%, var(--coral) 66%, var(--violet) 66%, var(--violet) 100%);
    transform: rotate(-20deg);
  }
  .final-cta-inner { position: relative; z-index: 2; max-width: 720px; margin: 0 auto; }
  .final-cta h2 {
    font-family: 'Instrument Serif', serif; font-weight: 400;
    font-size: 80px; line-height: 0.98; letter-spacing: -0.025em; margin-bottom: 24px;
  }
  .final-cta h2 em { font-style: italic; background: linear-gradient(90deg, var(--cobalt), var(--coral) 50%, var(--amber)); -webkit-background-clip: text; background-clip: text; color: transparent; }
  .final-cta p { font-size: 18px; color: var(--ink-soft); margin-bottom: 40px; }
  .final-cta-row { display: flex; gap: 14px; justify-content: center; }

  footer { padding: 64px 56px 40px; border-top: 1px solid var(--line); }
  .footer-ribbon {
    width: 100%; height: 14px; border-radius: 999px; overflow: hidden; margin-bottom: 40px; position: relative;
    background: linear-gradient(90deg,
      var(--cobalt) 0%, var(--cobalt) 14%,
      var(--green) 14%, var(--green) 28%,
      var(--amber) 28%, var(--amber) 42%,
      var(--coral) 42%, var(--coral) 56%,
      var(--pink) 56%, var(--pink) 70%,
      var(--violet) 70%, var(--violet) 84%,
      var(--cyan) 84%, var(--cyan) 100%);
  }
  .footer-ribbon::after { content: ""; position: absolute; inset: 0; border-radius: 999px; background: linear-gradient(180deg, rgba(255,255,255,0.25), transparent 35%, rgba(0,0,0,0.2)); }
  .footer-grid {
    display: grid; grid-template-columns: 1.5fr 1fr 1fr 1fr 1fr; gap: 48px; margin-bottom: 64px;
  }
  .footer-brand p { font-size: 14px; color: var(--ink-soft); line-height: 1.55; margin-top: 20px; max-width: 280px; }
  .footer-col h5 {
    font-family: 'JetBrains Mono', monospace; font-size: 11px; text-transform: uppercase; letter-spacing: 0.14em;
    color: var(--ink-soft); margin-bottom: 18px; font-weight: 500;
  }
  .footer-col ul { list-style: none; display: flex; flex-direction: column; gap: 10px; }
  .footer-col a { font-size: 14px; color: var(--ink); transition: opacity .2s; }
  .footer-col a:hover { opacity: 0.6; }
  .footer-bottom {
    display: flex; justify-content: space-between; align-items: center;
    padding-top: 32px; border-top: 1px solid var(--line);
    font-family: 'JetBrains Mono', monospace; font-size: 11px; text-transform: uppercase; letter-spacing: 0.14em;
    color: var(--ink-soft);
  }
`;

const Nav = ({ scrolled }) => {
  return (
    <nav className={`ribbon-nav${scrolled ? ' scrolled' : ''}`}>
      <div className="logo">
        <div className="logo-mark"></div>
        <span>Ribbon</span>
      </div>
      <div className="nav-links">
        <a href="#product">Product</a>
        <a href="#systems">Systems</a>
        <a href="#pricing">Pricing</a>
        <a href="#studio">Studio</a>
        <a href="#changelog">Changelog</a>
      </div>
      <div className="nav-cta">
        <span className="sign-in">Sign in</span>
        <button className="pill primary small">Start free</button>
      </div>
    </nav>
  );
};

const Hero = () => (
  <section className="hero">
    <div>
      <div className="eyebrow">
        <span className="eyebrow-dot"></span>
        <span>Ribbon v4.2 — Spectrum release</span>
      </div>
      <h1>Design systems, <em>woven</em> into your product.</h1>
      <p className="lede">Ribbon is the design infrastructure for teams that take craft seriously. Tokens, components, and documentation — kept in perfect sync from Figma to production.</p>
      <div className="hero-ctas">
        <button className="pill primary">Start building free</button>
        <button className="pill ghost">Watch the tour</button>
      </div>
      <div className="hero-meta">
        <div className="hero-meta-item">
          <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8"><path d="M20 6 9 17l-5-5"></path></svg>
          <span>No credit card</span>
        </div>
        <div className="hero-meta-item">
          <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8"><path d="M20 6 9 17l-5-5"></path></svg>
          <span>Free for 5 seats</span>
        </div>
        <div className="hero-meta-item">
          <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8"><path d="M20 6 9 17l-5-5"></path></svg>
          <span>SOC 2 Type II</span>
        </div>
      </div>
    </div>
    <div className="composition">
      <div className="ribbon-strip ribbon-1"></div>
      <div className="ribbon-strip ribbon-2"></div>
      <div className="ribbon-strip ribbon-3"></div>
      <div className="ribbon-strip ribbon-4"></div>
    </div>
  </section>
);

const LogoCloud = () => (
  <section className="logos">
    <div className="logos-label">Trusted by product teams at</div>
    <div className="logos-grid">
      <div className="logo-item">Meridian</div>
      <div className="logo-item bold">NORTHWIND</div>
      <div className="logo-item mono">/Parallel</div>
      <div className="logo-item">Fieldwork</div>
      <div className="logo-item bold">ATLAS°</div>
      <div className="logo-item mono">Canopy_</div>
    </div>
  </section>
);

const Features = () => {
  const featureData = [
    { idx: '01 / Tokens', cls: 'fr-1', title: 'Semantic tokens, versioned.', desc: 'Primitive to semantic to component tokens — with full diff history, branching, and a review flow your engineers will actually use.' },
    { idx: '02 / Components', cls: 'fr-2', title: 'Components that stay in sync.', desc: 'Bi-directional sync between Figma and your codebase. Props, variants, and states are authored once and flow everywhere.' },
    { idx: '03 / Themes', cls: 'fr-3', title: 'Themes without the tangle.', desc: 'Dark mode, brand skins, density modes, accessibility variants. Compose them with overrides — not copies.' },
    { idx: '04 / Docs', cls: 'fr-4', title: 'Docs that write themselves.', desc: 'Every component page is generated from the source. Usage guidelines live next to the thing they describe.' },
    { idx: '05 / Pipelines', cls: 'fr-5', title: 'Ship via your own CI.', desc: 'Publish tokens as npm, CSS, Swift, Kotlin, or anything custom. Hook into Git, Linear, and your design review process.' },
    { idx: '06 / Governance', cls: 'fr-6', title: 'Review, approve, enforce.', desc: 'Role-based access, contribution guidelines, and automatic lint rules keep the system consistent as your team scales.' },
  ];

  return (
    <section className="features">
      <div className="section-head">
        <h2>One source of truth for <em>every pixel</em> you ship.</h2>
        <p>Stop reconciling tokens across tools. Ribbon unifies your design language into a living system that designers, engineers, and PMs all edit together.</p>
      </div>
      <div className="features-grid">
        {featureData.map((f, i) => (
          <div className="feature" key={i}>
            <div className="feature-idx">{f.idx}</div>
            <div>
              <div className={`feature-ribbon ${f.cls}`}></div>
            </div>
            <div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

const Showcase = () => (
  <section className="showcase">
    <div className="showcase-inner">
      <div className="showcase-eyebrow">The Spectrum Editor</div>
      <h2>Author tokens <em>like colors on a palette.</em></h2>
      <p>A dedicated canvas for designing the foundations of your product. Drag, combine, and preview — then publish the result to every surface your team ships to.</p>

      <div className="canvas-demo">
        <div className="canvas-top">
          <div className="canvas-dots">
            <span></span><span></span><span></span>
          </div>
          <div className="canvas-title">spectrum / brand-core.ribbon</div>
        </div>
        <div className="canvas-grid">
          <div className="canvas-panel">
            <h4>Tokens</h4>
            <div className="token-row"><span className="token-swatch" style={{ background: 'var(--cobalt)' }}></span>color.brand.primary</div>
            <div className="token-row"><span className="token-swatch" style={{ background: 'var(--coral)' }}></span>color.brand.accent</div>
            <div className="token-row"><span className="token-swatch" style={{ background: 'var(--amber)' }}></span>color.signal.warn</div>
            <div className="token-row"><span className="token-swatch" style={{ background: 'var(--green)' }}></span>color.signal.ok</div>
            <div className="token-row"><span className="token-swatch" style={{ background: 'var(--violet)' }}></span>color.surface.muted</div>
            <div className="token-row"><span className="token-swatch" style={{ background: 'var(--pink)' }}></span>color.accent.soft</div>
            <div className="token-row"><span className="token-swatch" style={{ background: 'var(--cyan)' }}></span>color.info.base</div>
          </div>
          <div className="canvas-panel preview-area">
            <div className="preview-ribbons">
              <div className="pv-ribbon pv1"></div>
              <div className="pv-ribbon pv2"></div>
              <div className="pv-ribbon pv3"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const Pricing = () => (
  <section className="pricing">
    <div className="pricing-head">
      <h2>Pricing that <em>scales with you.</em></h2>
      <p>Start free for small teams. Upgrade when your system grows up.</p>
    </div>
    <div className="pricing-grid">
      <div className="price-card">
        <div className="price-ribbon pr-starter"></div>
        <div>
          <h3>Starter</h3>
          <p className="price-desc">For solo designers and small teams exploring systems thinking.</p>
        </div>
        <div className="price-amount"><span className="num">$0</span><span className="per">forever</span></div>
        <ul className="price-feats">
          <li>Up to 5 editors</li>
          <li>Core tokens &amp; components</li>
          <li>Figma plugin</li>
          <li>Community support</li>
        </ul>
        <button className="pill ghost" style={{ width: '100%' }}>Start free</button>
      </div>
      <div className="price-card featured">
        <div className="price-ribbon pr-studio"></div>
        <div>
          <h3>Studio</h3>
          <p className="price-desc">For design teams who need governance, theming, and production pipelines.</p>
        </div>
        <div className="price-amount"><span className="num">$24</span><span className="per">/ editor / month</span></div>
        <ul className="price-feats">
          <li>Unlimited editors</li>
          <li>Themes &amp; branching</li>
          <li>CI publishing (npm, iOS, Android)</li>
          <li>Review workflows</li>
          <li>Priority support</li>
        </ul>
        <button className="pill primary" style={{ width: '100%' }}>Start 14-day trial</button>
      </div>
      <div className="price-card">
        <div className="price-ribbon pr-scale"></div>
        <div>
          <h3>Scale</h3>
          <p className="price-desc">For organizations with multiple products, brands, and compliance needs.</p>
        </div>
        <div className="price-amount"><span className="num">Custom</span></div>
        <ul className="price-feats">
          <li>Multi-workspace federation</li>
          <li>SSO, SCIM, audit logs</li>
          <li>Dedicated environment</li>
          <li>Design system architect</li>
          <li>SOC 2 &amp; HIPAA</li>
        </ul>
        <button className="pill ghost" style={{ width: '100%' }}>Talk to sales</button>
      </div>
    </div>
  </section>
);

const Testimonial = () => (
  <section className="testimonial">
    <div className="testimonial-visual">
      <div className="tv-ribbon tv1"></div>
      <div className="tv-ribbon tv2"></div>
      <div className="tv-ribbon tv3"></div>
    </div>
    <div>
      <blockquote>"We collapsed three tools into Ribbon. Our engineers stopped arguing about hex codes and <em>started shipping faster</em>. It's the first design system tool that actually felt native to both sides of the table."</blockquote>
      <div className="testimonial-author">
        <div className="ta-avatar">SL</div>
        <div className="ta-info">
          <div className="name">Sana Lindqvist</div>
          <div className="role">VP of Design, Meridian</div>
        </div>
      </div>
    </div>
  </section>
);

const FinalCTA = () => (
  <section className="final-cta">
    <div className="final-cta-inner">
      <h2>Your system, <em>finally woven together.</em></h2>
      <p>Join 4,200 product teams who replaced spreadsheets and Slack threads with a single source of truth.</p>
      <div className="final-cta-row">
        <button className="pill primary">Start building free</button>
        <button className="pill ghost">Book a demo</button>
      </div>
    </div>
  </section>
);

const Footer = () => (
  <footer>
    <div className="footer-ribbon"></div>
    <div className="footer-grid">
      <div className="footer-brand">
        <div className="logo">
          <div className="logo-mark"></div>
          <span>Ribbon</span>
        </div>
        <p>Design infrastructure for teams that take craft seriously. Made in Copenhagen and distributed globally.</p>
      </div>
      <div className="footer-col">
        <h5>Product</h5>
        <ul>
          <li><a href="#">Tokens</a></li>
          <li><a href="#">Components</a></li>
          <li><a href="#">Themes</a></li>
          <li><a href="#">Pipelines</a></li>
        </ul>
      </div>
      <div className="footer-col">
        <h5>Resources</h5>
        <ul>
          <li><a href="#">Documentation</a></li>
          <li><a href="#">Changelog</a></li>
          <li><a href="#">Systems Library</a></li>
          <li><a href="#">Community</a></li>
        </ul>
      </div>
      <div className="footer-col">
        <h5>Company</h5>
        <ul>
          <li><a href="#">About</a></li>
          <li><a href="#">Careers</a></li>
          <li><a href="#">Press</a></li>
          <li><a href="#">Contact</a></li>
        </ul>
      </div>
      <div className="footer-col">
        <h5>Legal</h5>
        <ul>
          <li><a href="#">Terms</a></li>
          <li><a href="#">Privacy</a></li>
          <li><a href="#">Security</a></li>
          <li><a href="#">DPA</a></li>
        </ul>
      </div>
    </div>
    <div className="footer-bottom">
      <div>© Ribbon Systems ApS</div>
      <div>Copenhagen — Lisbon — Brooklyn</div>
    </div>
  </footer>
);

const HomePage = () => (
  <>
    <Hero />
    <LogoCloud />
    <Features />
    <Showcase />
    <Pricing />
    <Testimonial />
    <FinalCTA />
    <Footer />
  </>
);

const App = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const styleEl = document.createElement('style');
    styleEl.textContent = customStyles;
    document.head.appendChild(styleEl);
    return () => document.head.removeChild(styleEl);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Router basename="/">
      <div>
        <Nav scrolled={scrolled} />
        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
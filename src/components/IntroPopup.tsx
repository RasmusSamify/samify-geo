import { useEffect, useRef, useState } from "react";
import { Icon } from "./Icon";

export const IntroPopup = () => {
  const [open, setOpen] = useState(true);
  const [closing, setClosing] = useState(false);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const ctaBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Fokusera CTA-knappen direkt (mest naturligt nästa-steg)
    // preventScroll förhindrar att webbläsaren auto-skrollar overlay-containern
    // till knappen, vilket annars hamnar i botten av popupen.
    setTimeout(() => ctaBtnRef.current?.focus({ preventScroll: true }), 100);

    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
      // Enkel focus trap mellan stäng-knapp och CTA
      if (e.key === "Tab") {
        const active = document.activeElement;
        if (e.shiftKey) {
          if (active === closeBtnRef.current) {
            e.preventDefault();
            ctaBtnRef.current?.focus();
          }
        } else {
          if (active === ctaBtnRef.current) {
            e.preventDefault();
            closeBtnRef.current?.focus();
          }
        }
      }
    };
    window.addEventListener("keydown", handler);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", handler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => setOpen(false), 220);
  };

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="intro-popup-title"
      className={`intro-popup-overlay ${closing ? "intro-popup-closing" : ""}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div className="intro-popup-card">
        <div className="intro-popup-rail" aria-hidden />

        <button
          ref={closeBtnRef}
          onClick={handleClose}
          aria-label="Stäng intro"
          className="intro-popup-close"
        >
          <Icon name="close" size={16} />
        </button>

        <div className="intro-popup-eyebrow">FÖR GEOSYNTEC</div>

        <h1 id="intro-popup-title" className="intro-popup-title">
          AI ersätter inte miljökonsulten. Miljökonsulten{" "}
          <em className="intro-popup-title-emph">med</em> AI ersätter den utan.
        </h1>

        <p className="intro-popup-intro">
          Den rimligaste frågan en konsultverksamhet ställer om ett verktyg som
          det här är troligen den enklaste:{" "}
          <em>"Om AI skriver rapporterna, vad händer med våra timmar?"</em>
        </p>

        <p className="intro-popup-lead">
          Rimlig fråga. Men datan ger ett tydligt och kontraintuitivt svar.
        </p>

        <div className="intro-popup-section">
          <h2 className="intro-popup-h2">Vad konsulter med AI faktiskt levererar</h2>
          <p className="intro-popup-body">
            Harvard Business School körde 2023 en kontrollerad studie där
            konsulter fick tillgång till AI i vardagsarbetet. Mot kontrollgruppen
            utan AI levererade de{" "}
            <span className="intro-popup-stat">25,1 %</span> snabbare, klarade{" "}
            <span className="intro-popup-stat">12,2 %</span> fler uppdrag, och
            fick kvalitetsbedömningar över{" "}
            <span className="intro-popup-stat">40 %</span> högre.
          </p>
          <p className="intro-popup-body">
            För miljökonsulter specifikt rapporteras{" "}
            <span className="intro-popup-stat">30–50 %</span> tidsbesparing på
            rutinanalys och rapportering, och{" "}
            <span className="intro-popup-stat">40–60 %</span> kortare ledtid på
            miljökonsekvensbeskrivningar. Utan att kompromissa med
            regelefterlevnad.
          </p>
        </div>

        <div className="intro-popup-section">
          <h2 className="intro-popup-h2">Var vinsten faktiskt landar</h2>
          <p className="intro-popup-body">
            EY:s AI Pulse Survey 2025:{" "}
            <span className="intro-popup-stat">96 %</span> av organisationer som
            investerat i AI ser mätbara produktivitetsvinster. Endast{" "}
            <span className="intro-popup-stat">17 %</span> omsätter dem i
            personalnedskärningar. Resterande{" "}
            <span className="intro-popup-stat">83 %</span> reinvesterar i ny
            kapacitet, R&D och bredare tjänsteutbud.
          </p>
          <p className="intro-popup-body">
            Översatt till miljökonsult: timmarna som försvinner är datautdrag,
            korsreferering, formatering och första utkast. Timmarna som blir kvar
            är rådgivning, riskbedömning och förhandling. Det är vad klienten
            faktiskt vill betala för, och det enda ert timpris är försvarbart
            för.
          </p>
        </div>

        <div className="intro-popup-section">
          <h2 className="intro-popup-h2">
            Vad AI inte klarar, och därför behöver er
          </h2>
          <div className="intro-popup-columns">
            <div className="intro-popup-col">
              <div className="intro-popup-col-label">AI gör</div>
              <ul className="intro-popup-list intro-popup-list-gold">
                <li>
                  Extraherar kontamineringsdata ur 200 sidor labbprotokoll på
                  sekunder
                </li>
                <li>
                  Korsrefererar KM/MKM-värden mellan jurisdiktioner medan ni sover
                </li>
                <li>Skriver första utkastet av statusrapporten</li>
              </ul>
            </div>
            <div className="intro-popup-col">
              <div className="intro-popup-col-label">AI gör inte</div>
              <ul className="intro-popup-list intro-popup-list-purple">
                <li>Skiljer gammal rostfläck från färskt oljespill i fält</li>
                <li>Ser blänket på vattnet och anar en kolvätesplym</li>
                <li>
                  Sitter i förhandling med Länsstyrelsen och tolkar vad de{" "}
                  <em>egentligen</em> kommer kräva
                </li>
              </ul>
            </div>
          </div>
          <p className="intro-popup-body intro-popup-italic">
            Där ligger expertisen. Resten är arbete som inte gör er rikare, bara
            mer slitna.
          </p>
        </div>

        <div className="intro-popup-section">
          <h2 className="intro-popup-h2">Att leda kräver mer än att börja</h2>
          <p className="intro-popup-body">
            Att börja med AI är trivialt 2026. Alla gör det. Att göra det rätt är
            vad som faktiskt skapar försprång. Försprång som kan försvaras med
            data idag, och fortfarande funkar om ett år.
          </p>
          <p className="intro-popup-body">
            <strong>Mätbarhet är skillnaden.</strong> Varje sparad timme, varje
            hotspot fångad, varje uppdrag levererat snabbare. Synligt i klartext,
            inte i påståenden.
          </p>
          <p className="intro-popup-body">
            <strong>Partnerskap är skillnaden.</strong> AI-landskapet om tolv
            månader ser inte ut som idag. Samify Geo är inte ett verktyg ni köper
            en gång. Det är en plattform som utvecklas med er, mot den verklighet
            ni vaknar upp till 2027. Och 2028. Och 2029.
          </p>
          <p className="intro-popup-body intro-popup-italic">
            Beslut styrs av statistik, inte magkänsla. Idag. Och om ett år.
          </p>
        </div>

        <div className="intro-popup-divider" aria-hidden />

        <p className="intro-popup-conclusion">
          Försprånget kommer inte av att börja med AI. Det kommer av att börja
          rätt.
        </p>
        <p className="intro-popup-subconclusion">
          Branschen anpassar sig redan. Frågan är om Geosyntec gör det rätt.
        </p>

        <button
          ref={ctaBtnRef}
          onClick={handleClose}
          className="intro-popup-cta"
        >
          <span>Visa mig demot</span>
          <span aria-hidden>→</span>
        </button>

        <div className="intro-popup-sources">
          Källor: Dell'Acqua et al., Harvard Business School (2023) · EY US AI
          Pulse Survey (2025) · HumanAI Industry Report (2026)
        </div>
      </div>
    </div>
  );
};

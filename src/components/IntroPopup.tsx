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
    setTimeout(() => ctaBtnRef.current?.focus(), 100);

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
          Den vanligaste oron vi möter när vi visar det här för konsultverksamheter
          är: <em>"Om AI skriver rapporterna — vad händer med våra timmar?"</em>
        </p>

        <p className="intro-popup-lead">
          Rimlig fråga. Men datan pekar åt ett annat håll än man tror.
        </p>

        <div className="intro-popup-section">
          <h2 className="intro-popup-h2">Vad konsulter med AI faktiskt presterar</h2>
          <p className="intro-popup-body">
            En studie från Harvard Business School följde konsulter som fick AI
            integrerat i sitt arbete. De levererade{" "}
            <span className="intro-popup-stat">25,1 %</span> snabbare,{" "}
            <span className="intro-popup-stat">12,2 %</span> fler uppdrag, och med
            över <span className="intro-popup-stat">40 %</span> högre kvalitet
            jämfört med kontrollgruppen.
          </p>
          <p className="intro-popup-body">
            I miljökonsultbranschen specifikt rapporteras{" "}
            <span className="intro-popup-stat">30–50 %</span> tidsbesparing på
            rutinanalys och rapportering, samt{" "}
            <span className="intro-popup-stat">40–60 %</span> kortare ledtid på
            miljökonsekvensbeskrivningar — utan att tumma på regelefterlevnaden.
          </p>
        </div>

        <div className="intro-popup-section">
          <h2 className="intro-popup-h2">Var vinsten faktiskt landar</h2>
          <p className="intro-popup-body">
            EY:s AI Pulse Survey 2025:{" "}
            <span className="intro-popup-stat">96 %</span> av organisationer som
            investerat i AI ser produktivitetsvinster. Bara{" "}
            <span className="intro-popup-stat">17 %</span> använder vinsterna till
            att skära ner personal — resten reinvesterar i ny kapacitet, R&D och
            bredare tjänsteutbud.
          </p>
          <p className="intro-popup-body">
            Översatt till miljökonsult: tiden som sparas på datautdrag,
            korsreferering, formatering och första utkast hamnar i kvalificerad
            rådgivning. Det ni är värda ert timpris för. Det klienten faktiskt
            vill betala för.
          </p>
        </div>

        <div className="intro-popup-section">
          <h2 className="intro-popup-h2">Vad AI inte gör — och därför behöver er</h2>
          <div className="intro-popup-columns">
            <div className="intro-popup-col">
              <div className="intro-popup-col-label">AI gör</div>
              <ul className="intro-popup-list intro-popup-list-gold">
                <li>Extraherar kontamineringsdata ur 200 sidor PDF på sekunder</li>
                <li>
                  Korsrefererar KM/MKM-värden mellan jurisdiktioner i bakgrunden
                </li>
                <li>Skriver första utkastet till statusrapporten</li>
              </ul>
            </div>
            <div className="intro-popup-col">
              <div className="intro-popup-col-label">AI gör inte</div>
              <ul className="intro-popup-list intro-popup-list-purple">
                <li>Skiljer gammal rostfläck från färskt spill</li>
                <li>Ser blänken på vattnet och anar en kolvätesplym</li>
                <li>
                  Sitter i förhandling med Länsstyrelsen och bedömer vad de{" "}
                  <em>egentligen</em> kommer kräva
                </li>
              </ul>
            </div>
          </div>
          <p className="intro-popup-body intro-popup-italic">
            Det är där expertisen ligger. Resten är arbete som inte gör er rikare —
            bara mer trötta.
          </p>
        </div>

        <div className="intro-popup-divider" aria-hidden />

        <p className="intro-popup-conclusion">
          Det är inte AI som springer om en miljökonsult. Det är en annan
          miljökonsult som hunnit längre med AI än ni.
        </p>
        <p className="intro-popup-subconclusion">
          Frågan är inte om ni anpassar er. Det är om ni leder eller följer.
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

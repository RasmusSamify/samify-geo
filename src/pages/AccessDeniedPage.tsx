import { Link } from "react-router-dom";
import { Icon } from "../components/Icon";
import { ROLES, useRole } from "../hooks/useRole";

export const AccessDeniedPage = () => {
  const { profile, setRole } = useRole();

  return (
    <div className="flex-1 main-scroll overflow-y-auto bg-cream">
      <div className="max-w-[640px] mx-auto px-8 py-16">
        <div className="hairline rounded bg-paper p-8 text-center">
          <div
            className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center"
            style={{ background: "rgba(180, 83, 9, 0.15)", color: "#b45309" }}
          >
            <Icon name="alert" size={20} strokeWidth={2} />
          </div>
          <div className="font-mono text-[10px] uppercase tracking-wider text-ink-muted mb-1.5">
            403 · Saknar behörighet
          </div>
          <h1 className="text-[22px] font-semibold tracking-tight leading-tight mb-2">
            Den här sidan kräver VD-roll
          </h1>
          <p className="text-[13px] text-ink-soft leading-relaxed max-w-[420px] mx-auto mb-6">
            Du är inloggad som <strong>{profile.name}</strong> ({profile.title}).
            Kostnadsöversikt och faktureringsunderlag är begränsat till företagets
            ledning för konfidentialitet.
          </p>

          <div className="hairline-soft rounded bg-cream/40 p-4 text-left mb-5">
            <div className="font-mono text-[10px] uppercase tracking-wider text-ink-muted mb-2">
              Behörighetsmatris
            </div>
            <div className="space-y-1.5 text-[12px]">
              {[
                {
                  feature: "Projekt & arbetsflöde",
                  konsult: true,
                  vd: true,
                  owner: true,
                },
                { feature: "Dashboard", konsult: true, vd: true, owner: true },
                { feature: "Kunskapsbas + RAG", konsult: true, vd: true, owner: true },
                { feature: "Mallar & integrationer", konsult: true, vd: true, owner: true },
                { feature: "Roadmap & affärscase", konsult: true, vd: true, owner: true },
                {
                  feature: "Kostnader (kund-vy)",
                  konsult: false,
                  vd: true,
                  owner: true,
                },
                {
                  feature: "Marginal & påslag",
                  konsult: false,
                  vd: false,
                  owner: true,
                },
              ].map((row) => (
                <div
                  key={row.feature}
                  className="flex items-center justify-between py-1 border-b border-line-soft last:border-0"
                >
                  <span className="text-ink-soft">{row.feature}</span>
                  <div className="flex items-center gap-3">
                    <Permission has={row.konsult} role="Konsult" />
                    <Permission has={row.vd} role="VD" highlight />
                    <Permission has={row.owner} role="Samify" owner />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 justify-center">
            <Link
              to="/"
              className="btn-ghost hairline-soft px-3 py-1.5 rounded text-[12px] flex items-center gap-1.5"
            >
              <Icon name="chevronRight" size={12} className="rotate-180" />
              Tillbaka till projektet
            </Link>
            <button
              onClick={() => setRole("vd")}
              className="btn-accent px-3.5 py-1.5 rounded text-[12px] flex items-center gap-1.5"
              title="För demosyften — växla snabbt till VD-roll"
            >
              <Icon name="zap" size={12} strokeWidth={2} />
              Växla till {ROLES.vd.name} (demo)
            </button>
          </div>

          <div className="text-[10.5px] text-ink-muted mt-4 font-mono">
            I produktion sker växling via Entra SSO + Geosyntecs identity provider.
          </div>
        </div>
      </div>
    </div>
  );
};

const Permission = ({
  has,
  role,
  highlight,
  owner,
}: {
  has: boolean;
  role: string;
  highlight?: boolean;
  owner?: boolean;
}) => (
  <div className="flex items-center gap-1 text-[10.5px] font-mono uppercase tracking-wider w-[68px]">
    {has ? (
      <Icon
        name="check"
        size={11}
        strokeWidth={3}
        className={
          owner ? "text-purple-brand" : highlight ? "text-gold" : "text-green-brand"
        }
      />
    ) : (
      <Icon name="close" size={11} strokeWidth={2.5} className="text-ink-muted" />
    )}
    <span
      className={
        has
          ? owner
            ? "text-purple-brand"
            : highlight
              ? "text-gold"
              : "text-ink-soft"
          : "text-ink-muted"
      }
    >
      {role}
    </span>
  </div>
);

import type { ReactNode } from "react";

export type PMSection = {
  n: number;
  name: string;
  words: number;
  content: ReactNode;
  refs?: string[];
};

export const PM_SECTIONS: PMSection[] = [
  {
    n: 1,
    name: "Sammanfattning",
    words: 380,
    content: (
      <>
        <p>
          Geosyntec har på uppdrag av <strong>Boliden Mineral AB</strong> genomfört en
          kompletterande föroreningsundersökning av området <strong>Norra Lainas</strong>{" "}
          (fastighet Lainas 1:14) i Pajala kommun, Norrbottens län. Området omfattar
          cirka 12,4 hektar och utgjorde fram till 1991 verksamhetsområde för ett
          anrikningsverk samt slamdammar för avfallshantering.
        </p>
        <p>
          Undersökningen omfattade <strong>47 provpunkter</strong> och totalt{" "}
          <strong>564 mätvärden</strong> avseende metaller och spårämnen. Provtagning
          utfördes i april 2026 och analys genomfördes av ackrediterat laboratorium
          (Eurofins, ack.nr 1125).
        </p>
        <p>
          Resultaten visar att <strong>cirka 31 % av mätvärdena överskrider riktvärdet
          för känslig markanvändning (KM)</strong> enligt Naturvårdsverket 2009:1867.
          Vidare överskrider <strong>5,5 % av mätvärdena MKM</strong> och{" "}
          <strong>0,7 % FA-gränsen</strong>. Tre tydliga hotspots har identifierats —{" "}
          <span className="font-mono">B04</span>, <span className="font-mono">B09</span>{" "}
          och <span className="font-mono">B13</span> — samtliga belägna inom 80 meter
          från den tidigare slamdammen.
        </p>
        <p>
          Givet jordartsförhållandena (sandig morän över granit), grundvattennivå
          (4,2–6,8 m under markytan) och avstånd till närmaste vattendrag bedöms
          spridningsrisken som <strong>måttlig</strong>. Efterbehandlingsåtgärder
          rekommenderas i hotspot-områdena.
        </p>
      </>
    ),
    refs: [
      "[1] Eurofins EUSE-2026-009834 · provpunkter B01–B47",
      "[2] SGU jordartskartan 1:25 000, version 2026-02-14",
      "[3] Länsstyrelsen Norrbotten · EBH-stödet · objekt 14-LN-247",
      "[4] Naturvårdsverket 2009:1867 · senaste revision 2016-09-30",
    ],
  },
  {
    n: 2,
    name: "Bakgrund och syfte",
    words: 720,
    content: (
      <>
        <p>
          Norra Lainas gruvområde har en lång historia av tung industriell verksamhet.
          Det ursprungliga anrikningsverket etablerades 1947 i samband med malmbrytning
          i regionen och var i drift fram till 1991 då verksamheten lades ned. Under
          denna 44-åriga period bedrevs anrikning av sulfidmalm, vilket gav upphov till
          process- och rejektmaterial som deponerades i intilliggande slamdammar.
        </p>
        <p>
          Boliden Mineral AB övertog ansvaret för fastigheten <strong>Lainas 1:14</strong>{" "}
          i samband med en omstrukturering 2008. I dialog med Länsstyrelsen Norrbotten
          har behovet av en kompletterande föroreningsundersökning aktualiserats inför
          en planerad efterbehandling av området. Tidigare miljötekniska undersökningar
          (MIFO fas 2, genomförd 2017) klassade området som <strong>riskklass 2</strong>{" "}
          för det centrala verksamhetsområdet och <strong>riskklass 1</strong> för
          slamdammen i söder.
        </p>
        <p>
          Syftet med föreliggande undersökning är att:
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            Avgränsa förekomst av metaller och spårämnen i ytlig jord (0–3 m djup)
          </li>
          <li>
            Klassificera mätvärden mot Naturvårdsverkets generella riktvärden
            (NV 2009:1867)
          </li>
          <li>
            Identifiera så kallade hotspots med förhöjda halter över MKM eller FA
          </li>
          <li>
            Tillhandahålla beslutsunderlag för fortsatt utredning samt
            efterbehandlingsplanering
          </li>
        </ul>
        <p>
          Resultaten utgör underlag för ett kommande tekniskt åtgärdsförslag enligt
          SGI:s vägledning från 2009 och ska kunna ligga till grund för anmälan om
          efterbehandling enligt 28 § förordning (1998:899) om miljöfarlig verksamhet
          och hälsoskydd.
        </p>
      </>
    ),
    refs: [
      "[5] MIFO fas 2 · Norra Lainas · Länsstyrelsen Norrbotten 2017",
      "[6] SGI Vägledning · Riskbedömning av förorenade områden 2009",
    ],
  },
  {
    n: 3,
    name: "Områdesbeskrivning",
    words: 980,
    content: (
      <>
        <p>
          Undersökningsområdet är beläget cirka 14 km nordväst om Pajala tätort,
          i nära anslutning till Lainasälven. Topografin är svagt kuperad och varierar
          mellan kotor +180 och +212 m.ö.h. Markanvändningen i omedelbar närhet utgörs
          av skog (tall- och grandominerad) samt myrmark i de lägre partierna mot öster.
        </p>
        <p>
          <strong>Jordart och geologi.</strong> SGU:s jordartskarta i skala 1:25 000
          visar att områdets dominerande jordart är <em>sandig morän (Mn)</em>, med
          inslag av <em>glacial sand (Gs)</em> i sydsluttningen mot älven. Berggrunden
          utgörs av paleoproterozoisk granit (cirka 1,8 miljarder år) och förekommer i
          dagen i ett mindre område i västra delen. Stratigrafisk modell visar
          mulljord/organiskt material (0–0,4 m), sandig morän (0,4–2,8 m), glacial
          sand (2,8–5,6 m) och underliggande granit.
        </p>
        <p>
          <strong>Hydrogeologi.</strong> Grundvattennivån har observerats variera mellan
          4,2 och 6,8 m under markytan med högre nivåer i april–maj och lägre nivåer
          under sensommar. Inom 500 m radie finns sju brunnar i SGU:s brunnsarkiv, med
          djup mellan 12 och 87 m. Bedömt grundvattenmagasin utgörs av sand- och
          grusavlagringar med uttagskapacitet 2–10 l/s. Dominerande
          strömningsriktning är sydost, mot Lainasälven, vilket bedöms ge en
          spridningsväg om föroreningar når grundvattenzonen.
        </p>
        <p>
          <strong>Tidigare verksamhet.</strong> Historiska flygfoton från 1962, 1975,
          1988 och 2001 (Lantmäteriet) visar verksamhetens utveckling över tid.
          Anrikningsverket framgår tydligt i 1962 års flygfoto med tillhörande
          uppställningsytor och transportvägar. Slamdammen i söder vidgades i flera
          steg under 1970-talet och bedöms ha ett ytmått om cirka 2,1 ha vid
          stängningen 1988.
        </p>
        <p>
          Närmaste bostadsbebyggelse ligger cirka 1,2 km sydost om området.
          Vattendrag (Lainasälven) återfinns 280 m söderut. Området är inte
          inventerat som riksintresse för naturvård men gränsar till ett område med
          klassad höjdmark.
        </p>
      </>
    ),
    refs: [
      "[7] SGU Berggrundskartan 1:50 000, version 2025-11-08",
      "[8] Lantmäteriet historiska flygfoton 1962, 1975, 1988, 2001",
    ],
  },
  {
    n: 4,
    name: "Metodik",
    words: 640,
    content: (
      <>
        <p>
          Provtagning utfördes <strong>22–23 april 2026</strong> av Geosyntecs
          fältpersonal under ledning av certifierad miljöprovtagare. Totalt 47
          provpunkter etablerades enligt ett systematiskt rutnät (50 × 50 m) med
          förtätning kring förmodade föroreningskällor (anrikningsverkets fundament
          och slamdammen).
        </p>
        <p>
          <strong>Provtagningsmetod.</strong> Skruvprovtagning med MJK-borr till maximalt
          3 m djup, alternativt till hinder. Vid varje punkt uttogs prover från:
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Ytligt skikt (0–0,5 m)</li>
          <li>Mellanliggande skikt (0,5–1,5 m)</li>
          <li>Djupare skikt (1,5–3,0 m)</li>
        </ul>
        <p>
          Proverna förvarades i kylda glasburkar och transporterades till laboratorium
          inom 48 timmar. Borrkärnor fotodokumenterades och positionerades med
          RTK-GNSS (noggrannhet ±2 cm) i SWEREF 99 TM.
        </p>
        <p>
          <strong>Analys.</strong> Laboratorieanalys genomfördes av Eurofins (ack.nr
          1125) enligt metoden <span className="font-mono">SS-EN 16174:2012</span> för
          extraktion och <span className="font-mono">SS-EN ISO 17294-2:2016</span>{" "}
          (ICP-MS) för bestämning. Analyserade parametrar omfattar tio metaller och
          spårämnen: <em>Pb, As, Cd, Zn, Cu, Cr, Ni, Hg, Co</em> samt <em>V</em>. För
          varje prov bestämdes även torrsubstans (TS) samt glödförlust.
        </p>
        <p>
          <strong>Klassificering.</strong> Mätvärden jämförs mot Naturvårdsverkets
          generella riktvärden enligt rapport 2009:1867 (senast reviderad
          2016-09-30) för känslig markanvändning (KM), mindre känslig markanvändning
          (MKM) samt farligt avfall (FA). Hotspot-identifiering genomfördes med en
          klusteralgoritm (DBSCAN) på de provpunkter som överskrider MKM för minst
          en parameter.
        </p>
      </>
    ),
    refs: [
      "[9] SS-EN 16174:2012 · provberedning av slam, behandlat bioavfall och jord",
      "[10] SS-EN ISO 17294-2:2016 · vattenanalys ICP-MS",
    ],
  },
  {
    n: 5,
    name: "Resultat",
    words: 1450,
    content: (
      <>
        <p>
          Av de totalt 564 analyserade mätvärdena uppfyller{" "}
          <strong>387 (68,6 %)</strong> riktvärdet för känslig markanvändning (KM).
          Resterande mätvärden fördelas enligt följande:
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            <strong>142 mätvärden (25,2 %)</strong> överstiger KM men ligger under MKM
          </li>
          <li>
            <strong>31 mätvärden (5,5 %)</strong> överstiger MKM men ligger under FA
          </li>
          <li>
            <strong>4 mätvärden (0,7 %)</strong> överstiger FA-gränsen för farligt
            avfall
          </li>
        </ul>
        <p>
          Den geografiska spridningen är ojämn. Tre tydliga koncentrationer av
          förhöjda halter har identifierats, alla belägna inom 80 m från den tidigare
          slamdammen:
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            <span className="font-mono font-medium">B04</span> — bly 1 380 mg/kg TS,
            arsenik 64 mg/kg TS, kadmium 18,4 mg/kg TS (djup 0,5–1,5 m)
          </li>
          <li>
            <span className="font-mono font-medium">B09</span> — bly 924 mg/kg TS,
            arsenik 47 mg/kg TS, kadmium 21,7 mg/kg TS (djup 0,5–1,5 m)
          </li>
          <li>
            <span className="font-mono font-medium">B13</span> — bly 2 870 mg/kg TS,
            arsenik 81 mg/kg TS, kadmium 35,2 mg/kg TS (djup 1,5–3,0 m)
          </li>
        </ul>
        <p>
          B13 utgör den högst belastade punkten med flera mätvärden som överstiger
          FA-gränsen. Övriga mätvärden över MKM (15 punkter) fördelar sig längs en
          gradient från slamdammens norra utbredning mot anrikningsverkets
          fundamentplattform.
        </p>
        <p>
          <strong>Ämnesfördelning.</strong> Bly (Pb), arsenik (As) och kadmium (Cd)
          dominerar bilden vid hotspots och utgör tillsammans 73 % av samtliga
          MKM-överskridanden. Övriga ämnen (Zn, Cu, Cr, Ni) uppvisar en jämnare
          spridning med enstaka topprider i punkter där bottenaska från
          anrikningsverket bedöms ha deponerats. Kvicksilver (Hg) ligger genomgående
          under riktvärdet för KM.
        </p>
      </>
    ),
    refs: [
      "[11] Datafil · Eurofins EUSE-2026-009834 · komplett analystablå",
    ],
  },
  {
    n: 6,
    name: "Tolkning och riskbedömning",
    words: 1280,
    content: (
      <>
        <p>
          Den observerade föroreningsbilden stämmer väl med den historiska
          verksamheten i området. Förhöjda halter av <strong>bly, arsenik och kadmium</strong>
          {" "}— typiska indikatorer för sulfidmalmsanrikning — koncentreras till och
          omedelbart norr om den tidigare slamdammen. Detta bedöms vara förenligt
          med de processer som bedrevs vid anrikningsverket Lainas (1947–1991) och
          den efterföljande deponeringen i slamdamm söder (1953–1988).
        </p>
        <p>
          <strong>Spridningsrisk.</strong> Givet jordartsförhållandena (sandig morän
          över granit) och en grundvattennivå om 4,2–6,8 m bedöms föroreningarnas
          vertikala spridningsrisk som måttlig. Den horisontella spridningen
          begränsas av berggrundens utbredning i västsluttningen och områdets
          relativt täta jordlager.
        </p>
        <p>
          Närmaste vattendrag (Lainasälven) ligger 280 m sydost om hotspot-området.
          Med en grundvattenströmning i sydostlig riktning kan inläckage från
          slamdammen till älven inte uteslutas, men bedöms vara mycket begränsat i
          mätbar mängd. Vi rekommenderar provtagning av grundvattenrör i
          spridningsriktningen för att verifiera bedömningen.
        </p>
        <p>
          <strong>Hälsorisk.</strong> Områdets nuvarande markanvändning (icke-bebyggt,
          skogsmark) medför begränsade exponeringsvägar för människor. Vid framtida
          markanvändning för bostads- eller verksamhetsändamål bedöms hotspot-områdena
          inte uppfylla riktvärdet för känslig markanvändning utan
          efterbehandlingsåtgärder.
        </p>
        <p>
          <strong>Spridning till ytvatten.</strong> Inga akuta utfällningsrisker
          identifieras. Provtagning av Lainasälvens sediment cirka 100 m nedströms
          anslutningspunkten rekommenderas som komplement.
        </p>
      </>
    ),
    refs: [
      "[12] SGI vägledning · spridningsmodeller för förorenade områden 2009",
    ],
  },
  {
    n: 7,
    name: "Slutsatser",
    words: 720,
    content: (
      <>
        <p>
          Föroreningsundersökningen visar att Norra Lainas gruvområde uppvisar
          förhöjda halter av framförallt bly, arsenik och kadmium i tre tydliga
          hotspots inom 80 m från den tidigare slamdammen. Av 564 mätvärden
          överstiger 35 (6,2 %) riktvärdet för MKM, varav 4 (0,7 %) klassificeras
          som farligt avfall (FA).
        </p>
        <p>
          Föroreningsbilden bedöms vara kopplad till den historiska
          gruvverksamheten och utgör en lokaliserad föroreningskälla. Den
          horisontella och vertikala spridningen är begränsad, men spridning till
          underliggande grundvatten kan inte uteslutas utan kompletterande
          undersökningar.
        </p>
        <p>
          Sammantaget bedöms området kräva <strong>efterbehandling i de tre
          hotspot-områdena (B04, B09, B13)</strong> innan området kan upplåtas för
          mer känslig markanvändning. Övriga delar av området kan, efter mindre
          punktinsatser, godkännas för fortsatt skogsbruksanvändning.
        </p>
      </>
    ),
  },
  {
    n: 8,
    name: "Rekommendationer",
    words: 630,
    content: (
      <>
        <p>
          Baserat på resultaten föreslås följande åtgärder, i prioritetsordning:
        </p>
        <ol className="list-decimal pl-6 space-y-2">
          <li>
            <strong>Kompletterande grundvattenprovtagning</strong> — etablering av
            tre grundvattenrör i sydostlig riktning från slamdammen för att
            verifiera spridningsriskbedömningen. Genomförs inom 3 månader.
          </li>
          <li>
            <strong>Avgränsande provtagning kring hotspots B04, B09, B13</strong> —
            förtätning av provnät till 10 × 10 m rutnät för att fastställa
            föroreningskropparnas geometri inför efterbehandling.
          </li>
          <li>
            <strong>Sediment- och ytvattenprovtagning i Lainasälven</strong> —
            referensprov uppströms samt 100 m och 500 m nedströms
            anslutningspunkten. Avser metaller och spårämnen.
          </li>
          <li>
            <strong>Åtgärdsutredning enligt SGI:s vägledning</strong> — framtagande
            av tekniskt åtgärdsförslag som omfattar bortgrävning, on-site
            stabilisering eller inkapsling av föroreningskropparna i
            hotspot-områdena.
          </li>
          <li>
            <strong>Anmälan enligt 28 § FMH</strong> — efter åtgärdsutredningen
            inlämnas anmälan till Länsstyrelsen Norrbotten inför genomförande av
            efterbehandling.
          </li>
        </ol>
        <p className="mt-4">
          Geosyntec står gärna till tjänst med fortsatt rådgivning samt projekt- och
          entreprenadledning för åtgärdsfasen.
        </p>
      </>
    ),
    refs: [
      "[13] Förordning (1998:899) om miljöfarlig verksamhet och hälsoskydd",
      "[14] SGI · vägledning åtgärdsutredning förorenade områden",
    ],
  },
];

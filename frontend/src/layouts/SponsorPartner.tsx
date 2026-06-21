const sponsors = [
  { name: "IndoPrint", logo: "https://www.invofest-harkatnegeri.com/assets/sponsor/indo_print.jpg", href: "#" },
  { name: "Plaza Tegal by Horison", logo: "https://www.invofest-harkatnegeri.com/assets/sponsor/bahari_inn.jpg", href: "https://plazategal.hoteltegal.com/" },
  { name: "Big Berry", logo: "https://www.invofest-harkatnegeri.com/assets/sponsor/big_berry.png", href: "#" },
  { name: "Domainesia", logo: "https://www.invofest-harkatnegeri.com/assets/sponsor/domainesia.png", href: "#" },
  { name: "Dicoding", logo: "https://www.invofest-harkatnegeri.com/assets/sponsor/dicoding_official.png", href: "https://www.dicoding.com/" },
];

const mediaPartners = [
  { name: "HMP D3 Teknik Mesin UHN", logo: "https://www.invofest-harkatnegeri.com/assets/media_partner/HMP%20D3%20TEKNIK%20MESIN%20UHN.png" },
  { name: "HMTIKA", logo: "https://www.invofest-harkatnegeri.com/assets/media_partner/LOGO%20HMTIKA.png" },
  { name: "Info Lomba IT", logo: "https://www.invofest-harkatnegeri.com/assets/media_partner/logo%20info%20lomba%20IT.png" },
  { name: "HMP Teknik Komputer", logo: "https://www.invofest-harkatnegeri.com/assets/media_partner/LOGO%20HMP%20TEKNIK%20KOMPUTER%20.png" },
  { name: "Permikomnas", logo: "https://www.invofest-harkatnegeri.com/assets/media_partner/permikomnas.png" },
  { name: "HMTI UMMUS", logo: "https://www.invofest-harkatnegeri.com/assets/media_partner/logo%20HMTI%20UMMUS.png" },
  { name: "HMP D3 Perhotelan", logo: "https://www.invofest-harkatnegeri.com/assets/media_partner/LOGO%20HMP%20D3%20PERHOTELAN.png" },
  { name: "HMP D3 DKV", logo: "https://www.invofest-harkatnegeri.com/assets/media_partner/LOGO%20HMP%20D3%20DKV.png" },
  { name: "BEM", logo: "https://www.invofest-harkatnegeri.com/assets/media_partner/Logo%20BEM.png" },
  { name: "HIMAPIK", logo: "https://www.invofest-harkatnegeri.com/assets/media_partner/LOGO%20HIMAPIK.jpg" },
  { name: "BPM", logo: "https://www.invofest-harkatnegeri.com/assets/media_partner/BPM%20PNG.png" },
  { name: "HMPTI ITB STIKOM Bali", logo: "https://www.invofest-harkatnegeri.com/assets/media_partner/HMPTI_ITB_STIKOM_BALI.png" },
  { name: "Warga Tech", logo: "https://www.invofest-harkatnegeri.com/assets/media_partner/Logo%20warga%20tech.png" },
  { name: "HIMA Elektro", logo: "https://www.invofest-harkatnegeri.com/assets/media_partner/logo%20hima%20elektro.png" },
  { name: "Lomba IT", logo: "https://www.invofest-harkatnegeri.com/assets/media_partner/lomba%20it%20ii.png" },
];

interface LogoGridProps {
  items: { name: string; logo: string; href?: string }[];
}

function LogoGrid({ items }: LogoGridProps) {
  return (
    <div className="flex flex-wrap justify-center gap-6 py-4">
      {items.map((item, idx) => (
        <a
          key={`${item.name}-${idx}`}
          href={item.href ?? "#"}
          target={item.href && item.href !== "#" ? "_blank" : undefined}
          rel="noreferrer"
          className="w-40 h-24 flex items-center justify-center bg-white border border-gray-100 rounded-xl shadow-sm px-4 hover:shadow-md hover:border-red-200 transition-all duration-300"
        >
          <img
            src={item.logo}
            alt={item.name}
            className="max-w-full max-h-full object-contain grayscale hover:grayscale-0 hover:scale-105 transition-all duration-300"
            style={{ maxHeight: "70%" }}
          />
        </a>
      ))}
    </div>
  );
}

function SectionHeading({ prefix, highlight }: { prefix: string; highlight: string }) {
  return (
    <div className="text-center mb-10">
      <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-800">
        {prefix}{" "}
        <span className="text-[#C8102E] font-extrabold">{highlight}</span>
      </h2>
      <div className="mt-3 mx-auto w-12 h-1 rounded-full bg-gradient-to-r from-[#C8102E] to-[#e85d7a]" />
    </div>
  );
}

export default function Partner() {
  return (
    <section className="bg-white py-16 px-4">
      <div className="max-w-6xl mx-auto space-y-16">

        {/* ── Sponsor ── */}
        <div>
          <SectionHeading prefix="Sponsor" highlight="INVOFEST 2025" />
          <LogoGrid items={sponsors} />
        </div>

        {/* Divider */}
        <div className="border-t border-gray-100" />

        {/* ── Media Partner ── */}
        <div>
          <SectionHeading prefix="Media Partner" highlight="INVOFEST 2025" />
          <LogoGrid items={mediaPartners} />
        </div>

      </div>
    </section>
  );
}
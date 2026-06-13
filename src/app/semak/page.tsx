import Link from "next/link";
import { SemakForm } from "../../components/SemakForm";

export default function SemakPage() {
  return (
    <main className="shell compactShell">
      <section className="hero compactHero">
        <div>
          <p className="eyebrow">Tempahan PKG Pantai Remis</p>
          <h1>Semak Permohonan</h1>
          <p className="heroText">
            Cari semula permohonan yang masih menunggu kelulusan dan hantar semula mesej WhatsApp kepada admin.
          </p>
        </div>
        <div className="heroActions">
          <Link className="ghostButton" href="/">
            Kembali ke jadual
          </Link>
        </div>
      </section>

      <div className="lookupShell">
        <SemakForm />
      </div>
    </main>
  );
}

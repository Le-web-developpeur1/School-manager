import { useEffect, useState, useRef } from "react";
import { getReleveEleve } from "../../../services/paiementsService";


type Paiement = {
  _id: string;
  montant: number;
  mois: string;
  motif: string;
  datePaiement: string;
  modePaiement: string;
  comptable: string;
};

type Eleve = {
  nom: string;
  prenom: string;
  matricule: string;
};

type Props = {
  id: string;
};

const ReleveEleve = ({ id }: Props) => {
  const [eleve, setEleve] = useState<Eleve | null>(null);
  const [paiements, setPaiements] = useState<Paiement[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const charger = async () => {
      const res = await getReleveEleve(id);
      if (res?.success) {
        setEleve(res.eleve);
        setPaiements(res.paiements);
        setTotal(res.total);
      }
      setLoading(false);
    };
    charger();
  }, [id]);

  if (loading) return <p className="text-sm text-gray-500">Chargement du relevé…</p>;

  return (
    <div className="space-y-4">
      <div className="flex justify-end mb-4">
        <button
          onClick={() => {
            if (printRef.current) {
              const printContents = printRef.current.innerHTML;
              const printWindow = window.open("", "", "width=800,height=600");
              if (printWindow) {
                printWindow.document.write(`
                  <html>
                    <head>
                      <title>Relevé de Paiement</title>
                      <style>
                        body { font-family: sans-serif; padding: 20px; }
                        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                        th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
                        th { background-color: #f5f5f5; }
                      </style>
                    </head>
                    <body>${printContents}</body>
                  </html>
                `);
                printWindow.document.close();
                printWindow.focus();
                printWindow.print();
              }
            }
          }}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 text-sm"
        >
          📤 Imprimer le relevé
        </button>
      </div>
     <div ref={printRef}>
        <div className="header text-center">
          <img src="src/assets/images/logo.png" alt="LogoEcole" className="h-20 mx-auto" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">📄 Relevé de Paiement</h3>
          <p className="text-sm text-gray-600">
            Élève : <span className="font-medium">{eleve?.prenom} {eleve?.nom}</span><br />
            Matricule : <span className="font-mono">{eleve?.matricule}</span><br />
            Total encaissé : <span className="font-bold">{total.toLocaleString()} GNF</span>
          </p>
        </div>

        <table className="min-w-full text-sm border rounded-lg overflow-hidden">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="px-4 py-2">Mois</th>
              <th className="px-4 py-2">Motif</th>
              <th className="px-4 py-2">Montant</th>
              <th className="px-4 py-2">Mode</th>
              <th className="px-4 py-2">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paiements.map(p => (
              <tr key={p._id}>
                <td className="px-4 py-2">{p.mois}</td>
                <td className="px-4 py-2">{p.motif}</td>
                <td className="px-4 py-2">{p.montant.toLocaleString()} GNF</td>
                <td className="px-4 py-2">{p.modePaiement || "—"}</td>
                <td className="px-4 py-2">{new Date(p.datePaiement).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
     </div>
    </div>
  );
};

export default ReleveEleve;

import { useEffect, useState, useRef } from "react";
import { getTotalParClasse } from "../../../services/paiementsService";

type Props = {
  classeId: string;
  anneeScolaire?: string;
  mois?: number;
  annee?: number;
};

const StatsClasse = ({ classeId, anneeScolaire, mois, annee }: Props) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const charger = async () => {
      const res = await getTotalParClasse(classeId, { anneeScolaire, mois, annee });
      if (res?.success) setData(res);
      setLoading(false);
    };
    charger();
  }, [classeId, anneeScolaire, mois, annee]);

  const handlePrint = () => {
    if (printRef.current) {
      const printContents = printRef.current.innerHTML;
      const printWindow = window.open("", "", "width=800,height=600");
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Rapport Classe</title>
              <style>
                body { font-family: sans-serif; padding: 20px; }
                h1 { text-align: center; margin-bottom: 10px; }
                .header { text-align: center; margin-bottom: 20px; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
                th { background-color: #f5f5f5; }
                .footer { margin-top: 40px; text-align: right; font-style: italic; }
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
  };

  if (loading) return <p className="text-sm text-gray-500">Chargement du rapport…</p>;
  if (!data) return <p className="text-sm text-red-500">Aucune donnée disponible.</p>;

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          onClick={handlePrint}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 text-sm"
        >
          📤 Imprimer le rapport
        </button>
      </div>

      <div ref={printRef}>
        <div className="header">
          <img src="/logo.png" alt="Logo École" className="h-20 mx-auto mb-2" />
         <p className="text-sm text-gray-600">
            Rapport de Paiement — {new Date().toLocaleDateString()}
          </p>
        </div>

        <div className="text-sm text-gray-700 mb-4">
          <p><strong>Classe :</strong> {data.classe}</p>
          <p><strong>Année scolaire :</strong> {data.anneeScolaire}</p>
          <p><strong>Période :</strong> {data.mois !== "tous" ? `${data.mois}/${data.annee}` : "Toutes"}</p>
          <p><strong>Total encaissé :</strong> {data.total.toLocaleString()} GNF</p>
          <p><strong>Nombre de paiements :</strong> {data.nombrePaiements}</p>
        </div>

        <table className="text-sm">
          <thead>
            <tr>
              <th>Motif </th>
              <th>Montant </th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(data.breakdown).map(([motif, montant]) => (
              <tr key={motif}>
                <td>{motif} </td>
                <td>{montant.toLocaleString()} GNF</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StatsClasse;

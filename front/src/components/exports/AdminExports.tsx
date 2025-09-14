import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getClasse } from "./../../services/classeService";
import {
  exportListeElevesExcel,
  exportPaiementsExcel,
  exportPaiementsPDF,
} from "./../../services/exportService";

const AdminExports = () => {
  const [classes, setClasses] = useState<{ _id: string; nom: string }[]>([]);
  const [classeSelectionnee, setClasseSelectionnee] = useState<string>("");
  const [anneeScolaire, setAnneeScolaire] = useState<string>("");
  const [mois, setMois] = useState<string>("");

  useEffect(() => {
    const charger = async () => {
      const data = await getClasse();
      setClasses(Array.isArray(data) ? data : []);
    };
    charger();
  }, []);

  const telechargerFichier = (blob: Blob, nomFichier: string) => {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", nomFichier);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const handleExportElevesParClasse = async () => {
    if (!classeSelectionnee) return toast.error("Sélectionnez une classe");
    try {
      const blob = await exportListeElevesExcel(classeSelectionnee);
      telechargerFichier(blob, "eleves_classe.xlsx");
    } catch {
      toast.error("Erreur export élèves");
    }
  };

  const handleExportPaiementsExcel = async () => {
    if (!classeSelectionnee) return toast.error("Sélectionnez une classe");
    try {
      const blob = await exportPaiementsExcel(classeSelectionnee);
      telechargerFichier(blob, "paiements_classe.xlsx");
    } catch {
      toast.error("Erreur export paiements Excel");
    }
  };

  const handleExportPaiementsPDF = async () => {
    if (!classeSelectionnee) return toast.error("Sélectionnez une classe");
    try {
      const blob = await exportPaiementsPDF(classeSelectionnee);
      telechargerFichier(blob, "paiements_classe.pdf");
    } catch {
      toast.error("Erreur export PDF");
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">📤 Centre d’Exports</h1>
          <p className="text-sm text-gray-600">
            Exportez les données clés : listes d’élèves par classe, paiements par période.
          </p>
        </div>
      </div>

      <div className="border-t border-gray-100" />

      {/* Filtres */}
      <div className="flex flex-wrap gap-4 items-end">
        <div className="w-full sm:max-w-xs">
          <label className="block text-xs text-gray-500 mb-1">Classe</label>
          <select
            value={classeSelectionnee}
            onChange={(e) => setClasseSelectionnee(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg text-sm"
          >
            <option value="">Sélectionner une classe</option>
            {classes.map((c) => (
              <option key={c._id} value={c._id}>
                {c.nom}
              </option>
            ))}
          </select>
        </div>

        <div className="w-28">
          <label className="block text-xs text-gray-500 mb-1">Mois</label>
          <select
            value={mois}
            onChange={(e) => setMois(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg text-sm"
          >
            <option value="">Tous</option>
            {Array.from({ length: 12 }, (_, i) => {
              const m = String(i + 1).padStart(2, "0");
              return (
                <option key={m} value={m}>
                  {m}
                </option>
              );
            })}
          </select>
        </div>

        <div className="w-36">
          <label className="block text-xs text-gray-500 mb-1">Année scolaire</label>
          <input
            value={anneeScolaire}
            onChange={(e) => setAnneeScolaire(e.target.value)}
            placeholder="2024-2025"
            className="w-full px-3 py-2 border rounded-lg text-sm"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3 pt-2">
        <button
          onClick={handleExportElevesParClasse}
          disabled={!classeSelectionnee}
          className={`px-4 py-2 rounded text-sm ${
            classeSelectionnee
              ? "bg-green-600 text-white hover:bg-green-700"
              : "bg-green-100 text-green-700 cursor-not-allowed"
          }`}
        >
          📄 Exporter les élèves de la classe
        </button>

        <button
          onClick={handleExportPaiementsExcel}
          disabled={!classeSelectionnee}
          className={`px-4 py-2 rounded text-sm ${
            classeSelectionnee
              ? "bg-indigo-600 text-white hover:bg-indigo-700"
              : "bg-indigo-100 text-indigo-700 cursor-not-allowed"
          }`}
        >
          💳 Exporter paiements Excel
        </button>

        <button
          onClick={handleExportPaiementsPDF}
          disabled={!classeSelectionnee}
          className={`px-4 py-2 rounded text-sm ${
            classeSelectionnee
              ? "bg-red-600 text-white hover:bg-red-700"
              : "bg-red-100 text-red-700 cursor-not-allowed"
          }`}
        >
          🧾 Exporter paiements PDF
        </button>
      </div>
    </div>
  );
};

export default AdminExports;

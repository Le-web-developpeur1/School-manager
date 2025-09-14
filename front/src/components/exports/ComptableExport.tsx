import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
  exportPaiementsPDF,
  exportPaiementIndividuelPDF,
  exportHistoriquePaiementsPDF,
} from "../../services/exportService";
import { rechercherEleve } from "../../services/paiementsService";
import { getClasse } from './../../services/classeService';

const ComptableExport = () => {
  const [classeId, setClasseId] = useState("");
  const [eleveId, setEleveId] = useState("");
  const [mois, setMois] = useState("");
  const [annee, setAnnee] = useState("");
  const [anneeScolaire, setAnneeScolaire] = useState("");
  const [query, setQuery] = useState("");
  const [resultats, setResultats] = useState([]);
  const [classes, setClasses] = useState([]);
  const [classeLabel, setClasseLabel] = useState("");

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const data = await getClasse();
        setClasses(data);
      } catch {
        toast.error("Erreur chargement des classes");
      }
    };
    fetchClasses();
  }, []);

  useEffect(() => {
    const fetchRecherche = async () => {
      if (query.length >= 2) {
        try {
          const data = await rechercherEleve(query);
          setResultats(data);
        } catch {
          toast.error("Erreur lors de la recherche");
        }
      } else {
        setResultats([]);
      }
    };
    fetchRecherche();
  }, [query]);

  const handleExportClasse = async () => {
    if (!classeId) return toast.error("Sélectionnez une classe");
    try {
      const blob = await exportPaiementsPDF(classeId);
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
      toast.success("Export classe lancé");
    } catch {
      toast.error("Échec export classe");
    }
  };

  const handleExportIndividuel = async () => {
    if (!eleveId) return toast.error("Sélectionnez un élève");
    try {
      const blob = await exportPaiementIndividuelPDF(eleveId, mois, annee, anneeScolaire);
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
      toast.success("Export individuel lancé");
    } catch {
      toast.error("Échec export individuel");
    }
  };

  const handleExportHistorique = async () => {
    if (!eleveId) return toast.error("Sélectionnez un élève");
    try {
      const blob = await exportHistoriquePaiementsPDF(eleveId);
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
      toast.success("Export historique lancé");
    } catch {
      toast.error("Échec export historique");
    }
  };

  return (
    <div className="bg-gray-50 flex items-center justify-center min-h-screen">
      <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-6  ">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900">📂 Espace Export Comptable</h2>
          <p className="text-sm text-gray-500">Générez des relevés PDF officiels par classe ou par élève.</p>
        </div>

        <div className="grid grid-cols-2 gap-6 text-sm">
          {/* Bloc Classe */}
          <div className="bg-gray-50 p-4 rounded-xl border space-y-3">
            <h3 className="font-semibold text-gray-700">🏫 Export par classe</h3>
            <select
              value={classeId}
              onChange={(e) => {
                const selected = classes.find(c => c._id === e.target.value);
                setClasseId(e.target.value);
                setClasseLabel(selected ? `${selected.nom} (${selected.niveau})` : "");
              }}
              className="w-full px-3 py-2 border rounded"
            >
              <option value="">Sélectionner une classe</option>
              {classes.map((classe) => (
                <option key={classe._id} value={classe._id}>
                  {classe.nom} — {classe.niveau}
                </option>
              ))}
            </select>
            <button
              onClick={handleExportClasse}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full"
            >
              📄 Exporter PDF
            </button>
          </div>

          {/* Bloc Élève */}
          <div className="bg-gray-50 p-4 rounded-xl border space-y-3">
            <h3 className="font-semibold text-gray-700">👤 Export individuel</h3>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher par matricule ou nom"
              className="w-full px-3 py-2 border rounded"
            />
            {resultats.length > 0 && (
              <ul className="mt-2 border rounded bg-white max-h-40 overflow-y-auto text-sm">
                {resultats.map((eleve) => (
                  <li
                    key={eleve._id}
                    onClick={() => {
                      setEleveId(eleve._id);
                      setQuery(`${eleve.nom} ${eleve.prenom} (${eleve.matricule})`);
                      setResultats([]);
                    }}
                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    {eleve.nom} {eleve.prenom} — {eleve.matricule}
                  </li>
                ))}
              </ul>
            )}
            <div className="grid grid-cols-2 gap-2">
              <input
                value={mois}
                onChange={(e) => setMois(e.target.value)}
                placeholder="Mois (ex: Septembre)"
                className="px-3 py-2 border rounded"
              />
              <input
                value={annee}
                onChange={(e) => setAnnee(e.target.value)}
                placeholder="Année (ex: 2025)"
                className="px-3 py-2 border rounded"
              />
            </div>
            <input
              value={anneeScolaire}
              onChange={(e) => setAnneeScolaire(e.target.value)}
              placeholder="Année scolaire (ex: 2024-2025)"
              className="w-full px-3 py-2 border rounded"
            />
            <button
              onClick={handleExportIndividuel}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
            >
              📄 Exporter PDF
            </button>
          </div>

          {/* Bloc Historique */}
          <div className="bg-gray-50 p-4 rounded-xl border space-y-3">
            <h3 className="font-semibold text-gray-700">📜 Historique complet</h3>
            <button
              onClick={handleExportHistorique}
              className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800 w-full"
            >
              📄 Exporter PDF
            </button>
          </div>
        </div>

        {/* Résumé */}
        <div className="mt-6 text-sm text-gray-600 border-t pt-4">
          <p>📘 Classe sélectionnée : <strong>{classeLabel || "—"}</strong></p>
          <p>👤 Élève sélectionné : <strong>{query || "—"}</strong></p>
          <p>📅 Période : <strong>{mois || "—"} / {annee || "—"}</strong></p>
          <p>📆 Année scolaire : <strong>{anneeScolaire || "—"}</strong></p>
        </div>
      </div>
    </div>
  );
};

export default ComptableExport;

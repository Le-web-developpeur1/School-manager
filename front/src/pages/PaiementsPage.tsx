import { useState } from "react";
import FormPaiement from "../components/comptable/paiement/FormPaiement";
import Sidebar from "../components/Sidebar";
import PaiementsTable from "../components/comptable/paiement/PaiementsTable";
import ModalWrapper from "../components/modals/ModalWrapper";

const PaiementsPage = () => {
  const [formVisible, setFormVisible] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-3 overflow-hidden">
        {/* Modale pour le formulaire */}
        {formVisible && (
          <ModalWrapper onClose={() => setFormVisible(false)}>
            <FormPaiement
              onClose={() => setFormVisible(false)}
              onSuccess={() => {
                setFormVisible(false);
                // Tu peux recharger la liste des paiements ici si besoin
              }}
            />
          </ModalWrapper>
        )}

        {/* Paiements récents */}
        <div>
          <div className="bg-white rounded shadow p-4 overflow-x-auto">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-xl font-semibold text-gray-800">📂 Paiements</h1>
              <button
                onClick={() => setFormVisible(true)}
                className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
              >
                + Effectuer un paiement
              </button>
            </div>

            <PaiementsTable />
          </div>
        </div>
      </main>
    </div>
  );
};

export default PaiementsPage;

import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import VueSynthese from '../components/comptable/VueSynthese';
import PaiementsRecents from '../components/comptable/PaiementsRecents';
import GraphBar from '../components/GraphBar';
import { getEncaissementsParMois } from './../services/statsService';



const DashboardComptable = () => {
  const [graphData, setGraphData] = useState({});
  
  useEffect(() => {
      (async () => {
        try {
          const res = await getEncaissementsParMois();
          console.log("Response :", res.data);
          setGraphData(res.data);
        } catch (error) {
          console.error("Erreur graphiques", error);
        }
      })();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-5 overflow-hidden">
        <h1 className="text-2xl font-bold mb-4">💰 Bienvenue à votre Tableau de Bord</h1>
        <div className="mt-4 mb-4">
          <VueSynthese />
        </div>
        {/* Composants comptables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          <GraphBar data={graphData} />
          <PaiementsRecents />
        </div>

      </main>
    </div>
  );
};

export default DashboardComptable;

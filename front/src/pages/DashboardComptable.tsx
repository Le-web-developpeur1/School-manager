import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import VueSynthese from '../components/comptable/VueSynthese';
import PaiementsRecents from '../components/comptable/PaiementsRecents';
import GraphBar from '../components/GraphBar';
import { getEncaissementsParMois } from './../services/statsService';
import BlocMotifs from "../components/comptable/BlocMotifs";
import BlocImpayes from '../components/comptable/BlockImpayes';
import BlocModesPaiement from '../components/comptable/BlockMP';





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
      <main className="flex-1 p-3 overflow-hidden">
        <h1 className="text-2xl font-bold mb-2">💰 Bienvenue à votre Tableau de Bord</h1>
        <div className="mt-3 mb-2">
          <VueSynthese />
        </div>
        {/* Composants comptables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <GraphBar data={graphData} />
          <PaiementsRecents />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[250px]">
          <div className="h-full overflow-auto">
            <BlocMotifs />
          </div>
          <div className="h-full overflow-auto">
            <BlocImpayes/>
          </div>
          <div className="h-full overflow-auto">
            <BlocModesPaiement />
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardComptable;

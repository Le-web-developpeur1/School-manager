import React, { useEffect, useState } from 'react';
import StatCard from '../components/StatCard';
import Sidebar from '../components/Sidebar';
import {
  getStatsGlobal,
  getEncaissementsParMois,
  getRepartitionParNiveau,
  getRatioElevesEnseignants,
  getRepartitionSexe
} from '../services/statsService';

import GraphBar from '../components/GraphBar';
import NiveauPieChart from '../components/NiveauPieChart';
import RatioSTChart from '../components/RatioSTChart';
import RepartitionSexe from '../components/RepartitionSexe';
import GraphElevesParClasse from '../components/GraphElevesClasse';

const DashboardAdmin = () => {
  const [stats, setStats] = useState({
    totalEleves: 0,
    totalEnseignants: 0,
    montantTotal: 0,
  });
  const [graphData, setGraphData] = useState({});
  const [niveauData, setNiveauData] = useState({});
  const [ratioData, setRatioData] = useState({});
  const [sexeData, setSexeData] = useState({});

  useEffect(() => {
    (async () => {
      try {
        const data = await getStatsGlobal();
        setStats(data);
      } catch (err) {
        console.error('Erreur chargement stats', err);
      }
    })();
  }, []);

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

  useEffect(() => {
    const fetchRepartition = async () => {
      try {
        const res = await getRepartitionParNiveau();
        const raw = res?.data;
  
        if (!raw || typeof raw !== "object") {
          console.warn("⚠️ Données niveau invalides :", raw);
          return;
        }
  
        const transformeData: Record<string, number> = {};
        Object.entries(raw).forEach(([niveau, total]) => {
          if (typeof total === "number") {
            transformeData[niveau] = total;
          }
        });
  
        console.log("📊 Niveau data transformée:", transformeData);
        setNiveauData(transformeData);
      } catch (error) {
        console.error("❌ Erreur répartition niveaux :", error);
      }
    };
  
    fetchRepartition();
  }, []);
  
  
  

  useEffect(() => {
    (async () => {
      try {
        const res = await getRatioElevesEnseignants();
        setRatioData(res.data);
      } catch (error) {
        console.error("Erreur ratio", error);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const res = await getRepartitionSexe();
        setSexeData(res.data);
      } catch (error) {
        console.error("Erreur répartion sexe", error);
      }
    })();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-5 overflow-hidden">
        <h1 className="text-2xl font-bold mb-4">📊Bienvenue sur votre Tableau de Bord</h1>

        {/* Statistiques principales */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-3">
          <StatCard title="Total Élèves" value={stats.totalEleves} icon="eleves" />
          <StatCard title="Total Enseignants" value={stats.totalEnseignants} icon="enseignants" />
          <StatCard title="Montant encaissé (GNF)" value={stats.montantTotal.toLocaleString()} icon="montant" />
        </div>

        {/* Grille des graphiques */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-2">
          <GraphBar data={graphData} />
          <GraphElevesParClasse />
        </div> 

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <NiveauPieChart data={niveauData} />
          <RepartitionSexe data={sexeData} />
          <RatioSTChart data={ratioData} />
        </div>
      </main>
    </div>
  );
};

export default DashboardAdmin;

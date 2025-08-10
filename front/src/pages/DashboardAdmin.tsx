import React, { useEffect, useState } from 'react';
import StatCard from '../components/StatCard';
import Sidebar from '../components/Sidebar';
import { getStatsGlobal, getEncaissementsParMois, getRepartitionParNiveau, getRatioElevesEnseignants, getRepartitionSexe } from '../services/statsService';
import GraphBar from '../components/GraphBar';
import NiveauPieChart from '../components/NiveauPieChart';
import RatioSTChart from '../components/RatioSTChart';
import RepartitionSexe from '../components/RepartitionSexe';
import GraphElevesParClasse from '../components/GraphElevesClasse';
// import toast from 'react-hot-toast';

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
    const fetchStats = async () => {
      try {
        const res = await getStatsGlobal();
    //    toast.success("Statistiques chargées avec succès !");
        setStats({
          totalEleves: res.data.totalEleves,
          totalEnseignants: res.data.totalEnseignants,
          montantTotal: res.data.montantTotal,
        });
      } catch (err) {
        // toast.error("Erreur de chargement des statistiques !");
        console.error('Erreur chargement stats', err);
      }
    };

    fetchStats();
  }, []);


  useEffect(() => {
    const fetchGraphData = async () => {
        try {
            const res = await getEncaissementsParMois();
            setGraphData(res.data);
        } catch (error) {
            console.error("Erreur chargements des graphiques", error);
        }
    };
    fetchGraphData();
  }, []);

  useEffect(() => {
    const fetchNiveau = async () => {
        try {
            const res = await getRepartitionParNiveau();
            setNiveauData(res.data);
        } catch (error) {
            console.error("Erreur de chargement de la repartition des niveaux", error);
        }
    };
    fetchNiveau();
  }, []);

  useEffect(() => {
    const fetchRatio = async () => {
        try {
            const res = await getRatioElevesEnseignants();
            setRatioData(res.data);
        } catch (error) {
            console.error("Erreur chargement ratio");
        }
    };
    fetchRatio();
  }, []);

  useEffect(() => {
    const fetchSexe = async () => {
        try {
            const res = await getRepartitionSexe();
            setSexeData(res.data);
        } catch (error) {
            console.error("Erreur chargement répartion", error);
        }
    };
    fetchSexe();
  }, []);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 px-4 py-3 overflow-hidden">
        <h1 className="text-2xl font-bold mb-6">Tableau de Bord</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <StatCard title="Total Élèves" value={stats.totalEleves} icon="eleves" />
          <StatCard title="Total Enseignants" value={stats.totalEnseignants} icon="enseignants" />
          <StatCard title="Montant encaissé (GNF)" value={stats.montantTotal.toLocaleString()} icon="montant" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {graphData.length > 0 && <GraphBar data={graphData} />}
            {Object.keys(niveauData).length > 0 && <NiveauPieChart data={niveauData} />}
            {Object.keys(ratioData).length > 0 && <RatioSTChart data={ratioData} />}
            {Object.keys(sexeData).length > 0 && <RepartitionSexe data={sexeData} />}
            <GraphElevesParClasse/>
        </div>
        
      </main>
    </div>
  );
};

export default DashboardAdmin;
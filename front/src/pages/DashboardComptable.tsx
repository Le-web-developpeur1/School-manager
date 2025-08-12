import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import VueSynthese from '../components/comptable/VueSynthese';
import PaiementsRecents from '../components/comptable/PaiementsRecents';
import EncaissementsMensuelles from '../components/comptable/EncaissementsMensuels';


const DashboardComptable = () => {

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
          <EncaissementsMensuelles />
          <PaiementsRecents />
        </div>

      </main>
    </div>
  );
};

export default DashboardComptable;

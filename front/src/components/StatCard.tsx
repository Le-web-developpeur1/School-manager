import React from 'react';
import { Users, School, DollarSign } from 'lucide-react';

const StatCard = ({ title, value, icon }) => {

    const iconMap = {
        eleves: <Users size={24} className='text-blue-600'/>,
        enseignants: <School size={24} className='text-green-600'/>,
        montant: <DollarSign size={24} className='bg-yellow-600' />
    };


    return (
        <div className="bg-gray-100 p-4 rounded shadow-md flex items-center justify-between">
            <div>
                <h4 className="text-sm text-gray-500">{title}</h4>
                <p className="text-2xl font-bold text-gray-800">{value}</p>
            </div>
            <div className="bg-white rounded-full p-2 shadow">
                {iconMap[icon]}
            </div>
        </div>
    );
};

export default StatCard;
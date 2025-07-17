// import { useState, useEffect } from "react";
// import {getEleves} from "../services/apiService";
// import SideBar from "./SideBar";

// const EleveList = () => {
//     const [eleves, setEleves] = useState([]);
//     const [isOpen, setIsOpen] = useState(false);
//     const [eleve, setEleve] = useState({
//         nom: "",
//         prenom: "",
//         adresse: "",
//         date_naissance: "",
//         pere: "",
//         mere: "",
//         classe_id: ""
//     });

//     const handleChange = (e) => {
//         setEleve({ ...eleve, [e.target.name]: e.target.value });
//       };
    
//       const handleSubmit = async (e) => {
//         e.preventDefault();
//         const success = await addStudent(eleve);
//         if (success) onEleveAjoute(); // 🔥 Rafraîchir la liste
//       };



//     useEffect(() => {
//         const fetchEleves = async () =>{
//             const data = await getEleves();
//             setEleves(data);
//         };
//         fetchEleves();
//     }, []);
    
//     return (
//         <div className="w-screen h-screen flex">
//             <SideBar/>
//             <div className="w-screen h-screen ml-2">
//                 <button onClick={() => setIsOpen(true)} className="float-end mt-4 mb-4 text-blue-500 border border-blue-500 px-4 py-1 rounded hover:bg-blue-100">
//                     Ajouter un élève
//                 </button>            
//                 <h2 className="text-4xl font-semibold mb-5">Liste des élèves</h2>
//                 <table className="table-auto w-full border border-gray-200">
//                     <thead>
//                     <tr>
//                         <th>Matricule</th>
//                         <th>Nom</th>
//                         <th>Prénom</th>
//                         <th>Classe</th>
//                         <th>Date de naissance</th>
//                         <th>Actions</th>
//                     </tr>
//                     </thead>
//                     <tbody>
//                     {eleves.map(eleve => (
//                         <tr key={eleve.id}>
//                         <td>{eleve.matricule}</td>
//                         <td>{eleve.nom}</td>
//                         <td>{eleve.prenom}</td>
//                         <td>{eleve.classe || "Non assigné"}</td>
//                         <td>{eleve.date_naissance || "Non renseigné"}</td>
//                         <td>
//                             <button className="bg-green-500 text-white px-2 py-1 rounded-md mr-2">Modifier</button>
//                             <button className="bg-red-500 text-white px-2 py-1 rounded-md">Supprimer</button>
//                         </td>
//                         </tr>
//                     ))}
//                     </tbody>
//                 </table>
//                 <div>
//                     {isOpen && (
//                         <div className="">
//                             <div className="fixed inset-0 flex items-center justify-center bg-gray-900 opacity-85">
//                                 <form className="bg-white p-6 rounded shadow-lg" onSubmit={handleSubmit}>
//                                 <h2 className="text-lg font-bold mb-4">Ajouter un élève</h2>
//                                <div className="flex">
//                                 <label className="block ml-0 mb-4 p-2">
//                                         Nom 
//                                     <input
//                                         className="border border-gray-400 p-2 w-full"
//                                         type="text" 
//                                         name="nom" 
//                                         placeholder="Nom" 
//                                         onChange={handleChange} 
//                                         required 
//                                     />
//                                     </label>
//                                     <label className="block mb-4 p-2">
//                                         Prenom 
//                                         <input 
//                                             type="text" 
//                                             name="prenom"
//                                             className="border border-gray-400 p-2 w-full" 
//                                             placeholder="Prénom" 
//                                             onChange={handleChange} 
//                                             required 
//                                         />
//                                     </label>
//                                </div>
//                                <div className="flex"> 
//                                     <label  className="block mb-4 p-2">
//                                         Adresse  
//                                         <input 
//                                             type="text" 
//                                             name="adresse" 
//                                             className="border border-gray-400 p-2 w-full"
//                                             placeholder="Adresse" 
//                                             onChange={handleChange} 
//                                         />
//                                     </label>
//                                     <label className="block mb-4 p-2">
//                                         Date de naissance 
//                                         <input 
//                                             type="date" 
//                                             name="date_naissance"
//                                             className="border border-gray-400 p-2 w-full" 
//                                             onChange={handleChange} 
//                                             required
//                                         />
//                                     </label>
//                                </div>
//                                 <label className="block mb-4">
//                                     Père 
//                                     <input 
//                                         type="text" 
//                                         name="pere"
//                                         className="border border-gray-400 p-2 w-full"
//                                         placeholder="Nom du père" 
//                                         onChange={handleChange} 
//                                         required
//                                     />
//                                 </label>
//                                 <label className="block mb-4">
//                                     Mère 
//                                     <input 
//                                         type="text" 
//                                         name="mere"
//                                         className="border border-gray-400 p-2 w-full" 
//                                         placeholder="Nom de la mère" 
//                                         onChange={handleChange} 
//                                         required
//                                     />
//                                 </label>
//                                 <select className="border border-gray-400 p-2 w-full" name="classe_id" onChange={handleChange} required>
//                                     <option value="">Sélectionner une classe</option>
//                                     <option value="1">Classe A</option>
//                                     <option value="2">Classe B</option>
//                                 </select>
//                                 <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-md mt-2 cursor-pointer">Ajouter</button>
//                                 </form>
//                             </div>
//                       </div>
//                     )}
//                 </div>
//             </div>
//         </div>
//     )
// };

// export default EleveList;

// import { useState, useEffect } from "react";
// import {createEnseignant} from "../services/enseignantsService";

// const AjoutEnsForm = () => {
//     const [formData, setFormData] = useState({
//         nom:"",
//         prenom: "",
//         email: "",
//         telephone: "",
//         matiere_id: "",
//         classe_id: ""
//     });
    
//     const [matieres, setMatieres] = useState([]);
//     const [classes, setClasses] = useState([]);
//     const [isOpen, setIsOpen] = useState(false);

//     useEffect(() => {
//         loadData();
//     }, []);

//     const loadData = async () => {
//         try {
//             setMatieres(await getMatieres());
//             setClasses(await getClasses());
//         } catch (error) {
//             console.error("Erreur de chargement :", error);
//         }
//     };

//     const handleChange = (e) => {
//        setFormData({ ...formData, [e.target.name]: e.target.value});
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             await createEnseignant(formData);
//             alert("Enseignant ajouté avec succès !");
//         } catch (error) {
//             console.error("Erreur lors de l'ajout :", error);
//         }
//     };

//     return (
//         <div className="bg-gray-500">
//             <h2 className="font-bold not-[]:">Lise </h2>
//             <form onSubmit={handleSubmit}>
//                 <div className="mb-4 form">
//                     <label htmlFor="nom">Nom </label>
//                     <input type="text" name="nom" placeholder="Nom" onChange={handleChange} />
//                 </div>
//                 <div className="mb-4 form">
//                     <label htmlFor="prenom">Prenom</label>
//                     <input type="text" name="prenom" placeholder="Prénom" onChange={handleChange} />
//                 </div>
//                 <div className="mb-4 form">
//                     <label htmlFor="email">Email</label>
//                     <input type="email" name="email" placeholder="Email" onChange={handleChange} />
//                 </div>
//                 <div className="mb-4 form">
//                     <label htmlFor="telephone">Numéro de Téléphone</label>
//                     <input type="text" name="telephone" placeholder="Téléphone" onChange={handleChange} />
//                 </div>

//                 <select name="matiere_id" onChange={handleChange}>
//                     <option value="">Sélectionner une matière</option>
//                     {matieres.map(matiere => (
//                         <option key={matiere.id_matiere} value={matiere.id_matiere}>{matiere.nom}</option>
//                     ))}
//                 </select>

//                 <select name="classe_id" onChange={handleChange}>
//                     <option value="">Sélectionner une classe</option>
//                     {classes.map(classe => (
//                         <option key={classe.id} value={classe.id}>{classe.nom}</option>
//                     ))}
//                 </select>
//                 <button type="submit">Ajouter</button>
//             </form>
//         </div>
//     )
// }

// export default AjoutEnsForm;
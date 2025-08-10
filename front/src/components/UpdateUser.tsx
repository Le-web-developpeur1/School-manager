import { useState } from "react";
import { updateUser } from "../services/usersService";
import toast from "react-hot-toast";

type Props = {
    user: User;
    onClose: () => void;
};

const UpdateUser = ({ user, onClose } : Props ) => {
    const [form, setForm] = useState(user);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        try {
            await updateUser(user._id, form);
            toast.success("Modification effectuée avec succès !");
            onClose();
        } catch (error) {
            console.error("Erreur de modification : ", error);
            toast.error("La modification a échouée")
        }
    };
    
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-30 backdrop-blur-sm z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-md space-y-4">
                <h2 className="text-xl font-bold">Modifier l'utilisateur</h2>
                {["prenom", "nom", "email", "telephone", "role"].map((field) => [
                    <input 
                        key={field}
                        name={field}
                        value={(form as any)[field]}
                        onChange={handleChange}
                        className="w-full border px-4 py-2 rounded"
                        placeholder={field} 
                    />
                ])}
                <div className="flex justify-end space-x-2">
                    <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleSubmit}>
                        Enregistrer
                    </button>
                    <button className="text-red-500 px-4 py-2" onClick={onClose}>
                        Annuler
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UpdateUser;
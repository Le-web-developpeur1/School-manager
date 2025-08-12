import api from "./api";

export const createUser = (data) => {
    return api.post('/users', data);
};

export const getUsers = (roles = []) => {
    const params = roles.length ? { role: roles.join(",")} : {};
    return api.get('/users', { params }).then(res => res.data);
};

export const getUserById = (id) => {
    return api.get(`/users/${id}`);
};

export const updateUser = (id, data) => {
    return api.put(`/users/${id}`, data);
};

export const deleteUser = (id) => {
    return api.delete(`/users/${id}`);
};

export const toogleUserActivation = (id) => {
    return api.put(`/users/${id}/toggle-active`);
   
};
import { api } from "./api";

const API_URL = "/users/users";

export const getUsers = async () => {
  try {
    const response = await api.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Error obteniendo usuarios", error);
    return [];
  }
};

export const getUserById = async (id) => {
  try {
    const response = await api.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error obteniendo usuario por ID", error);
    return null;
  }
};

export const createUser = async (userData) => {
  try {
    const response = await api.post(API_URL, userData);
    return response.data;
  } catch (error) {
    console.error("Error creando usuario", error);
    return null;
  }
};

export const updateUser = async (id, userData) => {
  try {
    const response = await api.put(`${API_URL}/${id}`, userData);
    return response.data;
  } catch (error) {
    console.error("Error actualizando usuario", error);
    return null;
  }
};

export const deleteUser = async (id) => {
  try {
    await api.delete(`${API_URL}/${id}`);
    return true;
  } catch (error) {
    console.error("Error eliminando usuario", error);
    return false;
  }
};

import axios from 'axios';

const apiUrl = 'http://192.168.88.239:3000';
const tablak = ['profil', 'csapat', 'torna', 'jatekos', 'meccs', 'csoport'];

// Az összes tábla adatainak lekérése
export const getMindenTabla = async () => {
  try {
    const requests = tablak.map(tabla => axios.get(`${apiUrl}/${tabla}`));
    const responses = await Promise.all(requests);
    return responses.map(res => res.data);
  } catch (error) {
    console.error('Hiba történt az adatok lekérésekor:', error);
    throw error;
  }
};

// Egy konkrét tábla adatainak lekérése
export const getEgyTabla = async (tabla) => {
  try {
    const response = await axios.get(`${apiUrl}/${tabla}`);
    return response.data;
  } catch (error) {
    console.error(`Hiba történt a(z) ${tabla} lekérésekor:`, error);
    throw error;
  }
};

// Adatok hozzáadása egy táblához
export const addAdat = async (tabla, adatok) => {
  try {
    const response = await axios.post(`${apiUrl}/${tabla}`, adatok);
    return response.data;
  } catch (error) {
    console.error(`Hiba történt az adat hozzáadásakor a(z) ${tabla} táblába:`, error);
    throw error;
  }
};

// Adat törlése egy táblából ID alapján
export const deleteAdat = async (tabla, id) => {
  try {
    await axios.delete(`${apiUrl}/${tabla}/${id}`);
    return true;
  } catch (error) {
    console.error(`Hiba történt a(z) ${tabla} táblából az ID: ${id} törlésekor:`, error);
    throw error;
  }
}

import axios from 'axios';

const apiUrl = 'http://sajatipcim:3000';
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
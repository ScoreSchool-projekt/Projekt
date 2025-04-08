import axios from "axios";
const API_URL = 'http://sajatipcim:3000/profil';  // Módosított URL

export const bejelentkezes = async (email, jelszo) => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: jelszo }), // Egységes változónév
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Hibás bejelentkezési adatok');
    }

    return data; // A sikeres bejelentkezésnél visszaadjuk a felhasználó adatait
  } catch (error) {
    throw new Error(error.message);
  }
};

export const regisztracio = async (adatok) => {
  try {
    const response = await axios.post(API_URL, adatok);  // Fix: apiUrl -> API_URL
    return response.data;
  } catch (error) {
    console.error('Hiba történt a regisztrációnál:', error);
    throw error;
  }
};
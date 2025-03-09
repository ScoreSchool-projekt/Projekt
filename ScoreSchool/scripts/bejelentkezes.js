const API_URL = 'http://192.168.88.239:3000/login';  // Módosított URL

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

export const regisztracio = async (nev, email, jelszo) => {
  try {
    const response = await fetch('http://192.168.88.239:3000/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nev, email, password: jelszo }), // Használj "password" kulcsnevet
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Hiba történt a regisztráció során!');
    }

    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};

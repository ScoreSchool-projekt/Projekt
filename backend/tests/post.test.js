const request = require('supertest');
const app = require('../methodusok');

afterAll(async () => {
    await app.lezaras();
});

describe('POST - új adat teszt', () => {
    it('POST /:tabla - sikeres adatfeltöltés', async () => {
        const testData = { csapatid: 1, golokszama: 100, sargalapok: 100, piroslapok: 100, nev: "Teszt Elek", pozicio: "semmi" };
        const res = await request(app).post('/jatekos').send(testData);
        expect(res.status).toBe(200);
        expect(res.body).toBe('Sikeresen feltöltötte az adatokat');
    });
});
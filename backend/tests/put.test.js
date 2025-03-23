const request = require('supertest');
const app = require('../methodusok');

afterAll(async () => {
    await app.lezaras();
});

describe('PUT - adat módosítás teszt', () => {
    it('PUT /:tabla/:id - sikeres adatmódosítás', async () => {
        const testData = { csapatid: 1, golokszama: 100, sargalapok: 100, piroslapok: 100, nev: "Teszt János", pozicio: "semmi" };
        const res = await request(app).put('/jatekos/1').send(testData);
        expect(res.status).toBe(200);
        expect(res.text).toBe('Sikeresen módosította az adatot');
    });
});
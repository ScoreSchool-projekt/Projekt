const request = require('supertest');
const app = require('../methodusok');

afterAll(async () => {
    await app.lezaras();
});

describe('DELETE - adat törlés teszt', () => {
    it('DELETE /:tabla/:id - sikeres adattörlés', async () => {
        const res = await request(app).delete('/jatekos/1');
        expect(res.status).toBe(200);
        expect(res.text).toBe('Sikeresen törölte az adatot');
    });
});
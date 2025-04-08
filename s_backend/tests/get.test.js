const request = require('supertest');
const app = require('../methodusok');

afterAll(async () => {
    await app.lezaras();
});

describe('GET - minden adat teszt', () => {
    it('GET /:tabla - lekérdezés', async () => {
        const res = await request(app).get('/jatekos');
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });
});
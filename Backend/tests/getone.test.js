const request = require('supertest');
const app = require('../methodusok');

afterAll(async () => {
    await app.lezaras();
});

describe('GET - egy adat teszt', () => {
    it('GET /:tabla/:id - lekérdezés', async () => {
        const res = await request(app).get('/jatekos/1');
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });
});
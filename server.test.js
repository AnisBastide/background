const request = require('supertest');
const express = require('express');
const server = require('./server.js');
const expect = require("expect");

const app = express();

describe('Test de la route /background', () => {
    it('devrait renvoyer des informations valides', async () => {
        const response = request(app).get('/background');

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('map');
        expect(response.body).toHaveProperty('width');
        expect(response.body).toHaveProperty('height');
        expect(response.body).toHaveProperty('treasures');
    });
});

describe('Test de getTreasures', () => {
    it('devrait être ok', async () => {
        const treasures = await server.getTreasures(2, 10, 10);

        expect(Array.isArray(treasures)).toBe(true);
        expect(treasures.length).toBe(10);
    });
});

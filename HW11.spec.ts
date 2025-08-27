import { test, expect } from '@playwright/test';
import { StatusCodes } from 'http-status-codes';
import { OrderDto } from './dto/riskCalculation_Dto';

const url = 'https://backend.tallinn-learning.ee/api/loan-calc/decision';

test('positive order returns 200 and contains applicationId', async ({ request }) => {
    const requestBody = new OrderDto(600, 0, 20, 1500, 12);
    const res = await request.post(url, { data: requestBody });
    expect(res.status()).toBe(StatusCodes.OK);
    expect(typeof (await res.json()).applicationId).toBe('string');
});
test('negative order with income <0 returns 400', async ({ request }) => {
    const requestBody = new OrderDto(-150, 0, 20, 1500, 12);
    const res = await request.post(url, { data: requestBody });
    expect.soft(res.status()).toBe(StatusCodes.BAD_REQUEST);
});

test('negative order with debt <0 returns 400', async ({ request }) => {
    const requestBody = new OrderDto(600, -50, 20, 1500, 12);
    const res = await request.post(url, { data: requestBody });
    expect.soft(res.status()).toBe(StatusCodes.BAD_REQUEST);
});

test('positive order with debt >0 returns 200', async ({ request }) => {
    const requestBody = new OrderDto(600, 200, 20, 1500, 12);
    const res = await request.post(url, { data: requestBody });
    expect.soft(res.status()).toBe(StatusCodes.OK);
});

test('age over 16 returns 200', async ({ request }) => {
    const requestBody = new OrderDto(600, 0, 18, 1500, 12);
    const res = await request.post(url, { data: requestBody });
    expect.soft(res.status()).toBe(StatusCodes.OK);
});

test('age under 16 returns 200', async ({ request }) => {
    const requestBody = new OrderDto(600, 0, 14, 1500, 12);
    const res = await request.post(url, { data: requestBody });
    expect.soft(res.status()).toBe(StatusCodes.OK);
});

test('GET request instead of POST returns 405 or 400', async ({ request }) => {
    const res = await request.get(url);
    expect.soft([StatusCodes.METHOD_NOT_ALLOWED, StatusCodes.BAD_REQUEST]).toContain(res.status());
});

test('POST with invalid body structure returns 400', async ({ request }) => {
    const invalidBody = { wrongField: 123, anotherField: 'test' };
    const res = await request.post(url, { data: invalidBody });
    expect.soft(res.status()).toBe(StatusCodes.BAD_REQUEST);
});

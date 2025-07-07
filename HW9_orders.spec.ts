import { test, expect } from '@playwright/test';
import { StatusCodes } from 'http-status-codes';
import { validOrder, invalidOrder, validApiKey, invalidApiKey } from './dto/orderDto.js';

// positive test: GET request for an existing order ID — expect status 200
test('GET existing order by ID returns 200', async ({ request }) => {
  const response = await request.get('https://backend.tallinn-learning.ee/test-orders/1');
  console.log('response body:', await response.json());
  expect(response.status()).toBe(StatusCodes.OK);
});

// negative test: GET request for non-existent order ID — expect status 400
test('GET order by non-existing ID returns 400', async ({ request }) => {
  const response = await request.get('https://backend.tallinn-learning.ee/test-orders/999999');
  console.log('response body:', await response.json());
  expect(response.status()).toBe(StatusCodes.BAD_REQUEST);
});

// positive test: update an existing order using valid data and correct API key — expect status 200
test('PUT: update existing order with valid data and valid API key - returns 200', async ({
  request,
}) => {
  const headers = { api_key: validApiKey };
  const response = await request.put('https://backend.tallinn-learning.ee/test-orders/1', {
    data: validOrder,
    headers,
  });
  console.log('Response status:', response.status());
  console.log('Response body:', await response.json());
  expect(response.status()).toBe(StatusCodes.OK);
});

// negative test: update an order with invalid data (missing required fields) — expect status 400
test('PUT update order with invalid data returns 400', async ({ request }) => {
  const response = await request.put('https://backend.tallinn-learning.ee/test-orders/1', {
    data: invalidOrder,
  });
  console.log('response body:', await response.text());
  expect(response.status()).toBe(StatusCodes.BAD_REQUEST);
});

// negative test: update an order using invalid API key — expect status 401 (Unauthorized)
test('PUT: update order with invalid API key - returns 401', async ({ request }) => {
  const headers = { api_key: invalidApiKey };
  const response = await request.put('https://backend.tallinn-learning.ee/test-orders/1', {
    data: validOrder,
    headers,
  });
  console.log('Response status:', response.status());
  expect(response.status()).toBe(StatusCodes.UNAUTHORIZED);
});

// positive test: delete an existing order using valid API key — expect status 204
test('DELETE: existing order with valid API key - returns 204', async ({ request }) => {
  const headers = { api_key: validApiKey };
  const response = await request.delete('https://backend.tallinn-learning.ee/test-orders/1', {
    headers,
  });
  console.log('Response status:', response.status());
  expect(response.status()).toBe(StatusCodes.NO_CONTENT);
});

// negative test: delete a non-existent order with ID = 0 — expect status 400
test('DELETE: non-existent order ID - returns 400', async ({ request }) => {
  const headers = { api_key: validApiKey };
  const response = await request.delete('https://backend.tallinn-learning.ee/test-orders/0', {
    headers,
  });
  console.log('Response status:', response.status());
  expect(response.status()).toBe(StatusCodes.BAD_REQUEST);
});

// negative test: delete a non-existent order with ID = 999999 — expect status 400
test('DELETE: non-existing order with API key returns 400', async ({ request }) => {
  const headers = { api_key: validApiKey };
  const response = await request.delete('https://backend.tallinn-learning.ee/test-orders/999999', {
    headers,
  });
  console.log('response status:', response.status());
  expect(response.status()).toBe(StatusCodes.BAD_REQUEST);
});

import { test, expect } from '@playwright/test';
import { StatusCodes } from 'http-status-codes';

const endpoint = 'https://backend.tallinn-learning.ee/api/loan-calc/decision';

test('should approve low-risk loan with high income and low amount', async ({ request }) => {
  const inputData = {
    income: 4000,
    debt: 0,
    age: 21,
    employed: true,
    loanAmount: 500,
    loanPeriod: 13,
  };

  const response = await request.post(endpoint, { data: inputData });
  expect(response.status()).toBe(StatusCodes.OK);

  const body = await response.json();
  console.log(body);

  expect(body.riskDecision).toBe('positive');
  expect(['Low Risk', 'Medium Risk', 'High Risk']).toContain(body.riskLevel);
});

test('should reject loan due to high risk despite high income and age', async ({ request }) => {
  const inputData = {
    income: 50000,
    debt: 3000,
    age: 88,
    employed: true,
    loanAmount: 12000,
    loanPeriod: 36,
  };

  const response = await request.post(endpoint, { data: inputData });
  expect(response.status()).toBe(StatusCodes.OK);

  const body = await response.json();
  console.log(body);

  expect(body.riskDecision).toBe('negative');
  expect(['Low Risk', 'Medium Risk', 'High Risk', 'Very High Risk']).toContain(body.riskLevel);
});

test('should return 400 Bad Request when income is negative', async ({ request }) => {
  const inputData = {
    income: -666,
    debt: 0,
    age: 30,
    employed: true,
    loanAmount: 300,
    loanPeriod: 30,
  };

  const response = await request.post(endpoint, { data: inputData });
  expect(response.status()).toBe(StatusCodes.BAD_REQUEST);

  const bodyText = await response.text();
  console.log(bodyText);
});

test('should return 400 Bad Request when income is zero', async ({ request }) => {
  const inputData = {
    income: 0,
    debt: 0,
    age: 30,
    employed: true,
    loanAmount: 30000,
    loanPeriod: 12,
  };

  const response = await request.post(endpoint, { data: inputData });
  expect(response.status()).toBe(StatusCodes.BAD_REQUEST);

  const bodyText = await response.text();
  console.log(bodyText);
});

test('should return 415 Unsupported Media Type for non-JSON content', async ({ request }) => {
  const inputData = JSON.stringify({
    income: 2025,
    debt: 0,
    age: 30,
    employed: true,
    loanAmount: 9999,
    loanPeriod: 1,
  });

  const response = await request.post(endpoint, {
    headers: {
      'Content-Type': 'text/plain',
      Accept: '*/*',
    },
    data: inputData,
  });

  expect(response.status()).toBe(StatusCodes.UNSUPPORTED_MEDIA_TYPE);

  const bodyText = await response.text();
  console.log(bodyText);
});

test('should approve loan for unemployed user with low risk profile', async ({ request }) => {
  const inputData = {
    income: 700,
    debt: 0,
    age: 30,
    employed: false,
    loanAmount: 999,
    loanPeriod: 6,
  };

  const response = await request.post(endpoint, { data: inputData });
  expect(response.status()).toBe(StatusCodes.OK);

  const body = await response.json();
  console.log(body);

  expect(body.riskDecision).toBe('positive');
  expect(['Low Risk', 'Medium Risk', 'High Risk']).toContain(body.riskLevel);
});

// --- Added tests ---

test('should return 400 Bad Request when age is 0', async ({ request }) => {
  const inputData = {
    income: 2000,
    debt: 0,
    age: 0,
    employed: true,
    loanAmount: 1000,
    loanPeriod: 12,
  };

  const response = await request.post(endpoint, { data: inputData });
  expect(response.status()).toBe(StatusCodes.BAD_REQUEST);
});

test('should approve loan when age is exactly 100', async ({ request }) => {
  const inputData = {
    income: 2000,
    debt: 0,
    age: 100,
    employed: true,
    loanAmount: 1000,
    loanPeriod: 12,
  };

  const response = await request.post(endpoint, { data: inputData });
  expect(response.status()).toBe(StatusCodes.OK);
});

test('should return 400 Bad Request when loanAmount is a string', async ({ request }) => {
  const inputData = {
    income: 2000,
    debt: 0,
    age: 30,
    employed: true,
    loanAmount: 'not-a-number',
    loanPeriod: 12,
  };

  const response = await request.post(endpoint, { data: inputData });
  expect(response.status()).toBe(StatusCodes.BAD_REQUEST);
});

test('should return 400 Bad Request when required fields are missing', async ({ request }) => {
  const inputData = {
    income: 2000,
    debt: 0,
    age: 30,
    employed: true,
    // missing loanAmount and loanPeriod
  };

  const response = await request.post(endpoint, { data: inputData });
  expect(response.status()).toBe(StatusCodes.BAD_REQUEST);
});

test('should ignore unexpected field in the request body', async ({ request }) => {
  const inputData = {
    income: 2000,
    debt: 0,
    age: 30,
    employed: true,
    loanAmount: 1000,
    loanPeriod: 12,
    extraField: 'something',
  };

  const response = await request.post(endpoint, { data: inputData });
  expect(response.status()).toBe(StatusCodes.OK);

  const body = await response.json();
  console.log(body);

  expect(['positive', 'negative']).toContain(body.riskDecision);
});

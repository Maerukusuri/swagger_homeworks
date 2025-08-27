import { test, expect } from '@playwright/test';
import { OrderDto } from './dto/orderDto';

const orderUrl = 'https://backend.tallinn-learning.ee/orders';
const TOKEN = 'whs4s5qbYbfT2n';

let orderId: number;

test.describe('Simple student order tests', () => {

    test('create order', async ({ request }) => {
        const order = new OrderDto('OPEN', 0, 'Alice', '+3721234567', 'Test order');

        const res = await request.post(orderUrl, {
            data: order,
            headers: {
                Authorization: `Bearer ${TOKEN}`,
                'Content-Type': 'application/json',
            },
        });

        console.log('Create order status:', res.status());
        const body = await res.json();
        console.log('Create order body:', body);

        orderId = body.id;

        expect(body.id).toBeDefined();
    });

    test('get order by id', async ({ request }) => {
        const res = await request.get(`${orderUrl}/${orderId}`, {
            headers: { Authorization: `Bearer ${TOKEN}` },
        });

        const body = await res.json();
        console.log('Get order body:', body);

        expect(body.id).toBe(orderId);
    });

    test('delete order', async ({ request }) => {
        const res = await request.delete(`${orderUrl}/${orderId}`, {
            headers: { Authorization: `Bearer ${TOKEN}` },
        });

        const body = await res.text();
        console.log('Delete order response:', body);

        expect(body).toBeTruthy();
    });

});

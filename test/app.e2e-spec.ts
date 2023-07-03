import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('POST /auth/signin should return a token', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/signin')
      .send({
        username: 'john.doe@email.com',
        password: 'am9obi5kb2VAZW1haWwuY29t',
      })
      .expect(200);

    expect(response.body).toHaveProperty('access_token');
  });
  describe('Authenticated routes', () => {
    let token, id;
    beforeEach(async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/signin')
        .send({
          username: 'john.doe@email.com',
          password: 'am9obi5kb2VAZW1haWwuY29t',
        })
        .expect(200);
      token = response?.body?.access_token;
    });
    it('POST /customer should create a new customer', async () => {
      const response = await request(app.getHttpServer())
        .post('/customer')
        .set('Authorization', `Bearer ${token}`)
        .send({
          document: '123.456.789-10',
          name: 'John Doe',
        })
        .expect(201);
      id = response.body.id;
      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe('John Doe');
    });

    it('GET /customer/:id should return the customer with the given id', async () => {
      const customerId = id;

      const response = await request(app.getHttpServer())
        .get(`/customer/${customerId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body).toHaveProperty('id', customerId);
    });

    it('PUT /customer/:id should update the customer with the given id', async () => {
      const customerId = id;

      const response = await request(app.getHttpServer())
        .put(`/customer/${customerId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          id: 'ad587370-337b-4057-ac41-a061cd75b189',
          document: '123.456.789-10',
          name: 'John Doe',
        })
        .expect(200);

      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe('John Doe');
      expect(response.body.document).toBe('123.456.789-10');
    });
  });
});

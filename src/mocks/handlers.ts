import { rest } from 'msw';
import { mockServices, mockEvents } from './data';
import { v4 as uuidv4 } from 'uuid';


function randomDelay(min = 200, max = 1500) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const handlers = [
  rest.get('/api/services', (req, res, ctx) => {
    const delay = Math.random() * 700 + 300;
    const fail = Math.random() < 0.05;

    if (fail) return res(ctx.status(500), ctx.json({ error: 'Random failure' }));

    const status = req.url.searchParams.get('status');
    const nameLike = req.url.searchParams.get('name_like');
    const page = parseInt(req.url.searchParams.get('page') || '1');
    const limit = parseInt(req.url.searchParams.get('limit') || '10');

    let filtered = [...mockServices];

    if (status) filtered = filtered.filter((s) => s.status === status);
    if (nameLike) filtered = filtered.filter((s) =>
      s.name.toLowerCase().includes(nameLike.toLowerCase())
    );

    const total = filtered.length;
    const start = (page - 1) * limit;
    const paginated = filtered.slice(start, start + limit);

    return res(
      ctx.delay(delay),
      ctx.status(200),
      ctx.json({
        data: paginated,
        total,
        page,
        limit,
      })
    );
  }),

  rest.get('/api/services/statuses', (req, res, ctx) => {
    const delay = Math.random() * 700 + 300;
    const fail = Math.random() < 0.05;

    if (fail) return res(ctx.status(500), ctx.json({ error: 'Random failure' }));

    const page = parseInt(req.url.searchParams.get('page') || '1');
    const limit = parseInt(req.url.searchParams.get('limit') || '10');
    const start = (page - 1) * limit;

    // Randomly update some statuses
    const updatedSlice = mockServices.slice(start, start + limit).map((s) => {
      const random = Math.random();
      const options = ['Online', 'Offline', 'Degraded'];
      const newStatus = random < 0.1 ? options[Math.floor(Math.random() * options.length)] : s.status;
      s.status = newStatus;
      return { id: s.id, status: newStatus };
    });

    return res(ctx.delay(delay), ctx.status(200), ctx.json(updatedSlice));
  }),

  // CREATE
  rest.post('/api/services', async (req, res, ctx) => {
    const delay = Math.random() * 700 + 300;
    const fail = Math.random() < 0.05;

    if (fail) return res(ctx.delay(delay), ctx.status(500), ctx.json({ error: 'Failed to create service' }));

    const body = await req.json();
    const newService = {
      id: uuidv4(),
      name: body.name,
      type: body.type,
      status: 'Online', // default status
    };

    mockServices.unshift(newService);
    return res(ctx.delay(delay), ctx.status(201), ctx.json(newService));
  }),

  // UPDATE
  rest.put('/api/services/:id', async (req, res, ctx) => {
    const delay = Math.random() * 700 + 300;
    const fail = Math.random() < 0.05;

    if (fail) return res(ctx.delay(delay), ctx.status(500), ctx.json({ error: 'Failed to update' }));

    const { id } = req.params;
    const body = await req.json();
    const index = mockServices.findIndex((s) => s.id === id);

    if (index === -1) return res(ctx.status(404));

    mockServices[index] = { ...mockServices[index], ...body };

    return res(ctx.delay(delay), ctx.status(200), ctx.json(mockServices[index]));
  }),

  // DELETE
  rest.delete('/api/services/:id', (req, res, ctx) => {
    const delay = Math.random() * 700 + 300;
    const fail = Math.random() < 0.05;
    const { id } = req.params;

    if (fail) return res(ctx.delay(delay), ctx.status(500), ctx.json({ error: 'Failed to delete' }));

    const index = mockServices.findIndex((s) => s.id === id);
    if (index !== -1) mockServices.splice(index, 1);

    return res(ctx.delay(delay), ctx.status(200));
  }),

  // GET by ID
  rest.get('/api/services/:id', (req, res, ctx) => {
    const { id } = req.params;
    const service = mockServices.find(s => s.id === id);

    if (!service) {
      return res(ctx.status(404), ctx.json({ error: 'Not found' }));
    }

    return res(ctx.delay(300), ctx.json(service));
  }),

  // POST new service
  rest.post('/api/services', async (req, res, ctx) => {
    const body = await req.json();
    const newService = {
      id: String(Date.now()),
      name: body.name,
      type: body.type,
      status: 'Online',
    };
    mockServices.push(newService);
    return res(ctx.delay(500), ctx.status(201), ctx.json(newService));
  }),

  // PUT update service
  rest.put('/api/services/:id', async (req, res, ctx) => {
    const { id } = req.params;
    const body = await req.json();

    const index = mockServices.findIndex(s => s.id === id);
    if (index === -1) {
      return res(ctx.status(404), ctx.json({ error: 'Not found' }));
    }

    mockServices[index] = { ...mockServices[index], ...body };
    return res(ctx.delay(400), ctx.json(mockServices[index]));
  }),

  // DELETE service
  rest.delete('/api/services/:id', (req, res, ctx) => {
    const { id } = req.params;
    const index = mockServices.findIndex(s => s.id === id);
    if (index === -1) {
      return res(ctx.status(404));
    }

    mockServices.splice(index, 1);
    return res(ctx.status(200));
  }),

  rest.get('/api/services/:id', (req, res, ctx) => {
    const { id } = req.params;
    const service = mockServices.find(s => s.id === id);
    if (!service) return res(ctx.status(404));
    return res(ctx.delay(randomDelay()), ctx.status(200), ctx.json(service));
  }),

  rest.get('/api/services/:id/events', (req, res, ctx) => {
    const { id } = req.params;
    const page = parseInt(req.url.searchParams.get('page') || '1');
    const limit = parseInt(req.url.searchParams.get('limit') || '20');
    const start = (page - 1) * limit;

    const allEvents = mockEvents
      .filter(event => event.serviceId === id)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    const paginated = allEvents.slice(start, start + limit);
    return res(ctx.delay(randomDelay()), ctx.status(200), ctx.json({
      data: paginated,
      hasMore: start + limit < allEvents.length,
    }));
  })
];

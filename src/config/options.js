export const options = {
  stages: [
    { duration: '1m', target: 100 }, // aumentar a 100 VUs
    { duration: '2m', target: 100 }, // mantener 100 VUs durante 2 minutos
    { duration: '1m', target: 0 },   // disminuir
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% de las solicitudes deben completarse en menos de 500ms
  },
};

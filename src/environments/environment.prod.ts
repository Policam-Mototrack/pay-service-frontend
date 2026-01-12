const apiVersion = 'v1';
const apiBaseUrl = 'https://api.pay-service.moto.vokrug.city/api';

export const environment = {
    production: true,
    apiVersion,
    apiBaseUrl,
    apiUrl: `${apiBaseUrl}/${apiVersion}`
};

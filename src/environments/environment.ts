const apiVersion = 'v1';
const apiBaseUrl = 'https://api.dev.pay-service.moto.vokrug.city/api';

export const environment = {
    production: false,
    apiVersion,
    apiBaseUrl,
    apiUrl: `${apiBaseUrl}/${apiVersion}`
};

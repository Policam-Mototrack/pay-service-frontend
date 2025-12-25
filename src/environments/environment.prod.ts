const apiVersion = 'v1';
const apiBaseUrl = 'http://localhost:8000/api';

export const environment = {
    production: false,
    apiVersion,
    apiBaseUrl,
    apiUrl: `${apiBaseUrl}/${apiVersion}`
};

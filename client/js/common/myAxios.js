import axios from 'axios';

const instance = axios.create({
    timeout: 1 * 60 * 60 * 1000,
    params: {}, // do not remove this, its added to add params later in the config
});

// Add a request interceptor to global axios requests
instance.interceptors.request.use((config) => {
    // Add JWT token before the request is sent if the url includes auth
    if (config.url.startsWith('/api/auth/')) {
        config.headers.authorization = localStorage.getItem('jwtToken');
    }
    return config;
}, (error) => Promise.reject(error));

export default instance;

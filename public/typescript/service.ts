process.loadEnvFile()

const isDev = process.env.NODE_ENV === 'development';
const server = isDev ? 'http://localhost:3001' : 'https://okay-steffi-kaypa-dev-4c35edc0.koyeb.app';

export { server };

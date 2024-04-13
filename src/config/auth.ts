export default {
  jwt: {
    secret: process.env.APP_SECRET || 'asdasddasdasd',
    expiresIn: '1d',
  },
};

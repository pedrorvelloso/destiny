export default {
  jwt: {
    secret: process.env.JWT_SECRET || 'weaksecret123@#$%',
    expiresIn: '1d',
  },
};

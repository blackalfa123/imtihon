require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });

const secret = (process.env.JWT_SECRET || '').trim();
if (!secret || /CHANGE_THIS|YOUR_SECRET|[<>]/.test(secret)) {
  console.error('JWT_SECRET: backend/.env ichiga uzun tasodifiy kalit yozing (kamida 16 belgi).');
  process.exit(1);
}
module.exports = secret;

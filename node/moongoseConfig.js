import mongoose from 'mongoose';

export function connectToDatabase(host) {
  const defaultConfig = {
    host: host || process.env.MONGO_HOST || 'mongodb',
    port: 27017,
    database: 'soundoclock',
    username: 'mongoadmin',
    password: 'mongopassword',
    authSource: 'admin'
  };

  const connectionString = `mongodb://${defaultConfig.username}:${defaultConfig.password}@${defaultConfig.host}:${defaultConfig.port}/${defaultConfig.database}`;
  const options = { authSource: defaultConfig.authSource };

  return mongoose.connect(connectionString, options);
}

export { mongoose };
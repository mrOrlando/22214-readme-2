export function getMongoConnectionString({
  username,
  password,
  host,
  port,
  databaseName,
  authDatabase,
}: {
  username: string;
  password: string;
  host: string;
  port: string | number;
  databaseName: string;
  authDatabase: string;
}): string {
  return `mongodb://${username}:${password}@${host}:${port}/${databaseName}?authSource=${authDatabase}`;
}

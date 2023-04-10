import { Client } from "pg";

const client: Client = new Client({
  user: "caique",
  host: "localhost",
  port: 5432,
  password: "1234",
  database: "meu_banco_dados",
});

const startDatabase = async (): Promise<void> => {
  await client.connect();
  console.log("Database connected");
};

export { client, startDatabase };

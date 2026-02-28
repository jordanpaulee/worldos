import { buildApi } from "./app.js";

const start = async () => {
  const server = buildApi();
  const port = Number(process.env.PORT ?? 4000);

  try {
    await server.listen({
      host: "0.0.0.0",
      port,
    });
  } catch (error) {
    server.log.error(error);
    process.exit(1);
  }
};

void start();

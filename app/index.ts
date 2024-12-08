import initServer from "./src";

const main = async () => {
  const PORT = process.env.PORT || 4000;
  const app = await initServer();
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
main();

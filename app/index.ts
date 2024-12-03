import initServer from "./src";
const main = async () => {
  const app = await initServer();
  app.listen(3000, () => {
    console.log("Server is running on port 3000");
  });
};
main();

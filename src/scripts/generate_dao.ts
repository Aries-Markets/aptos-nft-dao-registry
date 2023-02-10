import { generateDAOMetas } from "../parser/read_config";

async function generateDAO() {
  await generateDAOMetas("mainnet");
  await generateDAOMetas("testnet");
}

generateDAO()
  .then(() => {
    console.info("DAO metas generate completed!");
  })
  .catch((reason) => {
    console.error(reason);
  });

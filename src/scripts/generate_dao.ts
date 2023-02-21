import * as fs from "fs/promises";
import * as toml from "toml";
import { Network } from "../schema/enum";
import { jsonStringify, notEmpty } from "../util/util";
import { DAOSchemaRaw } from "../schema/dao_raw";
import { convertDAOConfig } from "../parser/convert_config";
import path from "path";

export const generateDAOMetas = async (network: Network) => {
  const daoDir = `${__dirname}/../../registry/${network}`;
  const outDir = `${__dirname}/../../release/registry/${network}`;

  const daos = await fs.readdir(daoDir);

  await fs.mkdir(outDir, { recursive: true });
  for (const file of await fs.readdir(outDir)) {
    await fs.unlink(path.join(outDir, file));
  }

  const governors = await Promise.all(
    daos.map(async (dao) => {
      const daoStat = await fs.stat(`${daoDir}/${dao}`);
      if (!daoStat.isDirectory()) {
        return null;
      }
      const config = await fs.readFile(`${daoDir}/${dao}/dao.toml`);
      const rawConfig = toml.parse(config.toString());

      try {
        const daoRaw = DAOSchemaRaw.parse(rawConfig);
        const config = await convertDAOConfig(daoRaw);
        await fs.writeFile(`${outDir}/${dao}.json`, jsonStringify(config));
        return config;
      } catch (e) {
        console.error(`Error parsing config ${network}/${dao}`);
        throw e;
      }
    })
  );

  const foundDAOs = governors.filter(notEmpty);

  await fs.writeFile(
    `${__dirname}/../../release/registry/dao-metas.${network}.json`,
    jsonStringify(foundDAOs)
  );
};

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
    process.exit(1);
  });

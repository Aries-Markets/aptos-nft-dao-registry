import toml from "toml";
import fs from "fs/promises";
import { Network } from "../schema/enum";
import { jsonStringify, notEmpty } from "../util/util";
import { DAOSchemaRaw, DAOTypeRaw } from "../schema/dao_raw";
import { convertDAOConfig } from "./convert_config";

export const generateDAOMetas = async (network: Network) => {
  const daoDir = `${__dirname}/../../registry/${network}`;
  const outDir = `${__dirname}/../../release/registry/${network}`;

  const daos = await fs.readdir(daoDir);
  await fs.mkdir(outDir, { recursive: true });

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

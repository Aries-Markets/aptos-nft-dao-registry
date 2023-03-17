import * as fs from "fs/promises";
import * as toml from "toml";
import { Network } from "../schema/enum";
import { jsonStringify, notEmpty } from "../util/util";
import { DAOSchemaRaw } from "../schema/dao_raw";
import { convertDAOConfig } from "../parser/convert_config";
import { SELFT_IMAGE_DIR, SELF_STATIC_URL_PREFIX } from "../schema/enum";
import { existsSync } from "fs";
import path from "path";

function checkImageURL(imageUrl: string) {
  if (!imageUrl.startsWith(SELF_STATIC_URL_PREFIX)) {
    return;
  }

  const selfRef = new URL(SELFT_IMAGE_DIR, SELF_STATIC_URL_PREFIX).href;

  if (!imageUrl.startsWith(selfRef)) {
    throw Error(`Image url should follow format: ${selfRef}/[Image File Name]`);
  }

  const filePath = imageUrl.substring(imageUrl.indexOf(SELFT_IMAGE_DIR));
  const fileFullPath = path.resolve(`${__dirname}/../../${filePath}`);

  if (!existsSync(fileFullPath)) {
    throw Error(`Image file not exists: ${filePath}`);
  }
}

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
        checkImageURL(daoRaw.governance["logo-url"]);
        checkImageURL(daoRaw.governance["bg-img-url"]);
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

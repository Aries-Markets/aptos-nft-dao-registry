import { DAOTypeRaw } from "../schema/dao_raw";
import { DAOConfig } from "../schema/dao_release";
import { mapValues, startCase } from "lodash";
import { SELFT_IMAGE_DIR, SELF_STATIC_URL_PREFIX } from "../schema/enum";
import { existsSync } from "fs";
import path from "path";

export const convertDAOConfig = async (
  rawConf: DAOTypeRaw
): Promise<DAOConfig> => {
  const governance = {
    address: rawConf.governance.address,
    description: rawConf.governance.description,
    logoURL: rawConf.governance["logo-url"],
    creatorNickname: rawConf.governance["creator-nickname"],
    bgImgURL: rawConf.governance["bg-img-url"],
  };

  checkImageURL(governance.logoURL);
  checkImageURL(governance.bgImgURL);

  return {
    governance,
    links: rawConf.links
      ? mapValues(rawConf.links, (link, key) => {
          if (typeof link === "string") {
            return {
              label: startCase(key),
              url: link,
            };
          }

          return {
            ...link,
            label: startCase(link.label),
          };
        })
      : undefined,
  };
};

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

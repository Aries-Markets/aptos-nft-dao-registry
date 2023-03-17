import { DAOTypeRaw } from "../schema/dao_raw";
import { DAOConfig } from "../schema/dao_release";
import { mapValues, startCase } from "lodash";

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

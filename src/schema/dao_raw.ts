import * as zod from "zod";

export const DAOSchemaRaw = zod.object({
  governance: zod.object({
    address: zod
      .string()
      .startsWith("0x")
      .length(66, `DAO address must be a valid aptos address`),
    description: zod.string().max(128, `DAO description too long.`),
    "creator-nickname": zod.string(),
    "logo-url": zod.string(),
  }),
  links: zod
    .record(
      zod
        .object({
          label: zod.string(),
          url: zod.string(),
        })
        .or(zod.string())
    )
    .optional(),
});

export type DAOTypeRaw = zod.infer<typeof DAOSchemaRaw>;

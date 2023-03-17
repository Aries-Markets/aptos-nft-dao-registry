import * as zod from "zod";

export const DAOSchemaRaw = zod.object({
  governance: zod.object({
    address: zod
      .string()
      .startsWith("0x")
      .length(66, `DAO address must be a valid aptos address`),
    description: zod.string().max(128, `DAO description too long.`),
    "creator-nickname": zod.string(),
    "logo-url": zod.string().url(`DAO logo URL invalid`),
    "bg-img-url": zod.string().url(`DAO bg image URL invalid`),
  }),
  links: zod
    .record(
      zod
        .object({
          label: zod.string(),
          url: zod.string().url(`Links URL invalid`),
        })
        .or(zod.string().url(`Links URL invalid`))
    )
    .optional(),
});

export type DAOTypeRaw = zod.infer<typeof DAOSchemaRaw>;

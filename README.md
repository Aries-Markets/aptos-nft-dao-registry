# aptos-nft-dao-registry

Registry of Aptos NFT DAOs.

# Adding a new DAO

Add DAO images to `release/images/`.
For better distinguish, it is recommended to use `[DAO Name]-[usage]-[network].jpeg/png` format for image names. (eg. `release/images/lemur-lounge-logo-testnet.jpeg`)

Add a new `dao.toml` to `registry/[network]/[dao]/`.
`registry/dao_template.toml` can be used as a template.

Use the images you added above as DAO's image URLs, the URL format should follow `https://raw.githubusercontent.com/Aries-Markets/aptos-nft-dao-registry/main/release/images/[ImageFileName]`. You can also use images from other image hosting service.

Note:

> You can find more detail description of `**_uri_template.json` at [Aptos Dev Docs](https://aptos.dev/concepts/coin-and-token/aptos-token#storing-metadata-off-chain).

1. To use _token collection_ as a `Governance Token`, you should supply _the collection uri_ that points to a file follows the `registry/token_collection_uri_template.json` constraints when you create a collection.
2. Also, to use _token_ as `vote power` in DAO, you should ensure _the token uri_ that points to a file follows the `registry/token_uri_template.json` constraints when you/(collection creator) mint new token upon the `Governance Token collection` .

# aptos-nft-dao-registry

Registry of Aptos NFT DAOs.

# Adding a new DAO

Add a new `dao.toml` to `registry/<network>/<dao>/`.
`registry/dao_template.toml` can be used as a template.

Note:

1. To use _token collection_ as a `Governance Token`, you should supply _the collection uri_ that points to a file follows the `registry/token_collection_uri_template.json` constraints when you create a collection.
2. Also, to use _token_ as `vote power` in DAO, you should ensure _the token uri_ that points to a file follows the `registry/token_uri_template.json` constraints when you/(collection creator) mint new token upon the `Governance Token collection` .

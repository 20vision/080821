### Page
role:
  - null -> guest
  - 0 -> can edit papers but not page
  - 1 -> admin, can do everything (Only one Admin can exist -> is Fee Collector)
  
querying roles by ?role=... checks if role is at least ... otherwise throws error

DB -> Paper -> private(tinyint) -> 0=public; 1=private; 2=banned;
            -> uid is not really unique !! it's just a timestamp. Have to combine with pagename in e.g. sql queries

DB -> Paper_Version -> version(varcahr(14)) because decimal 9999.9999.9999 each minor update can be increated from .0 to .9999

DB -> Forum_Post -> parent_type -> 0=Page, 1=Mission, 2=Topic, 3=Paper, 4=Post

DEVNET Contract: 969cdvMTsXAs2QfCFvGb2TmaR9gbFvMjRfG8u5v1if3d
Test Wallet private key: CMgGx8WdMqLmGwvZHZboWaF6zeknrEtituyNziwg5hgqCEwvrL7zQNuZg6bAic8Bv6TsGL21BhStiwXC653NSvf
Test Page Mint Key: CtENBNHd5fz2u1TERoZZQ9wqoydxsXTbph5xTyy8LUva

### Page
role:
  - null -> guest
  - 0 -> can edit papers but not page
  - 1 -> admin, can do everything (Only one Admin can exist -> is Fee Collector)

DB -> Paper -> private(tinyint) -> 0=public; 1=private; 2=banned;
            -> uid is not really unique !! it's just a timestamp. Have to combine with pagename in e.g. sql queries

DB -> Paper_Version -> version(varcahr(14)) because decimal 9999.9999.9999 each minor update can be increated from .0 to .9999

DB -> ForumPost -> parent_type -> p=page, t=topic, m=mission, mp=paper
DB -> Forum_Swipe -> type -> (same as parent_type) + po=post

DEVNET Contract: 969cdvMTsXAs2QfCFvGb2TmaR9gbFvMjRfG8u5v1if3d
Test Wallet private key: CMgGx8WdMqLmGwvZHZboWaF6zeknrEtituyNziwg5hgqCEwvrL7zQNuZg6bAic8Bv6TsGL21BhStiwXC653NSvf
Test Page Mint Key: CtENBNHd5fz2u1TERoZZQ9wqoydxsXTbph5xTyy8LUva

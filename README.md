This was a fun project - Twitter combined with blockchain. Each page could have its own token and its associated automated market maker to create "stocks" - not just for large companies, but for any organization. Updates would appear right away on the same platform. 20Vision stands for 20/20 vision - having full sight of one's vision. There is a completely new version of this code - the new smart contract is on: https://github.com/20vision/solana-program

## Page
role:
  - null -> guest
  - 0 -> can edit papers but not page
  - 1 -> admin, can do everything (Only one Admin can exist -> is Fee Collector)


## Blockchain
DEVNET Contract: 969cdvMTsXAs2QfCFvGb2TmaR9gbFvMjRfG8u5v1if3d
Test Page Mint Key: CtENBNHd5fz2u1TERoZZQ9wqoydxsXTbph5xTyy8LUva

## Forum
DB -> ForumPost -> parent_type -> p=page, t=topic, m=mission, mp=paper
DB -> Forum_Swipe -> type -> (same as parent_type) + po=post

## Paper
DB -> Paper -> type -> p(product), s(service), r(result)
Stored image in folder paper_images/timestampstring/random_int(8) | Same as paper uid -> timestampstring+random_int(8)
### Version Control
  ![Version_Control drawio](https://user-images.githubusercontent.com/66218148/157411028-c5b8e295-c49e-4227-b035-35c8ecd801e7.png)

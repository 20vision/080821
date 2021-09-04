### Page
role:
  - null -> guest
  - 0 -> can edit papers but not page
  - 1 -> admin, can do everything
  
querying roles by ?role=... checks if role is at least ... otherwise throws error

DB -> Paper -> private(tinyint) -> 0=public; 1=private; 2=banned;

DB -> Paper_Version -> version(varcahr(11)) because decimal 5,5 each minor update can be increated from .0 to .99999

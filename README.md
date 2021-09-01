### Page
role:
  - null -> guest
  - 0 -> can edit papers but not page
  - 1 -> admin, can do everything
  
querying roles by ?role=... checks if role is at least ... otherwise throws error

This folder contains sample data sets which import with the import command fromt the server repository, e.g.: `utils/inv-import.js file.csv YYYY-MM-DD`

### Medications

filename | descritpion | notes 
---------|-------------|------
[amt_20170201_forEXPORT.csv](./medications/amt_20170201_forEXPORT.csv) | Australian PBS database | slightly modified (commas replaced with semi-colons).  Note that the `lotNumber` field is being used for the drug unique identifier and `vendorItemNo` field is used for the trade name. 

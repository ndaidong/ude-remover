// utils / isVendorAsset

const isVendorAsset = (file) => {
  return file.includes('node_modules/') || file.includes(`vendor/`);
};

module.exports = isVendorAsset;

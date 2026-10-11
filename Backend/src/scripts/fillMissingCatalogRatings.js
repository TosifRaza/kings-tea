const Product = require('../models/ProductModel');
const { makeRandomCatalogRating } = require('../utils/CatalogRating');

const fillMissingCatalogRatings = async () => {
  const products = await Product.find({ catalogRating: null }).select('_id').lean();
  if (!products.length) return 0;

  const operations = products.map(({ _id }) => ({
    updateOne: {
      filter: { _id, catalogRating: null },
      update: { $set: { catalogRating: makeRandomCatalogRating() } },
    },
  }));

  const result = await Product.bulkWrite(operations, { ordered: false });
  return result.modifiedCount;
};

module.exports = fillMissingCatalogRatings;

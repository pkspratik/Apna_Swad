import data from "../API_Data/products.json";

const categories = data?.record?.categories ?? data?.categories ?? [];

export function getProductById(id) {
  const numericId = Number(id);

  for (const category of categories) {
    const match = category.products.find((product) => product.id === numericId);
    if (match) {
      return match;
    }
  }

  return null;
}

export default getProductById;

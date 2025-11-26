import data from "../API_Data/products.json";

export function getCategoryById(productId) {
  const allCategories = data.categories;

  // Search in each category
  for (const group of allCategories) {
    const found = group.products.find(
      (p) => p.id.toString() === productId.toString()
    );

    if (found) {
      return group.category;  // "Breakfast" / "Lunch" / "Snacks"
    }
  }

  return null; // Not found
}

import { useLocation } from "react-router-dom";



export function ProductPage() {
  const { state } = useLocation();
  const category = state?.category;

  console.log("Selected Product:", state.item);
  console.log("Category Name:", state.categoryName); // Breakfast, Lunch, Snacks





  return (
    <div>
      <h2>{state.categoryName}</h2>
      <h3>{state.item.name}</h3>
    </div>
  );
}

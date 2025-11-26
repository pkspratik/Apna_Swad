import React from "react";
import { NevBar } from "../Heder_Nev/NevBar";
import {Footer} from "../Footer/Footer";
import { FoodCategory } from "../FoodCategory/FoodCategory";
import { ProductDetails } from "../ProductDetails/ProductDetails";


export default function Home() {
  return (
    <div className="container-fluid">

      <NevBar BrandTitle="Apna Swad" MenuItems={["Home", "Category"]} />
       <FoodCategory />
       

       <ProductDetails/>
        
      
      <Footer/>
    </div>
  );
}

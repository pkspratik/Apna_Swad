import React from "react";
import { NevBar } from "../Heder_Nev/NevBar";
import {Footer} from "../Footer/Footer";
import { FoodCategory } from "../FoodCategory/FoodCategory";
import { Breakfast } from "../BreakFast/Breakfast";
import { Lunch } from "../Lunch/Lunch";
import { Snacks } from "../Snacks/Snacks";

export default function Home() {
  return (
    <div className="container-fluid">

      <NevBar BrandTitle="Apna Swad" MenuItems={["Home", "Service"]} />
       <FoodCategory />
       <Breakfast/>
       <Lunch/>
       <Snacks/>
        
      
      <Footer/>
    </div>
  );
}

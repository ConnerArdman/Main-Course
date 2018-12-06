/*
    Hari Kaushik, Sai Ranganathan, Conner Ardman, Ian Wohler 
    This is the nutrition label which is the component that has all the information that belongs
    on the slider.  
*/
import React, { Component } from 'react';
import { MACROS } from './RecipeGenerator';
import { Pie } from 'react-chartjs-2';

export class NutritionLabel extends Component {
   render() {
      const {hidden} = this.props;
      const {totalNutrients, calories} = this.props.hit.recipe;
      const servings = this.props.hit.recipe.yield;
      const protein = Math.round(totalNutrients.PROCNT.quantity);
      const carbs = Math.round(totalNutrients.CHOCDF.quantity);
      const fat = Math.round(totalNutrients.FAT.quantity);
      const data = {
         datasets: [
            {
               data: [
                  protein * MACROS.get('protein'),
                  carbs * MACROS.get('carbs'),
                  fat * MACROS.get('fat')
               ],
               backgroundColor: ['red', 'green', 'blue']
            }
         ],
         labels: ['Protein Cals', 'Carbs Cals', 'Fat Cals']
      };
      const options = {
         responsive: true,
         maintainAspectRatio: false
      };

      return (
         <div className={hidden ? "hidden" : ""}>
            <div className="chart">
               <Pie data={data} options={options} />
               <ul>
                  <li><strong>Servings:</strong>&nbsp;{servings}</li>
                  <li><strong>Calories:</strong>&nbsp;{Math.round(calories)}</li>
                  <li><strong>Protein:</strong>&nbsp;{protein + "g"}</li>
                  <li><strong>carbs:</strong>&nbsp;{carbs + "g"}</li>
                  <li><strong>fat:</strong>&nbsp;{fat + "g"}</li>
               </ul>
            </div>
         </div>
      );
   }
}

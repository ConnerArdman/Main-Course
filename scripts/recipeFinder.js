/**
 * Conner Ardman
 * INFO 340
 * The primary purpose of this file is to provide collapsable functionality to
 * the filter sidebar and to update the page based on sliders.
 */

/**
 * Using the module pattern to encapsulate code and "use strict" for better
 * lint checking.
 */
"use strict";
(function() {
   // Maping of macronutrients to calories per gram
   const MACROS = new Map([
      ['carbs', 4],
      ['fat', 9],
      ['protein', 4]
   ]);

   // Once the page loads, run Initializations.
   window.addEventListener('load', init);

   /**
    * init - Initializes the state of the application. Sets up sliders
    * and buttons.
    */
   function init() {
      inputSetup('budget', 'dollars');
      inputSetup('cook-time', 'minutes');
      inputSetup('meals-per-week', 'meals', 'meal-plural');
      inputSetup('carb-input', 'carbs');
      inputSetup('protein-input', 'protein');
      inputSetup('fat-input', 'fat');


      // Add collapsable functionality to the filters
      qsa('#filters > div').forEach(div => {
         div.querySelector('h3').addEventListener('click', () => {
            div.querySelector('div').classList.toggle('hidden');
            div.querySelector('h3').classList.toggle('rotated');
         });
      });

      getEl('generate').addEventListener('click', showRecipes);
   }

   /**
    * showRecipes - Hides the plan-placeholder and replaces it with the plan.
    * In the future, this function will also make the required API calls
    */
   function showRecipes() {
      getEl('plan-container').classList.remove('hidden');
      getEl('plan-placeholder').classList.add('hidden');
   }

   /**
    * inputSetup - Sets up a slider input to update the DOM
    *
    * @param  {String} slider ID of the slider
    * @param  {String} output ID of the output container of the slider value
    * @param  {String} plural Optional ID of a plural placeholder that will contain
    * an "s" in the case of output being > 1
    */
   function inputSetup(slider, output, plural) {
      getEl(slider).addEventListener('input', (e) => {
         getEl(output).innerText = e.srcElement.value;
         if (plural != null) {
            getEl(plural).innerText = e.srcElement.value === '1' ? '' : 's';
         }
         if (MACROS.has(output)) {
            let calories = 0;
            for (const [macro, cals] of MACROS) {
               calories += getEl(macro).innerText * cals;
            }
            getEl('calories').innerText = calories;
         }
      });
   }

   /**
    * Alias functions for document.getElementById and document.querySelectorAll
    */
   const getEl = id => document.getElementById(id);
   const qsa = query => document.querySelectorAll(query);
}());

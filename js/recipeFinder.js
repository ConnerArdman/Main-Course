/* global Map, Promise */
/**
 * Conner Ardman
 * INFO 340
 * This file fetches recipe information and displays daily meal plans based
 * on the filters of a user.
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

   /**
    * The API has a lot of filtering limitations, so this is how many
    * queries to make, so we can do custom filtering on the client side.
    */
   const NUM_RECIPES = 100;

   // Default amount of tolerance on entred mactronutrients.
   const DEFAULT_TOLERANCE_RANGE = .2;

   // Storing API keys here for the purposes of this class.
   // TODO: add a server as a layer of abstraction between API keys and clients
   const API = 'https://api.edamam.com/search?app_id=4fba7f21&app_key=015209fd4e63d9db67f22a621a26ea4a';

   // Stack of recipes that fit the critera but are not currently displayed
   // for when a user deletes a recipe
   let extraRecipes;

   // Once the page loads, run Initializations.
   window.addEventListener('load', init);

   /**
    * init - Initializes the state of the application. Sets up sliders
    * and buttons.
    */
   function init() {
      inputSetup('cook-time', 'minutes');
      inputSetup('meals-per-day', 'meals', 'meal-plural');
      inputSetup('carb-input', 'carbs');
      inputSetup('protein-input', 'protein');
      inputSetup('fat-input', 'fat');

      setupCollapsability();

      qs('#filters > h2').addEventListener('click', hideFilters);
      getEl('generate').addEventListener('click', fetchRecipes);
      window.matchMedia("(min-width: 992px)").addListener(checkShowFilter);
   }

   // ******************************  Api Calls ****************************** //

   /**
    * fetchRecipes - Calls the API to get recipes based on user input and
    * displays them to the page.
    */
   function fetchRecipes() {
      const numMeals = getEl('meals-per-day').value;
      const filters = {
         numMeals,
         calories: parseInt(getEl('calories').textContent),
         maxCookTime: getEl('cook-time').value,
         carbs: parseInt(getEl('carb-input').value / numMeals),
         protein: parseInt(getEl('protein-input').value / numMeals),
         fat: parseInt(getEl('fat-input').value / numMeals),
         restrictions: Array.from(qsa('input:checked')).map(el => el.value)
      };
      extraRecipes = [];
      const container = getEl('plan-container');
      container.innerHTML = "Loading...";
      container.classList.remove('hidden');
      getEl('plan-placeholder').classList.add('hidden');
      fetch(getAPIQuery(filters))
         .then(checkStatus)
         .then(recipes => parseRecipes(recipes, filters))
         .catch(showError);
   }

   /**
    * getAPIQuery - generates an API query string based on current user inputs
    *
    * @param  {Object} filters contains user inputted filters
    * @return {String} query to make for recipes API
    */
   function getAPIQuery(filters) {
      const {
         numMeals,
         maxCookTime,
         carbs,
         protein,
         fat,
         restrictions
      } = filters;

      const query = ''; // Send an empty query
      let output = `${API}&q=${query}&to=${NUM_RECIPES}&time=${maxCookTime}` +
         `&nutrients%5BCHOCDF%5D=${getRange(carbs / numMeals)}&nutrients%5BFAT%5D=` +
         `${getRange(fat / numMeals)}&nutrients%5BPROCNT%5D=${getRange(protein / numMeals)}`;
      if (restrictions.length > 0) {
         output += `&health=${restrictions[0]}`; // API limits one health restriction
      } return output;
   }

   // ******************************  Recipe Filtering ****************************** //


   /**
    * parseRecipes - Ensure that recipes meet all listed restrictions
    * before showing them on the page.
    *
    * @param  {Object} recipes object containing all of the recipe information
    * @param  {Object} filters object containing all user inputted filters.
    */
   function parseRecipes(recipes, filters) {
      let {hits} = recipes;
      const {numMeals, restrictions} = filters;
      hits = shuffleArray(hits);
      if (restrictions.length > 1) {
         hits = hits.filter(hit => {
            const {recipe} = hit;
            const {healthLabels} = recipe;
            for (const restriction of restrictions) {
               if (!healthLabels.includes(restriction)) {
                  return false;
               }
            } return true;
         });
      }
      if (hits.length === 0) {
         getEl('plan-container').innerHTML =
            'Sorry no matches found. Please try removing some filters.';
      } else {
         showRecipes(hits, numMeals);
      }
   }

   // ******************************  Dom Manipulation ****************************** //

   /**
    * showRecipes - Creates recipe DOM elements and appends them to the page
    *
    * @param  {Object} hits Object representing all of the recipes possible
    * @param  {Number} numMeals Max number of recipes to append to the page.
    */
   function showRecipes(hits, numMeals) {
      const container = getEl('plan-container');
      container.innerHTML = "";
      let shoppingCart = [];

      for (let i = 0; i < hits.length; i++) {
         if (i >= numMeals) {
            break;
         }
         const hit = hits[i].recipe;
         shoppingCart = [...shoppingCart, ...hit.ingredientLines];
         addNewRecipe(hit, container);
      }
      extraRecipes = hits.splice(numMeals);

      const div = gen('div');
      const title = gen('h3');
      title.textContent = "Shopping List";
      title.classList.add('chevron');
      div.classList.add('recipe');
      // Add to the end of execution queue
      setTimeout(() => {
         div.classList.add('loaded');
      }, 0);
      div.appendChild(title);
      title.addEventListener('click', () => {
         title.classList.toggle('rotated');
         div.querySelector('ul').classList.toggle('hidden');
      });
      const masterIngredients = gen('ul');
      shoppingCart.forEach(ingredient => {
         const li = gen('li');
         li.textContent = ingredient;
         masterIngredients.appendChild(li);
      });
      div.appendChild(masterIngredients);
      container.prepend(div);
   }

   /**
    * addNewRecipe - Adds a given recipe to the DOM
    *
    * @param  {Object} hit Recipe to add to the DOM
    * @param  {HTMLElement} container HTMLElement to act as parent to new recipe
    */
   function addNewRecipe(hit, container, before) {
      const {label, image, ingredientLines, url, source, calories} = hit;
      const servings = hit.yield;
      const recipe = gen('div');
      recipe.classList.add('recipe');

      // Wait till the end of the execution queue
      setTimeout(() => {
         recipe.classList.add('loaded');
      }, 0);

      const del = gen('div');
      del.textContent = 'X';
      del.classList.add('del');
      del.addEventListener('click', (e) => {
         e.target.parentNode.classList.add('deleted');
         setTimeout(()=> {
            if (extraRecipes.length > 0) {
               addNewRecipe(extraRecipes.pop().recipe, container, e.target.parentNode);
            }
            e.target.parentNode.parentNode.removeChild(e.target.parentNode);
         }, 1000);
      });
      recipe.appendChild(del);

      const title = gen('h3');
      title.textContent = label;
      title.classList.add('chevron');
      recipe.appendChild(title);
      // Add toggle functionality
      title.addEventListener('click', () => {
         title.classList.toggle('rotated');
         Array.from(recipe.children).forEach(child => {
            if (child !== title && child.textContent !== 'X') {
               child.classList.toggle('hidden');
            }
         });
      });

      const img = gen('img');
      img.src = image;
      img.alt = label;
      recipe.appendChild(img);

      const link = gen('p');
      const a = gen('a');
      a.href = url;
      a.textContent = 'Full Recipe From ' + source;
      a.target = '_blank';
      link.appendChild(a);
      recipe.appendChild(link);

      const nutrList = gen('ul');
      nutrList.appendChild(genNutritionLabel('Servings', servings));
      nutrList.appendChild(genNutritionLabel('Calories', calories));
      nutrList.appendChild(genNutritionLabel('Fat', hit.totalNutrients.FAT.quantity));
      nutrList.appendChild(genNutritionLabel('Carbohydrates', hit.totalNutrients.CHOCDF.quantity));
      nutrList.appendChild(genNutritionLabel('Protein', hit.totalNutrients.PROCNT.quantity));
      recipe.appendChild(nutrList);

      const ingredientsList = gen('ul');
      ingredientLines.forEach(ingredient => {
         const li = gen('li');
         li.textContent = ingredient;
         ingredientsList.appendChild(li);
      });
      recipe.appendChild(ingredientsList);

      if (before != null) {
         container.insertBefore(recipe, before);
      } else {
         container.appendChild(recipe);
      }
   }

   /**
    * genNutritionLabel - Creates a new list item to display a nutrition fact
    *
    * @param  {String} label Nutrition label (i.e. calories, protein, etc.)
    * @param  {Number} value Nutritional value associated with label
    * @return {HTMLElement} li element in form <li><strong>label: </strong>value</li>
    */
   function genNutritionLabel(label, value) {
      const li = gen('li');
      const strong = gen('strong');
      strong.textContent = label + ': ';
      li.appendChild(strong);
      li.appendChild(document.createTextNode(Math.round(value)));
      return li;
   }

   /**
    * showError - Displays an error message to the screen when fetch fails.
    *
    * @param  {String} error content of the error to put on screen.
    */
   function showError(error) {
      const container = getEl('plan-container');
      container.innerHTML = "";
      const p = gen('p');
      p.textContent = "It looks like something went wrong. There are some limitations " +
      "to this API that cause pretty quick rate limiting. Please wait and try again. " +
      "(If this error is preventing grading, please let me know and I can raise the " +
      "API rate limit.)";
      container.appendChild(p);
      const errorP = gen('p');
      errorP.textContent = error;
      container.appendChild(errorP);
   }

   // ******************************  Initial Setup ****************************** //

   /**
    * inputSetup - Sets up a slider input to update the DOM
    *
    * @param  {String} slider ID of the slider
    * @param  {String} output ID of the output container of the slider value
    * @param  {String} plural Optional ID of a plural placeholder that will contain
    *                         an "s" in the case of output being > 1
    */
   function inputSetup(slider, output, plural) {
      getEl(slider).addEventListener('input', (e) => {
         getEl(output).textContent = e.srcElement.value;
         if (plural != null) {
            getEl(plural).textContent = e.srcElement.value === '1' ? '' : 's';
         }
         if (MACROS.has(output)) {
            let calories = 0;
            for (const [macro, cals] of MACROS) {
               calories += getEl(macro).textContent * cals;
            }
            getEl('calories').textContent = calories;
         }
      });
   }

   /**
    * hideFilters - Hides the filters panel for small screens
    */
   function hideFilters() {
      // Do nothing for large screens
      if (!window.matchMedia("(min-width: 992px)").matches) {
         this.classList.toggle('rotated');
         const isHidden = qsa('#filters > div.hidden').length > 0;
         qsa('#filters > div').forEach(div => {
            if (isHidden) {
               div.classList.remove('hidden');
            } else {
               div.classList.add('hidden');
            }
         });
      }
   }

   /**
    * checkShowFilter - Listens for screen size change and hides/shows filters
    */
   function checkShowFilter() {
      if (window.matchMedia("(min-width: 992px)").matches) {
         const isHidden = qsa('#filters > div.hidden').length > 0;
         if (isHidden) {
            qsa('#filters > div').forEach(div => {
               div.classList.remove('hidden');
            });
            qs('#filters > h2').classList.toggle('rotated');
         }
      }
   }

   /**
    * setupCollapsability - Add collapsable functionality to the filters
    */
   function setupCollapsability() {
      qsa('#filters > div').forEach(div => {
         div.querySelector('h3').addEventListener('click', () => {
            div.querySelector('div').classList.toggle('hidden');
            div.querySelector('h3').classList.toggle('rotated');
         });
      });
   }

// ******************************  HELPER FUNCTIONS ****************************** //

   /**
    * getRange - Get the minimum and maximum allowed values given user input
    *
    * @param  {String} value String to be parsed as integer for median of range.
    * @param  {Number} rangeOffset Percentage of increase/decrease allowed in range
    * @return {String} In form min-max
    */
   function getRange(value, rangeOffset = DEFAULT_TOLERANCE_RANGE) {
      value = parseInt(value);
      const diff = Math.round(value * rangeOffset);
      const min = value - diff;
      const max = value + diff;
      return `${min}-${max}`;
   }

   /**
    * shuffleArray - Randomly shuffles an array based on Fisher Yate's Algorithm
    * https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle#The_modern_algorithm
    *
    * @param  {Array} arr Array to be shuffled
    * @return {Array}     input arr in a random order
    */
   function shuffleArray(arr) {
      for (let i = arr.length - 1; i > 0; i--) {
         const j = Math.floor(Math.random() * (i + 1));
         const temp = arr[i];
         arr[i] = arr[j];
         arr[j] = temp;
      }
      return arr;
   }

   /**
    * Gets the response's result text if successful, otherwise
    * returns the rejected Promise result with an error status and corresponding text
    * @param {object} response - fetch response to check for success/error
    * @return {object} - valid result JSON if response was successful, otherwise rejected
    *                    Promise result
    */
   function checkStatus(response) {
      if (response.status >= 200 && response.status < 300 || response.status === 0) {
         return response.json();
      } else {
         return Promise.reject(new Error(response.status + ": " + response.statusText));
      }
   }

   /**
    * Alias functions for document.getElementById, querySelector(All), createElement
    */
   const getEl = id => document.getElementById(id);
   const qsa = query => document.querySelectorAll(query);
   const qs = query => document.querySelector(query);
   const gen = el => document.createElement(el);
}());

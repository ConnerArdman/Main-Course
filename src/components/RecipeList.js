import React, { Component } from 'react';
import { Recipe } from './Recipe';
import { ShoppingList } from './ShoppingList';
import ReactLoading from 'react-loading';

export class RecipeList extends Component {
   render() {
      const {hits, deleteRecipe, loading} = this.props;
      const loaded = hits.length !== 0

      return (
         <section id="recipes">
            <h1>Your Custom Meal Plan</h1>

            <div id="plan-container" className={!loaded ? "hidden" : null}>
                  {loading ?
                        <div>
                              <ReactLoading id="loading" type={"spin"} color={"Black"} height={150} width={150}/>
                              <div class="push"></div><div class="push"></div>
                        </div>
                        :
                        <div>
                        <ShoppingList hits={hits} />
                        {hits.map((hit, index) => {
                              return <Recipe
                              hit={hit}
                              key={index}
                              deleteRecipe={() => deleteRecipe(index)} />
                        })}
                        </div>
                        }
            </div>

            <p id="plan-placeholder" className={loaded ? "hidden" : null}>
                  {loading ?
                        <ReactLoading id="loading" type={"spin"} color={"Black"} height={150} width={150} /> :
                        <p>Meal plan will appear here once it is created!</p>}
                  <div class="push"></div><div class="push"></div>
            </p>
         </section>
      );
   }
}

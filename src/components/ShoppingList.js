/*
    Hari Kaushik, Sai Ranganathan, Conner Ardman, Ian Wohler 
    This is the shopping list component that goes on the recipe generator, 
    which compiles all the ingredients needed for the meals generator and adds them all 
    to a single dropdown panel with all that infomration. 
*/
import React, { Component } from 'react';
import {Panel} from 'react-bootstrap';

export class ShoppingList extends Component {
   constructor(props) {
      super(props);
      this.state = {
         collapsed: false,
         loaded: false
      };
   }

   componentDidMount() {
      setTimeout(() => {
         this.setState({loaded: true});
      }, 0);
   }

   render() {
      const {hits} = this.props;
      let ingredients = [];
      hits.forEach(hit => {
         ingredients = [...ingredients, ...hit.recipe.ingredientLines];
      });

      const {collapsed, loaded} = this.state;
      const loadEffect = loaded ? " loaded" : "";
      return (
        <Panel id="collapsible-panel-example-2" defaultExpanded={false} className={"recipe" + loadEffect}>
            <Panel.Heading>
                <Panel.Title toggle>
                    Shopping List
                </Panel.Title>
            </Panel.Heading>
            <Panel.Collapse>
                <Panel.Body>
                    <ul className={collapsed ? "hidden" : null}>
                        {ingredients.map((ingredient, index) => {
                            return <li key={index}>{ingredient}</li>
                        })}
                    </ul>
                </Panel.Body>
            </Panel.Collapse>
        </Panel>
      );
   }

   // set state to collapse to toggle opening and closing the panel 
   collapse() {
      this.setState(prevState => {
         return {
            collapsed: !prevState.collapsed
         };
      });
   }

}

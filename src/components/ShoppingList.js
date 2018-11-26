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

   collapse() {
      this.setState(prevState => {
         return {
            collapsed: !prevState.collapsed
         };
      });
   }

}

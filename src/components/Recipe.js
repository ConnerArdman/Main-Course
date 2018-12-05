import React, { Component } from 'react';
import { NutritionLabel } from './NutritionLabel';
import { Panel, Grid, Row, Col } from 'react-bootstrap';

const TRANSITION_TIME = 1000; // in ms

export class Recipe extends Component {
   constructor(props) {
      super(props);
      this.state = {
         loaded: false
      };
   }

   componentDidMount() {
      setTimeout(() => {
         this.setState({loaded: true});
      }, 0);
   }

   render() {
      const {hit} = this.props;
      const {label, image, ingredientLines, url, source} = hit.recipe;
      const {loaded} = this.state;
      const loadEffect = loaded ? " loaded" : "";

      return (
        <Panel defaultExpanded={false} className={"recipe" + loadEffect}>
            <Panel.Heading>
                <Panel.Title toggle>
                    {label}
                </Panel.Title>
                <div
                  role="button"
                  className="del"
                  onClick={this.del.bind(this)}>X</div>
            </Panel.Heading>
            <Panel.Collapse>
                <Panel.Body>
                    <Grid fluid={true}>
                        <Row className="show-grid" id="grid">
                            <Col xs={12} md={6}>
                                <img src={image} alt={label} />
                            </Col>
                            <Col xs={12} md={6}>
                                <div className = "pieContainer">
                                    <NutritionLabel hit={hit} />
                                </div>
                            </Col>
                        </Row>
                    </Grid>
                </Panel.Body>
                <Panel.Footer>
                    <h1>
                        <a href={url} target="_blank" rel="noopener noreferrer">{"Full Recipe From " + source}</a>
                    </h1>

                    <ul>
                        {ingredientLines.map((ingredient, index) => {
                            return <li key={index}>{ingredient}</li>
                        })}
                    </ul>
                </Panel.Footer>
            </Panel.Collapse>
        </Panel>
      );
   }

   del() {
      // Fade out and back in
      this.setState({loaded: false});
      setTimeout(() => {
         this.props.deleteRecipe();
         this.setState({loaded: true});
      }, TRANSITION_TIME);
   }

}

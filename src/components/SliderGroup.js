/*
    Hari Kaushik, Sai Ranganathan, Conner Ardman, Ian Wohler 
    This is the slider group component which renders the slider 
    component and passes in the necessary props to it while returning back 
    the slider used in the app. 
*/
import React, { Component } from 'react';
import { Slider } from './Slider';

export class SliderGroup extends Component {
   constructor(props) {
      super(props);
      this.state = {
         collapsed: true
      };
   }

   render() {
      const {masterUnits, sliderPropsArray, masterValue, title} = this.props;
      const {collapsed} = this.state;
      const rotated = collapsed ? " rotated" : "";
      return (
         <div>
            <h3
               className={"chevron" + rotated}
               onClick={this.collapse.bind(this)}>
               {title}
            </h3>
            <div className={collapsed ? "hidden" : null}>
               <label>
                  ({masterValue} {masterUnits})
               </label>
               {sliderPropsArray.map((sliderProps, index) => {
                  const {id, unit, min, max, defaultValue, aria, value, inputChange} = sliderProps;
                  return (
                     <Slider
                        key={index}
                        id={id}
                        unit={unit}
                        min={min}
                        max={max}
                        defaultValue={defaultValue}
                        aria={aria}
                        value={value}
                        inputChange={inputChange}
                        isGroup={true}
                        />
                  );
               })}
            </div>
         </div>
      );
   }

   // set state to collapsed and toggle 
   collapse() {
      this.setState(prevState => {
         return {
            collapsed: !prevState.collapsed
         };
      });
   }
}

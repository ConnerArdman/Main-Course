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

   collapse() {
      this.setState(prevState => {
         return {
            collapsed: !prevState.collapsed
         };
      });
   }
}

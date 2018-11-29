import React, { Component } from 'react';

export class Slider extends Component {
   constructor(props) {
      super(props);
      this.state = {
         collapsed: false
      };
   }

   render() {
      const {name, id, min, max, defaultValue, aria, inputChange, value} = this.props;
      const {collapsed} = this.state;
      const rotated = collapsed ? " rotated" : "";

      return (
         <div>
            {name ?
               <h3
                  className={"chevron" + rotated}
                  onClick={this.collapse.bind(this)}>
                  {name}
               </h3>
               : null
            }
            {!collapsed ?
               <div>
                  <label htmlFor={id}>
                     {value}{this.pluralize(value)}
                  </label>
                  <input
                     aria-label={aria != null ? aria : this.removeDash(id)}
                     type="range"
                     min={min}
                     max={max}
                     defaultValue={defaultValue}
                     className="slider"
                     id={id}
                     onChange={inputChange}
                     />
               </div>
               : null}
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

   removeDash(id) {
      return id.replace(/-/g, ' ');
   }

   pluralize(value) {
      const {unit, shouldPlural} = this.props;
      return value > 1 && shouldPlural ? unit + 's' : unit;
   }
}

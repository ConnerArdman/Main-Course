import React, { Component } from 'react';

export class CheckBoxGroup extends Component {
   constructor(props) {
      super(props);
      this.state = {
         collapsed: true
      };
   }

   render() {
      const {title, checkBoxes, change} = this.props;
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
               {checkBoxes.map((checkBox, index) => {
                  const lower = checkBox.toLowerCase();
                  return (
                     <div className="check-group" key={index}>
                        <input
                           type="checkbox"
                           id={lower}
                           defaultValue={lower}
                           onChange={change} />
                        <label htmlFor={lower}>
                           {checkBox}
                        </label>
                     </div>
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

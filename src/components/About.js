/*
    Hari Kaushik, Sai Ranganathan, Conner Ardman, Ian Wohler 
    This is the about page which is rendered with a new route when the button is clicked on the 
    slider bar. This pages talks about the application itself and what it does. 
*/
import React, { Component } from 'react';

class About extends Component {
   render() {
      return (
        <div className="col" id="about-page">
            <div>
                <h1>About Main Course</h1>
                <p>
                    The original idea here was to create an application that would somehow make the
                    lives of students easier. As a student myself, I found that I was constantly
                    eating out, because I was running out of ideas of what to make. As a result, I
                    was spending more money than I wanted to on food. To solve this problem, we created
                    Main Course. Main Course is a mobile-first web application that is a combination of two
                    different apps aimed at making the cooking process simpler. The user simply inputs 
                    their meal preferences indicated by sliders, we generate a new list of recipes for them. 
                    They will then be allowed to add their meals to the calnedar interface, which can help 
                    them keep track of when they want to make their food. Additionally, there is a grocery
                    list interface which helps them plans out the ingredients that they have to buy. The 
                    ida is pretty simple, and by adding filters based on nutritional goals, we believe that 
                    Main Course could be a perfect way that students can <strong>eat healthy and save money </strong>
                    in a more efficient manner. 
                </p>
            </div>

            <div>
                <h2>Some Limitations</h2>
                <p>
                    The orginal goal here was to allow a budget to be part of the filters,
                    and to provide an entire weeks worth of recipes. Additionally, the original
                    wireframe contained a few more filters. Unfortunately, limitations of the API
                    are preventing this currently. There is a great deal of rate limiting happening
                    from the API, preventing the site from gathering all of the information it needs.
                    Additionally, we wanted to show the actual recipe on the screen, but this is another
                    limitation of the free version of this API.
                </p>
            </div>

            <div>
                <h2>About The Development</h2>
                <p>
                We used LESS CSS extention in order to style the webpages, as it allowed us 
                to create simple variables that control the look adn the feel of the site. 
                Changing any of the variables at the top of the Less file should
                substantially change the look of the site. We built this web application with 
                a mobile first approach, meaning all  of the default styles are also built for 
                smaller devices, and it works on all mobile devices. That said, the CSS should 
                scale nicely on a larger screen in a multi-column format.
                </p>
                <p>
                This web application was built using React JS, with multiple components 
                that were rendered onto to the page. We had used a Basic Layout component 
                to place and keep track of all the other components, which was then instantiated 
                in the App component and displayed on the DOM. We included clien-side routing in
                this stage of the project in order to keep track of all the different web pages 
                we had that were part of the entire application, and we utilized firebase servers in 
                order to include the idea of having users, and would keep track of their data. 
               </p> 
            </div>
        </div>
      );
   }
}

export default About;
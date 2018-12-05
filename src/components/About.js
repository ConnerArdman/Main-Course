import React, { Component } from 'react';

export class About extends Component {
   render() {
      return (
        <div className="col" id="about-page">
            <div>
                <h1>About Cook Healthy</h1>
                <p>
                    The original idea here was to create an application that would somehow make the
                    lives of students easier. As a student myself, I found that I was constantly
                    eating out, because I was running out of ideas of what to make. As a result, I
                    was spending more money than I wanted to on food. To solve this problem, we created
                    Meal Time. Meal Time is a mobile-first web application that is a combination of two
                    different apps aimed at making the cooking process simpler. The user simply inputs 
                    their meal preferences indicated by sliders, we generate a new list of recipes for them. 
                    They will then be allowed to add their meals to the calnedar interface, which can help 
                    them keep track of when they want to make their food. Additionally, there is a grocery
                    list interface which helps them plans out the ingredients that they have to buy. The 
                    ida is pretty simple, and by adding filters based on nutritional goals, we believe that 
                    Meal Time could be a perfect way that students can <stong>eat healthy and save money</stong>
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
                    Additionally, I wanted to show the actual recipe on the screen, but this is another
                    limitation of the free version of this API.
                </p>
            </div>

            <div>
                <h2>About The Development</h2>
                <p>
                For this site, I chose to utlize the Less CSS extension, as it allowed
                me to create simple variables that control the look and feel of the
                site. Changing any of the variables at the top of the Less file should
                substantially change the look of the site. Additionally, I built this
                initial version with a mobile first approach, meaning all of the default
                styles are for smaller devices. That said, the CSS should scale nicely
                on a larger screen in a multi-column format.
                </p>
                <p>
                In addition to the CSS, I wrote some basic JavaScript functions to add
                to the aesthetic and usability of the page. These functions are listening
                for the screen size to change, in order to change the logic for expanding
                and compressing the filters section. Additionally, this JavaScript serves to
                keep track of the changes made on the sliders and display them to the user.
                As a note, Chrome's mobile simulator blocks these sliders, but they work
                perfectly on
                <a href="https://caniuse.com/#search=range" target="_blank" rel="noopener noreferrer">most mobile devices.</a>
                </p>
            </div>
        </div>
      );
   }
}

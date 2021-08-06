#### 1.1: course information, step1

Use create-react-app to initialize a new application. Modify index.js and App.js
and remove extra files (App.css, App.test.js, logo.svg, setupTests.js, reportWebVitals.js)).

Unfortunately, the entire application is in the same component. Refactor the code so that it consists of three new components: Header, Content, and Total. All data still resides in the App component, which passes the necessary data to each component using props. Header takes care of rendering the name of the course, Content renders the parts and their number of exercises and Total renders the total number of exercises.

Define the new components in file App.js.

#### 1.2: course information, step2

Refactor the Content component so that it does not render any names of parts or their number of exercises by itself. Instead it only renders three Part components of which each renders the name and number of exercises of one part.

Our application passes on information in quite a primitive way at the moment, since it is based on individual variables. This situation will improve soon.

#### 1.3: course information step3

Let's move forward to using objects in our application. Modify the variable definitions of the App component as follows (objects) and also refactor the application so that it still works.

#### 1.4: course information step4

And then place the objects into an array. Modify the variable definitions of App into the following form (array of objects) and modify the other parts of the application accordingly.

However, do not pass different objects as separate props from the App component to the components Content and Total. Instead, pass them directly as an array.

#### 1.5: course information step5

Let's take the changes one step further. Change the course and its parts into a single JavaScript object. Fix everything that breaks.

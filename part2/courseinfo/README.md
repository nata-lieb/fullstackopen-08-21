#### 2.1: Course information step6

Let's finish the code for rendering course contents from exercises 1.1 - 1.5.
Let's change the App component.
Define a component responsible for formatting a single course called Course.

The component structure of the application can be, for example, the following:

```
App
  Course
    Header
    Content
      Part
      Part
      ...
```

Hence, the Course component contains the components defined in the previous part, which are responsible for rendering the course name and its parts.

You don't need the sum of the exercises yet.

The application must work regardless of the number of parts a course has, so make sure the application works if you add or remove parts of a course.

Ensure that the console shows no errors!

#### 2.2: Course information step7

Show also the sum of the exercises of the course.

#### 2.3: Course information step8

If you haven't done so already, calculate the sum of exercises with the array method reduce.

#### 2.4: Course information step9

Let's extend our application to allow for an arbitrary number of courses.

#### 2.5: separate module

Declare the Course component as a separate module, which is imported by the App component. You can include all subcomponents of the course into the same module.

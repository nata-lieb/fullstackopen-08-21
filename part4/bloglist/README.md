#### 4.1 Blog list, step1

Let's imagine a situation, where you receive an email that contains the following application body: [exercises-4-1-4-2](https://fullstackopen.com/en/part4/structure_of_backend_application_introduction_to_testing#exercises-4-1-4-2)

Turn the application into a functioning npm project. In order to keep your development productive, configure the application to be executed with nodemon. You can create a new database for your application with MongoDB Atlas, or use the same database from the previous part's exercises.

Verify that it is possible to add blogs to list with Postman or the VS Code REST client and that the application returns the added blogs at the correct endpoint.

#### 4.2 Blog list, step2

Refactor the application into separate modules as shown earlier in this part of the course material.

#### 4.3: helper functions and unit tests, step1

First define a `dummy` function that receives an array of blog posts as a parameter and always returns the value 1.
Verify that your test configuration works with the test.

#### 4.4: helper functions and unit tests, step2

Define a new `totalLikes` function that receives a list of blog posts as a parameter. The function returns the total sum of likes in all of the blog posts.

Write appropriate tests for the function. It's recommended to put the tests inside of a describe block, so that the test report output gets grouped nicely.

#### 4.5: helper functions and unit tests, step3

Define a new `favoriteBlog` function that receives a list of blogs as a parameter. The function finds out which blog has most likes. If there are many top favorites, it is enough to return one of them.

Write the tests for this exercise inside of a new describe block. Do the same for the remaining exercises as well.

#### 4.6: helper functions and unit tests, step4

Finishing this exercise can be done without the use of additional libraries. However, this exercise is a great opportunity to learn how to use the Lodash library.

Define a function called `mostBlogs` that receives an array of blogs as a parameter. The function returns the author who has the largest amount of blogs. The return value also contains the number of blogs the top author has.
If there are many top bloggers, then it is enough to return any one of them.

#### 4.7: helper functions and unit tests, step5

Define a function called `mostLikes` that receives an array of blogs as its parameter. The function returns the author, whose blog posts have the largest amount of likes. The return value also contains the total number of likes that the author has received.
If there are many top bloggers, then it is enough to show any one of them.

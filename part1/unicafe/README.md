#### 1.6: unicafe step1

Like most companies, Unicafe collects feedback from its customers. Your task is to implement a web application for collecting customer feedback. There are only three options for feedback: good, neutral, and bad.

The application must display the total number of collected feedback for each category.

It is advisable to use the same structure that is used in material and previous exercise.

#### 1.7: unicafe step2

Expand your application so that it shows more statistics about the gathered feedback: the total number of collected feedback, the average score (good: 1, neutral: 0, bad: -1) and the percentage of positive feedback.

#### 1.8: unicafe step3

Refactor your application so that displaying the statistics is extracted into its own Statistics component. The state of the application should remain in the App root component.

#### 1.9: unicafe step4

Change your application to display statistics only once feedback has been gathered.

#### 1.10: unicafe step5

Let's continue refactoring the application. Extract the following two components:

Button for defining the buttons used for submitting feedback
StatisticLine for displaying a single statistic, e.g. the average score.
To be clear: the StatisticLine component always displays a single statistic, meaning that the application uses multiple components for rendering all of the statistics.
The application's state should still be kept in the root App component.

#### 1.11: unicafe step6

Display the statistics in an HTML table.

#### 2.12: Data for countries, step1

The API https://restcountries.eu provides data for different countries in a machine-readable format, a so-called REST API.

Create an application, in which one can look at data of various countries. The application should probably get the data from the endpoint all.

The user interface is very simple. The country to be shown is found by typing a search query into the search field.

If there are too many (over 10) countries that match the query, then the user is prompted to make their query more specific.
If there are ten or fewer countries, but more than one, then all countries matching the query are shown.
When there is only one country matching the query, then the basic data of the country, its flag and the languages spoken there, are shown.
NB: It is enough that your application works for most of the countries. Some countries, like Sudan, can be hard to support, since the name of the country is part of the name of another country, South Sudan. You need not to worry about these edge cases.

#### 2.13: Data for countries, step2

Improve on the application in the previous exercise, such that when the names of multiple countries are shown on the page there is a button next to the name of the country, which when pressed shows the view for that country.
In this exercise it is also enough that your application works for most of the countries. Countries whose name appears in the name of another country, like Sudan, can be ignored.

#### 2.14: Data for countries, step3

Add to the view showing the data of a single country, the weather report for the capital of that country. There are dozens of providers for weather data. I used https://weatherstack.com/.

NB: In some browsers (such as Firefox) weatherstack API sends an error response, which indicates that HTTPS encryption is not supported, although the request URL starts with http://. This issue can be fixed by completing the exercise using Chrome.

NB: You need an api-key to use almost every weather service. Do not save the api-key to source control! Nor hardcode the api-key to your source code. Instead use an environment variable to save the key.

Assuming the api-key is t0p53cr3t4p1k3yv4lu3, when the application is started like so:

REACT_APP_API_KEY='t0p53cr3t4p1k3yv4lu3' npm start // For Linux/macOS Bash
($env:REACT_APP_API_KEY='t0p53cr3t4p1k3yv4lu3') -and (npm start) // For Windows PowerShell
set REACT_APP_API_KEY='t0p53cr3t4p1k3yv4lu3' && npm start // For Windows cmd.exe

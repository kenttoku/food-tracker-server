# Food Tracker

> A simple point based food tracker

Food Tracker, as the name implies, tracks food on a points based system. 
The project originated with a friend, who was looking for ways to track the quality of his diet, in addition to the standard calories that most food and fitness trackers provide.

## Deployed Version
https://nameless-fjord-43314.herokuapp.com/

## Technologies used

### Front End
* React
* Redux for state management
* Moment.js for date calculation
* Enzyme and Jest for testing

### BackEnd
* Node
* Express
* Mongoose
* MongoDB for the database
* Passport and JWTs for authentication
* Mocha and Chai for testing

## When you visit the site, you will first need to sign up or log in

![landing](https://i.imgur.com/tql3L9b.png)

## Once you log in you will be taken to the app's "home" page

![home](https://i.imgur.com/MM2sZOg.png)

The home page will display today's information, including:

* Current Points
* Current Goal Points
* Food Entries

You can also navigate to other screens to:

* add food
* view the calendar
* change settings

## Adding Food

You can add food by navigating to the Add Food screen on the navigation bar.
Recent entries will be displayed here to add with just one touch.
You can also enter a new entry by clicking on the create new food button.

![add food](https://i.imgur.com/bdTZIuU.png)

![new food](https://i.imgur.com/DukruaN.png)

## Calendar

You can reference past days by clicking on the calendar.

![calendar](https://i.imgur.com/vacYRjy.png)

## Settings

You can change your settings by clicking on the settings.

![settings](https://i.imgur.com/Gb8iKDz.png)

## Installation

Clone this repo and run 
```
npm install
```
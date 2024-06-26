## HSL open data demo

This project is a simple demo on how the HSL open data could be used.

The idea of this project is quite simple:
Imagine you're in a city you're not familiar with and you need to get somewhere using public transportation.
You're not quite sure where to go to find the nearest bus stop or a subway etc.
Open the app and it shows you the nearest stops and you can use the app to guide yourself to that stop.

Requirements of the app:
1. Show the users location on a map.
2. Show the nearest bus, tram, etc. stops on the map on a 1km radius.
3. Allow the user to search a location manually based on an address. (In case gps doesn't work or location services are offline for some reason).

Future development possibilities:
- Show where the stop will take the user when a stop is clicked.
- Show timetables of the selected stop.
- Allow the user to write their destination and only show the stops that will take the user there.


## Installation

_You'll need docker installed on your local machine._

1. Register to HSL and get your api key (it's free!): https://digitransit.fi/en/developers/api-registration/
2. Pull the project on your local machine and run `docker-compose build && docker-compose up`
3. Go to your browser and type localhost:5001 on to the address bar.
4. You should see a map and a search bar. Test your heart out!

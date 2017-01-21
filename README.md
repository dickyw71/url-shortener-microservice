# URL Shortener Microservice
## User Stories
* User Story: I can pass a URL as a parameter and I will receive a shortened URL in the JSON response.

* User Story: If I pass an invalid URL that doesn't follow the valid http://www.example.com format, the JSON response will contain an error instead.

* User Story: When I visit that shortened URL, it will redirect me to my original link.


- Pass URL as a parameter to Express Router

- Validate original URL parameter
- create random key value for original URL
- insert key and URL value into MongoDb
- return JSON with original URL and shortened URL 

    { 
    "original_url":"http://foo.com:80", "short_url":"https://little-url.herokuapp.com/8170" 
    }

- Pass shortened URL parameter to Express Router
- Validate shortened URL parameter
- lookup record for shortened URL key in MongoDB
- Re-direct response to original URL

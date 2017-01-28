# URL Shortener Microservice
## User Stories
* User Story: I can pass a URL as a parameter and I will receive a shortened URL in the JSON response.

* User Story: If I pass an invalid URL that doesn't follow the valid http://www.example.com format, the JSON response will contain an error instead.

* User Story: When I visit that shortened URL, it will redirect me to my original link.


- Pass URL as a parameter to Express Router - DONE
- Validate original URL parameter - DONE
- Check is the URL is aready in the DB?
- If found return info from DB in JSON - DONE
- else
    - create random key value for original URL - DONE
    - insert key and URL value into MongoDb - DONE
    - return JSON with original URL and shortened URL - DONE

    { 
    "original_url":"http://foo.com:80", "short_url":"https://little-url.herokuapp.com/8170" 
    }

- Pass shortened URL parameter - DONE
- Validate shortened URL parameter - DONE
- lookup record for shortened URL key in MongoDB - DONE
- Re-direct response to original URL - DONE

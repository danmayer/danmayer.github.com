### Working with swagger and Ruby

swagger helps build api documentation, and clients.

http://developers.helloreverb.com/swagger/

### Pros

* The documentation generated is extremely usable
* automatically builds clients
* Keeping the API spec with the code increases the chances it will stay in sync
* Open source we could contribute and fix any issues we have

### Cons

* Littering code with hard to read 'comments' that is really just injecting another language into the comments of your code seems gross.
* A self describing and following api seems more discoverable.
* While the api doc JSON is human readable it
* Code is littered with long and verbose comments
* Errors while generating documentation or clients are pretty unhelpful.
* Learning curve a bit higher than expected

### Tips

* build it one endpoint and model at a time
* make sure you can test locally as the generate docs, deploy, generate code cycle can be slow
* make only one change at a time between testing both doc and client source code generation
* frequently it is best to view the final JSON output to help diagnose what looks wrong somewhere. [JSONView extension](https://chrome.google.com/webstore/detail/jsonview/chklaanhfefbnpoihckbnefhakgolnmc?hl=en) for chrome is extremely helpful when reading the JSON docs.

### CMDS

install: https://github.com/wordnik/swagger-core
add it to path

look at this example
https://github.com/wordnik/swagger-core/tree/master/samples/ruby-source2swagger

use this gem
https://github.com/solso/source2swagger

follow this example and steal it's rake file task
https://github.com/mstine/sinatra-swagger-example

cp swagger-ui dist folder to public docs

add these routes

run `bundle exec rake swagger` and view /api-docs

hit /docs

alter index.html to default to your docs

update lots of comments... notes on errors, models, return types...

Try to generate a client...

run https://github.com/wordnik/swagger-codegen
`./bin/runscala.sh com.wordnik.swagger.codegen.BasicRubyGenerator http://churn.picoappz.com/api-docs "key"`

### additional reading

* [Swagger Api-docs](https://github.com/wordnik/swagger-core/wiki/Api-Declaration)
* [Swagger parameter docs](https://github.com/wordnik/swagger-core/wiki/parameters)
* [Heroko's JSON schema support for platform API](https://blog.heroku.com/archives/2014/1/8/json_schema_for_heroku_platform_api). Mentions JSON schema support for swagger, but doesn't seem to be fully support swagger format.
* Salesforce Swagger usage:
  * [Start visualizing your Force.com RESTful services.](https://force-com-rest-swagger.herokuapp.com/)
  * [Salesforce swagger api slideshow](http://www.slideshare.net/developerforce/df13-exposing-salesforce-rest-service-using-swagger-1)
  * [Unio](https://github.com/ttezel/unio): one rest client to rule them all. Javascript and Python implementations. Describe a service in JSON, dynamically build a client for it.
  
### Examples

http://churn.picoappz.com/docs/index.html#!/churn

data
http://churn.picoappz.com/api-docs
http://churn.picoappz.com/api-docs/churn

when struggling compare to their examples
http://petstore.swagger.wordnik.com/api/api-docs/pet

### Modifying Swagger-Code-Gen 

If you change the scala files just rerun. If you change the mustache files you must rerun `/sbt assembly` to cache the new template changes. 


### Other Ruby api integrations worth looking at

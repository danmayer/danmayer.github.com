### Evaluating API development tools

I have been evaluating and looking over various API tools lately. In part as I develop more apis myself for personal projects. Mostly because I have learned that all projects these days will have some sort of API backend and multiple front ends: web, mobile apps, native desktop, internal reporting tools, etc, etc. Basically, if you can generate any sort of interesting data eventually people will want it in other formats. Because of this anything that has data I am starting to think about API first. Many other developers are starting to focus more on internal and external apis as well, which is why there is a variety of great tooling popping up related to it.

I had been playing a bit with some API tools such as [Apiary](http://apiary.io/), and [Fdoc](https://github.com/square/fdoc) a bit on my side projects. At work, various discussions about the future of our APIs began to heat up. Adam Keys, Cloves Carneiro, and Tim Schmelmer were leading the charge in having better tooling around our APIs. The discussions lead to some features we wanted to support, which caused me to start to take a much closer look at some of the API tools available.

### Features we wanted

The most common features we wanted after discussing our APIs and some of the tools available.

* Support for multiple languages. (preferably all the ones we use in the company)
* Support for automatically generating client code from an [IDL definition](http://en.wikipedia.org/wiki/Interface_description_language)
* Support for generating service-side generation of API documentation, based on the IDL definition of the APIs
* Support for cURL / browser based service interaction, to analyze requests / responses in a "human-readable" format

There were other things we wanted, but this was the most common and most disired list of features. I will also say that since we are considering this for corporate use, I wanted solutions that would work all self-hosted / behind the firewall. Which makes some of the hosted solutions like [Apiary](http://apiary.io/) less interesting although large parts of their solution is open sourced, like [API Blueprint](http://apiblueprint.org/).

### Api Tooling Options

* [Rocket Pants](https://github.com/Sutto/rocket_pants): opinionated rails api framework.
  * __pros:__
  * Highly integrated into rails and activerecord (AR error support, AR object mapping support. 
)
  * Most standard rails coding style
  * build in support for easy caching
  * Easy Ruby client generation via [ApiSmith](https://github.com/Sutto/api_smith) integration
  * __cons:__
  * Doesn't include pretty documentation generation support
  * Also a pro but heavily tied to rails.
  * Custom format doesn't yet support [JSON Schema](http://json-schema.org/)
  * Client generation is Ruby only
  
* [FDoc](https://github.com/square/fdoc): Documentation format and verification, built by Square
  * __pros:__
  * Works with Rails or Sinatra
  * Integrated testing and verification support
  * Supports [JSON schema](http://json-schema.org/) standard
  * Includes documentation page generation support
  * Company [sponsored support via Square](http://corner.squareup.com/2012/06/fdoc.html)
  * __cons:__
  * The documentation pages leave a lot to be desired. Not interactive, not very skimable.
  * No client generation support
* [Heroics](https://github.com/heroku/heroics): Ruby Client generation from JSON Schema
  * [Generating a Go client](http://www.paasmag.com/2014/01/09/auto-generating-a-go-api-client-for-heroku/)


### Working with swagger and Ruby

swagger helps build api documentation, and clients.

http://developers.helloreverb.com/swagger/

### Pros

* The documentation generated is extremely usable
* automatically builds clients
* Keeping the API spec with the code increases the chances it will stay in sync
* Open source we could contribute and fix any issues we have

### Cons

* Litering code with hard to read 'comments' that is really just injecting another language into the comments of your code seems gross.
* A self describing and following api seems more discoverable.
* While the api doc JSON is human readable it
* Code is littered with long and verbose comments
* Errors while generating documentation or clients are pretty unhelpful.
* Learning curve a bit higher than expected

### Tips

* build it one endpoint and model at a time
* make sure you can test locally as the generate docs, deploy, generate code cycle can be slow
* make only one change at a time between testing both doc and client source code generation
* frequently it is best to view the final JSON output to help diagnons what looks wrong somewhere. JSONView plugin for chrome is extremely helpful when reading the json docs.

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

when struggling compare to thier examples
http://petstore.swagger.wordnik.com/api/api-docs/pet

### Modifying Swagger-Code-Gen 

If you change the scala files just rerun. If you change the mustache files you must rerun `/sbt assembly` to cache the new template changes. 


### Other Ruby api integrations worth looking at

### Evaluating API development tools

I have been evaluating and looking over various API tools lately. In part as I develop more APIs myself for personal projects. Mostly because I have learned that all projects these days will have some sort of API backend and multiple front ends: web, mobile apps, native desktop, internal reporting tools, etc, etc. Basically, if you can generate any sort of interesting data eventually people will want it in other formats. Because of this anything that has data I am starting to think about API first. Many other developers are starting to focus more on internal and external APIs as well, which is why there is a variety of great tooling popping up related to it.

I had been playing a bit with some API tools such as [Apiary](http://apiary.io/), and [Fdoc](https://github.com/square/fdoc) a bit on my side projects. At work, various discussions about the future of our APIs began to heat up. [Adam Keys](http://therealadam.com/), [Cloves Carneiro](https://twitter.com/ccjr), and [Tim Schmelmer](http://www.timschmelmer.com/) were leading the charge in having better tooling around our APIs. The discussions lead to some features we wanted to support, which caused me to start to take a much closer look at some of the API tools available.

### Features we wanted

The most common features we wanted after discussing our APIs and some of the tools available.

* Support for multiple languages. (preferably all the ones we use in the company)
* Support for automatically generating client code from an [IDL definition](http://en.wikipedia.org/wiki/Interface_description_language)
* Support for generating service-side generation of API documentation, based on the IDL definition of the APIs
* Support for cURL / browser based service interaction, to analyze requests / responses in a "human-readable" format

There were other things we wanted, but this was the most common and most desired list of features. I will also say that since we are considering this for use in our day job, I wanted solutions that would work all self-hosted / behind the firewall. Which makes some of the hosted solutions like [Apiary](http://apiary.io/) less interesting although large parts of their solution is open sourced, like [API Blueprint](http://apiblueprint.org/). 

Basically, with the growing number of APIs we wanted something similar to [Google APIs Discovery Service](https://developers.google.com/discovery/). Google's tools are great, but not really an option as they haven't open sourced the document generation, service discovery server, or much language side tooling. What has been open sourced is a [client code generator](https://code.google.com/p/google-apis-client-generator/), which doesn't have as much language support as we would like (Java, Java/GWT, .NET, and PHP). Also, open sourced was the [google-apis-explorer](https://code.google.com/p/google-apis-explorer/) which while cool doesn't quite cover full documentation. Which would work for you if you build out APIs that match their schema, but their supported languages are limited and don't include my primary language Ruby. 

### Why not just standard restful JSON apis

Basically the state of APIs is already like this today. Api response formats and tools are slightly different. The documentation is lacking and inconsistent. Clients sometimes are thin configurations of [rest-client](https://github.com/rest-client/rest-client), and other times large custom client gems with heavy models. Across many APIs this makes the tests, caching, usability, and matching expectations a new challenge with each API.

We want to get more benefits than just moving from various custom presenters and JSON formatters to a consistent usage of a JSON generator, or specific JSON formats. Since most of our APIs are in Ruby there are a number of tools this means we can look beyond.

* [RABL](https://github.com/nesquena/rabl)
* [Jbuilder](https://github.com/rails/jbuilder)

For those that might just be interested in the best way of building custom JSON responses of mapping Ruby objects to JSON, the change log has a good post on [crafting JSON output](http://thechangelog.com/a-few-tools-to-build-a-json-api-in-a-ruby-web-app/), which shows some examples, although it is a little dated.


### Beyond formats and validators

*
* [JSON API](http://jsonapi.org/): A format by [Yehuda Katz](http://twitter.com/wycats) and [Steve Klabnik](http://twitter.com/steveklabnik). The default ember data format 

### Why not Thrift, Protocol Buffers, or Avro

We want a curl / human readable API. We want to be able to easily write a generic client if we need to. That knocks out both Thrift and Protocol Buffers. 

While Avro supports JSON as a format and has better platform support in terms of mobile, 

http://tech.flurry.com/2012/07/12/apache-avro-at-flurry/

it still isn't really human curl-able. maybe example 

    curl  curl -v -H "Accept: application/json" -H "Content-type: application/json" -X POST -d '{"adSpaceName":"splash_screen","location":{"lat":12.231212,"lon":23.3435},}' http://localhost:8080

"Dynamic typing: Avro does not require that code be generated. Data is always accompanied by a schema that permits full processing of that data without code generation, static datatypes, etc. This facilitates construction of generic data-processing systems and languages."
http://avro.apache.org/docs/current/
 
Avro doesn't seem to have great Ruby support http://www.igvita.com/2010/02/16/data-serialization-rpc-with-avro-ruby/


### Api Tooling Options

* [Rails-API](https://github.com/rails-api/rails-api) combined with [ActiveModel::Serializer](https://github.com/rails-api/active_model_serializers)
  * __pros:__
  * Supports a common and stadardized format [JSON API](http://jsonapi.org/)
  * Heavily integrated with Rails
  * Great Javascript client support
  * Enforced good resource / data structure for API
  * Simple model for building dynamic clients
  * __cons:__
  * No built in documentation support
  * Little in the way of tooling: validations, client generators, 
  * Still a work in progress
  
* [Rocket Pants](https://github.com/Sutto/rocket_pants): opinionated rails api framework.
  * __pros:__
  * Highly integrated into rails and activerecord (AR error support, AR object mapping support.)
  * Most standard rails coding style
  * build in support for easy caching
  * Easy Ruby client generation via [ApiSmith](https://github.com/Sutto/api_smith) integration
  * __cons:__
  * Doesn't include pretty documentation generation support
  * Also a pro but heavily tied to rails.
  * Custom format doesn't yet support [JSON Schema](http://json-schema.org/)
  * Client generation is Ruby only
  
* [FDoc](https://github.com/square/fdoc): Documentation format and verification, built by [Square](https://squareup.com/)
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


* [RAML](http://raml.org/): A YAML description language for rest-line JSON apis, built by [Mulesoft](http://www.mulesoft.com/)
* __pros:__
* Very polished tooling & extremely good documentation, seems to have community support via [RAML workgroup](http://raml.org/about.html)
* Sharable [API notebooks](https://api-notebook.anypoint.mulesoft.com/?ref=apihub) to share example usage and scripts, might be an interesting way to share configuring and usage.
* Interactive Documentation
* Nearly all components open sourced
* __cons:__
* Early code gen tools, Ruby not supported
* Documentation of the API lives entirely outside of standard code flows and tools
* While a open format, it is kind of a odd non-standard format

* [interpol](https://github.com/seomoz/interpol)
* __pros:__
* __cons:__

* [Barrister](http://barrister.bitmechanic.com/)
* __pros:__
* __cons:__


* [Swagger](http://developers.helloreverb.com/swagger/): An API stack built by [Reverb](https://helloreverb.com/)
* __pros:__
* Very usable, interactive documenation
* Built on the JSON Schema standard
* Good community support, active [swagger google group](https://groups.google.com/forum/#!forum/swagger-swaggersocket), highly responsive IRC room
* Picked up and in use by several large companies like Salesforce
* All related tools open sourced, with active contributions
* Code generation support in many languages include our primary focuses (Javascript, Ruby, Scala, Andriod, iOS)
* Allows for service discovery for all APIs
* Docs can be written for existing APIs, opposed to having to build new APIs to support the format
* Has integrated server side support for generating the swagger JSON docs
* Server / comment integration means more likely to keep in docs and clients in sync with changes.
* LIVE DEMO
* __cons:__
* Client code generation is mixed quality, good JS and Scala libs, while Ruby isn't so great
* Server code generation is mixed quality, again Scala being a great example with Ruby being OK
* Current Ruby server side implementation likely would require comments in code, as the framework integration seems too immature
* The Ruby code both server and client would likely need heavy contributions
* While encourages good restful behavior, doesn't really enforce any data format standards
* Some of the tools are still in early / active development. Because of this documentation is a bit lacking, errors are difficult to interperate. This leads to a larger learning curve than some other tools

* [ioDocs](https://github.com/mashery/iodocs)
* __pros:__
* __cons:__
* [LIVE DEMO](http://dev.mashery.com/iodocs)

* Pick A data / messaging standard and start to build our own tooling on top of it
* __pros:__
* [Heroko's JSON schema support for platform API](https://blog.heroku.com/archives/2014/1/8/json_schema_for_heroku_platform_api). Mentions JSON schema support for swagger, but doesn't seem to be fully support swagger format.

### Next Steps

Pick a few of the options and implement them for a service or two.




  


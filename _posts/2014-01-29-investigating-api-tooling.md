---
layout: posttail
authors: ["Dan Mayer"]
title: "Investigating Api Developer Tooling"
image: /assets/api_tools.jpg
category: Programming
tags: [Programming, Development, Apis, Tools]
---
{% include JB/setup %}

### Evaluating API development tools

I have been evaluating various API tools lately. In part as I develop more APIs myself for personal projects, as well as the importance they play in the systems I work on professionally. I have learned that all web projects will have some sort of API backend and multiple front ends: web, mobile apps, native desktop, internal reporting tools, etc, etc.

If you can generate any sort of interesting data eventually people will want it in other formats. This has changed how I look at data sources, with data I am starting to think about API first. Many other developers are starting to focus more on internal and external APIs as well, which is why there is a variety of great tooling and competing standards growing related to it.

I had been playing around with some API tools such as [Apiary](http://apiary.io/), and [Fdoc](https://github.com/square/fdoc) on my side projects. At work, various discussions about the future of our APIs has recently become a focus. [Adam Keys](http://therealadam.com/), [Cloves Carneiro](https://twitter.com/ccjr), and [Tim Schmelmer](http://www.timschmelmer.com/) are leading the charge in having better tooling around our APIs. The discussions lead to some features we wanted to support, which caused me to start to take a much closer look at some of the API tools available. I decided to try to take notes as I dug in to research <!--more--> a variety of options.

{% unless page.image %}
![image](/assets/api_tools.jpg)
{% endunless %}  
image courtesy of [marc_smith](http://www.flickr.com/photos/marc_smith/8924975889/)

### Features we wanted

The most common features we wanted after discussing our APIs looking over existing tools.

* Support for multiple languages. (preferably all the ones we use in the company)
* Support for automatically generating client code from an [IDL definition](http://en.wikipedia.org/wiki/Interface_description_language)
* Support for generating service-side generation of API documentation, based on the IDL definition of the APIs
* Support for cURL / browser based service interaction, to analyze requests / responses in a "human-readable" format

Other features were mentioned, but this was the most common and most desired list of features. Since we are considering tools for integration for professional apis, I wanted solutions that would work self-hosted / behind the firewall. Which makes some of the hosted solutions like [Apiary](http://apiary.io/) less interesting although large parts of their solution is open sourced, like [API Blueprint](http://apiblueprint.org/). 

The growing number of APIs we wanted something similar to [Google APIs Discovery Service](https://developers.google.com/discovery/). Google's tools are great, but not really an option as they haven't open sourced the document generation, service discovery server, or much server side language tooling. What has been open sourced is a [client code generator](https://code.google.com/p/google-apis-client-generator/), which doesn't have as much language support as we would like (Java, Java/GWT, .NET, and PHP). Also, open sourced was the [google-apis-explorer](https://code.google.com/p/google-apis-explorer/) which while cool doesn't quite cover full documentation needs. These tools would work for you if you build out APIs that match their schema, but their supported languages are limited and don't include my primary language Ruby.


### Why not just standard restful JSON apis

Because this is the state of most APIs I use today. Without any tooling just building rest-like APIs response formats, tool chains, documentation is slightly different. Often documentation is or not vary accessible. API Client are a mix of thin configurations of [rest-client](https://github.com/rest-client/rest-client) or large custom client gems with heavy models. Across many APIs this makes the tests, caching, usability, and usage expectations a new challenge with each API.

I want to get more benefits than just moving from various custom presenters and JSON formatters to a consistent usage of a JSON serializing tool / specific JSON formats. Since most of the APIs I work with are in Ruby there are a number of tools that solve only that limited set of issues. I am just looking for a bigger win than the various Libraries below provide:

* [RABL](https://github.com/nesquena/rabl)
* [Jbuilder](https://github.com/rails/jbuilder)
* [Acts_as_API](https://github.com/fabrik42/acts_as_api)
* [Roar](https://github.com/apotonick/roar)
* [Grape](https://github.com/intridea/grape) (although admittedly this one starts to get closer, with some of the optional integrations with other gems)
* and more...

For people interested in just having a solid Ruby api with a great format and code to help you build that one of the above options might be a great choice. The change log has a good post on [crafting JSON output](http://thechangelog.com/a-few-tools-to-build-a-json-api-in-a-ruby-web-app/), which shows some examples, although it is a little dated. Also, watch the various [Railscast API videos](http://railscasts.com/episodes?search=api) before you get started, it can help save you from a silly mistake.


### Benefits Beyond JSON Formats

One piece of the puzzle is using standardize JSON formats. Try not to just make up your URIs and data representation yourself, I promise you will regret it. Right now many APIs I use and some I have developed (I know for shame) are hand rolled and the structure of the data isn't ideal. Many apis are fairly loose and inconsistent in terms of how they serialize data. Some JSON format standards could help us improve that, as well as provide validators that could be integrated into the testing process, etc. Others only help in terms of defining where endpoints exist, how endpoints are accessed, and what the responding data looks like. While these are interesting, they are more interesting when paired with tooling based on these standards. Most of the tools mention in my list utilize one of these formats and some could support multiple formats in conjunction which seems promising.

* [JSON API](http://jsonapi.org/)
  * A format by [Yehuda Katz](http://twitter.com/wycats) and [Steve Klabnik](http://twitter.com/steveklabnik).
  * The default ember data format.
  * The format restricts how you represent your JSON data, but to a list of tried and true best practices for representing your objects.
  * Example implementations exist for Ruby and other languages.
* [JSON-RPC](http://www.jsonrpc.org/specification)
  * A JSON standard with a highly supported version 2.0 spec.
  * Defines rules for making [JSON remote procedure calls](http://en.wikipedia.org/wiki/JSON-RPC), has client support in many languages.
  * Defines good input, client, and error behavior.
  * Doesn't define or enforce good JSON data serialization of your objects. Allows for any format.
* [JSON Schema](http://json-schema.org/)
  * A format to describe APIs in JSON.
  * The basis of a [growing list of tools](http://json-schema.org/implementations.html), including some on this list like swagger.
  * While this format describes how your JSON api data is represented. It doesn't enforce any good data serialization habits, allows for any format.
* [Apache Avro JSON](http://avro.apache.org/docs/1.7.5/spec.html#json_encoding)
  * While Avro has a whole set of tooling one can choose to just support its format
  * The format helps define and enforce good data serialization habits.
  * Good language and platform support.
  * Useful beyond APIs Hadoop and log processors, could utilize object and message serialization. Which would improve some issues we have seen with pure JSON.


### Why not Thrift, Protocol Buffers

The largest reason is in the end I want human readable APIs. I want to be able to debug and test with standard curl commands. We want to be able to use simple Ajax calls without additional tooling. The benefits of Thrift and Protocol Buffers seem to not be large enough to force our stack to always use non standard tooling and limit our choices in terms of integrating other options. Finally the support for these formats isn't quite as strong as we would like in terms of native mobile support. The only one of the data serialization and RPC systems that seems to not have as many limitations is Apache Avro, which will be covered in more data in the comparison list.


### Api Tooling Options

##### Tools with offerings most similar to Google APIs Discovery Service

* [ioDocs](https://github.com/mashery/iodocs): Host or Self Serve API docs, built and supported by [Mashery](http://www.mashery.com)
  * __pros:__
  * Large community support and great documentation
  * Very nice interactive documentation, [documentation live demo](http://dev.mashery.com/iodocs)
  * Open source support for the [Google Discovery Document Format](https://developers.google.com/discovery/v1/reference#resource_discovery)
  * Built on the JSON Schema standard
  * Allows for service discovery for all APIs
  * Could be used with a JSON format, adding format validation to the tool chain for future APIs would be easy
  * Supports various authentication mechanisms
  * Many example integrations
  * __cons:__
  * No server code or comment integration, so the JSON docs need to be maintained and kept in sync by hand
  * Client code generation has limited support and doesn't Ruby or Scala
  * Less tooling available than other options
  * While trying to be a open source implementation of Google's Discovery Service it is missing pieces and will always be behind it since it relies on it's tooling some places  

* [Swagger](http://developers.helloreverb.com/swagger/): An API stack built by [Reverb](https://helloreverb.com/)
  * __pros:__
  * Very usable, interactive documentation, [Live Demo](http://swagger.wordnik.com/#!/pet/) of the interactive docs
  * Built on the JSON Schema standard
  * Good community support, active [swagger google group](https://groups.google.com/forum/#!forum/swagger-swaggersocket), highly responsive IRC room
  * Picked up and in use by several large companies like Salesforce
  * All related tools open sourced, with active contributions
  * Stub server support
  * Code generation support in many languages include our primary focuses (Javascript, Ruby, Scala, Andriod, iOS)
  * Docs can be written for existing APIs, opposed to having to build new APIs to support the format
  * Has integrated server side support for generating the swagger JSON docs
  * Integrated Server code (or annotated comments) more likely to keep in docs and clients in sync with changes
  * Allows for service discovery for all APIs
  * Could be used with a JSON format, adding format validation to the tool chain for future APIs would be easy
  * Supports various authentication mechanisms
  * __cons:__
  * Client code generation is mixed quality, good JS and Scala libs, while Ruby isn't so great
  * Server code generation is mixed quality, again Scala being a great example with Ruby being OK
  * Current Ruby server side implementation likely would require comments in code, as the framework integration seems too immature
  * The Ruby code both server and client would likely need heavy contributions
  * While encourages good restful behavior, doesn't really enforce any data format standards
  * Some of the tools are still in early / active development. Because of this documentation is a bit lacking, errors are difficult to interperate. This leads to a larger learning curve than some other tools  


* [RAML](http://raml.org/): A YAML description language for rest-line JSON apis, built by [Mulesoft](http://www.mulesoft.com/)
  * __pros:__
  * Very polished tooling & extremely good documentation, seems to have community support via [RAML workgroup](http://raml.org/about.html)
  * Sharable [API notebooks](https://api-notebook.anypoint.mulesoft.com/?ref=apihub) to share example usage and scripts, might be an interesting way to share configuring and usage.
  * Interactive Documentation, [Live Documentation Demo](http://api-portal.anypoint.mulesoft.com/twitter/api/twitter-rest-api/docs/raml)
  * Nearly all components open sourced
  * Many example integrations
  * Stub Server support
  * __cons:__
  * Early code generation tools, not yet stable. Ruby not supported
  * Documentation of the API lives entirely outside of standard code flows and tools
  * While a open format, it is kind of a odd non-standard format

##### Highly Integrated with Ruby

* [Rails-API](https://github.com/rails-api/rails-api) combined with [ActiveModel::Serializer](https://github.com/rails-api/active_model_serializers)
  * __pros:__
  * Supports a common and standardized format [JSON API](http://jsonapi.org/)
  * Heavily integrated with Rails
  * Great Javascript client support
  * Enforced good data structure for API
  * Simple model for building dynamic clients
  * __cons:__
  * No built in documentation support
  * Little in the way of tooling: validations, client generators, or other tools
  * Still a work in progress

* [Rocket Pants](https://github.com/Sutto/rocket_pants): opinionated rails api framework
  * __pros:__
  * Highly integrated into rails and ActiveRecord (AR error support, AR object mapping support.)
  * Most standard rails coding style
  * build in support for easy caching
  * Easy Ruby client generation via [ApiSmith](https://github.com/Sutto/api_smith) integration
  * Consistent and enforced good data structure for data serialization
  * __cons:__
  * Doesn't include pretty documentation generation support
  * Also a pro, but heavily tied to rails and no other language support
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
  * The documentation pages leave a lot to be desired. Not interactive, not very skimable. Very bare bones
  * No client generation support
  * Limited non Ruby language support
  * The doc files are kept in separate files, no server code or comments integration
  
* [Interpol](https://github.com/seomoz/interpol): A toolkit for working with API endpoint definition files, built by [Seomoz](http://moz.com/)
  * __pros:__
  * Integrated Ruby testing tools to validate endpoints
  * Stub server support
  * Development tools to ensure API endpoint responses match current schema, keep things in sync
  * Documentation generation support
  * Request parsing validation libraries
  * Supports JSON Schema
  * Would allow support of existing APIs
  * __cons:__
  * Definition not integrated via code or comments, but kept as a separate YAML file
  * The documentation pages are pretty bare bones, not interactive
  * No client generation support
  * While you define how data is serialized it doesn't enforce any good serialization habits
  * Ruby only for server side integrations

##### Other Options

* [Apache Avro](http://avro.apache.org/docs/1.7.5/index.html)
  * __pros:__
  * Better native support than Thrift or Protocol Buffers, see why [Flurry chose Avro](http://tech.flurry.com/2012/07/12/apache-avro-at-flurry/)
  * While supporting a pure JSON format they have a faster binary format as well
  * Good platform and language support
  * "Simple integration with dynamic languages. Code generation is not required to read or write data files nor to use or implement RPC protocols. Code generation as an optional optimization, only worth implementing for statically typed languages."
  * Advantages in integration with Hadoop and log processing
  * __cons:__
  * while sort of human readable it can be a bit more difficult
  * while sort of curl-able, writing valid curl calls can be a bit more difficult `curl  curl -v -H "Accept: application/json" -H "Content-type: application/json" -X POST -d '{"adSpaceName":"splash_screen","location":{"lat":12.231212,"lon":23.3435},}' http://localhost:8080`
  * [Avro Ruby code needs some love](http://www.igvita.com/2010/02/16/data-serialization-rpc-with-avro-ruby/) and performance improvements 
  * No built in documentation generators
  * A bit heavy weight with a higher learning curve than others
  * No way to support old existing APIs could only move over as part of upgrades

* [Barrister](http://barrister.bitmechanic.com/)
  * __pros:__
  * built on the JSON-RPC 2.0 standard
  * Integrated Ruby server and client side support
  * Generates static documentation pages, based on nice Docco standard. [Small Example Doc](http://barrister.bitmechanic.com/calc.html).
  * Fairly bare bones clients
  * Extremely simple learning curve, could get up and running quickly
  * Could work with existing APIs
  * Server integration likely doesn't support our needs
  * IDL generated as a separate file, no tight server code or comments integration
  * Supports multiple languages
  * __cons:__
  * Doesn't enforce good data serialization or URI practices
  * Scala support not listed yet
  * Smaller more limited tools than most
  * Seems to have smaller community support
  * Likely would need to hand roll some supporting tooling for both clients and servers

* __Roll Your Own__
  * __pros:__
  * Complete control over all pieces and stages of the tool chain 
  * [Heroko's JSON schema support for platform API](https://blog.heroku.com/archives/2014/1/8/json_schema_for_heroku_platform_api). Heroku did it! They support standard formats but rolled their own versions of document and client code generators. Seems very close to Swagger format and mentions Swagger standard, but doesn't seem fully compatible and they went their own way for some of their tooling
    * [Heroics](https://github.com/heroku/heroics): Heroku's Ruby client generation from JSON Schema
    * [Generating a Go client](http://www.paasmag.com/2014/01/09/auto-generating-a-go-api-client-for-heroku/) a tutorial building a Go client
  * Leverage tools released from other companies efforts  
  * We can really mix and match some of the formats and tools mentioned above trying to get the best of everything
    * For instance one can choose to use JSON-api (or Avro JSON) format with nearly any of the documentation / verification tools
    * We could take a system like FDoc or Barrister and add tooling to extend it to generate more robust swagger or ioDocs output
  * __cons:__
  * Higher learning curve
  * Higher maintenance costs
  * Could make a bad call, all the other projects would have more community involvement
  * May be harder to support existing APIs
  * Likely overall looser integration than working with a fully integrated stack
  * There are pretty big projects so it might be a large undertaking, depending on features you want to support

### Next Steps Towards Better APIs

It is great that there are so many good options being built to improve tooling around developing APIs. Obviously, there are so many options it isn't really clear what the best option is. The next step seem to be to pick out and implement a couple of the options to explore them in more detail. Either trying a different option for a couple different services or implementing several of the options on the same API to see which seems like the best fit. 


In fact I have already started to do this with Swagger, which is why it has a more detail describing it than several of the other options. One nice thing about researching all of these options and implementing one of them, has been learning how bad many of my APIs are. Seriously, trying to layer tooling like this on top of an awkward API and data response objects makes it abundantly clear that a poor planning was involved. It immediately makes the serializations used for the models seem awkward and overly verbose and the URI endpoints poorly chosen. Going through the exercise should improve your APIs. Building a new API with any of the tools or libraries above would likely result in a better API because it would force you to really think about the contract the API is describing when it is being implemented.

I will follow up with more specifics on some example implementations of some of the options above. So stay tuned and see you next time.

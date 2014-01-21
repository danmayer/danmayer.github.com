### Working with swagger and Ruby

swagger helps build api documentation, and clients.

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


### Examples

http://churn.picoappz.com/docs/index.html#!/churn

data
http://churn.picoappz.com/api-docs
http://churn.picoappz.com/api-docs/churn
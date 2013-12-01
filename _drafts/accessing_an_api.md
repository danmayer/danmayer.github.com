---
layout: post
title: "Accesing an API"
category: Programming
tags: [Programming, Development, APIs]
---
{% include JB/setup %}

Accessing data via an api is a simple concept that developers do every day. While it is a easy task, the complexity caused by the uncertainty of an api can quickly show how complicated and difficult programming can become. Through a series of examples I am trying to explore some of the issues developers face when pulling data over a web-api, and exploring some of the common patterns and solutions that people arrive at.

For my examples. I will be using a fake JSON api hosted on [apiary.io](http://apiary.io), and accessing it with Ruby's [rest-client](https://github.com/rest-client/rest-client) gem. The endpoint, data, and language are really irrelavant. The fake API used in the examples is documented by [Apiary.io Cars API](http://docs.danmayer.apiary.io).

## Simple Example

Accessing an api is simple right! Let's start with an easy example:

	require 'rest-client'
	require 'json'
	
	class Car
	  API_ROOT = 'https://danmayer.apiary.io'
	  
	  def self.get(id)
	    results = RestClient.get("#{API_ROOT}/cars/#{id}")
	    JSON.parse(results)
	  end
	end
	
	car = Car.get(2)
	puts car.inspect #{"id"=>2, "title"=>"Subaru Outback", "updated_at"=>"2013-12-01T19:00:38Z"}

This is a basic api request, but it handles none of the common edge cases

* caching
* timeouts
* network failures
* upstream api failure
* developer / client usage error (ex `Car.get("car-2")`)
* api changing without notice, or unexpected responses

## Evolved Example

Frequently code organically evolves to solve the above issues, eventually looking something like the example below.

	require 'rest-client'
	require 'json'
	require 'logger'
	LOG = Logger.new(STDOUT)  
	
	require 'dalli'
	# normally we would just use Rails.cache
	# but we will implement basic caching to keep the code more accessible
	CACHE = Dalli::Client.new 
	module Cacheable
	  def cache(cache_key)
	    value = CACHE.get(cache_key)
	    return value if value
	    value = yield
	    CACHE.set(cache_key, value)
	    value
	  end
	end
	
	class Car
	  extend Cacheable
	
	  API_ROOT = 'https://danmayer.apiary.io'
	  
	  def self.get(id)
	    raise ArgumentError "expects a number" unless id.is_a?(Fixnum)
	    begin
	      url = "#{API_ROOT}/cars/#{id}"
	      results = cache("cars_#{id}") do
	        RestClient::Request.execute(:method => :get, :url => url, :timeout => 3, :open_timeout => 3)
	      end
	      JSON.parse(results)
	    rescue StandardError => error #check restclient errors
	      LOG.error "exception occured while retreiving car data: #{error.class.name}:#{error}"
	    end
	  end
	
	end
	
	car = Car.get(2)
	puts car.inspect #{"id"=>2, "title"=>"Subaru Outback", "updated_at"=>"2013-12-01T19:00:38Z"}
	
	#Timeout case
	car = Car.get(2)
	#E, [2013-12-01T15:16:57.292096 #68023] ERROR -- : exception occured while retreiving car data: RestClient::RequestTimeout:Request Timeout
	
	car = Car.get('car-2')
	#26:in `get': undefined method `ArgumentError' for Car:Class (NoMethodError)

	
Even when covering edge cases what is the full failure recovery?

* Can the system stay up with out this api
* what fallback can we provide
* is stale data OK, or must it be realtime
* Do we need to alter the UI or flow for the user
* Should all failures be considered exceptional or just temporary blips
* If we handle the exceptions how do we report on it.

At this point more complex logic may evolve	
	class Car
	  	API_ROOT = 'https://some-endpoint.com/'
	
	  def self.get(id)
		raise ArgumentError "expects a number" unless id.is_a?(Fixnum)
		results = cache("cars_#{id}") do
	      RestClient.get("#{API_ROOT}api/cars/#{id}", :timeout => 4)
	    end
	    JSON.parse(results)
	  rescue StandardError => error #check restclient errors
	  	log.error "some exception occured while retreiving car data: #{error}"
	  end
	end

	car = Car.get(22)
	
# Api Call Inception

At some point as abstractions and improvements are added you might run into a problem that you you wish to solve with another API call. At that moment you have reached API call Inception, where there are api calls in your api calls. It might sound rediculous, but lets say you are trying to allow a cache key to be broken across distributed systems that all use a shared object. In our example a car. In standard Rails world you could rely on [ActiveRecordModel#cache_key](https://github.com/rails/rails/blob/04cda1848cb847c2bdad0bfc12160dc8d5547775/activerecord/lib/active_record/integration.rb#L48), but that breaks down across multiple systems.


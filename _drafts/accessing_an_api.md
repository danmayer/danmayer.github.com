---
layout: post
title: "Accesing an API"
category: Programming
tags: [Programming, Development, APIs]
---
{% include JB/setup %}

Accessing data via an api is a simple concept that developers do every day. While it is a easy task, the complexity caused by the uncertainty of an api can quickly show how complicated and difficult programming can become. Through a series of examples I am trying to explore some of the issues developers face when pulling data over a web-api, and exploring some of the common patterns and solutions that people arrive at.

## Simple

Accessing an api is simple right! Let's start with an easy example:

	class Car
	  API_ROOT = 'https://some-endpoint.com/'
	
	  def self.get(id)
	    results = RestClient.get("#{API_ROOT}api/cars/#{id}")
	    JSON.parse(results)
	  end
	end

	car = Car.get(22)

This is a basic backend api request, but it basically covers none of the corner cases

* caching
* timeouts
* network failures
* upstream api failure
* developer / client usage error (ex `Car.get("car-22")`)
* Api changing without notice, or unexpected responses

Frequently code organically evolves to solve issues like this

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


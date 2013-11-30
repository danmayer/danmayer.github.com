---
layout: post
title: "Accesing and API"
category: Programming
tags: [Programming, Development, APIs]
---
{% include JB/setup %}

## Simple

Accessing an api is simple right something like

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
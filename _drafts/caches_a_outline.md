
### Rails Caches

DHH covers caching around 45m in
https://www.youtube.com/watch?v=iqXjGiQ_D-A&t=2808s

https://guides.rubyonrails.org/caching_with_rails.html

# The Rails Cach Code Path

## Cache Initialization

## Cache Pools

## Rails Local Cache

## Cache Runtime

# Cache Metrics

When possible these are the metrics I think would be super valuable...

* cache.hit
  * key
  * online / offline
* cache.miss
  * key
  * online / offline
* cache.set
  * key
  * online / offline

### Memcached

[Scaling Memcached at FB](https://scontent.fhnl3-1.fna.fbcdn.net/v/t39.8562-6/240873052_277412237132971_6278324660880331641_n.pdf?_nc_cat=101&ccb=1-7&_nc_sid=e280be&_nc_ohc=EnYD1WxWJCIAX-wtiU5&_nc_ht=scontent.fhnl3-1.fna&oh=00_AfC2PIneoOWxvy9_G63OF2Qe9VwPhLmKthIvB8krG60ZWg&oe=65531482)

> We describe how we improved the open source version of memcached and used it as a building block to construct a distributed key-value store for the largest social network in the world. We discuss our journey scaling from a single cluster of servers to multiple geographically distributed clusters. To the best of our knowledge,
this system is the largest memcached installation in the world, processing over a billion requests per second and storing trillions of items.

### CDNs

> For example, at Facebook, CDN caches serve 70% of web requests, reducing latency by an order of magnitude. 

> Shopify provides merchants a world class content delivery network (CDN) backed by Cloudflare. Using a CDN means that your online store will load quickly around the globe.

### CacheLib

* [A slide Deck](https://www.pdl.cmu.edu/PDL-FTP/slides/2020/osdi20_slides_berg.pdf)


# Content Delivery Network (CDN) 

A Content Delivery Network can help serve high traffic or high performance websites as well as offer a number of features.

> A content delivery network, or content distribution network (CDN), is a geographically distributed network of proxy servers and their data centers. The goal is to provide high availability and performance by distributing the service spatially relative to end users. CDNs came into existence in the late 1990s as a means for alleviating the performance bottlenecks of the Internet[1][2] as the Internet was starting to become a mission-critical medium for people and enterprises. Since then, CDNs have grown to serve a large portion of the Internet content today...
-- wikipedia

## Minimum of what you want your CDN to be doing for you

* Smart routing: last-mile network distribution
* Speedy established TLS: speed up your TLS handshakes
* DDOS Protection: Cached pages are kind of already protected but many CDNs offer DDOS protection (you can also do this at your load balancer layer)
* Serving assets: handling serving assets to avoid having static file load hit dynamic servers
* Caching: at least assets, but even better for HTML / API content
* Compression: gzip and brotli

# CDN Setups

Often you might want different configurations and settings for different purposes and uses of CDNs. For example, it is fairly common to have an asset CDN with long-lived caches for assets, while you might want applications to be able to specify find grained caching headers for HTML and API content.

[![](https://mermaid.ink/img/pako:eNqFkE1vgzAMhv-K5XM_DrtxmESgt62qxE4j1RQFq6ASgkwihID_vqC0U2_zya_92H7lGbWtCBO8sepr-MplByG-S8F2HIivDw37_Tuk5TiOh8l6_tH2oK2BLD9ft9ai-uZYO9MuIOb0Q6yyi4Pi0e3bCdh613Q3YN_SsEA2n7IC0ssF0vVfOP-DxQrP5dHVuVTDQG54NXZ8ddZDBBb4nIs3SDcBwus7uXAYd2iIjWqq8IV5WyzR1WRIYhLSSvFdouzWwPm-Uo5OVeMsY-LY0w6Vd7aYOv3UkckbFR5qYnH9BTT0dXI)](https://mermaid.live/edit/#pako:eNqFkE1vgzAMhv-K5XM_DrtxmESgt62qxE4j1RQFq6ASgkwihID_vqC0U2_zya_92H7lGbWtCBO8sepr-MplByG-S8F2HIivDw37_Tuk5TiOh8l6_tH2oK2BLD9ft9ai-uZYO9MuIOb0Q6yyi4Pi0e3bCdh613Q3YN_SsEA2n7IC0ssF0vVfOP-DxQrP5dHVuVTDQG54NXZ8ddZDBBb4nIs3SDcBwus7uXAYd2iIjWqq8IV5WyzR1WRIYhLSSvFdouzWwPm-Uo5OVeMsY-LY0w6Vd7aYOv3UkckbFR5qYnH9BTT0dXI)

# Why You Should have A CDN

It can help even if you aren't quite ready to fully leverage it. CDNs have a lot of hidden advantages, and with some early setup can be very quickly utilized to handle insane amounts of traffic. Handling loads of largest advertising campaigns for the initial experience even if all those new signups have to be pushed into a queue to handle when you can. As this tweet points out even after folks think of all the obvious reasons to have CDNs, there are often many other clever ways to use CDNs.

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">There are a bunch of benefits to putting a CDN on top of your web application, such as reduced TTFB, caching, and DDoS protection. But there&#39;s also a huge benefit that people don&#39;t talk about: No user-side DNS caching. You can switch origins within minutes, not days/weeks/months.</p>&mdash; Jack Ellis (@JackEllis) <a href="https://twitter.com/JackEllis/status/1510680148336541698?ref_src=twsrc%5Etfw">April 3, 2022</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

## A Start Up Story 

My first startup got a viral link taking it down and by the time we got page caching on our rails server a few hours had passed and we lost the bump... For this first bit of traction, a CDN could have made all the difference. The content would have been easy to protect with the single viral page behind the CDN and appropriate content headers. That startup never succeeded, but early on much time was wasted trying to improve app layer caching and performance where a CDN could have been a big help.

# CDN Gotchas

While CDNs are great, nothing is free and every abstraction adds some complexity to your system. Understanding the values it can provide and also understanding some of the gotchas cna help your team decide if it is the right decision for the system.

* Accidentally caching private pages/data!
* caches including things like a set cookie (sessions, return_to, etc) that should be user-specific
* CSRF, many traditional protections like the built-in Rails CSRF don't work well with cached pages
* difficulties with various security implementations like [content-security-policy `nonce`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/nonce) implementations
* Having different rules for cache keys and what information is sent to the origin
* you may only cache on specific cookies and headers...but you might want your origin to receive all headers to help with debugging or other info, this is an additional mental load when understanding a request-response cycle.

## Understand the reliability risk and how to mitigate it

I have written previously about [request depth and availabiltiy](/sre/2022/01/18/micro-service-request-depth). A CDN is an additional layer in the request depth of your application stack... It also only has a [99.9% AWS SLA](https://aws.amazon.com/cloudfront/sla/), as the entry point to your systems which means that is the upper limit on your overall SLA pretending for a moment everything else was 100% reliable. Now, AWS and most CDNs actually have far better real-world uptime and success rates during normal operations, but all of the major CDNs have had notable major outages. Including [Cloudfront having a major outage the day before thanksgiving](https://www.channelfutures.com/cloud-2/amazon-cloudfront-dns-service-suffers-pre-thanksgiving-outage). There are a few protective measures one can take a team really needs to ensure higher availability of their site, neither suggestion is cheap.

 * A team can implement and support [High Availability Origin Failover](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/high_availability_origin_failover.html) as a protective layer within Cloudfront, to protect against origin level failures.
 * A team can implement [multi-CDN DNS failover](https://constellix.com/news/100-uptime-and-fool-proof-dns-with-failover) This can be done in an automated or manual fashion depending on complexity and cost concerns.

# CDNs vs Load Balancers

These days CDNs can do a lot of what load balancers do, by routing different types of requests to different back-end "origin" servers. Geo target routing to support locale and nearest reach servers... While this overlaps with load balancers, I generally end up with a configuration where I have both a CDN and load balancers in place. My setup looks often looks like so: `web browser -> CDN -> ALB -> Application Servers`.

* [What is load balancing? How does a CDN load balance traffic?](https://www.cloudflare.com/learning/cdn/cdn-load-balance-reliability/#:~:text=Software%2Dbased%20load%20balancing%20services,using%20physical%20load%2Dbalancing%20hardware.)
* [CDNs vs. Load Balancers: Which One Should You Pick?](https://www.resonatenetworks.com/2020/06/27/cdns-vs-load-balancers-which-one-should-you-pick/)

# CDNs Enhancing Request Payloads

As part of the ability to route different requests, CDNs now often handle basic IP Address Geolocation, allowing one to route requests from different countries, language support, city, postal code, or more to different origins. Even if your application doesn't use different origins, the Geolocation information is often extremely useful. You can avoid additional network calls or 3rd party integrations to leverage the CDN's built-in geolocation support. For example, [AWS Cloudfront can provide Geolocation](https://aws.amazon.com/about-aws/whats-new/2020/07/cloudfront-geolocation-headers/) info on all requests to the CDN to impact caching logic as well as header hints to your application servers. For example, it is helpful to use this data to detect if a user might be accessing your site on the wrong domain given the country they are in. Example additional header data.

```
CloudFront-Viewer-Country-Name: United States
CloudFront-Viewer-Country-Region: MI
CloudFront-Viewer-Country-Region-Name: Michigan
CloudFront-Viewer-City: Ann Arbor
CloudFront-Viewer-Postal-Code: 48105
CloudFront-Viewer-Time-Zone: America/Detroit
CloudFront-Viewer-Latitude: 42.30680
CloudFront-Viewer-Longitude: -83.70590
CloudFront-Viewer-Metro-Code: 505
```

**Note:** inside a Ruby app, Rails/Rack will format the headers adding in `HTTP` and upcasing, so you could access this data in a typical Rails app like so `request.headers["HTTP_CLOUDFRONT_VIEWER_CITY"]`. 


# CDNs Are Evolving

This post covers more traditional CDNs and features common consumer-facing sites should consider leveraging. CDNs are now moving into the realm of cloud infrastructure with [Lambda@Edge](https://aws.amazon.com/lambda/edge/) and other CDNs allowing code (most commonly Javascript) to be deployed to the CDN network. The features and options supported when looking at having fully supported runtime code at the edge opens up new architecture and application stack options. I am looking at FAAS and edge deployed code, but haven't leveraged it in any significant production environment yet. It is definitely a space to keep an eye on that promises to simplify global app distribution while maintaining extremely performant consumer experiences.

# Additional CDN Links

* [Optimize Rails App Performance With Rails + Amazon CloudFront](https://medium.com/@tranduchanh.ms/optimize-rails-app-performance-with-rails-amazon-cloudfront-e3b305f1e86c)
* [CDNs aren't just for caching](https://jvns.ca/blog/2016/04/29/cdns-arent-just-for-caching/)
* [CDN comic](https://wizardzines.com/comics/cdn/)
* [Understanding HTTP/S, CDNs and Edge Proxies](https://www.thecloudcast.net/2019/10/understanding-https-cdns-and-edge.html)
* [Optimizing high availability with CloudFront origin failover](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/high_availability_origin_failover.html)
* [Cloudfront SLA](https://aws.amazon.com/cloudfront/sla/) - 99.9%
* [Cloudfront 2 hour outage](https://www.channelfutures.com/cloud-2/amazon-cloudfront-dns-service-suffers-pre-thanksgiving-outage)
* [When a CDN goes down](https://www.theguardian.com/technology/2021/jun/08/edge-cloud-error-tuesday-internet-outage-fastly-speed)
    * The best defense for this is DNS fallback routing around the CDN... If you configure a failover routing policy. For example on AWS, Route53 would check the health of your Cloudfront distribution and if it's not healthy then the traffic would failover directly to your load balancer.

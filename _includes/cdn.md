# Content Delivery Network (CDN) 

A Content Delivery Network can help serve high traffic or high performance websites as well as offer a number of features.

> A content delivery network, or content distribution network (CDN), is a geographically distributed network of proxy servers and their data centers. The goal is to provide high availability and performance by distributing the service spatially relative to end users. CDNs came into existence in the late 1990s as a means for alleviating the performance bottlenecks of the Internet[1][2] as the Internet was starting to become a mission-critical medium for people and enterprises. Since then, CDNs have grown to serve a large portion of the Internet content today...
-- wikipedia

## Minimum of what you want your CDN to be doing for you

* smart routing: last mile network distribution
* speedy established TLS: speed up your TLS handshakes
* DDOS Protection: Cached pages are kind of already protected but many CDNs offer DDOS protection (you can also do this at your load balancer layer)
* serving assets: handling serving assets avoid having static file load hit dynamic servers
* caching: at least assets, but even better for HTML / API content
* compression: gzip and brotli

# CDN Setups

Often you might want different configurations and settings for different purposes and uses of CDNs. For example, it is fairly common to have an asset CDN with long lived caches for assets, while you might want applications to be able to specify find grained caching headers for html and API content.

[![](https://mermaid.ink/img/pako:eNqFkE1vgzAMhv-K5XM_DrtxmESgt62qxE4j1RQFq6ASgkwihID_vqC0U2_zya_92H7lGbWtCBO8sepr-MplByG-S8F2HIivDw37_Tuk5TiOh8l6_tH2oK2BLD9ft9ai-uZYO9MuIOb0Q6yyi4Pi0e3bCdh613Q3YN_SsEA2n7IC0ssF0vVfOP-DxQrP5dHVuVTDQG54NXZ8ddZDBBb4nIs3SDcBwus7uXAYd2iIjWqq8IV5WyzR1WRIYhLSSvFdouzWwPm-Uo5OVeMsY-LY0w6Vd7aYOv3UkckbFR5qYnH9BTT0dXI)](https://mermaid.live/edit/#pako:eNqFkE1vgzAMhv-K5XM_DrtxmESgt62qxE4j1RQFq6ASgkwihID_vqC0U2_zya_92H7lGbWtCBO8sepr-MplByG-S8F2HIivDw37_Tuk5TiOh8l6_tH2oK2BLD9ft9ai-uZYO9MuIOb0Q6yyi4Pi0e3bCdh613Q3YN_SsEA2n7IC0ssF0vVfOP-DxQrP5dHVuVTDQG54NXZ8ddZDBBb4nIs3SDcBwus7uXAYd2iIjWqq8IV5WyzR1WRIYhLSSvFdouzWwPm-Uo5OVeMsY-LY0w6Vd7aYOv3UkckbFR5qYnH9BTT0dXI)

# Why you should have a CDN

It can help even if you aren't quite ready to fully leverage it

## A story 

Our first startup got a viral link taking it down and by the time we got page caching on our rails server a few hours had passed and we lost the bump... The content would have been easy to protect the single viral page behind the CDN with content headers

# Understand the reliability risk and how to mitigate it

99.9 * 99.9

# CDN Gotchas

* accidentally caching private pages!!!
* caches including things like set cookie that should be user specific
* CSRF, many traditional protections like the built in Rails CSRF don't work well with cached pages
* difficulties with various security implementations like [content-security-policy `nonce`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/nonce) implementations
* having different rules for cache keys and what information is sent to origin
	* you may only cache on specific cookies and headers...but you might want your origin to receive all headers to help with debugging or other info

# CDNs vs Load Balancers

These days CDNs can do a lot of what load balancers do, by routing different types of requests to different back end "origin" servers. While this overlaps with load balancers, I generally end up with a configuration where I have both a CDN and load balancers in place. My setup looks often looks like so: `web browser -> CDN -> ALB`.

* [What is load balancing? How does a CDN load balance traffic?](https://www.cloudflare.com/learning/cdn/cdn-load-balance-reliability/#:~:text=Software%2Dbased%20load%20balancing%20services,using%20physical%20load%2Dbalancing%20hardware.)
* [CDNs vs. Load Balancers: Which One Should You Pick?](https://www.resonatenetworks.com/2020/06/27/cdns-vs-load-balancers-which-one-should-you-pick/)

# CDNs enhancing request Payloads

As part of the ability to route different requests, CDNs now often handle basic IP Address Geolocation, allowing one to route requests from different countries, language support, city, postal code, or more to different origins. Even if your application doesn't use different origins, the Geolocation information is often extremely useful. You can avoid additional network calls or 3rd party integrations to leverage the CDN's built in geolocation support. For example, [AWS Cloudfront can provide Geolocation](https://aws.amazon.com/about-aws/whats-new/2020/07/cloudfront-geolocation-headers/) info on all requests to the CDN to impact caching logic as well as header hints to your application servers. For example, it is helpful to use this data to detect if a user might be accessing your site on the wrong domain given the country they are in. Example additional header data.

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

**Note:** inside a Ruby app, Rails/Rack will format the headers adding in `HTTP` and upcasing, so you could access this data in a typical Rails app like so `request.headers["HTTP_CLOUDFRONT_VIEWER_POSTAL_CODE"]`. 


# CDNs Are Evolving

This post covers more traditional CDNs and features common consumer facing sites should consider leveraging. CDNs are now moving into the realm of cloud infrastructure with [Lambda@Edge](https://aws.amazon.com/lambda/edge/) and other CDNs allowing code (most commonly Javascript) to be deployed to the CDN network. The features and options supported when looking at having fully supported runtime code at the edge opens new architecture and application stack options. I am looking at FAAS and edge deployed code, but haven't leveraged it in any significant production environment yet. It is definitely a space to keep an eye on that promises to simplify global app distribution while maintaining extremely performant consumer experiences.

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

# CDN (content delivery network)

> A content delivery network, or content distribution network (CDN), is a geographically distributed network of proxy servers and their data centers. The goal is to provide high availability and performance by distributing the service spatially relative to end users. CDNs came into existence in the late 1990s as a means for alleviating the performance bottlenecks of the Internet[1][2] as the Internet was starting to become a mission-critical medium for people and enterprises. Since then, CDNs have grown to serve a large portion of the Internet content today...
-- wikipedia

## Minimum of what you want your CDN to be doing for you

* smart routing: last mile network distribution
* speedy established TLS: speed up your TLS handshakes
* DDOS Protection: Cached pages are kind of already protected but many CDNs offer DDOS protection (you can also do this at your load balancer layer)
* serving assets: handling serving assets aovid having static file load hit dynamic servers
* caching: at least assets, but even better for HTML / API content
* compression: gzip and brotli

# CDN Setups

Often you might want different configurations and settings for different purposes and uses of CDNs. For example, it is fairly common to have an asset CDN with long lived caches for assets, while you might want applications to be able to specify find grained caching headers for html and API content.

[![](https://mermaid.ink/img/pako:eNqFkE1vgzAMhv-K5XM_DrtxmESgt62qxE4j1RQFq6ASgkwihID_vqC0U2_zya_92H7lGbWtCBO8sepr-MplByG-S8F2HIivDw37_Tuk5TiOh8l6_tH2oK2BLD9ft9ai-uZYO9MuIOb0Q6yyi4Pi0e3bCdh613Q3YN_SsEA2n7IC0ssF0vVfOP-DxQrP5dHVuVTDQG54NXZ8ddZDBBb4nIs3SDcBwus7uXAYd2iIjWqq8IV5WyzR1WRIYhLSSvFdouzWwPm-Uo5OVeMsY-LY0w6Vd7aYOv3UkckbFR5qYnH9BTT0dXI)](https://mermaid.live/edit/#pako:eNqFkE1vgzAMhv-K5XM_DrtxmESgt62qxE4j1RQFq6ASgkwihID_vqC0U2_zya_92H7lGbWtCBO8sepr-MplByG-S8F2HIivDw37_Tuk5TiOh8l6_tH2oK2BLD9ft9ai-uZYO9MuIOb0Q6yyi4Pi0e3bCdh613Q3YN_SsEA2n7IC0ssF0vVfOP-DxQrP5dHVuVTDQG54NXZ8ddZDBBb4nIs3SDcBwus7uXAYd2iIjWqq8IV5WyzR1WRIYhLSSvFdouzWwPm-Uo5OVeMsY-LY0w6Vd7aYOv3UkckbFR5qYnH9BTT0dXI)

# Why you should have a CDN

It can help even if you aren't quite ready to fully leverage it

## A story 

our first startup got a viral link taking it down and by the time we got page caching on our rails server a few hours had passed and we lost the bump... The content would have been easy to protect the single viral page behind the CDN with content headers

# Understand the reliability risk and how to mitiage it

99.9 * 99.9

# CDNs Are Evolving

This post covers more traditional CDNs and features common consumer facing sites should consider leveraging. CDNs are now moving into the realm of cloud infrastructure with [Lambda@Edge](https://aws.amazon.com/lambda/edge/) and other CDNs allowing code (most commonly Javascript) to be deployed to the CDN network. The features and options supported when looking at having fully supported runtime code at the edge opens new architecture and application stack options. I am looking at FAAS and edge deployed code, but haven't leveraged it in any significant production environment yet. It is definitely a space to keep an eye on that promises to simplify global app distribution while maintaining extremely performant consumer experiences.

# Additional CDN Links

* [CDNs aren't just for caching](https://jvns.ca/blog/2016/04/29/cdns-arent-just-for-caching/)
* [CDN comic](https://wizardzines.com/comics/cdn/)
* [Understanding HTTP/S, CDNs and Edge Proxies](https://www.thecloudcast.net/2019/10/understanding-https-cdns-and-edge.html)
* [Optimizing high availability with CloudFront origin failover](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/high_availability_origin_failover.html)
* [Cloudfront SLA](https://aws.amazon.com/cloudfront/sla/) - 99.9%
* [Cloudfront 2 hour outage](https://www.channelfutures.com/cloud-2/amazon-cloudfront-dns-service-suffers-pre-thanksgiving-outage)
* [When a CDN goes down](https://www.theguardian.com/technology/2021/jun/08/edge-cloud-error-tuesday-internet-outage-fastly-speed)
    * The best defense for this is DNS fallback routing around the CDN... If you configure a failover routing policy. For example on AWS, Route53 would check the health of your Cloudfront distribution and if it's not healthy then the traffic would failover directly to your load balancer.

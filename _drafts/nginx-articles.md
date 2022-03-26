# NGINX

If you are serving up sites using open source stacks you likely have run into [NGINX](https://www.nginx.com/resources/glossary/nginx/), it is a Swiss army knife of tools from the most basic high performance web-server to flexible piece of middleware at many stages of the web request call stack.

> NGINX is open source software for web serving, reverse proxying, caching, load balancing, media streaming, and more. It started out as a web server designed for maximum performance and stability. In addition to its HTTP server capabilities, NGINX can also function as a proxy server for email (IMAP, POP3, and SMTP) and a reverse proxy and load balancer for HTTP, TCP, and UDP servers.

I have used it for decades at this point on various projects and to solve a number of issues. I wanted to have a page to collect some of the research and use cases I have used it for. This page is mostly a self serving reference resource, but it might help you understand and solve things you are looking for as well.

## Example NGINX Usage

* [NGINX Docs / Guides](https://www.nginx.com/resources/wiki/)
  * [example full configuration](https://www.nginx.com/resources/wiki/start/topics/examples/full/)
  * [serving static content](https://docs.nginx.com/nginx/admin-guide/web-server/serving-static-content/)
  * [NGINX config pitfalls](https://www.nginx.com/resources/wiki/start/topics/tutorials/config_pitfalls/)
  * [Creating Rewrite Rules](https://www.nginx.com/blog/creating-nginx-rewrite-rules/)
  * [How to use the official NGINX Docker Image](https://www.docker.com/blog/how-to-use-the-official-nginx-docker-image/)
* [NGINX s3 gateway](https://www.nginx.com/blog/using-nginx-as-object-storage-gateway/)
* [NGINX local pull through cache using try_files with multiple named locations](https://stackoverflow.com/questions/21286850/nginx-try-files-with-multiple-named-locations)
* [example of NGINX as a cloudfront proxy](https://serverfault.com/questions/889198/nginx-reverse-proxy-to-a-cloudfront-distribution-and-preserve-gzip-compression)
* [Proxy Pass with Variables](https://stackoverflow.com/questions/5743609/dynamic-proxy-pass-to-var-with-nginx-1-0)
* [Good Explanation of how try-files works](https://stackoverflow.com/questions/17798457/how-can-i-make-this-try-files-directive-work)
* How To:
	* [Remove html Extension](https://stackoverflow.com/questions/38228393/nginx-remove-html-extension)
	* [Remove the trailing slash](https://ubiq.co/tech-blog/remove-trailing-slash-in-nginx/)
	* [URLs without the trailing slash](https://christopheraue.net/design/urls-without-trailing-slash-or-extension)
	* [Return vs Rewrite Rules](https://www.journaldev.com/26864/nginx-rewrite-url-rules)
	* [Private S3 website proxy](https://dodwell.us/using-nginx-to-proxy-private-amazon-s3-web-services.html)
	* [Oauth2 Restricted S3 website proxy](https://www.finbourne.com/blog/authenticating-s3-proxy)
	* [Docker NGINX S3 Proxy](https://github.com/Fanatics/Docker-Nginx-S3-Proxy/blob/master/nginx/conf/nginx.conf)
	* [NGINX Cache Control Headers](https://www.cloudsavvyit.com/3782/how-to-configure-cache-control-headers-in-nginx/)
	* [Optimizing NGiNX Cache Control Headers](https://webdock.io/en/docs/webdock-control-panel/optimizing-performance/setting-cache-control-headers-common-content-types-nginx-and-apache)
	* [Service Next-JS App with NGINX & Docker](https://medium.com/bb-tutorials-and-thoughts/how-to-serve-next-js-app-with-nginx-and-docker-9821c3de72d)
	* [NGINX Proxy Cache for S3, including `proxy_cache_use_stale`](https://thucnc.medium.com/how-to-use-nginx-to-proxy-your-s3-files-760acc869e8)
	* [Proxy Pass Based On Query Params](https://serverfault.com/questions/564012/proxy-pass-based-on-query-parameters-in-nginx)
	
## Monitoring NGINX

* [Datadog: How to monitor NGINX](https://www.datadoghq.com/blog/how-to-monitor-nginx/)
* [Datadog: How to collect NGINX metrics] (https://www.datadoghq.com/blog/how-to-collect-nginx-metrics/)
* [Datadog: How to monitor NGINX](https://www.datadoghq.com/blog/how-to-monitor-nginx-with-datadog/)
* [Datadog: NGINX agent configuration](https://docs.datadoghq.com/integrations/nginx/#?tab=host)
* [Datadog: Log based Metrics](https://www.datadoghq.com/blog/log-based-metrics/), this isn't explicitly about NGINX but can be very helpful for NGINX based projects.
* [Scalyr: how to monitor NGINX the essential guide](https://github.com/scalyr/scalyr-community/blob/master/guides/how-to-monitor-nginx-the-essential-guide.md)





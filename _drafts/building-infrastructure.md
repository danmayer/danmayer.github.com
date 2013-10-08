* step 1: get digital ocean box

  utility server: https://www.digitalocean.com/community/articles/how-to-use-the-digitalocean-docker-application
  * `run as docker user: su -l dkr`
  
  * [graphite](https://index.docker.io/u/nickstenning/graphite/)
       * load image to docker `docker pull nickstenning/graphite`
       * docker run -d nickstenning/graphite:lastest
  * statsd
     * use https://github.com/bosky101/statsd-core
    
         git clone github.com/bosky101/statsd-core
         cd statsd-core
         cat config.js #edit this file as you wish, but keep the filename intact
         # edit above file to change host, as local host doesn't reach across docker boxes
         docker build .
         docker run -p 8125:8125/udp -p 8126:8126 -d dans_statsd node /statsd-0.6.0/stats.js /data/config.js

    * vagrant currently has elastic search redis, etc
    
    * log stash / kibana
    `docker run -p 49176:5601 -p 49175:514 -d ehazlett/logstash:latest`
    c31525eeb794        ehazlett/logstash:latest   /bin/sh -e /usr/loca   2 days ago          Up 2 days           49170->9200, 49171->9300, 49172->9301, 49173->9302, 49174->9292, 49175->514, 49176->5601

#### Issues
* move to vagrant with vagrant up against digital ocean
* multiple docker boxes trying to claim port 80 http://stackoverflow.com/questions/18497564/assigning-vhosts-to-docker-ports
* in a docker VM can it see ports on other vms, or a way to share them?
* vagrant to docker to digital ocean
* 

###### Docker parent hostname passed into containers 
[how to pass host names](https://github.com/dotcloud/docker/issues/243)
related to being about to pass [localhost to refer to the ports on the container host](https://github.com/dotcloud/docker/issues/1403)


[forcing specific docker ports](http://stackoverflow.com/questions/18497564/assigning-vhosts-to-docker-ports)
[add collected](https://github.com/dotcloud/collectd-graphite/blob/master/Dockerfile)

[docker best practices](http://crosbymichael.com/dockerfile-best-practices.html)

get the full docker cmd run along with options: `docker ps -notrunc`

####TODO

* ssh
* password protect
* upgrade to kibana 3

http://coreos.com/docs/etcd/

#### thanks

* https://github.com/fgrehm/ventriloquist/issues/17
* dhassler
#### Links

* [things to know prior to aws](http://wblinks.com/notes/aws-tips-i-wish-id-known-before-i-started/)
* [docker best practices](http://crosbymichael.com/dockerfile-best-practices.html)
* [docker book sample chapter](http://dockerbook.com/TheDockerBook_sample.pdf)
* [Continuous Integration Using Docker](https://www.activestate.com/blog/2014/01/using-docker-run-ruby-rspec-ci-jenkins)
* [Integrating Docker with a Rails App](http://www.powpark.com/blog/programming/2014/01/29/integrating-docker-with-jenkins-for-ruby-on-rails-app)
* [Your Docker Image is likely broken](http://phusion.github.io/baseimage-docker/)
* [Passenger Docker, lots of heavy lifting done for you](https://github.com/phusion/passenger-docker)
* [Ansible & Docker](http://thechangelog.com/ansible-docker/)
* __Continous Delivery series by how are you__
  * [Continuous delivery with docker](http://blog.howareyou.com/post/62157486858/continuous-delivery-with-docker-and-jenkins-part-i)
  * [Continuous delivery with docker part2](http://blog.howareyou.com/post/65048170054/continuous-delivery-with-docker-and-jenkins-part-ii)
  * [Source Code for the Related examples](https://github.com/cambridge-healthcare/hi_sinatra-docker)
* [Zero Downtime Deployments with Docker](http://brianketelsen.com/2014/02/25/using-nginx-confd-and-docker-for-zero-downtime-web-updates/) 

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

    * adding redis which I pulled out at some point
    docker run -p 6379 -i -t johncosta/redis /usr/bin/redis-server

#### Issues
* move to vagrant with vagrant up against digital ocean
* multiple docker boxes trying to claim port 80 http://stackoverflow.com/questions/18497564/assigning-vhosts-to-docker-ports
* in a docker VM can it see ports on other vms, or a way to share them?
* vagrant to docker to digital ocean
* loose net connection for your mac docker: `./boot2docker restart`
* with boot2docker you need to open virtualbox and have it expose any boot2docker ports you want to reach

#### Process

Make a base image that includes the depenancies 

    docker build -t ruby_base .
	# Successfully built f3e7481ef6f5
	
Then tag that image and push it to the official or your local registry

	docker tag f3e7481ef6f5 localhost:5000/ruby_base
	#or push to the public registry
	docker push danmayer/ruby_base

Then upload it to your locker or the public docker registery

    docker push localhost:5000/ruby_base
        	
Build a project specific repo

    docker build -t server_responder .

Run it in foreground or background

    docker run -t -i -p 8999:8999 72f8510b2b39

###### Docker parent hostname passed into containers 
[how to pass host names](https://github.com/dotcloud/docker/issues/243)
[forcing specific docker ports](http://stackoverflow.com/questions/18497564/assigning-vhosts-to-docker-ports)
[Port redirection and linking](http://docs.docker.io/en/latest/use/port_redirection/)
[binding port to address](https://github.com/dotcloud/docker/issues/1139)
[connect docker containers together](http://stackoverflow.com/questions/18460016/connect-from-one-docker-container-to-another)
[example connecting two dockers together](http://docs.docker.io/en/latest/examples/running_redis_service/)
[add collected](https://github.com/dotcloud/collectd-graphite/blob/master/Dockerfile)
[docker cheat sheat](https://github.com/wsargent/docker-cheat-sheet)

[docker best practices](http://crosbymichael.com/dockerfile-best-practices.html)

get the full docker cmd run along with options: `docker ps -notrunc`

####TODO

* ssh
* password protect
* upgrade to kibana 3

http://coreos.com/docs/etcd/

https://github.com/kencochrane/docker-guidebook/blob/master/docker-guidebook.rst

#### thanks

* https://github.com/fgrehm/ventriloquist/issues/17
* dhassler https://github.com/dotcloud/docker/issues/1555


### random notes
  
    #build a docker file in the current directory and tag it
    docker build -t="hi_docker" ./
    #run that tagged docker
    docker run -i -t "hi_docker"
    #run that docker but bind the internal port to the host machine
    docker run -i -t -p 8000:8000 "hi_docker"
    
    #debug a random point in a docker build, jump in prior to error run commands till works 
    # then fix docerfile and rerun
    docker run -i -t  e53384904c8d
    
    sudo docker run -i -t 54495ad388a3 /bin/bash
    
### Redhat docker

* http://docs.docker.io/en/latest/installation/rhel/ //docsfor
* sudo yum -y install docker-io
* sudo yum -y update docker-io
* sudo service docker start
* sudo chkconfig docker on //docker at boot?

	    //silly redhat
	    sudo yum update
	    sudo yum -y install docker-io
		//add to ~/.bash_profile
		PATH=$PATH:/sbin
		source ~/.bash_profile
		sudo /usr/sbin/useradd jenkins -s /bin/bash -m -G docker

### Example Dockerfiles

* [Ruby box](https://github.com/gorsuch/dockerfile-examples/blob/master/rubybox/Dockerfile)
* [Jenkin's box](https://index.docker.io/u/aespinosa/jenkins/)    
* [Linking Docker images](http://docs.docker.io/en/latest/use/working_with_links_names/)
* [Docker cookbooks](https://github.com/Krijger/docker-cookbooks)
* [Redis Docker and example link](http://docs.docker.io/en/latest/examples/running_redis_service/)
    
### Docker specific use cases

[Jenkins Docker](https://index.docker.io/u/orchardup/jenkins/)
    docker run -p 8888:8080 -d bacongobbler/jenkins

### Linux

`sudo usermod -a -G docker jenkins`
  //redhat has some docker issues
  Error mounting '/dev/mapper/docker-252:0-1329382-33d868dfbf5b8e7d8aa67b5b9f4b01cd9ff3a3360c16b09f3061c09878e933ec'
  
### upgrading a running docker

    sudo docker run -u root -i -t sentry741 /bin/bash
    pip install sentry-slack
    #in host machine
    sudo docker commit 4258980f702e sentry741:slack_integration
    sudo docker stop sentry741:latest
    sudo sudo docker run --name setry-web-slack --link redis1:redis -p 80:9000 -v ~/sentry.conf.py:/home/user/.sentry/sentry.conf.py -d -u user sentry741:slack_integration sentry start
    
### OSX docker

When you expose a port on OSX docler with -p it only exposes for the OSX thin virtual machine. To expose on real localhost open virtual box. Edit machine networking port forwarding and add the forward rules you need.   
    
### Vagrant

* [vagrant using host DNS](https://gist.github.com/mitchellh/1277049)
* fixing vagrant tools version issues: `https://github.com/dotless-de/vagrant-vbguest`    
* pick #1 if it asks, when DNS works but actual connections don't `en0: Wi-Fi (AirPort)` 
* //http://docs.vagrantup.com/v2/networking/public_network.html

* [running a local docker registry](http://blog.docker.io/2013/07/how-to-use-your-own-registry/)
  * `docker run -d -p 5000:5000 samalba/docker-registry` 
  
### Dockers I love

    # unless docker running redis run
    # sudo docker run -d -p 6379:6379 dockerfile/redis

    # unless docker running mysql run it
    # sudo docker run -d -p 3306:3306 orchardup/mysql
    
    * [nice jenkins base](https://index.docker.io/u/zaiste/jenkins/)
      * how it handles plugins
      https://github.com/zaiste/docker-jenkins/blob/master/run

### Docker command reference

* show all dockers `docker ps -a`
* remove docker by name: `docker rm name-given-when-run`
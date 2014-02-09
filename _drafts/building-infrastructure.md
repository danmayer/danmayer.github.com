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
* 

###### Docker parent hostname passed into containers 
[how to pass host names](https://github.com/dotcloud/docker/issues/243)
related to being about to pass [localhost to refer to the ports on the container host](https://github.com/dotcloud/docker/issues/1403)


[forcing specific docker ports](http://stackoverflow.com/questions/18497564/assigning-vhosts-to-docker-ports)
[Port redirection and linking](http://docs.docker.io/en/latest/use/port_redirection/)
[binding port to address](https://github.com/dotcloud/docker/issues/1139)
[connect docker containers together](http://stackoverflow.com/questions/18460016/connect-from-one-docker-container-to-another)
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
    
### Redhat docker

* http://docs.docker.io/en/latest/installation/rhel/ //docs
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
    
### Docker specific use cases

[Jenkins Docker](https://index.docker.io/u/orchardup/jenkins/)
    docker run -p 8888:8080 -d bacongobbler/jenkins

### Linux

`sudo usermod -a -G docker jenkins`
  //redhat has some docker issues
  Error mounting '/dev/mapper/docker-252:0-1329382-33d868dfbf5b8e7d8aa67b5b9f4b01cd9ff3a3360c16b09f3061c09878e933ec'
  

    
### OSX docker

When you expose a port on OSX docler with -p it only exposes for the OSX thin virtual machine. To expose on real localhost open virtual box. Edit machine networking port forwarding and add the forward rules you need.   
    
### Vagrant

* [vagrant using host DNS](https://gist.github.com/mitchellh/1277049)
* fixing vagrant tools version issues: `https://github.com/dotless-de/vagrant-vbguest`    
* pick #1 if it asks, when DNS works but actual connections don't `en0: Wi-Fi (AirPort)` 
* //http://docs.vagrantup.com/v2/networking/public_network.html

* [running a local docker registry](http://blog.docker.io/2013/07/how-to-use-your-own-registry/)
  * `docker run -d -p 5000:5000 samalba/docker-registry` 
    
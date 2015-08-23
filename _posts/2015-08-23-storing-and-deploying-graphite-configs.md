# Storing & deploying graphite configs

When I worked [@livingsocialeng](https://twitter.com/livingsocialeng) a engineer on the team [Josh Sharpe](https://github.com/crankharder) improved how we dealt with graphite dashboards. He wrote Rake tasks to push and pull our graphite dashboards into each project's git repo. This made it easier to collaborate on dashboards and see the history of a dashboard. It is really handy to keep your dashboard under version control. If you don't know why you want graphite dashboards or why it would be good to keep them in version control, checkout [a practical guid to graphite monitoring](http://matt.aimonetti.net/posts/2013/06/26/practical-guide-to-graphite-monitoring/).

At the time, I thought awesome, used the tasks and went back to work. As I have moved on to a new job, and am working on graphite dashboards. I realized I really missed the tasks. I checked around and didn't find a gem to handle storing graphite dashboards with a project. So I looked into how to build the tasks myself, there likely isn't a gem because it is really pretty simple.

# Download existing dashboards

The format is a bit verbose, so it is best to download an existing dashboard to edit. I added a Rake task, which just pulls a dashboard so it can be edited as a template to build a new dashboard.

    task :pull_dashboard_skeleton do
      curl -u user:pass https://graphite.host.com/dashboard/load/DashName.json > temp.json
    end
    
Curling an existing graph will pull down JSON that looks something like this.

    {
      "state": {
        "name": "My Dash",
        "defaultGraphParams": {
            "width": 1024,
            "from": "-24hours",
            "until": "now",
            "height": 450
        },
        "graphSize": {
            "width": 1024,
            "height": 400
        },
        "refreshConfig": {
            "interval": 60000,
            "enabled": false
        },
        "timeConfig": {
            "relativeStartUnits": "hours",
            "relativeStartQuantity": "2",
            "relativeUntilQuantity": "",
            "startTime": "9:00 AM",
            "endTime": "5:00 PM",
            "type": "relative",
            "relativeUntilUnits": "now"
        },
      "graphs": [
            [
                [
                ],
                {
                  "target": [
                    "alias(drawAsInfinite(stats_counts.namespace.deploys), \"deploys\")",
                    "alias(summarize(sumSeries(stats_counts.namespace.env.key.*.*),\"1min\"), \"current something\")",
                    "alias(timeShift(summarize(sumSeries(stats_counts.namespace.env.key.*.*),\"1min\"),\"1d\"), \"previous 24h something\")"
                  ],
                    "hideLegend": "false",
                    "title": "\"something 24 hour Comparison\"",
                    "height": "420",
                    "width": "1024",
                    "_salt": "1433982521.214"
                },
                ""
            ],
            [
                [
                ],
                {
                  "target": [
                    "alias(sumSeries(stats_counts.namespace.env.other.*.*), \"total other\")"
                  ],
                    "hideLegend": "false",
                    "title": "\"other graph\"",
                    "height": "420",
                    "width": "1024",
                    "_salt": "1433982521.214"
                },
                ""
            ]
        ]
      }
    }


# Uploading a static dashboard

For a static dashboard, you can make a really simple Rake task. I ended up putting it in `lib/tasks/graphite.rake`. In the task point at where in your project you want to store the dashboard file, in this example `config/graphite_dashboards/DashboardName.json`. Then the task can just use curl to post that data up to your graphite server.

    task :update_graphite_dash do
      data = File.read('config/graphite_dashboards/DashboardName.json')
      data = CGI.escape(JSON.parse(data)['state'].to_json)
      state = "state=#{data}"
      `curl -d '#{state}' -u user:pass -X POST https://graphite.host.com/dashboard/save/DashboardName`
    end
    
This lets you keep any dashboards the team build in git. Allowing you to edit the JSON in your own editor which is more nicer than using the Graphite online editor. Once you have this it is easy to extend the concept even further to use data to generate dashboards.

# Generating dynamic dashboards
    
While, previously I had only pushed and pulled dashboards. I ran into cases where I really needed the same dashboard, but slightly scoped by a particular set of data. I realized now that I had the dashboard posting code inside Ruby, it would be easy to dynamically generate dashboards based on data. Again, adding another Rake task, I was able to iterate through our regions and generate region specific dashboards. The trick here, is to use ERB to allow you to embed ruby into the dashboard template. A simple trick, but very effective at letting me zoom in on any dashboard to a specific scope.

	task update_dynamic_dashboard: :environment do
      Regions.each do |region|
        data = ERB.new(File.read('config/graphite_dashboards/DynamicRegionDash.json')).result(binding)
        data = CGI.escape(JSON.parse(data)['state'].to_json)
        state = "state=#{data}"
        `curl -d '#{state}' -u user:pass -X POST http://graphite.host.com/dashboard/save/Dynamic-#{region.name}-Dashboard`
      end
    end
    
 The actual JSON for the dashboard is pretty much the same, but with the region embed a few places like so.
 
     {
       "state": {
          "name": "Dynamic-<%= region.name %>-Dashboard",
          ...
           "alias(summarize(sumSeries(stats_counts.namespace.env.key.<%= region.name %>.*),\"1min\"), \"current something by region\")",
           ...
           
That is all there is to it. Hopefully, this will be helpful to someone else to get their graphite dashboards under version control. It didn't take long to google around to figure it out, but this should save time from finding the exact formats and urls needed to make things work.
---
layout: post
title: "Unused DB Columns"
category: Programming
tags: [Programming, Development, Database, Refactoring]
---
{% include JB/setup %}

![image detect](/assets/img/polar_bear_sm.jpg)
> a search for 'unused database' brings up this awesome [wikimedia](https://upload.wikimedia.org/wikipedia/commons/3/3c/Polar_bear_%28Ursus_maritimus%29_in_the_drift_ice_region_north_of_Svalbard.jpg) image for some reason.

# Detecting DB Column Usage

I am always interested in ways to automate and [cleanup old unused code](https://github.com/danmayer/coverband). Removing the clutter helps focus in on the things that matter and make more clear patterns emerge. Continuing on some work to [cleanup unused tables in a database](https://www.mayerdan.com/programming/2017/02/08/cleanup-your-db), I really wanted a way to find unused columns / fields. I came up with two easy ways to try to automate detecting this in a Rails app. The first is to query the DB's [paper_trail](https://github.com/airblade/paper_trail) history, which is easy if you are already using paper_trail. The second I will cover in another post soon.

## Column Usage Output

What does column usage look like, well for each table it is a list of fields and the last date it was modified. The simple output should be pretty clear.

```
____________________________________________________________
field usage for Customer
************************************************************
barcode: 2017-05-20
email: No updates in 3 months
fixed_location_id: No updates in 3 months
agent_id: No updates in 3 months
account_id: 2017-05-20
house_latitude: No updates in 3 months
house_longitude: No updates in 3 months
house_location_accuracy: No updates in 3 months
...
notes: 2017-05-20
last_paid_at: 2017-05-20
____________________________________________________________
field usage for Lead
************************************************************
fixed_location_id: No updates in 3 months
custom_location_name: No updates in 3 months
agent_id: 2017-05-20
captured_by_id: 2017-05-20
converted_at: 2017-05-20
service_level_id: No updates in 3 months
source: 2017-05-20
latitude: 2017-05-20
longitude: 2017-05-20
status: 2017-05-20
assigned_at: No updates in 3 months
...
```

Obviously, a developer will need to interpret this, some tables aren't often updated it doesn't mean they have no purpose. For example we have some configuration tables that are only modified when we integrate new partners into our system. So they will show up in my list with "No updates in 3 months" but that can be quickly filtered out.

## Detect Columns via Paper_Trail

If you use the gem [paper_trail](https://github.com/airblade/paper_trail) to track the history of changes on some of your models, you are already recording when any column was last changed. All one has to do is come up with the queries to pull the data out. Doing this by hand would be a huge pain, but luckily it is easy to hook into our code and automate the process. We just find all models that support paper_trail, then iterate through the fields.

## Show Me the Code

The below functions and tasks can be added to any rake task file.

```
def find_ar_models
  Rails.application.eager_load!

  array = ActiveRecord::Base.descendants.collect { |x| x.to_s if x.table_exists? }.compact - ['ActiveRecord::SchemaMigration']

  array.reject { |x| x.split('::').last.split('_').first == "HABTM" }
end

desc 'List when column was last updated'
task :list_recent_columns => :environment do
  ignore_models = %w(RailsSettings::Settings Devise::Oauth::Client)
  models = find_ar_models
  models = models.reject{|model| ignore_models.include?(model.to_s) }
  
  ignored_columns = %(id created_at updated_at)
  results = {}
  
  models.each do |model|
    model_results = {}
    model = Kernel.const_get model
    next unless model.paper_trail.enabled?
    puts "_"*60
    puts "field usage for #{model}"
    puts "*"*60
    model.attribute_names.each do |attr|
      next if ignored_columns.include?(attr)
      result = PaperTrail::Version.where(item_type: model.to_s)
                 .where("created_at >= ?",[3.months.ago])
                 .where("object_changes ILIKE ?",["%#{attr}%"])
                 .order("created_at DESC")
                 .limit(1).first
      model_results[attr] = result&.created_at&.to_date || 'No updates in 3 months'
      puts "#{attr}: #{model_results[attr]}"
    end
    results[model.to_s] = model_results
  end
end
```

### Quick Note on Performance

Make sure you have indexes on `created_at` and `item_type` or this will be very slow. If you don't find another way to limit. For example we don't have an index on `created_at` so I did a query to find the max_id of 3 months ago and use that as the limit opposed to `created_at` which makes the queries run without any perf issues.
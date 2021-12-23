# Testing

Notes / Thoughts / Links on testing...

# Notes on Testing in Production

An excelent post, [I test in Production](https://increment.com/testing/i-test-in-production/) by [@mipsytipsy](https://twitter.com/mipsytipsy). Many pieces resonate with me. I have found overtime, I care more about observability, rapid continious integration, and tools to support testing in production, than I do about traditional tests. 

>  It’s better to practice risky things often and in small chunks, with a limited blast radius, than to avoid risky things altogether.

When one can make changes safely and deploy extremely fast... small chucks can even be incremental steps ensuring all feature flags, observability, and test in production tool is in place before a feature even goes live.

> peace of mind (and a good night’s sleep) can only be regained by embracing error budgets via service-level objectives (SLOs) and service-level indicators (SLIs), thinking critically about how much failure users can tolerate, and hooking up feedback loops to empower software engineers to own their systems from end to end.

This is an area, I am actively spending more time and helping our teams think more about how we think about learning from failure and becoming more resilient.

> A system’s resilience is not defined by its lack of errors; it’s defined by its ability to survive many, many, many errors. We build systems that are friendlier to humans and users alike not by decreasing our tolerance for errors, but by increasing it. Failure is not to be feared. Failure is to be embraced, practiced, and made your good friend.

I love this, we recently had an issue causing approximately 30% of api requests to fail... The systems that were resilent barely seemed to have an issue, systems that couldn't handle faults fell over hard and started causing faults for their consuming services.

> Managers need to recognize that 80 percent of the bugs are caught with 20 percent of the effort, and after that you get sharply diminishing returns. Modern software systems need less investment in pre-prod hardening and more investment in post-prod resiliency.

Nice, again, give me the fast feedback loop and failure handling.

> Resiliency goes hand in hand with ownership, which goes hand in hand with quality of life. 

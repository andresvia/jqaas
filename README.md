Disclaimer
==========

This Node.js web app wraps [jq](https://github.com/stedolan/jq) as `child_process.execFile` and returns the reponse as a service (HTTP).

Whenever I have the time or knowledge I will work this out using libjq but since there is no binding for any "easy" language probably that's not going to happen soon.

This is clearly not the most efficient way to invoke jq capabilities I'm just trying to solve a problem, integrating disparate API's on Rundeck where only HTTP GET requests can be made on some cases to integrate different resources.

Example use case: combine the feature of Rundeck where allowed values can come from a "Remote URL" with output from PuppetDB using `jqaas` to transform the PuppetDB output into the format that Rundeck "wants".

* Rundeck [option model provider documentation](http://rundeck.org/docs/manual/jobs.html?#option-model-provider)
* [PuppetDB documentation](http://docs.puppetlabs.com/puppetdb/latest/api/index.html)

API
---

TBD


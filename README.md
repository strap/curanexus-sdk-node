# NodeJS > curaNEXUS Server-Side SDK

curaNEXUS Server-Side SDK provides an easy to use, chainable API for interacting with our
API services.  Its purpose is to abstract away resource information from
our primary API, i.e. not having to manually track API information for
your custom API endpoint.

curaNEXUS Server-Side SDK keys off of a global API discovery object using the read token for the API.
The curaNEXUS Server-Side SDK extracts the need for developers to know, manage, and integrate the API endpoints.

The a Project API discovery can be found here:

HEADERS: "X-Auth-Token":
GET [https://api.curanexus.co/discover]([https://api.curanexus.co/discover)

### Installation

```
npm install curanexus-sdk-node
```

### Initialization

Once you create your curaNEXUS instance, a call to `curaNEXUS.discover()` must be made
before interacting with any curaNEXUS API.  Once complete, curaNEXUS will emit a
`ready` event.

```javascript
// Setup curaNEXUS SDK, passing in the Read Token for the Project
var curaNEXUSSDK = require('curanexus-sdk-node'),
    curaNEXUS = new curaNEXUSSDK({ token: '{Read Token for curaNEXUS Project}' });

// Tell curaNEXUS to get started
curaNEXUS.discover();

// Listen for ready before interacting with curaNEXUS
curaNEXUS.once('ready', function () {
    // Okay to use curaNEXUS
});
```

### Basic Usage

Once curaNEXUS has initialized, all available resources will be exposed directly on
your sdk instance.  Each resource will expose a `get` method for fetching data via
the API.

```javascript
curaNEXUS.once('ready', function () {

    // Provided parameters are delivered with the request
    curaNEXUS.users.get({}, function (err, users) {

    });

    // is equivalent to for requests without URL parameteres
    curaNEXUS.users.get(function (err, users) {

    });

    // If the resource has a path parameter, you may pass it short hand
    // like this
    curaNEXUS.activity.get('userguid', function (err, activity) {

    });
});
```

### Pagination

Several curaNEXUS APIs are paginated using a "page" parameter.  You have a couple options for dealing with this.

First, you can use the resource `all` method to instruct the SDK to handle pagination
for you and build a list of all records.  This may be a bad idea for a large dataset.

The parameters provided to `all` may be omitted.

```javascript
curaNEXUS.once('ready', function () {

    curaNEXUS.week.all({}, function (err, reports) {

    });

    // is equivalent to
    curaNEXUS.week.all(function (err, reports) {

    });
});
```

The second option for handling paginated requests is to create an iterator and
parse it yourself.  Here, we will use `async.whilst`.

```javascript
curaNEXUS.once('ready', function () {

    // Can provide request parameters here
    var iter = curaNEXUS.week.iter();

    async.whilst(function () {
        // Whether to continue
        return iter.hasNext();
    }, function (cb) {
        // Fetch next batch
        iter.getNext(function (err, reports) {

            /* handle reports */

            cb();
        });
    }, function (err) {
        // Iter complete
    });
});
```

### API

```javascript
    // List available endpoints
    curaNEXUS.endpoints();
    // No Params

    // Muliple Optional Param can be passed in as an object
    // curaNEXUS.activity.get( {day: "YYYY-MM-DD", guid: "demo-curaNEXUS"}, callback )
    // URL resources can be passed as Strings or in the Array
    // curaNEXUS.activity.get( "demo-curaNEXUS", callback )

    // Every endpoint has the get() method
    // Get a record or set of records
    curaNEXUS.activity.get( params, callback ); 

    // Fetch a user's activity
    // URL resource: "guid"
    // Optional: "date", "count", "start", "end"  >> "start" and "end" use "YYYY-MM-DD" format
    curaNEXUS.activity.get("guid", function (err, data) {
        /* etc */
    });

    // Fetch a user's behavior profile
    // URL resource: "guid"
    // Optional: none
    curaNEXUS.behavior.get("guid", function (err, data) {
        /* etc */
    });

    // Fetch the micro-segmentation job list or a individual micro-segmentation job
    // URL resource: "id"
    // Optional: "id", "status"
    curaNEXUS.job.get({params}}, function (err, data) {
        /* etc */
    });

    // Create a micro-segmentation job
    // URL resource: none
    // Required: "name"
    // Optional: "description", "guids", "startDate", "endDate", "notificationUrl"  >> "guids" is an array of guid strings
    curaNEXUS.job.post({params}, function (err, data) {
        /* etc */
    });

    // Update a micro-segmentation job
    // URL resource: "id"
    // Optional: "name", "description"
    curaNEXUS.job.put({params}, function (err, data) {
        /* etc */
    });

    // Delete a micro-segmentation job
    // URL resource: "id"
    curaNEXUS.job.delete("job-id", function (err, data) {
        /* etc */
    });

    // Fetch the micro-segmentation job data
    // URL resource: "id"
    // Optional: "id"
    curaNEXUS.job_data.get({params}}, function (err, data) {
        /* etc */
    });

    // Fetch all user data for month
    // URL resource: none
    // Optional: "guid", "page", "per_page"
    curaNEXUS.month.get({}, function (err, data) {
        /* etc */
    });

    // Fetch a report's data
    // URL resource: "id"
    // Optional: none
    curaNEXUS.report.get("id", function (err, data) {
        /* etc */
    });

    // Fetch a report's food data
    // URL resource: "id"
    // Optional: "food"
    curaNEXUS.report_food.get({params}, function (err, data) {
        /* etc */
    });

    // Fetch a report's raw data
    // URL resource: "id"
    // Optional: "type"
    curaNEXUS.report_raw.get({params}, function (err, data) {
        /* etc */
    });

    // Fetch a report's workout data
    // URL resource: "id"
    // Optional: "workout"
    curaNEXUS.report_workout.get({params}, function (err, data) {
        /* etc */
    });

    // Fetch the segmentation for the projet
    // URL resource: none
    // Optional: "date", "period"
    curaNEXUS.segmentation.get({}, function (err, data) {
        /* etc */
    });

    // Fetch all user data for today
    // URL resource: none
    // Optional: "guid", "page", "per_page"
    curaNEXUS.today.get({}, function (err, data) {
        /* etc */
    });

    // Fetch a project or user's trend data
    // URL resource: none
    // Optional: "guid"
    curaNEXUS.trend.get({}, function (err, data) {
        /* etc */
    });

    // List project triggers or specific trigger
    // URL resource: none
    // Required: none
    // Optional: "id", "key", "type", "actionType"
    curaNEXUS.trigger.get({params}, function (err, data) {
        /* etc */
    });

    // Create a trigger
    // URL resource: none
    // Required: "active", "name", "type", "range", "conditions"
    // Optional: "actionType", "actionUrl"
    curaNEXUS.trigger.post({params}, function (err, data) {
        /* etc */
    });

    // Update a trigger
    // URL resource: "id"
    // Optional: "active", "name", "type", "range", "conditions", "actionType", "actionUrl"
    curaNEXUS.trigger.put({params}, function (err, data) {
        /* etc */
    });

    // Delete a trigger
    // URL resource: "id"
    curaNEXUS.trigger.delete("trigger-id", function (err, data) {
        /* etc */
    });

    // Fetch trigger data
    // URL resource: "id"
    // Optional: "count"
    curaNEXUS.trigger_data.get({id: "trigger-id"}, function (err, data) {
        /* etc */
    });

    // Fetch a simple user object
    // URL resource: "guid"
    // Optional: none
    curaNEXUS.user.get({}, function (err, data) {
        /* etc */
    });

    // Fetch a user list for the Project
    // URL resource: none
    // Optional: "platform", "count"
    curaNEXUS.users.get({}, function (err, data) {
        /* etc */
    });

    // Fetch all user data for week
    // URL resource: none
    // Optional: "guid", "page", "per_page"
    curaNEXUS.week.get({}, function (err, data) {
        /* etc */
    });

    // Fetch a project or user's wordcloud
    // URL resource: none
    // Optional: "guid"
    curaNEXUS.wordcloud.get({}, function (err, data) {
        /* etc */
    });
});
```

### REPL

`curaNEXUS` also ships with a repl should you be interested in playing around with it.  And example screen shot is included:

![](https://s3.amazonaws.com/strap-sdk/strap-sdk-node.png)

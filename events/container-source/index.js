const express = require("express");
const app = express();

app.get("/", (req, res) => {
  console.log("Hello world received a request.");
  const target = process.env.TARGET || "World";
  res.send(`Hello ${target}!`);
});
app.get("/send", (req, res) => {
  const data = {
    foo: "bar"
  }
  sendCloudEvent(data)
    .then(response => {
      console.log(JSON.stringify(response.data));
      res.send(`Done sending event`);
    }).catch(err => {
      console.error(err);
      res.status(500).json({ error: err.message });
    });
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log("Node.js container-source listening on port", port);
});
var count = 0;
setInterval(() => {
  sendCloudEvent({ foo: count++ })
}, 1000);


function sendCloudEvent(data) {
  var Cloudevent = require("cloudevents-sdk");
  const Binary02 = Cloudevent.bindings["http-binary0.2"];
  const ceContentType = "application/json";
  const ceType = process.env.CETYPE || "com.example.bar.foo";
  const ceSource = process.env.CESOURCE || "urn:event:from:myapi/resourse/123";
  const now = new Date();
  const schemaurl = "http://cloudevents.io/schema.json";
  var httpMethod = "GET"
  var httpUrl = "http://httpbin.org/headers"
  if (!!process.env.SINK) {
    httpMethod = "POST";
    httpUrl = process.env.SINK;
  }


  // The event
  var cloudevent = new Cloudevent(Cloudevent.specs["0.2"]);
  const ceData = data || {
    foo: "bar"
  };

  cloudevent
    .type(ceType)
    .source(ceSource)
    .contenttype(ceContentType)
    .time(now)
    .schemaurl(schemaurl)
    .data(ceData);

  // The binding configuration using POST
  var config = {
    method: httpMethod,
    url: httpUrl
  };
  var httpbinary02 = new Binary02(config);

  // Emit the event using Promise
  return httpbinary02.emit(cloudevent)
}
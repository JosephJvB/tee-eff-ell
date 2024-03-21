# TFL scrapey

pull info from TFL's bus arrival webpage and display on my own webpage
- just for st-dominics at first
  - then maybe a few more stops, like the one by kings cross
- reload the data on an interval (10sec?)
  - frontend first
  - then maybe web socket?
- would be interested to try to display the busses on a google maps thingo
- performance is important to me, since part of the reason I'm doing this is because I find the TFL website slow to load

Lets try start out ultra simple
just an html page on S3 loading this stuff - ah, but there will be cors errors!
i could have a lambda/s3/apigateway setup
lambda to serve html page & page can make calls back to the lambda for updates?
i guess I could do htmx for this, I think that makes a lot of sense
[htmx polling](https://htmx.org/attributes/hx-trigger/#polling)
htmx also has stuff for websockets and server side events(sse)

decision paralysis
- frameworky: pick something like vercel/fly.io to handle speed
  - choose hosting
  - choose backend language (should I try learn something new?)
  - choose frontend
- custom: configure AWS resources
  - cloudfront
  - edge functions
  - s3


  can I just have an edge function that will scrape tfl & then return simple html?
  that feels like an OK MVP
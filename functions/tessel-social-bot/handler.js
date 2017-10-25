'use strict';

const AWS = require('aws-sdk')
var docClient = new AWS.DynamoDB.DocumentClient();
const iopipe = require('iopipe')({
  clientId: process.env.IOPIPE_CLIENT_KEY
})

module.exports.githubEvent = iopipe((event, context, callback) => {
  let statusCode = 200
  let message = 'event added'

  if(event.repository && event.repository.name){
    docClient.put({
      TableName: 'SocialEvents',
      Item: {
        time: new Date() + '',
        type: 'GitHubPush',
        repo: event.repository.name
      }
    }, (err, data) => {
      if(err){
        console.log(err)
        message = err
      }
    })
  }

  const response = {
    statusCode,
    body: JSON.stringify({
      message,
      input: event,
    }),
  };

  callback(null, response);
});

module.exports.twitterTweet = function(event, context, callback){
  let statusCode = 200
  let message = 'event added'

  docClient.put({
    TableName: 'SocialEvents',
    Item: {
      time: new Date() + '',
      type: 'Tweet'
    }
  }, (err, data) => {
    if(err){
      console.log(err)
      message = err
    }
  })

  const response = {
    statusCode,
    body: JSON.stringify({
      message,
      input: event,
    }),
  };

  callback(null, response);  
}

module.exports.twitterFollower = function(event, context, callback){
  let statusCode = 200
  let message = 'event added'

  docClient.put({
    TableName: 'SocialEvents',
    Item: {
      time: new Date() + '',
      type: 'TwitterFollower'
    }
  }, (err, data) => {
    if(err){
      console.log(err)
      message = err
    }
  })

  const response = {
    statusCode,
    body: JSON.stringify({
      message,
      input: event,
    }),
  };

  callback(null, response);  
}

module.exports.twitterMention = function(event, context, callback){
  let statusCode = 200
  let message = 'event added'

  docClient.put({
    TableName: 'SocialEvents',
    Item: {
      time: new Date() + '',
      type: 'TwitterMention'
    }
  }, (err, data) => {
    if(err){
      console.log(err)
      message = err
    }
  })

  const response = {
    statusCode,
    body: JSON.stringify({
      message,
      input: event,
    }),
  };

  callback(null, response);  
}

module.exports.twitchFollower = function(event, context, callback){
  let statusCode = 200
  let message = 'event added'

  docClient.put({
    TableName: 'SocialEvents',
    Item: {
      time: new Date() + '',
      type: 'TwitchFollower'
    }
  }, (err, data) => {
    if(err){
      console.log(err)
      message = err
    }
  })

  const response = {
    statusCode,
    body: JSON.stringify({
      message,
      input: event,
    }),
  };

  callback(null, response);  
}

module.exports.twitchStream = function(event, context, callback){
  let statusCode = 200
  let message = 'event added'

  docClient.put({
    TableName: 'SocialEvents',
    Item: {
      time: new Date() + '',
      type: 'TwitchStream'
    }
  }, (err, data) => {
    if(err){
      console.log(err)
      message = err
    }
  })

  const response = {
    statusCode,
    body: JSON.stringify({
      message,
      input: event,
    }),
  };

  callback(null, response);  
}

module.exports.IOpipeEvent = function(event, context, callback){
  let statusCode = 200
  let message = 'event added'

  docClient.put({
    TableName: 'SocialEvents',
    Item: {
      time: new Date() + '',
      type: 'IOpipeEvent'
    }
  }, (err, data) => {
    if(err){
      console.log(err)
      message = err
    }
  })

  const response = {
    statusCode,
    body: JSON.stringify({
      message,
      input: event,
    }),
  };

  callback(null, response);
}

module.exports.getEvents = function(event, context, callback){
  let statusCode = 200
  var params = {
    TableName : "SocialEvents",
    FilterExpression:"attribute_not_exists(#tg)",
    ExpressionAttributeNames: {
      "#tg": (event.queryStringParameters ? event.queryStringParameters.platform + 'Grabbed' : 'tesselGrabbed')
    }
  };

  docClient.scan(params, (err, data) => {
    const response = {
      statusCode,
      body: JSON.stringify({
        message: err || data,
        input: event,
      }),
    };

    callback(null, response);

    if(event && event.queryStringParameters && event.queryStringParameters.platform){
      for(let l=0; l < data.Items.length +25; l+= 25){
        let toBeUpdated = []
        for(let i = 0; (l*25) + i < data.Items.length && i < 25; i++){
          console.log(l, i)
          if(event.queryStringParameters.platform == 'tessel'){
            data.Items[(l*25) + i].tesselGrabbed = 'true';
          } else if(event.queryStringParameters.platform == 'badge') {
            data.Items[(l*25) + i].badgeGrabbed = 'true';
          }
          
          toBeUpdated.push({
            PutRequest: {
              Item: data.Items[(l * 25) + i]
            }
          })
        }
        console.log(toBeUpdated)
        if(toBeUpdated.length > 0){
          docClient.batchWrite({
            RequestItems:{
              SocialEvents: toBeUpdated
            }
          }, 
          (err, data) => {
            if(err){
              console.log(err)
            }
          })
        }
      }
    }
  })


}

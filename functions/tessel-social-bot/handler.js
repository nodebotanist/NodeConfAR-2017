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
      type: 'IOpipe Event'
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
      "#tg": 'tesselGrabbed'
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

    let toBeUpdated = []
    console.log(data)
    for(let i = 0; i < data.Items.length; i++){
      data.Items[i].tesselGrabbed = 'true';
      toBeUpdated.push({
        PutRequest: {
          Item: data.Items[i]
        }
      })
    }

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
  })


}

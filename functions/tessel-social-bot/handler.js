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

  docClient.scan({
    TableName: 'SocialEvents'
  }, (err, data) => {
    const response = {
      statusCode,
      body: JSON.stringify({
        message: err || data,
        input: event,
      }),
    };

    callback(null, response);

    let toBeDeleted = []

    for(let i = 0; i < data.Items.length; i++){
      toBeDeleted.push({
        DeleteRequest: {
          Key: {
            time: data.Items[i].time
          }
        }
      })
    }

    if(toBeDeleted.length > 0){
      docClient.batchWrite({
        RequestItems:{
          SocialEvents: toBeDeleted
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

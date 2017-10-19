'use strict';

const AWS = require('aws-sdk')
var docClient = new AWS.DynamoDB.DocumentClient();

module.exports.githubEvent = (event, context, callback) => {
  let statusCode = 200
  let message = 'event added'

  if(event.repository && event.repository.name){
    docClient.put({
      TableName: 'SocialEvents',
      Item: {
        time: new Date() + '',
        type: 'GitHub Push',
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
};

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

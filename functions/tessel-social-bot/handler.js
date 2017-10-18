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
        "time": new Date().toString,
        type: 'GitHub Push',
        repo: event.repository.name
      }
    }, (err, data) => {
      if(err){
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

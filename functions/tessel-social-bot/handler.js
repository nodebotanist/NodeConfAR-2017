'use strict';

module.exports.githubEvent = (event, context, callback) => {
  let statusCode = 200

  event = JSON.parse(event)

  if(event.repository && event.repository.name){
    console.log(event.repository.name)
  }

  const response = {
    statusCode,
    body: JSON.stringify({
      message: 'Go Serverless v1.0! Your function executed successfully!',
      input: event,
    }),
  };

  callback(null, response);
};

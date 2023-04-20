function styleMongooseErrors(req, res, next) {
    const oldSend = res.send;
  
    res.send = function (data) {
      let responseData = data;
  
      if (typeof responseData === 'object' && responseData !== null) {
        // If the response is an object, check if it has a "message" property and style it accordingly
        if (responseData.hasOwnProperty('message')) {
          responseData.message = '<p style="color: red">' + responseData.message + '</p>';
        }
      }
  
      oldSend.apply(res, arguments);
    };
  
    next();
  }
  
  app.use(styleMongooseErrors);
  
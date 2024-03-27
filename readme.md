### Standard Http Response for server response

```javascript
const express = require('express');
const { HttpResponse } = require('standard-http-response-js');
const app = express();

// response json data as usual it not informative
app.get('/', await (req, res, next) => {
    const data = [] // retrive data from database
    return res.json()
});

// response json data using 'standard-http-response-js'
app.get('/formatted-response', await (req, res, next) => {
    const data = [] // retrive data from database

    // more informative reponse
    const response = HttpResponse.success({
        payload: data,
        statusCode: 11000 // <custom status code>,
        version: 1,
    })
    // 
    // 
    // success() function return following json
    // RESULT: 
    //   {
    //       payload: '<data>'
    //       signature: '<hashed payload signature>'
    //       timestamp: '<IOS date string>',
    //       version: '<api version>',
    //       message: '<your custom message>',
    //       status: 'Succeed' | 'Failed',
    //       type: 'request' | 'OK' | 'heart-beat'
    //   }
    //
    //
    // error() function return following json
    // RESULT: 
    //   {
    //       payload: null
    //       signature: '<hashed payload signature>'
    //       timestamp: '<IOS date string>',
    //       version: '<api version>',
    //       message: '<your custom message>',
    //       status: 'Succeed' | 'Failed',
    //       type: 'error',
    //       error: {
    //          status: '<error status>',
    //          message: '<error message>',
    //          errorMessage: '<error detailed message>',
    //       }
    //   }
    //
    //

    return res.json(response)
})

app.listen(3000, () => {
    const.log('server start listending on port 3000')
})
```
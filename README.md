is_email.js
===========

_is_email.js is a port of the is_email PHP library to Javascript._

is_email validates email address for you using simple javascript function is_email. Validate an email address according to RFCs 5321, 5322 and others.

**Note:- It doesn't not support DNS check for MX records and parsed address components like the PHP is_email does.**


### How to use ?

1. Include is_email.js in your page.
``` html
<script type="text/javascript" src="is_email.js"></script>
```

2. And start validating emails.
``` js
var check = is_email("dominic@isemail.info");
if (check) {
  alert("You have entered correct email address.");
} else {
  alert("Please provide correct email address.");
}
```

### How to use in Node.js ?
``` js
e = require('./is_email.js');
var check = e.is_email("bademailexample@.info");
if (check) {
  console.log("You have entered correct email address.");
} else {
  console.log("Please provide correct email address.");
}
```

### How to use with Require.js ?
``` js
require(['is_email'], function (is_email) {
  var check = is_email("me@umakantpatil.com");
  if (check) {
    alert("You have entered correct email address.");
  } else {
    alert("Please provide correct email address.");
  }
});
```

### How to use with jQuery.js ?
``` js
var check = $.is_email("dominic@isemail.info");
if (check) {
  alert("You have entered correct email address.");
} else {
  alert("Please provide correct email address.");
}
```

### Wanna Donate?

Go to [http://isemail.info](http://isemail.info) and click on donate button at the top-right.

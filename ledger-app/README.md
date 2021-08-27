**#RUNNING THE APP**

To run the app use "nodemon index.js"





**#EXECUTION FLOW**

use something like "Postman" to test this APIs
test the APIs in following order


STEP1
using a POST request to http://localhost:3000/api/users
 and the following as a JSON
 >{
 >  "name"    : "kanishkam",
 >  "email"   :"kanishkam@gmail.com",
 >  "password":"password"
 > }

in request body create a user

refernce-1.Registering User
![](images/1.Registering%20User.png)

STEP 2
using  a POST request to http://localhost:3000/api/auth
and 

>{
 >   "email"   :"kanishkam@gmail.com",
 >   "password":"password"
>}

in request body authenticate the user

ref-2.Authenticating the User
![](images/2.Authenticating%20the%20User.png)

and copy the generated token
ref-3.Copying the Token
![](images/3.Copying%20the%20Token.png)


STEP 3
send a GET request to   http://localhost:3000/api/ledgers?startDate=2020-01-30&endDate=2020-05-07&paymentFrequency=weekly&weeklyRate=555&timeZone=Indian/Maldives
and in request Header send  the jwt token we copied in the earlier step
"x-auth-token":{the token we copied from earlier response header}
and you will be able to see the desired result

reference -4.Getting line items
![](images/4.Getting%20line%20items.png)

*here you can change the query paramets accordingly
for 

query parameters
|startDate      -ISO string
endDate         -ISO string     
paymentFrequency-weekly,fortnightly or monthly(these are  case insensitive)
weeklyRate      -number
timeZone        -a valide TZ database name(https://en.wikipedia.org/wiki/List_of_tz_database_time_zones)
|query parameter |type      |
|--------------- |----      |
|startDate       |ISOstring |      
|endDate         |ISOstring |         
|paymentFrequency|weekly,fortnightly or monthly(these are  case insensitive)|
|weeklyRate      |number    |
|timeZone        |a valide TZ database name(https://en.wikipedia.org/wiki/List_of_tz_database_time_zones) |




**#FOR UNIT TESTING**

Use the command  "npm test"


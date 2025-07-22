# DevTinder API
authRouter
- signup
- login 
- logout

Profile Router
- GET /profile/view
- PATCh /profile/edit
- PATCH /profile/password


status: ignore, interested, accepted, rejected

Connection request router

POST /request/send/interested/:userId
POST /request/send/ignore/:userId
POST /request/review/accepted/:userId
POST /request/review/rejected/:userId

user router
GET user/connections
GET user/requests/received
GET user/feed 
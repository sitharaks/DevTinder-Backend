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

POST /request/send/:status/:userId
POST /request/review/:status/:userId

user router
GET user/connections
GET user/requests/received
GET user/feed 
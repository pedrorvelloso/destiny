## MVP - server (with StreamLabs) ✔️
- [x] StreamLabs listener (with socket.io-client)
- [x] Express server with Inversify
- [x] Service to store new donations from StreamLabs
- [x] Service to list all donations
- [x] Service to list unreviewed donations
- [x] Service to review donations
- [x] Send total/new reviewed donation when a new donation is reviewed
- [x] Set up event (create, start, and finish event)
- [x] Send total donation (per event) in websocket


## Beta ✔️
- [x] Service to create user
- [x] Implement JWT strategy (Authenticate Service & middleware)
- [x] Middleware to ensure authentication
- [x] Validate requests inputs
- [x] Store who reviewed donation
- [x] Create Docker for production

## Release 🔜
- [x] Pagination
- [x] Set up Games
- [x] Donations incentives
- [x] Relation Donation <-> Incentive
- [x] General important cache

## Future 🌎
- [ ] Find way to deal with different currencies
- [ ] Set up event schedule
- [ ] Add donation method w/ StripeJS
- [ ] Listen to stripe webhooks and store new donations
- [ ] Create method to check if there's new donations if application crash/stop working for each listener

## Frontend 🔜
*Soon (in another repo :P)*

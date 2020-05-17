# Destiny

Destiny is a *donation* tracker for speedruns/gaming charity events. In the future I'll also include features to hold donations incentives and create events with schedule.

## MVP - server (with StreamLabs)
- [x] StreamLabs listener (with socket.io-client)
- [x] Express server with Inversify
- [x] Service to store new donations from StreamLabs
- [x] Service to list all donations
- [x] Service to list unreviewed donations
- [x] Service to review donations
- [x] Send total/new reviewed donation when a new donation is reviewed
- [ ] JWT
- [ ] Add simple user system to ensure authentication when reviewing donation

## Beta
- [ ] Set up event
- [ ] Set up event schedule
- [ ] Donations incentives

## Release
- [ ] Add donation method w/ StripeJS
- [ ] Listen to stripe webhooks and store new donations

## Frontend
*Soon (in another repo :P)*

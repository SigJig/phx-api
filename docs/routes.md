
## Available endpoints

The API's endpoints are split into three different sections; `arma`, `internal`, `meta`.
The arma section is what you'll be using most of the time; it contains the endpoints for the live Arma 3 Altis Life data.
The meta section containts static data about the Altis Life server, such as shop prices, item information etc.

The internal section handles the tokens and the users of the API itself.

The base URL for the API is `https://api.phoenixrp.co.uk/`.

### /arma

This endpoint requires a minimum of `arma_perms` `basic` authentication.

* /players
    * GET / - Index of all players

    * /deaths
        * GET / - Index of all deaths
        * GET /:id - Data of specific death
     
    * /:id
        * GET / - Data of specific player
        * PATCH / - Update field(s) on the player

        * GET /deaths - Index of the player's deaths
        * GET /vehicles - Index of the player's vehicles
        * GET /properties - Index of the player's properties
        * GET /moneycache - Index of the player's moneycache

* /gangs
    * GET / - Index of all gangs

    * /alliances
        * GET / - Index of all alliances
        * GET /:id - Data of specific alliance

    * /:id
        * GET / - Data of specific gang
        * GET /alliances - Index of the gang's alliances

* /vehicles
    * GET / - Index of all vehicles
    * GET /:id - Data of specific vehicle

* /properties
    * GET / - Index of all properties
    * GET /:id - Data of specific property

### /internal

Requires internal authentication

* /users
    * POST / - Create new user
    * POST /login - Login

    * /me
        * GET / - Display data on user with the token
        * GET /tokens - Show all of the user's tokens

* /tokens
    * POST / - Create token

    * PATCH /:identifer - Update token
    * GET /:identifier - Get info on token

    * GET /me - Get data on token

### /meta

* /vehicles
    * GET / - Index of all metadata on vehicles
    * GET /:id - Show specific vehicle metadata entry

* /items
    * GET / - Index of all metadata on items
    * GET /:id - Show specific item metadata entry

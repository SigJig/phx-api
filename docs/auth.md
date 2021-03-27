
## Authentication

Most of the endpoints available in the API require authentication. To achieve, you must supply a token with each request.
If no token is supplied the request will return the HTTP status code `401, Unauthorized`. If a token is supplied, but is not valid for that endpoint, the request returns `403, Forbidden`.

In the future, we plan to have a user interface to manage both your user and your tokens.
For the time being however, users and tokens are handled through the REST API itself.
To send requests, we recommend either a command line utility such as `cURL`, or if you'd rather use a GUI, we recommend `Postman`.


In order to create tokens, you must first create a user. With this user you can create multiple tokens, should you require
different permissions or you have multiple projects dependant on our API.

#### Using a bearer token

Your token needs to be included in the `Authorization` header. It is a bearer token, and should be prefixed with the keyword `Bearer`.

Example: `Authorization: Bearer <mytoken>`

Using `cURL`, a basic `GET` request to `/arma/players` using the example token `12i3oj211ias` would look something like this:
```
curl -H 'Autorization: Bearer 12i3oj211ias' -x GET https://api.phoenixrp.co.uk/arma/players
```

The above request then returns status `200, Success`.

Had we not specified the Authorization header, like this:
```
curl -x GET https://api.phoenixrp.co.uk/arma/players
```

we would have gotten the status `401, Unauthorized` back.

#### Creating a user

To create a user, you need to send a `POST` request to the endpoint `/internal/users` (see making requests).
In the body of the request, you must specify your email, username and password (see below).

For example, say we wanted to create a user with the name john_doe, the email johndoe@gmail.com, and the password 123abc.

With `cURL`, this can be achieved like this:
```
curl -d '{"username": "john_doe", "email": "johndoe@gmail.com", "password": "123abc"}' -H "Content-Type: application/json" -X POST https://api.phoenixrp.co.uk/internal/users
```

#### Logging in

When logging in, you will be granted an internal token for managing your user and your tokens. This token is seperate from the ones used to make requests to our game API.

To login, you must send a `POST` request to the endpoint `internal/users/login`.

For example, let's say we want to login with the user we just created: with the username john_doe, and the password 123abc

With `cURL`, we'd send a request similar to the one in Creating a user, with the only parts differing being the endpoint and the body of the request:
```
curl -d '{"username": "john_doe", "password": "123abc"}' -H "Content-Type: application/json" -X POST https://api.phoenixrp.co.uk/internal/users/login
```

#### Creating a token

To create tokens, you need to supply an internal token (see Logging in) for authentication. A basic internal token will allow you to create read-only tokens instantly, aswell as request additional permissions such as faction-specific whitelisting.

Special token permissions are listed below:

| Key | Description |
| --- | ----------- |
| edit_west | Edit player values that are linked to the west faction (APC) |
| edit_east | Edit player values that are linked to the east faction (HAVOC) |
| edit_indep | Edit player values that are linked to the independent faction (NHS) |

To request special permissions, you must include the key in either an array or an object in your request body, named `arma_perms`.

Example request body with `edit_west` permissions:

Using an array:
```json
{
    "arma_perms": ["edit_west"]
}
```

Using an object:
```json
{
    "arma_perms": {
        "edit_west": true
    }
}
```

You can also specify the name, and description of the token, to help distinguish between your tokens, though this is optional.

A simple token, with no special permissions needed, and no need for name and description, can be created without sending a body, like so:

```
curl -H 'Authorization: Bearer <mytoken>' -x POST https://api.phoenixrp.co.uk/internal/tokens
```

With a name, and a need for the `edit_indep` permission, the request might look something like this:
```json
curl -d '{"name": "My Token", "arma_perms": ["edit_indep"]}' -H 'Content-type: application/json' -H 'Authorization: Bearer <mytoken>' -x POST https://api.phoenixrp.co.uk/internal/tokens
```

If you made a succesful request, you should get back a JSON body containing the JWT signature for your token (which is what will be used to make requests), and information about your newly created token.

The response body might look something like this:
```json
{
    "data": {
        "id": 1,
        "user_id": 1,
        "name": "My Token",
        "arma_perms": ["edit_indep"],
        "is_active": true,
        "created_at": "current date",
        "expires_at": "current date + 2weeks"
    },
    "jwt": "randomized string"
}
```
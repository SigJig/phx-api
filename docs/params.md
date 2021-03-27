
## Query Parameters

Query parameters are used in your query to limit the data you want to recieve. It is recommended to use the query parameters to specify exactly the data you need; the size of the data returned can be significantly reduced, making for faster processing on both our end, and on your end.

For example, say you need to get the names of all players who have an id between 1 and 6. We'll use Python for this example.

We won't worry about pagination in this example; Let's just imagine that the data we recieve is sorted ascendingly by `id`, and since by default we recieved the first page of 15 results, id 1 through 6 should be included in that.

Without query parameters, you could achieve this with something like this:
```python
import json
import requests

headers = {'Authorization': 'Bearer <mytoken>'}
response = requests.get('https://api.phoenixrp.co.uk/arma/players', headers=headers)

# Verify that the status code is 200, meaning the request was a success
if response.status_code == 200:
    names = []
    json_data = json.loads(response.text)

    for i in json_data['results']:
        if 1 < i.id < 6:
            names.append(i.name)
    
    print(names)

```

The above example works fine, for that particular case, however, using query parameters, it can be improved signifcantly:
```python
import json
import requests

headers = {'Authorization': 'Bearer <mytoken>'}
response = requests.get('https://api.phoenixrp.co.uk/arma/players?search=id__gt:1,id__lt:6&select=name', headers=headers)

if response.status_code == 200:
    json_data = json.loads(response.text)
    names = [x.name for x in json_data['results']

    print(names)

```

The above example now only returns the items who has an id between 1 and 6, and it only returns the name instead of id, gear, ranks, bank balance etc.

#### Types of query parameters

Currently, there are five query parameters available: 

##### Select

The `select` parameter specifies what fields to return. If not specified, all fields are returned, which can return a response much bigger than it needs to be.

Fields are seperated by commas (for example: `select=name,id`)

There are two types of fields that can be selected; 

There are simple fields, which are simply selected with the name. (E.g. `select=name,id`)

Then, there are nested fields - These are fields that require additional processing on our end, and for that you can only specify 3 nested fields at a time. 

Nested fields are mostly used to request additional information about another resource related to the current resource (for example, when requesting information about a player, you can specify `select=gang[name]` to only return the name of the gang the player is in).

Nested fields take optional parameters, which are basically just simple fields inside square brackets.

For example: `select=idcard[name,age]` or, to return everything about the idcard you can omit the square brackets like so: `select=idcard`

You can combine nested and simple fields. For example, let's say we wanted to select the name, bank balance, and the age on the idcard for the player with the id of `1`:

```
https://api.phoenixrp.co.uk/arma/players/1?select=name,bank,idcard[age]
```

The return would then look something like this:
```json
{
    "results": {
        "name": "Some weirdo",
        "bank": 25000,
        "idcard": {
            "age": 12
        }
    }
}
```

##### Search

The search parameter consists of a key-value pairs, seperated by commas.
The key-value pairs are formatted with a colon (`:`).

This parameter is used to select only items where the condition evaluates to true.
To achieve this, you can either check for exact likeness (e.g. `bank:25000`), or you can use operators.
Operators are appended after the key name, after a double underscore (e.g. `bank__gt:3000`)

There are 5 operators available:

| Value | Description |
| ----- | ----------- |
| gt | `greater than`, `>` |
| gte | `greater than or equal`, `>=` |
| lt | `lower than`, `<` |
| lte | `lower than or equal`, `<=` |
| not | `not`, `!=` |
| eq | `equal`, `==` (Default if no other specified) |

For example, say you wanted to get all players whose id is less than 100, and they have a bank balance between 10,000 and 200,000. With the search query parameter, that could be achieved like so:
```
https://api.phoenixrp.co.uk/arma/players?search=id__lt:100,bank__gt:10000,bank__lt:200000
```

##### Sort

Sort is used to sort the data either descendingly (`desc`), or ascendingly (`asc`).
It consists of the column name, and the direction, seperated by commas.

For example, to get the last players to connect to our server, you could do something like this:
```
https://api.phoenixrp.co.uk/arma/players?sort=id,desc
```

##### Page/count

Page and count are used for pagination. Page specifies what page we are currently on (starting at 0),
and count specifies how many items are on each page.

This is used to split the data into multiple pages, so that the response is not too big to handle.

For example, if we wanted to get the names of the first 500 players, we could split that into 10 pages with 50 items on each page like so:
```
https://api.phoenixrp.co.uk/arma/players?page=0&count=50&sort=id,asc
```

And then, for the next page we do the same request, only that we change the `page` to 1:
```
https://api.phoenixrp.co.uk/arma/players?page=1&count=50&sort=id,asc
```

Endpoints that support pagination will always include a `links` object, which contains both the next and the previous (if you're not on the first page, that is). That way, you don't have to manually increment your page counter; You can just send a request to the first page, and then use the `next` link in the response of that request to go the the next page, and repeat that process until you are at the end.


Using all of the above parameters, we can get the gang tags of the first 10 gangs whose bank is below 10000, sorted ascendingly by id
```
https://api.phoenixrp.co.uk/arma/gangs?select=tag&search=bank__lt:10000&sort=id,asc&count=10&page=0
```
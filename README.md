<p align="center">
  <a href="https://www.twitch.tv/charlyautomatiza"><img alt="Twitch" src="https://img.shields.io/badge/CharlyAutomatiza-Twitch-9146FF.svg" style="max-height: 300px;"></a>
  <a href="https://discord.gg/wwM9GwxmRZ"><img alt="Discord" src="https://img.shields.io/discord/944608800361570315" style="max-height: 300px;"></a>
  <a href="http://twitter.com/char_automatiza"><img src="https://img.shields.io/badge/@char__automatiza-Twitter-1DA1F2.svg?style=flat" style="max-height: 300px;"></a>
  <a href="https://www.youtube.com/c/CharlyAutomatiza?sub_confirmation=1"><img src="https://img.shields.io/badge/CharlyAutomatiza-Youtube-FF0000.svg" style="max-height: 300px;" style="max-height: 300px;"></a>
  <a href="https://www.linkedin.com/in/gautocarlos/"><img src="https://img.shields.io/badge/Carlos%20 Gauto-LinkedIn-0077B5.svg" style="max-height: 300px;" style="max-height: 300px;"></a>
</p>

## K6 Cheat Sheet: Everything a Performance Engineer Should Know (with Examples and Best Practices)

### 1. Introduction to K6

K6 is an open-source tool designed for performance testing. It's great for testing APIs, microservices, and websites at scale, providing developers and testers insights into system performance. This cheat sheet will cover the key aspects every performance engineer should know to get started with K6.

#### What is K6?

K6 is a modern load testing tool for developers and testers that makes performance testing simple, scalable, and easy to integrate into your CI pipeline.

#### When to use it?

- Load testing
- Stress testing
- Spike testing
- Performance bottleneck detection

### 2. K6 Cheat Sheet: Essential Aspects

#### 2.1. Installation

Install K6 via Homebrew or Docker:

```bash
brew install k6
# Or with Docker
docker run -i grafana/k6 run - <script.js
```

#### 2.2. Basic Test with a Public REST API

Here's how to run a simple test using a public REST API.

```js
import http from "k6/http";
import { check, sleep } from "k6";

// Define the API endpoint and expected response
export default function () {
  const res = http.get("https://jsonplaceholder.typicode.com/posts/1");

  // Define the expected response
  const expectedResponse = {
    userId: 1,
    id: 1,
    title:
      "sunt aut facere repellat provident occaecati excepturi optio reprehenderit",
    body: "quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto",
  };

  // Assert the response is as expected
  check(res, {
    "status is 200": (r) => r.status === 200,
    "response is correct": (r) =>
      JSON.stringify(JSON.parse(r.body)) === JSON.stringify(expectedResponse),
  });

  sleep(1);
}
```

##### 2.2.1 Running the test and utilization of web dashboard

To run the test and view the results in a web dashboard, we can use the following command:

```bash
K6_WEB_DASHBOARD=true K6_WEB_DASHBOARD_EXPORT=html-report.html k6 run ./src/rest/jsonplaceholder-api-rest.js
```

This will generate a report in the reports folder with the name html-report.html.

But we also can see the results in the web dashboard by accessing the following URL:

```plaintext
http://127.0.0.1:5665/
```

![k6-web-dashboard-access](https://i.ibb.co/8jMGHmd/k6-web-dashboard-access.png)

Once we access the URL, we can see the results on real time of the test in the web dashboard.

![k6-web-dashboard](https://i.ibb.co/DfTs29Q/k6-web-dashboard.png)

#### 2.3. Test with a Public GraphQL API

Example using a public GraphQL API.

```js
import http from "k6/http";
import { check } from "k6";

// Define the query and variables
const query = `
  query getPokemon($name: String!) {
    pokemon(name: $name) {
      id
      name
      types
    }
  }`;

const variables = {
  name: "pikachu",
};

// Define the test function
export default function () {
  const url = "https://graphql-pokemon2.vercel.app/";
  const payload = JSON.stringify({
    query: query,
    variables: variables,
  });

  // Define the headers
  const headers = {
    "Content-Type": "application/json",
  };

  // Make the request
  const res = http.post(url, payload, { headers: headers });

  // Define the expected response
  const expectedResponse = {
    data: {
      pokemon: {
        id: "UG9rZW1vbjowMjU=",
        name: "Pikachu",
        types: ["Electric"],
      },
    },
  };

  // Assert the response is as expected
  check(res, {
    "status is 200": (r) => r.status === 200,
    "response is correct": (r) =>
      JSON.stringify(JSON.parse(r.body)) === JSON.stringify(expectedResponse),
  });
}
```

### 3. Best Practices for Structuring Performance Projects

#### 3.1. Centralized Configuration

Define global configurations such as performance thresholds, the number of virtual users (VU), and durations in one place for easy modification.

```js
// ./src/config/config.js
export const options = {
  stages: [
    { duration: '1m', target: 100 }, // ramp up to 100 VUs
    { duration: '5m', target: 100 }, // stay at 100 VUs for 5 mins
    { duration: '1m', target: 0 },   // ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests should complete in under 500ms
  },
};
```

#### 3.2. Code Modularity

#### 3.2.1. Constants and Requests for the REST API

Separate code into reusable modules, for example, separating constants and requests from test logic.

For our REST API example, we can create a constants.js file to store the base URL of the API and a requests-jsonplaceholder.js file to store the functions to interact with the API.

```js
// ./src/utils/constants.js
export const BASE_URLS = {
  REST_API: 'https://jsonplaceholder.typicode.com',
};
```

Now we can create the requests-jsonplaceholder.js file to store the functions to interact with the API.

```js
// ./src/utils/requests-jsonplaceholder.js
import { BASE_URLS } from './constants.js';
import http from 'k6/http';

export function getPosts() {
    return http.get(`${BASE_URLS.REST_API}/posts`);
}

export function getPost(id) {
    return http.get(`${BASE_URLS.REST_API}/posts/${id}`);
}

export function createPost(post) {
    return http.post(`${BASE_URLS.REST_API}/posts`, post);
}

export function updatePost(id, post) {
    return http.put(`${BASE_URLS.REST_API}/posts/${id}`, post);
}

export function deletePost(id) {
    return http.del(`${BASE_URLS.REST_API}/posts/${id}`);
}
```

#### 3.2.2. Integration of Requests in the Test Script of the REST API

Finally, we can create our test script to use the functions we created in the requests-jsonplaceholder.js file.

```js
// ./src/jsonplaceholder-api-rest.js
import { check, sleep } from "k6";
import { getPost, createPost, updatePost, deletePost } from "../utils/requests-jsonplaceholder.js";
import { options } from "../config/options.js";

export default function () {
  // GET request
  let res = getPost(1);
  check(res, {
    "GET status is 200": (r) => r.status === 200,
    "GET response has correct id": (r) => JSON.parse(r.body).id === 1,
  });

  // POST request
  const newPost = {
    title: "foo",
    body: "bar",
    userId: 1,
  };
  res = createPost(newPost);
  check(res, {
    "POST status is 201": (r) => r.status === 201,
    "POST response has id": (r) => JSON.parse(r.body).id !== undefined,
  });

  // PUT request
  const updatedPost = {
    id: 1,
    title:
      "sunt aut facere repellat provident occaecati excepturi optio reprehenderit",
    body: "quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto",
  };
  res = updatePost(1, updatedPost);
  check(res, {
    "PUT status is 200": (r) => r.status === 200,
    "PUT response has updated title": (r) =>
      JSON.parse(r.body).title === "foo updated",
  });

  // DELETE request
  res = deletePost(1);
  check(res, {
    "DELETE status is 200": (r) => r.status === 200,
  });

  sleep(1);
}
```

Our script code is now much simpler to understand, and if something changes in the URL, parameters or if a new method needs to be added, the place where the changes need to be made is centralised, making our solution simpler to extend over time.

We could further improve our scripts by creating more atomic functions that we can reuse to create more complex scenarios in the future if necessary, it is getting simpler to understand what our test script does.

```js
// ./src/jsonplaceholder-api-rest.js
import { check, sleep } from "k6";
import { getPost, createPost, updatePost, deletePost } from "../utils/requests-jsonplaceholder.js";
import { options } from "../config/options.js";

// Function to test GET request
function testGetPost(id) {
  let res = getPost(id);
  check(res, {
    "GET status is 200": (r) => r.status === 200,
    "GET response has correct id": (r) => JSON.parse(r.body).id === id,
  });
}

// Function to test POST request
function testCreatePost(post) {
  let res = createPost(post);
  check(res, {
    "POST status is 201": (r) => r.status === 201,
    "POST response has id": (r) => JSON.parse(r.body).id !== undefined,
  });
}

// Function to test PUT request
function testUpdatePost(id, post) {
  let res = updatePost(id, post);
  check(res, {
    "PUT status is 200": (r) => r.status === 200,
    "PUT response has updated title": (r) => JSON.parse(r.body).title === post.title,
  });
}

// Function to test DELETE request
function testDeletePost(id) {
  let res = deletePost(id);
  check(res, {
    "DELETE status is 200": (r) => r.status === 200,
  });
}

// Main function
export default function () {
  testGetPost(1);

  const newPost = {
    title: "foo",
    body: "bar",
    userId: 1,
  };
  testCreatePost(newPost);

  const updatedPost = {
    id: 1,
    title: "sunt aut facere repellat provident occaecati excepturi optio reprehenderit",
    body: "quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto",
  };
  testUpdatePost(1, updatedPost);

  testDeletePost(1);

  sleep(1);
}
```

#### 3.2.3. Constants and Requests for the GraphQL API

We can modify the constants.js file to add the base URL of the GraphQL API and the headers we need to use.

```js
// ./src/utils/constants.js
export const BASE_URLS = {
  REST_API: 'https://jsonplaceholder.typicode.com',
  GRAPHQL_POKEMON: 'https://graphql-pokemon2.vercel.app',
};

export const HEADERS = {
  'Content-Type': 'application/json',
};
```

Now we can create the requests-graphql-pokemon.js file to store the functions to interact with the GraphQL API.

```js
// ./src/utils/requests-graphql-pokemon.js
import { BASE_URLS, HEADERS } from "./constants.js";
import http from "k6/http";

// Get a pokemon by name and return the fields specified in the fields array
export function getPokemon(name, fields = ["id", "name", "types"]) {
  const fieldsString = fields.join(" ");
  const query = `
    query getPokemon($name: String!) {
      pokemon(name: $name) {
        ${fieldsString}
      }
    }
  `;
  const pokemonVariables = { name: name };
  const payload = JSON.stringify({ query: query, variables: pokemonVariables });

  return http.post(BASE_URLS.GRAPHQL_POKEMON, payload, { headers: HEADERS });
}
```

#### 3.2.4. Integration of Requests in the Test Script of the GraphQL API

In this moment we can create our test script to use the functions we created in the requests-graphql-pokemon.js file. We will create a simple test script that will get the data of a pokemon and check if the response is successful.

```js
// ./src/pokemon-graphql-test.js
import { check } from "k6";
import { getPokemon } from "../utils/requests-graphql-pokemon.js";

// Define the test function
export default function () {
  const res = getPokemon("pikachu");

  // Define the expected response
  const expectedResponse = {
    data: {
      pokemon: {
        id: "UG9rZW1vbjowMjU=",
        name: "Pikachu",
        types: ["Electric"],
      },
    },
  };

  // Assert the response is as expected
  check(res, {
    "status is 200": (r) => r.status === 200,
    "response is correct": (r) =>
      JSON.stringify(JSON.parse(r.body)) === JSON.stringify(expectedResponse),
  });
}
```

In the same way as for the example of api rest, we can improve our script by creating more atomic functions that we can reuse to create more complex scenarios in the future if necessary, it is getting simpler to understand what our test script does.

There is still a better way to optimise and have a better parameterisation of the response and request results, what do you imagine we could do?

#### 3.3. Dynamic Data and Parameterization

Use dynamic data to simulate more realistic scenarios and load different data sets. K6 allows us to use shared arrays to load data from a file. Shared arrays are a way to store data that can be accessed by all VUs.

We can create a users-config.js file to load the users data from a JSON file ./data/users.json.

```json
[
    { "id": 1 },
    { "id": 2 },
    { "id": 3 },
    { "id": 4 },
    { "id": 5 },
    { "id": 6 },
    { "id": 7 },
    { "id": 8 },
    { "id": 9 },
    { "id": 10 }
]
```

```js
// ./src/config/users-config.js
import { SharedArray } from 'k6/data';

export const users = new SharedArray('User data', function () {
  return JSON.parse(open('../data/users.json')); // Load from a file
});
```

And then we can use it in our test script.

```js
// ./src/jsonplaceholder-api-rest.js
import { check, sleep } from "k6";
import { getPost } from "../utils/requests-jsonplaceholder.js";
import { options } from "../config/options.js";
import { users } from "../config/users-config.js";
// Function to test GET request
function testGetPost(id) {
  let res = getPost(id);
  check(res, {
    "GET status is 200": (r) => r.status === 200,
    "GET response has correct id": (r) => JSON.parse(r.body).id === id,
  });
}

// Main function
export default function () {
  const user = users[Math.floor(Math.random() * users.length)];

  testGetPost(user.id);
  sleep(1);
}
```

### 4. Project Structure

A well-organized project structure helps in maintaining and scaling your tests. Here's a suggested folder structure:

```plaintext
/project-root
│
├── /src
│   ├── /graphql
│   │   ├── pokemon-graphql-test.js      # Test for GraphQL Pokémon API
│   │   ├── other-graphql-test.js        # Other GraphQL tests
│   │
│   ├── /rest
│   │   ├── jsonplaceholder-api-rest.js # REST API test for JSONPlaceholder
│   │   ├── other-rest-test.js          # Another REST API test
│   │
│   └── performance-scenarios.js  # Script combining multiple performance tests
│
├── /utils
│   ├── requests-graphql-pokemon.js # Reusable functions for GraphQL requests
│   ├── requests-jsonplaceholder.js # Reusable functions for REST requests
│   ├── checks.js                   # Reusable validation functions
│   ├── constants.js             # Global constants, like URLs or headers
│
├── /config
│   ├── options.js                # Global configuration options
│   ├── users-config.js           # Configuration for users data
│
├── /reports
│   └── results.html             # Output file for results (generated after running tests)
│
├── /data
│   └── users.json             # Users data
│
├── README.md                    # Project documentation
└── .gitignore                   # Files and folders ignored by Git
```

This structure helps in keeping your project organized, scalable, and easy to maintain, avoiding clutter in the project root.

Another option would be to group test scripts into folders by functionality, you can test and compare what makes the most sense for your context. For example, if your project about a wallet that makes transactions, you could have a folder for each type of transaction (deposit, withdrawal, transfer, etc.) and inside each folder you could have the test scripts for that specific transaction.

```plaintext
/project-root
│
├── /src
│   ├── /deposit
│   │   ├── deposit-test-1.js      # Test for deposit
│   │   ├── deposit-test-2.js      # Another deposit test
│   │
│   ├── /withdrawal
│   │   ├── withdrawal-test-1.js      # Test for withdrawal
│   │   ├── withdrawal-test-2.js      # Another withdrawal test
│   │
│   ├── /transfer
│   │   ├── transfer-test-1.js      # Test for transfer
│   │   ├── transfer-test-2.js      # Another transfer test
│   │
│   └── performance-scenarios.js  # Script combining multiple performance tests
│
├── /utils
│   ├── requests-deposit.js # Reusable functions for deposit
│   ├── requests-withdrawal.js # Reusable functions for withdrawal
│   ├── requests-transfer.js # Reusable functions for transfer
│   ├── checks.js             # Reusable validation functions
│   ├── constants.js          # Global constants, like URLs or headers
│
├── /config
│   ├── options.js                # Global configuration options
│   ├── users-config.js           # Configuration for users data
│   ├── accounts-config.js        # Configuration for accounts data
│
├── /reports
│   └── results.html             # Output file for results (generated after running tests)
│
├── /data
│   └── users.json             # Users data
│   └── accounts.json          # Accounts data
│
├── README.md                    # Project documentation
└── .gitignore                   # Files and folders ignored by Git
```

On this second example, we have a more complex data structure, but we can still reuse the same requests functions that we created for the first example.

### Conclusion

Performance testing with K6 is critical for identifying bottlenecks and ensuring application scalability. By following best practices such as modularizing code, centralizing configurations, and using dynamic data, engineers can create maintainable and scalable performance testing scripts.

Big hug.

`Charly Automatiza`

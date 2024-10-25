import { check } from "k6";
import { getPokemon } from "../utils/requests-graphql-pokemon.js";
import { options } from "../config/options.js";

export { options };

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

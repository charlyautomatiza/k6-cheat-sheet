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

import { check, sleep } from "k6";
import {
  getPost,
  createPost,
  updatePost,
  deletePost,
} from "../utils/requests-jsonplaceholder.js";
import { options } from "../config/options.js";

export { options };

export default function () {
  // Prueba GET
  let res = getPost(1);
  check(res, {
    "GET status is 200": (r) => r.status === 200,
    "GET response has correct id": (r) => JSON.parse(r.body).id === 1,
  });

  // Prueba POST
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

  // Prueba PUT
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

  // Prueba DELETE
  res = deletePost(1);
  check(res, {
    "DELETE status is 200": (r) => r.status === 200,
  });

  sleep(1);
}

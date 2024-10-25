import { SharedArray } from 'k6/data';

export const users = new SharedArray('User data', function () {
  return JSON.parse(open('../data/users.json')); // Load from a file
});

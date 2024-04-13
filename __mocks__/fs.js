import { vi } from "vitest";

export const promises = {
  writeFile: vi.fn((path, data) => {
    return new Promise((resolve, reject) => {
      resolve();
    });
  }),
};

/* 
1- Exporting a const called promises which is an object that has the right file method.
-- It should have this method because the original promises object by the fs module has the right file method.
2- We now want to replace it with our own function. Therefore we will use a spy function so we can
easly keep track of the executions.
--Therefore we will create a custom function with help of vitest or jest => import vi from vitest
3- Then we call vi.fn() and that's our value for the right file but we can add now our own implementation.
By passing a function to vi.fn().
-- What we can do is to make sure that we return a promise Because origianlly, writeFile doesn't return 
a promise. And because of our mocking, it doesn't anymore.
4-  So we can replace the default replacement with a writefile which was an empty function with a function
which has our own implementation where then we do get (path, data) like the original writeFile.
5- We return a new promise. This promise will receive a function that's default is a javascript code and not
 testing specific.
 - This function has two arguments which it gets resolved and rejects and we will also add something
 to check the incoming arguments (path, data) and reject if they are not set.
 --Then inside this function => i will resolve(); to nothing like the original write file

*/

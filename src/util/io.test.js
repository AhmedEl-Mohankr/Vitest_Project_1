import { it, expect, vi } from "vitest";
import { promises as fs } from "fs";

import writeData from "./io";
// It is better to make have the mock replacement in a seperate file so you can always know where to tweak it.
//There is one feature that is supported by Jest and Vitest which you can create a special folder. => __mocks__
//This unique name will allow Jest and vitest to search for it whenever you call mock. 
//Under this folder, you can have the file names of the modules you want to mock away. For example fs.js if you want to have your own implementation for the file system module.

vi.mock("fs");
vi.mock("path", () => {
  return {
    default: {
      join: (...args) => {
        return args[args.length - 1];
      },
    },
  };
});

it("should execute the writeFile method", () => {
  const testData = "Test";
  const testFilename = "test.txt";

  writeData(testData, testFilename);

  // return expect(writeData(testData, testFilename)).resolves.toBeUndefined();
  // expect(fs.writeFile).toBeCalled();
  expect(fs.writeFile).toBeCalledWith(testFilename, testData);
});

/* Please note when testing returned files functions,
 the function should be worked first and the data.txt should be received before testing
  otherwise the test will fail because it doesn't find a data folder and the promise was
  rejected.
   */

/*
Write test for the writeData function:
(Testing if it will execute the writeFile method.)
1-Create a testData. 
2- create a testFileName with .txt
3- the test should expect writeData function with two arguments passed into it (testData and testFile)
4- Question => how can we now test whether it has succeeded? How can we test whether writeFile method
was called? 

-- It's noticeable that writeFile yields a promise.
And if that promise is not rejected and if it is resolved instead then the test was successful.
That means that writeFile was called and worked.

5- We will use resolves with expect(writeData()).resolves
6- Using any of toBe methods depends on which values the promises resolves and
 in our case it doesn't resolve any value at all but it does resolve at all and it is not rejected.
 7- We want to check that the value is 1- resolved  2- expect the value to be not undefined. 
 (Because we won't get any value).
8- Then use .toBeUndefined() to make sure that this worked.
9- We need to return the expect() function to make sure that ViTest will wait until this is done.
So that we evaluate the expect function and if it was resolve. 
*/

/* It hard when interacting with external dependencies or upper system such as a database that you 
might remove data by mistake because we are dealing with something outside the program and the code.  

This called side effect.

When writing tests, we need to avoid accidentally change or delete or insert data into production 
database or cluttering up local file system.

We need to get rid of such side effects as it is not the test responsibility if an third party code
is failing. 
   */

/* Mocks (behavior testing) VS Stubs(state Testing/ condition testing)
----------------------------------------------------------------

Mocks:
------
objects pre-programmed with expectations which form a specification of the calls they are expected 
to receive. (something that runs fake business logic instead of the real one).

Test lifecycle with Mocks:
--------------------------
1- Setup Data => Prepare object that is being tested.
2- Setup expectations => prepare expectations in mock that is being used by primary object.
3- Exercise => Test the functionality.
4- Verify Expectations => Verify that the correct methods have been invoked in mock.
5- Verify state => Use asserts to check object's state.
6- TearDown => Clean up resources.
----------------------------------------------------------------

Stubs: 
Provide canned responses to the calls made during the test. Usually not responding at all
to anything outside what is programmed in for the test. 
Stubs may also record information about calls, such as email gateway stub that remembers the messages
it 'sent' or maybe only how many messages it sent.

Test lifecycle with stubs:
1- setup => prepare objects that is being tested and its stubs collaborators.
2- Exercise => Test the functionality.
3- Verify state => Use asserts to check object 'state'.
4- TearDown => Clean up resources.

----------------------------------------------------------------

Principle:
---------
According to the the principle of Test only one thing per test. There may be several stubs in one
test, but generally there is only one mock 


Spies:
------
Are in the end 'Wrappers' around your functions. Or empty replacements for functions that allow you
track if and how a function was called and maybe which arguments were received. 

When do you use Spies?
- You can use Spies if you don't care about what the function does but you just wanna know whether 
it was executed. Then you can either:
1- wrap the original function with a spy object
2- or you replace the function (more common) because it also allows you to get rid of a side effect.



Mocks:
------
Mocks are also about replacement.
A replacement for an bigger part of an API (of a certain module or code)
 that may provide some test-basic behavior instead.
 You also often implement some test specific logic in the replacement function that does something
 else than the original function but helps you testing different scenarios.

 In the following mock("") method: vi.mock("fs");
 - "We pass here the name of the module OR the path to the module that should be mocked" within the ().
 - This works both with built in or third party module But also with your own module. and your own files.
 - In the following example, we don't need add any extra configuration to the mock method.
 - This mock method will kick off Vitest or Jest's auto-mocking algorithm. 
 - It will basically find this module and replace all the functions in there with empty spy
 functions.
 - Now if we call writeData, it should no longer write this test.txt file in the data folder.
 Because for for our tests here, the file system module provided (fs) by note is replaced by this
 mock version which has only empty functions that don't do anything. This will not effect 
 the production code. Therefore this won't be active. It is only during testing.
 -- If run npm test after removing data.txt, we see an error because the logic in there is 
 no longer working.
 -- Because we are looking for a promise that resolves no value but since all the functions 
 in the mocked module are replaced with empty modules. We no longer get back a promise that
 would resolve.
 - To fix this issue, we need to change our assertion.
 - We need to import promises as fs from "fs". This is the file system module which was mocked
 and it is all the mocked in io.js. this file has all these empty spy functions inside of it =>
 thanks to vi.mock("fs").

 - Now we can add a new assertion where we check fs.writeFile and we checked that this was called 
 by using toBeCalled().
 - Here we should still call writeData() and pass our testData and testFileName.
 - So after the writeData function ran, we expect fs.writeFile built in method to have been executed.
   */

/* Please note: (Mocks)
1- The mock method only impact the test and not the code in production.
2- The mock method is hoisted automatically to the top.
3- In "Jest" you have to call the file [jest.mock()] at the top of the file before you have
any imports. 'Because we want to make sure that the fs file was mocked away before we import.
4- With Vitest, you don't need to do the same as it is automatically moved to the top behind the scenes.
5- This mock is only available for this test file only.
6- If you have other tests files that mock the fs file then Vitest will automatically sorts the 
tests that the unmocked files the files that use this module where you don't call the mock are 
executed first so they get the unmocked modules.
   */

/* Please note: (Spies) => They are often empty functions that do have some tracker that
  Keeps track if they have been executed, for example.
- Instead, we can also formulate different expectations when working with spies.
In the data.test.js and specifically for its expectation:
we can use .toBeCalledTimes() => so we can check that it was called multiple times.OR
for specific amount of times such as:


Case: expect(logger).toBeCalledTimes(2); => I am checking if the logger was called twice.
And if I run the test it will (result)fail as because indeed it was only called once by generateReportData()..

In addition, we can also use toBeCalledWith(); => Here you can check which arguments were
passed to the function when it was called.



   */

/* Custom Mocking Logic:
 ------------------------
 For these empty functions => vi.fn(); 
 ------------------------------------------------
 Whenever you create such an empty function, you can actually pass a function to the fn() method:
 vi.fn(() => {});. and this function which you pass will then be used as an implementation for this
 dummy function that is created. 
 
 -By default, it is an empty function that doesn't do anything. But sometimes, you want some 
 test-specific behavior and you can then pass a function to fn() to create such a spy function
 which still keeps track of executions and so on But which has some behavior.

 It is not something we need in the example below for the logger but it is something that can help in 
 io.test.js. Because we might be interested in finding out which arguments were passed to 
 writeFile().
 We wanna make sure that our testData was passed to it specifically. We might that our fileName
 is respected.

- If we looked at io.js, we see that creating that path, that full path [path.join(process.cwd(), 'data', fileName)] is a bit more complex.
And we are actually using another build in module for that.
Be creative to simplify your test:
IF I wanna test whether writeFile was called with the data we passed to writeData, then we pass
the testData and the fileName.and the file name should be somewhere in the path that is created.

To get the test that we want:
-------------------
1- We can also mock away path. The path module which we are using here in io.js.
2- In this test, I can only care about the replacement path of the join method.
However, getting an empty function is not sufficient that just track of executions.
3- I want to create a storage method that returns a storagePath but I want to simplify the function.
So the the returned storagePath in the end is just a fileName because that allows me to check 
whether the fileName is used to writeFile because we use the storagePath there.
Checking that will be simple. We will need to store the full file name path but since we 
don't execute writeFile method anyways, then we don't have to worry about it. 


- This can be easily be done by passing a second argument which is a function to mock method:
vi.mock("path", () => {}); This will help you to set your own replacements or your own 
implementation.

Note: If you passed a function as second argument to the mock method, then in this function, 
you can return => an object which instead will be used as a replacement for the module you are 
mocking away so in this case, it is the path.
And we will replace the join() method with a default: key which is abject and then there you have your
join method.
This is required because for the path module, we are actually importing it like this. 
We are using the default export import path from 'path'; which is different than using a named
export like that import {promises as fs} from 'fs';
The default: {} here is required name which will hold itself an object and
 there we can set up our join() method.
 We can return here is in the end, is the test fileName.
 - Join()takes an infinite amount of arguments and we can use the 'REST parameters' syntax=> (...args).
-This REST parameter will gather all the arguments we get. Potentially super long list into one array.
Then we wanna get the last element of that array(the fileName).
return {
    default: { 
        join: (...args) => {
          return args[args.length - 1]; 
          
      }
    },
  };

  Now we can go to data.test.js and change our expectations => 
  we expect that fs.writeFile is of course called with certain arguments:first argument is testFileName 
  and second argument is testData. 
  expect.(fs.writeFile).toBeCalledWith(testFileName, testData);
  Now thanks to changes to the path, that should be the case.
   */

  it("should return a promise that resolves to no value if called correctly", () => {
    const testData = "Test";
    const testFilename = "test.txt";

    writeData(testData, testFilename);

    return expect(writeData(testData, testFilename)).resolves.toBeUndefined();
    // expect(fs.writeFile).toBeCalled();
    //expect(fs.writeFile).toBeCalledWith(testFilename, testData);
  });
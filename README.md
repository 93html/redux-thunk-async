# redux-thunk-async
[![npm](https://img.shields.io/npm/v/redux-thunk-async.svg?maxAge=2592000)](https://img.shields.io/npm/v/npm.svg?maxAge=2592000)
[![npm](https://img.shields.io/npm/dt/redux-thunk-async.svg?maxAge=2592000)](https://www.npmjs.com/package/redux-thunk-async)

usage
```js
import thunkWidthAsync from 'redux-thunk-async';

const middleWares = [
    thunkWithAsync,
    // other middleWares...
];
const createStoreWithMiddleware = applyMiddleware(...middleWares)(createStore);

createStoreWithMiddleware(reducers);
```

regular thunk action
```js
export function bar(foo) {
    return {
        type: 'BAR',
        foo,
    };
}

export function test(foo) {
    return dispatch => {
        dispatch(bar(foo));

        return {
            type: 'TEST',
            test: foo,
        };
    };
}

```
regular async action
```js
export function getRepos(url) {
    return {
        types: [
            actionTypes.REPOS_REQUEST,
            actionTypes.REPOS_SUCCESS,
            actionTypes.REPOS_FAILURE,
        ],
        payload: {
            repos: api.getRequest(url).then(res => res.json()),
        },
    };
}
```

async thunk action
```js
export function getUser(adminID) {
    return dispatch => ({
        types: [
            actionTypes.USER_REQUEST,
            actionTypes.USER_SUCCESS,
            actionTypes.USER_FAILURE,
        ],
        payload: {
            user: api.user(adminID)
                .then(res => res.json())
                .then(json => {
                    dispatch(getRepos(json.repos_url));
                    return json;
                }),
            adminID,
        },
    });
}
```

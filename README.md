# redux-thunk-async
usage
```
import thunkWidthAsync from 'redux-thunk-async';

const middleWares = [
    thunkWithAsync,
    // other middleWares...
];
const createStoreWithMiddleware = applyMiddleware(...middleWares)(createStore);

createStoreWithMiddleware(reducers);
```

regular thunk action
```
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
```
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
```
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

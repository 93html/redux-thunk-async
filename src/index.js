const isPromise = obj => obj && typeof obj.then === 'function';
const hasPromiseProps = obj => Object.keys(obj).some(key => isPromise(obj[key]));

const getNonPromiseProperties = obj => {
    return Object.keys(obj)
        .filter(key => !isPromise(obj[key]))
        .reduce((acc, key) => {
            acc[key] = obj[key];
            return acc;
        }, {});
};

const resolveProps = obj => {
    const props = Object.keys(obj);
    const values = props.map(prop => obj[prop]);

    return Promise
        .all(values)
        .then(resolvedArray => {
            return props.reduce((acc, prop, index) => {
                acc[prop] = resolvedArray[index];
                return acc;
            }, {});
        });
};

export default store => next => action => {
    function asyncAction(act) {
        const { types, payload } = act;

        if (!types || !payload || !hasPromiseProps(act.payload)) {
            return next(act);
        }

        const nonPromiseProperties = getNonPromiseProperties(payload);

        const [PENDING, RESOLVED, REJECTED] = types;

        const pendingAction = { type: PENDING, payload: nonPromiseProperties };
        const successAction = { type: RESOLVED };
        const failureAction = { type: REJECTED, error: true, meta: nonPromiseProperties };

        if (act.meta) {
            [pendingAction, successAction, failureAction].forEach(nextAction => {
                nextAction.meta = {
                    ...nextAction.meta,
                    ...act.meta,
                }
            });
        }

        next(pendingAction);

        return resolveProps(payload).then(
          results => {
              return next({ ...successAction, payload: results })
          },
          error => next({ ...failureAction, payload: error })
        );
    }

    if (typeof action === 'function') {
        const newAction = action(store.dispatch, store.getState);

        if (newAction && newAction.type) {
            return next(newAction);
        } else {
            return asyncAction(newAction);
        }
    }

    return asyncAction(action);
};

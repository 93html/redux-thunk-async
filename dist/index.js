'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var isPromise = function isPromise(obj) {
	return obj && typeof obj.then === 'function';
};
var hasPromiseProps = function hasPromiseProps(obj) {
	return Object.keys(obj).some(function (key) {
		return isPromise(obj[key]);
	});
};

var getNonPromiseProperties = function getNonPromiseProperties(obj) {
	return Object.keys(obj).filter(function (key) {
		return !isPromise(obj[key]);
	}).reduce(function (acc, key) {
		acc[key] = obj[key];
		return acc;
	}, {});
};

var resolveProps = function resolveProps(obj) {
	var props = Object.keys(obj);
	var values = props.map(function (prop) {
		return obj[prop];
	});

	return Promise.all(values).then(function (resolvedArray) {
		return props.reduce(function (acc, prop, index) {
			acc[prop] = resolvedArray[index];
			return acc;
		}, {});
	});
};

exports.default = function (store) {
	return function (next) {
		return function (action) {
			function asyncAction(act) {
				var types = act.types;
				var payload = act.payload;


				if (!types || !payload || !hasPromiseProps(act.payload)) {
					return next(act);
				}

				var nonPromiseProperties = getNonPromiseProperties(payload);

				var _types = _slicedToArray(types, 3);

				var PENDING = _types[0];
				var RESOLVED = _types[1];
				var REJECTED = _types[2];


				var pendingAction = { type: PENDING, payload: nonPromiseProperties };
				var successAction = { type: RESOLVED };
				var failureAction = { type: REJECTED, error: true, meta: nonPromiseProperties };

				if (act.meta) {
					[pendingAction, successAction, failureAction].forEach(function (nextAction) {
						nextAction.meta = _extends({}, nextAction.meta, act.meta);
					});
				}

				next(pendingAction);

				return resolveProps(payload).then(function (results) {
					return next(_extends({}, successAction, { payload: results }));
				}, function (error) {
					return next(_extends({}, failureAction, { payload: error }));
				});
			}

			if (typeof action === 'function') {
				var newAction = action(store.dispatch, store.getState);

				if (newAction && newAction.type) {
					return next(newAction);
				} else {
					return asyncAction(newAction);
				}
			}

			return asyncAction(action);
		};
	};
};

// \0rolldown/runtime.js
var e = Object.create, t = Object.defineProperty, n = Object.getOwnPropertyDescriptor, r = Object.getOwnPropertyNames, i = Object.getPrototypeOf, a = Object.prototype.hasOwnProperty, o = (e, t) => () => (t || (e((t = { exports: {} }).exports, t, t.exports), e = null), t.exports), s = (e, i, o, s) => {
	if (i && typeof i == "object" || typeof i == "function") for (var c = r(i), l = 0, u = c.length, d; l < u; l++) d = c[l], !a.call(e, d) && d !== o && t(e, d, {
		get: ((e) => i[e]).bind(null, d),
		enumerable: !(s = n(i, d)) || s.enumerable
	});
	return e;
}, c = (n, r, o) => (o = n == null ? {} : e(i(n)), s(r || !n || !n.__esModule || !a.call(n, "default") ? t(o, "default", {
	value: n,
	enumerable: !0
}) : o, n)), l = /* @__PURE__ */ o(((e) => {
	var t = Symbol.for("react.transitional.element"), n = Symbol.for("react.portal"), r = Symbol.for("react.fragment"), i = Symbol.for("react.strict_mode"), a = Symbol.for("react.profiler"), o = Symbol.for("react.consumer"), s = Symbol.for("react.context"), c = Symbol.for("react.forward_ref"), l = Symbol.for("react.suspense"), u = Symbol.for("react.memo"), d = Symbol.for("react.lazy"), f = Symbol.for("react.activity"), p = Symbol.for("react.view_transition"), m = Symbol.iterator;
	function h(e) {
		return typeof e != "object" || !e ? null : (e = m && e[m] || e["@@iterator"], typeof e == "function" ? e : null);
	}
	var g = {
		isMounted: function() {
			return !1;
		},
		enqueueForceUpdate: function() {},
		enqueueReplaceState: function() {},
		enqueueSetState: function() {}
	}, _ = Object.assign, v = {};
	function y(e, t, n) {
		this.props = e, this.context = t, this.refs = v, this.updater = n || g;
	}
	y.prototype.isReactComponent = {}, y.prototype.setState = function(e, t) {
		if (typeof e != "object" && typeof e != "function" && e != null) throw Error("takes an object of state variables to update or a function which returns an object of state variables.");
		this.updater.enqueueSetState(this, e, t, "setState");
	}, y.prototype.forceUpdate = function(e) {
		this.updater.enqueueForceUpdate(this, e, "forceUpdate");
	};
	function b() {}
	b.prototype = y.prototype;
	function ee(e, t, n) {
		this.props = e, this.context = t, this.refs = v, this.updater = n || g;
	}
	var te = ee.prototype = new b();
	te.constructor = ee, _(te, y.prototype), te.isPureReactComponent = !0;
	var x = Array.isArray;
	function ne() {}
	var S = {
		H: null,
		A: null,
		T: null,
		S: null
	}, re = Object.prototype.hasOwnProperty;
	function C(e, n, r) {
		var i = r.ref;
		return {
			$$typeof: t,
			type: e,
			key: n,
			ref: i === void 0 ? null : i,
			props: r
		};
	}
	function ie(e, t) {
		return C(e.type, t, e.props);
	}
	function ae(e) {
		return typeof e == "object" && !!e && e.$$typeof === t;
	}
	function oe(e) {
		var t = {
			"=": "=0",
			":": "=2"
		};
		return "$" + e.replace(/[=:]/g, function(e) {
			return t[e];
		});
	}
	var se = /\/+/g;
	function ce(e, t) {
		return typeof e == "object" && e && e.key != null ? oe("" + e.key) : t.toString(36);
	}
	function w(e) {
		switch (e.status) {
			case "fulfilled": return e.value;
			case "rejected": throw e.reason;
			default: switch (typeof e.status == "string" ? e.then(ne, ne) : (e.status = "pending", e.then(function(t) {
				e.status === "pending" && (e.status = "fulfilled", e.value = t);
			}, function(t) {
				e.status === "pending" && (e.status = "rejected", e.reason = t);
			})), e.status) {
				case "fulfilled": return e.value;
				case "rejected": throw e.reason;
			}
		}
		throw e;
	}
	function le(e, r, i, a, o) {
		var s = typeof e;
		(s === "undefined" || s === "boolean") && (e = null);
		var c = !1;
		if (e === null) c = !0;
		else switch (s) {
			case "bigint":
			case "string":
			case "number":
				c = !0;
				break;
			case "object": switch (e.$$typeof) {
				case t:
				case n:
					c = !0;
					break;
				case d: return c = e._init, le(c(e._payload), r, i, a, o);
			}
		}
		if (c) return o = o(e), c = a === "" ? "." + ce(e, 0) : a, x(o) ? (i = "", c != null && (i = c.replace(se, "$&/") + "/"), le(o, r, i, "", function(e) {
			return e;
		})) : o != null && (ae(o) && (o = ie(o, i + (o.key == null || e && e.key === o.key ? "" : ("" + o.key).replace(se, "$&/") + "/") + c)), r.push(o)), 1;
		c = 0;
		var l = a === "" ? "." : a + ":";
		if (x(e)) for (var u = 0; u < e.length; u++) a = e[u], s = l + ce(a, u), c += le(a, r, i, s, o);
		else if (u = h(e), typeof u == "function") for (e = u.call(e), u = 0; !(a = e.next()).done;) a = a.value, s = l + ce(a, u++), c += le(a, r, i, s, o);
		else if (s === "object") {
			if (typeof e.then == "function") return le(w(e), r, i, a, o);
			throw r = String(e), Error("Objects are not valid as a React child (found: " + (r === "[object Object]" ? "object with keys {" + Object.keys(e).join(", ") + "}" : r) + "). If you meant to render a collection of children, use an array instead.");
		}
		return c;
	}
	function ue(e, t, n) {
		if (e == null) return e;
		var r = [], i = 0;
		return le(e, r, "", "", function(e) {
			return t.call(n, e, i++);
		}), r;
	}
	function T(e) {
		if (e._status === -1) {
			var t = e._result, n = t();
			n.then(function(t) {
				(e._status === 0 || e._status === -1) && (e._status = 1, e._result = t, n.status === void 0 && (n.status = "fulfilled", n.value = t));
			}, function(t) {
				(e._status === 0 || e._status === -1) && (e._status = 2, e._result = t, n.status === void 0 && (n.status = "rejected", n.reason = t));
			}), e._status === -1 && (e._status = 0, e._result = n);
		}
		if (e._status === 1) return e._result.default;
		throw e._result;
	}
	var de = typeof reportError == "function" ? reportError : function(e) {
		if (typeof window == "object" && typeof window.ErrorEvent == "function") {
			var t = new window.ErrorEvent("error", {
				bubbles: !0,
				cancelable: !0,
				message: typeof e == "object" && e && typeof e.message == "string" ? String(e.message) : String(e),
				error: e
			});
			if (!window.dispatchEvent(t)) return;
		} else if (typeof process == "object" && typeof process.emit == "function") {
			process.emit("uncaughtException", e);
			return;
		}
		console.error(e);
	};
	function fe(e) {
		var t = S.T, n = {};
		n.types = t === null ? null : t.types, S.T = n;
		try {
			var r = e(), i = S.S;
			i !== null && i(n, r), typeof r == "object" && r && typeof r.then == "function" && r.then(ne, de);
		} catch (e) {
			de(e);
		} finally {
			t !== null && n.types !== null && (t.types = n.types), S.T = t;
		}
	}
	function pe(e) {
		var t = S.T;
		if (t !== null) {
			var n = t.types;
			n === null ? t.types = [e] : n.indexOf(e) === -1 && n.push(e);
		} else fe(pe.bind(null, e));
	}
	var me = {
		map: ue,
		forEach: function(e, t, n) {
			ue(e, function() {
				t.apply(this, arguments);
			}, n);
		},
		count: function(e) {
			var t = 0;
			return ue(e, function() {
				t++;
			}), t;
		},
		toArray: function(e) {
			return ue(e, function(e) {
				return e;
			}) || [];
		},
		only: function(e) {
			if (!ae(e)) throw Error("React.Children.only expected to receive a single React element child.");
			return e;
		}
	};
	e.Activity = f, e.Children = me, e.Component = y, e.Fragment = r, e.Profiler = a, e.PureComponent = ee, e.StrictMode = i, e.Suspense = l, e.ViewTransition = p, e.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = S, e.__COMPILER_RUNTIME = {
		__proto__: null,
		c: function(e) {
			return S.H.useMemoCache(e);
		}
	}, e.addTransitionType = pe, e.cache = function(e) {
		return function() {
			return e.apply(null, arguments);
		};
	}, e.cacheSignal = function() {
		return null;
	}, e.cloneElement = function(e, t, n) {
		if (e == null) throw Error("The argument must be a React element, but you passed " + e + ".");
		var r = _({}, e.props), i = e.key;
		if (t != null) for (a in t.key !== void 0 && (i = "" + t.key), t) !re.call(t, a) || a === "key" || a === "__self" || a === "__source" || a === "ref" && t.ref === void 0 || (r[a] = t[a]);
		var a = arguments.length - 2;
		if (a === 1) r.children = n;
		else if (1 < a) {
			for (var o = Array(a), s = 0; s < a; s++) o[s] = arguments[s + 2];
			r.children = o;
		}
		return C(e.type, i, r);
	}, e.createContext = function(e) {
		return e = {
			$$typeof: s,
			_currentValue: e,
			_currentValue2: e,
			_threadCount: 0,
			Provider: null,
			Consumer: null
		}, e.Provider = e, e.Consumer = {
			$$typeof: o,
			_context: e
		}, e;
	}, e.createElement = function(e, t, n) {
		var r, i = {}, a = null;
		if (t != null) for (r in t.key !== void 0 && (a = "" + t.key), t) re.call(t, r) && r !== "key" && r !== "__self" && r !== "__source" && (i[r] = t[r]);
		var o = arguments.length - 2;
		if (o === 1) i.children = n;
		else if (1 < o) {
			for (var s = Array(o), c = 0; c < o; c++) s[c] = arguments[c + 2];
			i.children = s;
		}
		if (e && e.defaultProps) for (r in o = e.defaultProps, o) i[r] === void 0 && (i[r] = o[r]);
		return C(e, a, i);
	}, e.createRef = function() {
		return { current: null };
	}, e.forwardRef = function(e) {
		return {
			$$typeof: c,
			render: e
		};
	}, e.isValidElement = ae, e.lazy = function(e) {
		return {
			$$typeof: d,
			_payload: {
				_status: -1,
				_result: e
			},
			_init: T
		};
	}, e.memo = function(e, t) {
		return {
			$$typeof: u,
			type: e,
			compare: t === void 0 ? null : t
		};
	}, e.startTransition = fe, e.unstable_useCacheRefresh = function() {
		return S.H.useCacheRefresh();
	}, e.use = function(e) {
		return S.H.use(e);
	}, e.useActionState = function(e, t, n) {
		return S.H.useActionState(e, t, n);
	}, e.useCallback = function(e, t) {
		return S.H.useCallback(e, t);
	}, e.useContext = function(e) {
		return S.H.useContext(e);
	}, e.useDebugValue = function() {}, e.useDeferredValue = function(e, t) {
		return S.H.useDeferredValue(e, t);
	}, e.useEffect = function(e, t) {
		return S.H.useEffect(e, t);
	}, e.useEffectEvent = function(e) {
		return S.H.useEffectEvent(e);
	}, e.useId = function() {
		return S.H.useId();
	}, e.useImperativeHandle = function(e, t, n) {
		return S.H.useImperativeHandle(e, t, n);
	}, e.useInsertionEffect = function(e, t) {
		return S.H.useInsertionEffect(e, t);
	}, e.useLayoutEffect = function(e, t) {
		return S.H.useLayoutEffect(e, t);
	}, e.useMemo = function(e, t) {
		return S.H.useMemo(e, t);
	}, e.useOptimistic = function(e, t) {
		return S.H.useOptimistic(e, t);
	}, e.useReducer = function(e, t, n) {
		return S.H.useReducer(e, t, n);
	}, e.useRef = function(e) {
		return S.H.useRef(e);
	}, e.useState = function(e) {
		return S.H.useState(e);
	}, e.useSyncExternalStore = function(e, t, n) {
		return S.H.useSyncExternalStore(e, t, n);
	}, e.useTransition = function() {
		return S.H.useTransition();
	}, e.version = "19.3.1";
})), u = /* @__PURE__ */ o(((e, t) => {
	t.exports = l();
})), d = /* @__PURE__ */ o(((e) => {
	function t(e, t) {
		var n = e.length;
		e.push(t);
		a: for (; 0 < n;) {
			var r = n - 1 >>> 1, a = e[r];
			if (0 < i(a, t)) e[r] = t, e[n] = a, n = r;
			else break a;
		}
	}
	function n(e) {
		return e.length === 0 ? null : e[0];
	}
	function r(e) {
		if (e.length === 0) return null;
		var t = e[0], n = e.pop();
		if (n !== t) {
			e[0] = n;
			a: for (var r = 0, a = e.length, o = a >>> 1; r < o;) {
				var s = 2 * (r + 1) - 1, c = e[s], l = s + 1, u = e[l];
				if (0 > i(c, n)) l < a && 0 > i(u, c) ? (e[r] = u, e[l] = n, r = l) : (e[r] = c, e[s] = n, r = s);
				else if (l < a && 0 > i(u, n)) e[r] = u, e[l] = n, r = l;
				else break a;
			}
		}
		return t;
	}
	function i(e, t) {
		var n = e.sortIndex - t.sortIndex;
		return n === 0 ? e.id - t.id : n;
	}
	if (e.unstable_now = void 0, typeof performance == "object" && typeof performance.now == "function") {
		var a = performance;
		e.unstable_now = function() {
			return a.now();
		};
	} else {
		var o = Date, s = o.now();
		e.unstable_now = function() {
			return o.now() - s;
		};
	}
	var c = [], l = [], u = 1, d = null, f = 3, p = !1, m = !1, h = !1, g = !1, _ = typeof setTimeout == "function" ? setTimeout : null, v = typeof clearTimeout == "function" ? clearTimeout : null, y = typeof setImmediate < "u" ? setImmediate : null;
	function b(e) {
		for (var i = n(l); i !== null;) {
			if (i.callback === null) r(l);
			else if (i.startTime <= e) r(l), i.sortIndex = i.expirationTime, t(c, i);
			else break;
			i = n(l);
		}
	}
	function ee(e) {
		if (h = !1, b(e), !m) {
			if (n(c) !== null) m = !0, te || (te = !0, ie());
			else {
				var t = n(l);
				t !== null && se(ee, t.startTime - e);
			}
		}
	}
	var te = !1, x = -1, ne = 5, S = -1;
	function re() {
		return g ? !0 : !(e.unstable_now() - S < ne);
	}
	function C() {
		if (g = !1, te) {
			var t = e.unstable_now();
			S = t;
			var i = !0;
			try {
				a: {
					m = !1, h && (h = !1, v(x), x = -1), p = !0;
					var a = f;
					try {
						b: {
							for (b(t), d = n(c); d !== null && !(d.expirationTime > t && re());) {
								var o = d.callback;
								if (typeof o == "function") {
									d.callback = null, f = d.priorityLevel;
									var s = o(d.expirationTime <= t);
									if (t = e.unstable_now(), typeof s == "function") {
										d.callback = s, b(t), i = !0;
										break b;
									}
									d === n(c) && r(c), b(t);
								} else r(c);
								d = n(c);
							}
							if (d !== null) i = !0;
							else {
								var u = n(l);
								u !== null && se(ee, u.startTime - t), i = !1;
							}
						}
						break a;
					} finally {
						d = null, f = a, p = !1;
					}
					i = void 0;
				}
			} finally {
				i ? ie() : te = !1;
			}
		}
	}
	var ie;
	if (typeof y == "function") ie = function() {
		y(C);
	};
	else if (typeof MessageChannel < "u") {
		var ae = new MessageChannel(), oe = ae.port2;
		ae.port1.onmessage = C, ie = function() {
			oe.postMessage(null);
		};
	} else ie = function() {
		_(C, 0);
	};
	function se(t, n) {
		x = _(function() {
			t(e.unstable_now());
		}, n);
	}
	e.unstable_IdlePriority = 5, e.unstable_ImmediatePriority = 1, e.unstable_LowPriority = 4, e.unstable_NormalPriority = 3, e.unstable_Profiling = null, e.unstable_UserBlockingPriority = 2, e.unstable_cancelCallback = function(e) {
		e.callback = null;
	}, e.unstable_forceFrameRate = function(e) {
		0 > e || 125 < e ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : ne = 0 < e ? Math.floor(1e3 / e) : 5;
	}, e.unstable_getCurrentPriorityLevel = function() {
		return f;
	}, e.unstable_next = function(e) {
		switch (f) {
			case 1:
			case 2:
			case 3:
				var t = 3;
				break;
			default: t = f;
		}
		var n = f;
		f = t;
		try {
			return e();
		} finally {
			f = n;
		}
	}, e.unstable_requestPaint = function() {
		g = !0;
	}, e.unstable_runWithPriority = function(e, t) {
		switch (e) {
			case 1:
			case 2:
			case 3:
			case 4:
			case 5: break;
			default: e = 3;
		}
		var n = f;
		f = e;
		try {
			return t();
		} finally {
			f = n;
		}
	}, e.unstable_scheduleCallback = function(r, i, a) {
		var o = e.unstable_now();
		switch (typeof a == "object" && a ? (a = a.delay, a = typeof a == "number" && 0 < a ? o + a : o) : a = o, r) {
			case 1:
				var s = -1;
				break;
			case 2:
				s = 250;
				break;
			case 5:
				s = 1073741823;
				break;
			case 4:
				s = 1e4;
				break;
			default: s = 5e3;
		}
		return s = a + s, r = {
			id: u++,
			callback: i,
			priorityLevel: r,
			startTime: a,
			expirationTime: s,
			sortIndex: -1
		}, a > o ? (r.sortIndex = a, t(l, r), n(c) === null && r === n(l) && (h ? (v(x), x = -1) : h = !0, se(ee, a - o))) : (r.sortIndex = s, t(c, r), m || p || (m = !0, te || (te = !0, ie()))), r;
	}, e.unstable_shouldYield = re, e.unstable_wrapCallback = function(e) {
		var t = f;
		return function() {
			var n = f;
			f = t;
			try {
				return e.apply(this, arguments);
			} finally {
				f = n;
			}
		};
	};
})), f = /* @__PURE__ */ o(((e, t) => {
	t.exports = d();
})), p = /* @__PURE__ */ o(((e) => {
	var t = u();
	function n(e) {
		var t = "https://react.dev/errors/" + e;
		if (1 < arguments.length) {
			t += "?args[]=" + encodeURIComponent(arguments[1]);
			for (var n = 2; n < arguments.length; n++) t += "&args[]=" + encodeURIComponent(arguments[n]);
		}
		return "Minified React error #" + e + "; visit " + t + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
	}
	function r() {}
	var i = {
		d: {
			f: r,
			r: function() {
				throw Error(n(522));
			},
			D: r,
			C: r,
			L: r,
			m: r,
			X: r,
			S: r,
			M: r
		},
		p: 0,
		findDOMNode: null
	}, a = Symbol.for("react.portal"), o = Symbol.for("react.recoverable"), s = Symbol.for("react.optimistic_key");
	function c(e, t, n) {
		var r = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
		return {
			$$typeof: a,
			key: r == null ? null : r === s ? s : "" + r,
			children: e,
			containerInfo: t,
			implementation: n
		};
	}
	var l = t.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
	function d(e, t) {
		if (e === "font") return "";
		if (typeof t == "string") return t === "use-credentials" ? t : "";
	}
	e.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = i, e.browser = function(e) {
		return {
			$$typeof: o,
			_reason: e
		};
	}, e.createPortal = function(e, t) {
		var r = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
		if (!t || t.nodeType !== 1 && t.nodeType !== 9 && t.nodeType !== 11) throw Error(n(299));
		return c(e, t, null, r);
	}, e.flushSync = function(e) {
		var t = l.T, n = i.p;
		try {
			if (l.T = null, i.p = 2, e) return e();
		} finally {
			l.T = t, i.p = n, i.d.f();
		}
	}, e.preconnect = function(e, t) {
		typeof e == "string" && (t ? (t = t.crossOrigin, t = typeof t == "string" ? t === "use-credentials" ? t : "" : void 0) : t = null, i.d.C(e, t));
	}, e.prefetchDNS = function(e) {
		typeof e == "string" && i.d.D(e);
	}, e.preinit = function(e, t) {
		if (typeof e == "string" && t && typeof t.as == "string") {
			var n = t.as, r = d(n, t.crossOrigin), a = typeof t.integrity == "string" ? t.integrity : void 0, o = typeof t.fetchPriority == "string" ? t.fetchPriority : void 0;
			n === "style" ? i.d.S(e, typeof t.precedence == "string" ? t.precedence : void 0, {
				crossOrigin: r,
				integrity: a,
				fetchPriority: o
			}) : n === "script" && i.d.X(e, {
				crossOrigin: r,
				integrity: a,
				fetchPriority: o,
				nonce: typeof t.nonce == "string" ? t.nonce : void 0
			});
		}
	}, e.preinitModule = function(e, t) {
		if (typeof e == "string") {
			if (typeof t == "object" && t) {
				if (t.as == null || t.as === "script") {
					var n = d(t.as, t.crossOrigin);
					i.d.M(e, {
						crossOrigin: n,
						integrity: typeof t.integrity == "string" ? t.integrity : void 0,
						nonce: typeof t.nonce == "string" ? t.nonce : void 0,
						fetchPriority: typeof t.fetchPriority == "string" ? t.fetchPriority : void 0
					});
				}
			} else t ?? i.d.M(e);
		}
	}, e.preload = function(e, t) {
		if (typeof e == "string" && typeof t == "object" && t && typeof t.as == "string") {
			var n = t.as, r = d(n, t.crossOrigin);
			i.d.L(e, n, {
				crossOrigin: r,
				integrity: typeof t.integrity == "string" ? t.integrity : void 0,
				nonce: typeof t.nonce == "string" ? t.nonce : void 0,
				type: typeof t.type == "string" ? t.type : void 0,
				fetchPriority: typeof t.fetchPriority == "string" ? t.fetchPriority : void 0,
				referrerPolicy: typeof t.referrerPolicy == "string" ? t.referrerPolicy : void 0,
				imageSrcSet: typeof t.imageSrcSet == "string" ? t.imageSrcSet : void 0,
				imageSizes: typeof t.imageSizes == "string" ? t.imageSizes : void 0,
				media: typeof t.media == "string" ? t.media : void 0
			});
		}
	}, e.preloadModule = function(e, t) {
		if (typeof e == "string") {
			if (t) {
				var n = d(t.as, t.crossOrigin);
				i.d.m(e, {
					as: typeof t.as == "string" && t.as !== "script" ? t.as : void 0,
					crossOrigin: n,
					integrity: typeof t.integrity == "string" ? t.integrity : void 0,
					nonce: typeof t.nonce == "string" ? t.nonce : void 0,
					fetchPriority: typeof t.fetchPriority == "string" ? t.fetchPriority : void 0
				});
			} else i.d.m(e);
		}
	}, e.requestFormReset = function(e) {
		i.d.r(e);
	}, e.unstable_batchedUpdates = function(e, t) {
		return e(t);
	}, e.useFormState = function(e, t, n) {
		return l.H.useFormState(e, t, n);
	}, e.useFormStatus = function() {
		return l.H.useHostTransitionStatus();
	}, e.version = "19.3.1";
})), m = /* @__PURE__ */ o(((e, t) => {
	function n() {
		if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE == "function") try {
			__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(n);
		} catch (e) {
			console.error(e);
		}
	}
	n(), t.exports = p();
})), h = /* @__PURE__ */ o(((e) => {
	var t = f(), n = u(), r = m();
	function i(e) {
		var t = "https://react.dev/errors/" + e;
		if (1 < arguments.length) {
			t += "?args[]=" + encodeURIComponent(arguments[1]);
			for (var n = 2; n < arguments.length; n++) t += "&args[]=" + encodeURIComponent(arguments[n]);
		}
		return "Minified React error #" + e + "; visit " + t + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
	}
	function a(e) {
		return !(!e || e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11);
	}
	function o(e) {
		for (var t = e, n = t; n && !n.alternate;) t = n, t.flags & 4098 && (e = t.return), n = t.return;
		for (; t.return;) t = t.return;
		return t.tag === 3 ? e : null;
	}
	function s(e) {
		if (e.tag === 13) {
			var t = e.memoizedState;
			if (t === null && (e = e.alternate, e !== null && (t = e.memoizedState)), t !== null) return t.dehydrated;
		}
		return null;
	}
	function c(e) {
		if (e.tag === 31) {
			var t = e.memoizedState;
			if (t === null && (e = e.alternate, e !== null && (t = e.memoizedState)), t !== null) return t.dehydrated;
		}
		return null;
	}
	function l(e) {
		if (o(e) !== e) throw Error(i(188));
	}
	function d(e) {
		var t = e.alternate;
		if (!t) {
			if (t = o(e), t === null) throw Error(i(188));
			return t === e ? e : null;
		}
		for (var n = e, r = t;;) {
			var a = n.return;
			if (a === null) break;
			var s = a.alternate;
			if (s === null) {
				if (r = a.return, r !== null) {
					n = r;
					continue;
				}
				break;
			}
			if (a.child === s.child) {
				for (s = a.child; s;) {
					if (s === n) return l(a), e;
					if (s === r) return l(a), t;
					s = s.sibling;
				}
				throw Error(i(188));
			}
			if (n.return !== r.return) n = a, r = s;
			else {
				for (var c = !1, u = a.child; u;) {
					if (u === n) {
						c = !0, n = a, r = s;
						break;
					}
					if (u === r) {
						c = !0, r = a, n = s;
						break;
					}
					u = u.sibling;
				}
				if (!c) {
					for (u = s.child; u;) {
						if (u === n) {
							c = !0, n = s, r = a;
							break;
						}
						if (u === r) {
							c = !0, r = s, n = a;
							break;
						}
						u = u.sibling;
					}
					if (!c) throw Error(i(189));
				}
			}
			if (n.alternate !== r) throw Error(i(190));
		}
		if (n.tag !== 3) throw Error(i(188));
		return n.stateNode.current === n ? e : t;
	}
	function p(e) {
		var t = e.tag;
		if (t === 5 || t === 26 || t === 27 || t === 6) return e;
		for (e = e.child; e !== null;) {
			if (t = p(e), t !== null) return t;
			e = e.sibling;
		}
		return null;
	}
	function h(e, t, n, r, i, a) {
		for (; e !== null;) {
			if ((e.tag === 5 || e.tag === 27 || e.tag === 6) && n(e, r, i, a) || (e.tag !== 22 || e.memoizedState === null) && (t || e.tag !== 5 && e.tag !== 27) && h(e.child, t, n, r, i, a)) return !0;
			e = e.sibling;
		}
		return !1;
	}
	function g(e) {
		for (e = e.return; e !== null;) {
			if (e.tag === 3 || e.tag === 5 || e.tag === 27) return e;
			e = e.return;
		}
		return null;
	}
	function _(e) {
		var t = !1;
		for (e = e.return; e !== null && (e.tag === 4 && (t = !0), e.tag !== 3 && e.tag !== 5 && e.tag !== 27);) e = e.return;
		return t;
	}
	function v(e) {
		var t = [null, null], n = g(e);
		return n === null || y(t, e, n.child, { foundSelf: !1 }), t;
	}
	function y(e, t, n, r) {
		for (; n !== null;) {
			if (n === t) r.foundSelf = !0;
			else if (n.tag === 5 || n.tag === 27 || n.tag === 6) {
				if (r.foundSelf) return e[1] = n, !0;
				e[0] = n;
			} else if ((n.tag !== 22 || n.memoizedState === null) && y(e, t, n.child, r)) return !0;
			n = n.sibling;
		}
		return !1;
	}
	function b(e) {
		switch (e.tag) {
			case 5:
			case 27:
			case 6: return e.stateNode;
			case 3: return e.stateNode.containerInfo;
			default: throw Error(i(559));
		}
	}
	var ee = null, te = null;
	function x(e, t, n) {
		return e === n || e === t && (ee = e, !0);
	}
	function ne(e, t, n) {
		return e === n ? (te = e, !1) : e === t && (te !== null && (ee = e), !0);
	}
	function S(e) {
		if (e === null) return null;
		do
			e = e === null ? null : e.return;
		while (e && e.tag !== 5 && e.tag !== 27 && e.tag !== 3);
		return e || null;
	}
	function re(e, t, n) {
		for (var r = 0, i = e; i; i = n(i)) r++;
		i = 0;
		for (var a = t; a; a = n(a)) i++;
		for (; 0 < r - i;) e = n(e), r--;
		for (; 0 < i - r;) t = n(t), i--;
		for (; r--;) {
			if (e === t || t !== null && e === t.alternate) return e;
			e = n(e), t = n(t);
		}
		return null;
	}
	var C = Object.assign, ie = Symbol.for("react.element"), ae = Symbol.for("react.transitional.element"), oe = Symbol.for("react.portal"), se = Symbol.for("react.fragment"), ce = Symbol.for("react.strict_mode"), w = Symbol.for("react.profiler"), le = Symbol.for("react.consumer"), ue = Symbol.for("react.context"), T = Symbol.for("react.forward_ref"), de = Symbol.for("react.suspense"), fe = Symbol.for("react.suspense_list"), pe = Symbol.for("react.memo"), me = Symbol.for("react.lazy"), he = Symbol.for("react.activity"), ge = Symbol.for("react.legacy_hidden"), _e = Symbol.for("react.memo_cache_sentinel"), ve = Symbol.for("react.view_transition"), ye = Symbol.for("react.recoverable"), be = Symbol.iterator;
	function xe(e) {
		return typeof e != "object" || !e ? null : (e = be && e[be] || e["@@iterator"], typeof e == "function" ? e : null);
	}
	var Se = Symbol.for("react.client.reference");
	function Ce(e) {
		if (e == null) return null;
		if (typeof e == "function") return e.$$typeof === Se ? null : e.displayName || e.name || null;
		if (typeof e == "string") return e;
		switch (e) {
			case se: return "Fragment";
			case w: return "Profiler";
			case ce: return "StrictMode";
			case de: return "Suspense";
			case fe: return "SuspenseList";
			case he: return "Activity";
			case ve: return "ViewTransition";
		}
		if (typeof e == "object") switch (e.$$typeof) {
			case oe: return "Portal";
			case ue: return e.displayName || "Context";
			case le: return (e._context.displayName || "Context") + ".Consumer";
			case T:
				var t = e.render;
				return e = e.displayName, e ||= (e = t.displayName || t.name || "", e === "" ? "ForwardRef" : "ForwardRef(" + e + ")"), e;
			case pe: return t = e.displayName || null, t === null ? Ce(e.type) || "Memo" : t;
			case me:
				t = e._payload, e = e._init;
				try {
					return Ce(e(t));
				} catch {}
		}
		return null;
	}
	var we = Array.isArray, E = n.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, D = r.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, Te = {
		pending: !1,
		data: null,
		method: null,
		action: null
	}, Ee = [], De = -1;
	function Oe(e) {
		return { current: e };
	}
	function ke(e) {
		0 > De || (e.current = Ee[De], Ee[De] = null, De--);
	}
	function O(e, t) {
		De++, Ee[De] = e.current, e.current = t;
	}
	var Ae = Oe(null), je = Oe(null), Me = Oe(null), Ne = Oe(null);
	function Pe(e, t) {
		switch (O(Me, t), O(je, e), O(Ae, null), t.nodeType) {
			case 9:
			case 11:
				e = (e = t.documentElement) && (e = e.namespaceURI) ? up(e) : 0;
				break;
			default: if (e = t.tagName, t = t.namespaceURI) t = up(t), e = dp(t, e);
			else switch (e) {
				case "svg":
					e = 1;
					break;
				case "math":
					e = 2;
					break;
				default: e = 0;
			}
		}
		ke(Ae), O(Ae, e);
	}
	function Fe() {
		ke(Ae), ke(je), ke(Me);
	}
	function Ie(e) {
		var t = e.memoizedState;
		t !== null && (sh._currentValue = t.memoizedState, O(Ne, e)), t = Ae.current;
		var n = dp(t, e.type);
		t !== n && (O(je, e), O(Ae, n));
	}
	function Le(e) {
		je.current === e && (ke(Ae), ke(je)), Ne.current === e && (ke(Ne), sh._currentValue = Te);
	}
	var Re, ze;
	function Be(e) {
		if (Re === void 0) try {
			throw Error();
		} catch (e) {
			var t = e.stack.trim().match(/\n( *(at )?)/);
			Re = t && t[1] || "", ze = -1 < e.stack.indexOf("\n    at") ? " (<anonymous>)" : -1 < e.stack.indexOf("@") ? "@unknown:0:0" : "";
		}
		return "\n" + Re + e + ze;
	}
	var Ve = !1;
	function He(e, t) {
		if (!e || Ve) return "";
		Ve = !0;
		var n = Error.prepareStackTrace;
		Error.prepareStackTrace = void 0;
		try {
			var r = { DetermineComponentFrameRoot: function() {
				try {
					if (t) {
						var n = function() {
							throw Error();
						};
						if (Object.defineProperty(n.prototype, "props", { set: function() {
							throw Error();
						} }), typeof Reflect == "object" && Reflect.construct) {
							try {
								Reflect.construct(n, []);
							} catch (e) {
								var r = e;
							}
							Reflect.construct(e, [], n);
						} else {
							try {
								n.call();
							} catch (e) {
								r = e;
							}
							n = !1;
							try {
								var i = Object.getOwnPropertyDescriptor(e.prototype, "props");
								Object.defineProperty(e.prototype, "props", {
									configurable: !0,
									set: function() {
										throw Error();
									}
								}), n = !0, new e();
							} finally {
								n && (i === void 0 ? delete e.prototype.props : Object.defineProperty(e.prototype, "props", i));
							}
						}
					} else {
						try {
							throw Error();
						} catch (e) {
							r = e;
						}
						(n = e()) && typeof n.catch == "function" && n.catch(function() {});
					}
				} catch (e) {
					if (e && r && typeof e.stack == "string") return [e.stack, r.stack];
				}
				return [null, null];
			} };
			r.DetermineComponentFrameRoot.displayName = "DetermineComponentFrameRoot";
			var i = Object.getOwnPropertyDescriptor(r.DetermineComponentFrameRoot, "name");
			i && i.configurable && Object.defineProperty(r.DetermineComponentFrameRoot, "name", { value: "DetermineComponentFrameRoot" });
			var a = r.DetermineComponentFrameRoot(), o = a[0], s = a[1];
			if (o && s) {
				var c = o.split("\n"), l = s.split("\n");
				for (i = r = 0; r < c.length && !c[r].includes("DetermineComponentFrameRoot");) r++;
				for (; i < l.length && !l[i].includes("DetermineComponentFrameRoot");) i++;
				if (r === c.length || i === l.length) for (r = c.length - 1, i = l.length - 1; 1 <= r && 0 <= i && c[r] !== l[i];) i--;
				for (; 1 <= r && 0 <= i; r--, i--) if (c[r] !== l[i]) {
					if (r !== 1 || i !== 1) do
						if (r--, i--, 0 > i || c[r] !== l[i]) {
							var u = "\n" + c[r].replace(" at new ", " at ");
							return e.displayName && u.includes("<anonymous>") && (u = u.replace("<anonymous>", e.displayName)), u;
						}
					while (1 <= r && 0 <= i);
					break;
				}
			}
		} finally {
			Ve = !1, Error.prepareStackTrace = n;
		}
		return (n = e ? e.displayName || e.name : "") ? Be(n) : "";
	}
	function Ue(e, t) {
		switch (e.tag) {
			case 26:
			case 27:
			case 5: return Be(e.type);
			case 16: return Be("Lazy");
			case 13: return e.child !== t && t !== null ? Be("Suspense Fallback") : Be("Suspense");
			case 19: return Be("SuspenseList");
			case 0:
			case 15: return He(e.type, !1);
			case 11: return He(e.type.render, !1);
			case 1: return He(e.type, !0);
			case 31: return Be("Activity");
			case 30: return Be("ViewTransition");
			default: return "";
		}
	}
	function We(e) {
		try {
			var t = "", n = null;
			do
				t += Ue(e, n), n = e, e = e.return;
			while (e);
			return t;
		} catch (e) {
			return "\nError generating stack: " + e.message + "\n" + e.stack;
		}
	}
	var Ge = Object.prototype.hasOwnProperty, Ke = t.unstable_scheduleCallback, qe = t.unstable_cancelCallback, Je = t.unstable_shouldYield, Ye = t.unstable_requestPaint, Xe = t.unstable_now, Ze = t.unstable_getCurrentPriorityLevel, Qe = t.unstable_ImmediatePriority, $e = t.unstable_UserBlockingPriority, et = t.unstable_NormalPriority, tt = t.unstable_LowPriority, nt = t.unstable_IdlePriority, rt = t.log, it = t.unstable_setDisableYieldValue, at = null, ot = null;
	function st(e) {
		if (typeof rt == "function" && it(e), ot && typeof ot.setStrictMode == "function") try {
			ot.setStrictMode(at, e);
		} catch {}
	}
	var ct = Math.clz32 ? Math.clz32 : dt, lt = Math.log, ut = Math.LN2;
	function dt(e) {
		return e >>>= 0, e === 0 ? 32 : 31 - (lt(e) / ut | 0) | 0;
	}
	var ft = 256, pt = 262144, mt = 4194304;
	function ht(e) {
		var t = e & 42;
		if (t !== 0) return t;
		switch (e & -e) {
			case 1: return 1;
			case 2: return 2;
			case 4: return 4;
			case 8: return 8;
			case 16: return 16;
			case 32: return 32;
			case 64: return 64;
			case 128: return 128;
			case 256:
			case 512:
			case 1024:
			case 2048:
			case 4096:
			case 8192:
			case 16384:
			case 32768:
			case 65536:
			case 131072: return e & -e;
			case 262144:
			case 524288:
			case 1048576:
			case 2097152: return e & 3932160;
			case 4194304:
			case 8388608:
			case 16777216:
			case 33554432: return e & 62914560;
			case 67108864: return 67108864;
			case 134217728: return 134217728;
			case 268435456: return 268435456;
			case 536870912: return 536870912;
			case 1073741824: return 0;
			default: return e;
		}
	}
	function gt(e, t, n) {
		var r = e.pendingLanes;
		if (r === 0) return 0;
		var i = 0, a = e.suspendedLanes, o = e.pingedLanes;
		e = e.warmLanes;
		var s = r & 134217727;
		return s === 0 ? (s = r & ~a, s === 0 ? o === 0 ? n || (n = r & ~e, n !== 0 && (i = ht(n))) : i = ht(o) : i = ht(s)) : (r = s & ~a, r === 0 ? (o &= s, o === 0 ? n || (n = s & ~e, n !== 0 && (i = ht(n))) : i = ht(o)) : i = ht(r)), i === 0 ? 0 : t !== 0 && t !== i && (t & a) === 0 && (a = i & -i, n = t & -t, a >= n || a === 32 && n & 4194048) ? t : i;
	}
	function _t(e, t) {
		return (e.pendingLanes & ~(e.suspendedLanes & ~e.pingedLanes) & t) === 0;
	}
	function vt(e, t) {
		t & 8 && (t |= t & 32);
		var n = e.entangledLanes;
		if (n !== 0) for (e = e.entanglements, n &= t; 0 < n;) {
			var r = 31 - ct(n), i = 1 << r;
			t |= e[r], n &= ~i;
		}
		return t;
	}
	function yt(e, t) {
		switch (e) {
			case 1:
			case 2:
			case 4:
			case 8:
			case 64: return t + 250;
			case 16:
			case 32:
			case 128:
			case 256:
			case 512:
			case 1024:
			case 2048:
			case 4096:
			case 8192:
			case 16384:
			case 32768:
			case 65536:
			case 131072:
			case 262144:
			case 524288:
			case 1048576:
			case 2097152: return t + 5e3;
			case 4194304:
			case 8388608:
			case 16777216:
			case 33554432: return -1;
			case 67108864:
			case 134217728:
			case 268435456:
			case 536870912:
			case 1073741824: return -1;
			default: return -1;
		}
	}
	function bt() {
		var e = mt;
		return mt <<= 1, !(mt & 62914560) && (mt = 4194304), e;
	}
	function xt(e) {
		for (var t = [], n = 0; 31 > n; n++) t.push(e);
		return t;
	}
	function St(e, t) {
		e.pendingLanes |= t, t !== 268435456 && (e.suspendedLanes = 0, e.pingedLanes = 0, e.warmLanes = 0);
	}
	function Ct(e, t, n, r, i, a) {
		var o = e.pendingLanes;
		e.pendingLanes = n, e.suspendedLanes = 0, e.pingedLanes = 0, e.warmLanes = 0, e.expiredLanes &= n, e.entangledLanes &= n, e.errorRecoveryDisabledLanes &= n, e.shellSuspendCounter = 0;
		var s = e.entanglements, c = e.expirationTimes, l = e.hiddenUpdates;
		for (n = o & ~n; 0 < n;) {
			var u = 31 - ct(n), d = 1 << u;
			s[u] = 0, c[u] = -1;
			var f = l[u];
			if (f !== null) for (l[u] = null, u = 0; u < f.length; u++) {
				var p = f[u];
				p !== null && (p.lane &= -536870913);
			}
			n &= ~d;
		}
		r !== 0 && k(e, r, 0), a !== 0 && i === 0 && e.tag !== 0 && (e.suspendedLanes |= a & ~(o & ~t));
	}
	function k(e, t, n) {
		e.pendingLanes |= t, e.suspendedLanes &= ~t;
		var r = 31 - ct(t);
		e.entangledLanes |= t, e.entanglements[r] = e.entanglements[r] | 1073741824 | n & 261930;
	}
	function wt(e, t) {
		var n = e.entangledLanes |= t;
		for (e = e.entanglements; n;) {
			var r = 31 - ct(n), i = 1 << r;
			i & t | e[r] & t && (e[r] |= t), n &= ~i;
		}
	}
	function Tt(e, t) {
		var n = t & -t;
		return n = n & 42 ? 1 : Et(n), (n & (e.suspendedLanes | t)) === 0 ? n : 0;
	}
	function Et(e) {
		switch (e) {
			case 2:
				e = 1;
				break;
			case 8:
				e = 4;
				break;
			case 32:
				e = 16;
				break;
			case 256:
			case 512:
			case 1024:
			case 2048:
			case 4096:
			case 8192:
			case 16384:
			case 32768:
			case 65536:
			case 131072:
			case 262144:
			case 524288:
			case 1048576:
			case 2097152:
			case 4194304:
			case 8388608:
			case 16777216:
			case 33554432:
				e = 128;
				break;
			case 268435456:
				e = 134217728;
				break;
			default: e = 0;
		}
		return e;
	}
	function Dt(e) {
		return e &= -e, 2 < e ? 8 < e ? e & 134217727 ? 32 : 268435456 : 8 : 2;
	}
	function Ot() {
		var e = D.p;
		return e === 0 ? (e = window.event, e === void 0 ? 32 : Ch(e.type)) : e;
	}
	function kt(e, t) {
		var n = D.p;
		try {
			return D.p = e, t();
		} finally {
			D.p = n;
		}
	}
	var At = Math.random().toString(36).slice(2), A = "__reactFiber$" + At, jt = "__reactProps$" + At, j = "__reactContainer$" + At, Mt = "__reactEvents$" + At, Nt = "__reactListeners$" + At, Pt = "__reactHandles$" + At, Ft = "__reactResources$" + At, It = "__reactMarker$" + At, Lt = "__reactLoad$" + At;
	function Rt(e) {
		delete e[A], delete e[jt], delete e[Nt], delete e[Pt];
	}
	function zt(e) {
		var t;
		if (t = e[A]) return t;
		for (var n = e.parentNode; n;) {
			if (t = n[j] || n[A]) {
				if (n = t.alternate, t.child !== null || n !== null && n.child !== null) for (e = fm(e); e !== null;) {
					if (n = e[A]) return n;
					e = fm(e);
				}
				return t;
			}
			e = n, n = e.parentNode;
		}
		return null;
	}
	function Bt(e) {
		if (e = e[A] || e[j]) {
			var t = e.tag;
			if (t === 5 || t === 6 || t === 13 || t === 31 || t === 26 || t === 27 || t === 3) return e;
		}
		return null;
	}
	function Vt(e) {
		var t = e.tag;
		if (t === 5 || t === 26 || t === 27 || t === 6) return e.stateNode;
		throw Error(i(33));
	}
	function Ht(e) {
		var t = e[Ft];
		return t ||= e[Ft] = {
			hoistableStyles: /* @__PURE__ */ new Map(),
			hoistableScripts: /* @__PURE__ */ new Map()
		}, t;
	}
	function Ut(e) {
		e[It] = !0;
	}
	function Wt(e) {
		e[Lt] = void 0;
	}
	var Gt = /* @__PURE__ */ new Set(), Kt = {};
	function qt(e, t) {
		Jt(e, t), Jt(e + "Capture", t);
	}
	function Jt(e, t) {
		for (Kt[e] = t, e = 0; e < t.length; e++) Gt.add(t[e]);
	}
	var Yt = RegExp("^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"), M = {}, N = {};
	function Xt(e) {
		return Ge.call(N, e) ? !0 : Ge.call(M, e) ? !1 : Yt.test(e) ? N[e] = !0 : (M[e] = !0, !1);
	}
	var P = !1;
	function Zt() {
		var e = P;
		return P = !1, e;
	}
	function Qt(e, t, n) {
		if (Xt(t)) {
			if (n === null) e.removeAttribute(t);
			else {
				switch (typeof n) {
					case "undefined":
					case "function":
					case "symbol":
						e.removeAttribute(t);
						return;
					case "boolean":
						var r = t.toLowerCase().slice(0, 5);
						if (r !== "data-" && r !== "aria-") {
							e.removeAttribute(t);
							return;
						}
				}
				e.setAttribute(t, n);
			}
		}
	}
	function $t(e, t, n) {
		if (n === null) e.removeAttribute(t);
		else {
			switch (typeof n) {
				case "undefined":
				case "function":
				case "symbol":
				case "boolean":
					e.removeAttribute(t);
					return;
			}
			e.setAttribute(t, n);
		}
	}
	function F(e, t, n, r) {
		if (r === null) e.removeAttribute(n);
		else {
			switch (typeof r) {
				case "undefined":
				case "function":
				case "symbol":
				case "boolean":
					e.removeAttribute(n);
					return;
			}
			e.setAttributeNS(t, n, r);
		}
	}
	function en(e) {
		switch (typeof e) {
			case "bigint":
			case "boolean":
			case "number":
			case "string":
			case "undefined": return e;
			case "object": return e;
			default: return "";
		}
	}
	function tn(e) {
		var t = e.type;
		return (e = e.nodeName) && e.toLowerCase() === "input" && (t === "checkbox" || t === "radio");
	}
	function nn(e, t, n) {
		var r = Object.getOwnPropertyDescriptor(e.constructor.prototype, t);
		if (!e.hasOwnProperty(t) && r !== void 0 && typeof r.get == "function" && typeof r.set == "function") {
			var i = r.get, a = r.set;
			return Object.defineProperty(e, t, {
				configurable: !0,
				get: function() {
					return i.call(this);
				},
				set: function(e) {
					n = "" + e, a.call(this, e);
				}
			}), Object.defineProperty(e, t, { enumerable: r.enumerable }), {
				getValue: function() {
					return n;
				},
				setValue: function(e) {
					n = "" + e;
				},
				stopTracking: function() {
					e._valueTracker = null, delete e[t];
				}
			};
		}
	}
	function rn(e) {
		if (!e._valueTracker) {
			var t = tn(e) ? "checked" : "value";
			e._valueTracker = nn(e, t, "" + e[t]);
		}
	}
	function an(e) {
		if (!e) return !1;
		var t = e._valueTracker;
		if (!t) return !0;
		var n = t.getValue(), r = "";
		return e && (r = tn(e) ? e.checked ? "true" : "false" : e.value), e = r, e !== n && (t.setValue(e), !0);
	}
	var on = /[\n"\\]/g;
	function sn(e) {
		return e.replace(on, function(e) {
			return "\\" + e.charCodeAt(0).toString(16) + " ";
		});
	}
	function I(e, t, n, r, i, a, o, s) {
		e.name = "", o != null && typeof o != "function" && typeof o != "symbol" && typeof o != "boolean" ? e.type = o : e.removeAttribute("type"), t == null ? o !== "submit" && o !== "reset" || e.removeAttribute("value") : o === "number" ? (t === 0 && e.value === "" || e.value != t) && (e.value = "" + en(t)) : e.value !== "" + en(t) && (e.value = "" + en(t)), t == null ? n == null ? r != null && e.removeAttribute("value") : ln(e, en(n)) : o === "number" && e.value == t ? ln(e, en(e.value)) : ln(e, en(t)), i == null && a != null && (e.defaultChecked = !!a), i != null && (e.checked = i && typeof i != "function" && typeof i != "symbol"), s != null && typeof s != "function" && typeof s != "symbol" && typeof s != "boolean" ? e.name = "" + en(s) : e.removeAttribute("name");
	}
	function cn(e, t, n, r, i, a, o, s) {
		if (a != null && typeof a != "function" && typeof a != "symbol" && typeof a != "boolean" && (e.type = a), t != null || n != null) {
			if (!(a !== "submit" && a !== "reset" || t != null)) {
				rn(e);
				return;
			}
			n = n == null ? "" : "" + en(n), t = t == null ? n : "" + en(t), s || t === e.value || (e.value = t), e.defaultValue = t;
		}
		r ??= i, r = typeof r != "function" && typeof r != "symbol" && !!r, e.checked = s ? e.checked : !!r, e.defaultChecked = !!r, o != null && typeof o != "function" && typeof o != "symbol" && typeof o != "boolean" && (e.name = o), rn(e);
	}
	function ln(e, t) {
		e.defaultValue !== "" + t && (e.defaultValue = "" + t);
	}
	function un(e, t, n, r) {
		if (e = e.options, t) {
			t = {};
			for (var i = 0; i < n.length; i++) t["$" + n[i]] = !0;
			for (n = 0; n < e.length; n++) i = t.hasOwnProperty("$" + e[n].value), e[n].selected !== i && (e[n].selected = i), i && r && (e[n].defaultSelected = !0);
		} else {
			for (n = "" + en(n), t = null, i = 0; i < e.length; i++) {
				if (e[i].value === n) {
					e[i].selected = !0, r && (e[i].defaultSelected = !0);
					return;
				}
				t !== null || e[i].disabled || (t = e[i]);
			}
			t !== null && (t.selected = !0);
		}
	}
	function dn(e, t, n) {
		t != null && (t = "" + en(t), t !== e.value && (e.value = t), n == null) ? e.defaultValue !== t && (e.defaultValue = t) : e.defaultValue = n == null ? "" : "" + en(n);
	}
	function fn(e, t, n, r) {
		if (t == null) {
			if (r != null) {
				if (n != null) throw Error(i(92));
				if (we(r)) {
					if (1 < r.length) throw Error(i(93));
					r = r[0];
				}
				n = r;
			}
			n ??= "", t = n;
		}
		n = en(t), e.defaultValue = n, r = e.textContent, r === n && r !== "" && r !== null && (e.value = r), rn(e);
	}
	function pn(e, t) {
		if (t) {
			var n = e.firstChild;
			if (n && n === e.lastChild && n.nodeType === 3) {
				n.nodeValue = t;
				return;
			}
		}
		e.textContent = t;
	}
	var L = new Set("animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(" "));
	function mn(e, t, n) {
		var r = t.indexOf("--") === 0;
		n == null || typeof n == "boolean" || n === "" ? r ? e.setProperty(t, "") : t === "float" ? e.cssFloat = "" : e[t] = "" : r ? e.setProperty(t, n) : typeof n != "number" || n === 0 || L.has(t) ? t === "float" ? e.cssFloat = n : e[t] = ("" + n).trim() : e[t] = n + "px";
	}
	function hn(e, t, n) {
		if (t != null && typeof t != "object") throw Error(i(62));
		if (e = e.style, n != null) {
			for (var r in n) !n.hasOwnProperty(r) || t != null && t.hasOwnProperty(r) || (r.indexOf("--") === 0 ? e.setProperty(r, "") : r === "float" ? e.cssFloat = "" : e[r] = "", P = !0);
			for (var a in t) r = t[a], t.hasOwnProperty(a) && n[a] !== r && (mn(e, a, r), P = !0);
		} else for (var o in t) t.hasOwnProperty(o) && mn(e, o, t[o]);
	}
	function gn(e) {
		if (e.indexOf("-") === -1) return !1;
		switch (e) {
			case "annotation-xml":
			case "color-profile":
			case "font-face":
			case "font-face-src":
			case "font-face-uri":
			case "font-face-format":
			case "font-face-name":
			case "missing-glyph": return !1;
			default: return !0;
		}
	}
	var _n = /* @__PURE__ */ new Map([
		["acceptCharset", "accept-charset"],
		["htmlFor", "for"],
		["httpEquiv", "http-equiv"],
		["crossOrigin", "crossorigin"],
		["accentHeight", "accent-height"],
		["alignmentBaseline", "alignment-baseline"],
		["arabicForm", "arabic-form"],
		["baselineShift", "baseline-shift"],
		["capHeight", "cap-height"],
		["clipPath", "clip-path"],
		["clipRule", "clip-rule"],
		["colorInterpolation", "color-interpolation"],
		["colorInterpolationFilters", "color-interpolation-filters"],
		["colorProfile", "color-profile"],
		["colorRendering", "color-rendering"],
		["dominantBaseline", "dominant-baseline"],
		["enableBackground", "enable-background"],
		["fillOpacity", "fill-opacity"],
		["fillRule", "fill-rule"],
		["floodColor", "flood-color"],
		["floodOpacity", "flood-opacity"],
		["fontFamily", "font-family"],
		["fontSize", "font-size"],
		["fontSizeAdjust", "font-size-adjust"],
		["fontStretch", "font-stretch"],
		["fontStyle", "font-style"],
		["fontVariant", "font-variant"],
		["fontWeight", "font-weight"],
		["glyphName", "glyph-name"],
		["glyphOrientationHorizontal", "glyph-orientation-horizontal"],
		["glyphOrientationVertical", "glyph-orientation-vertical"],
		["horizAdvX", "horiz-adv-x"],
		["horizOriginX", "horiz-origin-x"],
		["imageRendering", "image-rendering"],
		["letterSpacing", "letter-spacing"],
		["lightingColor", "lighting-color"],
		["markerEnd", "marker-end"],
		["markerMid", "marker-mid"],
		["markerStart", "marker-start"],
		["maskType", "mask-type"],
		["overlinePosition", "overline-position"],
		["overlineThickness", "overline-thickness"],
		["paintOrder", "paint-order"],
		["panose-1", "panose-1"],
		["pointerEvents", "pointer-events"],
		["renderingIntent", "rendering-intent"],
		["shapeRendering", "shape-rendering"],
		["stopColor", "stop-color"],
		["stopOpacity", "stop-opacity"],
		["strikethroughPosition", "strikethrough-position"],
		["strikethroughThickness", "strikethrough-thickness"],
		["strokeDasharray", "stroke-dasharray"],
		["strokeDashoffset", "stroke-dashoffset"],
		["strokeLinecap", "stroke-linecap"],
		["strokeLinejoin", "stroke-linejoin"],
		["strokeMiterlimit", "stroke-miterlimit"],
		["strokeOpacity", "stroke-opacity"],
		["strokeWidth", "stroke-width"],
		["textAnchor", "text-anchor"],
		["textDecoration", "text-decoration"],
		["textRendering", "text-rendering"],
		["transformOrigin", "transform-origin"],
		["underlinePosition", "underline-position"],
		["underlineThickness", "underline-thickness"],
		["unicodeBidi", "unicode-bidi"],
		["unicodeRange", "unicode-range"],
		["unitsPerEm", "units-per-em"],
		["vAlphabetic", "v-alphabetic"],
		["vHanging", "v-hanging"],
		["vIdeographic", "v-ideographic"],
		["vMathematical", "v-mathematical"],
		["vectorEffect", "vector-effect"],
		["vertAdvY", "vert-adv-y"],
		["vertOriginX", "vert-origin-x"],
		["vertOriginY", "vert-origin-y"],
		["wordSpacing", "word-spacing"],
		["writingMode", "writing-mode"],
		["xmlnsXlink", "xmlns:xlink"],
		["xHeight", "x-height"]
	]), vn = /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;
	function yn(e) {
		return vn.test("" + e) ? "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')" : e;
	}
	function bn() {}
	var xn = null;
	function Sn(e) {
		return e = e.target || e.srcElement || window, e.correspondingUseElement && (e = e.correspondingUseElement), e.nodeType === 3 ? e.parentNode : e;
	}
	var Cn = null, wn = null;
	function Tn(e) {
		var t = Bt(e);
		if (t && (e = t.stateNode)) {
			var n = e[jt] || null;
			a: switch (e = t.stateNode, t.type) {
				case "input":
					if (I(e, n.value, n.defaultValue, n.defaultValue, n.checked, n.defaultChecked, n.type, n.name), t = n.name, n.type === "radio" && t != null) {
						for (n = e; n.parentNode;) n = n.parentNode;
						for (n = n.querySelectorAll("input[name=\"" + sn("" + t) + "\"][type=\"radio\"]"), t = 0; t < n.length; t++) {
							var r = n[t];
							if (r !== e && r.form === e.form) {
								var a = r[jt] || null;
								if (!a) throw Error(i(90));
								I(r, a.value, a.defaultValue, a.defaultValue, a.checked, a.defaultChecked, a.type, a.name);
							}
						}
						for (t = 0; t < n.length; t++) r = n[t], r.form === e.form && an(r);
					}
					break a;
				case "textarea":
					dn(e, n.value, n.defaultValue);
					break a;
				case "select": t = n.value, t != null && un(e, !!n.multiple, t, !1);
			}
		}
	}
	var En = !1;
	function Dn(e, t, n) {
		if (En) return e(t, n);
		En = !0;
		try {
			return e(t);
		} finally {
			if (En = !1, (Cn !== null || wn !== null) && (zd(), Cn && (t = Cn, e = wn, wn = Cn = null, Tn(t), e))) for (t = 0; t < e.length; t++) Tn(e[t]);
		}
	}
	function On(e, t) {
		var n = e.stateNode;
		if (n === null) return null;
		var r = n[jt] || null;
		if (r === null) return null;
		n = r[t];
		a: switch (t) {
			case "onClick":
			case "onClickCapture":
			case "onDoubleClick":
			case "onDoubleClickCapture":
			case "onMouseDown":
			case "onMouseDownCapture":
			case "onMouseMove":
			case "onMouseMoveCapture":
			case "onMouseUp":
			case "onMouseUpCapture":
			case "onMouseEnter":
				(r = !r.disabled) || (e = e.type, r = e !== "button" && e !== "input" && e !== "select" && e !== "textarea"), e = !r;
				break a;
			default: e = !1;
		}
		if (e) return null;
		if (n && typeof n != "function") throw Error(i(231, t, typeof n));
		return n;
	}
	var kn = typeof window < "u" && window.document !== void 0 && window.document.createElement !== void 0, An = !1;
	if (kn) try {
		var jn = {};
		Object.defineProperty(jn, "passive", { get: function() {
			An = !0;
		} }), window.addEventListener("test", jn, jn), window.removeEventListener("test", jn, jn);
	} catch {
		An = !1;
	}
	var R = null, Mn = null, Nn = null;
	function Pn() {
		if (Nn) return Nn;
		var e, t = Mn, n = t.length, r, i = "value" in R ? R.value : R.textContent, a = i.length;
		for (e = 0; e < n && t[e] === i[e]; e++);
		var o = n - e;
		for (r = 1; r <= o && t[n - r] === i[a - r]; r++);
		return Nn = i.slice(e, 1 < r ? 1 - r : void 0);
	}
	function Fn(e) {
		var t = e.keyCode;
		return "charCode" in e ? (e = e.charCode, e === 0 && t === 13 && (e = 13)) : e = t, e === 10 && (e = 13), 32 <= e || e === 13 ? e : 0;
	}
	function In() {
		return !0;
	}
	function Ln() {
		return !1;
	}
	function Rn(e) {
		function t(t, n, r, i, a) {
			for (var o in this._reactName = t, this._targetInst = r, this.type = n, this.nativeEvent = i, this.target = a, this.currentTarget = null, e) e.hasOwnProperty(o) && (t = e[o], this[o] = t ? t(i) : i[o]);
			return this.isDefaultPrevented = (i.defaultPrevented == null ? !1 === i.returnValue : i.defaultPrevented) ? In : Ln, this.isPropagationStopped = Ln, this;
		}
		return C(t.prototype, {
			preventDefault: function() {
				this.defaultPrevented = !0;
				var e = this.nativeEvent;
				e && (e.preventDefault ? e.preventDefault() : typeof e.returnValue != "unknown" && (e.returnValue = !1), this.isDefaultPrevented = In);
			},
			stopPropagation: function() {
				var e = this.nativeEvent;
				e && (e.stopPropagation ? e.stopPropagation() : typeof e.cancelBubble != "unknown" && (e.cancelBubble = !0), this.isPropagationStopped = In);
			},
			persist: function() {},
			isPersistent: In
		}), t;
	}
	var zn = {
		eventPhase: 0,
		bubbles: 0,
		cancelable: 0,
		timeStamp: function(e) {
			return e.timeStamp || Date.now();
		},
		defaultPrevented: 0,
		isTrusted: 0
	}, Bn = Rn(zn), Vn = C({}, zn, {
		view: 0,
		detail: 0
	}), Hn = Rn(Vn), Un, Wn, Gn, Kn = C({}, Vn, {
		screenX: 0,
		screenY: 0,
		clientX: 0,
		clientY: 0,
		pageX: 0,
		pageY: 0,
		ctrlKey: 0,
		shiftKey: 0,
		altKey: 0,
		metaKey: 0,
		getModifierState: rr,
		button: 0,
		buttons: 0,
		relatedTarget: function(e) {
			return e.relatedTarget === void 0 ? e.fromElement === e.srcElement ? e.toElement : e.fromElement : e.relatedTarget;
		},
		movementX: function(e) {
			return "movementX" in e ? e.movementX : (e !== Gn && (Gn && e.type === "mousemove" ? (Un = e.screenX - Gn.screenX, Wn = e.screenY - Gn.screenY) : Wn = Un = 0, Gn = e), Un);
		},
		movementY: function(e) {
			return "movementY" in e ? e.movementY : Wn;
		}
	}), qn = Rn(Kn), Jn = Rn(C({}, Kn, { dataTransfer: 0 })), Yn = Rn(C({}, Vn, { relatedTarget: 0 })), Xn = Rn(C({}, zn, {
		animationName: 0,
		elapsedTime: 0,
		pseudoElement: 0
	})), Zn = Rn(C({}, zn, { clipboardData: function(e) {
		return "clipboardData" in e ? e.clipboardData : window.clipboardData;
	} })), Qn = Rn(C({}, zn, { data: 0 })), $n = {
		Esc: "Escape",
		Spacebar: " ",
		Left: "ArrowLeft",
		Up: "ArrowUp",
		Right: "ArrowRight",
		Down: "ArrowDown",
		Del: "Delete",
		Win: "OS",
		Menu: "ContextMenu",
		Apps: "ContextMenu",
		Scroll: "ScrollLock",
		MozPrintableKey: "Unidentified"
	}, er = {
		8: "Backspace",
		9: "Tab",
		12: "Clear",
		13: "Enter",
		16: "Shift",
		17: "Control",
		18: "Alt",
		19: "Pause",
		20: "CapsLock",
		27: "Escape",
		32: " ",
		33: "PageUp",
		34: "PageDown",
		35: "End",
		36: "Home",
		37: "ArrowLeft",
		38: "ArrowUp",
		39: "ArrowRight",
		40: "ArrowDown",
		45: "Insert",
		46: "Delete",
		112: "F1",
		113: "F2",
		114: "F3",
		115: "F4",
		116: "F5",
		117: "F6",
		118: "F7",
		119: "F8",
		120: "F9",
		121: "F10",
		122: "F11",
		123: "F12",
		144: "NumLock",
		145: "ScrollLock",
		224: "Meta"
	}, tr = {
		Alt: "altKey",
		Control: "ctrlKey",
		Meta: "metaKey",
		Shift: "shiftKey"
	};
	function nr(e) {
		var t = this.nativeEvent;
		return t.getModifierState ? t.getModifierState(e) : (e = tr[e]) ? !!t[e] : !1;
	}
	function rr() {
		return nr;
	}
	var ir = Rn(C({}, Vn, {
		key: function(e) {
			if (e.key) {
				var t = $n[e.key] || e.key;
				if (t !== "Unidentified") return t;
			}
			return e.type === "keypress" ? (e = Fn(e), e === 13 ? "Enter" : String.fromCharCode(e)) : e.type === "keydown" || e.type === "keyup" ? er[e.keyCode] || "Unidentified" : "";
		},
		code: 0,
		location: 0,
		ctrlKey: 0,
		shiftKey: 0,
		altKey: 0,
		metaKey: 0,
		repeat: 0,
		locale: 0,
		getModifierState: rr,
		charCode: function(e) {
			return e.type === "keypress" ? Fn(e) : 0;
		},
		keyCode: function(e) {
			return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
		},
		which: function(e) {
			return e.type === "keypress" ? Fn(e) : e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
		}
	})), ar = Rn(C({}, Kn, {
		pointerId: 0,
		width: 0,
		height: 0,
		pressure: 0,
		tangentialPressure: 0,
		tiltX: 0,
		tiltY: 0,
		twist: 0,
		pointerType: 0,
		isPrimary: 0
	})), or = Rn(C({}, zn, { submitter: 0 })), sr = Rn(C({}, Vn, {
		touches: 0,
		targetTouches: 0,
		changedTouches: 0,
		altKey: 0,
		metaKey: 0,
		ctrlKey: 0,
		shiftKey: 0,
		getModifierState: rr
	})), cr = Rn(C({}, zn, {
		propertyName: 0,
		elapsedTime: 0,
		pseudoElement: 0
	})), lr = Rn(C({}, Kn, {
		deltaX: function(e) {
			return "deltaX" in e ? e.deltaX : "wheelDeltaX" in e ? -e.wheelDeltaX : 0;
		},
		deltaY: function(e) {
			return "deltaY" in e ? e.deltaY : "wheelDeltaY" in e ? -e.wheelDeltaY : "wheelDelta" in e ? -e.wheelDelta : 0;
		},
		deltaZ: 0,
		deltaMode: 0
	})), ur = Rn(C({}, zn, {
		newState: 0,
		oldState: 0,
		source: 0
	})), dr = [
		9,
		13,
		27,
		32
	], fr = kn && "CompositionEvent" in window, pr = null;
	kn && "documentMode" in document && (pr = document.documentMode);
	var mr = kn && "TextEvent" in window && !pr, hr = kn && (!fr || pr && 8 < pr && 11 >= pr), gr = " ", _r = !1;
	function vr(e, t) {
		switch (e) {
			case "keyup": return dr.indexOf(t.keyCode) !== -1;
			case "keydown": return t.keyCode !== 229;
			case "keypress":
			case "mousedown":
			case "focusout": return !0;
			default: return !1;
		}
	}
	function yr(e) {
		return e = e.detail, typeof e == "object" && "data" in e ? e.data : null;
	}
	var z = !1;
	function br(e, t) {
		switch (e) {
			case "compositionend": return yr(t);
			case "keypress": return t.which === 32 ? (_r = !0, gr) : null;
			case "textInput": return e = t.data, e === gr && _r ? null : e;
			default: return null;
		}
	}
	function B(e, t) {
		if (z) return e === "compositionend" || !fr && vr(e, t) ? (e = Pn(), Nn = Mn = R = null, z = !1, e) : null;
		switch (e) {
			case "paste": return null;
			case "keypress":
				if (!(t.ctrlKey || t.altKey || t.metaKey) || t.ctrlKey && t.altKey) {
					if (t.char && 1 < t.char.length) return t.char;
					if (t.which) return String.fromCharCode(t.which);
				}
				return null;
			case "compositionend": return hr && t.locale !== "ko" ? null : t.data;
			default: return null;
		}
	}
	var V = {
		color: !0,
		date: !0,
		datetime: !0,
		"datetime-local": !0,
		email: !0,
		month: !0,
		number: !0,
		password: !0,
		range: !0,
		search: !0,
		tel: !0,
		text: !0,
		time: !0,
		url: !0,
		week: !0
	};
	function xr(e) {
		var t = e && e.nodeName && e.nodeName.toLowerCase();
		return t === "input" ? !!V[e.type] : t === "textarea";
	}
	function Sr(e, t, n, r) {
		Cn ? wn ? wn.push(r) : wn = [r] : Cn = r, t = Jf(t, "onChange"), 0 < t.length && (n = new Bn("onChange", "change", null, n, r), e.push({
			event: n,
			listeners: t
		}));
	}
	var Cr = null, wr = null;
	function Tr(e) {
		Vf(e, 0);
	}
	function Er(e) {
		if (an(Vt(e))) return e;
	}
	function Dr(e, t) {
		if (e === "change") return t;
	}
	var Or = !1;
	if (kn) {
		var kr;
		if (kn) {
			var Ar = "oninput" in document;
			if (!Ar) {
				var jr = document.createElement("div");
				jr.setAttribute("oninput", "return;"), Ar = typeof jr.oninput == "function";
			}
			kr = Ar;
		} else kr = !1;
		Or = kr && (!document.documentMode || 9 < document.documentMode);
	}
	function Mr() {
		Cr && (Cr.detachEvent("onpropertychange", Nr), wr = Cr = null);
	}
	function Nr(e) {
		if (e.propertyName === "value" && Er(wr)) {
			var t = [];
			Sr(t, wr, e, Sn(e)), Dn(Tr, t);
		}
	}
	function Pr(e, t, n) {
		e === "focusin" ? (Mr(), Cr = t, wr = n, Cr.attachEvent("onpropertychange", Nr)) : e === "focusout" && Mr();
	}
	function Fr(e) {
		if (e === "selectionchange" || e === "keyup" || e === "keydown") return Er(wr);
	}
	function Ir(e, t) {
		if (e === "click") return Er(t);
	}
	function Lr(e, t) {
		if (e === "input" || e === "change") return Er(t);
	}
	function Rr(e, t) {
		return e === t && (e !== 0 || 1 / e == 1 / t) || e !== e && t !== t;
	}
	var zr = typeof Object.is == "function" ? Object.is : Rr;
	function Br(e, t) {
		if (zr(e, t)) return !0;
		if (typeof e != "object" || !e || typeof t != "object" || !t) return !1;
		var n = Object.keys(e), r = Object.keys(t);
		if (n.length !== r.length) return !1;
		for (r = 0; r < n.length; r++) {
			var i = n[r];
			if (!Ge.call(t, i) || !zr(e[i], t[i])) return !1;
		}
		return !0;
	}
	function Vr(e) {
		if (e ||= typeof document < "u" ? document : void 0, e === void 0) return null;
		try {
			return e.activeElement || e.body;
		} catch {
			return e.body;
		}
	}
	function Hr(e) {
		for (; e && e.firstChild;) e = e.firstChild;
		return e;
	}
	function Ur(e, t) {
		var n = Hr(e);
		e = 0;
		for (var r; n;) {
			if (n.nodeType === 3) {
				if (r = e + n.textContent.length, e <= t && r >= t) return {
					node: n,
					offset: t - e
				};
				e = r;
			}
			a: {
				for (; n;) {
					if (n.nextSibling) {
						n = n.nextSibling;
						break a;
					}
					n = n.parentNode;
				}
				n = void 0;
			}
			n = Hr(n);
		}
	}
	function Wr(e, t) {
		return e && t ? e === t ? !0 : e && e.nodeType === 3 ? !1 : t && t.nodeType === 3 ? Wr(e, t.parentNode) : "contains" in e ? e.contains(t) : e.compareDocumentPosition ? !!(e.compareDocumentPosition(t) & 16) : !1 : !1;
	}
	function Gr(e) {
		e = e != null && e.ownerDocument != null && e.ownerDocument.defaultView != null ? e.ownerDocument.defaultView : window;
		for (var t = Vr(e.document); t instanceof e.HTMLIFrameElement;) {
			try {
				var n = typeof t.contentWindow.location.href == "string";
			} catch {
				n = !1;
			}
			if (n) e = t.contentWindow;
			else break;
			t = Vr(e.document);
		}
		return t;
	}
	function Kr(e) {
		var t = e && e.nodeName && e.nodeName.toLowerCase();
		return t && (t === "input" && (e.type === "text" || e.type === "search" || e.type === "tel" || e.type === "url" || e.type === "password") || t === "textarea" || e.contentEditable === "true");
	}
	var qr = kn && "documentMode" in document && 11 >= document.documentMode, Jr = null, Yr = null, Xr = null, Zr = !1;
	function Qr(e, t, n) {
		var r = n.window === n ? n.document : n.nodeType === 9 ? n : n.ownerDocument;
		Zr || Jr == null || Jr !== Vr(r) || (r = Jr, "selectionStart" in r && Kr(r) ? r = {
			start: r.selectionStart,
			end: r.selectionEnd
		} : (r = (r.ownerDocument && r.ownerDocument.defaultView || window).getSelection(), r = {
			anchorNode: r.anchorNode,
			anchorOffset: r.anchorOffset,
			focusNode: r.focusNode,
			focusOffset: r.focusOffset
		}), Xr && Br(Xr, r) || (Xr = r, r = Jf(Yr, "onSelect"), 0 < r.length && (t = new Bn("onSelect", "select", null, t, n), e.push({
			event: t,
			listeners: r
		}), t.target = Jr)));
	}
	function $r(e, t) {
		var n = {};
		return n[e.toLowerCase()] = t.toLowerCase(), n["Webkit" + e] = "webkit" + t, n["Moz" + e] = "moz" + t, n;
	}
	var ei = {
		animationend: $r("Animation", "AnimationEnd"),
		animationiteration: $r("Animation", "AnimationIteration"),
		animationstart: $r("Animation", "AnimationStart"),
		transitionrun: $r("Transition", "TransitionRun"),
		transitionstart: $r("Transition", "TransitionStart"),
		transitioncancel: $r("Transition", "TransitionCancel"),
		transitionend: $r("Transition", "TransitionEnd")
	}, ti = {}, ni = {};
	kn && (ni = document.createElement("div").style, "AnimationEvent" in window || (delete ei.animationend.animation, delete ei.animationiteration.animation, delete ei.animationstart.animation), "TransitionEvent" in window || delete ei.transitionend.transition);
	function ri(e) {
		if (ti[e]) return ti[e];
		if (!ei[e]) return e;
		var t = ei[e], n;
		for (n in t) if (t.hasOwnProperty(n) && n in ni) return ti[e] = t[n];
		return e;
	}
	var ii = ri("animationend"), ai = ri("animationiteration"), oi = ri("animationstart"), si = ri("transitionrun"), ci = ri("transitionstart"), li = ri("transitioncancel"), ui = ri("transitionend"), di = /* @__PURE__ */ new Map(), fi = "abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error fullscreenChange fullscreenError gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
	fi.push("scrollEnd");
	function pi(e, t) {
		di.set(e, t), qt(t, [e]);
	}
	var mi = 0;
	function hi(e, t) {
		if (e.name != null && e.name !== "auto") return e.name;
		if (t.autoName !== null) return t.autoName;
		e = bd.identifierPrefix;
		var n = mi++;
		return e = "_" + e + "t_" + n.toString(32) + "_", t.autoName = e;
	}
	function gi(e) {
		if (e == null || typeof e == "string") return e;
		var t = null, n = Od;
		if (n !== null) for (var r = 0; r < n.length; r++) {
			var i = e[n[r]];
			if (i != null) {
				if (i === "none") return "none";
				t = t == null ? i : t + (" " + i);
			}
		}
		return t ?? e.default;
	}
	function _i(e, t) {
		return e = gi(e), t = gi(t), t == null ? e === "auto" ? null : e : t === "auto" ? null : t;
	}
	var vi = typeof reportError == "function" ? reportError : function(e) {
		if (typeof window == "object" && typeof window.ErrorEvent == "function") {
			var t = new window.ErrorEvent("error", {
				bubbles: !0,
				cancelable: !0,
				message: typeof e == "object" && e && typeof e.message == "string" ? String(e.message) : String(e),
				error: e
			});
			if (!window.dispatchEvent(t)) return;
		} else if (typeof process == "object" && typeof process.emit == "function") {
			process.emit("uncaughtException", e);
			return;
		}
		console.error(e);
	}, yi = [], bi = 0, xi = 0;
	function Si() {
		for (var e = bi, t = xi = bi = 0; t < e;) {
			var n = yi[t];
			yi[t++] = null;
			var r = yi[t];
			yi[t++] = null;
			var i = yi[t];
			yi[t++] = null;
			var a = yi[t];
			if (yi[t++] = null, r !== null && i !== null) {
				var o = r.pending;
				o === null ? i.next = i : (i.next = o.next, o.next = i), r.pending = i;
			}
			a !== 0 && Ei(n, i, a);
		}
	}
	function Ci(e, t, n, r) {
		yi[bi++] = e, yi[bi++] = t, yi[bi++] = n, yi[bi++] = r, xi |= r, e.lanes |= r, e = e.alternate, e !== null && (e.lanes |= r);
	}
	function wi(e, t, n, r) {
		return Ci(e, t, n, r), Di(e);
	}
	function Ti(e, t) {
		return Ci(e, null, null, t), Di(e);
	}
	function Ei(e, t, n) {
		e.lanes |= n;
		var r = e.alternate;
		r !== null && (r.lanes |= n);
		for (var i = !1, a = e.return; a !== null;) a.childLanes |= n, r = a.alternate, r !== null && (r.childLanes |= n), a.tag === 22 && (e = a.stateNode, e === null || e._visibility & 1 || (i = !0)), e = a, a = a.return;
		return e.tag === 3 ? (a = e.stateNode, i && t !== null && (i = 31 - ct(n), e = a.hiddenUpdates, r = e[i], r === null ? e[i] = [t] : r.push(t), t.lane = n | 536870912), a) : null;
	}
	function Di(e) {
		if (50 < kd) throw kd = 0, Ad = null, Error(i(185));
		for (var t = e.return; t !== null;) e = t, t = e.return;
		return e.tag === 3 ? e.stateNode : null;
	}
	var Oi = {};
	function ki(e, t, n, r) {
		this.tag = e, this.key = n, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.refCleanup = this.ref = null, this.pendingProps = t, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = r, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
	}
	function Ai(e, t, n, r) {
		return new ki(e, t, n, r);
	}
	function ji(e) {
		return e = e.prototype, !(!e || !e.isReactComponent);
	}
	function Mi(e, t) {
		var n = e.alternate;
		return n === null ? (n = Ai(e.tag, t, e.key, e.mode), n.elementType = e.elementType, n.type = e.type, n.stateNode = e.stateNode, n.alternate = e, e.alternate = n) : (n.pendingProps = t, n.type = e.type, n.flags = 0, n.subtreeFlags = 0, n.deletions = null), n.flags = e.flags & 1206910976, n.childLanes = e.childLanes, n.lanes = e.lanes, n.child = e.child, n.memoizedProps = e.memoizedProps, n.memoizedState = e.memoizedState, n.updateQueue = e.updateQueue, t = e.dependencies, n.dependencies = t === null ? null : {
			lanes: t.lanes,
			firstContext: t.firstContext
		}, n.sibling = e.sibling, n.index = e.index, n.ref = e.ref, n.refCleanup = e.refCleanup, n;
	}
	function Ni(e, t) {
		e.flags &= 1206910978;
		var n = e.alternate;
		return n === null ? (e.childLanes = 0, e.lanes = t, e.child = null, e.subtreeFlags = 0, e.memoizedProps = null, e.memoizedState = null, e.updateQueue = null, e.dependencies = null, e.stateNode = null) : (e.childLanes = n.childLanes, e.lanes = n.lanes, e.child = n.child, e.subtreeFlags = 0, e.deletions = null, e.memoizedProps = n.memoizedProps, e.memoizedState = n.memoizedState, e.updateQueue = n.updateQueue, e.type = n.type, t = n.dependencies, e.dependencies = t === null ? null : {
			lanes: t.lanes,
			firstContext: t.firstContext
		}), e;
	}
	function Pi(e, t, n, r, a, o) {
		var s = 0;
		if (r = e, typeof r == "function") ji(r) && (s = 1);
		else if (typeof r == "string") s = qm(e, n, Ae.current) ? 26 : e === "html" || e === "head" || e === "body" ? 27 : 5;
		else a: switch (r) {
			case he: return e = Ai(31, n, t, a), e.elementType = he, e.lanes = o, e;
			case se: return Fi(n.children, a, o, t);
			case ce:
				s = 8, a |= 24;
				break;
			case w: return e = Ai(12, n, t, a | 2), e.elementType = w, e.lanes = o, e;
			case de: return e = Ai(13, n, t, a), e.elementType = de, e.lanes = o, e;
			case fe: return e = Ai(19, n, t, a), e.elementType = fe, e.lanes = o, e;
			case ge:
			case ve: return e = a | 32, e = Ai(30, n, t, e), e.elementType = ve, e.lanes = o, e.stateNode = {
				autoName: null,
				paired: null,
				clones: null,
				ref: null
			}, e;
			default:
				if (typeof r == "object" && r) switch (r.$$typeof) {
					case ue:
						s = 10;
						break a;
					case le:
						s = 9;
						break a;
					case T:
						s = 11;
						break a;
					case pe:
						s = 14;
						break a;
					case me:
						s = 16, r = null;
						break a;
				}
				s = 29, n = Error(i(130, e === null ? "null" : typeof e, "")), r = null;
		}
		return t = Ai(s, n, t, a), t.elementType = e, t.type = r, t.lanes = o, t;
	}
	function Fi(e, t, n, r) {
		return e = Ai(7, e, r, t), e.lanes = n, e;
	}
	function Ii(e, t, n) {
		return e = Ai(6, e, null, t), e.lanes = n, e;
	}
	function Li(e) {
		var t = Ai(18, null, null, 0);
		return t.stateNode = e, t;
	}
	function Ri(e, t, n) {
		return t = Ai(4, e.children === null ? [] : e.children, e.key, t), t.lanes = n, t.stateNode = {
			containerInfo: e.containerInfo,
			pendingChildren: null,
			implementation: e.implementation
		}, t;
	}
	var zi = /* @__PURE__ */ new WeakMap();
	function Bi(e, t) {
		if (typeof e == "object" && e) {
			var n = zi.get(e);
			return n === void 0 ? (t = {
				value: e,
				source: t,
				stack: We(t)
			}, zi.set(e, t), t) : n;
		}
		return {
			value: e,
			source: t,
			stack: We(t)
		};
	}
	var Vi = [], Hi = 0, Ui = null, Wi = 0, Gi = [], Ki = 0, qi = null, Ji = 1, Yi = "";
	function Xi(e, t) {
		Vi[Hi++] = Wi, Vi[Hi++] = Ui, Ui = e, Wi = t;
	}
	function Zi(e, t, n) {
		Gi[Ki++] = Ji, Gi[Ki++] = Yi, Gi[Ki++] = qi, qi = e;
		var r = Ji;
		e = Yi;
		var i = 32 - ct(r) - 1;
		r &= ~(1 << i), n += 1;
		var a = 32 - ct(t) + i;
		if (30 < a) {
			var o = i - i % 5;
			a = (r & (1 << o) - 1).toString(32), r >>= o, i -= o, Ji = 1 << 32 - ct(t) + i | n << i | r, Yi = a + e;
		} else Ji = 1 << a | n << i | r, Yi = e;
	}
	function Qi(e) {
		e.return !== null && (Xi(e, 1), Zi(e, 1, 0));
	}
	function $i(e) {
		for (; e === Ui;) Ui = Vi[--Hi], Vi[Hi] = null, Wi = Vi[--Hi], Vi[Hi] = null;
		for (; e === qi;) qi = Gi[--Ki], Gi[Ki] = null, Yi = Gi[--Ki], Gi[Ki] = null, Ji = Gi[--Ki], Gi[Ki] = null;
	}
	function ea(e, t) {
		Gi[Ki++] = Ji, Gi[Ki++] = Yi, Gi[Ki++] = qi, Ji = t.id, Yi = t.overflow, qi = e;
	}
	var ta = null, na = null, H = !1, ra = null, ia = !1, aa = Error(i(519));
	function oa(e) {
		throw fa(Bi(Error(i(418, 1 < arguments.length && arguments[1] !== void 0 && arguments[1] ? "text" : "HTML", "")), e)), aa;
	}
	function sa(e) {
		var t = e.stateNode, n = e.type, r = e.memoizedProps;
		switch (t[A] = e, t[jt] = r, n) {
			case "dialog":
				Q("cancel", t), Q("close", t);
				break;
			case "iframe":
			case "object":
			case "embed":
				Q("load", t);
				break;
			case "video":
			case "audio":
				for (n = 0; n < zf.length; n++) Q(zf[n], t);
				break;
			case "source":
				Q("error", t);
				break;
			case "img":
			case "image":
			case "link":
				Q("error", t), Q("load", t);
				break;
			case "details":
				Q("toggle", t);
				break;
			case "input":
				Q("invalid", t), cn(t, r.value, r.defaultValue, r.checked, r.defaultChecked, r.type, r.name, !0);
				break;
			case "select":
				Q("invalid", t);
				break;
			case "textarea": Q("invalid", t), fn(t, r.value, r.defaultValue, r.children);
		}
		n = r.children, typeof n != "string" && typeof n != "number" && typeof n != "bigint" || t.textContent === "" + n || !0 === r.suppressHydrationWarning || ep(t.textContent, n) ? (r.popover != null && (Q("beforetoggle", t), Q("toggle", t)), r.onScroll != null && Q("scroll", t), r.onScrollEnd != null && Q("scrollend", t), r.onClick != null && (t.onclick = bn), t = !0) : t = !1, t || oa(e, !0);
	}
	function ca(e) {
		for (ta = e.return; ta;) switch (ta.tag) {
			case 5:
			case 31:
			case 13:
				ia = !1;
				return;
			case 27:
			case 3:
				ia = !0;
				return;
			default: ta = ta.return;
		}
	}
	function la(e) {
		if (e !== ta) return !1;
		if (!H) return ca(e), H = !0, !1;
		var t = e.tag, n;
		if ((n = t !== 3 && t !== 27) && ((n = t === 5) && (n = e.type, n = n === "form" || n === "button" || pp(e.type, e.memoizedProps)), n = !n), n && na && oa(e), ca(e), t === 13) {
			if (e = e.memoizedState, e = e === null ? null : e.dehydrated, !e) throw Error(i(317));
			na = dm(e);
		} else if (t === 31) {
			if (e = e.memoizedState, e = e === null ? null : e.dehydrated, !e) throw Error(i(317));
			na = dm(e);
		} else t === 27 ? (t = na, Sp(e.type) ? (e = um, um = null, na = e) : na = t) : na = ta ? lm(e.stateNode.nextSibling) : null;
		return !0;
	}
	function ua() {
		na = ta = null, H = !1;
	}
	function da() {
		var e = ra;
		return e !== null && (fd === null ? fd = e : fd.push.apply(fd, e), ra = null), e;
	}
	function fa(e) {
		ra === null ? ra = [e] : ra.push(e);
	}
	var pa = Oe(null), ma = null, ha = null;
	function ga(e, t, n) {
		O(pa, t._currentValue), t._currentValue = n;
	}
	function _a(e) {
		e._currentValue = pa.current, ke(pa);
	}
	function va(e, t, n) {
		for (; e !== null;) {
			var r = e.alternate;
			if ((e.childLanes & t) === t ? r !== null && (r.childLanes & t) !== t && (r.childLanes |= t) : (e.childLanes |= t, r !== null && (r.childLanes |= t)), e === n) break;
			e = e.return;
		}
	}
	function ya(e, t, n, r) {
		var a = e.child;
		for (a !== null && (a.return = e); a !== null;) {
			var o = a.dependencies;
			if (o !== null) {
				var s = a.child;
				o = o.firstContext;
				a: for (; o !== null;) {
					var c = o;
					o = a;
					for (var l = 0; l < t.length; l++) if (c.context === t[l]) {
						o.lanes |= n, c = o.alternate, c !== null && (c.lanes |= n), va(o.return, n, e), r || (s = null);
						break a;
					}
					o = c.next;
				}
			} else if (a.tag === 18) {
				if (s = a.return, s === null) throw Error(i(341));
				s.lanes |= n, o = s.alternate, o !== null && (o.lanes |= n), va(s, n, e), s = null;
			} else a.tag === 13 && a.memoizedState !== null && a.memoizedState.dehydrated === null ? (a.lanes |= n, s = a.alternate, s !== null && (s.lanes |= n), va(a.return, n, e), s = a.child, s = s === null ? null : s.sibling) : s = a.child;
			if (s !== null) s.return = a;
			else for (s = a; s !== null;) {
				if (s === e) {
					s = null;
					break;
				}
				if (a = s.sibling, a !== null) {
					a.return = s.return, s = a;
					break;
				}
				s = s.return;
			}
			a = s;
		}
	}
	function ba(e, t, n, r) {
		e = null;
		for (var a = t, o = !1; a !== null;) {
			if (!o) {
				if (a.flags & 524288) o = !0;
				else if (a.flags & 262144) break;
			}
			if (a.tag === 10) {
				var s = a.alternate;
				if (s === null) throw Error(i(387));
				if (s = s.memoizedProps, s !== null) {
					var c = a.type;
					zr(a.pendingProps.value, s.value) || (e === null ? e = [c] : e.push(c));
				}
			} else if (a === Ne.current) {
				if (s = a.alternate, s === null) throw Error(i(387));
				s.memoizedState.memoizedState !== a.memoizedState.memoizedState && (e === null ? e = [sh] : e.push(sh));
			}
			a = a.return;
		}
		return e !== null && ya(t, e, n, r), t.flags |= 262144, e !== null;
	}
	function xa(e) {
		for (e = e.firstContext; e !== null;) {
			if (!zr(e.context._currentValue, e.memoizedValue)) return !0;
			e = e.next;
		}
		return !1;
	}
	function Sa(e) {
		ma = e, ha = null, e = e.dependencies, e !== null && (e.firstContext = null);
	}
	function Ca(e) {
		return Ta(ma, e);
	}
	function wa(e, t) {
		return ma === null && Sa(e), Ta(e, t);
	}
	function Ta(e, t) {
		var n = t._currentValue;
		if (t = {
			context: t,
			memoizedValue: n,
			next: null
		}, ha === null) {
			if (e === null) throw Error(i(308));
			ha = t, e.dependencies = {
				lanes: 0,
				firstContext: t
			}, e.flags |= 524288;
		} else ha = ha.next = t;
		return n;
	}
	var Ea = typeof AbortController < "u" ? AbortController : function() {
		var e = [], t = this.signal = {
			aborted: !1,
			addEventListener: function(t, n) {
				e.push(n);
			}
		};
		this.abort = function() {
			t.aborted = !0, e.forEach(function(e) {
				return e();
			});
		};
	}, Da = t.unstable_scheduleCallback, Oa = t.unstable_NormalPriority, ka = {
		$$typeof: ue,
		Consumer: null,
		Provider: null,
		_currentValue: null,
		_currentValue2: null,
		_threadCount: 0
	};
	function Aa() {
		return {
			controller: new Ea(),
			data: /* @__PURE__ */ new Map(),
			refCount: 0
		};
	}
	function ja(e) {
		e.refCount--, e.refCount === 0 && Da(Oa, function() {
			e.controller.abort();
		});
	}
	function Ma(e, t) {
		if (e.pendingLanes & 4194048) {
			var n = e.transitionTypes;
			for (n === null && (n = e.transitionTypes = []), e = 0; e < t.length; e++) {
				var r = t[e];
				n.indexOf(r) === -1 && n.push(r);
			}
		}
	}
	var Na = null;
	function Pa(e) {
		var t = e.transitionTypes;
		return e.transitionTypes = null, t;
	}
	var Fa = null, Ia = 0, La = 0, Ra = null;
	function za(e, t) {
		if (Fa === null) {
			var n = Fa = [];
			Ia = 0, La = Pf(), Ra = {
				status: "pending",
				value: void 0,
				then: function(e) {
					n.push(e);
				}
			};
		}
		return Ia++, t.then(Ba, Ba), t;
	}
	function Ba() {
		if (--Ia === 0 && (Na = null, Fa !== null)) {
			Ra !== null && (Ra.status = "fulfilled");
			var e = Fa;
			Fa = null, La = 0, Ra = null;
			for (var t = 0; t < e.length; t++) (0, e[t])();
		}
	}
	function Va(e, t) {
		var n = [], r = {
			status: "pending",
			value: null,
			reason: null,
			then: function(e) {
				n.push(e);
			}
		};
		return e.then(function() {
			r.status = "fulfilled", r.value = t;
			for (var e = 0; e < n.length; e++) (0, n[e])(t);
		}, function(e) {
			for (r.status = "rejected", r.reason = e, e = 0; e < n.length; e++) (0, n[e])(void 0);
		}), r;
	}
	var Ha = E.S;
	E.S = function(e, t) {
		if (hd = Xe(), typeof t == "object" && t && typeof t.then == "function" && za(e, t), Na !== null) for (var n = bf; n !== null;) Ma(n, Na), n = n.next;
		if (n = e.types, n !== null) {
			for (var r = bf; r !== null;) Ma(r, n), r = r.next;
			if (La !== 0) {
				r = Na, r === null && (r = Na = []);
				for (var i = 0; i < n.length; i++) {
					var a = n[i];
					r.indexOf(a) === -1 && r.push(a);
				}
			}
		}
		Ha !== null && Ha(e, t);
	};
	var Ua = Oe(null);
	function Wa() {
		var e = Ua.current;
		return e === null ? q.pooledCache : e;
	}
	function Ga(e, t) {
		t === null ? O(Ua, Ua.current) : O(Ua, t.pool);
	}
	function Ka() {
		var e = Wa();
		return e === null ? null : {
			parent: ka._currentValue,
			pool: e
		};
	}
	var qa = Error(i(460)), Ja = Error(i(474)), Ya = Error(i(542)), Xa = { then: function() {} };
	function Za(e) {
		return e = e.status, e === "fulfilled" || e === "rejected";
	}
	function Qa(e, t, n) {
		switch (n = e[n], n === void 0 ? e.push(t) : n !== t && (t.then(bn, bn), t = n), t.status) {
			case "fulfilled": return t.value;
			case "rejected": throw e = t.reason, no(e), e === void 0 && !("reason" in t) ? Error(i(600)) : e;
			default:
				if (typeof t.status == "string") t.then(bn, bn);
				else {
					if (e = q, e !== null && 100 < e.shellSuspendCounter) throw Error(i(482));
					e = t, e.status = "pending", e.then(function(e) {
						if (t.status === "pending") {
							var n = t;
							n.status = "fulfilled", n.value = e;
						}
					}, function(e) {
						if (t.status === "pending") {
							var n = t;
							n.status = "rejected", n.reason = e;
						}
					});
				}
				switch (t.status) {
					case "fulfilled": return t.value;
					case "rejected": throw e = t.reason, no(e), e;
				}
				throw eo = t, qa;
		}
	}
	function $a(e) {
		try {
			var t = e._init;
			return t(e._payload);
		} catch (e) {
			throw typeof e == "object" && e && typeof e.then == "function" ? (eo = e, qa) : e;
		}
	}
	var eo = null;
	function to() {
		if (eo === null) throw Error(i(459));
		var e = eo;
		return eo = null, e;
	}
	function no(e) {
		if (e === qa || e === Ya) throw Error(i(483));
	}
	var ro = null, io = 0;
	function ao(e) {
		var t = io;
		return io += 1, ro === null && (ro = []), Qa(ro, e, t);
	}
	function oo(e, t) {
		t = t.props.ref, e.ref = t === void 0 ? null : t;
	}
	function so(e, t) {
		throw t.$$typeof === ie ? Error(i(525)) : (e = Object.prototype.toString.call(t), Error(i(31, e === "[object Object]" ? "object with keys {" + Object.keys(t).join(", ") + "}" : e)));
	}
	function co(e) {
		function t(t, n) {
			if (e) {
				var r = t.deletions;
				r === null ? (t.deletions = [n], t.flags |= 16) : r.push(n);
			}
		}
		function n(n, r) {
			if (!e) return null;
			for (; r !== null;) t(n, r), r = r.sibling;
			return null;
		}
		function r(e) {
			for (var t = /* @__PURE__ */ new Map(); e !== null;) e.key === null ? t.set(e.index, e) : t.set(e.key, e), e = e.sibling;
			return t;
		}
		function a(e, t) {
			return e = Mi(e, t), e.index = 0, e.sibling = null, e;
		}
		function o(t, n, r) {
			return t.index = r, e ? (r = t.alternate, r === null ? (t.flags |= 134217730, n) : (r = r.index, r < n ? (t.flags |= 2, n) : r)) : (t.flags |= 1048576, n);
		}
		function s(t) {
			return e && t.alternate === null && (t.flags |= 134217730), t;
		}
		function c(e, t, n, r) {
			return t === null || t.tag !== 6 ? (t = Ii(n, e.mode, r), t.return = e, t) : (t = a(t, n), t.return = e, t);
		}
		function l(e, t, n, r) {
			var i = n.type;
			return i === se ? (e = d(e, t, n.props.children, r, n.key), oo(e, n), e) : t !== null && (t.elementType === i || typeof i == "object" && i && i.$$typeof === me && $a(i) === t.type) ? (t = a(t, n.props), oo(t, n), t.return = e, t) : (t = Pi(n.type, n.key, n.props, null, e.mode, r), oo(t, n), t.return = e, t);
		}
		function u(e, t, n, r) {
			return t === null || t.tag !== 4 || t.stateNode.containerInfo !== n.containerInfo || t.stateNode.implementation !== n.implementation ? (t = Ri(n, e.mode, r), t.return = e, t) : (t = a(t, n.children || []), t.return = e, t);
		}
		function d(e, t, n, r, i) {
			return t === null || t.tag !== 7 ? (t = Fi(n, e.mode, r, i), t.return = e, t) : (t = a(t, n), t.return = e, t);
		}
		function f(e, t, n) {
			if (typeof t == "string" && t !== "" || typeof t == "number" || typeof t == "bigint") return t = Ii("" + t, e.mode, n), t.return = e, t;
			if (typeof t == "object" && t) {
				switch (t.$$typeof) {
					case ae: return n = Pi(t.type, t.key, t.props, null, e.mode, n), oo(n, t), n.return = e, n;
					case oe: return t = Ri(t, e.mode, n), t.return = e, t;
					case me: return t = $a(t), f(e, t, n);
				}
				if (we(t) || xe(t)) return t = Fi(t, e.mode, n, null), t.return = e, t;
				if (typeof t.then == "function") return f(e, ao(t), n);
				if (t.$$typeof === ue) return f(e, wa(e, t), n);
				so(e, t);
			}
			return null;
		}
		function p(e, t, n, r) {
			var i = t === null ? null : t.key;
			if (typeof n == "string" && n !== "" || typeof n == "number" || typeof n == "bigint") return i === null ? c(e, t, "" + n, r) : null;
			if (typeof n == "object" && n) {
				switch (n.$$typeof) {
					case ae: return n.key === i ? l(e, t, n, r) : null;
					case oe: return n.key === i ? u(e, t, n, r) : null;
					case me: return n = $a(n), p(e, t, n, r);
				}
				if (we(n) || xe(n)) return i === null ? d(e, t, n, r, null) : null;
				if (typeof n.then == "function") return p(e, t, ao(n), r);
				if (n.$$typeof === ue) return p(e, t, wa(e, n), r);
				so(e, n);
			}
			return null;
		}
		function m(e, t, n, r, i) {
			if (typeof r == "string" && r !== "" || typeof r == "number" || typeof r == "bigint") return e = e.get(n) || null, c(t, e, "" + r, i);
			if (typeof r == "object" && r) {
				switch (r.$$typeof) {
					case ae: return e = e.get(r.key === null ? n : r.key) || null, l(t, e, r, i);
					case oe: return e = e.get(r.key === null ? n : r.key) || null, u(t, e, r, i);
					case me: return r = $a(r), m(e, t, n, r, i);
				}
				if (we(r) || xe(r)) return e = e.get(n) || null, d(t, e, r, i, null);
				if (typeof r.then == "function") return m(e, t, n, ao(r), i);
				if (r.$$typeof === ue) return m(e, t, n, wa(t, r), i);
				so(t, r);
			}
			return null;
		}
		function h(i, a, s, c) {
			for (var l = null, u = null, d = a, h = a = 0, g = null; d !== null && h < s.length; h++) {
				d.index > h ? (g = d, d = null) : g = d.sibling;
				var _ = p(i, d, s[h], c);
				if (_ === null) {
					d === null && (d = g);
					break;
				}
				e && d && _.alternate === null && t(i, d), a = o(_, a, h), u === null ? l = _ : u.sibling = _, u = _, d = g;
			}
			if (h === s.length) return n(i, d), H && Xi(i, h), l;
			if (d === null) {
				for (; h < s.length; h++) d = f(i, s[h], c), d !== null && (a = o(d, a, h), u === null ? l = d : u.sibling = d, u = d);
				return H && Xi(i, h), l;
			}
			for (d = r(d); h < s.length; h++) g = m(d, i, h, s[h], c), g !== null && (e && (_ = g.alternate, _ !== null && d.delete(_.key === null ? h : _.key)), a = o(g, a, h), u === null ? l = g : u.sibling = g, u = g);
			return e && d.forEach(function(e) {
				return t(i, e);
			}), H && Xi(i, h), l;
		}
		function g(a, s, c, l) {
			if (c == null) throw Error(i(151));
			for (var u = null, d = null, h = s, g = s = 0, _ = null, v = c.next(); h !== null && !v.done; g++, v = c.next()) {
				h.index > g ? (_ = h, h = null) : _ = h.sibling;
				var y = p(a, h, v.value, l);
				if (y === null) {
					h === null && (h = _);
					break;
				}
				e && h && y.alternate === null && t(a, h), s = o(y, s, g), d === null ? u = y : d.sibling = y, d = y, h = _;
			}
			if (v.done) return n(a, h), H && Xi(a, g), u;
			if (h === null) {
				for (; !v.done; g++, v = c.next()) v = f(a, v.value, l), v !== null && (s = o(v, s, g), d === null ? u = v : d.sibling = v, d = v);
				return H && Xi(a, g), u;
			}
			for (h = r(h); !v.done; g++, v = c.next()) v = m(h, a, g, v.value, l), v !== null && (e && (_ = v.alternate, _ !== null && h.delete(_.key === null ? g : _.key)), s = o(v, s, g), d === null ? u = v : d.sibling = v, d = v);
			return e && h.forEach(function(e) {
				return t(a, e);
			}), H && Xi(a, g), u;
		}
		function _(e, r, o, c) {
			if (typeof o == "object" && o && o.type === se && o.key === null && o.props.ref === void 0 && (o = o.props.children), typeof o == "object" && o) {
				switch (o.$$typeof) {
					case ae:
						a: {
							for (var l = o.key; r !== null;) {
								if (r.key === l) {
									if (l = o.type, l === se) {
										if (r.tag === 7) {
											n(e, r.sibling), c = a(r, o.props.children), oo(c, o), c.return = e, e = c;
											break a;
										}
									} else if (r.elementType === l || typeof l == "object" && l && l.$$typeof === me && $a(l) === r.type) {
										n(e, r.sibling), c = a(r, o.props), oo(c, o), c.return = e, e = c;
										break a;
									}
									n(e, r);
									break;
								}
								t(e, r), r = r.sibling;
							}
							o.type === se ? (c = Fi(o.props.children, e.mode, c, o.key), oo(c, o), c.return = e, e = c) : (c = Pi(o.type, o.key, o.props, null, e.mode, c), oo(c, o), c.return = e, e = c);
						}
						return s(e);
					case oe:
						a: {
							for (l = o.key; r !== null;) {
								if (r.key === l) {
									if (r.tag === 4 && r.stateNode.containerInfo === o.containerInfo && r.stateNode.implementation === o.implementation) {
										n(e, r.sibling), c = a(r, o.children || []), c.return = e, e = c;
										break a;
									}
									n(e, r);
									break;
								}
								t(e, r), r = r.sibling;
							}
							c = Ri(o, e.mode, c), c.return = e, e = c;
						}
						return s(e);
					case me: return o = $a(o), _(e, r, o, c);
				}
				if (we(o)) return h(e, r, o, c);
				if (xe(o)) {
					if (l = xe(o), typeof l != "function") throw Error(i(150));
					return o = l.call(o), g(e, r, o, c);
				}
				if (typeof o.then == "function") return _(e, r, ao(o), c);
				if (o.$$typeof === ue) return _(e, r, wa(e, o), c);
				so(e, o);
			}
			return typeof o == "string" && o !== "" || typeof o == "number" || typeof o == "bigint" ? (o = "" + o, r !== null && r.tag === 6 ? (n(e, r.sibling), c = a(r, o), c.return = e, e = c) : (n(e, r), c = Ii(o, e.mode, c), c.return = e, e = c), s(e)) : n(e, r);
		}
		return function(e, t, n, r) {
			try {
				io = 0;
				var i = _(e, t, n, r);
				return ro = null, i;
			} catch (t) {
				if (t === qa || t === Ya) throw t;
				var a = Ai(29, t, null, e.mode);
				return a.lanes = r, a.return = e, a;
			}
		};
	}
	var lo = co(!0), uo = co(!1), fo = !1;
	function po(e) {
		e.updateQueue = {
			baseState: e.memoizedState,
			firstBaseUpdate: null,
			lastBaseUpdate: null,
			shared: {
				pending: null,
				lanes: 0,
				hiddenCallbacks: null
			},
			callbacks: null
		};
	}
	function mo(e, t) {
		e = e.updateQueue, t.updateQueue === e && (t.updateQueue = {
			baseState: e.baseState,
			firstBaseUpdate: e.firstBaseUpdate,
			lastBaseUpdate: e.lastBaseUpdate,
			shared: e.shared,
			callbacks: null
		});
	}
	function ho(e) {
		return {
			lane: e,
			tag: 0,
			payload: null,
			callback: null,
			next: null
		};
	}
	function go(e, t, n) {
		var r = e.updateQueue;
		if (r === null) return null;
		if (r = r.shared, K & 2) {
			var i = r.pending;
			return i === null ? t.next = t : (t.next = i.next, i.next = t), r.pending = t, t = Di(e), Ei(e, null, n), t;
		}
		return Ci(e, r, t, n), Di(e);
	}
	function _o(e, t, n) {
		if (t = t.updateQueue, t !== null && (t = t.shared, n & 4194048)) {
			var r = t.lanes;
			r &= e.pendingLanes, n |= r, t.lanes = n, wt(e, n);
		}
	}
	function vo(e, t) {
		var n = e.updateQueue, r = e.alternate;
		if (r !== null && (r = r.updateQueue, n === r)) {
			var i = null, a = null;
			if (n = n.firstBaseUpdate, n !== null) {
				do {
					var o = {
						lane: n.lane,
						tag: n.tag,
						payload: n.payload,
						callback: null,
						next: null
					};
					a === null ? i = a = o : a = a.next = o, n = n.next;
				} while (n !== null);
				a === null ? i = a = t : a = a.next = t;
			} else i = a = t;
			n = {
				baseState: r.baseState,
				firstBaseUpdate: i,
				lastBaseUpdate: a,
				shared: r.shared,
				callbacks: r.callbacks
			}, e.updateQueue = n;
		} else e = n.lastBaseUpdate, e === null ? n.firstBaseUpdate = t : e.next = t, n.lastBaseUpdate = t;
	}
	var yo = !1;
	function bo() {
		if (yo) {
			var e = Ra;
			if (e !== null) throw e;
		}
	}
	function xo(e, t, n, r) {
		yo = !1;
		var i = e.updateQueue;
		fo = !1;
		var a = i.firstBaseUpdate, o = i.lastBaseUpdate, s = i.shared.pending;
		if (s !== null) {
			i.shared.pending = null;
			var c = s, l = c.next;
			c.next = null, o === null ? a = l : o.next = l, o = c;
			var u = e.alternate;
			u !== null && (u = u.updateQueue, s = u.lastBaseUpdate, s !== o && (s === null ? u.firstBaseUpdate = l : s.next = l, u.lastBaseUpdate = c));
		}
		if (a !== null) {
			var d = i.baseState;
			o = 0, u = l = c = null, s = a;
			do {
				var f = s.lane & -536870913, p = f !== s.lane;
				if (p ? (Y & f) === f : (r & f) === f) {
					f !== 0 && f === La && (yo = !0), u !== null && (u = u.next = {
						lane: 0,
						tag: s.tag,
						payload: s.payload,
						callback: null,
						next: null
					});
					a: {
						var m = e, h = s;
						f = t;
						var g = n;
						switch (h.tag) {
							case 1:
								if (m = h.payload, typeof m == "function") {
									d = m.call(g, d, f);
									break a;
								}
								d = m;
								break a;
							case 3: m.flags = m.flags & -65537 | 128;
							case 0:
								if (m = h.payload, f = typeof m == "function" ? m.call(g, d, f) : m, f == null) break a;
								d = C({}, d, f);
								break a;
							case 2: fo = !0;
						}
					}
					f = s.callback, f !== null && (e.flags |= 64, p && (e.flags |= 8192), p = i.callbacks, p === null ? i.callbacks = [f] : p.push(f));
				} else p = {
					lane: f,
					tag: s.tag,
					payload: s.payload,
					callback: s.callback,
					next: null
				}, u === null ? (l = u = p, c = d) : u = u.next = p, o |= f;
				if (s = s.next, s === null) {
					if (s = i.shared.pending, s === null) break;
					p = s, s = p.next, p.next = null, i.lastBaseUpdate = p, i.shared.pending = null;
				}
			} while (1);
			u === null && (c = d), i.baseState = c, i.firstBaseUpdate = l, i.lastBaseUpdate = u, a === null && (i.shared.lanes = 0), od |= o, e.lanes = o, e.memoizedState = d;
		}
	}
	function So(e, t) {
		if (typeof e != "function") throw Error(i(191, e));
		e.call(t);
	}
	function Co(e, t) {
		var n = e.callbacks;
		if (n !== null) for (e.callbacks = null, e = 0; e < n.length; e++) So(n[e], t);
	}
	var wo = Oe(null), To = Oe(0);
	function Eo(e, t) {
		e = id, O(To, e), O(wo, t), id = e | t.baseLanes;
	}
	function Do() {
		O(To, id), O(wo, wo.current);
	}
	function Oo() {
		id = To.current, ke(wo), ke(To);
	}
	var ko = Oe(null), Ao = null;
	function jo(e) {
		var t = e.alternate;
		O(Io, Io.current & 1), O(ko, e), Ao === null && (t === null || wo.current !== null || t.memoizedState !== null) && (Ao = e);
	}
	function Mo(e) {
		O(Io, Io.current), O(ko, e), Ao === null && (Ao = e);
	}
	function No(e) {
		e.tag === 22 ? (O(Io, Io.current), O(ko, e), Ao === null && (Ao = e)) : Po();
	}
	function Po() {
		O(Io, Io.current), O(ko, ko.current);
	}
	function Fo(e) {
		ke(ko), Ao === e && (Ao = null), ke(Io);
	}
	var Io = Oe(0);
	function Lo(e, t) {
		O(ko, ko.current), O(Io, t);
	}
	function Ro(e) {
		ke(Io), ke(ko), Ao === e && (Ao = null);
	}
	function zo(e) {
		for (var t = e; t !== null;) {
			if (t.tag === 13) {
				var n = t.memoizedState;
				if (n !== null && (n = n.dehydrated, n === null || om(n) || sm(n))) return t;
			} else if (t.tag === 19 && t.memoizedProps.revealOrder !== "independent") {
				if (t.flags & 128) return t;
			} else if (t.child !== null) {
				t.child.return = t, t = t.child;
				continue;
			}
			if (t === e) break;
			for (; t.sibling === null;) {
				if (t.return === null || t.return === e) return null;
				t = t.return;
			}
			t.sibling.return = t.return, t = t.sibling;
		}
		return null;
	}
	var Bo = 0, U = null, W = null, Vo = null, Ho = !1, Uo = !1, Wo = !1, Go = 0, Ko = 0, qo = null, Jo = 0;
	function Yo() {
		throw Error(i(321));
	}
	function Xo(e, t) {
		if (t === null) return !1;
		for (var n = 0; n < t.length && n < e.length; n++) if (!zr(e[n], t[n])) return !1;
		return !0;
	}
	function Zo(e, t, n, r, i, a) {
		return Bo = a, U = t, t.memoizedState = null, t.updateQueue = null, t.lanes = 0, E.H = e === null || e.memoizedState === null ? mc : hc, Wo = !1, a = n(r, i), Wo = !1, Uo && (a = $o(t, n, r, i)), Qo(e), a;
	}
	function Qo(e) {
		E.H = pc;
		var t = W !== null && W.next !== null;
		if (Bo = 0, Vo = W = U = null, Ho = !1, Ko = 0, qo = null, t) throw Error(i(300));
		e === null || Mc || (e = e.dependencies, e !== null && xa(e) && (Mc = !0));
	}
	function $o(e, t, n, r) {
		U = e;
		var a = 0;
		do {
			if (Uo && (qo = null), Ko = 0, Uo = !1, 25 <= a) throw Error(i(301));
			if (a += 1, Vo = W = null, e.updateQueue != null) {
				var o = e.updateQueue;
				o.lastEffect = null, o.events = null, o.stores = null, o.memoCache != null && (o.memoCache.index = 0);
			}
			E.H = gc, o = t(n, r);
		} while (Uo);
		return o;
	}
	function es() {
		var e = E.H, t = e.useState()[0];
		return t = typeof t.then == "function" ? ss(t) : t, e = e.useState()[0], (W === null ? null : W.memoizedState) !== e && (U.flags |= 1024), t;
	}
	function ts() {
		var e = Go !== 0;
		return Go = 0, e;
	}
	function ns(e, t, n) {
		t.updateQueue = e.updateQueue, t.flags &= -2053, e.lanes &= ~n;
	}
	function rs(e) {
		if (Ho) {
			for (e = e.memoizedState; e !== null;) {
				var t = e.queue;
				t !== null && (t.pending = null), e = e.next;
			}
			Ho = !1;
		}
		Bo = 0, Vo = W = U = null, Uo = !1, Ko = Go = 0, qo = null;
	}
	function is() {
		var e = {
			memoizedState: null,
			baseState: null,
			baseQueue: null,
			queue: null,
			next: null
		};
		return Vo === null ? U.memoizedState = Vo = e : Vo = Vo.next = e, Vo;
	}
	function as() {
		if (W === null) {
			var e = U.alternate;
			e = e === null ? null : e.memoizedState;
		} else e = W.next;
		var t = Vo === null ? U.memoizedState : Vo.next;
		if (t !== null) Vo = t, W = e;
		else {
			if (e === null) throw U.alternate === null ? Error(i(467)) : Error(i(310));
			W = e, e = {
				memoizedState: W.memoizedState,
				baseState: W.baseState,
				baseQueue: W.baseQueue,
				queue: W.queue,
				next: null
			}, Vo === null ? U.memoizedState = Vo = e : Vo = Vo.next = e;
		}
		return Vo;
	}
	function os() {
		return {
			lastEffect: null,
			events: null,
			stores: null,
			memoCache: null
		};
	}
	function ss(e) {
		var t = Ko;
		return Ko += 1, qo === null && (qo = []), e = Qa(qo, e, t), t = U, (Vo === null ? t.memoizedState : Vo.next) === null && (t = t.alternate, E.H = t === null || t.memoizedState === null ? mc : hc), e;
	}
	function cs(e) {
		if (typeof e == "object" && e) {
			if (typeof e.then == "function") return ss(e);
			if (e.$$typeof === ye) return;
			if (e.$$typeof === ue) return Ca(e);
		}
		throw Error(i(438, String(e)));
	}
	function ls(e) {
		var t = null, n = U.updateQueue;
		if (n !== null && (t = n.memoCache), t == null) {
			var r = U.alternate;
			r !== null && (r = r.updateQueue, r !== null && (r = r.memoCache, r != null && (t = {
				data: r.data.map(function(e) {
					return e.slice();
				}),
				index: 0
			})));
		}
		if (t ??= {
			data: [],
			index: 0
		}, n === null && (n = os(), U.updateQueue = n), n.memoCache = t, n = t.data[t.index], n === void 0) for (n = t.data[t.index] = Array(e), r = 0; r < e; r++) n[r] = _e;
		return t.index++, n;
	}
	function us(e, t) {
		return typeof t == "function" ? t(e) : t;
	}
	function ds(e) {
		return fs(as(), W, e);
	}
	function fs(e, t, n) {
		var r = e.queue;
		if (r === null) throw Error(i(311));
		r.lastRenderedReducer = n;
		var a = e.baseQueue, o = r.pending;
		if (o !== null) {
			if (a !== null) {
				var s = a.next;
				a.next = o.next, o.next = s;
			}
			t.baseQueue = a = o, r.pending = null;
		}
		if (o = e.baseState, a === null) e.memoizedState = o;
		else {
			t = a.next;
			var c = s = null, l = null, u = t, d = !1;
			do {
				var f = u.lane & -536870913;
				if (f === u.lane ? (Bo & f) === f : (Y & f) === f) {
					var p = u.revertLane;
					if (p === 0) l !== null && (l = l.next = {
						lane: 0,
						revertLane: 0,
						gesture: null,
						action: u.action,
						hasEagerState: u.hasEagerState,
						eagerState: u.eagerState,
						next: null
					}), f === La && (d = !0);
					else if ((Bo & p) === p) {
						u = u.next, p === La && (d = !0);
						continue;
					} else f = {
						lane: 0,
						revertLane: u.revertLane,
						gesture: null,
						action: u.action,
						hasEagerState: u.hasEagerState,
						eagerState: u.eagerState,
						next: null
					}, l === null ? (c = l = f, s = o) : l = l.next = f, U.lanes |= p, od |= p;
					f = u.action, Wo && n(o, f), o = u.hasEagerState ? u.eagerState : n(o, f);
				} else p = {
					lane: f,
					revertLane: u.revertLane,
					gesture: u.gesture,
					action: u.action,
					hasEagerState: u.hasEagerState,
					eagerState: u.eagerState,
					next: null
				}, l === null ? (c = l = p, s = o) : l = l.next = p, U.lanes |= f, od |= f;
				u = u.next;
			} while (u !== null && u !== t);
			if (l === null ? s = o : l.next = c, !zr(o, e.memoizedState) && (Mc = !0, d && (n = Ra, n !== null))) throw n;
			e.memoizedState = o, e.baseState = s, e.baseQueue = l, r.lastRenderedState = o;
		}
		return a === null && (r.lanes = 0), [e.memoizedState, r.dispatch];
	}
	function ps(e) {
		var t = as(), n = t.queue;
		if (n === null) throw Error(i(311));
		n.lastRenderedReducer = e;
		var r = n.dispatch, a = n.pending, o = t.memoizedState;
		if (a !== null) {
			n.pending = null;
			var s = a = a.next;
			do
				o = e(o, s.action), s = s.next;
			while (s !== a);
			zr(o, t.memoizedState) || (Mc = !0), t.memoizedState = o, t.baseQueue === null && (t.baseState = o), n.lastRenderedState = o;
		}
		return [o, r];
	}
	function ms(e, t, n) {
		var r = U, a = as(), o = H;
		if (o) {
			if (n === void 0) throw Error(i(407));
			n = n();
		} else n = t();
		var s = !zr((W || a).memoizedState, n);
		if (s && (a.memoizedState = n, Mc = !0), a = a.queue, zs(_s.bind(null, r, a, e), [e]), e = a.getSnapshot !== t || s || Vo !== null && !!(Vo.memoizedState.tag & 1), Ps(e ? 9 : 8, { destroy: void 0 }, gs.bind(null, r, a, n, t), null), e) {
			if (r.flags |= 2048, q === null) throw Error(i(349));
			o || Bo & 127 || hs(r, t, n);
		}
		return n;
	}
	function hs(e, t, n) {
		e.flags |= 16384, e = {
			getSnapshot: t,
			value: n
		}, t = U.updateQueue, t === null ? (t = os(), U.updateQueue = t, t.stores = [e]) : (n = t.stores, n === null ? t.stores = [e] : n.push(e));
	}
	function gs(e, t, n, r) {
		t.value = n, t.getSnapshot = r, vs(t) && ys(e);
	}
	function _s(e, t, n) {
		return n(function() {
			vs(t) && ys(e);
		});
	}
	function vs(e) {
		var t = e.getSnapshot;
		e = e.value;
		try {
			var n = t();
			return !zr(e, n);
		} catch {
			return !0;
		}
	}
	function ys(e) {
		var t = Ti(e, 2);
		t !== null && Pd(t, e, 2);
	}
	function bs(e) {
		var t = is();
		if (typeof e == "function") {
			var n = e;
			if (e = n(), Wo) {
				st(!0);
				try {
					n();
				} finally {
					st(!1);
				}
			}
		}
		return t.memoizedState = t.baseState = e, t.queue = {
			pending: null,
			lanes: 0,
			dispatch: null,
			lastRenderedReducer: us,
			lastRenderedState: e
		}, t;
	}
	function xs(e, t, n, r) {
		return e.baseState = n, fs(e, W, typeof r == "function" ? r : us);
	}
	function Ss(e, t, n, r, a) {
		if (uc(e)) throw Error(i(485));
		if (e = t.action, e !== null) {
			var o = {
				payload: a,
				action: e,
				next: null,
				isTransition: !0,
				status: "pending",
				value: null,
				reason: null,
				listeners: [],
				then: function(e) {
					o.listeners.push(e);
				}
			};
			E.T === null ? o.isTransition = !1 : n(!0), r(o), n = t.pending, n === null ? (o.next = t.pending = o, Cs(t, o)) : (o.next = n.next, t.pending = n.next = o);
		}
	}
	function Cs(e, t) {
		var n = t.action, r = t.payload, i = e.state;
		if (t.isTransition) {
			var a = E.T, o = {};
			o.types = a === null ? null : a.types, E.T = o;
			try {
				var s = n(i, r), c = E.S;
				c !== null && c(o, s), ws(e, t, s);
			} catch (n) {
				Es(e, t, n);
			} finally {
				a !== null && o.types !== null && (a.types = o.types), E.T = a;
			}
		} else try {
			a = n(i, r), ws(e, t, a);
		} catch (n) {
			Es(e, t, n);
		}
	}
	function ws(e, t, n) {
		typeof n == "object" && n && typeof n.then == "function" ? n.then(function(n) {
			Ts(e, t, n);
		}, function(n) {
			return Es(e, t, n);
		}) : Ts(e, t, n);
	}
	function Ts(e, t, n) {
		t.status = "fulfilled", t.value = n, Ds(t), e.state = n, t = e.pending, t !== null && (n = t.next, n === t ? e.pending = null : (n = n.next, t.next = n, Cs(e, n)));
	}
	function Es(e, t, n) {
		var r = e.pending;
		if (e.pending = null, r !== null) {
			r = r.next;
			do
				t.status = "rejected", t.reason = n, Ds(t), t = t.next;
			while (t !== r);
		}
		e.action = null;
	}
	function Ds(e) {
		e = e.listeners;
		for (var t = 0; t < e.length; t++) (0, e[t])();
	}
	function Os(e, t) {
		return t;
	}
	function ks(e, t) {
		if (H) {
			var n = q.formState;
			if (n !== null) {
				a: {
					var r = U;
					if (H) {
						if (na) {
							b: {
								for (var i = na, a = ia; i.nodeType !== 8;) if (!a || (i = lm(i.nextSibling), i === null)) {
									i = null;
									break b;
								}
								a = i.data, i = a === "F!" || a === "F" ? i : null;
							}
							if (i) {
								na = lm(i.nextSibling), r = i.data === "F!";
								break a;
							}
						}
						oa(r);
					}
					r = !1;
				}
				r && (t = n[0]);
			}
		}
		return n = is(), n.memoizedState = n.baseState = t, r = {
			pending: null,
			lanes: 0,
			dispatch: null,
			lastRenderedReducer: Os,
			lastRenderedState: t
		}, n.queue = r, n = sc.bind(null, U, r), r.dispatch = n, r = bs(!1), a = lc.bind(null, U, !1, r.queue), r = is(), i = {
			state: t,
			dispatch: null,
			action: e,
			pending: null
		}, r.queue = i, n = Ss.bind(null, U, i, a, n), i.dispatch = n, r.memoizedState = e, [
			t,
			n,
			!1
		];
	}
	function As(e) {
		return js(as(), W, e);
	}
	function js(e, t, n) {
		if (t = fs(e, t, Os)[0], e = ds(us)[0], typeof t == "object" && t && typeof t.then == "function") try {
			var r = ss(t);
		} catch (e) {
			throw e === qa ? Ya : e;
		}
		else r = t;
		t = as();
		var i = t.queue, a = i.dispatch;
		return n !== t.memoizedState && (U.flags |= 2048, Ps(9, { destroy: void 0 }, Ms.bind(null, i, n), null)), [
			r,
			a,
			e
		];
	}
	function Ms(e, t) {
		e.action = t;
	}
	function Ns(e) {
		var t = as(), n = W;
		if (n !== null) return js(t, n, e);
		as(), t = t.memoizedState, n = as();
		var r = n.queue.dispatch;
		return n.memoizedState = e, [
			t,
			r,
			!1
		];
	}
	function Ps(e, t, n, r) {
		return e = {
			tag: e,
			create: n,
			deps: r,
			inst: t,
			next: null
		}, t = U.updateQueue, t === null && (t = os(), U.updateQueue = t), n = t.lastEffect, n === null ? t.lastEffect = e.next = e : (r = n.next, n.next = e, e.next = r, t.lastEffect = e), e;
	}
	function Fs() {
		return as().memoizedState;
	}
	function Is(e, t, n, r) {
		var i = is();
		U.flags |= e, i.memoizedState = Ps(1 | t, { destroy: void 0 }, n, r === void 0 ? null : r);
	}
	function Ls(e, t, n, r) {
		var i = as();
		r = r === void 0 ? null : r;
		var a = i.memoizedState.inst;
		W !== null && r !== null && Xo(r, W.memoizedState.deps) ? i.memoizedState = Ps(t, a, n, r) : (U.flags |= e, i.memoizedState = Ps(1 | t, a, n, r));
	}
	function Rs(e, t) {
		Is(8390656, 8, e, t);
	}
	function zs(e, t) {
		Ls(2048, 8, e, t);
	}
	function Bs(e) {
		U.flags |= 4;
		var t = U.updateQueue;
		if (t === null) t = os(), U.updateQueue = t, t.events = [e];
		else {
			var n = t.events;
			n === null ? t.events = [e] : n.push(e);
		}
	}
	function Vs(e) {
		var t = as().memoizedState;
		return Bs({
			ref: t,
			nextImpl: e
		}), function() {
			if (K & 2) throw Error(i(440));
			return t.impl.apply(void 0, arguments);
		};
	}
	function Hs(e, t) {
		return Ls(4, 2, e, t);
	}
	function Us(e, t) {
		return Ls(4, 4, e, t);
	}
	function Ws(e, t) {
		if (typeof t == "function") {
			e = e();
			var n = t(e);
			return function() {
				typeof n == "function" ? n() : t(null);
			};
		}
		if (t != null) return e = e(), t.current = e, function() {
			t.current = null;
		};
	}
	function Gs(e, t, n) {
		n = n == null ? null : n.concat([e]), Ls(4, 4, Ws.bind(null, t, e), n);
	}
	function Ks() {}
	function qs(e, t) {
		var n = as();
		t = t === void 0 ? null : t;
		var r = n.memoizedState;
		return t !== null && Xo(t, r[1]) ? r[0] : (n.memoizedState = [e, t], e);
	}
	function Js(e, t) {
		var n = as();
		t = t === void 0 ? null : t;
		var r = n.memoizedState;
		if (t !== null && Xo(t, r[1])) return r[0];
		if (r = e(), Wo) {
			st(!0);
			try {
				e();
			} finally {
				st(!1);
			}
		}
		return n.memoizedState = [r, t], r;
	}
	function Ys(e, t, n) {
		return n === void 0 || Bo & 1073741824 && !(Y & 261930) ? e.memoizedState = t : (e.memoizedState = n, e = Md(), U.lanes |= e, od |= e, n);
	}
	function Xs(e, t, n, r) {
		return zr(n, t) ? n : wo.current === null ? !(Bo & 106) || Bo & 1073741824 && !(Y & 261930) ? (Mc = !0, e.memoizedState = n) : (e = Md(), U.lanes |= e, od |= e, t) : (e = Ys(e, n, r), zr(e, t) || (Mc = !0), e);
	}
	function Zs(e, t, n, r, i) {
		var a = D.p;
		D.p = a !== 0 && 8 > a ? a : 8;
		var o = E.T, s = {};
		s.types = o === null ? null : o.types, E.T = s, lc(e, !1, t, n);
		try {
			var c = i(), l = E.S;
			l !== null && l(s, c), typeof c == "object" && c && typeof c.then == "function" ? cc(e, t, Va(c, r), jd(e)) : cc(e, t, r, jd(e));
		} catch (n) {
			cc(e, t, {
				then: function() {},
				status: "rejected",
				reason: n
			}, jd());
		} finally {
			D.p = a, o !== null && s.types !== null && (o.types = s.types), E.T = o;
		}
	}
	function Qs() {}
	function $s(e, t, n, r) {
		if (e.tag !== 5) throw Error(i(476));
		var a = ec(e).queue;
		Zs(e, a, t, Te, n === null ? Qs : function() {
			return tc(e), n(r);
		});
	}
	function ec(e) {
		var t = e.memoizedState;
		if (t !== null) return t;
		t = {
			memoizedState: Te,
			baseState: Te,
			baseQueue: null,
			queue: {
				pending: null,
				lanes: 0,
				dispatch: null,
				lastRenderedReducer: us,
				lastRenderedState: Te
			},
			next: null
		};
		var n = {};
		return t.next = {
			memoizedState: n,
			baseState: n,
			baseQueue: null,
			queue: {
				pending: null,
				lanes: 0,
				dispatch: null,
				lastRenderedReducer: us,
				lastRenderedState: n
			},
			next: null
		}, e.memoizedState = t, e = e.alternate, e !== null && (e.memoizedState = t), t;
	}
	function tc(e) {
		var t = ec(e);
		t.next === null && (t = e.alternate.memoizedState), cc(e, t.next.queue, {}, jd());
	}
	function nc() {
		return Ca(sh);
	}
	function rc() {
		return as().memoizedState;
	}
	function ic() {
		return as().memoizedState;
	}
	function ac(e) {
		for (var t = e.return; t !== null;) {
			switch (t.tag) {
				case 24:
				case 3:
					var n = jd();
					e = ho(n);
					var r = go(t, e, n);
					r !== null && (Pd(r, t, n), _o(r, t, n)), t = { cache: Aa() }, e.payload = t;
					return;
			}
			t = t.return;
		}
	}
	function oc(e, t, n) {
		var r = jd();
		n = {
			lane: r,
			revertLane: 0,
			gesture: null,
			action: n,
			hasEagerState: !1,
			eagerState: null,
			next: null
		}, uc(e) ? dc(t, n) : (n = wi(e, t, n, r), n !== null && (Pd(n, e, r), fc(n, t, r)));
	}
	function sc(e, t, n) {
		cc(e, t, n, jd());
	}
	function cc(e, t, n, r) {
		var i = {
			lane: r,
			revertLane: 0,
			gesture: null,
			action: n,
			hasEagerState: !1,
			eagerState: null,
			next: null
		};
		if (uc(e)) dc(t, i);
		else {
			var a = e.alternate;
			if (e.lanes === 0 && (a === null || a.lanes === 0) && (a = t.lastRenderedReducer, a !== null)) try {
				var o = t.lastRenderedState, s = a(o, n);
				if (i.hasEagerState = !0, i.eagerState = s, zr(s, o)) return Ci(e, t, i, 0), q === null && Si(), !1;
			} catch {}
			if (n = wi(e, t, i, r), n !== null) return Pd(n, e, r), fc(n, t, r), !0;
		}
		return !1;
	}
	function lc(e, t, n, r) {
		if (r = {
			lane: 2,
			revertLane: Pf(),
			gesture: null,
			action: r,
			hasEagerState: !1,
			eagerState: null,
			next: null
		}, uc(e)) {
			if (t) throw Error(i(479));
		} else t = wi(e, n, r, 2), t !== null && Pd(t, e, 2);
	}
	function uc(e) {
		var t = e.alternate;
		return e === U || t !== null && t === U;
	}
	function dc(e, t) {
		Uo = Ho = !0;
		var n = e.pending;
		n === null ? t.next = t : (t.next = n.next, n.next = t), e.pending = t;
	}
	function fc(e, t, n) {
		if (n & 4194048) {
			var r = t.lanes;
			r &= e.pendingLanes, n |= r, t.lanes = n, wt(e, n);
		}
	}
	var pc = {
		readContext: Ca,
		use: cs,
		useCallback: Yo,
		useContext: Yo,
		useEffect: Yo,
		useImperativeHandle: Yo,
		useLayoutEffect: Yo,
		useInsertionEffect: Yo,
		useMemo: Yo,
		useReducer: Yo,
		useRef: Yo,
		useState: Yo,
		useDebugValue: Yo,
		useDeferredValue: Yo,
		useTransition: Yo,
		useSyncExternalStore: Yo,
		useId: Yo,
		useHostTransitionStatus: Yo,
		useFormState: Yo,
		useActionState: Yo,
		useOptimistic: Yo,
		useMemoCache: Yo,
		useCacheRefresh: Yo,
		useEffectEvent: Yo
	}, mc = {
		readContext: Ca,
		use: cs,
		useCallback: function(e, t) {
			return is().memoizedState = [e, t === void 0 ? null : t], e;
		},
		useContext: Ca,
		useEffect: Rs,
		useImperativeHandle: function(e, t, n) {
			n = n == null ? null : n.concat([e]), Is(4194308, 4, Ws.bind(null, t, e), n);
		},
		useLayoutEffect: function(e, t) {
			return Is(4194308, 4, e, t);
		},
		useInsertionEffect: function(e, t) {
			Is(4, 2, e, t);
		},
		useMemo: function(e, t) {
			var n = is();
			t = t === void 0 ? null : t;
			var r = e();
			if (Wo) {
				st(!0);
				try {
					e();
				} finally {
					st(!1);
				}
			}
			return n.memoizedState = [r, t], r;
		},
		useReducer: function(e, t, n) {
			var r = is();
			if (n !== void 0) {
				var i = n(t);
				if (Wo) {
					st(!0);
					try {
						n(t);
					} finally {
						st(!1);
					}
				}
			} else i = t;
			return r.memoizedState = r.baseState = i, e = {
				pending: null,
				lanes: 0,
				dispatch: null,
				lastRenderedReducer: e,
				lastRenderedState: i
			}, r.queue = e, e = e.dispatch = oc.bind(null, U, e), [r.memoizedState, e];
		},
		useRef: function(e) {
			var t = is();
			return e = { current: e }, t.memoizedState = e;
		},
		useState: function(e) {
			e = bs(e);
			var t = e.queue, n = sc.bind(null, U, t);
			return t.dispatch = n, [e.memoizedState, n];
		},
		useDebugValue: Ks,
		useDeferredValue: function(e, t) {
			return Ys(is(), e, t);
		},
		useTransition: function() {
			var e = bs(!1);
			return e = Zs.bind(null, U, e.queue, !0, !1), is().memoizedState = e, [!1, e];
		},
		useSyncExternalStore: function(e, t, n) {
			var r = U, a = is();
			if (H) {
				if (n === void 0) throw Error(i(407));
				n = n();
			} else {
				if (n = t(), q === null) throw Error(i(349));
				Y & 127 || hs(r, t, n);
			}
			a.memoizedState = n;
			var o = {
				value: n,
				getSnapshot: t
			};
			return a.queue = o, Rs(_s.bind(null, r, o, e), [e]), r.flags |= 2048, Ps(9, { destroy: void 0 }, gs.bind(null, r, o, n, t), null), n;
		},
		useId: function() {
			var e = is(), t = q.identifierPrefix;
			if (H) {
				var n = Yi, r = Ji;
				n = (r & ~(1 << 32 - ct(r) - 1)).toString(32) + n, t = "_" + t + "R_" + n, n = Go++, 0 < n && (t += "H" + n.toString(32)), t += "_";
			} else n = Jo++, t = "_" + t + "r_" + n.toString(32) + "_";
			return e.memoizedState = t;
		},
		useHostTransitionStatus: nc,
		useFormState: ks,
		useActionState: ks,
		useOptimistic: function(e) {
			var t = is();
			t.memoizedState = t.baseState = e;
			var n = {
				pending: null,
				lanes: 0,
				dispatch: null,
				lastRenderedReducer: null,
				lastRenderedState: null
			};
			return t.queue = n, t = lc.bind(null, U, !0, n), n.dispatch = t, [e, t];
		},
		useMemoCache: ls,
		useCacheRefresh: function() {
			return is().memoizedState = ac.bind(null, U);
		},
		useEffectEvent: function(e) {
			var t = is(), n = { impl: e };
			return t.memoizedState = n, function() {
				if (K & 2) throw Error(i(440));
				return n.impl.apply(void 0, arguments);
			};
		}
	}, hc = {
		readContext: Ca,
		use: cs,
		useCallback: qs,
		useContext: Ca,
		useEffect: zs,
		useImperativeHandle: Gs,
		useInsertionEffect: Hs,
		useLayoutEffect: Us,
		useMemo: Js,
		useReducer: ds,
		useRef: Fs,
		useState: function() {
			return ds(us);
		},
		useDebugValue: Ks,
		useDeferredValue: function(e, t) {
			return Xs(as(), W.memoizedState, e, t);
		},
		useTransition: function() {
			var e = ds(us)[0], t = as().memoizedState;
			return [typeof e == "boolean" ? e : ss(e), t];
		},
		useSyncExternalStore: ms,
		useId: rc,
		useHostTransitionStatus: nc,
		useFormState: As,
		useActionState: As,
		useOptimistic: function(e, t) {
			return xs(as(), W, e, t);
		},
		useMemoCache: ls,
		useCacheRefresh: ic,
		useEffectEvent: Vs
	}, gc = {
		readContext: Ca,
		use: cs,
		useCallback: qs,
		useContext: Ca,
		useEffect: zs,
		useImperativeHandle: Gs,
		useInsertionEffect: Hs,
		useLayoutEffect: Us,
		useMemo: Js,
		useReducer: ps,
		useRef: Fs,
		useState: function() {
			return ps(us);
		},
		useDebugValue: Ks,
		useDeferredValue: function(e, t) {
			var n = as();
			return W === null ? Ys(n, e, t) : Xs(n, W.memoizedState, e, t);
		},
		useTransition: function() {
			var e = ps(us)[0], t = as().memoizedState;
			return [typeof e == "boolean" ? e : ss(e), t];
		},
		useSyncExternalStore: ms,
		useId: rc,
		useHostTransitionStatus: nc,
		useFormState: Ns,
		useActionState: Ns,
		useOptimistic: function(e, t) {
			var n = as();
			return W === null ? (n.baseState = e, [e, n.queue.dispatch]) : xs(n, W, e, t);
		},
		useMemoCache: ls,
		useCacheRefresh: ic,
		useEffectEvent: Vs
	};
	function _c(e, t, n, r) {
		t = e.memoizedState, n = n(r, t), n = n == null ? t : C({}, t, n), e.memoizedState = n, e.lanes === 0 && (e.updateQueue.baseState = n);
	}
	var vc = {
		enqueueSetState: function(e, t, n) {
			e = e._reactInternals;
			var r = jd(), i = ho(r);
			i.payload = t, n != null && (i.callback = n), t = go(e, i, r), t !== null && (Pd(t, e, r), _o(t, e, r));
		},
		enqueueReplaceState: function(e, t, n) {
			e = e._reactInternals;
			var r = jd(), i = ho(r);
			i.tag = 1, i.payload = t, n != null && (i.callback = n), t = go(e, i, r), t !== null && (Pd(t, e, r), _o(t, e, r));
		},
		enqueueForceUpdate: function(e, t) {
			e = e._reactInternals;
			var n = jd(), r = ho(n);
			r.tag = 2, t != null && (r.callback = t), t = go(e, r, n), t !== null && (Pd(t, e, n), _o(t, e, n));
		}
	};
	function yc(e, t, n, r, i, a, o) {
		return e = e.stateNode, typeof e.shouldComponentUpdate == "function" ? e.shouldComponentUpdate(r, a, o) : t.prototype && t.prototype.isPureReactComponent ? !Br(n, r) || !Br(i, a) : !0;
	}
	function bc(e, t, n, r) {
		e = t.state, typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps(n, r), typeof t.UNSAFE_componentWillReceiveProps == "function" && t.UNSAFE_componentWillReceiveProps(n, r), t.state !== e && vc.enqueueReplaceState(t, t.state, null);
	}
	function xc(e, t) {
		var n = t;
		if ("ref" in t) for (var r in n = {}, t) r !== "ref" && (n[r] = t[r]);
		if (e = e.defaultProps) for (var i in n === t && (n = C({}, n)), e) n[i] === void 0 && (n[i] = e[i]);
		return n;
	}
	function Sc(e) {
		vi(e);
	}
	function Cc(e) {
		console.error(e);
	}
	function wc(e) {
		vi(e);
	}
	function Tc(e, t) {
		try {
			var n = e.onUncaughtError;
			n(t.value, { componentStack: t.stack });
		} catch (e) {
			setTimeout(function() {
				throw e;
			});
		}
	}
	function Ec(e, t, n) {
		try {
			var r = e.onCaughtError;
			r(n.value, {
				componentStack: n.stack,
				errorBoundary: t.tag === 1 ? t.stateNode : null
			});
		} catch (e) {
			setTimeout(function() {
				throw e;
			});
		}
	}
	function Dc(e, t, n) {
		return n = ho(n), n.tag = 3, n.payload = { element: null }, n.callback = function() {
			Tc(e, t);
		}, n;
	}
	function Oc(e) {
		return e = ho(e), e.tag = 3, e;
	}
	function kc(e, t, n, r) {
		var i = n.type.getDerivedStateFromError;
		if (typeof i == "function") {
			var a = r.value;
			e.payload = function() {
				return i(a);
			}, e.callback = function() {
				Ec(t, n, r);
			};
		}
		var o = n.stateNode;
		o !== null && typeof o.componentDidCatch == "function" && (e.callback = function() {
			Ec(t, n, r), typeof i != "function" && (vd === null ? vd = /* @__PURE__ */ new Set([this]) : vd.add(this));
			var e = r.stack;
			this.componentDidCatch(r.value, { componentStack: e === null ? "" : e });
		});
	}
	function Ac(e, t, n, r, a) {
		if (n.flags |= 32768, typeof r == "object" && r && typeof r.then == "function") {
			if (t = n.alternate, t !== null && ba(t, n, a, !0), n = ko.current, n !== null) {
				switch (n.tag) {
					case 31:
					case 13:
					case 19: return Ao === null ? Kd() : n.alternate === null && ad === 0 && (ad = 3), n.flags &= -257, n.flags |= 65536, n.lanes = a, r === Xa ? n.flags |= 16384 : (t = n.updateQueue, t === null ? n.updateQueue = /* @__PURE__ */ new Set([r]) : t.add(r), mf(e, r, a)), !1;
					case 22: return n.flags |= 65536, r === Xa ? n.flags |= 16384 : (t = n.updateQueue, t === null ? (t = {
						transitions: null,
						markerInstances: null,
						retryQueue: /* @__PURE__ */ new Set([r])
					}, n.updateQueue = t) : (n = t.retryQueue, n === null ? t.retryQueue = /* @__PURE__ */ new Set([r]) : n.add(r)), mf(e, r, a)), !1;
				}
				throw Error(i(435, n.tag));
			}
			return mf(e, r, a), Kd(), !1;
		}
		if (H) return t = ko.current, t === null ? (r !== aa && (t = Error(i(423), { cause: r }), fa(Bi(t, n))), e = e.current.alternate, e.flags |= 65536, a &= -a, e.lanes |= a, r = Bi(r, n), a = Dc(e.stateNode, r, a), vo(e, a), ad !== 4 && (ad = 2)) : (!(t.flags & 65536) && (t.flags |= 256), t.flags |= 65536, t.lanes = a, r !== aa && (e = Error(i(422), { cause: r }), fa(Bi(e, n)))), !1;
		var o = Error(i(520), { cause: r });
		if (o = Bi(o, n), dd === null ? dd = [o] : dd.push(o), ad !== 4 && (ad = 2), t === null) return !0;
		r = Bi(r, n), n = t;
		do {
			switch (n.tag) {
				case 3: return n.flags |= 65536, e = a & -a, n.lanes |= e, e = Dc(n.stateNode, r, e), vo(n, e), !1;
				case 1:
					if (t = n.type, o = n.stateNode, !(n.flags & 128) && (typeof t.getDerivedStateFromError == "function" || o !== null && typeof o.componentDidCatch == "function" && (vd === null || !vd.has(o)))) return n.flags |= 65536, a &= -a, n.lanes |= a, a = Oc(a), kc(a, e, n, r), vo(n, a), !1;
					break;
				case 22: if (n.memoizedState !== null) return n.flags |= 65536, !1;
			}
			n = n.return;
		} while (n !== null);
		return !1;
	}
	var jc = Error(i(461)), Mc = !1;
	function Nc(e, t, n, r) {
		t.child = e === null ? uo(t, null, n, r) : lo(t, e.child, n, r);
	}
	function Pc(e, t, n, r, i) {
		n = n.render;
		var a = t.ref;
		if ("ref" in r) {
			var o = {};
			for (var s in r) s !== "ref" && (o[s] = r[s]);
		} else o = r;
		return Sa(t), r = Zo(e, t, n, o, a, i), s = ts(), e !== null && !Mc ? (ns(e, t, i), cl(e, t, i)) : (H && s && Qi(t), t.flags |= 1, Nc(e, t, r, i), t.child);
	}
	function Fc(e, t, n, r, i) {
		if (e === null) {
			var a = n.type;
			return typeof a == "function" && !ji(a) && a.defaultProps === void 0 && n.compare === null ? (t.tag = 15, t.type = a, Ic(e, t, a, r, i)) : (e = Pi(n.type, null, r, t, t.mode, i), e.ref = t.ref, e.return = t, t.child = e);
		}
		if (a = e.child, !ll(e, i)) {
			var o = a.memoizedProps;
			if (n = n.compare, n = n === null ? Br : n, n(o, r) && e.ref === t.ref) return cl(e, t, i);
		}
		return t.flags |= 1, e = Mi(a, r), e.ref = t.ref, e.return = t, t.child = e;
	}
	function Ic(e, t, n, r, i) {
		if (e !== null) {
			var a = e.memoizedProps;
			if (Br(a, r) && e.ref === t.ref) {
				if (Mc = !1, t.pendingProps = r = a, ll(e, i)) e.flags & 131072 && (Mc = !0);
				else return t.lanes = e.lanes, cl(e, t, i);
			}
		}
		return Wc(e, t, n, r, i);
	}
	function Lc(e, t, n, r) {
		var i = r.children, a = e === null ? null : e.memoizedState;
		if (e === null && t.stateNode === null && (t.stateNode = {
			_visibility: 1,
			_pendingMarkers: null,
			_retryCache: null,
			_transitions: null
		}), r.mode === "hidden") {
			if (t.flags & 128) {
				if (a = a === null ? n : a.baseLanes | n, e !== null) {
					for (r = t.child = e.child, i = 0; r !== null;) i = i | r.lanes | r.childLanes, r = r.sibling;
					r = i & ~a;
				} else r = 0, t.child = null;
				return zc(e, t, a, n, r);
			}
			if (n & 536870912) t.memoizedState = {
				baseLanes: 0,
				cachePool: null
			}, e !== null && Ga(t, a === null ? null : a.cachePool), a === null ? Do() : Eo(t, a), No(t);
			else return r = t.lanes = 536870912, zc(e, t, a === null ? n : a.baseLanes | n, n, r);
		} else a === null ? (e !== null && Ga(t, null), Do(), Po()) : (Ga(t, a.cachePool), Eo(t, a), Po(), t.memoizedState = null);
		return Nc(e, t, i, n), t.child;
	}
	function Rc(e, t) {
		return e !== null && e.tag === 22 || t.stateNode !== null || (t.stateNode = {
			_visibility: 1,
			_pendingMarkers: null,
			_retryCache: null,
			_transitions: null
		}), t.sibling;
	}
	function zc(e, t, n, r, i) {
		var a = Wa();
		return a = a === null ? null : {
			parent: ka._currentValue,
			pool: a
		}, t.memoizedState = {
			baseLanes: n,
			cachePool: a
		}, e !== null && Ga(t, null), Do(), No(t), e !== null && ba(e, t, r, !0), t.childLanes = i, null;
	}
	function Bc(e, t) {
		return t = $c({
			mode: t.mode,
			children: t.children
		}, e.mode), t.ref = e.ref, e.child = t, t.return = e, t;
	}
	function Vc(e, t, n) {
		return lo(t, e.child, null, n), e = Bc(t, t.pendingProps), e.flags |= 2, Fo(t), t.memoizedState = null, e;
	}
	function Hc(e, t, n) {
		var r = t.pendingProps, a = !!(t.flags & 128);
		if (t.flags &= -129, e === null) {
			if (H) {
				if (r.mode === "hidden") return e = Bc(t, r), t.lanes = 536870912, e.memoizedState = {
					baseLanes: 0,
					cachePool: null
				}, Rc(null, e);
				if (Mo(t), (e = na) ? (e = am(e, ia), e = e !== null && e.data === "&" ? e : null, e !== null && (t.memoizedState = {
					dehydrated: e,
					treeContext: qi === null ? null : {
						id: Ji,
						overflow: Yi
					},
					retryLane: 536870912,
					hydrationErrors: null
				}, n = Li(e), n.return = t, t.child = n, ta = t, na = null)) : e = null, e === null) throw oa(t);
				return t.lanes = 536870912, null;
			}
			return Bc(t, r);
		}
		var o = e.memoizedState;
		if (o !== null) {
			var s = o.dehydrated;
			if (Mo(t), a) {
				if (t.flags & 256) t.flags &= -257, t = Vc(e, t, n);
				else if (t.memoizedState !== null) t.child = e.child, t.flags |= 128, t = null;
				else throw Error(i(558));
			} else if (Mc || ba(e, t, n, !1), a = (n & e.childLanes) !== 0, Mc || a) {
				if (wo.current === null) {
					if (r = q, r !== null && (s = Tt(r, n), s !== 0 && s !== o.retryLane)) throw o.retryLane = s, Ti(e, s), Pd(r, e, s), jc;
					Kd();
				}
				t = Vc(e, t, n);
			} else e = o.treeContext, na = lm(s.nextSibling), ta = t, H = !0, ra = null, ia = !1, e !== null && ea(t, e), t = Bc(t, r), t.flags |= 134221824;
			return t;
		}
		return e = Mi(e.child, {
			mode: r.mode,
			children: r.children
		}), e.ref = t.ref, t.child = e, e.return = t, e;
	}
	function Uc(e, t) {
		var n = t.ref;
		if (n === null) e !== null && e.ref !== null && (t.flags |= 4194816);
		else {
			if (typeof n != "function" && typeof n != "object") throw Error(i(284));
			(e === null || e.ref !== n) && (t.flags |= 4194816);
		}
	}
	function Wc(e, t, n, r, i) {
		return Sa(t), n = Zo(e, t, n, r, void 0, i), r = ts(), e !== null && !Mc ? (ns(e, t, i), cl(e, t, i)) : (H && r && Qi(t), t.flags |= 1, Nc(e, t, n, i), t.child);
	}
	function Gc(e, t, n, r, i, a) {
		return Sa(t), t.updateQueue = null, n = $o(t, r, n, i), Qo(e), r = ts(), e !== null && !Mc ? (ns(e, t, a), cl(e, t, a)) : (H && r && Qi(t), t.flags |= 1, Nc(e, t, n, a), t.child);
	}
	function Kc(e, t, n, r, i) {
		if (Sa(t), t.stateNode === null) {
			var a = Oi, o = n.contextType;
			typeof o == "object" && o && (a = Ca(o)), a = new n(r, a), t.memoizedState = a.state !== null && a.state !== void 0 ? a.state : null, a.updater = vc, t.stateNode = a, a._reactInternals = t, a = t.stateNode, a.props = r, a.state = t.memoizedState, a.refs = {}, po(t), o = n.contextType, a.context = typeof o == "object" && o ? Ca(o) : Oi, a.state = t.memoizedState, o = n.getDerivedStateFromProps, typeof o == "function" && (_c(t, n, o, r), a.state = t.memoizedState), typeof n.getDerivedStateFromProps == "function" || typeof a.getSnapshotBeforeUpdate == "function" || typeof a.UNSAFE_componentWillMount != "function" && typeof a.componentWillMount != "function" || (o = a.state, typeof a.componentWillMount == "function" && a.componentWillMount(), typeof a.UNSAFE_componentWillMount == "function" && a.UNSAFE_componentWillMount(), o !== a.state && vc.enqueueReplaceState(a, a.state, null), xo(t, r, a, i), bo(), a.state = t.memoizedState), typeof a.componentDidMount == "function" && (t.flags |= 4194308), r = !0;
		} else if (e === null) {
			a = t.stateNode;
			var s = t.memoizedProps, c = xc(n, s);
			a.props = c;
			var l = a.context, u = n.contextType;
			o = Oi, typeof u == "object" && u && (o = Ca(u));
			var d = n.getDerivedStateFromProps;
			u = typeof d == "function" || typeof a.getSnapshotBeforeUpdate == "function", s = t.pendingProps !== s, u || typeof a.UNSAFE_componentWillReceiveProps != "function" && typeof a.componentWillReceiveProps != "function" || (s || l !== o) && bc(t, a, r, o), fo = !1;
			var f = t.memoizedState;
			a.state = f, xo(t, r, a, i), bo(), l = t.memoizedState, s || f !== l || fo ? (typeof d == "function" && (_c(t, n, d, r), l = t.memoizedState), (c = fo || yc(t, n, c, r, f, l, o)) ? (u || typeof a.UNSAFE_componentWillMount != "function" && typeof a.componentWillMount != "function" || (typeof a.componentWillMount == "function" && a.componentWillMount(), typeof a.UNSAFE_componentWillMount == "function" && a.UNSAFE_componentWillMount()), typeof a.componentDidMount == "function" && (t.flags |= 4194308)) : (typeof a.componentDidMount == "function" && (t.flags |= 4194308), t.memoizedProps = r, t.memoizedState = l), a.props = r, a.state = l, a.context = o, r = c) : (typeof a.componentDidMount == "function" && (t.flags |= 4194308), r = !1);
		} else {
			a = t.stateNode, mo(e, t), o = t.memoizedProps, u = xc(n, o), a.props = u, d = t.pendingProps, f = a.context, l = n.contextType, c = Oi, typeof l == "object" && l && (c = Ca(l)), s = n.getDerivedStateFromProps, (l = typeof s == "function" || typeof a.getSnapshotBeforeUpdate == "function") || typeof a.UNSAFE_componentWillReceiveProps != "function" && typeof a.componentWillReceiveProps != "function" || (o !== d || f !== c) && bc(t, a, r, c), fo = !1, f = t.memoizedState, a.state = f, xo(t, r, a, i), bo();
			var p = t.memoizedState;
			o !== d || f !== p || fo || e !== null && e.dependencies !== null && xa(e.dependencies) ? (typeof s == "function" && (_c(t, n, s, r), p = t.memoizedState), (u = fo || yc(t, n, u, r, f, p, c) || e !== null && e.dependencies !== null && xa(e.dependencies)) ? (l || typeof a.UNSAFE_componentWillUpdate != "function" && typeof a.componentWillUpdate != "function" || (typeof a.componentWillUpdate == "function" && a.componentWillUpdate(r, p, c), typeof a.UNSAFE_componentWillUpdate == "function" && a.UNSAFE_componentWillUpdate(r, p, c)), typeof a.componentDidUpdate == "function" && (t.flags |= 4), typeof a.getSnapshotBeforeUpdate == "function" && (t.flags |= 1024)) : (typeof a.componentDidUpdate != "function" || o === e.memoizedProps && f === e.memoizedState || (t.flags |= 4), typeof a.getSnapshotBeforeUpdate != "function" || o === e.memoizedProps && f === e.memoizedState || (t.flags |= 1024), t.memoizedProps = r, t.memoizedState = p), a.props = r, a.state = p, a.context = c, r = u) : (typeof a.componentDidUpdate != "function" || o === e.memoizedProps && f === e.memoizedState || (t.flags |= 4), typeof a.getSnapshotBeforeUpdate != "function" || o === e.memoizedProps && f === e.memoizedState || (t.flags |= 1024), r = !1);
		}
		return a = r, Uc(e, t), r = !!(t.flags & 128), a || r ? (a = t.stateNode, n = r && typeof n.getDerivedStateFromError != "function" ? null : a.render(), t.flags |= 1, e !== null && r ? (t.child = lo(t, e.child, null, i), t.child = lo(t, null, n, i)) : Nc(e, t, n, i), t.memoizedState = a.state, e = t.child) : e = cl(e, t, i), e;
	}
	function qc(e, t, n, r) {
		return ua(), t.flags |= 256, Nc(e, t, n, r), t.child;
	}
	var Jc = {
		dehydrated: null,
		treeContext: null,
		retryLane: 0,
		hydrationErrors: null
	};
	function Yc(e) {
		return {
			baseLanes: e,
			cachePool: Ka()
		};
	}
	function Xc(e, t, n) {
		return e = e === null ? 0 : e.childLanes & ~n, t && (e |= ld), e;
	}
	function Zc(e, t, n) {
		var r = t.pendingProps, i = !1, a = !!(t.flags & 128), o;
		if ((o = a) || (o = e !== null && e.memoizedState === null ? !1 : !!(Io.current & 2)), o && (i = !0, t.flags &= -129), o = !!(t.flags & 32), t.flags &= -33, e === null) {
			if (H) {
				if (i ? jo(t) : Po(), (e = na) ? (e = am(e, ia), e = e !== null && e.data !== "&" ? e : null, e !== null && (t.memoizedState = {
					dehydrated: e,
					treeContext: qi === null ? null : {
						id: Ji,
						overflow: Yi
					},
					retryLane: 536870912,
					hydrationErrors: null
				}, n = Li(e), n.return = t, t.child = n, ta = t, na = null)) : e = null, e === null) throw oa(t);
				return t.lanes = sm(e) ? 32 : 536870912, null;
			}
			return a = r.children, r = r.fallback, i ? (Po(), i = t.mode, a = $c({
				mode: "hidden",
				children: a
			}, i), r = Fi(r, i, n, null), a.return = t, r.return = t, a.sibling = r, t.child = a, r = t.child, r.memoizedState = Yc(n), r.childLanes = Xc(e, o, n), t.memoizedState = Jc, Rc(null, r)) : (jo(t), Qc(t, a));
		}
		var s = e.memoizedState;
		if (s !== null) {
			var c = s.dehydrated;
			if (c !== null) return tl(e, t, a, o, r, c, s, n);
		}
		return i ? (Po(), i = r.fallback, a = t.mode, s = e.child, c = s.sibling, r = Mi(s, {
			mode: "hidden",
			children: r.children
		}), r.subtreeFlags = s.subtreeFlags & 1206910976, c === null ? (i = Fi(i, a, n, null), i.flags |= 2) : i = Mi(c, i), i.return = t, r.return = t, r.sibling = i, t.child = r, Rc(null, r), r = t.child, i = e.child.memoizedState, i === null ? i = Yc(n) : (a = i.cachePool, a === null ? a = Ka() : (s = ka._currentValue, a = a.parent === s ? a : {
			parent: s,
			pool: s
		}), i = {
			baseLanes: i.baseLanes | n,
			cachePool: a
		}), r.memoizedState = i, r.childLanes = Xc(e, o, n), t.memoizedState = Jc, Rc(e.child, r)) : (jo(t), n = e.child, e = n.sibling, n = Mi(n, {
			mode: "visible",
			children: r.children
		}), n.return = t, n.sibling = null, e !== null && (o = t.deletions, o === null ? (t.deletions = [e], t.flags |= 16) : o.push(e)), t.child = n, t.memoizedState = null, n);
	}
	function Qc(e, t) {
		return t = $c({
			mode: "visible",
			children: t
		}, e.mode), t.return = e, e.child = t;
	}
	function $c(e, t) {
		return e = Ai(22, e, null, t), e.lanes = 0, e;
	}
	function el(e, t, n) {
		return lo(t, e.child, null, n), e = Qc(t, t.pendingProps.children), e.flags |= 2, t.memoizedState = null, e;
	}
	function tl(e, t, n, r, a, o, s, c) {
		if (n) return t.flags & 256 ? (jo(t), t.flags &= -257, el(e, t, c)) : t.memoizedState === null ? (Po(), o = a.fallback, s = t.mode, a = $c({
			mode: "visible",
			children: a.children
		}, s), o = Fi(o, s, c, null), o.flags |= 2, a.return = t, o.return = t, a.sibling = o, t.child = a, lo(t, e.child, null, c), a = t.child, a.memoizedState = Yc(c), a.childLanes = Xc(e, r, c), t.memoizedState = Jc, Rc(null, a)) : (Po(), t.child = e.child, t.flags |= 128, null);
		if (jo(t), sm(o)) {
			if (r = o.nextSibling && o.nextSibling.dataset, r) var l = r.dgst;
			return r = l, r !== "" && (a = Error(i(419)), a.stack = "", a.digest = r, fa({
				value: a,
				source: null,
				stack: null
			})), el(e, t, c);
		}
		if (Mc || ba(e, t, c, !1), r = (c & e.childLanes) !== 0, Mc || r) {
			if (wo.current !== null) return el(e, t, c);
			if (r = q, r !== null && (a = Tt(r, c), a !== 0 && a !== s.retryLane)) throw s.retryLane = a, Ti(e, a), Pd(r, e, a), jc;
			return om(o) || Kd(), el(e, t, c);
		}
		return om(o) ? (t.flags |= 192, t.child = e.child, null) : (e = s.treeContext, na = lm(o.nextSibling), ta = t, H = !0, ra = null, ia = !1, e !== null && ea(t, e), t = Qc(t, a.children), t.flags |= 134221824, t);
	}
	function nl(e, t, n) {
		e.lanes |= t;
		var r = e.alternate;
		r !== null && (r.lanes |= t), va(e.return, t, n);
	}
	function rl(e) {
		for (var t = null; e !== null;) {
			var n = e.alternate;
			n !== null && zo(n) === null && (t = e), e = e.sibling;
		}
		return t;
	}
	function il(e, t, n, r, i, a) {
		var o = e.memoizedState;
		o === null ? e.memoizedState = {
			isBackwards: t,
			rendering: null,
			renderingStartTime: 0,
			last: r,
			tail: n,
			tailMode: i,
			treeForkCount: a
		} : (o.isBackwards = t, o.rendering = null, o.renderingStartTime = 0, o.last = r, o.tail = n, o.tailMode = i, o.treeForkCount = a);
	}
	function al(e) {
		var t = e.child;
		for (e.child = null; t !== null;) {
			var n = t.sibling;
			t.sibling = e.child, e.child = t, t = n;
		}
	}
	function ol(e, t, n) {
		var r = t.pendingProps, i = r.revealOrder, a = r.tail;
		r = r.children;
		var o = Io.current;
		if (t.flags & 128) return Lo(t, o), null;
		var s = !!(o & 2);
		if (s ? (o = o & 1 | 2, t.flags |= 128) : o &= 1, Lo(t, o), i === "backwards" && e !== null ? (al(e), Nc(e, t, r, n), al(e)) : Nc(e, t, r, n), r = H ? Wi : 0, !s && e !== null && e.flags & 128) a: for (e = t.child; e !== null;) {
			if (e.tag === 13) e.memoizedState !== null && nl(e, n, t);
			else if (e.tag === 19) nl(e, n, t);
			else if (e.child !== null) {
				e.child.return = e, e = e.child;
				continue;
			}
			if (e === t) break a;
			for (; e.sibling === null;) {
				if (e.return === null || e.return === t) break a;
				e = e.return;
			}
			e.sibling.return = e.return, e = e.sibling;
		}
		switch (i) {
			case "backwards":
				n = rl(t.child), n === null ? (i = t.child, t.child = null) : (i = n.sibling, n.sibling = null, al(t)), il(t, !0, i, null, a, r);
				break;
			case "unstable_legacy-backwards":
				for (n = null, i = t.child, t.child = null; i !== null;) {
					if (e = i.alternate, e !== null && zo(e) === null) {
						t.child = i;
						break;
					}
					e = i.sibling, i.sibling = n, n = i, i = e;
				}
				il(t, !0, n, null, a, r);
				break;
			case "together":
				il(t, !1, null, null, void 0, r);
				break;
			case "independent":
				t.memoizedState = null;
				break;
			default: n = rl(t.child), n === null ? (i = t.child, t.child = null) : (i = n.sibling, n.sibling = null), il(t, !1, i, n, a, r);
		}
		return t.child;
	}
	function sl(e, t, n) {
		var r = t.pendingProps;
		return ga(t, t.type, r.value), Nc(e, t, r.children, n), t.child;
	}
	function cl(e, t, n) {
		if (e !== null && (t.dependencies = e.dependencies), od |= t.lanes, (n & t.childLanes) === 0) {
			if (e !== null) {
				if (ba(e, t, n, !1), (n & t.childLanes) === 0) return null;
			} else return null;
		}
		if (e !== null && t.child !== e.child) throw Error(i(153));
		if (t.child !== null) {
			for (e = t.child, n = Mi(e, e.pendingProps), t.child = n, n.return = t; e.sibling !== null;) e = e.sibling, n = n.sibling = Mi(e, e.pendingProps), n.return = t;
			n.sibling = null;
		}
		return t.child;
	}
	function ll(e, t) {
		return (e.lanes & t) !== 0 || (e = e.dependencies, !!(e !== null && xa(e)));
	}
	function ul(e, t, n) {
		switch (t.tag) {
			case 3:
				Pe(t, t.stateNode.containerInfo), ga(t, ka, e.memoizedState.cache), ua();
				break;
			case 27:
			case 5:
				Ie(t);
				break;
			case 4:
				Pe(t, t.stateNode.containerInfo);
				break;
			case 10:
				ga(t, t.type, t.memoizedProps.value);
				break;
			case 31:
				if (t.memoizedState !== null) return t.flags |= 128, Mo(t), null;
				break;
			case 13:
				var r = t.memoizedState;
				if (r !== null) {
					if (r.dehydrated !== null) return jo(t), t.flags |= 128, null;
					r = ba(e, t, n, !1);
					var i = t.child.childLanes;
					return r || (n & i) !== 0 ? Zc(e, t, n) : (jo(t), e = cl(e, t, n), e === null ? null : e.sibling);
				}
				jo(t);
				break;
			case 19:
				if (t.flags & 128) return ol(e, t, n);
				if (i = !!(e.flags & 128), r = (n & t.childLanes) !== 0, r ||= (ba(e, t, n, !1), (n & t.childLanes) !== 0), i) {
					if (r) return ol(e, t, n);
					t.flags |= 128;
				}
				if (i = t.memoizedState, i !== null && (i.rendering = null, i.tail = null, i.lastEffect = null), Lo(t, Io.current), r) break;
				return null;
			case 22: return t.lanes = 0, Lc(e, t, n, t.pendingProps);
			case 24: ga(t, ka, e.memoizedState.cache);
		}
		return cl(e, t, n);
	}
	function dl(e, t, n) {
		if (e !== null) {
			if (e.memoizedProps !== t.pendingProps) Mc = !0;
			else {
				if (!ll(e, n) && !(t.flags & 128)) return Mc = !1, ul(e, t, n);
				Mc = !!(e.flags & 131072);
			}
		} else Mc = !1, H && t.flags & 1048576 && Zi(t, Wi, t.index);
		switch (t.lanes = 0, t.tag) {
			case 16:
				a: {
					var r = t.pendingProps;
					if (e = $a(t.elementType), t.type = e, typeof e == "function") ji(e) ? (r = xc(e, r), t.tag = 1, t = Kc(null, t, e, r, n)) : (t.tag = 0, t = Wc(null, t, e, r, n));
					else {
						if (e != null) {
							var a = e.$$typeof;
							if (a === T) {
								t.tag = 11, t = Pc(null, t, e, r, n);
								break a;
							}
							if (a === pe) {
								t.tag = 14, t = Fc(null, t, e, r, n);
								break a;
							}
							if (a === ue) {
								t.tag = 10, t.type = e, t = sl(null, t, n);
								break a;
							}
						}
						throw t = Ce(e) || e, Error(i(306, t, ""));
					}
				}
				return t;
			case 0: return Wc(e, t, t.type, t.pendingProps, n);
			case 1: return r = t.type, a = xc(r, t.pendingProps), Kc(e, t, r, a, n);
			case 3:
				a: {
					if (Pe(t, t.stateNode.containerInfo), e === null) throw Error(i(387));
					r = t.pendingProps;
					var o = t.memoizedState;
					a = o.element, mo(e, t), xo(t, r, null, n);
					var s = t.memoizedState;
					if (r = s.cache, ga(t, ka, r), r !== o.cache && ya(t, [ka], n, !0), bo(), r = s.element, o.isDehydrated) {
						if (o = {
							element: r,
							isDehydrated: !1,
							cache: s.cache
						}, t.updateQueue.baseState = o, t.memoizedState = o, t.flags & 256) {
							t = qc(e, t, r, n);
							break a;
						}
						if (r !== a) {
							a = Bi(Error(i(424)), t), fa(a), t = qc(e, t, r, n);
							break a;
						}
						switch (e = t.stateNode.containerInfo, e.nodeType) {
							case 9:
								e = e.body;
								break;
							default: e = e.nodeName === "HTML" ? e.ownerDocument.body : e;
						}
						for (na = lm(e.firstChild), ta = t, H = !0, ra = null, ia = !0, n = uo(t, null, r, n), t.child = n; n;) n.flags = n.flags & -3 | 134221824, n = n.sibling;
					} else {
						if (ua(), r === a) {
							t = cl(e, t, n);
							break a;
						}
						Nc(e, t, r, n);
					}
					t = t.child;
				}
				return t;
			case 26: return Uc(e, t), e === null ? (n = Nm(t.type, null, t.pendingProps, null)) ? t.memoizedState = n : H || (t.stateNode = fp(t.type, t.pendingProps, Me.current, t)) : t.memoizedState = Nm(t.type, e.memoizedProps, t.pendingProps, e.memoizedState), null;
			case 27: return Ie(t), e === null && H && (r = t.stateNode = hm(t.type, t.pendingProps, Me.current), ta = t, ia = !0, a = na, Sp(t.type) ? (um = a, na = lm(r.firstChild)) : na = a), Nc(e, t, t.pendingProps.children, n), Uc(e, t), e === null && (t.flags |= 4194304), t.child;
			case 5: return e === null && H && ((a = r = na) && (r = rm(r, t.type, t.pendingProps, ia), r === null ? a = !1 : (t.stateNode = r, ta = t, na = lm(r.firstChild), ia = !1, a = !0)), a || oa(t)), Ie(t), a = t.type, o = t.pendingProps, s = e === null ? null : e.memoizedProps, r = o.children, pp(a, o) ? r = null : s !== null && pp(a, s) && (t.flags |= 32), t.memoizedState !== null && (a = Zo(e, t, es, null, null, n), sh._currentValue = a), Uc(e, t), Nc(e, t, r, n), t.child;
			case 6: return e === null && H && ((e = n = na) && (n = im(n, t.pendingProps, ia), n === null ? e = !1 : (t.stateNode = n, ta = t, na = null, e = !0)), e || oa(t)), null;
			case 13: return Zc(e, t, n);
			case 4: return Pe(t, t.stateNode.containerInfo), r = t.pendingProps, e === null ? t.child = lo(t, null, r, n) : Nc(e, t, r, n), t.child;
			case 11: return Pc(e, t, t.type, t.pendingProps, n);
			case 7: return r = t.pendingProps, Uc(e, t), Nc(e, t, r, n), t.child;
			case 8: return Nc(e, t, t.pendingProps.children, n), t.child;
			case 12: return Nc(e, t, t.pendingProps.children, n), t.child;
			case 10: return sl(e, t, n);
			case 9: return a = t.type._context, r = t.pendingProps.children, Sa(t), a = Ca(a), r = r(a), t.flags |= 1, Nc(e, t, r, n), t.child;
			case 14: return Fc(e, t, t.type, t.pendingProps, n);
			case 15: return Ic(e, t, t.type, t.pendingProps, n);
			case 19: return ol(e, t, n);
			case 31: return Hc(e, t, n);
			case 22: return Lc(e, t, n, t.pendingProps);
			case 24: return Sa(t), r = Ca(ka), e === null ? (a = Wa(), a === null && (a = q, o = Aa(), a.pooledCache = o, o.refCount++, o !== null && (a.pooledCacheLanes |= n), a = o), t.memoizedState = {
				parent: r,
				cache: a
			}, po(t), ga(t, ka, a)) : ((e.lanes & n) !== 0 && (mo(e, t), xo(t, null, null, n), bo()), a = e.memoizedState, o = t.memoizedState, a.parent === r ? (r = o.cache, ga(t, ka, r), r !== a.cache && ya(t, [ka], n, !0)) : (a = {
				parent: r,
				cache: r
			}, t.memoizedState = a, t.lanes === 0 && (t.memoizedState = t.updateQueue.baseState = a), ga(t, ka, r))), Nc(e, t, t.pendingProps.children, n), t.child;
			case 30: return t.stateNode === null && (t.stateNode = {
				autoName: null,
				paired: null,
				clones: null,
				ref: null
			}), r = t.pendingProps, r.name != null && r.name !== "auto" ? t.flags |= e === null ? 18882560 : 18874368 : H && Qi(t), e !== null && e.memoizedProps.name !== r.name ? t.flags |= 4194816 : Uc(e, t), Nc(e, t, r.children, n), t.child;
			case 29: throw t.pendingProps;
		}
		throw Error(i(156, t.tag));
	}
	function fl(e) {
		e.flags |= 4;
	}
	function pl(e, t, n, r, i) {
		var a;
		if ((a = !!(e.mode & 32)) && (a = n === null ? Jm(t, r) : Jm(t, r) && (r.src !== n.src || r.srcSet !== n.srcSet)), a) {
			if (e.flags |= 16777216, (i & 335544128) === i) {
				if (e.stateNode.complete) e.flags |= 8192;
				else if (Ud()) e.flags |= 8192;
				else throw eo = Xa, Ja;
			}
		} else e.flags &= -16777217;
	}
	function ml(e, t) {
		if (t.type !== "stylesheet" || t.state.loading & 4) e.flags &= -16777217;
		else if (e.flags |= 16777216, !Ym(t)) {
			if (Ud()) e.flags |= 8192;
			else throw eo = Xa, Ja;
		}
	}
	function hl(e, t) {
		t !== null && (e.flags |= 4), e.flags & 16384 && (t = e.tag === 22 ? 536870912 : bt(), e.lanes |= t, ud |= t);
	}
	function gl(e, t) {
		if (!H) switch (e.tailMode) {
			case "visible": break;
			case "collapsed":
				for (var n = e.tail, r = null; n !== null;) n.alternate !== null && (r = n), n = n.sibling;
				r === null ? t || e.tail === null ? e.tail = null : e.tail.sibling = null : r.sibling = null;
				break;
			default:
				for (t = e.tail, n = null; t !== null;) t.alternate !== null && (n = t), t = t.sibling;
				n === null ? e.tail = null : n.sibling = null;
		}
	}
	function _l(e) {
		var t = e.alternate !== null && e.alternate.child === e.child, n = 0, r = 0;
		if (t) for (var i = e.child; i !== null;) n |= i.lanes | i.childLanes, r |= i.subtreeFlags & 1206910976, r |= i.flags & 1206910976, i.return = e, i = i.sibling;
		else for (i = e.child; i !== null;) n |= i.lanes | i.childLanes, r |= i.subtreeFlags, r |= i.flags, i.return = e, i = i.sibling;
		return e.subtreeFlags |= r, e.childLanes = n, t;
	}
	function vl(e, t, n) {
		var r = t.pendingProps;
		switch ($i(t), t.tag) {
			case 16:
			case 15:
			case 0:
			case 11:
			case 7:
			case 8:
			case 12:
			case 9:
			case 14: return _l(t), null;
			case 1: return _l(t), null;
			case 3: return n = t.stateNode, r = null, e !== null && (r = e.memoizedState.cache), t.memoizedState.cache !== r && (t.flags |= 2048), _a(ka), Fe(), n.pendingContext && (n.context = n.pendingContext, n.pendingContext = null), (e === null || e.child === null) && (la(t) ? fl(t) : e === null || e.memoizedState.isDehydrated && !(t.flags & 256) || (t.flags |= 1024, da())), _l(t), null;
			case 26:
				var a = t.type, o = t.memoizedState;
				return e === null ? (fl(t), o === null ? (_l(t), pl(t, a, null, r, n)) : (_l(t), ml(t, o))) : o ? o === e.memoizedState ? (_l(t), t.flags &= -16777217) : (fl(t), _l(t), ml(t, o)) : (e = e.memoizedProps, e !== r && fl(t), _l(t), pl(t, a, e, r, n)), null;
			case 27:
				if (Le(t), n = Me.current, a = t.type, e !== null && t.stateNode != null) e.memoizedProps !== r && fl(t);
				else {
					if (!r) {
						if (t.stateNode === null) throw Error(i(166));
						return _l(t), t.subtreeFlags &= -33554433, null;
					}
					e = Ae.current, la(t) ? sa(t, e) : (e = hm(a, r, n), t.stateNode = e, fl(t));
				}
				return _l(t), t.subtreeFlags &= -33554433, null;
			case 5:
				if (Le(t), a = t.type, e !== null && t.stateNode != null) e.memoizedProps !== r && fl(t);
				else {
					if (!r) {
						if (t.stateNode === null) throw Error(i(166));
						return _l(t), t.subtreeFlags &= -33554433, null;
					}
					if (o = Ae.current, la(t)) sa(t, o);
					else {
						var s = lp(Me.current);
						switch (o) {
							case 1:
								o = s.createElementNS("http://www.w3.org/2000/svg", a);
								break;
							case 2:
								o = s.createElementNS("http://www.w3.org/1998/Math/MathML", a);
								break;
							default: switch (a) {
								case "svg":
									o = s.createElementNS("http://www.w3.org/2000/svg", a);
									break;
								case "math":
									o = s.createElementNS("http://www.w3.org/1998/Math/MathML", a);
									break;
								case "script":
									o = s.createElement("div"), o.innerHTML = "<script><\/script>", o = o.removeChild(o.firstChild);
									break;
								case "select":
									o = typeof r.is == "string" ? s.createElement("select", { is: r.is }) : s.createElement("select"), r.multiple ? o.multiple = !0 : r.size && (o.size = r.size);
									break;
								default: o = typeof r.is == "string" ? s.createElement(a, { is: r.is }) : s.createElement(a);
							}
						}
						o[A] = t, o[jt] = r;
						a: for (s = t.child; s !== null;) {
							if (s.tag === 5 || s.tag === 6) o.appendChild(s.stateNode);
							else if (s.tag !== 4 && s.tag !== 27 && s.child !== null) {
								s.child.return = s, s = s.child;
								continue;
							}
							if (s === t) break a;
							for (; s.sibling === null;) {
								if (s.return === null || s.return === t) break a;
								s = s.return;
							}
							s.sibling.return = s.return, s = s.sibling;
						}
						t.stateNode = o;
						a: switch (np(o, a, r), a) {
							case "button":
							case "input":
							case "select":
							case "textarea":
								r = !!r.autoFocus;
								break a;
							case "img":
								r = !0;
								break a;
							default: r = !1;
						}
						r && fl(t);
					}
				}
				return _l(t), t.subtreeFlags &= -33554433, pl(t, t.type, e === null ? null : e.memoizedProps, t.pendingProps, n), null;
			case 6:
				if (e && t.stateNode != null) e.memoizedProps !== r && fl(t);
				else {
					if (typeof r != "string" && t.stateNode === null) throw Error(i(166));
					if (e = Me.current, la(t)) {
						if (e = t.stateNode, n = t.memoizedProps, r = null, a = ta, a !== null) switch (a.tag) {
							case 27:
							case 5: r = a.memoizedProps;
						}
						e[A] = t, e = !!(e.nodeValue === n || r !== null && !0 === r.suppressHydrationWarning || ep(e.nodeValue, n)), e || oa(t, !0);
					} else e = lp(e).createTextNode(r), e[A] = t, t.stateNode = e;
				}
				return _l(t), null;
			case 31:
				if (n = t.memoizedState, e === null || e.memoizedState !== null) {
					if (r = la(t), n !== null) {
						if (e === null) {
							if (!r) throw Error(i(318));
							if (e = t.memoizedState, e = e === null ? null : e.dehydrated, !e) throw Error(i(557));
							e[A] = t;
						} else ua(), !(t.flags & 128) && (t.memoizedState = null), t.flags |= 4;
						_l(t), e = !1;
					} else n = da(), e !== null && e.memoizedState !== null && (e.memoizedState.hydrationErrors = n), e = !0;
					if (!e) return t.flags & 256 ? (Fo(t), t) : (Fo(t), null);
					if (t.flags & 128) throw Error(i(558));
				}
				return _l(t), null;
			case 13:
				if (r = t.memoizedState, e === null || e.memoizedState !== null && e.memoizedState.dehydrated !== null) {
					if (a = la(t), r !== null && r.dehydrated !== null) {
						if (e === null) {
							if (!a) throw Error(i(318));
							if (a = t.memoizedState, a = a === null ? null : a.dehydrated, !a) throw Error(i(317));
							a[A] = t;
						} else ua(), !(t.flags & 128) && (t.memoizedState = null), t.flags |= 4;
						_l(t), a = !1;
					} else a = da(), e !== null && e.memoizedState !== null && (e.memoizedState.hydrationErrors = a), a = !0;
					if (!a) return t.flags & 256 ? (Fo(t), t) : (Fo(t), null);
				}
				return Fo(t), t.flags & 128 ? (t.lanes = n, t) : (n = r !== null, e = e !== null && e.memoizedState !== null, n && (r = t.child, a = null, r.alternate !== null && r.alternate.memoizedState !== null && r.alternate.memoizedState.cachePool !== null && (a = r.alternate.memoizedState.cachePool.pool), o = null, r.memoizedState !== null && r.memoizedState.cachePool !== null && (o = r.memoizedState.cachePool.pool), o !== a && (r.flags |= 2048)), n !== e && n && (t.child.flags |= 8192), hl(t, t.updateQueue), _l(t), null);
			case 4: return Fe(), e === null && Wf(t.stateNode.containerInfo), t.flags |= 67108864, _l(t), null;
			case 10: return _a(t.type), _l(t), null;
			case 19:
				if (Ro(t), r = t.memoizedState, r === null) return _l(t), null;
				if (a = !!(t.flags & 128), o = r.rendering, o === null) {
					if (a) gl(r, !1);
					else {
						if (ad !== 0 || e !== null && e.flags & 128) for (e = t.child; e !== null;) {
							if (o = zo(e), o !== null) {
								for (t.flags |= 128, gl(r, !1), e = o.updateQueue, t.updateQueue = e, hl(t, e), t.subtreeFlags = 0, e = n, n = t.child; n !== null;) Ni(n, e), n = n.sibling;
								return Lo(t, Io.current & 1 | 2), H && Xi(t, r.treeForkCount), t.child;
							}
							e = e.sibling;
						}
						r.tail !== null && Xe() > gd && (t.flags |= 128, a = !0, gl(r, !1), t.lanes = 4194304);
					}
				} else {
					if (!a) {
						if (e = zo(o), e !== null) {
							if (t.flags |= 128, a = !0, e = e.updateQueue, t.updateQueue = e, hl(t, e), gl(r, !0), r.tail === null && r.tailMode !== "collapsed" && r.tailMode !== "visible" && !o.alternate && !H) return _l(t), null;
						} else 2 * Xe() - r.renderingStartTime > gd && n !== 536870912 && (t.flags |= 128, a = !0, gl(r, !1), t.lanes = 4194304);
					}
					r.isBackwards ? (o.sibling = t.child, t.child = o) : (e = r.last, e === null ? t.child = o : e.sibling = o, r.last = o);
				}
				if (r.tail !== null) {
					e = r.tail;
					a: {
						for (n = e; n !== null;) {
							if (n.alternate !== null) {
								n = !1;
								break a;
							}
							n = n.sibling;
						}
						n = !0;
					}
					return r.rendering = e, r.tail = e.sibling, r.renderingStartTime = Xe(), e.sibling = null, o = Io.current, o = a ? o & 1 | 2 : o & 1, r.tailMode === "visible" || r.tailMode === "collapsed" || !n || H ? Lo(t, o) : (n = o, O(ko, t), O(Io, n), Ao === null && (Ao = t)), H && Xi(t, r.treeForkCount), e;
				}
				return _l(t), null;
			case 22:
			case 23: return Fo(t), Oo(), r = t.memoizedState !== null, e === null ? r && (t.flags |= 8192) : e.memoizedState !== null !== r && (t.flags |= 8192), r ? n & 536870912 && !(t.flags & 128) && (_l(t), t.subtreeFlags & 6 && (t.flags |= 8192)) : _l(t), n = t.updateQueue, n !== null && hl(t, n.retryQueue), n = null, e !== null && e.memoizedState !== null && e.memoizedState.cachePool !== null && (n = e.memoizedState.cachePool.pool), r = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (r = t.memoizedState.cachePool.pool), r !== n && (t.flags |= 2048), e !== null && ke(Ua), null;
			case 24: return n = null, e !== null && (n = e.memoizedState.cache), t.memoizedState.cache !== n && (t.flags |= 2048), _a(ka), _l(t), null;
			case 25: return null;
			case 30: return t.flags |= 33554432, _l(t), null;
		}
		throw Error(i(156, t.tag));
	}
	function yl(e, t) {
		switch ($i(t), t.tag) {
			case 1: return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
			case 3: return _a(ka), Fe(), e = t.flags, e & 65536 && !(e & 128) ? (t.flags = e & -65537 | 128, t) : null;
			case 26:
			case 27:
			case 5: return Le(t), null;
			case 31:
				if (t.memoizedState !== null) {
					if (Fo(t), t.alternate === null) throw Error(i(340));
					ua();
				}
				return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
			case 13:
				if (Fo(t), e = t.memoizedState, e !== null && e.dehydrated !== null) {
					if (t.alternate === null) throw Error(i(340));
					ua();
				}
				return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
			case 19: return Ro(t), e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, e = t.memoizedState, e !== null && (e.rendering = null, e.tail = null), t.flags |= 4, t) : null;
			case 4: return Fe(), null;
			case 10: return _a(t.type), null;
			case 22:
			case 23: return Fo(t), Oo(), e !== null && ke(Ua), e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
			case 24: return _a(ka), null;
			case 25: return null;
			default: return null;
		}
	}
	function bl(e, t) {
		switch ($i(t), t.tag) {
			case 3:
				_a(ka), Fe();
				break;
			case 26:
			case 27:
			case 5:
				Le(t);
				break;
			case 4:
				Fe();
				break;
			case 31:
				t.memoizedState !== null && Fo(t);
				break;
			case 13:
				Fo(t);
				break;
			case 19:
				Ro(t);
				break;
			case 10:
				_a(t.type);
				break;
			case 22:
			case 23:
				Fo(t), Oo(), e !== null && ke(Ua);
				break;
			case 24: _a(ka);
		}
	}
	function xl(e, t) {
		try {
			var n = t.updateQueue, r = n === null ? null : n.lastEffect;
			if (r !== null) {
				var i = r.next;
				n = i;
				do {
					if ((n.tag & e) === e) {
						r = void 0;
						var a = n.create, o = n.inst;
						r = a(), o.destroy = r;
					}
					n = n.next;
				} while (n !== i);
			}
		} catch (e) {
			Z(t, t.return, e);
		}
	}
	function Sl(e, t, n) {
		try {
			var r = t.updateQueue, i = r === null ? null : r.lastEffect;
			if (i !== null) {
				var a = i.next;
				r = a;
				do {
					if ((r.tag & e) === e) {
						var o = r.inst, s = o.destroy;
						if (s !== void 0) {
							o.destroy = void 0, i = t;
							var c = n, l = s;
							try {
								l();
							} catch (e) {
								Z(i, c, e);
							}
						}
					}
					r = r.next;
				} while (r !== a);
			}
		} catch (e) {
			Z(t, t.return, e);
		}
	}
	function Cl(e) {
		var t = e.updateQueue;
		if (t !== null) {
			var n = e.stateNode;
			try {
				Co(t, n);
			} catch (t) {
				Z(e, e.return, t);
			}
		}
	}
	function wl(e, t, n) {
		n.props = xc(e.type, e.memoizedProps), n.state = e.memoizedState;
		try {
			n.componentWillUnmount();
		} catch (n) {
			Z(e, t, n);
		}
	}
	function Tl(e, t) {
		try {
			var n = e.ref;
			if (n !== null) {
				switch (e.tag) {
					case 26:
					case 27:
					case 5:
						var r = e.stateNode;
						break;
					case 30:
						var i = e.stateNode, a = hi(e.memoizedProps, i);
						(i.ref === null || i.ref.name !== a) && (i.ref = Pp(a)), r = i.ref;
						break;
					case 7:
						if (e.stateNode === null) {
							var o = new Fp(e);
							h(e.child, !1, Qp, o, void 0, void 0), e.stateNode = o;
						}
						r = e.stateNode;
						break;
					default: r = e.stateNode;
				}
				typeof n == "function" ? e.refCleanup = n(r) : n.current = r;
			}
		} catch (n) {
			Z(e, t, n);
		}
	}
	function El(e, t) {
		var n = e.ref, r = e.refCleanup;
		if (n !== null) {
			if (typeof r == "function") try {
				r();
			} catch (n) {
				Z(e, t, n);
			} finally {
				e.refCleanup = null, e = e.alternate, e != null && (e.refCleanup = null);
			}
			else if (typeof n == "function") try {
				n(null);
			} catch (n) {
				Z(e, t, n);
			}
			else n.current = null;
		}
	}
	function Dl(e, t) {
		if ((e.tag === 5 || e.tag === 27 || e.tag === 6) && e.alternate === null && t !== null) for (var n = 0; n < t.length; n++) em(e.stateNode, t[n]);
	}
	function Ol(e) {
		for (var t = e.return; t !== null && (jl(t) && em(e.stateNode, t.stateNode), !Al(t));) t = t.return;
	}
	function kl(e) {
		for (var t = e.return; t !== null && (jl(t) && tm(e.stateNode, t.stateNode), !Al(t));) t = t.return;
	}
	function Al(e) {
		return e.tag === 5 || e.tag === 3 || e.tag === 27;
	}
	function jl(e) {
		return e && e.tag === 7 && e.stateNode !== null;
	}
	function Ml(e) {
		var t = e.type, n = e.memoizedProps, r = e.stateNode;
		try {
			a: switch (t) {
				case "button":
				case "input":
				case "select":
				case "textarea":
					n.autoFocus && r.focus();
					break a;
				case "img": n.src ? r.src = n.src : n.srcSet && (r.srcset = n.srcSet);
			}
		} catch (t) {
			Z(e, e.return, t);
		}
	}
	function Nl(e, t, n) {
		try {
			var r = e.stateNode;
			ip(r, e.type, n, t), r[jt] = t;
		} catch (t) {
			Z(e, e.return, t);
		}
	}
	function Pl(e) {
		return e.tag === 5 || e.tag === 3 || e.tag === 26 || e.tag === 27 && Sp(e.type) || e.tag === 4;
	}
	function Fl(e) {
		a: for (;;) {
			for (; e.sibling === null;) {
				if (e.return === null || Pl(e.return)) return null;
				e = e.return;
			}
			for (e.sibling.return = e.return, e = e.sibling; e.tag !== 5 && e.tag !== 6 && e.tag !== 18;) {
				if (e.tag === 27 && Sp(e.type) || e.flags & 2 || e.child === null || e.tag === 4) continue a;
				e.child.return = e, e = e.child;
			}
			if (!(e.flags & 2)) return e.stateNode;
		}
	}
	function Il(e, t, n, r) {
		var i = e.tag;
		if (i === 5 || i === 6) i = e.stateNode, t ? (n.nodeType === 9 ? n.body : n.nodeName === "HTML" ? n.ownerDocument.body : n).insertBefore(i, t) : (t = n.nodeType === 9 ? n.body : n.nodeName === "HTML" ? n.ownerDocument.body : n, t.appendChild(i), n = n._reactRootContainer, n != null || t.onclick !== null || (t.onclick = bn)), Dl(e, r), P = !0;
		else if (i !== 4 && (i === 27 && (Dl(e, r), r = null, Sp(e.type) && (n = e.stateNode, t = null)), e = e.child, e !== null)) for (Il(e, t, n, r), e = e.sibling; e !== null;) Il(e, t, n, r), e = e.sibling;
	}
	function Ll(e, t, n, r) {
		var i = e.tag;
		if (i === 5 || i === 6) i = e.stateNode, t ? n.insertBefore(i, t) : n.appendChild(i), Dl(e, r), P = !0;
		else if (i !== 4 && (i === 27 && (Dl(e, r), r = null, Sp(e.type) && (n = e.stateNode)), e = e.child, e !== null)) for (Ll(e, t, n, r), e = e.sibling; e !== null;) Ll(e, t, n, r), e = e.sibling;
	}
	function Rl(e) {
		var t = e.stateNode, n = e.memoizedProps;
		try {
			for (var r = e.type, i = t.attributes; i.length;) t.removeAttributeNode(i[0]);
			np(t, r, n), t[A] = e, t[jt] = n;
		} catch (t) {
			Z(e, e.return, t);
		}
	}
	var zl = !1, Bl = null;
	function Vl(e) {
		(e.tag === 30 || e.subtreeFlags & 33554432) && (zl = !0);
	}
	var Hl = null;
	function Ul() {
		var e = Hl;
		return Hl = null, e;
	}
	var Wl = 0;
	function Gl(e, t, n, r, i) {
		return Wl = 0, Kl(e.child, t, n, r, i);
	}
	function Kl(e, t, n, r, i) {
		for (var a = !1; e !== null;) {
			if (e.tag === 5) {
				var o = e.stateNode;
				if (r !== null) {
					var s = Op(o);
					r.push(s), s.view && (a = !0);
				} else a || Op(o).view && (a = !0);
				zl = !0, Tp(o, Wl === 0 ? t : t + "_" + Wl, n), Wl++;
			} else e.tag === 22 && e.memoizedState !== null || e.tag === 30 && i || Kl(e.child, t, n, r, i) && (a = !0);
			e = e.sibling;
		}
		return a;
	}
	function ql(e, t) {
		for (; e !== null;) e.tag === 5 ? Ep(e.stateNode, e.memoizedProps) : e.tag === 22 && e.memoizedState !== null || e.tag === 30 && t || ql(e.child, t), e = e.sibling;
	}
	function Jl(e) {
		if (e.subtreeFlags & 18874368) for (e = e.child; e !== null;) {
			if ((e.tag !== 22 || e.memoizedState === null) && (Jl(e), e.tag === 30 && e.flags & 18874368 && e.stateNode.paired)) {
				var t = e.memoizedProps;
				if (t.name == null || t.name === "auto") throw Error(i(544));
				var n = t.name;
				t = _i(t.default, t.share), t !== "none" && (Gl(e, n, t, null, !1) || ql(e.child, !1));
			}
			e = e.sibling;
		}
	}
	function Yl(e, t) {
		if (e.tag === 30) {
			var n = e.stateNode, r = e.memoizedProps, i = hi(r, n), a = _i(r.default, n.paired ? r.share : r.enter);
			a === "none" ? Jl(e) : Gl(e, i, a, null, !1) ? (Jl(e), n.paired || t || Nd(e, r.onEnter)) : ql(e.child, !1);
		} else if (e.subtreeFlags & 33554432) for (e = e.child; e !== null;) Yl(e, t), e = e.sibling;
		else Jl(e);
	}
	function Xl(e) {
		if (Bl !== null && Bl.size !== 0) {
			var t = Bl;
			if (e.subtreeFlags & 18874368) for (e = e.child; e !== null;) {
				if (e.tag !== 22 || e.memoizedState === null) {
					if (e.tag === 30 && e.flags & 18874368) {
						var n = e.memoizedProps, r = n.name;
						if (r != null && r !== "auto") {
							var i = t.get(r);
							if (i !== void 0) {
								var a = _i(n.default, n.share);
								if (a !== "none" && (Gl(e, r, a, null, !1) ? (a = e.stateNode, i.paired = a, a.paired = i, Nd(e, n.onShare)) : ql(e.child, !1)), t.delete(r), t.size === 0) break;
							}
						}
					}
					Xl(e);
				}
				e = e.sibling;
			}
		}
	}
	function Zl(e) {
		if (e.tag === 30) {
			var t = e.memoizedProps, n = hi(t, e.stateNode), r = Bl === null ? void 0 : Bl.get(n), i = _i(t.default, r === void 0 ? t.exit : t.share);
			i !== "none" && (Gl(e, n, i, null, !1) ? r === void 0 ? Nd(e, t.onExit) : (i = e.stateNode, r.paired = i, i.paired = r, Bl.delete(n), Nd(e, t.onShare)) : ql(e.child, !1)), Bl !== null && Xl(e);
		} else if (e.subtreeFlags & 33554432) for (e = e.child; e !== null;) Zl(e), e = e.sibling;
		else Bl !== null && Xl(e);
	}
	function Ql(e) {
		for (e = e.child; e !== null;) {
			if (e.tag === 30) {
				var t = e.memoizedProps, n = hi(t, e.stateNode);
				t = _i(t.default, t.update), e.flags &= -5, t !== "none" && Gl(e, n, t, e.memoizedState = [], !1);
			} else e.subtreeFlags & 33554432 && Ql(e);
			e = e.sibling;
		}
	}
	function $l(e) {
		if (e.subtreeFlags & 18874368) for (e = e.child; e !== null;) {
			if (e.tag !== 22 || e.memoizedState === null) {
				if (e.tag === 30 && e.flags & 18874368) {
					var t = e.stateNode;
					t.paired !== null && (t.paired = null, ql(e.child, !1));
				}
				$l(e);
			}
			e = e.sibling;
		}
	}
	function eu(e) {
		if (e.tag === 30) e.stateNode.paired = null, ql(e.child, !1), $l(e);
		else if (e.subtreeFlags & 33554432) for (e = e.child; e !== null;) eu(e), e = e.sibling;
		else $l(e);
	}
	function tu(e) {
		for (e = e.child; e !== null;) e.tag === 30 ? ql(e.child, !1) : e.subtreeFlags & 33554432 && tu(e), e = e.sibling;
	}
	function nu(e, t, n, r, i, a, o) {
		for (var s = !1; t !== null;) {
			if (t.tag === 5) {
				var c = t.stateNode;
				if (a !== null && Wl < a.length) {
					var l = a[Wl], u = Op(c);
					(l.view || u.view) && (s = !0);
					var d;
					if (d = !(e.flags & 4)) {
						if (u.clip) d = !0;
						else {
							d = l.rect;
							var f = u.rect;
							d = d.y !== f.y || d.x !== f.x || d.height !== f.height || d.width !== f.width;
						}
					}
					d && (e.flags |= 4), u.abs ? u = !l.abs : (l = l.rect, u = u.rect, u = l.height !== u.height || l.width !== u.width), u && (e.flags |= 32);
				} else e.flags |= 32;
				e.flags & 4 && Tp(c, Wl === 0 ? n : n + "_" + Wl, i), s && e.flags & 4 || (Hl === null && (Hl = []), Hl.push(c, Wl === 0 ? r : r + "_" + Wl, t.memoizedProps)), Wl++;
			} else (t.tag !== 22 || t.memoizedState === null) && (t.tag === 30 && o ? e.flags |= t.flags & 32 : nu(e, t.child, n, r, i, a, o) && (s = !0));
			t = t.sibling;
		}
		return s;
	}
	function ru(e, t) {
		for (e = e.child; e !== null;) {
			if (e.tag === 30) {
				var n = e.memoizedProps, r = e.stateNode, i = hi(n, r), a = _i(n.default, n.update);
				if (t) {
					r = r.clones;
					var o = r === null ? null : r.map(kp);
				} else o = e.memoizedState, e.memoizedState = null;
				r = e;
				var s = e.child;
				Wl = 0, i = nu(r, s, i, i, a, o, !1), e.flags & 4 && i && (t || Nd(e, n.onUpdate));
			} else e.subtreeFlags & 33554432 && ru(e, t);
			e = e.sibling;
		}
	}
	var iu = !1, G = !1, au = !1, ou = !1, su = typeof WeakSet == "function" ? WeakSet : Set, cu = null, lu = !1, uu = !1, du = !1, fu = !1;
	function pu(e, t, n) {
		if (e = e.containerInfo, sp = gh, e = Gr(e), Kr(e)) {
			if ("selectionStart" in e) var r = {
				start: e.selectionStart,
				end: e.selectionEnd
			};
			else a: {
				r = (r = e.ownerDocument) && r.defaultView || window;
				var i = r.getSelection && r.getSelection();
				if (i && i.rangeCount !== 0) {
					r = i.anchorNode;
					var a = i.anchorOffset, o = i.focusNode;
					i = i.focusOffset;
					try {
						r.nodeType, o.nodeType;
					} catch {
						r = null;
						break a;
					}
					var s = 0, c = -1, l = -1, u = 0, d = 0, f = e, p = null;
					b: for (;;) {
						for (var m; f !== r || a !== 0 && f.nodeType !== 3 || (c = s + a), f !== o || i !== 0 && f.nodeType !== 3 || (l = s + i), f.nodeType === 3 && (s += f.nodeValue.length), (m = f.firstChild) !== null;) p = f, f = m;
						for (;;) {
							if (f === e) break b;
							if (p === r && ++u === a && (c = s), p === o && ++d === i && (l = s), (m = f.nextSibling) !== null) break;
							f = p, p = f.parentNode;
						}
						f = m;
					}
					r = c === -1 || l === -1 ? null : {
						start: c,
						end: l
					};
				} else r = null;
			}
			r ||= {
				start: 0,
				end: 0
			};
		} else r = null;
		for (cp = {
			focusedElem: e,
			selectionRange: r
		}, gh = !1, n = (n & 335544064) === n, cu = t, t = n ? 9270 : 1024; cu !== null;) {
			if (e = cu, n && (r = e.deletions, r !== null)) for (a = 0; a < r.length; a++) n && Zl(r[a]);
			if (e.alternate === null && e.flags & 2) n && Vl(e), mu(n);
			else {
				if (e.tag === 22) {
					if (r = e.alternate, e.memoizedState !== null) {
						r !== null && r.memoizedState === null && n && Zl(r), mu(n);
						continue;
					}
					if (r !== null && r.memoizedState !== null) {
						n && Vl(e), mu(n);
						continue;
					}
				}
				r = e.child, (e.subtreeFlags & t) !== 0 && r !== null ? (r.return = e, cu = r) : (n && Ql(e), mu(n));
			}
		}
		Bl = null;
	}
	function mu(e) {
		for (; cu !== null;) {
			var t = cu, n = e, r = t.alternate, a = t.flags;
			switch (t.tag) {
				case 0:
				case 11:
				case 15: break;
				case 1:
					if (a & 1024 && r !== null) {
						n = void 0, a = r.memoizedProps, r = r.memoizedState;
						var o = t.stateNode;
						try {
							var s = xc(t.type, a);
							n = o.getSnapshotBeforeUpdate(s, r), o.__reactInternalSnapshotBeforeUpdate = n;
						} catch (e) {
							Z(t, t.return, e);
						}
					}
					break;
				case 3:
					if (a & 1024) {
						if (r = t.stateNode.containerInfo, n = r.nodeType, n === 9) nm(r);
						else if (n === 1) switch (r.nodeName) {
							case "HEAD":
							case "HTML":
							case "BODY":
								nm(r);
								break;
							default: r.textContent = "";
						}
					}
					break;
				case 5:
				case 26:
				case 27:
				case 6:
				case 4:
				case 17: break;
				case 30:
					n && r !== null && (n = hi(r.memoizedProps, r.stateNode), a = t.memoizedProps, a = _i(a.default, a.update), a !== "none" && Gl(r, n, a, r.memoizedState = [], !0));
					break;
				default: if (a & 1024) throw Error(i(163));
			}
			if (r = t.sibling, r !== null) {
				r.return = t.return, cu = r;
				break;
			}
			cu = t.return;
		}
	}
	function hu(e, t, n) {
		var r = n.flags;
		switch (n.tag) {
			case 0:
			case 11:
			case 15:
				Fu(e, n), r & 4 && xl(5, n);
				break;
			case 1:
				if (Fu(e, n), r & 4) {
					if (e = n.stateNode, t === null) try {
						e.componentDidMount();
					} catch (e) {
						Z(n, n.return, e);
					}
					else {
						var i = xc(n.type, t.memoizedProps);
						t = t.memoizedState;
						try {
							e.componentDidUpdate(i, t, e.__reactInternalSnapshotBeforeUpdate);
						} catch (e) {
							Z(n, n.return, e);
						}
					}
				}
				r & 64 && Cl(n), r & 512 && Tl(n, n.return);
				break;
			case 3:
				if (Fu(e, n), r & 64 && (e = n.updateQueue, e !== null)) {
					if (t = null, n.child !== null) switch (n.child.tag) {
						case 27:
						case 5:
							t = n.child.stateNode;
							break;
						case 1: t = n.child.stateNode;
					}
					try {
						Co(e, t);
					} catch (e) {
						Z(n, n.return, e);
					}
				}
				break;
			case 27: t === null && r & 4 && Rl(n);
			case 26:
			case 5:
				Fu(e, n), t === null && r & 4 && Ml(n), r & 512 && Tl(n, n.return);
				break;
			case 12:
				Fu(e, n);
				break;
			case 31:
				Fu(e, n), r & 4 && wu(e, n);
				break;
			case 13:
				Fu(e, n), r & 4 && Tu(e, n), r & 64 && (e = n.memoizedState, e !== null && (e = e.dehydrated, e !== null && (n = _f.bind(null, n), cm(e, n))));
				break;
			case 22:
				if (r = n.memoizedState !== null || iu, !r) {
					var a = t !== null && t.memoizedState !== null || G;
					t = iu, i = G, iu = r, (G = a) && !i ? (r = 2, n.subtreeFlags & 8772 && (r |= 1), Lu(e, n, r)) : Fu(e, n), iu = t, G = i;
				}
				break;
			case 30:
				Fu(e, n), r & 512 && Tl(n, n.return);
				break;
			case 7: r & 512 && Tl(n, n.return);
			default: Fu(e, n);
		}
	}
	function gu(e, t) {
		for (e = e.child; e !== null;) _u(e, t), e = e.sibling;
	}
	function _u(e, t) {
		switch (e.tag) {
			case 5:
			case 26:
				try {
					var n = e.stateNode;
					if (t) {
						var r = n.style;
						typeof r.setProperty == "function" ? r.setProperty("display", "none", "important") : r.display = "none";
					} else {
						var i = e.stateNode, a = e.memoizedProps.style, o = a != null && a.hasOwnProperty("display") ? a.display : null;
						i.style.display = o == null || typeof o == "boolean" ? "" : ("" + o).trim();
					}
				} catch (t) {
					Z(e, e.return, t);
				}
				vu(e, t);
				break;
			case 6:
				try {
					e.stateNode.nodeValue = t ? "" : e.memoizedProps, P = !0;
				} catch (t) {
					Z(e, e.return, t);
				}
				break;
			case 18:
				try {
					var s = e.stateNode;
					t ? wp(s, !0) : wp(e.stateNode, !1);
				} catch (t) {
					Z(e, e.return, t);
				}
				break;
			case 22:
			case 23:
				e.memoizedState === null && gu(e, t);
				break;
			default: gu(e, t);
		}
	}
	function vu(e, t) {
		if (e.subtreeFlags & 67108864) for (e = e.child; e !== null;) {
			a: {
				var n = e, r = t;
				switch (n.tag) {
					case 4:
						_u(n, r);
						break a;
					case 22:
						n.memoizedState === null && vu(n, r);
						break a;
					default: vu(n, r);
				}
			}
			e = e.sibling;
		}
	}
	function yu(e) {
		var t = e.alternate;
		t !== null && (e.alternate = null, yu(t)), e.child = null, e.deletions = null, e.sibling = null, e.tag === 5 && (t = e.stateNode, t !== null && Rt(t)), e.stateNode = null, e.return = null, e.dependencies = null, e.memoizedProps = null, e.memoizedState = null, e.pendingProps = null, e.stateNode = null, e.updateQueue = null;
	}
	var bu = null, xu = !1;
	function Su(e, t, n) {
		for (n = n.child; n !== null;) Cu(e, t, n), n = n.sibling;
	}
	function Cu(e, t, n) {
		if (ot && typeof ot.onCommitFiberUnmount == "function") try {
			ot.onCommitFiberUnmount(at, n);
		} catch {}
		switch (n.tag) {
			case 26:
				G || El(n, t), Su(e, t, n), n.memoizedState ? n.memoizedState.count-- : n.stateNode && !G && (n = n.stateNode, n.parentNode.removeChild(n));
				break;
			case 27:
				G || El(n, t), kl(n);
				var r = bu, i = xu;
				Sp(n.type) && (bu = n.stateNode, xu = !1), Su(e, t, n), gm(n.stateNode, n.type, n.memoizedProps), bu = r, xu = i;
				break;
			case 5: G || El(n, t), kl(n);
			case 6:
				if (n.tag === 6 && kl(n), r = bu, i = xu, bu = null, Su(e, t, n), bu = r, xu = i, bu !== null) {
					if (xu) try {
						(bu.nodeType === 9 ? bu.body : bu.nodeName === "HTML" ? bu.ownerDocument.body : bu).removeChild(n.stateNode), P = !0;
					} catch (e) {
						Z(n, t, e);
					}
					else try {
						bu.removeChild(n.stateNode), P = !0;
					} catch (e) {
						Z(n, t, e);
					}
				}
				break;
			case 18:
				bu !== null && (xu ? (e = bu, Cp(e.nodeType === 9 ? e.body : e.nodeName === "HTML" ? e.ownerDocument.body : e, n.stateNode), Hh(e)) : Cp(bu, n.stateNode));
				break;
			case 4:
				r = bu, i = xu, bu = n.stateNode.containerInfo, xu = !0, Su(e, t, n), bu = r, xu = i;
				break;
			case 0:
			case 11:
			case 14:
			case 15:
				Sl(2, n, t), G || Sl(4, n, t), Su(e, t, n);
				break;
			case 1:
				G || (El(n, t), r = n.stateNode, typeof r.componentWillUnmount == "function" && wl(n, t, r)), Su(e, t, n);
				break;
			case 21:
				Su(e, t, n);
				break;
			case 22:
				G = (r = G) || n.memoizedState !== null, Su(e, t, n), G = r;
				break;
			case 30:
				El(n, t), Su(e, t, n);
				break;
			case 7:
				G || El(n, t), Su(e, t, n);
				break;
			default: Su(e, t, n);
		}
	}
	function wu(e, t) {
		if (t.memoizedState === null && (e = t.alternate, e !== null && (e = e.memoizedState, e !== null))) {
			e = e.dehydrated;
			try {
				Hh(e);
			} catch (e) {
				Z(t, t.return, e);
			}
		}
	}
	function Tu(e, t) {
		if (t.memoizedState === null && (e = t.alternate, e !== null && (e = e.memoizedState, e !== null && (e = e.dehydrated, e !== null)))) try {
			Hh(e);
		} catch (e) {
			Z(t, t.return, e);
		}
	}
	function Eu(e) {
		switch (e.tag) {
			case 31:
			case 13:
			case 19:
				var t = e.stateNode;
				return t === null && (t = e.stateNode = new su()), t;
			case 22: return e = e.stateNode, t = e._retryCache, t === null && (t = e._retryCache = new su()), t;
			default: throw Error(i(435, e.tag));
		}
	}
	function Du(e, t) {
		var n = Eu(e);
		t.forEach(function(t) {
			if (!n.has(t)) {
				n.add(t);
				var r = vf.bind(null, e, t);
				t.then(r, r);
			}
		});
	}
	function Ou(e, t, n) {
		var r = t.deletions;
		if (r !== null) for (var a = 0; a < r.length; a++) {
			var o = r[a], s = e, c = t, l = c;
			a: for (; l !== null;) {
				switch (l.tag) {
					case 27:
						if (Sp(l.type)) {
							bu = l.stateNode, xu = !1;
							break a;
						}
						break;
					case 5:
						bu = l.stateNode, xu = !1;
						break a;
					case 3:
					case 4:
						bu = l.stateNode.containerInfo, xu = !0;
						break a;
				}
				l = l.return;
			}
			if (bu === null) throw Error(i(160));
			Cu(s, c, o), bu = null, xu = !1, s = o.alternate, s !== null && (s.return = null), o.return = null;
		}
		if (t.subtreeFlags & 13886) for (t = t.child; t !== null;) Au(t, e, n), t = t.sibling;
	}
	var ku = null;
	function Au(e, t, n) {
		var r = e.alternate, a = e.flags;
		switch (e.tag) {
			case 0:
			case 11:
			case 14:
			case 15:
				if (a & 4 && (r = e.updateQueue, r = r === null ? null : r.events, r !== null)) for (var o = 0; o < r.length; o++) {
					var s = r[o];
					s.ref.impl = s.nextImpl;
				}
				Ou(t, e, n), ju(e), a & 4 && (Sl(3, e, e.return), xl(3, e), Sl(5, e, e.return));
				break;
			case 1:
				Ou(t, e, n), ju(e), a & 512 && (G || r === null || El(r, r.return)), a & 64 && iu && (e = e.updateQueue, e !== null && (t = e.callbacks, t !== null && (n = e.shared.hiddenCallbacks, e.shared.hiddenCallbacks = n === null ? t : n.concat(t))));
				break;
			case 26:
				if (o = ku, Ou(t, e, n), ju(e), a & 512 && (G || r === null || El(r, r.return)), a & 4) {
					if (a = r === null ? null : r.memoizedState, n = e.memoizedState, r === null) {
						if (n === null) {
							if (e.stateNode === null) {
								if (iu) e.stateNode = fp(e.type, e.memoizedProps, t.containerInfo, e);
								else {
									a: {
										t = e.type, n = e.memoizedProps, a = o.ownerDocument || o;
										b: switch (t) {
											case "title":
												r = a.getElementsByTagName("title")[0], (!r || r[It] || r[A] || r.namespaceURI === "http://www.w3.org/2000/svg" || r.hasAttribute("itemprop")) && (r = a.createElement(t), a.head.insertBefore(r, a.querySelector("head > title"))), np(r, t, n), r[A] = e, Ut(r), t = r;
												break a;
											case "link":
												if (o = Gm("link", "href", a).get(t + (n.href || ""))) {
													for (s = 0; s < o.length; s++) if (r = o[s], r.getAttribute("href") === (n.href == null || n.href === "" ? null : n.href) && r.getAttribute("rel") === (n.rel == null ? null : n.rel) && r.getAttribute("title") === (n.title == null ? null : n.title) && r.getAttribute("crossorigin") === (n.crossOrigin == null ? null : n.crossOrigin)) {
														o.splice(s, 1);
														break b;
													}
												}
												r = a.createElement(t), np(r, t, n), a.head.appendChild(r);
												break;
											case "meta":
												if (o = Gm("meta", "content", a).get(t + (n.content || ""))) {
													for (s = 0; s < o.length; s++) if (r = o[s], r.getAttribute("content") === (n.content == null ? null : "" + n.content) && r.getAttribute("name") === (n.name == null ? null : n.name) && r.getAttribute("property") === (n.property == null ? null : n.property) && r.getAttribute("http-equiv") === (n.httpEquiv == null ? null : n.httpEquiv) && r.getAttribute("charset") === (n.charSet == null ? null : n.charSet)) {
														o.splice(s, 1);
														break b;
													}
												}
												r = a.createElement(t), np(r, t, n), a.head.appendChild(r);
												break;
											default: throw Error(i(468, t));
										}
										r[A] = e, Ut(r), t = r;
									}
									e.stateNode = t;
								}
							} else iu || Km(o, e.type, e.stateNode);
						} else e.stateNode = Bm(o, n, e.memoizedProps);
					} else a === n ? n === null && e.stateNode !== null && Nl(e, e.memoizedProps, r.memoizedProps) : (a === null ? (t = r.stateNode, t === null || G || t.parentNode.removeChild(t)) : a.count--, n === null ? iu || Km(o, e.type, e.stateNode) : Bm(o, n, e.memoizedProps));
				}
				break;
			case 27:
				Ou(t, e, n), ju(e), a & 512 && (G || r === null || El(r, r.return)), r !== null && a & 4 && Nl(e, e.memoizedProps, r.memoizedProps);
				break;
			case 5:
				if (o = au, au = !1, Ou(t, e, n), au = o, ju(e), a & 512 && (G || r === null || El(r, r.return)), e.flags & 32) {
					t = e.stateNode;
					try {
						pn(t, ""), P = !0;
					} catch (t) {
						Z(e, e.return, t);
					}
				}
				a & 4 && e.stateNode != null && (t = e.memoizedProps, Nl(e, t, r === null ? t : r.memoizedProps)), a & 1024 && (ou = !0);
				break;
			case 6:
				if (Ou(t, e, n), ju(e), a & 4) {
					if (e.stateNode === null) throw Error(i(162));
					t = e.memoizedProps, n = e.stateNode;
					try {
						n.nodeValue = t, P = !0;
					} catch (t) {
						Z(e, e.return, t);
					}
				}
				break;
			case 3:
				if (P = !1, Wm = null, o = ku, ku = bm(t.containerInfo), Ou(t, e, n), ku = o, ju(e), a & 4 && r !== null && r.memoizedState.isDehydrated) try {
					Hh(t.containerInfo);
				} catch (t) {
					Z(e, e.return, t);
				}
				ou && (ou = !1, Mu(e)), P = !1;
				break;
			case 4:
				a = au, au = iu, r = Zt(), o = ku, ku = bm(e.stateNode.containerInfo), Ou(t, e, n), ju(e), ku = o, P && uu && (du = !0), P = r, au = a;
				break;
			case 12:
				Ou(t, e, n), ju(e);
				break;
			case 31:
				Ou(t, e, n), ju(e), a & 4 && (t = e.updateQueue, t !== null && (e.updateQueue = null, Du(e, t)));
				break;
			case 13:
				Ou(t, e, n), ju(e), e.child.flags & 8192 && e.memoizedState !== null != (r !== null && r.memoizedState !== null) && (md = Xe()), a & 4 && (t = e.updateQueue, t !== null && (e.updateQueue = null, Du(e, t)));
				break;
			case 22:
				o = e.memoizedState !== null, s = r !== null && r.memoizedState !== null;
				var c = iu, l = G, u = au;
				iu = c || o, au = u || o, G = l || s, Ou(t, e, n), G = l, au = u, iu = c, ju(e), a & 8192 && (t = e.stateNode, t._visibility = o ? t._visibility & -2 : t._visibility | 1, !o || r === null || s || iu || G || (t = s || G, n = iu, r = G, iu = o || iu, G = t, Iu(e, 2), iu = n, G = r), !o && au || gu(e, o)), a & 4 && (t = e.updateQueue, t !== null && (n = t.retryQueue, n !== null && (t.retryQueue = null, Du(e, n))));
				break;
			case 19:
				Ou(t, e, n), ju(e), a & 4 && (t = e.updateQueue, t !== null && (e.updateQueue = null, Du(e, t)));
				break;
			case 30:
				a & 512 && (G || r === null || El(r, r.return)), a = Zt(), o = uu, s = (n & 335544064) === n, c = e.memoizedProps, uu = s && _i(c.default, c.update) !== "none", Ou(t, e, n), ju(e), s && r !== null && P && (e.flags |= 4), uu = o, P = a;
				break;
			case 21: break;
			case 7: a & 512 && (G || r === null || El(r, r.return)), r && r.stateNode !== null && (r.stateNode._fragmentFiber = e);
			default: Ou(t, e, n), ju(e);
		}
	}
	function ju(e) {
		var t = e.flags;
		if (t & 2) {
			try {
				for (var n, r = e.return; r !== null;) {
					if (Pl(r)) {
						n = r;
						break;
					}
					r = r.return;
				}
				r = null;
				for (var a = e.return; a !== null;) {
					if (jl(a)) {
						var o = a.stateNode;
						r === null ? r = [o] : r.push(o);
					}
					if (Al(a)) break;
					a = a.return;
				}
				var s = r;
				if (n == null) throw Error(i(160));
				switch (n.tag) {
					case 27:
						var c = n.stateNode;
						Ll(e, Fl(e), c, s);
						break;
					case 5:
						var l = n.stateNode;
						n.flags & 32 && (pn(l, ""), n.flags &= -33), Ll(e, Fl(e), l, s);
						break;
					case 3:
					case 4:
						var u = n.stateNode.containerInfo;
						Il(e, Fl(e), u, s);
						break;
					default: throw Error(i(161));
				}
			} catch (t) {
				Z(e, e.return, t);
			}
			e.flags &= -3;
		}
		t & 4096 && (e.flags &= -4097);
	}
	function Mu(e) {
		if (e.subtreeFlags & 1024) for (e = e.child; e !== null;) {
			var t = e;
			Mu(t), t.tag === 5 && t.flags & 1024 && (t = t.stateNode, gh = !0, t.reset(), gh = !1), e = e.sibling;
		}
	}
	function Nu(e, t) {
		if (t.subtreeFlags & 9270) for (t = t.child; t !== null;) Pu(t, e), t = t.sibling;
		else ru(t, !1);
	}
	function Pu(e, t) {
		var n = e.alternate;
		if (n === null) Yl(e, !1);
		else switch (e.tag) {
			case 3:
				if (fu = lu = !1, Ul(), Nu(t, e), !lu && !du) {
					if (e = Hl, e !== null) for (var r = 0; r < e.length; r += 3) {
						n = e[r];
						var i = e[r + 1];
						Ep(n, e[r + 2]), n = n.ownerDocument.documentElement, n !== null && n.animate({
							opacity: [0, 0],
							pointerEvents: ["none", "none"]
						}, {
							duration: 0,
							fill: "forwards",
							pseudoElement: "::view-transition-group(" + i + ")"
						});
					}
					e = t.containerInfo, e = e.nodeType === 9 ? e.documentElement : e.ownerDocument.documentElement, e !== null && e.style.viewTransitionName === "" && (e.style.viewTransitionName = "none", e.animate({
						opacity: [0, 0],
						pointerEvents: ["none", "none"]
					}, {
						duration: 0,
						fill: "forwards",
						pseudoElement: "::view-transition-group(root)"
					}), e.animate({
						width: [0, 0],
						height: [0, 0]
					}, {
						duration: 0,
						fill: "forwards",
						pseudoElement: "::view-transition"
					})), fu = !0;
				}
				Hl = null;
				break;
			case 5:
				Nu(t, e);
				break;
			case 4:
				r = lu, lu = !1, Nu(t, e), lu && (du = !0), lu = r;
				break;
			case 22:
				e.memoizedState === null && (n.memoizedState === null ? Nu(t, e) : Yl(e, !1));
				break;
			case 30:
				r = lu, i = Ul(), lu = !1, Nu(t, e), lu && (e.flags |= 4);
				var a = e.memoizedProps, o = e.stateNode;
				t = hi(a, o), o = hi(n.memoizedProps, o);
				var s = _i(a.default, a.update);
				s === "none" ? t = !1 : (a = n.memoizedState, n.memoizedState = null, n = e.child, Wl = 0, t = nu(e, n, t, o, s, a, !0), Wl !== (a === null ? 0 : a.length) && (e.flags |= 32)), e.flags & 4 && t ? (Nd(e, e.memoizedProps.onUpdate), Hl = i) : i !== null && (i.push.apply(i, Hl), Hl = i), lu = e.flags & 32 ? !0 : r;
				break;
			default: Nu(t, e);
		}
	}
	function Fu(e, t) {
		if (t.subtreeFlags & 8772) for (t = t.child; t !== null;) hu(e, t.alternate, t), t = t.sibling;
	}
	function Iu(e, t) {
		for (e = e.child; e !== null;) {
			var n = e, r = t;
			switch (n.tag) {
				case 0:
				case 11:
				case 14:
				case 15:
					Sl(4, n, n.return), Iu(n, r);
					break;
				case 1:
					El(n, n.return);
					var i = n.stateNode;
					typeof i.componentWillUnmount == "function" && wl(n, n.return, i), Iu(n, r);
					break;
				case 27: r & 2 && gm(n.stateNode, n.type, n.memoizedProps);
				case 5:
					El(n, n.return), n.tag !== 5 && n.tag !== 27 || kl(n), Iu(n, r);
					break;
				case 6:
					kl(n);
					break;
				case 26:
					El(n, n.return), i = n.stateNode, n.memoizedState !== null || i === null || G || i.parentNode.removeChild(i), Iu(n, r);
					break;
				case 22:
					n.memoizedState === null && Iu(n, r);
					break;
				case 30:
					El(n, n.return), Iu(n, r);
					break;
				case 7: El(n, n.return);
				default: Iu(n, r);
			}
			e = e.sibling;
		}
	}
	function Lu(e, t, n) {
		for (n = t.subtreeFlags & 8772 ? n : n & -2, t = t.child; t !== null;) {
			var r = t.alternate, i = e, a = t, o = a.flags, s = !!(n & 1);
			switch (a.tag) {
				case 0:
				case 11:
				case 15:
					Lu(i, a, n), xl(4, a);
					break;
				case 1:
					if (Lu(i, a, n), r = a, i = r.stateNode, typeof i.componentDidMount == "function") try {
						i.componentDidMount();
					} catch (e) {
						Z(r, r.return, e);
					}
					if (r = a, i = r.updateQueue, i !== null) {
						var c = r.stateNode;
						try {
							var l = i.shared.hiddenCallbacks;
							if (l !== null) for (i.shared.hiddenCallbacks = null, i = 0; i < l.length; i++) So(l[i], c);
						} catch (e) {
							Z(r, r.return, e);
						}
					}
					s && o & 64 && Cl(a), Tl(a, a.return);
					break;
				case 27: n & 2 && Rl(a);
				case 5:
					a.tag !== 5 && a.tag !== 27 || Ol(a), Lu(i, a, n), s && r === null && o & 4 && Ml(a), Tl(a, a.return);
					break;
				case 6:
					Ol(a);
					break;
				case 26:
					c = a.stateNode, a.memoizedState !== null || c === null || iu || Km(bm(c.ownerDocument), a.type, c), Lu(i, a, n), s && r === null && o & 4 && Ml(a), Tl(a, a.return);
					break;
				case 12:
					Lu(i, a, n);
					break;
				case 31:
					Lu(i, a, n), s && o & 4 && wu(i, a);
					break;
				case 13:
					Lu(i, a, n), s && o & 4 && Tu(i, a);
					break;
				case 22:
					a.memoizedState === null && Lu(i, a, n), Tl(a, a.return);
					break;
				case 30:
					Lu(i, a, n), Tl(a, a.return);
					break;
				case 7: Tl(a, a.return);
				default: Lu(i, a, n);
			}
			t = t.sibling;
		}
	}
	function Ru(e, t) {
		var n = null;
		e !== null && e.memoizedState !== null && e.memoizedState.cachePool !== null && (n = e.memoizedState.cachePool.pool), e = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (e = t.memoizedState.cachePool.pool), e !== n && (e != null && e.refCount++, n != null && ja(n));
	}
	function zu(e, t) {
		e = null, t.alternate !== null && (e = t.alternate.memoizedState.cache), t = t.memoizedState.cache, t !== e && (t.refCount++, e != null && ja(e));
	}
	function Bu(e, t, n, r) {
		var i = (n & 335544064) === n;
		if (t.subtreeFlags & (i ? 10262 : 10256)) for (t = t.child; t !== null;) Vu(e, t, n, r), t = t.sibling;
		else i && tu(t);
	}
	function Vu(e, t, n, r) {
		var i = (n & 335544064) === n;
		i && t.alternate === null && t.return !== null && t.return.alternate !== null && eu(t);
		var a = t.flags;
		switch (t.tag) {
			case 0:
			case 11:
			case 15:
				Bu(e, t, n, r), a & 2048 && xl(9, t);
				break;
			case 1:
				Bu(e, t, n, r);
				break;
			case 3:
				Bu(e, t, n, r), i && fu && (e = e.containerInfo, e = e.nodeType === 9 ? e.body : e.nodeName === "HTML" ? e.ownerDocument.body : e, e.style.viewTransitionName === "root" && (e.style.viewTransitionName = ""), e = e.ownerDocument.documentElement, e !== null && e.style.viewTransitionName === "none" && (e.style.viewTransitionName = "")), a & 2048 && (a = null, t.alternate !== null && (a = t.alternate.memoizedState.cache), t = t.memoizedState.cache, t !== a && (t.refCount++, a != null && ja(a)));
				break;
			case 12:
				if (a & 2048) {
					Bu(e, t, n, r), a = t.stateNode;
					try {
						var o = t.memoizedProps, s = o.id, c = o.onPostCommit;
						typeof c == "function" && c(s, t.alternate === null ? "mount" : "update", a.passiveEffectDuration, -0);
					} catch (e) {
						Z(t, t.return, e);
					}
				} else Bu(e, t, n, r);
				break;
			case 31:
				Bu(e, t, n, r);
				break;
			case 13:
				Bu(e, t, n, r);
				break;
			case 23: break;
			case 22:
				o = t.stateNode, s = t.alternate, t.memoizedState === null ? (i && s !== null && s.memoizedState !== null && eu(t), o._visibility & 2 ? Bu(e, t, n, r) : (o._visibility |= 2, Hu(e, t, n, r, !!(t.subtreeFlags & 10256) || !1))) : (i && s !== null && s.memoizedState === null && eu(s), o._visibility & 2 ? Bu(e, t, n, r) : Uu(e, t)), a & 2048 && Ru(s, t);
				break;
			case 24:
				Bu(e, t, n, r), a & 2048 && zu(t.alternate, t);
				break;
			case 30:
				i && (a = t.alternate, a !== null && (ql(a.child, !0), ql(t.child, !0))), Bu(e, t, n, r);
				break;
			default: Bu(e, t, n, r);
		}
	}
	function Hu(e, t, n, r, i) {
		for (i &&= !!(t.subtreeFlags & 10256) || !1, t = t.child; t !== null;) {
			var a = e, o = t, s = n, c = r, l = o.flags;
			switch (o.tag) {
				case 0:
				case 11:
				case 15:
					Hu(a, o, s, c, i), xl(8, o);
					break;
				case 23: break;
				case 22:
					var u = o.stateNode;
					o.memoizedState === null ? (u._visibility |= 2, Hu(a, o, s, c, i)) : u._visibility & 2 ? Hu(a, o, s, c, i) : Uu(a, o), i && l & 2048 && Ru(o.alternate, o);
					break;
				case 24:
					Hu(a, o, s, c, i), i && l & 2048 && zu(o.alternate, o);
					break;
				default: Hu(a, o, s, c, i);
			}
			t = t.sibling;
		}
	}
	function Uu(e, t) {
		if (t.subtreeFlags & 10256) for (t = t.child; t !== null;) {
			var n = e, r = t, i = r.flags;
			switch (r.tag) {
				case 22:
					Uu(n, r), i & 2048 && Ru(r.alternate, r);
					break;
				case 24:
					Uu(n, r), i & 2048 && zu(r.alternate, r);
					break;
				default: Uu(n, r);
			}
			t = t.sibling;
		}
	}
	var Wu = 8192;
	function Gu(e, t, n) {
		if (e.subtreeFlags & Wu) for (e = e.child; e !== null;) Ku(e, t, n), e = e.sibling;
	}
	function Ku(e, t, n) {
		switch (e.tag) {
			case 26:
				Gu(e, t, n), e.flags & Wu && (e.memoizedState === null ? (e = e.stateNode, (t & 335544128) === t && Zm(n, e)) : Qm(n, ku, e.memoizedState, e.memoizedProps));
				break;
			case 5:
				Gu(e, t, n), e.flags & Wu && (e = e.stateNode, (t & 335544128) === t && Zm(n, e));
				break;
			case 3:
			case 4:
				var r = ku;
				ku = bm(e.stateNode.containerInfo), Gu(e, t, n), ku = r;
				break;
			case 22:
				e.memoizedState === null && (r = e.alternate, r !== null && r.memoizedState !== null ? (r = Wu, Wu = 16777216, Gu(e, t, n), Wu = r) : Gu(e, t, n));
				break;
			case 30:
				if ((e.flags & Wu) !== 0 && (r = e.memoizedProps.name, r != null && r !== "auto")) {
					var i = e.stateNode;
					i.paired = null, Bl === null && (Bl = /* @__PURE__ */ new Map()), Bl.set(r, i);
				}
				Gu(e, t, n);
				break;
			default: Gu(e, t, n);
		}
	}
	function qu(e) {
		var t = e.alternate;
		if (t !== null && (e = t.child, e !== null)) {
			t.child = null;
			do
				t = e.sibling, e.sibling = null, e = t;
			while (e !== null);
		}
	}
	function Ju(e) {
		var t = e.deletions;
		if (e.flags & 16) {
			if (t !== null) for (var n = 0; n < t.length; n++) {
				var r = t[n];
				cu = r, Zu(r, e);
			}
			qu(e);
		}
		if (e.subtreeFlags & 10256) for (e = e.child; e !== null;) Yu(e), e = e.sibling;
	}
	function Yu(e) {
		switch (e.tag) {
			case 0:
			case 11:
			case 15:
				Ju(e), e.flags & 2048 && Sl(9, e, e.return);
				break;
			case 3:
				Ju(e);
				break;
			case 12:
				Ju(e);
				break;
			case 22:
				var t = e.stateNode;
				e.memoizedState !== null && t._visibility & 2 && (e.return === null || e.return.tag !== 13) ? (t._visibility &= -3, Xu(e)) : Ju(e);
				break;
			default: Ju(e);
		}
	}
	function Xu(e) {
		var t = e.deletions;
		if (e.flags & 16) {
			if (t !== null) for (var n = 0; n < t.length; n++) {
				var r = t[n];
				cu = r, Zu(r, e);
			}
			qu(e);
		}
		for (e = e.child; e !== null;) {
			switch (t = e, t.tag) {
				case 0:
				case 11:
				case 15:
					Sl(8, t, t.return), Xu(t);
					break;
				case 22:
					n = t.stateNode, n._visibility & 2 && (n._visibility &= -3, Xu(t));
					break;
				default: Xu(t);
			}
			e = e.sibling;
		}
	}
	function Zu(e, t) {
		for (; cu !== null;) {
			var n = cu;
			switch (n.tag) {
				case 0:
				case 11:
				case 15:
					Sl(8, n, t);
					break;
				case 23:
				case 22:
					if (n.memoizedState !== null && n.memoizedState.cachePool !== null) {
						var r = n.memoizedState.cachePool.pool;
						r != null && r.refCount++;
					}
					break;
				case 24: ja(n.memoizedState.cache);
			}
			if (r = n.child, r !== null) r.return = n, cu = r;
			else a: for (n = e; cu !== null;) {
				r = cu;
				var i = r.sibling, a = r.return;
				if (yu(r), r === n) {
					cu = null;
					break a;
				}
				if (i !== null) {
					i.return = a, cu = i;
					break a;
				}
				cu = a;
			}
		}
	}
	var Qu = {
		getCacheForType: function(e) {
			var t = Ca(ka), n = t.data.get(e);
			return n === void 0 && (n = e(), t.data.set(e, n)), n;
		},
		cacheSignal: function() {
			return Ca(ka).controller.signal;
		}
	}, $u = typeof WeakMap == "function" ? WeakMap : Map, K = 0, q = null, J = null, Y = 0, X = 0, ed = null, td = !1, nd = !1, rd = !1, id = 0, ad = 0, od = 0, sd = 0, cd = 0, ld = 0, ud = 0, dd = null, fd = null, pd = !1, md = 0, hd = 0, gd = Infinity, _d = null, vd = null, yd = 0, bd = null, xd = null, Sd = 0, Cd = 0, wd = null, Td = null, Ed = null, Dd = null, Od = null, kd = 0, Ad = null;
	function jd() {
		return K & 2 && Y !== 0 ? Y & -Y : E.T === null ? Ot() : Pf();
	}
	function Md() {
		if (ld === 0) {
			if (!(Y & 536870912) || H) {
				var e = pt;
				pt <<= 1, !(pt & 3932160) && (pt = 262144), ld = e;
			} else ld = 536870912;
		}
		return e = ko.current, e !== null && (e.flags |= 32), ld;
	}
	function Nd(e, t) {
		if (t != null) {
			var n = e.stateNode, r = n.ref;
			r === null && (r = n.ref = Pp(hi(e.memoizedProps, n))), Dd === null && (Dd = []), Dd.push(t.bind(null, r));
		}
	}
	function Pd(e, t, n) {
		(e === q && (X === 2 || X === 9) || e.cancelPendingCommit !== null) && (Vd(e, 0), Rd(e, Y, ld, !1)), St(e, n), K & 2 && e === q || (e === q && (!(K & 2) && (sd |= n), ad === 4 && Rd(e, Y, ld, !1)), Ef(e));
	}
	function Fd(e, t, n) {
		if (K & 6) throw Error(i(327));
		var r = !n && !(t & 127) && (t & e.expiredLanes) === 0 || _t(e, t), a = r ? Yd(e, t) : qd(e, t, !0), o = r;
		do {
			if (a === 0) {
				nd && !r && Rd(e, t, 0, !1);
				break;
			}
			if (n = e.current.alternate, o && !Ld(n)) a = qd(e, t, !1), o = !1;
			else {
				if (a === 2) {
					if (o = t, e.errorRecoveryDisabledLanes & o) var s = 0;
					else s = e.pendingLanes & -536870913, s = s === 0 ? s & 536870912 ? 536870912 : 0 : s;
					if (s !== 0) {
						t = s;
						a: {
							var c = e;
							a = dd;
							var l = c.current.memoizedState.isDehydrated;
							if (l && (Vd(c, s).flags |= 256), s = qd(c, s, !1), s !== 2 && s !== 6) {
								if (rd && !l) {
									c.errorRecoveryDisabledLanes |= o, sd |= o, a = 4;
									break a;
								}
								o = fd, fd = a, o !== null && (fd === null ? fd = o : fd.push.apply(fd, o));
							}
							a = s;
						}
						if (o = !1, a !== 2) continue;
					}
				}
				if (a === 1) {
					Vd(e, 0), Rd(e, t, 0, !0);
					break;
				}
				a: {
					switch (r = e, o = a, o) {
						case 0:
						case 1: throw Error(i(345));
						case 4: if ((t & 4194048) !== t && (t & 62914560) !== t) break;
						case 6:
							Rd(r, t, ld, !td);
							break a;
						case 2:
							fd = null;
							break;
						case 3:
						case 5: break;
						default: throw Error(i(329));
					}
					if ((t & 62914560) === t && (a = md + 300 - Xe(), 10 < a)) {
						if (Rd(r, t, ld, !td), gt(r, 0, !0) !== 0) break a;
						Sd = t, r.timeoutHandle = gp(Id.bind(null, r, n, fd, _d, pd, t, ld, sd, ud, td, o, "Throttled", -0, 0), a);
						break a;
					}
					Id(r, n, fd, _d, pd, t, ld, sd, ud, td, o, null, -0, 0);
				}
				break;
			}
		} while (1);
		Ef(e);
	}
	function Id(e, t, n, r, i, a, o, s, c, l, u, d, f, p) {
		e.timeoutHandle = -1;
		var m = t.subtreeFlags, h = (a & 335544064) === a;
		d = null, (h || m & 8192 || (m & 16785408) == 16785408) && (d = {
			stylesheets: null,
			count: 0,
			imgCount: 0,
			imgBytes: 0,
			suspenseyImages: [],
			waitingForImages: !0,
			waitingForViewTransition: !1,
			unsuspend: bn
		}, Bl = null, Ku(t, a, d), h && (m = d, h = e.containerInfo, h = (h.nodeType === 9 ? h : h.ownerDocument).__reactViewTransition, h != null && (m.count++, m.waitingForViewTransition = !0, m = nh.bind(m), h.finished.then(m, m))), m = (a & 62914560) === a ? md - Xe() : (a & 4194048) === a ? hd - Xe() : 0, m = eh(d, m), m !== null) ? (Sd = a, e.cancelPendingCommit = m(nf.bind(null, e, t, a, n, r, i, o, s, c, l, u, d, null, f, p)), Rd(e, a, o, !l)) : nf(e, t, a, n, r, i, o, s, c, l, u, d);
	}
	function Ld(e) {
		for (var t = e;;) {
			var n = t.tag;
			if ((n === 0 || n === 11 || n === 15) && t.flags & 16384 && (n = t.updateQueue, n !== null && (n = n.stores, n !== null))) for (var r = 0; r < n.length; r++) {
				var i = n[r], a = i.getSnapshot;
				i = i.value;
				try {
					if (!zr(a(), i)) return !1;
				} catch {
					return !1;
				}
			}
			if (n = t.child, t.subtreeFlags & 16384 && n !== null) n.return = t, t = n;
			else {
				if (t === e) break;
				for (; t.sibling === null;) {
					if (t.return === null || t.return === e) return !0;
					t = t.return;
				}
				t.sibling.return = t.return, t = t.sibling;
			}
		}
		return !0;
	}
	function Rd(e, t, n, r) {
		t = vt(e, t), t &= ~cd, t &= ~sd, e.suspendedLanes |= t, e.pingedLanes &= ~t, r && (e.warmLanes |= t), r = e.expirationTimes;
		for (var i = t; 0 < i;) {
			var a = 31 - ct(i), o = 1 << a;
			r[a] = -1, i &= ~o;
		}
		n !== 0 && k(e, n, t);
	}
	function zd() {
		return K & 6 ? !0 : (Df(0, !1), !1);
	}
	function Bd() {
		if (J !== null) {
			if (X === 0) var e = J.return;
			else e = J, ha = ma = null, rs(e), ro = null, io = 0, e = J;
			for (; e !== null;) bl(e.alternate, e), e = e.return;
			J = null;
		}
	}
	function Vd(e, t) {
		var n = e.timeoutHandle;
		return n !== -1 && (e.timeoutHandle = -1, _p(n)), n = e.cancelPendingCommit, n !== null && (e.cancelPendingCommit = null, n()), Sd = 0, Bd(), q = e, J = n = Mi(e.current, null), Y = t, X = 0, ed = null, td = !1, nd = _t(e, t), rd = !1, ud = ld = cd = sd = od = ad = 0, fd = dd = null, pd = !1, id = vt(e, t), Si(), n;
	}
	function Hd(e, t) {
		U = null, E.H = pc, t === qa || t === Ya ? (t = to(), X = 3) : t === Ja ? (t = to(), X = 4) : X = t === jc ? 8 : typeof t == "object" && t && typeof t.then == "function" ? 6 : 1, ed = t, J === null && (ad = 1, Tc(e, Bi(t, e.current)));
	}
	function Ud() {
		var e = ko.current;
		return e === null ? !0 : (Y & 4194048) === Y ? Ao === null : (Y & 62914560) === Y || Y & 536870912 ? e === Ao : !1;
	}
	function Wd() {
		var e = E.H;
		return E.H = pc, e === null ? pc : e;
	}
	function Gd() {
		var e = E.A;
		return E.A = Qu, e;
	}
	function Kd() {
		ad = 4, td || (Y & 4194048) !== Y && ko.current !== null || (nd = !0), !(od & 134217727) && !(sd & 134217727) || q === null || Rd(q, Y, ld, !1);
	}
	function qd(e, t, n) {
		var r = K;
		K |= 2;
		var i = Wd(), a = Gd();
		(q !== e || Y !== t) && (_d = null, Vd(e, t)), t = !1;
		var o = ad;
		a: do
			try {
				if (X !== 0 && J !== null) {
					var s = J, c = ed;
					switch (X) {
						case 8:
							Bd(), o = 6;
							break a;
						case 3:
						case 2:
						case 9:
						case 6:
							ko.current === null && (t = !0);
							var l = X;
							if (X = 0, ed = null, $d(e, s, c, l), n && nd) {
								o = 0;
								break a;
							}
							break;
						default: l = X, X = 0, ed = null, $d(e, s, c, l);
					}
				}
				Jd(), o = ad;
				break;
			} catch (t) {
				Hd(e, t);
			}
		while (1);
		return t && e.shellSuspendCounter++, ha = ma = null, K = r, E.H = i, E.A = a, J === null && (q = null, Y = 0, Si()), o;
	}
	function Jd() {
		for (; J !== null;) Zd(J);
	}
	function Yd(e, t) {
		var n = K;
		K |= 2;
		var r = Wd(), a = Gd();
		q !== e || Y !== t ? (_d = null, gd = Xe() + 500, Vd(e, t)) : nd = _t(e, t);
		a: do
			try {
				if (X !== 0 && J !== null) {
					t = J;
					var o = ed;
					b: switch (X) {
						case 1:
							X = 0, ed = null, $d(e, t, o, 1);
							break;
						case 2:
						case 9:
							if (Za(o)) {
								X = 0, ed = null, Qd(t);
								break;
							}
							t = function() {
								X !== 2 && X !== 9 || q !== e || (X = 7), Ef(e);
							}, o.then(t, t);
							break a;
						case 3:
							X = 7;
							break a;
						case 4:
							X = 5;
							break a;
						case 7:
							Za(o) ? (X = 0, ed = null, Qd(t)) : (X = 0, ed = null, $d(e, t, o, 7));
							break;
						case 5:
							var s = null;
							switch (J.tag) {
								case 26: s = J.memoizedState;
								case 5:
								case 27:
									var c = J;
									if (s ? Ym(s) : c.stateNode.complete) {
										X = 0, ed = null;
										var l = c.sibling;
										if (l !== null) J = l;
										else {
											var u = c.return;
											u === null ? J = null : (J = u, ef(u));
										}
										break b;
									}
							}
							X = 0, ed = null, $d(e, t, o, 5);
							break;
						case 6:
							X = 0, ed = null, $d(e, t, o, 6);
							break;
						case 8:
							Bd(), ad = 6;
							break a;
						default: throw Error(i(462));
					}
				}
				Xd();
				break;
			} catch (t) {
				Hd(e, t);
			}
		while (1);
		return ha = ma = null, E.H = r, E.A = a, K = n, J === null ? (q = null, Y = 0, Si(), ad) : 0;
	}
	function Xd() {
		for (; J !== null && !Je();) Zd(J);
	}
	function Zd(e) {
		var t = dl(e.alternate, e, id);
		e.memoizedProps = e.pendingProps, t === null ? ef(e) : J = t;
	}
	function Qd(e) {
		var t = e, n = t.alternate;
		switch (t.tag) {
			case 15:
			case 0:
				t = Gc(n, t, t.pendingProps, t.type, void 0, Y);
				break;
			case 11:
				t = Gc(n, t, t.pendingProps, t.type.render, t.ref, Y);
				break;
			case 5:
				rs(t);
				var r = t;
				r === ta && (H ? (ca(r), r.tag === 5 && r.stateNode != null && (na = r.stateNode)) : (ca(r), H = !0));
			default: bl(n, t), t = J = Ni(t, id), t = dl(n, t, id);
		}
		e.memoizedProps = e.pendingProps, t === null ? ef(e) : J = t;
	}
	function $d(e, t, n, r) {
		ha = ma = null, rs(t), ro = null, io = 0;
		var i = t.return;
		try {
			if (Ac(e, i, t, n, Y)) {
				ad = 1, Tc(e, Bi(n, e.current)), J = null;
				return;
			}
		} catch (t) {
			if (i !== null) throw J = i, t;
			ad = 1, Tc(e, Bi(n, e.current)), J = null;
			return;
		}
		t.flags & 32768 ? (H || r === 1 ? e = !0 : nd || Y & 536870912 ? e = !1 : (td = e = !0, (r === 2 || r === 9 || r === 3 || r === 6) && (r = ko.current, r !== null && r.tag === 13 && (r.flags |= 16384))), tf(t, e)) : ef(t);
	}
	function ef(e) {
		var t = e;
		do {
			if (t.flags & 32768) {
				tf(t, td);
				return;
			}
			e = t.return;
			var n = vl(t.alternate, t, id);
			if (n !== null) {
				J = n;
				return;
			}
			if (t = t.sibling, t !== null) {
				J = t;
				return;
			}
			J = t = e;
		} while (t !== null);
		ad === 0 && (ad = 5);
	}
	function tf(e, t) {
		do {
			var n = yl(e.alternate, e);
			if (n !== null) {
				n.flags &= 32767, J = n;
				return;
			}
			if (n = e.return, n !== null && (n.flags |= 32768, n.subtreeFlags = 0, n.deletions = null), !t && (e = e.sibling, e !== null)) {
				J = e;
				return;
			}
			J = e = n;
		} while (e !== null);
		ad = 6, J = null;
	}
	function nf(e, t, n, r, a, o, s, c, l, u, d, f) {
		e.cancelPendingCommit = null;
		do
			df();
		while (yd !== 0);
		if (K & 6) throw Error(i(327));
		if (t !== null) {
			if (t === e.current) throw Error(i(177));
			e === q && (J = q = null, Y = 0), xd = t, bd = e, Sd = n, wd = a, Td = r, rf(e, t, n, s, c, l, f);
		}
	}
	function rf(e, t, n, r, i, a, o) {
		var s = t.lanes | t.childLanes;
		if (Cd = s, s |= xi, Ct(e, n, s, r, i, a), Dd = null, (n & 335544064) === n ? (Od = Pa(e), r = 10262) : (Od = null, r = 10256), (t.subtreeFlags & r) !== 0 || (t.flags & r) !== 0 ? (e.callbackNode = null, e.callbackPriority = 0, yf(et, function() {
			return ff(), null;
		})) : (e.callbackNode = null, e.callbackPriority = 0), zl = !1, r = !!(t.flags & 13878), t.subtreeFlags & 13878 || r) {
			r = E.T, E.T = null, i = D.p, D.p = 2, a = K, K |= 4;
			try {
				pu(e, t, n);
			} finally {
				K = a, D.p = i, E.T = r;
			}
		}
		yd = 1, zl ? Ed = Mp(o, e.containerInfo, Od, sf, cf, of, lf, ff, af, null, null) : (sf(), cf(), lf());
	}
	function af(e) {
		if (yd !== 0) {
			var t = bd.onRecoverableError;
			t(e, { componentStack: null });
		}
	}
	function of() {
		yd === 3 && (yd = 0, Pu(xd, bd), yd = 4);
	}
	function sf() {
		if (yd === 1) {
			yd = 0;
			var e = bd, t = xd, n = Sd, r = !!(t.flags & 13878);
			if (t.subtreeFlags & 13878 || r) {
				r = E.T, E.T = null;
				var i = D.p;
				D.p = 2;
				var a = K;
				K |= 4;
				try {
					uu = du = !1, Au(t, e, n), n = cp;
					var o = Gr(e.containerInfo), s = n.focusedElem, c = n.selectionRange;
					if (o !== s && s && s.ownerDocument && Wr(s.ownerDocument.documentElement, s)) {
						if (c !== null && Kr(s)) {
							var l = c.start, u = c.end;
							if (u === void 0 && (u = l), "selectionStart" in s) s.selectionStart = l, s.selectionEnd = Math.min(u, s.value.length);
							else {
								var d = s.ownerDocument || document, f = d && d.defaultView || window;
								if (f.getSelection) {
									var p = f.getSelection(), m = s.textContent.length, h = Math.min(c.start, m), g = c.end === void 0 ? h : Math.min(c.end, m);
									!p.extend && h > g && (o = g, g = h, h = o);
									var _ = Ur(s, h), v = Ur(s, g);
									if (_ && v && (p.rangeCount !== 1 || p.anchorNode !== _.node || p.anchorOffset !== _.offset || p.focusNode !== v.node || p.focusOffset !== v.offset)) {
										var y = d.createRange();
										y.setStart(_.node, _.offset), p.removeAllRanges(), h > g ? (p.addRange(y), p.extend(v.node, v.offset)) : (y.setEnd(v.node, v.offset), p.addRange(y));
									}
								}
							}
						}
						for (d = [], p = s; p = p.parentNode;) p.nodeType === 1 && d.push({
							element: p,
							left: p.scrollLeft,
							top: p.scrollTop
						});
						for (typeof s.focus == "function" && s.focus(), s = 0; s < d.length; s++) {
							var b = d[s];
							b.element.scrollLeft = b.left, b.element.scrollTop = b.top;
						}
					}
					gh = !!sp, cp = sp = null;
				} finally {
					K = a, D.p = i, E.T = r;
				}
			}
			e.current = t, yd = 2;
		}
	}
	function cf() {
		if (yd === 2) {
			yd = 0;
			var e = bd, t = xd, n = !!(t.flags & 8772);
			if (t.subtreeFlags & 8772 || n) {
				n = E.T, E.T = null;
				var r = D.p;
				D.p = 2;
				var i = K;
				K |= 4;
				try {
					hu(e, t.alternate, t);
				} finally {
					K = i, D.p = r, E.T = n;
				}
			}
			yd = 3;
		}
	}
	function lf() {
		if (yd === 4 || yd === 3) {
			yd = 0;
			var e = Ed;
			Ed = null, Ye();
			var t = bd, n = xd, r = Sd, i = Td, a = (r & 335544064) === r ? 10262 : 10256;
			if ((n.subtreeFlags & a) !== 0 || (n.flags & a) !== 0 ? yd = 5 : (yd = 0, xd = bd = null, uf(t, t.pendingLanes)), a = t.pendingLanes, a === 0 && (vd = null), Dt(r), n = n.stateNode, ot && typeof ot.onCommitFiberRoot == "function") try {
				ot.onCommitFiberRoot(at, n, void 0, (n.current.flags & 128) == 128);
			} catch {}
			if (i !== null) {
				n = E.T, a = D.p, D.p = 2, E.T = null;
				try {
					for (var o = t.onRecoverableError, s = 0; s < i.length; s++) {
						var c = i[s];
						o(c.value, { componentStack: c.stack });
					}
				} finally {
					E.T = n, D.p = a;
				}
			}
			if (i = Dd, o = Od, Od = null, i !== null && (Dd = null, o === null && (o = []), e !== null)) for (c = 0; c < i.length; c++) n = (0, i[c])(o), n !== void 0 && e.finished.finally(n);
			Sd & 3 && df(), Ef(t), a = t.pendingLanes, r & 261930 && a & 42 ? t === Ad ? kd++ : (kd = 0, Ad = t) : (kd = 0, Ad = null), Df(0, !1);
		}
	}
	function uf(e, t) {
		(e.pooledCacheLanes &= t) === 0 && (t = e.pooledCache, t != null && (e.pooledCache = null, ja(t)));
	}
	function df() {
		return Ed !== null && (Ed.skipTransition(), Ed = null), sf(), cf(), lf(), ff();
	}
	function ff() {
		if (yd !== 5) return !1;
		var e = bd, t = Cd;
		Cd = 0;
		var n = Dt(Sd), r = E.T, a = D.p;
		try {
			D.p = 32 > n ? 32 : n, E.T = null, n = wd, wd = null;
			var o = bd, s = Sd;
			if (yd = 0, xd = bd = null, Sd = 0, K & 6) throw Error(i(331));
			var c = K;
			if (K |= 4, Yu(o.current), Vu(o, o.current, s, n), K = c, Df(0, !1), ot && typeof ot.onPostCommitFiberRoot == "function") try {
				ot.onPostCommitFiberRoot(at, o);
			} catch {}
			return !0;
		} finally {
			D.p = a, E.T = r, uf(e, t);
		}
	}
	function pf(e, t, n) {
		t = Bi(n, t), t = Dc(e.stateNode, t, 2), e = go(e, t, 2), e !== null && (St(e, 2), Ef(e));
	}
	function Z(e, t, n) {
		if (e.tag === 3) pf(e, e, n);
		else for (; t !== null;) {
			if (t.tag === 3) {
				pf(t, e, n);
				break;
			}
			if (t.tag === 1) {
				var r = t.stateNode;
				if (typeof t.type.getDerivedStateFromError == "function" || typeof r.componentDidCatch == "function" && (vd === null || !vd.has(r))) {
					e = Bi(n, e), n = Oc(2), r = go(t, n, 2), r !== null && (kc(n, r, t, e), St(r, 2), Ef(r));
					break;
				}
			}
			t = t.return;
		}
	}
	function mf(e, t, n) {
		var r = e.pingCache;
		if (r === null) {
			r = e.pingCache = new $u();
			var i = /* @__PURE__ */ new Set();
			r.set(t, i);
		} else i = r.get(t), i === void 0 && (i = /* @__PURE__ */ new Set(), r.set(t, i));
		i.has(n) || (rd = !0, i.add(n), e = hf.bind(null, e, t, n), t.then(e, e));
	}
	function hf(e, t, n) {
		var r = e.pingCache;
		r !== null && r.delete(t), e.pingedLanes |= e.suspendedLanes & n, e.warmLanes &= ~n, q === e && (Y & n) === n && (ad === 4 || ad === 3 && (Y & 62914560) === Y && 300 > Xe() - md ? K & 2 ? cd |= n : Vd(e, 0) : cd |= n, ud === Y && (ud = 0)), Ef(e);
	}
	function gf(e, t) {
		t === 0 && (t = bt()), e = Ti(e, t), e !== null && (St(e, t), Ef(e));
	}
	function _f(e) {
		var t = e.memoizedState, n = 0;
		t !== null && (n = t.retryLane), gf(e, n);
	}
	function vf(e, t) {
		var n = 0;
		switch (e.tag) {
			case 31:
			case 13:
				var r = e.stateNode, a = e.memoizedState;
				a !== null && (n = a.retryLane);
				break;
			case 19:
				r = e.stateNode;
				break;
			case 22:
				r = e.stateNode._retryCache;
				break;
			default: throw Error(i(314));
		}
		r !== null && r.delete(t), gf(e, n);
	}
	function yf(e, t) {
		return Ke(e, t);
	}
	var bf = null, xf = null, Sf = !1, Cf = !1, wf = !1, Tf = 0;
	function Ef(e) {
		e !== xf && e.next === null && (xf === null ? bf = xf = e : xf = xf.next = e), Cf = !0, Sf || (Sf = !0, Nf());
	}
	function Df(e, t) {
		if (!wf && Cf) {
			wf = !0;
			do
				for (var n = !1, r = bf; r !== null;) {
					if (!t) {
						if (e !== 0) {
							var i = r.pendingLanes;
							if (i === 0) var a = 0;
							else {
								var o = r.suspendedLanes, s = r.pingedLanes;
								a = (1 << 31 - ct(42 | e) + 1) - 1, a &= i & ~(o & ~s), a = a & 201326741 ? a & 201326741 | 1 : a ? a | 2 : 0;
							}
							a !== 0 && (n = !0, Mf(r, a));
						} else a = Y, a = gt(r, r === q ? a : 0, r.cancelPendingCommit !== null || r.timeoutHandle !== -1), !(a & 3) || _t(r, a) || (n = !0, Mf(r, a));
					}
					r = r.next;
				}
			while (n);
			wf = !1;
		}
	}
	function Of() {
		kf();
	}
	function kf() {
		Cf = Sf = !1;
		var e = 0;
		Tf !== 0 && hp() && (e = Tf);
		for (var t = Xe(), n = null, r = bf; r !== null;) {
			var i = r.next, a = Af(r, t);
			a === 0 ? (r.next = null, n === null ? bf = i : n.next = i, i === null && (xf = n)) : (n = r, (e !== 0 || a & 3) && (Cf = !0)), r = i;
		}
		yd !== 0 && yd !== 5 || Df(e, !1), Tf !== 0 && (Tf = 0);
	}
	function Af(e, t) {
		for (var n = e.suspendedLanes, r = e.pingedLanes, i = e.expirationTimes, a = e.pendingLanes & -62914561; 0 < a;) {
			var o = 31 - ct(a), s = 1 << o, c = i[o];
			c === -1 ? ((s & n) === 0 || (s & r) !== 0) && (i[o] = yt(s, t)) : c <= t && (e.expiredLanes |= s), a &= ~s;
		}
		if (t = q, n = Y, n = gt(e, e === t ? n : 0, e.cancelPendingCommit !== null || e.timeoutHandle !== -1), r = e.callbackNode, n === 0 || e === t && (X === 2 || X === 9) || e.cancelPendingCommit !== null) return r !== null && r !== null && qe(r), e.callbackNode = null, e.callbackPriority = 0;
		if (!(n & 3) || _t(e, n)) {
			if (t = n & -n, t === e.callbackPriority) return t;
			switch (r !== null && qe(r), Dt(n)) {
				case 2:
				case 8:
					n = $e;
					break;
				case 32:
					n = et;
					break;
				case 268435456:
					n = nt;
					break;
				default: n = et;
			}
			return r = jf.bind(null, e), n = Ke(n, r), e.callbackPriority = t, e.callbackNode = n, t;
		}
		return r !== null && r !== null && qe(r), e.callbackPriority = 2, e.callbackNode = null, 2;
	}
	function jf(e, t) {
		if (yd !== 0 && yd !== 5) return e.callbackNode = null, e.callbackPriority = 0, null;
		var n = e.callbackNode;
		if (df() && e.callbackNode !== n) return null;
		var r = Y;
		return r = gt(e, e === q ? r : 0, e.cancelPendingCommit !== null || e.timeoutHandle !== -1), r === 0 ? null : (Fd(e, r, t), Af(e, Xe()), e.callbackNode != null && e.callbackNode === n ? jf.bind(null, e) : null);
	}
	function Mf(e, t) {
		if (df()) return null;
		Fd(e, t, !0);
	}
	function Nf() {
		bp(function() {
			K & 6 ? Ke(Qe, Of) : kf();
		});
	}
	function Pf() {
		if (Tf === 0) {
			var e = La;
			e === 0 && (e = ft, ft <<= 1, !(ft & 261888) && (ft = 256)), Tf = e;
		}
		return Tf;
	}
	function Ff(e) {
		return e == null || typeof e == "symbol" || typeof e == "boolean" ? null : typeof e == "function" ? e : yn(e);
	}
	function If(e, t, n, r, i) {
		if (t === "submit" && n && n.stateNode === i) {
			var a = Ff((i[jt] || null).action), o = r.submitter;
			o && (t = (t = o[jt] || null) ? Ff(t.formAction) : o.getAttribute("formAction"), t !== null && (a = t, o = null));
			var s = new Bn("action", "action", null, r, i);
			e.push({
				event: s,
				listeners: [{
					instance: null,
					listener: function() {
						if (r.defaultPrevented) {
							if (Tf !== 0) {
								var e = new FormData(i, o);
								$s(n, {
									pending: !0,
									data: e,
									method: i.method,
									action: a
								}, null, e);
							}
						} else typeof a == "function" && (s.preventDefault(), e = new FormData(i, o), $s(n, {
							pending: !0,
							data: e,
							method: i.method,
							action: a
						}, a, e));
					},
					currentTarget: i
				}]
			});
		}
	}
	for (var Lf = 0; Lf < fi.length; Lf++) {
		var Rf = fi[Lf];
		pi(Rf.toLowerCase(), "on" + (Rf[0].toUpperCase() + Rf.slice(1)));
	}
	pi(ii, "onAnimationEnd"), pi(ai, "onAnimationIteration"), pi(oi, "onAnimationStart"), pi("dblclick", "onDoubleClick"), pi("focusin", "onFocus"), pi("focusout", "onBlur"), pi(si, "onTransitionRun"), pi(ci, "onTransitionStart"), pi(li, "onTransitionCancel"), pi(ui, "onTransitionEnd"), Jt("onMouseEnter", ["mouseout", "mouseover"]), Jt("onMouseLeave", ["mouseout", "mouseover"]), Jt("onPointerEnter", ["pointerout", "pointerover"]), Jt("onPointerLeave", ["pointerout", "pointerover"]), qt("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" ")), qt("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")), qt("onBeforeInput", [
		"compositionend",
		"keypress",
		"textInput",
		"paste"
	]), qt("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" ")), qt("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" ")), qt("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
	var zf = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "), Bf = new Set("beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(zf));
	function Vf(e, t) {
		t = !!(t & 4);
		for (var n = 0; n < e.length; n++) {
			var r = e[n], i = r.event;
			r = r.listeners;
			a: {
				var a = void 0;
				if (t) for (var o = r.length - 1; 0 <= o; o--) {
					var s = r[o], c = s.instance, l = s.currentTarget;
					if (s = s.listener, c !== a && i.isPropagationStopped()) break a;
					a = s, i.currentTarget = l;
					try {
						a(i);
					} catch (e) {
						vi(e);
					}
					i.currentTarget = null, a = c;
				}
				else for (o = 0; o < r.length; o++) {
					if (s = r[o], c = s.instance, l = s.currentTarget, s = s.listener, c !== a && i.isPropagationStopped()) break a;
					a = s, i.currentTarget = l;
					try {
						a(i);
					} catch (e) {
						vi(e);
					}
					i.currentTarget = null, a = c;
				}
			}
		}
	}
	function Q(e, t) {
		var n = t[Mt];
		n === void 0 && (n = t[Mt] = /* @__PURE__ */ new Set());
		var r = e + "__bubble";
		n.has(r) || (Gf(t, e, 2, !1), n.add(r));
	}
	function Hf(e, t, n) {
		var r = 0;
		t && (r |= 4), Gf(n, e, r, t);
	}
	var Uf = "_reactListening" + Math.random().toString(36).slice(2);
	function Wf(e) {
		if (!e[Uf]) {
			e[Uf] = !0, Gt.forEach(function(t) {
				t !== "selectionchange" && (Bf.has(t) || Hf(t, !1, e), Hf(t, !0, e));
			});
			var t = e.nodeType === 9 ? e : e.ownerDocument;
			t === null || t[Uf] || (t[Uf] = !0, Hf("selectionchange", !1, t));
		}
	}
	function Gf(e, t, n, r) {
		switch (Ch(t)) {
			case 2:
				var i = _h;
				break;
			case 8:
				i = vh;
				break;
			default: i = yh;
		}
		n = i.bind(null, t, n, e), i = void 0, !An || t !== "touchstart" && t !== "touchmove" && t !== "wheel" || (i = !0), r ? i === void 0 ? e.addEventListener(t, n, !0) : e.addEventListener(t, n, {
			capture: !0,
			passive: i
		}) : i === void 0 ? e.addEventListener(t, n, !1) : e.addEventListener(t, n, { passive: i });
	}
	function Kf(e, t, n, r, i) {
		var a = r;
		if (!(t & 1) && !(t & 2) && r !== null) a: for (;;) {
			if (r === null) return;
			var s = r.tag;
			if (s === 3 || s === 4) {
				var c = r.stateNode.containerInfo;
				if (c === i) break;
				if (s === 4) for (s = r.return; s !== null;) {
					var l = s.tag;
					if ((l === 3 || l === 4) && s.stateNode.containerInfo === i) return;
					s = s.return;
				}
				for (; c !== null;) {
					if (s = zt(c), s === null) return;
					if (l = s.tag, l === 5 || l === 6 || l === 26 || l === 27) {
						r = a = s;
						continue a;
					}
					c = c.parentNode;
				}
			}
			r = r.return;
		}
		Dn(function() {
			var r = a, i = Sn(n), s = [];
			a: {
				var c = di.get(e);
				if (c !== void 0) {
					var l = Bn, u = e;
					switch (e) {
						case "keypress": if (Fn(n) === 0) break a;
						case "keydown":
						case "keyup":
							l = ir;
							break;
						case "focusin":
							u = "focus", l = Yn;
							break;
						case "focusout":
							u = "blur", l = Yn;
							break;
						case "beforeblur":
						case "afterblur":
							l = Yn;
							break;
						case "click": if (n.button === 2) break a;
						case "auxclick":
						case "dblclick":
						case "mousedown":
						case "mousemove":
						case "mouseup":
						case "mouseout":
						case "mouseover":
						case "contextmenu":
							l = qn;
							break;
						case "drag":
						case "dragend":
						case "dragenter":
						case "dragexit":
						case "dragleave":
						case "dragover":
						case "dragstart":
						case "drop":
							l = Jn;
							break;
						case "touchcancel":
						case "touchend":
						case "touchmove":
						case "touchstart":
							l = sr;
							break;
						case ii:
						case ai:
						case oi:
							l = Xn;
							break;
						case ui:
							l = cr;
							break;
						case "scroll":
						case "scrollend":
							l = Hn;
							break;
						case "wheel":
							l = lr;
							break;
						case "copy":
						case "cut":
						case "paste":
							l = Zn;
							break;
						case "gotpointercapture":
						case "lostpointercapture":
						case "pointercancel":
						case "pointerdown":
						case "pointermove":
						case "pointerout":
						case "pointerover":
						case "pointerup":
							l = ar;
							break;
						case "submit":
							l = or;
							break;
						case "toggle":
						case "beforetoggle": l = ur;
					}
					var d = !!(t & 4), f = !d && (e === "scroll" || e === "scrollend"), p = d ? c === null ? null : c + "Capture" : c;
					d = [];
					for (var m = r, h; m !== null;) {
						var g = m;
						if (h = g.stateNode, g = g.tag, g !== 5 && g !== 26 && g !== 27 || h === null || p === null || (g = On(m, p), g != null && d.push(qf(m, g, h))), f) break;
						m = m.return;
					}
					0 < d.length && (c = new l(c, u, null, n, i), s.push({
						event: c,
						listeners: d
					}));
				}
			}
			if (!(t & 7)) {
				a: {
					if (l = e === "mouseover" || e === "pointerover", c = e === "mouseout" || e === "pointerout", l && n !== xn && (u = n.relatedTarget || n.fromElement) && (zt(u) || u[j])) break a;
					(c || l) && (u = i.window === i ? i : (l = i.ownerDocument) ? l.defaultView || l.parentWindow : window, c ? (l = n.relatedTarget || n.toElement, c = r, l = l ? zt(l) : null, l !== null && (f = o(l), d = l.tag, l !== f || d !== 5 && d !== 27 && d !== 6) && (l = null)) : (c = null, l = r), c !== l && (d = qn, g = "onMouseLeave", p = "onMouseEnter", m = "mouse", (e === "pointerout" || e === "pointerover") && (d = ar, g = "onPointerLeave", p = "onPointerEnter", m = "pointer"), f = c == null ? u : Vt(c), h = l == null ? u : Vt(l), u = new d(g, m + "leave", c, n, i), u.target = f, u.relatedTarget = h, g = null, zt(i) === r && (d = new d(p, m + "enter", l, n, i), d.target = h, d.relatedTarget = f, g = d), f = g, d = c && l ? re(c, l, Yf) : null, c !== null && Xf(s, u, c, d, !1), l !== null && f !== null && Xf(s, f, l, d, !0)));
				}
				a: {
					if (c = r ? Vt(r) : window, l = c.nodeName && c.nodeName.toLowerCase(), l === "select" || l === "input" && c.type === "file") var _ = Dr;
					else if (xr(c)) {
						if (Or) _ = Lr;
						else {
							_ = Fr;
							var v = Pr;
						}
					} else l = c.nodeName, !l || l.toLowerCase() !== "input" || c.type !== "checkbox" && c.type !== "radio" ? r && gn(r.elementType) && (_ = Dr) : _ = Ir;
					if (_ &&= _(e, r)) {
						Sr(s, _, n, i);
						break a;
					}
					v && v(e, c, r);
				}
				switch (v = r ? Vt(r) : window, e) {
					case "focusin":
						(xr(v) || v.contentEditable === "true") && (Jr = v, Yr = r, Xr = null);
						break;
					case "focusout":
						Xr = Yr = Jr = null;
						break;
					case "mousedown":
						Zr = !0;
						break;
					case "contextmenu":
					case "mouseup":
					case "dragend":
						Zr = !1, Qr(s, n, i);
						break;
					case "selectionchange": if (qr) break;
					case "keydown":
					case "keyup": Qr(s, n, i);
				}
				var y;
				if (fr) b: {
					switch (e) {
						case "compositionstart":
							var b = "onCompositionStart";
							break b;
						case "compositionend":
							b = "onCompositionEnd";
							break b;
						case "compositionupdate":
							b = "onCompositionUpdate";
							break b;
					}
					b = void 0;
				}
				else z ? vr(e, n) && (b = "onCompositionEnd") : e === "keydown" && n.keyCode === 229 && (b = "onCompositionStart");
				b && (hr && n.locale !== "ko" && (z || b !== "onCompositionStart" ? b === "onCompositionEnd" && z && (y = Pn()) : (R = i, Mn = "value" in R ? R.value : R.textContent, z = !0)), v = Jf(r, b), 0 < v.length && (b = new Qn(b, e, null, n, i), s.push({
					event: b,
					listeners: v
				}), y ? b.data = y : (y = yr(n), y !== null && (b.data = y)))), (y = mr ? br(e, n) : B(e, n)) && (b = Jf(r, "onBeforeInput"), 0 < b.length && (v = new Qn("onBeforeInput", "beforeinput", null, n, i), s.push({
					event: v,
					listeners: b
				}), v.data = y)), If(s, e, r, n, i);
			}
			Vf(s, t);
		});
	}
	function qf(e, t, n) {
		return {
			instance: e,
			listener: t,
			currentTarget: n
		};
	}
	function Jf(e, t) {
		for (var n = t + "Capture", r = []; e !== null;) {
			var i = e, a = i.stateNode;
			if (i = i.tag, i !== 5 && i !== 26 && i !== 27 || a === null || (i = On(e, n), i != null && r.unshift(qf(e, i, a)), i = On(e, t), i != null && r.push(qf(e, i, a))), e.tag === 3) return r;
			e = e.return;
		}
		return [];
	}
	function Yf(e) {
		if (e === null) return null;
		do
			e = e.return;
		while (e && e.tag !== 5 && e.tag !== 27);
		return e || null;
	}
	function Xf(e, t, n, r, i) {
		for (var a = t._reactName, o = []; n !== null && n !== r;) {
			var s = n, c = s.alternate, l = s.stateNode;
			if (s = s.tag, c !== null && c === r) break;
			s !== 5 && s !== 26 && s !== 27 || l === null || (c = l, i ? (l = On(n, a), l != null && o.unshift(qf(n, l, c))) : i || (l = On(n, a), l != null && o.push(qf(n, l, c)))), n = n.return;
		}
		o.length !== 0 && e.push({
			event: t,
			listeners: o
		});
	}
	var Zf = /\r\n?/g, Qf = /\u0000|\uFFFD/g;
	function $f(e) {
		return (typeof e == "string" ? e : "" + e).replace(Zf, "\n").replace(Qf, "");
	}
	function ep(e, t) {
		return t = $f(t), $f(e) === t;
	}
	function $(e, t, n, r, a, o) {
		switch (n) {
			case "children":
				if (typeof r == "string") t === "body" || t === "textarea" && r === "" || pn(e, r);
				else if (typeof r == "number" || typeof r == "bigint") t !== "body" && pn(e, "" + r);
				else return;
				break;
			case "className":
				$t(e, "class", r);
				break;
			case "tabIndex":
				$t(e, "tabindex", r);
				break;
			case "dir":
			case "role":
			case "viewBox":
			case "width":
			case "height":
				$t(e, n, r);
				break;
			case "style":
				hn(e, r, o);
				return;
			case "data": if (t !== "object") {
				$t(e, "data", r);
				break;
			}
			case "src":
			case "href":
				if (r === "" && (t !== "a" || n !== "href") || r == null || typeof r == "function" || typeof r == "symbol" || typeof r == "boolean") {
					e.removeAttribute(n);
					break;
				}
				r = yn(r), e.setAttribute(n, r);
				break;
			case "action":
			case "formAction":
				if (typeof r == "function") {
					e.setAttribute(n, "javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')");
					break;
				}
				if (typeof o == "function" && (n === "formAction" ? (t !== "input" && $(e, t, "name", a.name, a, null), $(e, t, "formEncType", a.formEncType, a, null), $(e, t, "formMethod", a.formMethod, a, null), $(e, t, "formTarget", a.formTarget, a, null)) : ($(e, t, "encType", a.encType, a, null), $(e, t, "method", a.method, a, null), $(e, t, "target", a.target, a, null))), r == null || typeof r == "symbol" || typeof r == "boolean") {
					e.removeAttribute(n);
					break;
				}
				r = yn(r), e.setAttribute(n, r);
				break;
			case "onClick":
				r != null && (e.onclick = bn);
				return;
			case "onScroll":
				r != null && Q("scroll", e);
				return;
			case "onScrollEnd":
				r != null && Q("scrollend", e);
				return;
			case "dangerouslySetInnerHTML":
				if (r != null) {
					if (typeof r != "object" || !("__html" in r)) throw Error(i(61));
					if (n = r.__html, n != null) {
						if (a.children != null) throw Error(i(60));
						o?.__html !== n && (e.innerHTML = n);
					}
				}
				break;
			case "multiple":
				e.multiple = r && typeof r != "function" && typeof r != "symbol";
				break;
			case "muted":
				e.muted = r && typeof r != "function" && typeof r != "symbol";
				break;
			case "suppressContentEditableWarning":
			case "suppressHydrationWarning":
			case "defaultValue":
			case "defaultChecked":
			case "innerHTML":
			case "ref": break;
			case "autoFocus": break;
			case "xlinkHref":
				if (r == null || typeof r == "function" || typeof r == "boolean" || typeof r == "symbol") {
					e.removeAttribute("xlink:href");
					break;
				}
				n = yn(r), e.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", n);
				break;
			case "contentEditable":
			case "spellCheck":
			case "draggable":
			case "value":
			case "autoReverse":
			case "externalResourcesRequired":
			case "focusable":
			case "preserveAlpha":
				r != null && typeof r != "function" && typeof r != "symbol" ? e.setAttribute(n, r) : e.removeAttribute(n);
				break;
			case "inert":
			case "allowFullScreen":
			case "async":
			case "autoPlay":
			case "controls":
			case "credentialless":
			case "default":
			case "defer":
			case "disabled":
			case "disablePictureInPicture":
			case "disableRemotePlayback":
			case "formNoValidate":
			case "hidden":
			case "loop":
			case "noModule":
			case "noValidate":
			case "open":
			case "playsInline":
			case "readOnly":
			case "required":
			case "reversed":
			case "scoped":
			case "seamless":
			case "itemScope":
				r && typeof r != "function" && typeof r != "symbol" ? e.setAttribute(n, "") : e.removeAttribute(n);
				break;
			case "capture":
			case "download":
				!0 === r ? e.setAttribute(n, "") : !1 !== r && r != null && typeof r != "function" && typeof r != "symbol" ? e.setAttribute(n, r) : e.removeAttribute(n);
				break;
			case "cols":
			case "rows":
			case "size":
			case "span":
				r != null && typeof r != "function" && typeof r != "symbol" && !isNaN(r) && 1 <= r ? e.setAttribute(n, r) : e.removeAttribute(n);
				break;
			case "rowSpan":
			case "start":
				r == null || typeof r == "function" || typeof r == "symbol" || isNaN(r) ? e.removeAttribute(n) : e.setAttribute(n, r);
				break;
			case "popover":
				Q("beforetoggle", e), Q("toggle", e), Qt(e, "popover", r);
				break;
			case "xlinkActuate":
				F(e, "http://www.w3.org/1999/xlink", "xlink:actuate", r);
				break;
			case "xlinkArcrole":
				F(e, "http://www.w3.org/1999/xlink", "xlink:arcrole", r);
				break;
			case "xlinkRole":
				F(e, "http://www.w3.org/1999/xlink", "xlink:role", r);
				break;
			case "xlinkShow":
				F(e, "http://www.w3.org/1999/xlink", "xlink:show", r);
				break;
			case "xlinkTitle":
				F(e, "http://www.w3.org/1999/xlink", "xlink:title", r);
				break;
			case "xlinkType":
				F(e, "http://www.w3.org/1999/xlink", "xlink:type", r);
				break;
			case "xmlBase":
				F(e, "http://www.w3.org/XML/1998/namespace", "xml:base", r);
				break;
			case "xmlLang":
				F(e, "http://www.w3.org/XML/1998/namespace", "xml:lang", r);
				break;
			case "xmlSpace":
				F(e, "http://www.w3.org/XML/1998/namespace", "xml:space", r);
				break;
			case "is":
				Qt(e, "is", r);
				break;
			case "innerText":
			case "textContent": return;
			default: if (!(2 < n.length) || n[0] !== "o" && n[0] !== "O" || n[1] !== "n" && n[1] !== "N") n = _n.get(n) || n, Qt(e, n, r);
			else return;
		}
		P = !0;
	}
	function tp(e, t, n, r, a, o) {
		switch (n) {
			case "style":
				hn(e, r, o);
				return;
			case "dangerouslySetInnerHTML":
				if (r != null) {
					if (typeof r != "object" || !("__html" in r)) throw Error(i(61));
					if (n = r.__html, n != null) {
						if (a.children != null) throw Error(i(60));
						o?.__html !== n && (e.innerHTML = n);
					}
				}
				break;
			case "children":
				if (typeof r == "string") pn(e, r);
				else if (typeof r == "number" || typeof r == "bigint") pn(e, "" + r);
				else return;
				break;
			case "onScroll":
				r != null && Q("scroll", e);
				return;
			case "onScrollEnd":
				r != null && Q("scrollend", e);
				return;
			case "onClick":
				r != null && (e.onclick = bn);
				return;
			case "suppressContentEditableWarning":
			case "suppressHydrationWarning":
			case "innerHTML":
			case "ref": return;
			case "innerText":
			case "textContent": return;
			default:
				if (!Kt.hasOwnProperty(n)) a: {
					if (n[0] === "o" && n[1] === "n" && (a = n.endsWith("Capture"), o = n.slice(2, a ? n.length - 7 : void 0), t = e[jt] || null, t = t == null ? null : t[n], typeof t == "function" && e.removeEventListener(o, t, a), typeof r == "function")) {
						typeof t != "function" && t !== null && (n in e ? e[n] = null : e.hasAttribute(n) && e.removeAttribute(n)), e.addEventListener(o, r, a);
						break a;
					}
					P = !0, n in e ? e[n] = r : !0 === r ? e.setAttribute(n, "") : Qt(e, n, r);
				}
				return;
		}
		P = !0;
	}
	function np(e, t, n) {
		switch (t) {
			case "div":
			case "span":
			case "svg":
			case "path":
			case "a":
			case "g":
			case "p":
			case "li": break;
			case "img":
				Q("error", e), Q("load", e);
				var r = !1, a = !1, o;
				for (o in n) if (n.hasOwnProperty(o)) {
					var s = n[o];
					if (s != null) switch (o) {
						case "src":
							r = !0;
							break;
						case "srcSet":
							a = !0;
							break;
						case "children":
						case "dangerouslySetInnerHTML": throw Error(i(137, t));
						default: $(e, t, o, s, n, null);
					}
				}
				a && $(e, t, "srcSet", n.srcSet, n, null), r && $(e, t, "src", n.src, n, null);
				return;
			case "input":
				Q("invalid", e);
				var c = o = s = a = null, l = null, u = null;
				for (r in n) if (n.hasOwnProperty(r)) {
					var d = n[r];
					if (d != null) switch (r) {
						case "name":
							a = d;
							break;
						case "type":
							s = d;
							break;
						case "checked":
							l = d;
							break;
						case "defaultChecked":
							u = d;
							break;
						case "value":
							o = d;
							break;
						case "defaultValue":
							c = d;
							break;
						case "children":
						case "dangerouslySetInnerHTML":
							if (d != null) throw Error(i(137, t));
							break;
						default: $(e, t, r, d, n, null);
					}
				}
				cn(e, o, c, l, u, s, a, !1);
				return;
			case "select":
				for (a in Q("invalid", e), r = s = o = null, n) if (n.hasOwnProperty(a) && (c = n[a], c != null)) switch (a) {
					case "value":
						o = c;
						break;
					case "defaultValue":
						s = c;
						break;
					case "multiple": r = c;
					default: $(e, t, a, c, n, null);
				}
				t = o, n = s, e.multiple = !!r, t == null ? n != null && un(e, !!r, n, !0) : un(e, !!r, t, !1);
				return;
			case "textarea":
				for (s in Q("invalid", e), o = a = r = null, n) if (n.hasOwnProperty(s) && (c = n[s], c != null)) switch (s) {
					case "value":
						r = c;
						break;
					case "defaultValue":
						a = c;
						break;
					case "children":
						o = c;
						break;
					case "dangerouslySetInnerHTML":
						if (c != null) throw Error(i(91));
						break;
					default: $(e, t, s, c, n, null);
				}
				fn(e, r, a, o);
				return;
			case "option":
				for (l in n) if (n.hasOwnProperty(l) && (r = n[l], r != null)) switch (l) {
					case "selected":
						e.selected = r && typeof r != "function" && typeof r != "symbol";
						break;
					default: $(e, t, l, r, n, null);
				}
				return;
			case "dialog":
				Q("beforetoggle", e), Q("toggle", e), Q("cancel", e), Q("close", e);
				break;
			case "iframe":
			case "object":
				Q("load", e);
				break;
			case "video":
			case "audio":
				for (r = 0; r < zf.length; r++) Q(zf[r], e);
				break;
			case "image":
				Q("error", e), Q("load", e);
				break;
			case "details":
				Q("toggle", e);
				break;
			case "embed":
			case "source":
			case "link": Q("error", e), Q("load", e);
			case "area":
			case "base":
			case "br":
			case "col":
			case "hr":
			case "keygen":
			case "meta":
			case "param":
			case "track":
			case "wbr":
			case "menuitem":
				for (u in n) if (n.hasOwnProperty(u) && (r = n[u], r != null)) switch (u) {
					case "children":
					case "dangerouslySetInnerHTML": throw Error(i(137, t));
					default: $(e, t, u, r, n, null);
				}
				return;
			default: if (gn(t)) {
				for (d in n) n.hasOwnProperty(d) && (r = n[d], r !== void 0 && tp(e, t, d, r, n, void 0));
				return;
			}
		}
		for (c in n) n.hasOwnProperty(c) && (r = n[c], r != null && $(e, t, c, r, n, null));
	}
	var rp = {};
	function ip(e, t, n, r) {
		switch (t) {
			case "div":
			case "span":
			case "svg":
			case "path":
			case "a":
			case "g":
			case "p":
			case "li": break;
			case "input":
				var a = null, o = null, s = null, c = null, l = null, u = null, d = null;
				for (m in n) {
					var f = n[m];
					if (n.hasOwnProperty(m) && f != null) switch (m) {
						case "checked": break;
						case "value": break;
						case "defaultValue": l = f;
						default: r.hasOwnProperty(m) || $(e, t, m, null, r, f);
					}
				}
				for (var p in r) {
					var m = r[p];
					if (f = n[p], r.hasOwnProperty(p) && (m != null || f != null)) switch (p) {
						case "type":
							m !== f && (P = !0), o = m;
							break;
						case "name":
							m !== f && (P = !0), a = m;
							break;
						case "checked":
							m !== f && (P = !0), u = m;
							break;
						case "defaultChecked":
							m !== f && (P = !0), d = m;
							break;
						case "value":
							m !== f && (P = !0), s = m;
							break;
						case "defaultValue":
							m !== f && (P = !0), c = m;
							break;
						case "children":
						case "dangerouslySetInnerHTML":
							if (m != null) throw Error(i(137, t));
							break;
						default: m !== f && $(e, t, p, m, r, f);
					}
				}
				I(e, s, c, l, u, d, o, a);
				return;
			case "select":
				for (o in m = s = c = p = null, n) if (l = n[o], n.hasOwnProperty(o) && l != null) switch (o) {
					case "value": break;
					case "multiple": m = l;
					default: r.hasOwnProperty(o) || $(e, t, o, null, r, l);
				}
				for (a in r) if (o = r[a], l = n[a], r.hasOwnProperty(a) && (o != null || l != null)) switch (a) {
					case "value":
						o !== l && (P = !0), p = o;
						break;
					case "defaultValue":
						o !== l && (P = !0), c = o;
						break;
					case "multiple": o !== l && (P = !0), s = o;
					default: o !== l && $(e, t, a, o, r, l);
				}
				t = c, n = s, r = m, p == null ? !!r != !!n && (t == null ? un(e, !!n, n ? [] : "", !1) : un(e, !!n, t, !0)) : un(e, !!n, p, !1);
				return;
			case "textarea":
				for (c in m = p = null, n) if (a = n[c], n.hasOwnProperty(c) && a != null && !r.hasOwnProperty(c)) switch (c) {
					case "value": break;
					case "children": break;
					default: $(e, t, c, null, r, a);
				}
				for (s in r) if (a = r[s], o = n[s], r.hasOwnProperty(s) && (a != null || o != null)) switch (s) {
					case "value":
						a !== o && (P = !0), p = a;
						break;
					case "defaultValue":
						a !== o && (P = !0), m = a;
						break;
					case "children": break;
					case "dangerouslySetInnerHTML":
						if (a != null) throw Error(i(91));
						break;
					default: a !== o && $(e, t, s, a, r, o);
				}
				dn(e, p, m);
				return;
			case "option":
				for (var h in n) if (p = n[h], n.hasOwnProperty(h) && p != null && !r.hasOwnProperty(h)) switch (h) {
					case "selected":
						e.selected = !1;
						break;
					default: $(e, t, h, null, r, p);
				}
				for (l in r) if (p = r[l], m = n[l], r.hasOwnProperty(l) && p !== m && (p != null || m != null)) switch (l) {
					case "selected":
						p !== m && (P = !0), e.selected = p && typeof p != "function" && typeof p != "symbol";
						break;
					default: $(e, t, l, p, r, m);
				}
				return;
			case "img":
			case "link":
			case "area":
			case "base":
			case "br":
			case "col":
			case "embed":
			case "hr":
			case "keygen":
			case "meta":
			case "param":
			case "source":
			case "track":
			case "wbr":
			case "menuitem":
				for (var g in n) p = n[g], n.hasOwnProperty(g) && p != null && !r.hasOwnProperty(g) && $(e, t, g, null, r, p);
				for (u in r) if (p = r[u], m = n[u], r.hasOwnProperty(u) && p !== m && (p != null || m != null)) switch (u) {
					case "children":
					case "dangerouslySetInnerHTML":
						if (p != null) throw Error(i(137, t));
						break;
					default: $(e, t, u, p, r, m);
				}
				return;
			default: if (gn(t)) {
				for (var _ in n) p = n[_], n.hasOwnProperty(_) && p !== void 0 && !r.hasOwnProperty(_) && tp(e, t, _, void 0, r, p);
				for (d in r) p = r[d], m = n[d], !r.hasOwnProperty(d) || p === m || p === void 0 && m === void 0 || tp(e, t, d, p, r, m);
				return;
			}
		}
		for (var v in n) p = n[v], n.hasOwnProperty(v) && p != null && !r.hasOwnProperty(v) && $(e, t, v, null, r, p);
		for (f in r) p = r[f], m = n[f], !r.hasOwnProperty(f) || p === m || p == null && m == null || $(e, t, f, p, r, m);
	}
	function ap(e) {
		switch (e) {
			case "css":
			case "script":
			case "font":
			case "img":
			case "image":
			case "input":
			case "link": return !0;
			default: return !1;
		}
	}
	function op() {
		if (typeof performance.getEntriesByType == "function") {
			for (var e = 0, t = 0, n = performance.getEntriesByType("resource"), r = 0; r < n.length; r++) {
				var i = n[r], a = i.transferSize, o = i.initiatorType, s = i.duration;
				if (a && s && ap(o)) {
					for (o = 0, s = i.responseEnd, r += 1; r < n.length; r++) {
						var c = n[r], l = c.startTime;
						if (l > s) break;
						var u = c.transferSize, d = c.initiatorType;
						u && ap(d) && (c = c.responseEnd, o += u * (c < s ? 1 : (s - l) / (c - l)));
					}
					if (--r, t += 8 * (a + o) / (i.duration / 1e3), e++, 10 < e) break;
				}
			}
			if (0 < e) return t / e / 1e6;
		}
		return navigator.connection && (e = navigator.connection.downlink, typeof e == "number") ? e : 5;
	}
	var sp = null, cp = null;
	function lp(e) {
		return e.nodeType === 9 ? e : e.ownerDocument;
	}
	function up(e) {
		switch (e) {
			case "http://www.w3.org/2000/svg": return 1;
			case "http://www.w3.org/1998/Math/MathML": return 2;
			default: return 0;
		}
	}
	function dp(e, t) {
		if (e === 0) switch (t) {
			case "svg": return 1;
			case "math": return 2;
			default: return 0;
		}
		return e === 1 && t === "foreignObject" ? 0 : e;
	}
	function fp(e, t, n, r) {
		return n = lp(n).createElement(e), n[A] = r, n[jt] = t, np(n, e, t), Ut(n), n;
	}
	function pp(e, t) {
		return e === "textarea" || e === "noscript" || typeof t.children == "string" || typeof t.children == "number" || typeof t.children == "bigint" || typeof t.dangerouslySetInnerHTML == "object" && t.dangerouslySetInnerHTML !== null && t.dangerouslySetInnerHTML.__html != null;
	}
	var mp = null;
	function hp() {
		var e = window.event;
		return e && e.type === "popstate" ? e !== mp && (mp = e, !0) : (mp = null, !1);
	}
	var gp = typeof setTimeout == "function" ? setTimeout : void 0, _p = typeof clearTimeout == "function" ? clearTimeout : void 0, vp = typeof Promise == "function" ? Promise : void 0, yp = typeof requestAnimationFrame == "function" ? requestAnimationFrame : gp, bp = typeof queueMicrotask == "function" ? queueMicrotask : vp === void 0 ? gp : function(e) {
		return vp.resolve(null).then(e).catch(xp);
	};
	function xp(e) {
		setTimeout(function() {
			throw e;
		});
	}
	function Sp(e) {
		return e === "head";
	}
	function Cp(e, t) {
		var n = t, r = 0;
		do {
			var i = n.nextSibling;
			if (e.removeChild(n), i && i.nodeType === 8) {
				if (n = i.data, n === "/$" || n === "/&") {
					if (r === 0) {
						e.removeChild(i), Hh(t);
						return;
					}
					r--;
				} else if (n === "$" || n === "$?" || n === "$~" || n === "$!" || n === "&") r++;
				else if (n === "html") _m(e.ownerDocument.documentElement);
				else if (n === "head") {
					n = e.ownerDocument.head, _m(n);
					for (var a = n.firstChild; a;) {
						var o = a.nextSibling, s = a.nodeName;
						a[It] || s === "SCRIPT" || s === "STYLE" || s === "LINK" && a.rel.toLowerCase() === "stylesheet" || n.removeChild(a), a = o;
					}
				} else n === "body" && _m(e.ownerDocument.body);
			}
			n = i;
		} while (n);
		Hh(t);
	}
	function wp(e, t) {
		var n = e;
		e = 0;
		do {
			var r = n.nextSibling;
			if (n.nodeType === 1 ? t ? (n._stashedDisplay = n.style.display, n.style.display = "none") : (n.style.display = n._stashedDisplay || "", n.getAttribute("style") === "" && n.removeAttribute("style")) : n.nodeType === 3 && (t ? (n._stashedText = n.nodeValue, n.nodeValue = "") : n.nodeValue = n._stashedText || ""), r && r.nodeType === 8) {
				if (n = r.data, n === "/$") {
					if (e === 0) break;
					e--;
				} else n !== "$" && n !== "$?" && n !== "$~" && n !== "$!" || e++;
			}
			n = r;
		} while (n);
	}
	function Tp(e, t, n) {
		if (t = CSS.escape(t) === t ? t : "r-" + btoa(t).replace(/=/g, ""), e.style.viewTransitionName = t, n != null && (e.style.viewTransitionClass = n), n = getComputedStyle(e), n.display === "inline") {
			if (t = e.getClientRects(), t.length === 1) var r = 1;
			else for (var i = r = 0; i < t.length; i++) {
				var a = t[i];
				0 < a.width && 0 < a.height && r++;
			}
			r === 1 && (e = e.style, e.display = t.length === 1 ? "inline-block" : "block", e.marginTop = "-" + n.paddingTop, e.marginBottom = "-" + n.paddingBottom);
		}
	}
	function Ep(e, t) {
		e = e.style, t = t.style;
		var n = t == null ? null : t.hasOwnProperty("viewTransitionName") ? t.viewTransitionName : t.hasOwnProperty("view-transition-name") ? t["view-transition-name"] : null;
		e.viewTransitionName = n == null || typeof n == "boolean" ? "" : ("" + n).trim(), n = t == null ? null : t.hasOwnProperty("viewTransitionClass") ? t.viewTransitionClass : t.hasOwnProperty("view-transition-class") ? t["view-transition-class"] : null, e.viewTransitionClass = n == null || typeof n == "boolean" ? "" : ("" + n).trim(), e.display === "inline-block" && (t == null ? e.display = e.margin = "" : (n = t.display, e.display = n == null || typeof n == "boolean" ? "" : n, n = t.margin, n == null ? (n = t.hasOwnProperty("marginTop") ? t.marginTop : t["margin-top"], e.marginTop = n == null || typeof n == "boolean" ? "" : n, t = t.hasOwnProperty("marginBottom") ? t.marginBottom : t["margin-bottom"], e.marginBottom = t == null || typeof t == "boolean" ? "" : t) : e.margin = n));
	}
	function Dp(e, t, n) {
		return n = n.ownerDocument.defaultView, {
			rect: e,
			abs: t.position === "absolute" || t.position === "fixed",
			clip: t.clipPath !== "none" || t.overflow !== "visible" || t.filter !== "none" || t.mask !== "none" || t.mask !== "none" || t.borderRadius !== "0px",
			view: 0 <= e.bottom && 0 <= e.right && e.top <= n.innerHeight && e.left <= n.innerWidth
		};
	}
	function Op(e) {
		return Dp(e.getBoundingClientRect(), getComputedStyle(e), e);
	}
	function kp(e) {
		var t = e.getBoundingClientRect();
		t = new DOMRect(t.x + 2e4, t.y + 2e4, t.width, t.height);
		var n = getComputedStyle(e);
		return Dp(t, n, e);
	}
	function Ap(e) {
		return e.documentElement.clientHeight;
	}
	function jp(e) {
		this.addEventListener("load", e), this.addEventListener("error", e);
	}
	function Mp(e, t, n, r, i, a, o, s, c) {
		var l = t.nodeType === 9 ? t : t.ownerDocument;
		try {
			var u = l.startViewTransition({
				update: function() {
					var t = l.defaultView, n = t.navigation && t.navigation.transition, o = l.fonts.status;
					r();
					var s = [];
					if (o === "loaded" && (Ap(l), l.fonts.status === "loading" && s.push(l.fonts.ready)), o = s.length, e !== null) for (var c = e.suspenseyImages, u = 0, d = 0; d < c.length; d++) {
						var f = c[d];
						if (!f.complete) {
							var p = f.getBoundingClientRect();
							if (0 < p.bottom && 0 < p.right && p.top < t.innerHeight && p.left < t.innerWidth) {
								if (u += Xm(f), u > $m) {
									s.length = o;
									break;
								}
								f = new Promise(jp.bind(f)), s.push(f);
							}
						}
					}
					if (0 < s.length) return t = Promise.race([Promise.all(s), new Promise(function(e) {
						return setTimeout(e, 500);
					})]).then(i, i), (n ? Promise.allSettled([n.finished, t]) : t).then(a, a);
					if (i(), n) return n.finished.then(a, a);
					a();
				},
				types: n
			});
			l.__reactViewTransition = u;
			var d = [];
			return u.ready.then(function() {
				for (var e = l.documentElement.getAnimations({ subtree: !0 }), t = 0; t < e.length; t++) {
					var n = e[t], r = n.effect, i = r.pseudoElement;
					if (i != null && i.startsWith("::view-transition")) {
						d.push(n), n = r.getKeyframes();
						for (var a = i = void 0, s = !0, c = 0; c < n.length; c++) {
							var u = n[c], f = u.width;
							if (i === void 0) i = f;
							else if (i !== f) {
								s = !1;
								break;
							}
							if (f = u.height, a === void 0) a = f;
							else if (a !== f) {
								s = !1;
								break;
							}
							delete u.width, delete u.height, u.transform === "none" && delete u.transform;
						}
						s && i !== void 0 && a !== void 0 && (r.setKeyframes(n), s = getComputedStyle(r.target, r.pseudoElement), s.width !== i || s.height !== a) && (s = n[0], s.width = i, s.height = a, s = n[n.length - 1], s.width = i, s.height = a, r.setKeyframes(n));
					}
				}
				o();
			}, function(e) {
				l.__reactViewTransition === u && (l.__reactViewTransition = null);
				try {
					if (typeof e == "object" && e) switch (e.name) {
						case "InvalidStateError": (e.message === "View transition was skipped because document visibility state is hidden." || e.message === "Skipping view transition because document visibility state has become hidden." || e.message === "Skipping view transition because viewport size changed." || e.message === "Transition was aborted because of invalid state") && (e = null);
					}
					e !== null && c(e);
				} finally {
					r(), i(), o();
				}
			}), u.finished.finally(function() {
				for (var e = 0; e < d.length; e++) d[e].cancel();
				l.__reactViewTransition === u && (l.__reactViewTransition = null), s();
			}), u;
		} catch {
			return r(), i(), o(), null;
		}
	}
	function Np(e, t) {
		this._scope = document.documentElement, this._selector = "::view-transition-" + e + "(" + t + ")";
	}
	Np.prototype.animate = function(e, t) {
		return t = typeof t == "number" ? { duration: t } : C({}, t), t.pseudoElement = this._selector, this._scope.animate(e, t);
	}, Np.prototype.getAnimations = function() {
		for (var e = this._scope, t = this._selector, n = e.getAnimations({ subtree: !0 }), r = [], i = 0; i < n.length; i++) {
			var a = n[i].effect;
			a !== null && a.target === e && a.pseudoElement === t && r.push(n[i]);
		}
		return r;
	}, Np.prototype.getComputedStyle = function() {
		return getComputedStyle(this._scope, this._selector);
	};
	function Pp(e) {
		return {
			name: e,
			group: new Np("group", e),
			imagePair: new Np("image-pair", e),
			old: new Np("old", e),
			new: new Np("new", e)
		};
	}
	function Fp(e) {
		this._fragmentFiber = e, this._observers = this._eventListeners = null;
	}
	Fp.prototype.addEventListener = function(e, t, n) {
		var r = null, i = null;
		if (!(n != null && typeof n != "boolean" && (r = n.signal || null, r !== null && r.aborted))) {
			this._eventListeners === null && (this._eventListeners = []);
			var a = this._eventListeners;
			if (Bp(a, e, t, n) === -1) {
				var o = this, s = t;
				n != null && typeof n != "boolean" && !0 === n.once && (s = function(r) {
					o.removeEventListener(e, t, n), typeof t == "function" ? t.call(this, r) : t.handleEvent(r);
				}), r !== null && (i = o.removeEventListener.bind(o, e, t, n), r.addEventListener("abort", i, { once: !0 }), i = r.removeEventListener.bind(r, "abort", i)), r = Rp(n), a.push({
					type: e,
					listener: t,
					optionsOrUseCapture: n,
					attachedListener: s,
					cleanup: i
				}), h(this._fragmentFiber.child, !1, Ip, e, s, r);
			}
			this._eventListeners = a;
		}
	};
	function Ip(e, t, n, r) {
		return b(e).addEventListener(t, n, r), !1;
	}
	Fp.prototype.removeEventListener = function(e, t, n) {
		var r = this._eventListeners;
		if (r !== null && (t = Bp(r, e, t, n), t !== -1)) {
			var i = r[t];
			n = i.attachedListener;
			var a = i.cleanup;
			i = Rp(i.optionsOrUseCapture), h(this._fragmentFiber.child, !1, Lp, e, n, i), r.splice(t, 1), a !== null && a();
		}
	};
	function Lp(e, t, n, r) {
		return b(e).removeEventListener(t, n, r), !1;
	}
	function Rp(e) {
		return e != null && typeof e != "boolean" && (!0 === e.once || e.signal instanceof AbortSignal) ? {
			capture: e.capture,
			passive: e.passive
		} : e;
	}
	function zp(e) {
		return e == null ? "c=0" : typeof e == "boolean" ? "c=" + (e ? "1" : "0") : "c=" + (e.capture ? "1" : "0");
	}
	function Bp(e, t, n, r) {
		if (e.length === 0) return -1;
		r = zp(r);
		for (var i = 0; i < e.length; i++) {
			var a = e[i];
			if (a.type === t && a.listener === n && zp(a.optionsOrUseCapture) === r) return i;
		}
		return -1;
	}
	Fp.prototype.dispatchEvent = function(e) {
		var t = g(this._fragmentFiber);
		if (t === null) return !0;
		t = b(t);
		var n = this._eventListeners;
		if (n !== null && 0 < n.length || !e.bubbles) {
			var r = t.nodeType === 9 ? t.createComment("") : document.createTextNode("");
			if (n) for (var i = 0; i < n.length; i++) {
				var a = n[i];
				r.addEventListener(a.type, a.attachedListener, Rp(a.optionsOrUseCapture));
			}
			if (t.appendChild(r), e = r.dispatchEvent(e), n) for (i = 0; i < n.length; i++) a = n[i], r.removeEventListener(a.type, a.attachedListener, Rp(a.optionsOrUseCapture));
			return t.removeChild(r), e;
		}
		return t.dispatchEvent(e);
	}, Fp.prototype.focus = function(e) {
		h(this._fragmentFiber.child, !0, Vp, e, void 0, void 0);
	};
	function Vp(e, t) {
		return e.tag !== 6 && (e = b(e), pm(e, t));
	}
	Fp.prototype.focusLast = function(e) {
		var t = [];
		h(this._fragmentFiber.child, !0, Hp, t, void 0, void 0);
		for (var n = t.length - 1; 0 <= n && !Vp(t[n], e); n--);
	};
	function Hp(e, t) {
		return t.push(e), !1;
	}
	Fp.prototype.blur = function() {
		var e = g(this._fragmentFiber);
		e !== null && (e = b(e), e = lp(e).activeElement, e !== null && h(this._fragmentFiber.child, !1, Up, e, void 0, void 0));
	};
	function Up(e, t) {
		return e.tag !== 6 && (e = b(e), e === t || e.contains(t) ? (t.blur(), !0) : !1);
	}
	Fp.prototype.observeUsing = function(e) {
		this._observers === null && (this._observers = /* @__PURE__ */ new Set()), this._observers.add(e), h(this._fragmentFiber.child, !1, Wp, e, void 0, void 0);
	};
	function Wp(e, t) {
		return e.tag === 6 || (e = b(e), t.observe(e)), !1;
	}
	Fp.prototype.unobserveUsing = function(e) {
		var t = this._observers;
		if (t !== null && t.has(e)) {
			t.delete(e), h(this._fragmentFiber.child, !1, Gp, e, void 0, void 0);
			for (var n = t = 0; n < Kp.length; n++) {
				var r = Kp[n];
				r.fragmentInstance === this && r.observer === e ? e.unobserve(r.instance) : Kp[t++] = r;
			}
			Kp.length = t;
		}
	};
	function Gp(e, t) {
		return e.tag === 6 || (e = b(e), t.unobserve(e)), !1;
	}
	var Kp = [], qp = !1;
	function Jp(e, t, n) {
		Kp.push({
			fragmentInstance: e,
			observer: t,
			instance: n
		}), qp || (qp = !0, mm(function() {
			qp = !1;
			var e = Kp;
			Kp = [];
			for (var t = 0; t < e.length; t++) {
				var n = e[t];
				n.observer.unobserve(n.instance);
			}
		}));
	}
	Fp.prototype.getClientRects = function() {
		var e = [];
		return h(this._fragmentFiber.child, !1, Yp, e, void 0, void 0), e;
	};
	function Yp(e, t) {
		if (e.tag === 6) {
			e = e.stateNode;
			var n = e.ownerDocument.createRange();
			n.selectNodeContents(e), t.push.apply(t, n.getClientRects());
		} else e = b(e), t.push.apply(t, e.getClientRects());
		return !1;
	}
	Fp.prototype.getRootNode = function(e) {
		var t = g(this._fragmentFiber);
		return t === null ? this : b(t).getRootNode(e);
	}, Fp.prototype.compareDocumentPosition = function(e) {
		var t = g(this._fragmentFiber);
		if (t === null) return Node.DOCUMENT_POSITION_DISCONNECTED;
		var n = [];
		h(this._fragmentFiber.child, !1, Hp, n, void 0, void 0);
		var r = b(t);
		if (n.length === 0) {
			if (n = r, _(this._fragmentFiber)) {
				a: {
					for (t = this._fragmentFiber.return; t !== null;) {
						if (t.tag === 4) {
							t = t.stateNode.containerInfo;
							break a;
						}
						if (t.tag === 3 || t.tag === 5 || t.tag === 27) break;
						t = t.return;
					}
					t = null;
				}
				t != null && (n = t);
			}
			t = this._fragmentFiber;
			var i = r = n.compareDocumentPosition(e);
			return n === e ? i = Node.DOCUMENT_POSITION_CONTAINS : r & Node.DOCUMENT_POSITION_CONTAINED_BY && (n = v(t)[1], n === null ? i = Node.DOCUMENT_POSITION_PRECEDING : (e = b(n).compareDocumentPosition(e), i = e === 0 || e & Node.DOCUMENT_POSITION_FOLLOWING ? Node.DOCUMENT_POSITION_FOLLOWING : Node.DOCUMENT_POSITION_PRECEDING)), i |= Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC;
		}
		t = b(n[0]), i = b(n[n.length - 1]);
		var a = _(this._fragmentFiber) ? t.parentElement : r;
		if (a == null) return Node.DOCUMENT_POSITION_DISCONNECTED;
		r = a.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_CONTAINED_BY, a = a.compareDocumentPosition(i) & Node.DOCUMENT_POSITION_CONTAINED_BY;
		var o = t.compareDocumentPosition(e), s = i.compareDocumentPosition(e), c = o & Node.DOCUMENT_POSITION_CONTAINED_BY || s & Node.DOCUMENT_POSITION_CONTAINED_BY;
		return s = r && a && o & Node.DOCUMENT_POSITION_FOLLOWING && s & Node.DOCUMENT_POSITION_PRECEDING, t = r && t === e || a && i === e || c || s ? Node.DOCUMENT_POSITION_CONTAINED_BY : !r && t === e || !a && i === e ? Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC : o, t & Node.DOCUMENT_POSITION_DISCONNECTED || t & Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC || Xp(t, this._fragmentFiber, n[0], n[n.length - 1], e) ? t : Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC;
	};
	function Xp(e, t, n, r, i) {
		var a = zt(i);
		if (e & Node.DOCUMENT_POSITION_CONTAINED_BY) {
			if (n = !!a) a: {
				for (; a !== null;) {
					if (a.tag === 7 && (a === t || a.alternate === t)) {
						n = !0;
						break a;
					}
					a = a.return;
				}
				n = !1;
			}
			return n;
		}
		if (e & Node.DOCUMENT_POSITION_CONTAINS) {
			if (a === null) return a = i.ownerDocument, i === a || i === a.documentElement || i === a.body;
			a: {
				for (a = t, t = g(t); a !== null;) {
					if (!(a.tag !== 5 && a.tag !== 3 && a.tag !== 27 || a !== t && a.alternate !== t)) {
						a = !0;
						break a;
					}
					a = a.return;
				}
				a = !1;
			}
			return a;
		}
		return e & Node.DOCUMENT_POSITION_PRECEDING ? ((t = !!a) && !(t = a === n) && (t = re(n, a, S), t === null ? t = !1 : (h(t, !0, x, a, n), a = ee, ee = null, t = a !== null)), t) : e & Node.DOCUMENT_POSITION_FOLLOWING ? ((t = !!a) && !(t = a === r) && (t = re(r, a, S), t === null ? t = !1 : (h(t, !0, ne, a, r), a = ee, te = ee = null, t = a !== null)), t) : !1;
	}
	function Zp(e, t) {
		var n = e.ownerDocument.createRange();
		n.selectNodeContents(e), e = n.getBoundingClientRect(), window.scrollTo(window.scrollX + e.left, t ? window.scrollY + e.top : window.scrollY + e.bottom - window.innerHeight);
	}
	Fp.prototype.scrollIntoView = function(e) {
		if (typeof e == "object") throw Error(i(566));
		var t = [];
		h(this._fragmentFiber.child, !1, Hp, t, void 0, void 0);
		var n = !1 !== e;
		if (t.length === 0) {
			var r = v(this._fragmentFiber);
			if (r = n ? r[1] || r[0] || g(this._fragmentFiber) : r[0] || r[1], r === null) return;
			if (r.tag === 6) {
				e = b(r), Zp(e, n);
				return;
			}
			if (r = b(r), r.nodeType !== 9) {
				if (r.nodeType === 11) {
					n = "host" in r ? r.host : null, n !== null && n.scrollIntoView(e);
					return;
				}
				r.scrollIntoView(e);
			}
		}
		for (r = n ? t.length - 1 : 0; r !== (n ? -1 : t.length);) {
			var a = t[r];
			a.tag === 6 ? (a = b(a), Zp(a, n)) : b(a).scrollIntoView(e), r += n ? -1 : 1;
		}
	};
	function Qp(e, t) {
		return e = b(e), $p(e, t), !1;
	}
	function $p(e, t) {
		e.reactFragments ??= /* @__PURE__ */ new Set(), e.reactFragments.add(t);
	}
	function em(e, t) {
		var n = t._eventListeners;
		if (n !== null) for (var r = 0; r < n.length; r++) {
			var i = n[r];
			e.addEventListener(i.type, i.attachedListener, Rp(i.optionsOrUseCapture));
		}
		e.nodeType !== 3 && (n = t._observers, n !== null && n.forEach(function(n) {
			for (var r = 0, i = 0; i < Kp.length; i++) {
				var a = Kp[i];
				(a.fragmentInstance !== t || a.observer !== n || a.instance !== e) && (Kp[r++] = a);
			}
			Kp.length = r, n.observe(e);
		}), $p(e, t));
	}
	function tm(e, t) {
		var n = t._eventListeners;
		if (n !== null) for (var r = 0; r < n.length; r++) {
			var i = n[r];
			e.removeEventListener(i.type, i.attachedListener, Rp(i.optionsOrUseCapture));
		}
		e.nodeType !== 3 && (n = t._observers, n !== null && n.forEach(function(n) {
			typeof n.rootMargin == "string" ? Jp(t, n, e) : n.unobserve(e);
		}), e.reactFragments != null && e.reactFragments.delete(t));
	}
	function nm(e) {
		var t = e.firstChild;
		for (t && t.nodeType === 10 && (t = t.nextSibling); t;) {
			var n = t;
			switch (t = t.nextSibling, n.nodeName) {
				case "HTML":
				case "HEAD":
				case "BODY":
					nm(n), Rt(n);
					continue;
				case "SCRIPT":
				case "STYLE": continue;
				case "LINK": if (n.rel.toLowerCase() === "stylesheet") continue;
			}
			e.removeChild(n);
		}
	}
	function rm(e, t, n, r) {
		for (; e.nodeType === 1;) {
			var i = n;
			if (e.nodeName.toLowerCase() !== t.toLowerCase()) {
				if (!r && (e.nodeName !== "INPUT" || e.type !== "hidden")) break;
			} else if (!r) {
				if (t === "input" && e.type === "hidden") {
					var a = i.name == null ? null : "" + i.name;
					if (i.type === "hidden" && e.getAttribute("name") === a) return e;
				} else return e;
			} else if (!e[It]) switch (t) {
				case "meta":
					if (!e.hasAttribute("itemprop")) break;
					return e;
				case "link":
					if (a = e.getAttribute("rel"), a === "stylesheet" && e.hasAttribute("data-precedence") || a !== i.rel || e.getAttribute("href") !== (i.href == null || i.href === "" ? null : i.href) || e.getAttribute("crossorigin") !== (i.crossOrigin == null ? null : i.crossOrigin) || e.getAttribute("title") !== (i.title == null ? null : i.title)) break;
					return e;
				case "style":
					if (e.hasAttribute("data-precedence")) break;
					return e;
				case "script":
					if (a = e.getAttribute("src"), (a !== (i.src == null ? null : i.src) || e.getAttribute("type") !== (i.type == null ? null : i.type) || e.getAttribute("crossorigin") !== (i.crossOrigin == null ? null : i.crossOrigin)) && a && e.hasAttribute("async") && !e.hasAttribute("itemprop")) break;
					return e;
				default: return e;
			}
			if (e = lm(e.nextSibling), e === null) break;
		}
		return null;
	}
	function im(e, t, n) {
		if (t === "") return null;
		for (; e.nodeType !== 3;) if ((e.nodeType !== 1 || e.nodeName !== "INPUT" || e.type !== "hidden") && !n || (e = lm(e.nextSibling), e === null)) return null;
		return e;
	}
	function am(e, t) {
		for (; e.nodeType !== 8;) if ((e.nodeType !== 1 || e.nodeName !== "INPUT" || e.type !== "hidden") && !t || (e = lm(e.nextSibling), e === null)) return null;
		return e;
	}
	function om(e) {
		return e.data === "$?" || e.data === "$~";
	}
	function sm(e) {
		return e.data === "$!" || e.data === "$?" && e.ownerDocument.readyState !== "loading";
	}
	function cm(e, t) {
		var n = e.ownerDocument;
		if (e.data === "$~") e._reactRetry = t;
		else if (e.data !== "$?" || n.readyState !== "loading") t();
		else {
			var r = function() {
				t(), n.removeEventListener("DOMContentLoaded", r);
			};
			n.addEventListener("DOMContentLoaded", r), e._reactRetry = r;
		}
	}
	function lm(e) {
		for (; e != null; e = e.nextSibling) {
			var t = e.nodeType;
			if (t === 1 || t === 3) break;
			if (t === 8) {
				if (t = e.data, t === "$" || t === "$!" || t === "$?" || t === "$~" || t === "&" || t === "F!" || t === "F") break;
				if (t === "/$" || t === "/&") return null;
			}
		}
		return e;
	}
	var um = null;
	function dm(e) {
		e = e.nextSibling;
		for (var t = 0; e;) {
			if (e.nodeType === 8) {
				var n = e.data;
				if (n === "/$" || n === "/&") {
					if (t === 0) return lm(e.nextSibling);
					t--;
				} else n !== "$" && n !== "$!" && n !== "$?" && n !== "$~" && n !== "&" || t++;
			}
			e = e.nextSibling;
		}
		return null;
	}
	function fm(e) {
		e = e.previousSibling;
		for (var t = 0; e;) {
			if (e.nodeType === 8) {
				var n = e.data;
				if (n === "$" || n === "$!" || n === "$?" || n === "$~" || n === "&") {
					if (t === 0) return e;
					t--;
				} else n !== "/$" && n !== "/&" || t++;
			}
			e = e.previousSibling;
		}
		return null;
	}
	function pm(e, t) {
		function n() {
			r = !0;
		}
		if (e.ownerDocument.activeElement === e) return !0;
		var r = !1;
		try {
			e.ownerDocument.addEventListener("focus", n, !0), (e.focus || HTMLElement.prototype.focus).call(e, t);
		} finally {
			e.ownerDocument.removeEventListener("focus", n, !0);
		}
		return r;
	}
	function mm(e) {
		yp(function() {
			yp(function(t) {
				return e(t);
			});
		});
	}
	function hm(e, t, n) {
		switch (t = lp(n), e) {
			case "html":
				if (e = t.documentElement, !e) throw Error(i(452));
				return e;
			case "head":
				if (e = t.head, !e) throw Error(i(453));
				return e;
			case "body":
				if (e = t.body, !e) throw Error(i(454));
				return e;
			default: throw Error(i(451));
		}
	}
	function gm(e, t, n) {
		for (var r in n) {
			var i = n[r];
			n.hasOwnProperty(r) && i != null && $(e, t, r, null, rp, i);
		}
		n.dangerouslySetInnerHTML != null && (e.textContent = ""), e.onclick === bn && (e.onclick = null), Rt(e);
	}
	function _m(e) {
		for (var t = e.attributes; t.length;) e.removeAttributeNode(t[0]);
		Rt(e);
	}
	var vm = /* @__PURE__ */ new Map(), ym = /* @__PURE__ */ new Set();
	function bm(e) {
		if (typeof e.getRootNode == "function") {
			var t = e.getRootNode();
			if (t.nodeType === 9 || t.nodeType === 11) return t;
		}
		return e.nodeType === 9 ? e : e.ownerDocument;
	}
	var xm = D.d;
	D.d = {
		f: Sm,
		r: Cm,
		D: Em,
		C: Dm,
		L: Om,
		m: km,
		X: jm,
		S: Am,
		M: Mm
	};
	function Sm() {
		var e = xm.f(), t = zd();
		return e || t;
	}
	function Cm(e) {
		var t = Bt(e);
		t !== null && t.tag === 5 && t.type === "form" ? tc(t) : xm.r(e);
	}
	var wm = typeof document > "u" ? null : document;
	function Tm(e, t, n) {
		var r = wm;
		if (r && typeof t == "string" && t) {
			var i = sn(t);
			i = "link[rel=\"" + e + "\"][href=\"" + i + "\"]", typeof n == "string" && (i += "[crossorigin=\"" + n + "\"]"), ym.has(i) || (ym.add(i), e = {
				rel: e,
				crossOrigin: n,
				href: t
			}, r.querySelector(i) === null && (t = r.createElement("link"), np(t, "link", e), Ut(t), r.head.appendChild(t)));
		}
	}
	function Em(e) {
		xm.D(e), Tm("dns-prefetch", e, null);
	}
	function Dm(e, t) {
		xm.C(e, t), Tm("preconnect", e, t);
	}
	function Om(e, t, n) {
		xm.L(e, t, n);
		var r = wm;
		if (r && e && t) {
			var i = "link[rel=\"preload\"][as=\"" + sn(t) + "\"]";
			t === "image" && n && n.imageSrcSet ? (i += "[imagesrcset=\"" + sn(n.imageSrcSet) + "\"]", typeof n.imageSizes == "string" && (i += "[imagesizes=\"" + sn(n.imageSizes) + "\"]")) : i += "[href=\"" + sn(e) + "\"]";
			var a = i;
			switch (t) {
				case "style":
					a = Pm(e);
					break;
				case "script": a = Rm(e);
			}
			if (!(vm.has(a) || (e = C({
				rel: "preload",
				href: t === "image" && n && n.imageSrcSet ? void 0 : e,
				as: t
			}, n), vm.set(a, e), r.querySelector(i) !== null || t === "style" && r.querySelector(Fm(a)) || t === "script" && r.querySelector(zm(a))))) {
				var o = r.createElement("link");
				np(o, "link", e), t === "style" && (o[Lt] = !0, o.onload = o.onerror = function() {
					Wt(o);
				}), Ut(o), r.head.appendChild(o);
			}
		}
	}
	function km(e, t) {
		xm.m(e, t);
		var n = wm;
		if (n && e) {
			var r = t && typeof t.as == "string" ? t.as : "script", i = "link[rel=\"modulepreload\"][as=\"" + sn(r) + "\"][href=\"" + sn(e) + "\"]", a = i;
			switch (r) {
				case "audioworklet":
				case "paintworklet":
				case "serviceworker":
				case "sharedworker":
				case "worker":
				case "script": a = Rm(e);
			}
			if (!vm.has(a) && (e = C({
				rel: "modulepreload",
				href: e
			}, t), vm.set(a, e), n.querySelector(i) === null)) {
				switch (r) {
					case "audioworklet":
					case "paintworklet":
					case "serviceworker":
					case "sharedworker":
					case "worker":
					case "script": if (n.querySelector(zm(a))) return;
				}
				r = n.createElement("link"), np(r, "link", e), Ut(r), n.head.appendChild(r);
			}
		}
	}
	function Am(e, t, n) {
		xm.S(e, t, n);
		var r = wm;
		if (r && e) {
			var i = Ht(r).hoistableStyles, a = Pm(e);
			t ||= "default";
			var o = i.get(a);
			if (!o) {
				var s = {
					loading: 0,
					preload: null
				};
				if (o = r.querySelector(Fm(a))) s.loading = 5;
				else {
					e = C({
						rel: "stylesheet",
						href: e,
						"data-precedence": t
					}, n), (n = vm.get(a)) && Hm(e, n);
					var c = o = r.createElement("link");
					Ut(c), np(c, "link", e), c._p = new Promise(function(e, t) {
						c.onload = e, c.onerror = t;
					}), c.addEventListener("load", function() {
						s.loading |= 1;
					}), c.addEventListener("error", function() {
						s.loading |= 2;
					}), s.loading |= 4, Vm(o, t, r);
				}
				o = {
					type: "stylesheet",
					instance: o,
					count: 1,
					state: s
				}, i.set(a, o);
			}
		}
	}
	function jm(e, t) {
		xm.X(e, t);
		var n = wm;
		if (n && e) {
			var r = Ht(n).hoistableScripts, i = Rm(e), a = r.get(i);
			a || (a = n.querySelector(zm(i)), a || (e = C({
				src: e,
				async: !0
			}, t), (t = vm.get(i)) && Um(e, t), a = n.createElement("script"), Ut(a), np(a, "link", e), n.head.appendChild(a)), a = {
				type: "script",
				instance: a,
				count: 1,
				state: null
			}, r.set(i, a));
		}
	}
	function Mm(e, t) {
		xm.M(e, t);
		var n = wm;
		if (n && e) {
			var r = Ht(n).hoistableScripts, i = Rm(e), a = r.get(i);
			a || (a = n.querySelector(zm(i)), a || (e = C({
				src: e,
				async: !0,
				type: "module"
			}, t), (t = vm.get(i)) && Um(e, t), a = n.createElement("script"), Ut(a), np(a, "link", e), n.head.appendChild(a)), a = {
				type: "script",
				instance: a,
				count: 1,
				state: null
			}, r.set(i, a));
		}
	}
	function Nm(e, t, n, r) {
		var a = (a = Me.current) ? bm(a) : null;
		if (!a) throw Error(i(446));
		switch (e) {
			case "meta":
			case "title": return null;
			case "style": return typeof n.precedence == "string" && typeof n.href == "string" ? (n = Pm(n.href), t = Ht(a).hoistableStyles, r = t.get(n), r || (r = {
				type: "style",
				instance: null,
				count: 0,
				state: null
			}, t.set(n, r)), r) : {
				type: "void",
				instance: null,
				count: 0,
				state: null
			};
			case "link":
				if (n.rel === "stylesheet" && typeof n.href == "string" && typeof n.precedence == "string") {
					e = Pm(n.href);
					var o = Ht(a).hoistableStyles, s = o.get(e);
					if (s || (a = a.ownerDocument || a, s = {
						type: "stylesheet",
						instance: null,
						count: 0,
						state: {
							loading: 0,
							preload: null
						}
					}, o.set(e, s), (o = a.querySelector(Fm(e))) ? o._p || (s.instance = o, s.state.loading = 5) : (o = vm.get(e), o || (o = {
						rel: "preload",
						as: "style",
						href: n.href,
						crossOrigin: n.crossOrigin,
						integrity: n.integrity,
						media: n.media,
						hrefLang: n.hrefLang,
						referrerPolicy: n.referrerPolicy
					}, vm.set(e, o)), Lm(a, e, o, s.state))), t && r === null) throw Error(i(528, ""));
					return s;
				}
				if (t && r !== null) throw Error(i(529, ""));
				return null;
			case "script": return t = n.async, n = n.src, typeof n == "string" && t && typeof t != "function" && typeof t != "symbol" ? (n = Rm(n), t = Ht(a).hoistableScripts, r = t.get(n), r || (r = {
				type: "script",
				instance: null,
				count: 0,
				state: null
			}, t.set(n, r)), r) : {
				type: "void",
				instance: null,
				count: 0,
				state: null
			};
			default: throw Error(i(444, e));
		}
	}
	function Pm(e) {
		return "href=\"" + sn(e) + "\"";
	}
	function Fm(e) {
		return "link[rel=\"stylesheet\"][" + e + "]";
	}
	function Im(e) {
		return C({}, e, {
			"data-precedence": e.precedence,
			precedence: null
		});
	}
	function Lm(e, t, n, r) {
		if (t = e.querySelector("link[rel=\"preload\"][as=\"style\"][" + t + "]")) {
			if (!0 !== t[Lt]) {
				r.loading = 1;
				return;
			}
		} else t = e.createElement("link"), t[Lt] = !0, t.onload = t.onerror = Wt.bind(null, t), np(t, "link", n), Ut(t), e.head.appendChild(t);
		r.preload = t, t.addEventListener("load", function() {
			return r.loading |= 1;
		}), t.addEventListener("error", function() {
			return r.loading |= 2;
		});
	}
	function Rm(e) {
		return "[src=\"" + sn(e) + "\"]";
	}
	function zm(e) {
		return "script[async]" + e;
	}
	function Bm(e, t, n) {
		if (t.count++, t.instance === null) switch (t.type) {
			case "style":
				var r = e.querySelector("style[data-href~=\"" + sn(n.href) + "\"]");
				if (r) return t.instance = r, Ut(r), r;
				var a = C({}, n, {
					"data-href": n.href,
					"data-precedence": n.precedence,
					href: null,
					precedence: null
				});
				return r = (e.ownerDocument || e).createElement("style"), Ut(r), np(r, "style", a), Vm(r, n.precedence, e), t.instance = r;
			case "stylesheet":
				a = Pm(n.href);
				var o = e.querySelector(Fm(a));
				if (o) return t.state.loading |= 4, t.instance = o, Ut(o), o;
				r = Im(n), (a = vm.get(a)) && Hm(r, a), o = (e.ownerDocument || e).createElement("link"), Ut(o);
				var s = o;
				return s._p = new Promise(function(e, t) {
					s.onload = e, s.onerror = t;
				}), np(o, "link", r), t.state.loading |= 4, Vm(o, n.precedence, e), t.instance = o;
			case "script": return o = Rm(n.src), (a = e.querySelector(zm(o))) ? (t.instance = a, Ut(a), a) : (r = n, (a = vm.get(o)) && (r = C({}, n), Um(r, a)), e = e.ownerDocument || e, a = e.createElement("script"), Ut(a), np(a, "link", r), e.head.appendChild(a), t.instance = a);
			case "void": return null;
			default: throw Error(i(443, t.type));
		}
		else t.type === "stylesheet" && !(t.state.loading & 4) && (r = t.instance, t.state.loading |= 4, Vm(r, n.precedence, e));
		return t.instance;
	}
	function Vm(e, t, n) {
		for (var r = n.querySelectorAll("link[rel=\"stylesheet\"][data-precedence],style[data-precedence]"), i = r.length ? r[r.length - 1] : null, a = i, o = 0; o < r.length; o++) {
			var s = r[o];
			if (s.dataset.precedence === t) a = s;
			else if (a !== i) break;
		}
		a ? a.parentNode.insertBefore(e, a.nextSibling) : (t = n.nodeType === 9 ? n.head : n, t.insertBefore(e, t.firstChild));
	}
	function Hm(e, t) {
		e.crossOrigin ??= t.crossOrigin, e.referrerPolicy ??= t.referrerPolicy, e.title ??= t.title;
	}
	function Um(e, t) {
		e.crossOrigin ??= t.crossOrigin, e.referrerPolicy ??= t.referrerPolicy, e.integrity ??= t.integrity;
	}
	var Wm = null;
	function Gm(e, t, n) {
		if (Wm === null) {
			var r = /* @__PURE__ */ new Map(), i = Wm = /* @__PURE__ */ new Map();
			i.set(n, r);
		} else i = Wm, r = i.get(n), r || (r = /* @__PURE__ */ new Map(), i.set(n, r));
		if (r.has(e)) return r;
		for (r.set(e, null), n = n.getElementsByTagName(e), i = 0; i < n.length; i++) {
			var a = n[i];
			if (!(a[It] || a[A] || e === "link" && a.getAttribute("rel") === "stylesheet") && a.namespaceURI !== "http://www.w3.org/2000/svg") {
				var o = a.getAttribute(t) || "";
				o = e + o;
				var s = r.get(o);
				s ? s.push(a) : r.set(o, [a]);
			}
		}
		return r;
	}
	function Km(e, t, n) {
		e = e.ownerDocument || e, e.head.insertBefore(n, t === "title" ? e.querySelector("head > title") : null);
	}
	function qm(e, t, n) {
		if (n === 1 || t.itemProp != null) return !1;
		switch (e) {
			case "meta":
			case "title": return !0;
			case "style":
				if (typeof t.precedence != "string" || typeof t.href != "string" || t.href === "") break;
				return !0;
			case "link":
				if (typeof t.rel != "string" || typeof t.href != "string" || t.href === "" || t.onLoad || t.onError) break;
				switch (t.rel) {
					case "stylesheet": return e = t.disabled, typeof t.precedence == "string" && e == null;
					default: return !0;
				}
			case "script": if (t.async && typeof t.async != "function" && typeof t.async != "symbol" && !t.onLoad && !t.onError && t.src && typeof t.src == "string") return !0;
		}
		return !1;
	}
	function Jm(e, t) {
		return e === "img" && t.src != null && t.src !== "" && t.onLoad == null && t.loading !== "lazy";
	}
	function Ym(e) {
		return !(e.type === "stylesheet" && !(e.state.loading & 3));
	}
	function Xm(e) {
		return (e.width || 100) * (e.height || 100) * (typeof devicePixelRatio == "number" ? devicePixelRatio : 1) * .25;
	}
	function Zm(e, t) {
		typeof t.decode == "function" && (e.imgCount++, t.complete || (e.imgBytes += Xm(t), e.suspenseyImages.push(t)), e = rh.bind(e), t.decode().then(e, e));
	}
	function Qm(e, t, n, r) {
		if (n.type === "stylesheet" && (typeof r.media != "string" || !1 !== matchMedia(r.media).matches) && !(n.state.loading & 4)) {
			if (n.instance === null) {
				var i = Pm(r.href), a = t.querySelector(Fm(i));
				if (a) {
					t = a._p, typeof t == "object" && t && typeof t.then == "function" && (e.count++, e = nh.bind(e), t.then(e, e)), n.state.loading |= 4, n.instance = a, Ut(a);
					return;
				}
				a = t.ownerDocument || t, r = Im(r), (i = vm.get(i)) && Hm(r, i), a = a.createElement("link"), Ut(a);
				var o = a;
				o._p = new Promise(function(e, t) {
					o.onload = e, o.onerror = t;
				}), np(a, "link", r), n.instance = a;
			}
			e.stylesheets === null && (e.stylesheets = /* @__PURE__ */ new Map()), e.stylesheets.set(n, t), (t = n.state.preload) && !(n.state.loading & 3) && (e.count++, n = nh.bind(e), t.addEventListener("load", n), t.addEventListener("error", n));
		}
	}
	var $m = 0;
	function eh(e, t) {
		return e.stylesheets && e.count === 0 && ah(e, e.stylesheets), 0 < e.count || 0 < e.imgCount ? function(n) {
			var r = setTimeout(function() {
				if (e.stylesheets && ah(e, e.stylesheets), e.unsuspend) {
					var t = e.unsuspend;
					e.unsuspend = null, t();
				}
			}, 6e4 + t);
			0 < e.imgBytes && $m === 0 && ($m = 62500 * op());
			var i = setTimeout(function() {
				if (e.waitingForImages = !1, e.count === 0 && (e.stylesheets && ah(e, e.stylesheets), e.unsuspend)) {
					var t = e.unsuspend;
					e.unsuspend = null, t();
				}
			}, (e.imgBytes > $m ? 50 : 800) + t);
			return e.unsuspend = n, function() {
				e.unsuspend = null, clearTimeout(r), clearTimeout(i);
			};
		} : null;
	}
	function th(e) {
		if (e.count === 0 && (e.imgCount === 0 || !e.waitingForImages)) {
			if (e.stylesheets) ah(e, e.stylesheets);
			else if (e.unsuspend) {
				var t = e.unsuspend;
				e.unsuspend = null, t();
			}
		}
	}
	function nh() {
		this.count--, th(this);
	}
	function rh() {
		this.imgCount--, th(this);
	}
	var ih = null;
	function ah(e, t) {
		e.stylesheets = null, e.unsuspend !== null && (e.count++, ih = /* @__PURE__ */ new Map(), t.forEach(oh, e), ih = null, nh.call(e));
	}
	function oh(e, t) {
		if (!(t.state.loading & 4)) {
			var n = ih.get(e);
			if (n) var r = n.get(null);
			else {
				n = /* @__PURE__ */ new Map(), ih.set(e, n);
				for (var i = e.querySelectorAll("link[data-precedence],style[data-precedence]"), a = 0; a < i.length; a++) {
					var o = i[a];
					(o.nodeName === "LINK" || o.getAttribute("media") !== "not all") && (n.set(o.dataset.precedence, o), r = o);
				}
				r && n.set(null, r);
			}
			i = t.instance, o = i.getAttribute("data-precedence"), a = n.get(o) || r, a === r && n.set(null, i), n.set(o, i), this.count++, r = nh.bind(this), i.addEventListener("load", r), i.addEventListener("error", r), a ? a.parentNode.insertBefore(i, a.nextSibling) : (e = e.nodeType === 9 ? e.head : e, e.insertBefore(i, e.firstChild)), t.state.loading |= 4;
		}
	}
	var sh = {
		$$typeof: ue,
		Provider: null,
		Consumer: null,
		_currentValue: Te,
		_currentValue2: Te,
		_threadCount: 0
	};
	function ch(e, t, n, r, i, a, o, s, c) {
		this.tag = 1, this.containerInfo = e, this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.next = this.pendingContext = this.context = this.cancelPendingCommit = null, this.callbackPriority = 0, this.expirationTimes = xt(-1), this.entangledLanes = this.shellSuspendCounter = this.errorRecoveryDisabledLanes = this.expiredLanes = this.warmLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = xt(0), this.hiddenUpdates = xt(null), this.identifierPrefix = r, this.onUncaughtError = i, this.onCaughtError = a, this.onRecoverableError = o, this.pooledCache = null, this.pooledCacheLanes = 0, this.formState = c, this.transitionTypes = null, this.incompleteTransitions = /* @__PURE__ */ new Map();
	}
	function lh(e, t, n, r, i, a, o, s, c, l, u, d) {
		return e = new ch(e, t, n, o, c, l, u, d, s), t = 1, !0 === a && (t |= 24), a = Ai(3, null, null, t), e.current = a, a.stateNode = e, t = Aa(), t.refCount++, e.pooledCache = t, t.refCount++, a.memoizedState = {
			element: r,
			isDehydrated: n,
			cache: t
		}, po(a), e;
	}
	function uh(e) {
		return e ? (e = Oi, e) : Oi;
	}
	function dh(e, t, n, r, i, a) {
		i = uh(i), r.context === null ? r.context = i : r.pendingContext = i, r = ho(t), r.payload = { element: n }, a = a === void 0 ? null : a, a !== null && (r.callback = a), n = go(e, r, t), n !== null && (Pd(n, e, t), _o(n, e, t));
	}
	function fh(e, t) {
		if (e = e.memoizedState, e !== null && e.dehydrated !== null) {
			var n = e.retryLane;
			e.retryLane = n !== 0 && n < t ? n : t;
		}
	}
	function ph(e, t) {
		fh(e, t), (e = e.alternate) && fh(e, t);
	}
	function mh(e) {
		if (e.tag === 13 || e.tag === 31) {
			var t = Ti(e, 67108864);
			t !== null && Pd(t, e, 67108864), ph(e, 67108864);
		}
	}
	function hh(e) {
		if (e.tag === 13 || e.tag === 31) {
			var t = jd();
			t = Et(t);
			var n = Ti(e, t);
			n !== null && Pd(n, e, t), ph(e, t);
		}
	}
	var gh = !0;
	function _h(e, t, n, r) {
		var i = E.T;
		E.T = null;
		var a = D.p;
		try {
			D.p = 2, yh(e, t, n, r);
		} finally {
			D.p = a, E.T = i;
		}
	}
	function vh(e, t, n, r) {
		var i = E.T;
		E.T = null;
		var a = D.p;
		try {
			D.p = 8, yh(e, t, n, r);
		} finally {
			D.p = a, E.T = i;
		}
	}
	function yh(e, t, n, r) {
		if (gh) {
			var i = bh(r);
			if (i === null) Kf(e, t, r, xh, n), Mh(e, r);
			else if (Ph(i, e, t, n, r)) r.stopPropagation();
			else if (Mh(e, r), t & 4 && -1 < jh.indexOf(e)) {
				for (; i !== null;) {
					var a = Bt(i);
					if (a !== null) switch (a.tag) {
						case 3:
							if (a = a.stateNode, a.current.memoizedState.isDehydrated) {
								var o = ht(a.pendingLanes);
								if (o !== 0) {
									var s = a;
									for (s.pendingLanes |= 2, s.entangledLanes |= 2; o;) {
										var c = 1 << 31 - ct(o);
										s.entanglements[1] |= c, o &= ~c;
									}
									Ef(a), !(K & 6) && (gd = Xe() + 500, Df(0, !1));
								}
							}
							break;
						case 31:
						case 13: s = Ti(a, 2), s !== null && Pd(s, a, 2), zd(), ph(a, 2);
					}
					if (a = bh(r), a === null && Kf(e, t, r, xh, n), a === i) break;
					i = a;
				}
				i !== null && r.stopPropagation();
			} else Kf(e, t, r, null, n);
		}
	}
	function bh(e) {
		return e = Sn(e), Sh(e);
	}
	var xh = null;
	function Sh(e) {
		if (xh = null, e = zt(e), e !== null) {
			var t = o(e);
			if (t === null) e = null;
			else {
				var n = t.tag;
				if (n === 13) {
					if (e = s(t), e !== null) return e;
					e = null;
				} else if (n === 31) {
					if (e = c(t), e !== null) return e;
					e = null;
				} else if (n === 3) {
					if (t.stateNode.current.memoizedState.isDehydrated) return t.tag === 3 ? t.stateNode.containerInfo : null;
					e = null;
				} else t !== e && (e = null);
			}
		}
		return xh = e, null;
	}
	function Ch(e) {
		switch (e) {
			case "beforetoggle":
			case "cancel":
			case "click":
			case "close":
			case "contextmenu":
			case "copy":
			case "cut":
			case "auxclick":
			case "dblclick":
			case "dragend":
			case "dragstart":
			case "drop":
			case "focusin":
			case "focusout":
			case "input":
			case "invalid":
			case "keydown":
			case "keypress":
			case "keyup":
			case "mousedown":
			case "mouseup":
			case "paste":
			case "pause":
			case "play":
			case "pointercancel":
			case "pointerdown":
			case "pointerup":
			case "ratechange":
			case "reset":
			case "seeked":
			case "submit":
			case "toggle":
			case "touchcancel":
			case "touchend":
			case "touchstart":
			case "volumechange":
			case "change":
			case "selectionchange":
			case "textInput":
			case "compositionstart":
			case "compositionend":
			case "compositionupdate":
			case "beforeblur":
			case "afterblur":
			case "beforeinput":
			case "blur":
			case "fullscreenchange":
			case "fullscreenerror":
			case "focus":
			case "hashchange":
			case "popstate":
			case "select":
			case "selectstart": return 2;
			case "drag":
			case "dragenter":
			case "dragexit":
			case "dragleave":
			case "dragover":
			case "mousemove":
			case "mouseout":
			case "mouseover":
			case "pointermove":
			case "pointerout":
			case "pointerover":
			case "resize":
			case "scroll":
			case "touchmove":
			case "wheel":
			case "mouseenter":
			case "mouseleave":
			case "pointerenter":
			case "pointerleave": return 8;
			case "message": switch (Ze()) {
				case Qe: return 2;
				case $e: return 8;
				case et:
				case tt: return 32;
				case nt: return 268435456;
				default: return 32;
			}
			default: return 32;
		}
	}
	var wh = !1, Th = null, Eh = null, Dh = null, Oh = /* @__PURE__ */ new Map(), kh = /* @__PURE__ */ new Map(), Ah = [], jh = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(" ");
	function Mh(e, t) {
		switch (e) {
			case "focusin":
			case "focusout":
				Th = null;
				break;
			case "dragenter":
			case "dragleave":
				Eh = null;
				break;
			case "mouseover":
			case "mouseout":
				Dh = null;
				break;
			case "pointerover":
			case "pointerout":
				Oh.delete(t.pointerId);
				break;
			case "gotpointercapture":
			case "lostpointercapture": kh.delete(t.pointerId);
		}
	}
	function Nh(e, t, n, r, i, a) {
		return e === null || e.nativeEvent !== a ? (e = {
			blockedOn: t,
			domEventName: n,
			eventSystemFlags: r,
			nativeEvent: a,
			targetContainers: [i]
		}, t !== null && (t = Bt(t), t !== null && mh(t)), e) : (e.eventSystemFlags |= r, t = e.targetContainers, i !== null && t.indexOf(i) === -1 && t.push(i), e);
	}
	function Ph(e, t, n, r, i) {
		switch (t) {
			case "focusin": return Th = Nh(Th, e, t, n, r, i), !0;
			case "dragenter": return Eh = Nh(Eh, e, t, n, r, i), !0;
			case "mouseover": return Dh = Nh(Dh, e, t, n, r, i), !0;
			case "pointerover":
				var a = i.pointerId;
				return Oh.set(a, Nh(Oh.get(a) || null, e, t, n, r, i)), !0;
			case "gotpointercapture": return a = i.pointerId, kh.set(a, Nh(kh.get(a) || null, e, t, n, r, i)), !0;
		}
		return !1;
	}
	function Fh(e) {
		var t = zt(e.target);
		if (t !== null) {
			var n = o(t);
			if (n !== null) {
				if (t = n.tag, t === 13) {
					if (t = s(n), t !== null) {
						e.blockedOn = t, kt(e.priority, function() {
							hh(n);
						});
						return;
					}
				} else if (t === 31) {
					if (t = c(n), t !== null) {
						e.blockedOn = t, kt(e.priority, function() {
							hh(n);
						});
						return;
					}
				} else if (t === 3 && n.stateNode.current.memoizedState.isDehydrated) {
					e.blockedOn = n.tag === 3 ? n.stateNode.containerInfo : null;
					return;
				}
			}
		}
		e.blockedOn = null;
	}
	function Ih(e) {
		if (e.blockedOn !== null) return !1;
		for (var t = e.targetContainers; 0 < t.length;) {
			var n = bh(e.nativeEvent);
			if (n === null) {
				n = e.nativeEvent;
				var r = new n.constructor(n.type, n);
				xn = r, n.target.dispatchEvent(r), xn = null;
			} else return t = Bt(n), t !== null && mh(t), e.blockedOn = n, !1;
			t.shift();
		}
		return !0;
	}
	function Lh(e, t, n) {
		Ih(e) && n.delete(t);
	}
	function Rh() {
		wh = !1, Th !== null && Ih(Th) && (Th = null), Eh !== null && Ih(Eh) && (Eh = null), Dh !== null && Ih(Dh) && (Dh = null), Oh.forEach(Lh), kh.forEach(Lh);
	}
	function zh(e, n) {
		e.blockedOn === n && (e.blockedOn = null, wh || (wh = !0, t.unstable_scheduleCallback(t.unstable_NormalPriority, Rh)));
	}
	var Bh = null;
	function Vh(e) {
		Bh !== e && (Bh = e, t.unstable_scheduleCallback(t.unstable_NormalPriority, function() {
			Bh === e && (Bh = null);
			for (var t = 0; t < e.length; t += 3) {
				var n = e[t], r = e[t + 1], i = e[t + 2];
				if (typeof r != "function") {
					if (Sh(r || n) === null) continue;
					break;
				}
				var a = Bt(n);
				a !== null && (e.splice(t, 3), t -= 3, $s(a, {
					pending: !0,
					data: i,
					method: n.method,
					action: r
				}, r, i));
			}
		}));
	}
	function Hh(e) {
		function t(t) {
			return zh(t, e);
		}
		Th !== null && zh(Th, e), Eh !== null && zh(Eh, e), Dh !== null && zh(Dh, e), Oh.forEach(t), kh.forEach(t);
		for (var n = 0; n < Ah.length; n++) {
			var r = Ah[n];
			r.blockedOn === e && (r.blockedOn = null);
		}
		for (; 0 < Ah.length && (n = Ah[0], n.blockedOn === null);) Fh(n), n.blockedOn === null && Ah.shift();
		if (n = (e.ownerDocument || e).$$reactFormReplay, n != null) for (r = 0; r < n.length; r += 3) {
			var i = n[r], a = n[r + 1], o = i[jt] || null;
			if (typeof a == "function") o || Vh(n);
			else if (o) {
				var s = null;
				if (a && a.hasAttribute("formAction")) {
					if (i = a, o = a[jt] || null) s = o.formAction;
					else if (Sh(i) !== null) continue;
				} else s = o.action;
				typeof s == "function" ? n[r + 1] = s : (n.splice(r, 3), r -= 3), Vh(n);
			}
		}
	}
	function Uh() {
		function e(e) {
			e.canIntercept && e.info === "react-transition" && e.intercept({
				handler: function() {
					return new Promise(function(e) {
						return i = e;
					});
				},
				focusReset: "manual",
				scroll: "manual"
			});
		}
		function t() {
			i !== null && (i(), i = null), r || setTimeout(n, 20);
		}
		function n() {
			if (!r && !navigation.transition) {
				var e = navigation.currentEntry;
				e && e.url != null && navigation.navigate(e.url, {
					state: e.getState(),
					info: "react-transition",
					history: "replace"
				});
			}
		}
		if (typeof navigation == "object") {
			var r = !1, i = null;
			return navigation.addEventListener("navigate", e), navigation.addEventListener("navigatesuccess", t), navigation.addEventListener("navigateerror", t), setTimeout(n, 100), function() {
				r = !0, navigation.removeEventListener("navigate", e), navigation.removeEventListener("navigatesuccess", t), navigation.removeEventListener("navigateerror", t), i !== null && (i(), i = null);
			};
		}
	}
	function Wh(e) {
		this._internalRoot = e;
	}
	Gh.prototype.render = Wh.prototype.render = function(e) {
		var t = this._internalRoot;
		if (t === null) throw Error(i(409));
		var n = t.current;
		dh(n, jd(), e, t, null, null);
	}, Gh.prototype.unmount = Wh.prototype.unmount = function() {
		var e = this._internalRoot;
		if (e !== null) {
			this._internalRoot = null;
			var t = e.containerInfo;
			dh(e.current, 2, null, e, null, null), zd(), t[j] = null;
		}
	};
	function Gh(e) {
		this._internalRoot = e;
	}
	Gh.prototype.unstable_scheduleHydration = function(e) {
		if (e) {
			var t = Ot();
			e = {
				blockedOn: null,
				target: e,
				priority: t
			};
			for (var n = 0; n < Ah.length && t !== 0 && t < Ah[n].priority; n++);
			Ah.splice(n, 0, e), n === 0 && Fh(e);
		}
	};
	var Kh = n.version;
	if (Kh !== "19.3.1") throw Error(i(527, Kh, "19.3.1"));
	D.findDOMNode = function(e) {
		var t = e._reactInternals;
		if (t === void 0) throw typeof e.render == "function" ? Error(i(188)) : (e = Object.keys(e).join(","), Error(i(268, e)));
		return e = d(t), e = e === null ? null : p(e), e = e === null ? null : e.stateNode, e;
	};
	var qh = {
		bundleType: 0,
		version: "19.3.1",
		rendererPackageName: "react-dom",
		currentDispatcherRef: E,
		reconcilerVersion: "19.3.1"
	};
	if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
		var Jh = __REACT_DEVTOOLS_GLOBAL_HOOK__;
		if (!Jh.isDisabled && Jh.supportsFiber) try {
			at = Jh.inject(qh), ot = Jh;
		} catch {}
	}
	e.createRoot = function(e, t) {
		if (!a(e)) throw Error(i(299));
		var n = !1, r = "", o = Sc, s = Cc, c = wc;
		return t != null && (!0 === t.unstable_strictMode && (n = !0), t.identifierPrefix !== void 0 && (r = t.identifierPrefix), t.onUncaughtError !== void 0 && (o = t.onUncaughtError), t.onCaughtError !== void 0 && (s = t.onCaughtError), t.onRecoverableError !== void 0 && (c = t.onRecoverableError)), t = lh(e, 1, !1, null, null, n, r, null, o, s, c, Uh), e[j] = t.current, Wf(e), new Wh(t);
	};
})), g = /* @__PURE__ */ o(((e, t) => {
	function n() {
		if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE == "function") try {
			__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(n);
		} catch (e) {
			console.error(e);
		}
	}
	n(), t.exports = h();
})), _ = (e) => e.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase(), v = (e) => e.replace(/^([A-Z])|[\s-_]+(\w)/g, (e, t, n) => n ? n.toUpperCase() : t.toLowerCase()), y = (e) => {
	let t = v(e);
	return t.charAt(0).toUpperCase() + t.slice(1);
}, b = (...e) => e.filter((e, t, n) => !!e && e.trim() !== "" && n.indexOf(e) === t).join(" ").trim(), ee = (e) => {
	for (let t in e) if (t.startsWith("aria-") || t === "role" || t === "title") return !0;
}, te = {
	xmlns: "http://www.w3.org/2000/svg",
	width: 24,
	height: 24,
	viewBox: "0 0 24 24",
	fill: "none",
	stroke: "currentColor",
	strokeWidth: 2,
	strokeLinecap: "round",
	strokeLinejoin: "round"
}, x = /* @__PURE__ */ c(u()), ne = (0, x.forwardRef)(({ color: e = "currentColor", size: t = 24, strokeWidth: n = 2, absoluteStrokeWidth: r, className: i = "", children: a, iconNode: o, ...s }, c) => (0, x.createElement)("svg", {
	ref: c,
	...te,
	width: t,
	height: t,
	stroke: e,
	strokeWidth: r ? Number(n) * 24 / Number(t) : n,
	className: b("lucide", i),
	...!a && !ee(s) && { "aria-hidden": "true" },
	...s
}, [...o.map(([e, t]) => (0, x.createElement)(e, t)), ...Array.isArray(a) ? a : [a]])), S = (e, t) => {
	let n = (0, x.forwardRef)(({ className: n, ...r }, i) => (0, x.createElement)(ne, {
		ref: i,
		iconNode: t,
		className: b(`lucide-${_(y(e))}`, `lucide-${e}`, n),
		...r
	}));
	return n.displayName = y(e), n;
}, re = S("book-open", [["path", {
	d: "M12 7v14",
	key: "1akyts"
}], ["path", {
	d: "M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z",
	key: "ruj8y"
}]]), C = S("briefcase", [["path", {
	d: "M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16",
	key: "jecpp"
}], ["rect", {
	width: "20",
	height: "14",
	x: "2",
	y: "6",
	rx: "2",
	key: "i6l2r4"
}]]), ie = S("building-2", [
	["path", {
		d: "M10 12h4",
		key: "a56b0p"
	}],
	["path", {
		d: "M10 8h4",
		key: "1sr2af"
	}],
	["path", {
		d: "M14 21v-3a2 2 0 0 0-4 0v3",
		key: "1rgiei"
	}],
	["path", {
		d: "M6 10H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2",
		key: "secmi2"
	}],
	["path", {
		d: "M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16",
		key: "16ra0t"
	}]
]), ae = S("calendar", [
	["path", {
		d: "M8 2v4",
		key: "1cmpym"
	}],
	["path", {
		d: "M16 2v4",
		key: "4m81vk"
	}],
	["rect", {
		width: "18",
		height: "18",
		x: "3",
		y: "4",
		rx: "2",
		key: "1hopcy"
	}],
	["path", {
		d: "M3 10h18",
		key: "8toen8"
	}]
]), oe = S("camera", [["path", {
	d: "M13.997 4a2 2 0 0 1 1.76 1.05l.486.9A2 2 0 0 0 18.003 7H20a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1.997a2 2 0 0 0 1.759-1.048l.489-.904A2 2 0 0 1 10.004 4z",
	key: "18u6gg"
}], ["circle", {
	cx: "12",
	cy: "13",
	r: "3",
	key: "1vg3eu"
}]]), se = S("check", [["path", {
	d: "M20 6 9 17l-5-5",
	key: "1gmf2c"
}]]), ce = S("circle-alert", [
	["circle", {
		cx: "12",
		cy: "12",
		r: "10",
		key: "1mglay"
	}],
	["line", {
		x1: "12",
		x2: "12",
		y1: "8",
		y2: "12",
		key: "1pkeuh"
	}],
	["line", {
		x1: "12",
		x2: "12.01",
		y1: "16",
		y2: "16",
		key: "4dfq90"
	}]
]), w = S("circle-check", [["circle", {
	cx: "12",
	cy: "12",
	r: "10",
	key: "1mglay"
}], ["path", {
	d: "m9 12 2 2 4-4",
	key: "dzmm74"
}]]), le = S("circle-question-mark", [
	["circle", {
		cx: "12",
		cy: "12",
		r: "10",
		key: "1mglay"
	}],
	["path", {
		d: "M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3",
		key: "1u773s"
	}],
	["path", {
		d: "M12 17h.01",
		key: "p32p05"
	}]
]), ue = S("ellipsis", [
	["circle", {
		cx: "12",
		cy: "12",
		r: "1",
		key: "41hilf"
	}],
	["circle", {
		cx: "19",
		cy: "12",
		r: "1",
		key: "1wjl8i"
	}],
	["circle", {
		cx: "5",
		cy: "12",
		r: "1",
		key: "1pcz8c"
	}]
]), T = S("file-text", [
	["path", {
		d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z",
		key: "1rqfz7"
	}],
	["path", {
		d: "M14 2v4a2 2 0 0 0 2 2h4",
		key: "tnqrlb"
	}],
	["path", {
		d: "M10 9H8",
		key: "b1mrlr"
	}],
	["path", {
		d: "M16 13H8",
		key: "t4e002"
	}],
	["path", {
		d: "M16 17H8",
		key: "z1uh3a"
	}]
]), de = S("file-up", [
	["path", {
		d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z",
		key: "1rqfz7"
	}],
	["path", {
		d: "M14 2v4a2 2 0 0 0 2 2h4",
		key: "tnqrlb"
	}],
	["path", {
		d: "M12 12v6",
		key: "3ahymv"
	}],
	["path", {
		d: "m15 15-3-3-3 3",
		key: "15xj92"
	}]
]), fe = S("globe", [
	["circle", {
		cx: "12",
		cy: "12",
		r: "10",
		key: "1mglay"
	}],
	["path", {
		d: "M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20",
		key: "13o1zl"
	}],
	["path", {
		d: "M2 12h20",
		key: "9i4pu4"
	}]
]), pe = S("hand-heart", [
	["path", {
		d: "M11 14h2a2 2 0 0 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 16",
		key: "1v1a37"
	}],
	["path", {
		d: "m14.45 13.39 5.05-4.694C20.196 8 21 6.85 21 5.75a2.75 2.75 0 0 0-4.797-1.837.276.276 0 0 1-.406 0A2.75 2.75 0 0 0 11 5.75c0 1.2.802 2.248 1.5 2.946L16 11.95",
		key: "fhfbnt"
	}],
	["path", {
		d: "m2 15 6 6",
		key: "10dquu"
	}],
	["path", {
		d: "m7 20 1.6-1.4c.3-.4.8-.6 1.4-.6h4c1.1 0 2.1-.4 2.8-1.2l4.6-4.4a1 1 0 0 0-2.75-2.91",
		key: "1x6kdw"
	}]
]), me = S("hash", [
	["line", {
		x1: "4",
		x2: "20",
		y1: "9",
		y2: "9",
		key: "4lhtct"
	}],
	["line", {
		x1: "4",
		x2: "20",
		y1: "15",
		y2: "15",
		key: "vyu0kd"
	}],
	["line", {
		x1: "10",
		x2: "8",
		y1: "3",
		y2: "21",
		key: "1ggp8o"
	}],
	["line", {
		x1: "16",
		x2: "14",
		y1: "3",
		y2: "21",
		key: "weycgp"
	}]
]), he = S("info", [
	["circle", {
		cx: "12",
		cy: "12",
		r: "10",
		key: "1mglay"
	}],
	["path", {
		d: "M12 16v-4",
		key: "1dtifu"
	}],
	["path", {
		d: "M12 8h.01",
		key: "e9boi3"
	}]
]), ge = S("loader-circle", [["path", {
	d: "M21 12a9 9 0 1 1-6.219-8.56",
	key: "13zald"
}]]), _e = S("lock", [["rect", {
	width: "18",
	height: "11",
	x: "3",
	y: "11",
	rx: "2",
	ry: "2",
	key: "1w4ew1"
}], ["path", {
	d: "M7 11V7a5 5 0 0 1 10 0v4",
	key: "fwvmzm"
}]]), ve = S("mail", [["path", {
	d: "m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7",
	key: "132q7q"
}], ["rect", {
	x: "2",
	y: "4",
	width: "20",
	height: "16",
	rx: "2",
	key: "izxlao"
}]]), ye = S("map-pin", [["path", {
	d: "M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0",
	key: "1r0f0z"
}], ["circle", {
	cx: "12",
	cy: "10",
	r: "3",
	key: "ilqhr7"
}]]), be = S("message-square", [["path", {
	d: "M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z",
	key: "18887p"
}]]), xe = S("mic", [
	["path", {
		d: "M12 19v3",
		key: "npa21l"
	}],
	["path", {
		d: "M19 10v2a7 7 0 0 1-14 0v-2",
		key: "1vc78b"
	}],
	["rect", {
		x: "9",
		y: "2",
		width: "6",
		height: "13",
		rx: "3",
		key: "s6n7sd"
	}]
]), Se = S("phone", [["path", {
	d: "M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384",
	key: "9njp5v"
}]]), Ce = S("plus", [["path", {
	d: "M5 12h14",
	key: "1ays0h"
}], ["path", {
	d: "M12 5v14",
	key: "s699le"
}]]), we = S("rotate-ccw", [["path", {
	d: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8",
	key: "1357e3"
}], ["path", {
	d: "M3 3v5h5",
	key: "1xhq8a"
}]]), E = S("shield-check", [["path", {
	d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
	key: "oel41y"
}], ["path", {
	d: "m9 12 2 2 4-4",
	key: "dzmm74"
}]]), D = S("shield", [["path", {
	d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
	key: "oel41y"
}]]), Te = S("square-check-big", [["path", {
	d: "M21 10.656V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h12.344",
	key: "2acyp4"
}], ["path", {
	d: "m9 11 3 3L22 4",
	key: "1pflzl"
}]]), Ee = S("square", [["rect", {
	width: "18",
	height: "18",
	x: "3",
	y: "3",
	rx: "2",
	key: "afitv7"
}]]), De = S("toggle-left", [["circle", {
	cx: "9",
	cy: "12",
	r: "3",
	key: "u3jwor"
}], ["rect", {
	width: "20",
	height: "14",
	x: "2",
	y: "5",
	rx: "7",
	key: "g7kal2"
}]]), Oe = S("triangle-alert", [
	["path", {
		d: "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3",
		key: "wmoenq"
	}],
	["path", {
		d: "M12 9v4",
		key: "juzpu7"
	}],
	["path", {
		d: "M12 17h.01",
		key: "p32p05"
	}]
]), ke = S("type", [
	["path", {
		d: "M12 4v16",
		key: "1654pz"
	}],
	["path", {
		d: "M4 7V5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v2",
		key: "e0r10z"
	}],
	["path", {
		d: "M9 20h6",
		key: "s66wpe"
	}]
]), O = S("user", [["path", {
	d: "M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2",
	key: "975kel"
}], ["circle", {
	cx: "12",
	cy: "7",
	r: "4",
	key: "17ys0d"
}]]), Ae = S("users", [
	["path", {
		d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",
		key: "1yyitq"
	}],
	["path", {
		d: "M16 3.128a4 4 0 0 1 0 7.744",
		key: "16gr8j"
	}],
	["path", {
		d: "M22 21v-2a4 4 0 0 0-3-3.87",
		key: "kshegd"
	}],
	["circle", {
		cx: "9",
		cy: "7",
		r: "4",
		key: "nufk8"
	}]
]), je = S("volume-2", [
	["path", {
		d: "M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z",
		key: "uqj9uw"
	}],
	["path", {
		d: "M16 9a5 5 0 0 1 0 6",
		key: "1q6k2b"
	}],
	["path", {
		d: "M19.364 18.364a9 9 0 0 0 0-12.728",
		key: "ijwkga"
	}]
]), Me = S("volume-x", [
	["path", {
		d: "M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z",
		key: "uqj9uw"
	}],
	["line", {
		x1: "22",
		x2: "16",
		y1: "9",
		y2: "15",
		key: "1ewh16"
	}],
	["line", {
		x1: "16",
		x2: "22",
		y1: "9",
		y2: "15",
		key: "5ykzw1"
	}]
]), Ne = S("x", [["path", {
	d: "M18 6 6 18",
	key: "1bl5f8"
}], ["path", {
	d: "m6 6 12 12",
	key: "d8bk6v"
}]]), Pe = g(), Fe = /* @__PURE__ */ new Set([
	"text",
	"phone",
	"date",
	"choice",
	"multichoice",
	"yes-no",
	"email",
	"number",
	"id-routes",
	"support",
	"work-story",
	"info",
	"consent"
]), Ie = new Set([
	{
		id: "user",
		label: "Person"
	},
	{
		id: "phone",
		label: "Phone"
	},
	{
		id: "mail",
		label: "Email"
	},
	{
		id: "calendar",
		label: "Calendar"
	},
	{
		id: "map-pin",
		label: "Location"
	},
	{
		id: "globe",
		label: "Language"
	},
	{
		id: "shield-check",
		label: "ID & Trust"
	},
	{
		id: "heart-handshake",
		label: "Support"
	},
	{
		id: "briefcase",
		label: "Work"
	},
	{
		id: "graduation-cap",
		label: "Education"
	},
	{
		id: "building",
		label: "Company"
	},
	{
		id: "hash",
		label: "Number"
	},
	{
		id: "toggle-left",
		label: "Yes / No"
	},
	{
		id: "info",
		label: "Info"
	},
	{
		id: "check-square",
		label: "Consent"
	},
	{
		id: "help-circle",
		label: "Help"
	}
].map((e) => e.id)), Le = /* @__PURE__ */ new Set([
	"fayda",
	"refugee_id",
	"other_document",
	"partner_refer"
]);
function Re(e) {
	let t = String(e ?? "").replace("#", "").trim();
	if (!/^[0-9a-fA-F]{6}$/.test(t)) return 1;
	let n = parseInt(t.slice(0, 2), 16) / 255, r = parseInt(t.slice(2, 4), 16) / 255, i = parseInt(t.slice(4, 6), 16) / 255, a = (e) => e <= .03928 ? e / 12.92 : ((e + .055) / 1.055) ** 2.4, o = .2126 * a(n) + .7152 * a(r) + .0722 * a(i);
	return Number((1.05 / (o + .05)).toFixed(2));
}
function ze(e) {
	let t = [], n = /* @__PURE__ */ new Set(), r = /* @__PURE__ */ new Set(), i = 0, a = [];
	for (let o = 0; o < (e.questions?.length ?? 0); o++) {
		let s = e.questions[o];
		if (!s || typeof s != "object") {
			t.push(`Question ${o + 1} is malformed.`);
			continue;
		}
		let c = String(s.id ?? "").trim();
		if (!c) {
			t.push(`Question ${o + 1} is missing an id.`);
			continue;
		}
		if (n.has(c)) {
			t.push(`Duplicate question id: "${c}".`);
			continue;
		}
		if (n.add(c), !Fe.has(s.type)) {
			t.push(`Question "${c}" has unknown type "${String(s.type)}".`);
			continue;
		}
		if (s.type === "support" && (i += 1, i > 1)) {
			t.push(`Template contains multiple "support" questions (at "${c}"). Only one is allowed.`);
			continue;
		}
		if (s.label?.en?.trim() && s.label?.am?.trim() || t.push(`Question "${c}" must include both English and Amharic labels.`), s.type === "choice" || s.type === "multichoice") {
			let e = Array.isArray(s.options) ? s.options : [];
			if (e.length < 2) t.push(`Question "${c}" (${s.type}) must include at least 2 options.`);
			else {
				let n = /* @__PURE__ */ new Set();
				for (let r of e) {
					let e = String(r?.value ?? "").trim();
					if (!e || n.has(e)) {
						t.push(`Question "${c}" has duplicate or empty option value "${e}".`);
						break;
					}
					if (n.add(e), !r.label?.en?.trim() || !r.label?.am?.trim()) {
						t.push(`Question "${c}" has an option missing an English or Amharic label.`);
						break;
					}
				}
			}
		}
		if (s.skippable && s.required && t.push(`Question "${c}" cannot be both required and skippable.`), s.showIf) {
			let n = (e.questions ?? []).findIndex((e) => e?.id === s.showIf?.questionId);
			(n === -1 || n >= o) && t.push(`Question "${c}" has a showIf rule pointing to "${s.showIf.questionId}", which must be an earlier question.`);
		}
		let l = String(s.maps_to ?? "").trim();
		s.type !== "info" && l && !l.startsWith("custom_") && (r.has(l) && t.push(`Duplicate maps_to field "${l}" on question "${c}".`), r.add(l));
		let u = Ie.has(s.icon) ? s.icon : "user";
		a.push({
			...s,
			id: c,
			icon: u,
			label: {
				en: s.label?.en?.trim() || c,
				am: s.label?.am?.trim() || s.label?.en?.trim() || c
			}
		});
	}
	let o = Array.isArray(e.idRoutes) ? e.idRoutes.filter((e) => Le.has(e)) : [];
	if (Array.isArray(e.idRoutes) && o.length === 0 && t.push("Select at least one ID route."), e.theme?.accent) {
		let n = Re(e.theme.accent);
		n < 4.5 && t.push(`Accent colour ${e.theme.accent} contrast (${n}:1) is below WCAG AA 4.5:1 against white text.`);
	}
	let s = {
		...e,
		idRoutes: o.length > 0 ? o : [
			"fayda",
			"refugee_id",
			"other_document",
			"partner_refer"
		],
		questions: a
	};
	return {
		valid: t.length === 0,
		errors: t,
		template: s
	};
}
// src/lib/apiBase.ts
var Be = "";
function Ve(e) {
	Be = e.replace(/\/+$/, "");
}
function He(e) {
	return /^https?:\/\//.test(e) ? e : `${Be}${e}`;
}
// src/ai.ts
var Ue = 8e3, We = 15e3;
async function Ge(e, t, n = Ue) {
	let r = new AbortController(), i = window.setTimeout(() => r.abort(), n);
	try {
		return await fetch(He(e), {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(t),
			signal: r.signal
		});
	} finally {
		window.clearTimeout(i);
	}
}
var Ke = {
	addis: "Addis AI",
	elevenlabs: "ElevenLabs",
	gemini: "Gemini"
};
function qe(e) {
	return e === "addis" || e === "elevenlabs" || e === "gemini" ? e : null;
}
function Je(e) {
	return e === "addis" || e === "elevenlabs" ? e : null;
}
async function Ye() {
	try {
		let e = new AbortController(), t = window.setTimeout(() => e.abort(), 4e3), n = await fetch(He("/api/capabilities"), { signal: e.signal });
		if (window.clearTimeout(t), !n.ok) return {
			voice: !1,
			smartHelp: !1,
			skillsAi: !1,
			simplifyAi: !1
		};
		let r = await n.json();
		return {
			voice: !!r.voice,
			smartHelp: !!r.smartHelp,
			skillsAi: !!r.skillsAi,
			simplifyAi: !!r.simplifyAi,
			voiceProvider: qe(r.voiceProvider),
			voiceProviders: r.voiceProviders ? {
				am: qe(r.voiceProviders.am),
				en: qe(r.voiceProviders.en)
			} : void 0,
			readAloudProviders: r.readAloudProviders ? {
				am: Je(r.readAloudProviders.am),
				en: Je(r.readAloudProviders.en)
			} : void 0
		};
	} catch {
		return {
			voice: !1,
			smartHelp: !1,
			skillsAi: !1,
			simplifyAi: !1
		};
	}
}
async function Xe(e, t, n) {
	let r = new AbortController(), i = window.setTimeout(() => r.abort(), 12e3), a = () => r.abort();
	n?.addEventListener("abort", a);
	try {
		let n = await fetch(He("/api/tts"), {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				text: e,
				lang: t
			}),
			signal: r.signal
		});
		if (!n.ok) return null;
		let i = await n.blob();
		return i.size > 0 ? i : null;
	} catch {
		return null;
	} finally {
		window.clearTimeout(i), n?.removeEventListener("abort", a);
	}
}
async function Ze(e) {
	for (let t = 0; t < 2; t++) try {
		let n = await Ge("/api/ai/voice", e, We);
		if (!n.ok) {
			if (n.status >= 500 && t === 0) continue;
			return {
				ok: !1,
				transcript: "",
				value: "",
				confidence: "low",
				matchedValue: null
			};
		}
		let r = await n.json();
		return {
			ok: !0,
			transcript: String(r.transcript ?? ""),
			value: String(r.value ?? r.transcript ?? ""),
			confidence: r.confidence === "high" || r.confidence === "medium" || r.confidence === "low" ? r.confidence : "medium",
			matchedValue: r.matchedValue ? String(r.matchedValue) : null
		};
	} catch (e) {
		let n = e instanceof DOMException && e.name === "AbortError";
		if (t === 0) continue;
		return {
			ok: !1,
			transcript: "",
			value: "",
			confidence: "low",
			matchedValue: null,
			timedOut: n
		};
	}
	return {
		ok: !1,
		transcript: "",
		value: "",
		confidence: "low",
		matchedValue: null
	};
}
async function Qe(e) {
	try {
		let t = await Ge("/api/ai/help", {
			screenSummary: e.screenSummary,
			userProblem: e.userProblem,
			lang: e.lang
		});
		if (!t.ok) return {
			usedAi: !1,
			explanation: e.fallbackExplanation,
			targetFieldId: e.fallbackTargetFieldId
		};
		let n = await t.json();
		return n.explanation ? {
			usedAi: !0,
			explanation: String(n.explanation),
			targetFieldId: n.targetFieldId ? String(n.targetFieldId) : e.fallbackTargetFieldId
		} : {
			usedAi: !1,
			explanation: e.fallbackExplanation,
			targetFieldId: e.fallbackTargetFieldId
		};
	} catch {
		return {
			usedAi: !1,
			explanation: e.fallbackExplanation,
			targetFieldId: e.fallbackTargetFieldId
		};
	}
}
async function $e(e) {
	try {
		let t = await Ge("/api/ai/simplify", {
			label: e.label,
			lang: e.lang
		});
		if (!t.ok) return {
			usedAi: !1,
			text: e.fallbackHint
		};
		let n = await t.json();
		return n.simplified ? {
			usedAi: !0,
			text: String(n.simplified)
		} : {
			usedAi: !1,
			text: e.fallbackHint
		};
	} catch {
		return {
			usedAi: !1,
			text: e.fallbackHint
		};
	}
}
async function et(e) {
	try {
		let t = await Ge("/api/ai/skills", e);
		if (!t.ok) return {
			usedAi: !1,
			skills: []
		};
		let n = await t.json();
		return !Array.isArray(n.skills) || n.skills.length === 0 ? {
			usedAi: !1,
			skills: []
		} : {
			usedAi: !0,
			skills: n.skills.slice(0, 6).map((e) => ({
				name: String(e.name ?? ""),
				evidence: String(e.evidence ?? "")
			}))
		};
	} catch {
		return {
			usedAi: !1,
			skills: []
		};
	}
}
// src/lib/wav.ts
var tt = 16e3;
function nt(e, t) {
	let n = new Uint8Array(44 + e.length * 2), r = new DataView(n.buffer), i = (e, t) => {
		for (let n = 0; n < t.length; n++) r.setUint8(e + n, t.charCodeAt(n));
	};
	i(0, "RIFF"), r.setUint32(4, 36 + e.length * 2, !0), i(8, "WAVE"), i(12, "fmt "), r.setUint32(16, 16, !0), r.setUint16(20, 1, !0), r.setUint16(22, 1, !0), r.setUint32(24, t, !0), r.setUint32(28, t * 2, !0), r.setUint16(32, 2, !0), r.setUint16(34, 16, !0), i(36, "data"), r.setUint32(40, e.length * 2, !0);
	for (let t = 0; t < e.length; t++) {
		let n = Math.max(-1, Math.min(1, e[t]));
		r.setInt16(44 + t * 2, n < 0 ? n * 32768 : n * 32767, !0);
	}
	return n;
}
async function rt(e) {
	let t = typeof window < "u" ? window.AudioContext ?? window.webkitAudioContext : void 0;
	if (!t || typeof OfflineAudioContext > "u") return e;
	let n = null;
	try {
		n = new t();
		let r = await n.decodeAudioData(await e.arrayBuffer()), i = Math.max(1, Math.ceil(r.duration * tt)), a = new OfflineAudioContext(1, i, tt), o = a.createBufferSource();
		o.buffer = r, o.connect(a.destination), o.start();
		let s = nt((await a.startRendering()).getChannelData(0), tt);
		return new Blob([s.buffer], { type: "audio/wav" });
	} catch {
		return e;
	} finally {
		n?.close().catch(() => {});
	}
}
// src/lib/storage.ts
var it = /* @__PURE__ */ new Map();
function at(e) {
	try {
		return {
			value: window.localStorage.getItem(e),
			blocked: !1
		};
	} catch {
		return {
			value: it.get(e) ?? null,
			blocked: !0
		};
	}
}
function ot(e, t) {
	it.set(e, t);
	try {
		return window.localStorage.setItem(e, t), { blocked: !1 };
	} catch {
		return { blocked: !0 };
	}
}
function st(e) {
	it.delete(e);
	try {
		return window.localStorage.removeItem(e), { blocked: !1 };
	} catch {
		return { blocked: !0 };
	}
}
function ct(e, t) {
	it.set(`session:${e}`, t);
	try {
		window.sessionStorage.setItem(e, t);
	} catch {}
}
// src/i18n.ts
var lt = {
	skipToContent: "Skip to main content",
	brandName: "mezgeb",
	brandWordmarkAm: "መዝገብ",
	navDemo: "Demo",
	navJobs: "Jobs",
	navTemplates: "Templates",
	navPlayground: "Playground",
	navDocs: "Docs",
	navPilotCta: "Request a pilot",
	navMenuOpen: "Menu",
	navMenuClose: "Close menu",
	langEnglish: "EN",
	langAmharic: "አማ",
	langToggleLabel: "Switch language",
	copiedAnnouncement: "Copied to clipboard",
	copyButton: "Copy",
	copiedButton: "Copied",
	closeButton: "Close",
	cancelButton: "Cancel",
	saveButton: "Save",
	loadingText: "Loading…",
	yesButton: "Yes",
	noButton: "No",
	pilotDialogTitle: "Request a pilot with Mezgeb",
	pilotDialogDesc: "Tell us about your training programme, job board, or NGO. We will reply within two working days.",
	pilotOrgLabel: "Organisation name",
	pilotEmailLabel: "Work email or phone",
	pilotTypeLabel: "Platform type",
	pilotTypeTraining: "Training programme / TVET",
	pilotTypeJobs: "Job board",
	pilotTypeNgo: "NGO / Partner intake",
	pilotTypeOther: "Other",
	pilotNotesLabel: "What would you like to test?",
	pilotSubmit: "Send pilot request",
	pilotSuccessTitle: "Pilot request recorded",
	pilotSuccessBody: "Thank you. This showcase records your request locally for team discussion. In production, it reaches hello@mezgeb.example.",
	pilotErrorRequired: "Please enter your organisation name and email or phone.",
	heroTitleLine1: "Onboarding that listens,",
	heroTitleLine2: "to every learner.",
	heroSubtitle: "Learners register by typing, by speaking Amharic, or with a partner beside them. No time-outs, no ID dead ends.",
	heroCtaDemo: "Try the live demo",
	heroCtaWatch: "Watch the demo",
	heroVideoWindowTitle: "Mezgeb demo · 2 min",
	heroVideoTitle: "Video: Hana signs up by voice in Amharic",
	heroVideoPosterBadge: "2:04 · Subtitles in Amharic & English",
	heroVideoComingSoon: "Demo video coming soon",
	heroVideoPlayLabel: "Play demo video",
	heroVideoQuestionAm: "የተወለዱበት ቀን መቼ ነው?",
	heroVideoQuestionEn: "When were you born?",
	heroVideoEthSwitch: "Ethiopian calendar",
	heroVideoYearPlaceholder: "YYYY",
	heroVideoYearError: "Please enter a 4-digit year, such as 1995.",
	heroVideoCC: "CC",
	heroVideoTranscript: "Transcript",
	heroVideoTranscriptTitle: "Video transcript (sample demo)",
	heroVideoTranscriptBody: "[00:00] Screen reader announces: Step 3 of 6. When were you born? Ethiopian calendar is selected.\n[00:18] Hana taps the microphone button and speaks in Amharic: 'I was born on 12 Meskerem 1990.'\n[00:34] Mezgeb shows the editable transcript on screen: '12 Meskerem 1990 (22 September 1997 Gregorian)'.\n[00:48] Hana confirms the date and moves to Step 4: How will you show who you are?",
	heroFrontWindowTitle: "learnhub.et/join",
	heroStep1: "Language",
	heroStep2: "Name and area",
	heroStep3: "Date of birth",
	heroStep4: "How you'll show who you are",
	heroStep5: "Support you need",
	heroStep6: "Review",
	heroCurrentQuestion: "How will you show who you are?",
	heroOptFayda: "Fayda",
	heroOptRefugee: "Refugee ID",
	heroOptOther: "Other document",
	heroOptPartner: "Refer me through a partner",
	heroPartnerNotice: "Partner joined · They can see this form, not your answers.",
	heroContinue: "Continue",
	whyLabel: "Why we built Mezgeb",
	whyP1: "Most sign-up forms were never built for the people who need them most.",
	whyP2Lead: "On 21 October 2026, forty people who are blind, Deaf, disabled, refugees or returnees tried to register on a learning platform in Addis Ababa. ",
	whyP2Bold1: "Most could not finish.",
	whyP2Mid: " Forms timed out. Errors were silent to screen readers. ",
	whyP2Bold2: "Anyone without a kebele ID or passport was turned away.",
	whyP3Lead: "The ID wall is wide. By October 2025, ",
	whyP3Bold: "only about 138,000 of more than a million refugees in Ethiopia",
	whyP3Tail: " were enrolled in Fayda, the national ID most services now ask for.",
	whyP4: "Registration should be the easy part.",
	whySources: "Sources: Digital Bridge co-design session, 21 October 2026; Ethiopia GRF progress report, 2025.",
	featuresSectionTitle: "How Mezgeb works for learners",
	feat1Label: "No time-outs",
	feat1HeadingLine1: "Pick up exactly",
	feat1HeadingLine2: "where you left off",
	feat1Body: "Every answer is saved the moment it is given. No time limit, and a link by SMS to finish later.",
	feat1SmsSender: "Learnhub · now",
	feat1SmsText: "Your sign-up is saved. Continue from step 4:",
	feat1SmsLink: "lhb.et/r/7Kq2",
	feat1ResumeTitle: "Welcome back, Hana",
	feat1ResumeSub: "Step 4 of 6 · saved 2 days ago",
	feat1Row1Label: "Language",
	feat1Row1Val: "Amharic",
	feat1Row2Label: "Name and area",
	feat1Row2Val: "Hana, Lideta",
	feat1Row3Label: "Phone",
	feat1Row3Val: "09•• ••• 214",
	feat1ResumeBtn: "Continue where I left off",
	feat1NoLimit: "No time limit",
	feat2Label: "Skills from stories",
	feat2HeadingLine1: "Experience counts,",
	feat2HeadingLine2: "even without a certificate",
	feat2Body: "Learners describe the work they have done in their own words. Mezgeb suggests skills; the learner decides.",
	feat2CardTitle: "Tell us about work you've done",
	feat2CardTag: "Paid or unpaid",
	feat2TranscriptPart1: "I ",
	feat2TranscriptHl1: "sold clothes",
	feat2TranscriptPart2: " at Merkato for ",
	feat2TranscriptHl2: "three years",
	feat2TranscriptPart3: " and ",
	feat2TranscriptHl3: "kept the shop's accounts",
	feat2TranscriptPart4: ". I also ",
	feat2TranscriptHl4: "helped customers",
	feat2TranscriptPart5: " find sizes.",
	feat2SkillsLabel: "Skills we heard",
	feat2Skill1: "Sales",
	feat2Skill2: "Bookkeeping",
	feat2Skill3: "Customer service",
	feat2Skill4: "Retail experience · 3 yrs",
	feat2AddSkill: "+ Add a skill",
	feat2KeepBtn: "Keep these",
	feat3Label: "Private by default",
	feat3HeadingLine1: "Ask for support",
	feat3HeadingLine2: "without explaining why",
	feat3Body: "Learners say what helps them. No diagnosis, no documents, and they choose exactly who can see it.",
	feat3CardTitle: "Support I need",
	feat3CardSub: "No diagnosis or documents needed",
	feat3Chip1: "Screen reader",
	feat3Chip2: "Extra time",
	feat3Chip3: "Step-free access",
	feat3Chip4: "Sign language interpreter",
	feat3WhoLabel: "Who can see this",
	feat3Who1Name: "Learnhub",
	feat3Who1Desc: "Your learning platform",
	feat3Who2Name: "Employers",
	feat3Who2Desc: "Only if you apply and choose to share",
	feat3Who3Name: "Partner organisation",
	feat3Who3Desc: "Only during a help session",
	feat3Encrypted: "Stored separately and encrypted",
	feat4Label: "Jobs that fit",
	feat4HeadingLine1: "Jobs that already",
	feat4HeadingLine2: "offer what you need",
	feat4Body: "Employers list the support each job offers. Learners filter by their needs without disclosing anything.",
	feat4SearchPlaceholder: "Search jobs",
	feat4Filter1: "Screen reader",
	feat4Filter2: "Extra time",
	feat4FilterPrivate: "Filters are private",
	feat4Job1Title: "Junior data clerk",
	feat4Job1Meta: "Logistics company · Addis Ababa",
	feat4Job1Match: "2 of 2 needs met",
	feat4Job1Tag1: "Screen reader",
	feat4Job1Tag2: "Extra time for tests",
	feat4Job1Tag3: "Flexible hours",
	feat4Job1Apply: "Apply by voice",
	feat4Job1Save: "Save",
	feat4Job2Title: "Customer support agent",
	feat4Job2Meta: "Telecom company · Remote",
	feat4Job2Match: "1 of 2 needs met",
	platformsLabel: "For platforms",
	platformsHeadingLine1: "Add it to your sign-up page",
	platformsHeadingLine2: "in an afternoon.",
	platformsIntro: "One script tag on your page. When a learner finishes, your server receives a confirmed profile. Your login, your database and your design stay yours.",
	platStep1Title: "Add one tag",
	platStep2Title: "Learners sign up their way",
	platStep2Org: "Learnhub · Powered by Mezgeb",
	platStep2Step: "Step 2 of 6",
	platStep2Q: "What is your phone number?",
	platStep2ReadAloud: "Read aloud",
	platStep2OptType: "Type",
	platStep2OptSpeak: "Speak",
	platStep2OptHelp: "Get help",
	platStep3Title: "Get a confirmed profile",
	platStep3Event: "registration.completed · seconds ago",
	platStep3Note: "Support needs arrive only if the learner shares them",
	platLevel1Title: "Level 1 · Script tag",
	platLevel1Desc: "Drop the component into any page.",
	platLevel1Link: "Quick start",
	platLevel2Title: "Level 2 · REST API",
	platLevel2Desc: "Build your own interface with our OpenAPI spec.",
	platLevel2Link: "REST API docs",
	platLevel3Title: "Level 3 · Job boards",
	platLevel3Desc: "Publish job accommodations as schema.org/JobPosting.",
	platLevel3Link: "JobPosting docs",
	platHostingLine: "Self-host with Docker: data never leaves your server · Or let us host it",
	platHostingBtn: "Open the playground",
	faqLabel: "FAQ",
	faqHeadingLine1: "Questions,",
	faqHeadingLine2: "answered.",
	faqSub: "For learners, partners and the platforms that add Mezgeb to their sign-up page.",
	faqAskTelegram: "Ask us on Telegram",
	faqQ1: "Does a learner need a Fayda ID?",
	faqA1: "No. Learners can use Fayda, a refugee ID or another document, or choose “Refer me” so a partner organisation can vouch for them.",
	faqQ2: "Which languages does Mezgeb support?",
	faqA2: "Amharic and English today. Afaan Oromo, Tigrinya and Somali are planned.",
	faqQ3: "Does the AI see what learners type?",
	faqA3: "No. The help assistant reads the page's labels and error messages, never the learner's answers.",
	faqQ4: "What happens to voice recordings?",
	faqA4: "They are deleted as soon as they are written down.",
	faqQ5: "Do learners have to disclose a disability?",
	faqA5: "No. Learners describe practical needs. No diagnosis or proof is asked for, and only sites they choose can see it.",
	faqQ6: "How long does it take to add to our site?",
	faqA6: "One script tag and a small server step. Most sites can do it in an afternoon.",
	faqQ7: "Can we host it ourselves?",
	faqA7: "Yes. It runs with Docker Compose on your server, including the speech and AI models.",
	faqQ8: "Does it work on basic phones and slow connections?",
	faqA8: "Yes. It works on low-cost Android phones over 3G, saves answers on the phone when offline, and can send an SMS link to finish later.",
	footerCol1Title: "For learners",
	footerCol1L1: "How it works",
	footerCol1L2: "Register by voice",
	footerCol1L3: "My profile",
	footerCol1L4: "Accessibility statement",
	footerCol2Title: "For platforms",
	footerCol2L1: "Playground",
	footerCol2L2: "Docs",
	footerCol2L3: "Self-hosting",
	footerCol2L4: "Templates",
	footerCol3Title: "The boring bits",
	footerCol3L1: "Privacy",
	footerCol3L2: "Terms",
	footerCol3L3: "Data protection",
	footerCol3L4: "Open-source licence",
	footerCol4Title: "Say hello",
	footerCol4L1: "Telegram",
	footerCol4L2: "LinkedIn",
	footerCol4L3: "GitHub",
	footerCol4L4: "hello@mezgeb.example",
	footerOriginLine: "Open source. First built for the Digital Bridge Accessibility Hackathon 2026 in Addis Ababa, with blind, Deaf, disabled and displaced co-designers.",
	footerCopyright: "© 2026 Mezgeb",
	cloudAiNotice: "Demo uses cloud AI (Gemini). The product runs AI on your own server by default.",
	voiceProviderNotice: "Your recording is turned into text by {provider}, an online service. Mezgeb does not keep the recording.",
	widgetRecordingLimit: "Recording stops after 20 seconds.",
	widgetPartnerPendingLabel: "waiting for your partner to confirm",
	widgetSkillsAiNotice: "This sends your story to an AI service to suggest skills. You can also pick skills from the list without it.",
	demoPageTitle: "Live Demo",
	demoPageSubtitle: "Try registering as a learner on a sample platform. Test keyboard navigation, Amharic and English, Ethiopian calendar, offline mode, and AI switched off.",
	demoBrowserTitle: "learnhub.et/join (sample platform)",
	demoSampleBadge: "Sample data for team discussion",
	demoDevToggleShow: "Show developer view",
	demoDevToggleHide: "Hide developer view",
	demoDevTitle: "Developer view",
	demoDevOfflineLabel: "Simulate offline",
	demoDevAiLabel: "AI on/off",
	demoDevAiOn: "AI on",
	demoDevAiOff: "AI off",
	demoDevLangLabel: "Language",
	demoDevAnswersTitle: "Live answers JSON",
	demoDevAnswersNotice: "Demo only: the real component never shows this",
	demoDevAiLogTitle: "What the AI received",
	demoDevAiLogEmpty: "No AI help requests sent yet. Press Help (Alt+H) on any step to inspect the stripped payload.",
	demoDevExchangeTitle: "Token exchange simulation",
	demoDevExchangePending: "Complete the sign-up on the left to observe the token exchange flow.",
	demoDevResetBtn: "Restart demo",
	demoStorageBlockedNote: "Browser storage is blocked; saving answers in session memory.",
	demoOutboxLabel: "Offline outbox",
	demoOutboxCount: "{count} registration(s) waiting to send",
	demoOutboxEmpty: "Outbox empty",
	demoOpenPartnerBtn: "Open partner console",
	demoViewProfileBtn: "View My profile",
	demoRehearsalTitle: "Demo rehearsal checklist",
	demoRehearsal1: "1. Co-designer registers with NVDA, uses Help (Alt+H), chooses 'Refer me'",
	demoRehearsal2: "2. Wifi off: registration still works and queues in outbox",
	demoRehearsal3: "3. Live install: two lines on a blank page",
	widgetStepOf: "Step {current} of {total}",
	widgetReadAloud: "Read aloud",
	widgetReadEnglishBtn: "Read the English version",
	widgetStopReading: "Stop reading",
	widgetNoAmharicVoice: "Your device has no Amharic voice. In the product, Mezgeb provides its own Amharic audio.",
	widgetBack: "Back",
	widgetContinue: "Continue",
	widgetConfirm: "Confirm",
	widgetChange: "Change",
	widgetFinishLaterSms: "Finish later by SMS link",
	widgetSmsModalTitle: "Save and finish later",
	widgetSmsPhoneLabel: "Phone number to receive your resume link",
	widgetSmsSendBtn: "Send resume link",
	widgetSmsBody: "Learnhub: Your sign-up is saved. Continue here:",
	widgetResumeBanner: "Welcome back. Continue from step {step}?",
	widgetResumeBtn: "Continue from step {step}",
	widgetStartFreshBtn: "Start fresh",
	widgetOfflineNotice: "You're offline. Your answers are saved and will send when you reconnect.",
	widgetOfflineQueuedTitle: "Saved. It will send when you're back online.",
	widgetErrorSummaryTitle: "Please check this step before continuing:",
	widgetSpeakBtn: "Speak",
	widgetSpeakChoiceBtn: "Speak to choose",
	widgetRecordingStatus: "Recording… {seconds}s / 20s",
	widgetStopRecording: "Stop recording",
	widgetSendingVoice: "Sending…",
	widgetVoiceTooLarge: "Audio clip is over 1 MB. Please record a shorter answer or type instead.",
	widgetVoiceChoiceConfirm: "Did you mean: {option}?",
	widgetVoiceChoiceNoMatch: "We could not match an option. Please try again or tap an option.",
	widgetTranscribing: "Transcribing voice…",
	widgetTranscriptConfirmTitle: "Is this right? You can change it.",
	widgetTranscriptUse: "Save this answer",
	widgetTranscriptDiscard: "Discard",
	widgetVoiceTimeout: "Voice is slow right now. You can type instead.",
	widgetVoiceNoMic: "Microphone unavailable or permission denied. You can type instead.",
	widgetHelpBtn: "Help (Alt+H)",
	widgetHelpTitle: "Help with this step",
	widgetHelpPlaceholder: "What is confusing or not working?",
	widgetHelpDefaultQuestion: "Please explain what to enter on this screen.",
	widgetHelpAskBtn: "Ask AI",
	widgetHelpOfflineNote: "You can still get help with errors here. Asking your own question needs a connection.",
	widgetHelpTakeMeThere: "Take me there",
	widgetHelpAskPerson: "Ask a person",
	widgetHelpMovedAnnouncement: "Moved to: {label}",
	widgetHelpPartnerMessage: "A partner support worker can register with you in person or by phone. Your answers remain private until you confirm.",
	widgetHelpNoAiFallbackLabel: "Built-in plain guide (no AI used):",
	widgetSimplifyBtn: "Show simpler words",
	widgetSimplifying: "Simplifying…",
	widgetSimplifiedLabel: "Simpler wording:",
	widgetCalGroupLabel: "Calendar system",
	widgetCalEth: "Ethiopian calendar",
	widgetCalGreg: "Gregorian calendar",
	widgetCalDay: "Day",
	widgetCalMonth: "Month",
	widgetCalYear: "Year",
	widgetCalChooseMonth: "Choose month",
	widgetCalConvertedGreg: "Gregorian equivalent:",
	widgetCalConvertedEth: "Ethiopian equivalent:",
	widgetPartnerSelectLabel: "Choose a partner organisation (sample list)",
	widgetPartner1: "Addis Accessibility Centre (sample)",
	widgetPartner2: "Refugee Support Desk (sample)",
	widgetPartner3: "Community TVET Liaison (sample)",
	widgetPartnerConsent: "I agree for this partner to help me complete this form. They will not see private support answers unless I share them.",
	widgetPartnerNotice: "A partner will help you finish. They can see this form, not your answers.",
	widgetPartnerJoinedBanner: "A partner joined. They can see this form, not your answers.",
	widgetSupportPrivacyTitle: "Who can see this",
	widgetSupportNoDiagnosis: "No diagnosis or medical proof is ever asked for.",
	widgetSupportNothingShared: "Nothing is shared unless you switch it on.",
	widgetSupportSessionNote: "Support choices are kept in memory for this session only and are cleared if you reload.",
	widgetSupportSharePlatform: "Learnhub (your learning platform)",
	widgetSupportShareEmployers: "Employers (only if you apply and choose to share)",
	widgetSupportSharePartner: "Partner organisation (only during a help session)",
	widgetSkillsExtractBtn: "Find skills from my story",
	widgetSkillsExtracting: "Reading story for skills…",
	widgetSkillsSuggestedTitle: "Suggested skills (click Keep to add to your profile):",
	widgetSkillsKeepBtn: "Keep",
	widgetSkillsKeepAllBtn: "Keep all",
	widgetSkillsSavedTitle: "Skills saved to your profile:",
	widgetSkillsRemoveLabel: "Remove {skill}",
	widgetSkillsAddPlaceholder: "Add your own skill",
	widgetSkillsAddBtn: "Add skill",
	widgetSkillsFallbackTitle: "Common skills checklist (choose any that fit):",
	widgetReviewTitle: "Review and confirm your answers",
	widgetClearDeviceBtn: "Clear this device",
	widgetDeviceClearedNotice: "All saved answers were removed from this browser.",
	widgetNextScreenTitle: "You're registered.",
	widgetNextScreenBody: "Next: choose your course. Learnhub will text you when it's ready.",
	widgetNextScreenContinue: "View confirmation details",
	widgetSuccessTitle: "You're registered",
	widgetSuccessBody: "Your account profile has been confirmed. If you were offline, it is queued to send automatically on reconnection.",
	widgetSuccessTokenNote: "One-time token issued to learnhub.et:",
	widgetSuccessRestart: "Register another learner (sample)",
	errRequired: "Please answer this question before continuing.",
	errPhoneFormat: "Enter a 10-digit Ethiopian phone number starting with 09 or 07.",
	errDateInvalid: "Enter a valid day, month, and 4-digit year.",
	errPartnerRequired: "Select a partner organisation and tick the consent box to continue.",
	helpErrREQUIRED: "This question needs an answer before you can move forward. Type or choose an answer in the field below.",
	helpErrPHONE_INVALID: "Enter a 10-digit number that starts with 09 or 07.",
	helpErrDATE_INVALID: "Check the day, select a month from the list, and enter a 4-digit year such as 1990 (Ethiopian) or 1997 (Gregorian).",
	helpErrID_ROUTE_REQUIRED: "Choose one of the four ways to show who you are. You do not need a Fayda ID to register.",
	helpErrPARTNER_CONSENT_REQUIRED: "Pick a partner organisation from the dropdown and tick the consent box underneath it.",
	helpErrCONSENT_REQUIRED: "Tick the agreement box at the bottom of the review screen before pressing Confirm.",
	helpTypeText: "Type your answer into the box, or press Speak if voice is available.",
	helpTypePhone: "Enter a 10-digit Ethiopian mobile number starting with 09 or 07.",
	helpTypeDate: "Enter the day and 4-digit year, and pick the month. You can switch between Ethiopian and Gregorian calendars.",
	helpTypeChoice: "Choose one option from the list below.",
	helpTypeMultichoice: "Select as many options as apply to you, or skip if none apply.",
	helpTypeIdRoutes: "Pick any ID option you have, or choose Refer me so a partner organisation can help.",
	helpTypeSupport: "Pick practical support that helps you. Sharing is off by default until you switch it on.",
	helpTypeWorkStory: "Write or speak about any paid or unpaid work you have done, then choose the skills you want to keep.",
	helpTypeReview: "Check your answers. Use Change next to any line to edit it, then tick the box and press Confirm.",
	templatesTitle: "Sign-up Templates",
	templatesSubtitle: "Start with an accessible template built for one question per screen, plain language, and flexible ID routes.",
	templatesQuestionsCount: "{count} questions",
	templatesIdRoutesLabel: "ID routes:",
	templatesPreviewBtn: "Preview",
	templatesUseBtn: "Use in playground",
	templatesJsonShow: "Show template JSON",
	templatesJsonHide: "Hide template JSON",
	templatesBuilderTitle: "Build a template with AI",
	templatesBuilderDesc: "Paste your current sign-up fields or describe what your organisation needs. Mezgeb checks for accessibility issues and drafts a one-question-per-screen template.",
	templatesBuilderStartFrom: "Start from",
	templatesBuilderInputLabel: "Paste your current sign-up fields or describe what you need",
	templatesBuilderPlaceholder: "Full name, email, phone, date of birth, highest education, which centre you want to attend",
	templatesBuilderLangLabel: "Primary draft focus",
	templatesBuilderDraftBtn: "Draft template",
	templatesBuilderDrafting: "Drafting template…",
	templatesBuilderFallbackNotice: "AI drafting was unavailable or timed out. Loaded the base template so you can edit questions manually below.",
	templatesValidationErrorsTitle: "Template validation issues:",
	templatesCheckerTitle: "Question checker",
	templatesCheckerEmpty: "No accessibility or data-minimisation warnings found.",
	templatesCheckerApply: "Apply suggestion",
	templatesCheckerEdit: "Edit this question",
	templatesCheckerDismiss: "Dismiss",
	templatesEditorTitle: "Editable question list",
	templatesPreviewPaneTitle: "Live form preview",
	templatesMoveUp: "Move up",
	templatesMoveDown: "Move down",
	templatesDeleteQ: "Delete",
	templatesAddQ: "+ Add question",
	playgroundTitle: "Integration Playground",
	playgroundSubtitle: "Configure Mezgeb for your platform, generate your embed and server code, and run a live registration test.",
	playgroundSettingsTitle: "Settings",
	playgroundTemplateLabel: "Template",
	playgroundSiteKeyLabel: "Site key (publishable)",
	playgroundDefaultLangLabel: "Default language",
	playgroundTypeLabel: "Integration type",
	playgroundTypeEmbed: "Embedded (<mezgeb-register>)",
	playgroundTypeButton: "\"Sign up with Mezgeb\" button",
	playgroundAccentLabel: "Accent colour",
	playgroundAccentContrastPass: "Contrast ratio {ratio}:1 against white text (passes WCAG AA 4.5:1).",
	playgroundAccentContrastFail: "Contrast ratio {ratio}:1 against white text is below WCAG AA (4.5:1). Choose a darker colour so button labels stay readable.",
	playgroundHostingLabel: "Hosting",
	playgroundHostingHosted: "Hosted service",
	playgroundHostingLite: "Self-hosted (lite profile)",
	playgroundHostingFull: "Self-hosted (full profile)",
	playgroundTabPage: "Your page",
	playgroundTabServer: "Your server",
	playgroundTabWebhook: "Webhook",
	playgroundTabSelfHost: "Self-hosting",
	playgroundTestBtn: "Run a test registration",
	playgroundTestResultTitle: "Simulated token exchange result",
	jobsTitle: "Jobs & Accommodations",
	jobsSubtitle: "Sample career board showing private support-needs filtering, apply-by-voice, and employer JobPosting JSON-LD output.",
	jobsTabSeeker: "For job seekers",
	jobsTabEmployer: "For employers",
	jobsPrivateFilterTitle: "Support I need (private filter)",
	jobsPrivateFilterNote: "Filters stay on your device. Employers never see them.",
	jobsMatchBadge: "{met} of {total} needs met",
	jobsNoFilterBadge: "No filters selected",
	jobsRemoteLabel: "Remote",
	jobsApplyVoiceBtn: "Apply by voice",
	jobsApplyDialogTitle: "Apply: {title}",
	jobsApplyResultTitle: "Simulated application submitted",
	jobsApplyResultNote: "Support needs are included only if you switched sharing ON in this application.",
	jobsEmployerIntro: "List the workplace accommodations your organisation can offer for a role. Mezgeb outputs standard schema.org/JobPosting JSON-LD so job boards can power private filtering.",
	jobsEmployerOutputTitle: "Generated schema.org/JobPosting JSON-LD",
	jobsEmployerExplain: "Job boards can read this JSON-LD to let candidates filter by accommodations privately.",
	partnerTitle: "Partner Console",
	partnerBanner: "Simulated partner console for demonstration",
	partnerSubtitle: "When a learner chooses 'Refer me through a partner' in the Live Demo, their session appears here with every typed answer masked.",
	partnerOpenDemoLink: "Open Live Demo",
	partnerNoSessions: "No active referral sessions yet. Choose 'Refer me through a partner' in /demo to start one.",
	partnerStepLabel: "Current step: {step} of {total}",
	partnerMaskedTitle: "Form structure (learner answers are masked)",
	partnerJoinBtn: "Join session",
	partnerJoinedLabel: "Joined session",
	partnerConfirmBtn: "Confirm identity",
	partnerVerifiedLabel: "Identity confirmed (partner_verified)",
	profileTitle: "My Profile",
	profileSubtitle: "View and update the profile from your last completed registration, or manage who can see your support needs.",
	profileEmptyTitle: "No profile saved on this device yet",
	profileEmptyBody: "Complete a registration in the Live Demo to view and edit your profile here.",
	profileGoDemo: "Go to Live Demo",
	profileEditDialogTitle: "Update answer",
	profileVerifiedBadge: "Verified by partner",
	profilePendingBadge: "Pending partner confirmation",
	profileWhoCanSeeTitle: "Who can see my support needs",
	profileDeleteBtn: "Delete my profile from this device",
	profileDeletedNotice: "Your saved profile and answers have been deleted from this device.",
	a11yPageTitle: "Accessibility Statement",
	a11yPageIntro: "Mezgeb is built to meet WCAG 2.2 Level AA so learners who use screen readers, keyboards, voice, or high zoom can register independently.",
	a11yStandardHeading: "Standard targeted",
	a11yStandardBody: "Web Content Accessibility Guidelines (WCAG) 2.2 Level AA.",
	a11yTestedHeading: "What has been tested",
	a11yTestedBody: "Keyboard-only navigation, visible 3px focus indicators, ARIA landmarks and live announcements, focus-trapped dialogs, and 200% zoom at 320px width. Full screen reader testing with NVDA and TalkBack is to be completed by the team.",
	a11yLimitsHeading: "Known limitations",
	a11yLimitsBody: "Browser-based speech synthesis depends on the voices installed on the user's device; devices without an Amharic voice fall back to offering English audio or pre-recorded template audio files when provided.",
	a11yReportHeading: "Report a problem",
	a11yReportBody: "If you encounter any barrier while testing Mezgeb, write to hello@mezgeb.example or open an issue on GitHub.",
	docsBanner: "Draft documentation for team discussion.",
	docsNavTitle: "Documentation",
	docsMenuBtn: "Docs menu",
	docsOnThisPage: "On this page",
	tplLearningName: "Learning platform",
	tplLearningDesc: "Bootcamps, TVETs, and online courses (9 questions; all four ID routes).",
	tplJobSeekerName: "Job board: job seeker",
	tplJobSeekerDesc: "People looking for work (skills from stories, work history, interview support, private job filter).",
	tplEmployerName: "Employer sign-up",
	tplEmployerDesc: "Companies posting jobs (job title, company, location, accommodations the company can offer).",
	tplProgrammeName: "Programme intake",
	tplProgrammeDesc: "NGOs registering people (fewest fields; all four ID routes; partner registration on by default).",
	tplJobAppName: "Job application",
	tplJobAppDesc: "Short voice-ready application with private interview support preferences.",
	qLangLabel: "Which language do you prefer?",
	qLangHint: "You can change this at any time.",
	qFullNameLabel: "What is your full name?",
	qFullNameHint: "Use the name people know you by.",
	qAreaLabel: "Which area do you live in?",
	qAreaHint: "Sub-city in Addis Ababa, or choose Other.",
	qPhoneLabel: "What is your phone number?",
	qPhoneHint: "10 digits starting with 09 or 07.",
	qDobLabel: "When were you born?",
	qDobHint: "Ethiopian calendar is selected by default.",
	qIdRouteLabel: "How will you show who you are?",
	qIdRouteHint: "Choose any option. You do not need a Fayda ID to start.",
	qSupportLabel: "Is there any support that helps you learn or test?",
	qSupportHint: "Private by default. No diagnosis or medical documents asked.",
	qWorkStoryLabel: "Tell us about work you have done",
	qWorkStoryHint: "Paid or unpaid work, helping family, or community tasks all count.",
	qJobTitleLabel: "What is the job title?",
	qJobTitleHint: "Use a clear, plain title, e.g. Junior data clerk.",
	qCompanyNameLabel: "What is your company or organisation name?",
	qCompanyNameHint: "Shown on job listings you publish.",
	qJobLocationLabel: "Where is the job located?",
	qJobLocationHint: "City, sub-city, or Remote.",
	qContactRoleLabel: "Who is the main hiring contact?",
	qContactRoleHint: "Name and role, e.g. Selamawit, HR Coordinator.",
	qEmployerAccomLabel: "Which workplace accommodations can your company offer?",
	qEmployerAccomHint: "Published on job listings so candidates can filter privately.",
	qJobGoalLabel: "What kind of work are you looking for?",
	qJobGoalHint: "Type or speak in your own words.",
	qInterviewSupportLabel: "Do you need support for the interview?",
	qInterviewSupportHint: "Private by default. Shared only if you switch sharing on.",
	qWhyWantJobLabel: "Why do you want this job?",
	qWhyWantJobHint: "Speak or type a few sentences in Amharic or English.",
	qStartWhenLabel: "When can you start?",
	qStartWhenHint: "Choose the closest option.",
	qConsentLearning: "I agree to create a profile on this learning platform.",
	qConsentJobSeeker: "I agree to save my job seeker profile and private support filters.",
	qConsentEmployer: "I confirm our organisation can provide the selected workplace accommodations.",
	qConsentProgramme: "I agree to register with this programme or through my chosen partner.",
	qConsentJobApp: "I agree to send this application to the employer.",
	optLangAm: "Amharic (አማርኛ)",
	optLangEn: "English",
	optStartImmediate: "Right away",
	optStartTwoWeeks: "Within two weeks",
	optStartOneMonth: "Within one month",
	optAreaAddisKetema: "Addis Ketema",
	optAreaAkaky: "Akaky Kaliti",
	optAreaArada: "Arada",
	optAreaBole: "Bole",
	optAreaGullele: "Gullele",
	optAreaKirkos: "Kirkos",
	optAreaKolfe: "Kolfe Keranio",
	optAreaLemiKura: "Lemi Kura",
	optAreaLideta: "Lideta",
	optAreaNifasSilk: "Nifas Silk-Lafto",
	optAreaYeka: "Yeka",
	optAreaOther: "Other city or region",
	optSupportScreenReader: "Screen reader",
	optSupportExtraTime: "Extra time",
	optSupportStepFree: "Step-free access",
	optSupportSignLang: "Sign language interpreter",
	optSupportLargePrint: "Large text / high contrast",
	optSupportQuietRoom: "Quiet space",
	optSupportFlexibleHours: "Flexible hours",
	optSupportRemote: "Remote work option",
	optCommonSkillSales: "Sales",
	optCommonSkillBookkeeping: "Bookkeeping",
	optCommonSkillCustomer: "Customer service",
	optCommonSkillTailoring: "Tailoring / craft",
	optCommonSkillDigital: "Basic computer use",
	optCommonSkillTeaching: "Tutoring / helping others",
	widgetSkipQuestion: "Skip this question",
	widgetHiddenByRule: "This question is hidden by its rule",
	errEmailFormat: "Enter a valid email address, such as name@example.com.",
	errNumberFormat: "Enter a valid number.",
	errDigitsOnly: "Use numbers (0–9) only.",
	errLettersOnly: "Use letters only.",
	errMinLength: "Enter at least {min} characters.",
	errMaxLength: "Keep this answer under {max} characters.",
	errMinNumber: "Enter a number of {min} or more.",
	errMaxNumber: "Enter a number of {max} or less.",
	helpErrEMAIL_INVALID: "Enter an email address with an @ sign, such as selam@example.com, or skip if optional.",
	helpErrNUMBER_INVALID: "Enter a whole or decimal number using digits only.",
	helpErrMIN_LENGTH: "Your answer is a little short. Please add a few more characters.",
	helpErrMAX_LENGTH: "Your answer is longer than allowed. Please shorten it slightly.",
	helpErrDIGITS_ONLY: "Type digits (0–9) only without letters.",
	helpErrLETTERS_ONLY: "Type letters without numbers.",
	helpErrNUMBER_RANGE: "Check the minimum and maximum number shown in the error message.",
	helpTypeYesNo: "Choose Yes or No below.",
	helpTypeEmail: "Enter an email address if you have one, or skip if it is optional.",
	helpTypeNumber: "Type a number into the box using digits.",
	helpTypeInfo: "Read or listen to this information, then press Continue.",
	helpTypeConsent: "Read the statement carefully and tick the box to confirm.",
	idRouteFayda: "Fayda",
	idRouteRefugee: "Refugee ID",
	idRouteOther: "Other document",
	idRoutePartner: "Partner referral",
	featVoice: "Voice",
	featReadAloud: "Read aloud",
	featHelp: "Help",
	featPartner: "Partner",
	featOffline: "Offline",
	featSms: "SMS resume",
	featSimplify: "Plain words",
	catLearning: "Learning",
	catJobs: "Jobs",
	catEmployer: "Employers",
	catNgo: "NGOs",
	catCustom: "My template",
	templatesSearchLabel: "Search templates",
	templatesSearchPlaceholder: "Search templates",
	templatesResultCount: "{count} templates",
	templatesResultCountOne: "1 template",
	templatesFilterAll: "All",
	templatesFilterLearning: "Learning",
	templatesFilterJobs: "Jobs",
	templatesFilterEmployer: "Employers",
	templatesFilterNgo: "NGOs",
	templatesFilterMine: "My templates",
	templatesEmptySearch: "No templates match your filter. Try clearing the search box.",
	templatesEmptyMine: "You have not saved any templates yet. Open the builder to create and save one.",
	templatesTestedBadge: "Tested wording",
	templatesBestForLabel: "Best for:",
	templatesEstimateTime: "About {min} min",
	templatesBothLangs: "Amharic and English",
	templatesCollectsLabel: "Collects:",
	templatesSensitiveBadge: "Sensitive",
	templatesCustomizeBtn: "Customize",
	templatesBuildAiLink: "Build a template with AI",
	templatesOpenBuilderBtn: "Open Template Builder",
	templatesEditedOn: "Edited {date}",
	templatesMoreActions: "Template actions",
	templatesActionDuplicate: "Duplicate",
	templatesActionRename: "Rename",
	templatesActionExport: "Export JSON",
	templatesActionDelete: "Delete",
	templatesRenameTitle: "Rename template",
	templatesRenameLabelEn: "Template name (English)",
	templatesRenameLabelAm: "Template name (Amharic)",
	templatesDeleteTitle: "Delete saved template?",
	templatesDeleteConfirm: "Remove \"{name}\" from My templates? This cannot be undone.",
	templatesDeleteBtn: "Delete template",
	templatesCompareBtn: "Compare templates",
	templatesCompareColTemplate: "Template",
	templatesCompareColQuestions: "Questions",
	templatesCompareColTime: "Estimated time",
	templatesCompareColRoutes: "ID routes",
	templatesCompareColVoice: "Voice",
	templatesCompareColPartner: "Partner referral",
	templatesCompareColSensitive: "Collects sensitive data",
	templatesPreviewTabPreview: "Preview",
	templatesPreviewTabQuestions: "Questions",
	templatesPreviewTabJson: "JSON",
	templatesPreviewPhone: "Phone",
	templatesPreviewDesktop: "Desktop",
	templatesPreviewQuestionsHeading: "Click a question to jump to it",
	builderTitle: "Template Builder",
	builderNamePlaceholder: "Untitled template",
	builderStatusSaved: "Saved",
	builderStatusSaving: "Saving…",
	builderStatusUnsaved: "Unsaved changes",
	builderUndo: "Undo",
	builderRedo: "Redo",
	builderShortcutsBtn: "Shortcuts",
	builderCheckBtn: "Check template",
	builderPreviewBtn: "Preview",
	builderExportBtn: "Export",
	builderUsePlaygroundBtn: "Use in playground",
	builderBackGallery: "Back to templates",
	builderNewTemplateBtn: "Start over",
	builderStartTitle: "Create or customize a sign-up template",
	builderStartSubtitle: "Every template stays accessible with one question per screen and Amharic and English labels.",
	builderStartFromTplTitle: "Start from a template",
	builderStartFromTplDesc: "Pick one of the four built-in templates and adapt its questions, ID routes, or theme.",
	builderStartDescribeTitle: "Describe what you need",
	builderStartDescribeDesc: "Describe your programme or learners, and Mezgeb AI drafts a plain-language template.",
	builderStartDescribeAiOffNote: "Needs an online AI connection. When offline or when AI is off, start from a template or paste your current form.",
	builderStartPasteTitle: "Paste your current form",
	builderStartPasteDesc: "Paste field names (one per line or comma-separated). Mezgeb guesses each question type offline and runs the checker.",
	builderStartPastePlaceholder: "Full name\nPhone number\nEmail\nDate of birth\nRegion\nEducation level",
	builderStartPasteCreateBtn: "Turn fields into questions",
	builderStartPasteAiBtn: "Improve with AI",
	builderImportJsonLink: "Import JSON",
	builderImportJsonTitle: "Import template JSON",
	builderImportJsonDesc: "Paste exported Mezgeb template JSON or upload a .json file.",
	builderImportJsonFileLabel: "Upload JSON file",
	builderImportJsonTextLabel: "Or paste JSON here",
	builderImportJsonBtn: "Import template",
	builderImportJsonBadFormat: "Could not read this JSON. Please check the file or syntax.",
	builderTabOutline: "Outline",
	builderTabEdit: "Edit",
	builderTabPreview: "Preview",
	builderPanelOutlineHeading: "Outline",
	builderPanelEditHeading: "Edit question",
	builderPanelPreviewHeading: "Preview",
	builderAddSectionBtn: "Add section",
	builderNewSectionName: "New section",
	builderUnsortedSection: "Unsorted",
	builderRenameSection: "Rename section",
	builderDeleteSection: "Delete section",
	builderAddQuestionBtn: "Add question",
	builderRequiredBadge: "Required",
	builderSensitiveBadge: "Sensitive",
	builderBranchBadge: "Conditional",
	builderMoveToSection: "Move to section…",
	builderMovedAnnouncement: "{label} moved to position {pos}",
	builderSectionMovedAnnouncement: "{label} moved to {section}",
	builderDeletedToast: "Removed \"{label}\".",
	builderUndoDeleteBtn: "Undo",
	builderNoQuestionSelected: "Select a question from the Outline to edit it, or add a new question.",
	qLibTitle: "Add a question",
	qLibTabReady: "Ready-made",
	qLibTabBlank: "Blank question",
	qLibAddBtn: "Add",
	qLibBlankBtn: "Create blank",
	inspTabQuestion: "Question",
	inspTabSettings: "Template settings",
	inspTabLook: "Look",
	inspTabChecker: "Checker",
	inspTabExport: "Export",
	inspGroupQuestion: "Question",
	inspTypeLabel: "Question type",
	inspTypeChangeWarn: "Changing to this type will remove the existing answer options.",
	inspLabelEn: "Label (English)",
	inspLabelAm: "Label (Amharic)",
	inspCharsCount: "{count} chars",
	inspMissingBadge: "Missing",
	inspHintEn: "Hint (English)",
	inspHintAm: "Hint (Amharic)",
	inspPlaceholderEn: "Placeholder (English)",
	inspPlaceholderAm: "Placeholder (Amharic)",
	inspTestReadAloud: "Read aloud",
	inspGroupOptions: "Answer options",
	inspOptValue: "Saved value",
	inspOptEn: "English label",
	inspOptAm: "Amharic label",
	inspOptAdd: "+ Add option",
	inspOptPasteBtn: "Paste options",
	inspOptPasteLabel: "One option per line (English)",
	inspOptPasteApply: "Add pasted options",
	inspOptAddOther: "+ Add 'Other'",
	inspOptAddPreferNot: "+ Add 'Prefer not to say'",
	inspOptDelete: "Remove option",
	inspYesNoEditNote: "Edit the labels shown on the Yes and No buttons.",
	inspGroupRules: "Rules",
	inspRequiredToggle: "Required question",
	inspSkippableToggle: "Show \"Skip this question\" button",
	inspSkippableDisabledNote: "Only available when Required is turned off.",
	inspPresetLabel: "Validation rule",
	inspPresetNone: "None",
	inspPresetPhone: "Ethiopian phone (09 / 07)",
	inspPresetEmail: "Email address",
	inspPresetDigits: "Digits only (0–9)",
	inspPresetLetters: "Letters only",
	inspMinLength: "Minimum characters",
	inspMaxLength: "Maximum characters",
	inspMinVal: "Minimum number",
	inspMaxVal: "Maximum number",
	inspGroupShowIf: "Show this question only if…",
	inspShowIfQuestion: "Earlier question",
	inspShowIfAlways: "Always show this question",
	inspShowIfEquals: "Equals answer",
	inspShowIfSummary: "Shown only if \"{question}\" is \"{answer}\".",
	inspShowIfRemove: "Remove condition",
	inspShowIfNoEarlier: "Add an earlier question first to set a condition.",
	inspGroupA11y: "Accessibility and voice",
	inspAllowVoiceToggle: "Allow voice answers",
	inspAudioAmLabel: "Amharic audio URL (optional)",
	inspAudioEnLabel: "English audio URL (optional)",
	inspAudioPlayTest: "Play test",
	inspAudioPlayError: "Could not play that audio URL.",
	inspIconLabel: "Question icon",
	inspErrorHelpEn: "Plain error help (English)",
	inspErrorHelpAm: "Plain error help (Amharic)",
	inspGroupPrivacy: "Data and privacy",
	inspMapsToLabel: "Saves to field (maps_to)",
	inspMapsToDuplicate: "Another question already saves to \"{field}\". Pick a unique field name.",
	inspSensitiveToggle: "Sensitive personal data",
	inspSensitiveExplain: "Sensitive answers are never sent to AI and are hidden from partners.",
	inspGroupAi: "AI tools",
	inspAiImproveBtn: "Improve wording",
	inspAiTranslateBtn: "Translate missing language",
	inspAiCheckBtn: "Check this question",
	inspAiSuggestionTitle: "AI suggestion (review before accepting)",
	inspAiTranslateNeedsReview: "AI translation, needs review",
	inspAiTranslateReviewed: "Reviewed",
	inspAiAcceptBtn: "Accept",
	inspAiDiscardBtn: "Discard",
	inspAiNothingMissing: "Both English and Amharic labels are already filled in.",
	inspAiUnavailable: "AI tools require an online connection and AI switched on in the preview toggles.",
	setCategoryLabel: "Category",
	setBestForEn: "Best for (English)",
	setBestForAm: "Best for (Amharic)",
	setDescEn: "Description (English)",
	setDescAm: "Description (Amharic)",
	setIdRoutesTitle: "Accepted ID routes",
	setIdRoutesError: "Select at least one ID route.",
	setIdRoutesFaydaWarn: "Learners without a Fayda ID will be blocked.",
	setSupportTitle: "Default support options",
	setSupportRestoreBtn: "Restore defaults",
	setFeaturesTitle: "Enabled features",
	setFeatVoiceDesc: "Learners can record spoken answers in Amharic or English.",
	setFeatReadAloudDesc: "Shows the Read aloud button on every screen.",
	setFeatHelpDesc: "Shows Help (Alt+H) with plain guidance and optional AI.",
	setFeatPartnerDesc: "Allows trusted partners to co-register beside the learner.",
	setFeatSmsDesc: "Shows \"Finish later by SMS link\" at the bottom of the form.",
	setFeatOfflineDesc: "Saves progress on the device and queues submissions offline.",
	setFeatSimplifyDesc: "Shows \"Show simpler words\" next to the question heading.",
	setConsentTitle: "Consent statement",
	setConsentEn: "Consent text (English)",
	setConsentAm: "Consent text (Amharic)",
	setConsentRecommendedBtn: "Use recommended wording",
	lookPlatformName: "Platform name",
	lookLogoLetter: "Logo letter",
	lookAccentLabel: "Accent colour",
	lookContrastPass: "Passes AA ({ratio}:1 contrast with white text)",
	lookContrastFail: "Too light for white text ({ratio}:1) — choose a darker colour",
	lookSaveBlockedNote: "Fix the accent colour contrast before saving or exporting.",
	checkerSummary: "{must} must fix · {should} should fix · {tips} tips",
	checkerMustBadge: "Must fix",
	checkerShouldBadge: "Should fix",
	checkerTipBadge: "Tip",
	checkerEmpty: "All checks passed. Your template is ready to save and export.",
	checkerGoToBtn: "Go to question",
	checkerFixBtn: "Fix",
	checkerRunAiBtn: "Run AI check",
	checkerAiRunning: "Checking with AI…",
	checkerAiTag: "AI finding",
	exportEmbedTitle: "Embed code",
	exportCopyJson: "Copy JSON",
	exportDownloadJson: "Download JSON",
	exportOpenPlayground: "Open in playground",
	exportSaveMyTemplates: "Save to My templates",
	exportSavedSuccess: "Saved to My templates. It now appears in the Template Gallery.",
	exportStorageBlocked: "Browser storage is blocked in this context. Use Download JSON to keep a copy.",
	exportValidationBlocked: "Fix all \"Must fix\" issues in the Checker before saving or using in playground.",
	previewAiOff: "AI off",
	previewOffline: "Offline",
	previewRestart: "Restart preview",
	previewNoSaveNote: "Preview answers are never saved.",
	shortcutsTitle: "Keyboard shortcuts",
	shortcutAltArrows: "Move selected question up or down",
	shortcutDuplicate: "Duplicate selected question",
	shortcutDelete: "Delete selected question (with Undo)",
	shortcutUndo: "Undo last change",
	shortcutRedo: "Redo change",
	shortcutCheck: "Run template checker",
	shortcutHelp: "Open this shortcuts list",
	navHowItWorks: "How it works",
	navTryDemo: "Try the demo",
	navAddToSite: "Add to your site",
	navMainAria: "Main navigation",
	navMobileAria: "Mobile navigation",
	footerColProduct: "Product",
	footerColDevelopers: "Developers",
	footerColProject: "Project",
	footerLinkApi: "REST API",
	footerLinkEmployerForm: "Employer accommodations",
	footerLinkPartner: "Partner console",
	footerLinkSource: "Source code",
	footerLicenceLabel: "Apache-2.0 licence",
	footerHackathonCredit: "Built for the Digital Bridge Accessibility Hackathon 2026",
	copyCodeBtn: "Copy code",
	landingHeroLabel: "Accessible sign-up for Ethiopian platforms",
	landingHeroH1Line1: "Onboarding",
	landingHeroH1Line2: "that listens.",
	landingHeroBody: "Mezgeb is a sign-up and profile form you add to your site with two lines of code. Learners can speak or type each answer, in Amharic or English, on a cheap phone, even offline.",
	landingHeroSeeCode: "See the code",
	landingHeroDemoVoiceQ: "What is your name?",
	landingHeroDemoTranscript: "Hana Tesfaye",
	landingHeroFact1: "Works with NVDA and TalkBack",
	landingHeroFact2: "Amharic and English",
	landingHeroFact3: "Works offline",
	landingHeroFact4: "Open source",
	landingWhyStatement: "Many sign-up forms time out, hide labels, and demand documents some learners do not have.",
	landingWhyCol1Lead: "Forms that time out",
	landingWhyCol1Body: "Slow connections and screen readers need time to read every field. Mezgeb saves each answer immediately with no countdown.",
	landingWhyCol2Lead: "Questions only some can read",
	landingWhyCol2Body: "Tiny text and missing labels block blind learners and new readers. Every question has one clear label, read-aloud audio, and a voice button.",
	landingWhyCol3Lead: "Proof people do not have",
	landingWhyCol3Body: "Many displaced and rural learners do not hold a kebele ID or Fayda card yet. Mezgeb supports refugee IDs, other documents, and partner vouching.",
	landingFeaturesLabel: "What learners get",
	landingFeaturesHeading: "What learners get",
	landingFeat1Title: "Speak each answer",
	landingFeat1Body: "Learners tap the microphone button, speak in Amharic or English, and review the transcript before keeping it. Nothing is saved without confirmation.",
	landingFeat1Link: "Try voice sign-up",
	landingFeat2Title: "One question per screen",
	landingFeat2Body: "Each screen asks one clear question with large Back and Save and continue buttons. Focus moves cleanly to the next heading.",
	landingFeat2Link: "Try the learner flow",
	landingFeat3Title: "ID routes for everyone",
	landingFeat3Body: "Platforms can accept Fayda, refugee ID, another document, or a trusted partner vouching beside the learner.",
	landingFeat3Link: "See partner console",
	landingFeat4Title: "Ask for support privately",
	landingFeat4Body: "Learners can note practical needs like extra time or a sign language interpreter without medical proof. Sharing stays off unless they switch it on.",
	landingFeat4Link: "Read privacy details",
	landingFeat5Title: "Keeps working offline",
	landingFeat5Body: "When the network drops, answers stay saved on the phone and wait in an outbox until the connection returns.",
	landingFeat5Link: "Test offline mode",
	landingPlatformsHeading: "Add it in an afternoon",
	landingPlatStep1Title: "Pick a template",
	landingPlatStep1Body: "Start with Learning platform, Job seeker, Employer, or Programme intake.",
	landingPlatStep2Title: "Add two lines",
	landingPlatStep2Body: "Load the script and place the register element on your sign-up page.",
	landingPlatStep3Title: "Receive the profile",
	landingPlatStep3Body: "Exchange the one-time token on your server or listen for the webhook.",
	landingPlatLinkDocs: "Read the docs",
	landingPlatLinkPlayground: "Open the playground",
	landingPlatLinkOpenApi: "See the OpenAPI spec",
	landingTemplatesHeading: "Start from a template",
	landingTemplatesPrev: "Previous templates",
	landingTemplatesNext: "Next templates",
	landingTemplatesQuestionsCount: "{count} questions",
	landingTemplatesLangs: "Amharic, English",
	widgetWelcomeTitle: "Create your profile",
	widgetWelcomeLine1: "This form asks a few short questions to set up your profile.",
	widgetWelcomeLine2: "Every answer saves as you go on this phone.",
	widgetWelcomeLine3: "There is no time limit, and you can stop and come back.",
	widgetWelcomeLangHeading: "Choose your language",
	widgetWelcomeStart: "Start",
	widgetWelcomeHaveLink: "I have a saved link",
	widgetWelcomeResumePrompt: "Paste your saved link or resume code",
	widgetWelcomeResumeOpen: "Open saved session",
	widgetModeHeading: "How do you want to answer?",
	widgetModeHint: "You can change this at any time from the top bar.",
	widgetModeSpeakTitle: "Speak and listen",
	widgetModeSpeakDesc: "Hear questions read aloud and speak your answers by voice.",
	widgetModeTypeTitle: "Read and type",
	widgetModeTypeDesc: "Read each question on screen and type your answers.",
	widgetModeSimpleTitle: "Simple words with pictures",
	widgetModeSimpleDesc: "Short wording with a large icon beside every question.",
	widgetModeSwitchLabel: "Answer mode",
	widgetModeAutoReadLabel: "Auto-read questions",
	widgetSaveContinue: "Save and continue",
	widgetSpeakAnswerLabel: "Speak your answer",
	widgetVoiceListeningLabel: "Listening… tap to stop",
	widgetVoiceProcessingLabel: "Writing what you said…",
	widgetVoiceKeepBtn: "Keep",
	widgetVoiceTryAgainBtn: "Try again",
	widgetVoiceFailedMsg: "We could not hear that. Try again or type your answer.",
	widgetOfflineBanner: "You are offline. Your answers are saved on this phone and will send when you reconnect.",
	widgetOutboxSendingBanner: "Sending {count} queued answers…",
	widgetOutboxSentBanner: "All queued answers sent.",
	widgetSessionRestored: "Welcome back. You were on question {step}.",
	widgetDobThatIs: "That is {date}",
	widgetOtherDocUploadLabel: "Upload a photo of your document",
	widgetOtherDocCameraLabel: "Take a photo with camera",
	widgetOtherDocSelected: "Selected file: {name}",
	widgetSupportShareToggle: "Share this with the platform",
	widgetSupportShareExplainOn: "On: the platform team sees these practical support requests.",
	widgetSupportShareExplainOff: "Off: your support needs stay only on your profile.",
	widgetSupportPrivateBadge: "Private",
	widgetDoneGetLink: "Get a link to continue later",
	widgetHelpCloseBtn: "Close help",
	widgetHelpExampleLabel: "Example answer",
	widgetHelpAskFieldLabel: "Ask a question about this field",
	widgetAssistedBanner: "You are filling this in with {name}. They must agree before it is sent.",
	widgetAssistedSelfConsentTitle: "Learner confirmation",
	widgetAssistedSelfConsentBody: "Please hand the phone to the learner to confirm they want to send this profile.",
	demoSettingsToggle: "Demo settings",
	demoStateTriggersLabel: "Preview widget states",
	demoTriggerError: "Field error",
	demoTriggerVoiceListen: "Voice listening",
	demoTriggerVoiceReview: "Voice review",
	demoTriggerVoiceFail: "Voice failed",
	demoTriggerOutboxSending: "Sending queued",
	demoTriggerHelpOpen: "Help panel",
	demoTriggerSmsSent: "Resume link sent",
	demoTriggerRestored: "Session restored",
	demoSimulatedVoiceSample: "Hana Tesfaye",
	templatesNewBtn: "New template",
	templatesImportBtn: "Import JSON",
	templatesLangFilterLabel: "Language",
	templatesLangFilterAll: "All languages",
	templatesLangFilterAmEn: "Amharic and English",
	templatesSampleBadge: "Sample",
	templatesAiCardTitle: "Create with AI",
	templatesAiCardLabel: "Describe who is signing up",
	templatesAiCardPlaceholder: "For example: young mechanics applying for an evening course in Hawassa",
	templatesAiCardBtn: "Draft a template",
	templatesAiDisabledOffline: "Connect to the internet to draft a template with AI.",
	templatesCardFacts: "{count} questions · {langs} · {routes} ID routes",
	builderModeToggleLabel: "Preview mode",
	builderMoveUpBtn: "Move up",
	builderMoveDownBtn: "Move down",
	builderSectionQuestion: "Question",
	builderSectionAnswer: "Answer",
	builderSectionRules: "Rules",
	builderSectionVoiceAudio: "Voice and audio",
	builderSectionChecks: "Checks",
	builderUseThisBtn: "Use this",
	builderDismissBtn: "Dismiss",
	builderSuggestSimpleBtn: "Suggest simpler wording",
	builderTranslateAmBtn: "Translate to Amharic",
	playgroundThemeLabel: "Theme",
	playgroundThemeLight: "Light",
	playgroundThemeHc: "High contrast",
	playgroundEventsTitle: "Events log",
	playgroundEventColName: "Event",
	playgroundEventColTime: "Time",
	playgroundEventColPayload: "Payload",
	playgroundViewJsonBtn: "View JSON",
	playgroundLevelScript: "Script tag",
	playgroundLevelApi: "REST API",
	playgroundLevelJobPosting: "Standards (schema.org JobPosting)",
	docsPrevPage: "Previous",
	docsNextPage: "Next",
	docsTryInPlayground: "Try it",
	docsEndpointReqTitle: "Request fields",
	docsEndpointResTitle: "Response fields",
	jobsPrivateFilterHint: "This filter stays on your phone. Employers do not see it.",
	jobsAboutHeading: "About the job",
	jobsNeedHeading: "What you need",
	jobsSupportHeading: "Support the employer offers",
	jobsHowToApplyHeading: "How to apply",
	jobsApplyTypeBtn: "Apply by typing",
	outboxPendingCount: "{count} answers waiting to send",
	jobsAccomScreenReader: "Screen reader friendly application",
	jobsAccomExtraTime: "Extra time on tasks",
	jobsAccomStepFree: "Step-free access",
	jobsAccomSignLanguage: "Sign language interpreter",
	jobsAccomLargePrint: "Large print materials",
	jobsAccomQuietRoom: "Quiet workspace",
	jobsAccomFlexibleHours: "Flexible hours",
	jobsAccomRemote: "Remote work option",
	employerAccomTitle: "Employer accommodations",
	employerAccomSubtitle: "Tell job seekers what workplace support you offer, one question at a time.",
	employerAccomPreviewTitle: "How your job row badges will look",
	employerAccomForDevs: "For developers (schema.org JobPosting JSON)",
	partnerRegisterLearnerBtn: "Register a learner",
	partnerStatusWaitingConsent: "Waiting for learner consent",
	partnerStatusComplete: "Complete",
	partnerStatusNeedsDoc: "Needs a document",
	partnerColLearner: "Learner",
	partnerColTemplate: "Template",
	partnerColStatus: "Status",
	partnerColUpdated: "Last updated",
	partnerColAction: "Action",
	partnerOpenBtn: "Open",
	partnerEmptyTitle: "No learners registered yet",
	partnerEmptyDesc: "Start an assisted registration beside a learner to see it listed here.",
	profileModeLabel: "Answer mode",
	profileLastSavedLabel: "Last saved",
	profileSecAbout: "About me",
	profileSecContact: "Contact",
	profileSecIdentity: "Identity",
	profileSecEduSkills: "Education and skills",
	profileSecSupport: "Support I need",
	profileSecConnected: "Connected platforms",
	profilePrivateToYou: "Private to you",
	profileStopSharingBtn: "Stop sharing",
	profileNoConnectedPlatforms: "No platforms are connected yet.",
	profileDownloadDataBtn: "Download my data",
	profileDeleteConfirmTitle: "Delete your saved profile?",
	profileDeleteConfirmBody: "This removes your name, phone number, answers, and session settings from this browser. Connected platforms keep only what you already sent them.",
	profileDeleteConfirmAction: "Delete my profile",
	sys404Title: "Page not found",
	sys404Desc: "The page you asked for is not at this web address.",
	sys404Btn: "Go to home page",
	sysOfflineTitle: "You are offline",
	sysOfflineDesc: "Reconnect to the internet to load new pages, or open your saved profile.",
	sysOfflineBtn: "Open my profile",
	sysErrorTitle: "Something went wrong on this screen",
	sysErrorDesc: "Reload the page to keep using Mezgeb.",
	sysErrorBtn: "Reload page",
	builderTopBackTemplates: "Templates",
	builderRenameTemplateAria: "Rename template",
	builderSaveSaved: "Saved",
	builderSaveSaving: "Saving…",
	builderSaveRetry: "Not saved: Retry",
	builderSaveBlockedContrast: "Not saved: Fix accent contrast",
	builderViewSwitchAria: "Builder views",
	builderViewQuestions: "Questions",
	builderViewSettings: "Settings",
	builderViewTranslations: "Translations",
	builderViewShare: "Share",
	builderChecksOk: "Checks",
	builderChecksCount: "Checks {count}",
	builderTestAsLearner: "Test as learner",
	builderMoreActionsAria: "More template actions",
	builderMenuShortcuts: "Keyboard shortcuts",
	builderMenuDuplicate: "Duplicate template",
	builderMenuImportJson: "Import JSON",
	builderMenuDelete: "Delete template",
	builderDeleteConfirmTitle: "Delete this template?",
	builderDeleteConfirmBody: "This removes your local draft and custom copy. Built-in templates stay in the gallery.",
	builderDeleteConfirmBtn: "Delete template",
	builderDuplicatedAnnounce: "Template duplicated",
	builderEditingInLabel: "Editing in:",
	builderEnglishReference: "English: {text}",
	builderQuestionsDrawerBtn: "Questions ({count})",
	builderTabList: "List",
	builderTabCanvas: "Edit",
	builderTabPanel: "Panel",
	builderStatusNeedsFix: "Needs a fix",
	builderStatusMissingAm: "Missing Amharic",
	builderStatusConditional: "Shown only sometimes",
	builderOptionalLabel: "Optional",
	builderDragHandleAria: "Reorder {label}",
	builderRowMenuAria: "Actions for {label}",
	builderMoveUp: "Move up",
	builderMoveDown: "Move down",
	builderMoveToSectionMenu: "Move to section",
	builderSectionMenuAria: "Actions for section {name}",
	builderQuestionAddedAnnounce: "Question added",
	builderDeletedShortToast: "Question deleted",
	builderCanvasOf: "Question {current} of {total}",
	builderCanvasSimpleWords: "Simple words",
	builderCanvasOffline: "Offline",
	builderCanvasEditLabelAria: "Question text ({lang})",
	builderCanvasEditHintAria: "Hint ({lang})",
	builderCanvasAddHint: "Add a hint (optional)",
	builderCanvasCharsWarn: "{count} characters. Shorter questions are easier to hear and read.",
	builderCanvasDisabledFooter: "Use Test as learner to try the full flow",
	builderCanvasOptionAria: "Option {num} ({lang})",
	builderCanvasAddOption: "Add option",
	builderCanvasMoreOptionsAria: "More option actions",
	builderCanvasPasteOptions: "Paste options",
	builderCanvasAddOther: "Add 'Other'",
	builderCanvasAddPreferNot: "Add 'Prefer not to say'",
	builderCanvasSuggestionLabel: "Suggestion",
	builderCanvasUseThis: "Use this",
	builderCanvasDismiss: "Dismiss",
	builderSuggestionAppliedAnnounce: "Suggestion applied",
	builderImproveBtn: "Improve",
	builderImproveSimpler: "Use simpler words",
	builderImproveToAm: "Translate to Amharic",
	builderImproveToEn: "Translate to English",
	builderImproveCheck: "Check this question",
	builderImproveAiOffNotice: "AI is off. You can still edit everything by hand.",
	builderImproveTranslateFromEn: "Translate from English",
	builderPanelThingsToFix: "{count} thing to fix",
	builderPanelThingsToFixPlural: "{count} things to fix",
	builderPanelSeeIt: "See it",
	builderPanelRequired: "Required",
	builderPanelShowSkip: "Show a Skip button",
	builderPanelVoiceAnswers: "Voice answers",
	builderPanelAddCondition: "Add a condition",
	builderPanelOnlyIfSummary: "Only if {question} is {answer}",
	builderPanelChange: "Change",
	builderPanelRemove: "Remove",
	builderPanelSensitive: "Sensitive answer",
	builderPanelSensitiveNote: "Never sent to AI. Hidden from partners.",
	builderPanelSensitiveLocked: "Always on for this question type.",
	builderPanelMoreOptions: "More options",
	builderPanelMoreOptionsSet: "More options · {count} set",
	builderPanelAnswerRule: "Answer rule",
	builderPanelErrorMsg: "Error message",
	builderPanelAudioUrl: "Read-aloud audio URL",
	builderPanelPlayBtn: "Play",
	builderPanelSavesToField: "Saves to field",
	builderTypeChangeTitle: "Change question type?",
	builderTypeChangeConfirmBody: "Changing to {type} will remove the {count} answer options. Change type?",
	builderTypeChangeBtn: "Change type",
	builderStartHeading: "Create a template",
	builderStartLead: "Build a bilingual registration flow with one question per screen.",
	builderStartChooseTplBtn: "Start from a template",
	builderStartChooseTplShort: "Adapt one of the four built-in templates for your programme.",
	builderStartUseTplBtn: "Use this template",
	builderStartDescribeShort: "Write what you need to collect and let AI draft the questions.",
	builderStartDescribeBtn: "Describe it",
	builderStartDescribePrompt: "Who is signing up, and what do you need to know about them?",
	builderStartDraftBtn: "Draft template",
	builderStartDraftNote: "Uses AI. The draft opens in the builder for you to review.",
	builderStartNeedsAi: "Needs AI. Use one of the other two options.",
	builderStartPasteShort: "Paste field names from an existing form to convert offline.",
	builderStartPasteBtn: "Paste your current form",
	builderStartTurnQuestions: "Turn into questions",
	builderStartResumeDraft: "Resume saved draft",
	builderTransShowLabel: "Show:",
	builderTransFilterMissing: "Missing only",
	builderTransFilterAll: "All",
	builderTransSearchLabel: "Search translations",
	builderTransTranslateAllBtn: "Translate all missing",
	builderTransAcceptAllBtn: "Accept all",
	builderTransColWhere: "Where",
	builderTransColEn: "English",
	builderTransColAm: "Amharic",
	builderTransMissingSr: "Missing",
	builderTransEmpty: "Every string in this template has both English and Amharic text.",
	builderTransTemplateName: "Template name",
	builderTransTemplateDesc: "Description",
	builderTransTemplateBestFor: "Best for",
	builderTransConsent: "Consent statement",
	builderTransSectionPrefix: "Section",
	builderTransSupportPrefix: "Support",
	builderTransHintSuffix: "Hint",
	builderTransErrorSuffix: "Error message",
	builderTransOptionSuffix: "Option {num}",
	builderSetAboutHeading: "About this template",
	builderSetIdHeading: "Ways to confirm identity",
	builderSetIdFaydaWarn: "People without a Fayda ID will not be able to finish.",
	builderSetSupportHeading: "Support options",
	builderSetFeaturesHeading: "Features",
	builderSetConsentHeading: "Consent statement",
	builderSetLookHeading: "Look",
	builderSetContrastPassShort: "Passes ({ratio}:1)",
	builderSetContrastFailShort: "Too light ({ratio}:1). Choose a darker colour.",
	builderChecksTitle: "Checks",
	builderChecksMustHeading: "Must fix",
	builderChecksShouldHeading: "Should fix",
	builderChecksTipsHeading: "Tips",
	builderChecksFromAi: "From AI",
	builderChecksAllPass: "Everything passes. This template is ready to share.",
	builderChecksGoShare: "Go to Share",
	builderChecksShowAll: "Show all issues",
	builderChecksRemainingAnnounce: "{count} issues remaining",
	builderShareMustFixWarn: "{count} things need fixing before you share.",
	builderShareMustFixOne: "1 thing needs fixing before you share.",
	builderShareSeeChecks: "See checks.",
	builderShareAddSiteHeading: "Add to your site",
	builderShareTryItHeading: "Try it",
	builderShareSaveHeading: "Save",
	builderShareDownloadHeading: "Download",
	builderTestCloseBtn: "Close test",
	builderTestNoSaveNote: "Answers in a test run are never saved.",
	builderAddQSearchLabel: "Search questions",
	builderAddQNoMatches: "No questions match your search.",
	shortcutChecksAltC: "Open Checks drawer"
}, ut = {
	en: lt,
	am: {
		skipToContent: "ወደ ዋናው ይዘት ይዝለሉ",
		brandName: "mezgeb",
		brandWordmarkAm: "መዝገብ",
		navDemo: "ቀጥታ ሙከራ",
		navJobs: "ስራዎች",
		navTemplates: "ቅጾች",
		navPlayground: "መሞከሪያ",
		navDocs: "ሰነዶች",
		navPilotCta: "ሙከራ ይጠይቁ",
		navMenuOpen: "ምናሌ",
		navMenuClose: "ምናሌ ዝጋ",
		langEnglish: "EN",
		langAmharic: "አማ",
		langToggleLabel: "ቋንቋ ቀይር",
		copiedAnnouncement: "ተቀድቷል",
		copyButton: "ቅዳ",
		copiedButton: "ተቀድቷል",
		closeButton: "ዝጋ",
		cancelButton: "ሰርዝ",
		saveButton: "አስቀምጥ",
		loadingText: "በመጫን ላይ…",
		yesButton: "አዎ",
		noButton: "አይ",
		pilotDialogTitle: "ከመዝገብ ጋር ሙከራ ይጠይቁ",
		pilotDialogDesc: "ስለ የስልጠና ፕሮግራምዎ፣ የስራ መድረክዎ ወይም መንግስታዊ ያልሆነ ድርጅትዎ ይንገሩን። በሁለት የስራ ቀናት ውስጥ እንመልሳለን።",
		pilotOrgLabel: "የድርጅት ስም",
		pilotEmailLabel: "የስራ ኢሜይል ወይም ስልክ ቁጥር",
		pilotTypeLabel: "የመድረክ አይነት",
		pilotTypeTraining: "የስልጠና ፕሮግራም / ቴክኒክና ሙያ",
		pilotTypeJobs: "የስራ መድረክ",
		pilotTypeNgo: "መንግስታዊ ያልሆነ ድርጅት / የአጋር ምዝገባ",
		pilotTypeOther: "ሌላ",
		pilotNotesLabel: "ምን መሞከር ይፈልጋሉ?",
		pilotSubmit: "ጥያቄ ላክ",
		pilotSuccessTitle: "የሙከራ ጥያቄው ተመዝግቧል",
		pilotSuccessBody: "እናመሰግናለን። ይህ የማሳያ ገጽ ጥያቄዎን ለቡድን ውይይት በአካባቢው ያስቀምጣል። በእውነተኛው ስርዓት ወደ hello@mezgeb.example ይላካል።",
		pilotErrorRequired: "እባክዎ የድርጅቱን ስም እና ኢሜይል ወይም ስልክ ያስገቡ።",
		heroTitleLine1: "ሁሉንም ተማሪ የሚያዳምጥ",
		heroTitleLine2: "የምዝገባ ቅጽ።",
		heroSubtitle: "ተማሪዎች በመጻፍ፣ በአማርኛ በመናገር ወይም ከአጋር ጋር ይመዘገባሉ። የጊዜ ገደብ የለም፣ የመታወቂያ መሰናክል የለም።",
		heroCtaDemo: "ቀጥታ ሙከራውን ይሞክሩ",
		heroCtaWatch: "ቪዲዮውን ይመልከቱ",
		heroVideoWindowTitle: "የመዝገብ ማሳያ · 2 ደቂቃ",
		heroVideoTitle: "ቪዲዮ፦ ሀና በአማርኛ በድምፅ ስትመዘገብ",
		heroVideoPosterBadge: "2:04 · የአማርኛና የእንግሊዝኛ ጽሑፍ",
		heroVideoComingSoon: "የማሳያ ቪዲዮ በቅርቡ ይመጣል",
		heroVideoPlayLabel: "የማሳያ ቪዲዮ አጫውት",
		heroVideoQuestionAm: "የተወለዱበት ቀን መቼ ነው?",
		heroVideoQuestionEn: "When were you born?",
		heroVideoEthSwitch: "የኢትዮጵያ ቀን መቁጠሪያ",
		heroVideoYearPlaceholder: "ዓ.ም",
		heroVideoYearError: "እባክዎ ባለ 4 አሃዝ ዓመተ ምህረት ያስገቡ (ለምሳሌ 1995)።",
		heroVideoCC: "CC",
		heroVideoTranscript: "የቪዲዮ ጽሑፍ",
		heroVideoTranscriptTitle: "የቪዲዮው ቃል በቃል ጽሑፍ (ናሙና)",
		heroVideoTranscriptBody: "[00:00] ስክሪን አንባቢው ያነባል፦ ደረጃ 3 ከ 6። የተወለዱበት ቀን መቼ ነው? የኢትዮጵያ ቀን መቁጠሪያ ተመርጧል።\n[00:18] ሀና የማይክሮፎን አዝራሩን ተጭና በአማርኛ ትናገራለች፦ 'የተወለድኩት መስከረም 12 ቀን 1990 ዓ.ም ነው።'\n[00:34] መዝገብ የሚታረም ጽሑፍ ያሳያል፦ 'መስከረም 12 ቀን 1990 (22 September 1997)'።\n[00:48] ሀና ቀኑን አረጋግጣ ወደ ደረጃ 4 ትሄዳለች።",
		heroFrontWindowTitle: "learnhub.et/join",
		heroStep1: "ቋንቋ",
		heroStep2: "ስም እና አካባቢ",
		heroStep3: "የትውልድ ቀን",
		heroStep4: "ማንነትዎን የሚያሳዩበት መንገድ",
		heroStep5: "የሚፈልጉት ድጋፍ",
		heroStep6: "ክለሳ",
		heroCurrentQuestion: "ማንነትዎን እንዴት ያሳያሉ?",
		heroOptFayda: "ፋይዳ",
		heroOptRefugee: "የስደተኛ መታወቂያ",
		heroOptOther: "ሌላ ሰነድ",
		heroOptPartner: "በአጋር ድርጅት በኩል ያገናኙኝ",
		heroPartnerNotice: "አጋር ተቀላቅሏል · ቅጹን ማየት ይችላሉ፣ መልስዎን ግን አያዩም።",
		heroContinue: "ቀጥል",
		whyLabel: "መዝገብን ለምን ገነባነው",
		whyP1: "አብዛኛዎቹ የምዝገባ ቅጾች በጣም ለሚፈልጓቸው ሰዎች ተብለው አልተገነቡም።",
		whyP2Lead: "ጥቅምት 11 ቀን 2019 (21 October 2026) አርባ ዓይነ ስውራን፣ መስማት የተሳናቸው፣ አካል ጉዳተኞች፣ ስደተኞችና ተመላሾች አዲስ አበባ ውስጥ በአንድ የመማሪያ መድረክ ላይ ለመመዝገብ ሞከሩ። ",
		whyP2Bold1: "አብዛኛዎቹ መጨረስ አልቻሉም።",
		whyP2Mid: " ቅጾች ጊዜያቸው አለቀ። ስህተቶች ለስክሪን አንባቢዎች ዝም ነበሩ። ",
		whyP2Bold2: "የቀበሌ መታወቂያ ወይም ፓስፖርት የሌለው ማንኛውም ሰው ተመለሰ።",
		whyP3Lead: "የመታወቂያ ግድግዳው ሰፊ ነው። እስከ ጥቅምት 2025 ድረስ ",
		whyP3Bold: "በኢትዮጵያ ከሚገኙ ከአንድ ሚሊዮን በላይ ስደተኞች ውስጥ ወደ 138,000 የሚጠጉት ብቻ",
		whyP3Tail: " በአብዛኛዎቹ አገልግሎቶች የሚጠየቀው ፋይዳ ብሔራዊ መታወቂያ ውስጥ ተመዝግበዋል።",
		whyP4: "መመዝገብ ቀላሉ ክፍል መሆን አለበት።",
		whySources: "ምንጮች፦ የዲጂታል ብሪጅ የጋራ ንድፍ ውይይት (21 October 2026)፤ የኢትዮጵያ GRF የሂደት ሪፖርት (2025)።",
		featuresSectionTitle: "መዝገብ ለተማሪዎች እንዴት እንደሚሰራ",
		feat1Label: "የጊዜ ገደብ የለም",
		feat1HeadingLine1: "ካቆሙበት ቦታ",
		feat1HeadingLine2: "በትክክል ይቀጥሉ",
		feat1Body: "እያንዳንዱ መልስ በተሰጠበት ቅጽበት ይቀመጣል። የጊዜ ገደብ የለም፣ እና በኋላ ለመጨረስ በSMS ሊንክ ይላካል።",
		feat1SmsSender: "Learnhub · አሁን",
		feat1SmsText: "ምዝገባዎ ተቀምጧል። ከደረጃ 4 ይቀጥሉ፦",
		feat1SmsLink: "lhb.et/r/7Kq2",
		feat1ResumeTitle: "እንኳን ደህና መጡ፣ ሀና",
		feat1ResumeSub: "ደረጃ 4 ከ 6 · ከ2 ቀናት በፊት የተቀመጠ",
		feat1Row1Label: "ቋንቋ",
		feat1Row1Val: "አማርኛ",
		feat1Row2Label: "ስም እና አካባቢ",
		feat1Row2Val: "ሀና፣ ልደታ",
		feat1Row3Label: "ስልክ",
		feat1Row3Val: "09•• ••• 214",
		feat1ResumeBtn: "ካቆምኩበት ቀጥል",
		feat1NoLimit: "የጊዜ ገደብ የለም",
		feat2Label: "ክህሎት ከታሪክ",
		feat2HeadingLine1: "ልምድ ዋጋ አለው፣",
		feat2HeadingLine2: "የምስክር ወረቀት ባይኖርም",
		feat2Body: "ተማሪዎች የሰሩትን ስራ በራሳቸው ቃል ይገልጻሉ። መዝገብ ክህሎቶችን ይጠቁማል፤ ተማሪው ይወስናል።",
		feat2CardTitle: "ስለሰሩት ስራ ይንገሩን",
		feat2CardTag: "ክፍያ ያለው ወይም የሌለው",
		feat2TranscriptPart1: "መርካቶ ውስጥ ለ",
		feat2TranscriptHl2: "ሶስት ዓመት",
		feat2TranscriptPart2: " ",
		feat2TranscriptHl1: "ልብስ ሸጫለሁ",
		feat2TranscriptPart3: " እና ",
		feat2TranscriptHl3: "የሱቁን ሂሳብ ሰርቻለሁ",
		feat2TranscriptPart4: "። ደንበኞችን ",
		feat2TranscriptHl4: "ልክ ልኬት በማግኘት ረድቻለሁ",
		feat2TranscriptPart5: "።",
		feat2SkillsLabel: "የሰማናቸው ክህሎቶች",
		feat2Skill1: "ሽያጭ",
		feat2Skill2: "የሂሳብ አያያዝ",
		feat2Skill3: "የደንበኛ አገልግሎት",
		feat2Skill4: "የችርቻሮ ልምድ · 3 ዓመት",
		feat2AddSkill: "+ ክህሎት ጨምር",
		feat2KeepBtn: "እነዚህን አስቀምጥ",
		feat3Label: "በነባሪ ሚስጥራዊ",
		feat3HeadingLine1: "ድጋፍ ይጠይቁ",
		feat3HeadingLine2: "ምክንያቱን ሳያስረዱ",
		feat3Body: "ተማሪዎች የሚረዳቸውን ይናገራሉ። የህክምና ማረጋገጫ አያስፈልግም፣ እና ማን ማየት እንደሚችል ራሳቸው ይመርጣሉ።",
		feat3CardTitle: "የሚያስፈልገኝ ድጋፍ",
		feat3CardSub: "የህክምና ማረጋገጫ ወይም ሰነድ አያስፈልግም",
		feat3Chip1: "ስክሪን አንባቢ",
		feat3Chip2: "ተጨማሪ ጊዜ",
		feat3Chip3: "ደረጃ የሌለው መግቢያ",
		feat3Chip4: "የምልክት ቋንቋ አስተርጓሚ",
		feat3WhoLabel: "ይህን ማን ማየት ይችላል",
		feat3Who1Name: "Learnhub",
		feat3Who1Desc: "የመማሪያ መድረክዎ",
		feat3Who2Name: "ቀጣሪዎች",
		feat3Who2Desc: "ሲያመለክቱና ለማጋራት ሲመርጡ ብቻ",
		feat3Who3Name: "አጋር ድርጅት",
		feat3Who3Desc: "በእርዳታ ጊዜ ብቻ",
		feat3Encrypted: "ተለይቶ እና ተመስጥሮ ይቀመጣል",
		feat4Label: "ተስማሚ ስራዎች",
		feat4HeadingLine1: "የሚያስፈልግዎትን",
		feat4HeadingLine2: "ድጋፍ የሚሰጡ ስራዎች",
		feat4Body: "ቀጣሪዎች እያንዳንዱ ስራ የሚሰጠውን ድጋፍ ይዘረዝራሉ። ተማሪዎች ምንም ሳያጋልጡ በፍላጎታቸው ያጣራሉ።",
		feat4SearchPlaceholder: "ስራዎችን ፈልግ",
		feat4Filter1: "ስክሪን አንባቢ",
		feat4Filter2: "ተጨማሪ ጊዜ",
		feat4FilterPrivate: "ማጣሪያዎች ሚስጥራዊ ናቸው",
		feat4Job1Title: "ጀማሪ የዳታ ባለሙያ",
		feat4Job1Meta: "ሎጂስቲክስ ኩባንያ · አዲስ አበባ",
		feat4Job1Match: "ከ 2 ውስጥ 2 ፍላጎቶች ተሟልተዋል",
		feat4Job1Tag1: "ስክሪን አንባቢ",
		feat4Job1Tag2: "ለፈተና ተጨማሪ ጊዜ",
		feat4Job1Tag3: "ተለዋዋጭ ሰዓት",
		feat4Job1Apply: "በድምፅ አመልክት",
		feat4Job1Save: "አስቀምጥ",
		feat4Job2Title: "የደንበኞች ድጋፍ ወኪል",
		feat4Job2Meta: "ቴሌኮም ኩባንያ · በርቀት",
		feat4Job2Match: "ከ 2 ውስጥ 1 ፍላጎት ተሟልቷል",
		platformsLabel: "ለመድረኮች",
		platformsHeadingLine1: "ወደ ምዝገባ ገጽዎ",
		platformsHeadingLine2: "በአንድ ከሰዓት ያክሉት።",
		platformsIntro: "ገጽዎ ላይ አንድ የስክሪፕት ታግ ብቻ። ተማሪው ሲጨርስ ሰርቨርዎ የተረጋገጠ መረጃ ይቀበላል። የእርስዎ መግቢያ፣ ዳታቤዝ እና ዲዛይን የእርስዎ ሆነው ይቆያሉ።",
		platStep1Title: "አንድ ታግ ያክሉ",
		platStep2Title: "ተማሪዎች በመንገዳቸው ይመዘገባሉ",
		platStep2Org: "Learnhub · በመዝገብ የተደገፈ",
		platStep2Step: "ደረጃ 2 ከ 6",
		platStep2Q: "ስልክ ቁጥርዎ ስንት ነው?",
		platStep2ReadAloud: "ጮክ ብለህ አንብብ",
		platStep2OptType: "ጻፍ",
		platStep2OptSpeak: "ተናገር",
		platStep2OptHelp: "እርዳታ አግኝ",
		platStep3Title: "የተረጋገጠ መገለጫ ያግኙ",
		platStep3Event: "registration.completed · አሁን",
		platStep3Note: "የድጋፍ ፍላጎቶች የሚደርሱት ተማሪው ሲያጋራ ብቻ ነው",
		platLevel1Title: "ደረጃ 1 · ስክሪፕት ታግ",
		platLevel1Desc: "አካሉን በማንኛውም ገጽ ውስጥ ያስገቡ።",
		platLevel1Link: "ፈጣን ጅምር",
		platLevel2Title: "ደረጃ 2 · REST API",
		platLevel2Desc: "በእኛ OpenAPI ዝርዝር የራስዎን ገጽ ይገንቡ።",
		platLevel2Link: "የAPI ሰነዶች",
		platLevel3Title: "ደረጃ 3 · የስራ መድረኮች",
		platLevel3Desc: "የስራ ቦታ ድጋፎችን እንደ schema.org/JobPosting ያትሙ።",
		platLevel3Link: "JobPosting ሰነዶች",
		platHostingLine: "በDocker በራስዎ ሰርቨር ያስተናግዱ፦ መረጃ ከሰርቨርዎ አይወጣም · ወይም እኛ እናስተናግድልዎ",
		platHostingBtn: "መሞከሪያውን ክፈት",
		faqLabel: "ተደጋጋሚ ጥያቄዎች",
		faqHeadingLine1: "ጥያቄዎች፣",
		faqHeadingLine2: "መልሶቻቸው።",
		faqSub: "ለተማሪዎች፣ ለአጋሮች እና መዝገብን ለሚጠቀሙ መድረኮች።",
		faqAskTelegram: "በቴሌግራም ይጠይቁን",
		faqQ1: "ተማሪው የፋይዳ መታወቂያ ያስፈልገዋል?",
		faqA1: "አይ። ተማሪዎች ፋይዳን፣ የስደተኛ መታወቂያን ወይም ሌላ ሰነድ መጠቀም ይችላሉ፤ ወይም አጋር ድርጅት እንዲያረጋግጥላቸው 'በአጋር በኩል ያገናኙኝ' የሚለውን መምረጥ ይችላሉ።",
		faqQ2: "መዝገብ የትኞቹን ቋንቋዎች ይደግፋል?",
		faqA2: "ዛሬ አማርኛ እና እንግሊዝኛ። አፋን ኦሮሞ፣ ትግርኛ እና ሶማሊኛ በእቅድ ላይ ናቸው።",
		faqQ3: "AI ተማሪዎች የጻፉትን ያያል?",
		faqA3: "አይ። የእርዳታ ረዳቱ የገጹን መለያዎችና የስህተት መልዕክቶችን ብቻ ያነባል፣ የተማሪውን መልሶች በፍጹም አያይም።",
		faqQ4: "የድምፅ ቅጂዎች ምን ይሆናሉ?",
		faqA4: "ወደ ጽሑፍ እንደተቀየሩ ወዲያውኑ ይሰረዛሉ።",
		faqQ5: "ተማሪዎች አካል ጉዳተኝነታቸውን መግለጽ አለባቸው?",
		faqA5: "አይ። ተማሪዎች ተግባራዊ ፍላጎቶችን ብቻ ይገልጻሉ። የህክምና ማረጋገጫ አይጠየቅም፣ እና እነሱ የመረጡት ድረ-ገጽ ብቻ ያየዋል።",
		faqQ6: "ወደ ድረ-ገጻችን ለማከል ምን ያህል ጊዜ ይወስዳል?",
		faqA6: "አንድ የስክሪፕት ታግ እና ትንሽ የሰርቨር ደረጃ። አብዛኛዎቹ ድረ-ገጾች በአንድ ከሰዓት ይጨርሳሉ።",
		faqQ7: "በራሳችን ሰርቨር ማስተናገድ እንችላለን?",
		faqA7: "አዎ። የድምፅ እና የAI ሞዴሎችን ጨምሮ በDocker Compose በራስዎ ሰርቨር ይሰራል።",
		faqQ8: "በዝቅተኛ ስልኮችና ደካማ ኢንተርኔት ይሰራል?",
		faqA8: "አዎ። በ3G በዝቅተኛ አንድሮይድ ስልኮች ይሰራል፣ ኢንተርኔት ሲቋረጥ መልሶችን ስልኩ ላይ ያስቀምጣል፣ እና በኋላ ለመጨረስ የSMS ሊንክ መላክ ይችላል።",
		footerCol1Title: "ለተማሪዎች",
		footerCol1L1: "እንዴት እንደሚሰራ",
		footerCol1L2: "በድምፅ ይመዝገቡ",
		footerCol1L3: "የእኔ መገለጫ",
		footerCol1L4: "የተደራሽነት መግለጫ",
		footerCol2Title: "ለመድረኮች",
		footerCol2L1: "መሞከሪያ",
		footerCol2L2: "ሰነዶች",
		footerCol2L3: "በራስ ማስተናገድ",
		footerCol2L4: "ቅጾች",
		footerCol3Title: "አስፈላጊ ዝርዝሮች",
		footerCol3L1: "ግላዊነት",
		footerCol3L2: "ውሎች",
		footerCol3L3: "የውሂብ ጥበቃ",
		footerCol3L4: "ክፍት ምንጭ ፈቃድ",
		footerCol4Title: "ሰላም ይበሉን",
		footerCol4L1: "ቴሌግራም",
		footerCol4L2: "LinkedIn",
		footerCol4L3: "GitHub",
		footerCol4L4: "hello@mezgeb.example",
		footerOriginLine: "ክፍት ምንጭ። መጀመሪያ የተገነባው በአዲስ አበባ ለዲጂታል ብሪጅ ተደራሽነት ሃካቶን 2026 ከዓይነ ስውራን፣ መስማት ከተሳናቸው፣ አካል ጉዳተኞች እና ተፈናቃይ አብሮ-ነዳፊዎች ጋር ነው።",
		footerCopyright: "© 2026 መዝገብ",
		cloudAiNotice: "ማሳያው የክላውድ AI (Gemini) ይጠቀማል። ትክክለኛው ምርት በነባሪነት AIን በራስዎ ሰርቨር ላይ ያካሂዳል።",
		voiceProviderNotice: "ቀረጻዎ ወደ ጽሑፍ የሚለወጠው በ {provider} በመስመር ላይ አገልግሎት ነው። መዝገብ ቀረጻውን አያስቀምጥም።",
		widgetRecordingLimit: "ቀረጻ ከ20 ሰከንድ በኋላ ይቆማል።",
		widgetPartnerPendingLabel: "ጓደኛዎ እስኪያረጋገጥ ድረስ",
		widgetSkillsAiNotice: "ታሪክዎን ወደ AI አገልግሎት ይልካል ለክህሎት ሀሳቦች። ከዝርዝሩ በቀጥታም መምረጥ ትችላለህ።",
		demoPageTitle: "ቀጥታ ሙከራ",
		demoPageSubtitle: "እንደ ተማሪ በናሙና መድረክ ላይ መመዝገብን ይሞክሩ። በኪቦርድ መጠቀምን፣ አማርኛና እንግሊዝኛን፣ የኢትዮጵያ ቀን መቁጠሪያን፣ ኦፍላይን ሁነታን እና AI ሲጠፋ ይሞክሩ።",
		demoBrowserTitle: "learnhub.et/join (የናሙና መድረክ)",
		demoSampleBadge: "ለቡድን ውይይት የተዘጋጀ ናሙና",
		demoDevToggleShow: "የገንቢ እይታ አሳይ",
		demoDevToggleHide: "የገንቢ እይታ ደብቅ",
		demoDevTitle: "የገንቢ እይታ",
		demoDevOfflineLabel: "ኦፍላይን ሙከራ",
		demoDevAiLabel: "AI አብራ/አጥፋ",
		demoDevAiOn: "AI በርቷል",
		demoDevAiOff: "AI ጠፍቷል",
		demoDevLangLabel: "ቋንቋ",
		demoDevAnswersTitle: "የቀጥታ መልሶች JSON",
		demoDevAnswersNotice: "ለማሳያ ብቻ፦ እውነተኛው አካል ይህን አያሳይም",
		demoDevAiLogTitle: "AI የተቀበለው መረጃ",
		demoDevAiLogEmpty: "እስካሁን የAI እርዳታ ጥያቄ አልተላከም። የተላከውን መረጃ ለማየት እርዳታ (Alt+H) ይጫኑ።",
		demoDevExchangeTitle: "የቶከን ልውውጥ ሙከራ",
		demoDevExchangePending: "የቶከን ልውውጡን ለማየት በግራ በኩል ምዝገባውን ይጨርሱ።",
		demoDevResetBtn: "ሙከራውን እንደገና ጀምር",
		demoStorageBlockedNote: "የአሳሽ ማከማቻ ተዘግቷል፤ መልሶች በጊዜያዊ ማህደረ ትውስታ እየተቀመጡ ነው።",
		demoOutboxLabel: "የኦፍላይን መላኪያ ሳጥን",
		demoOutboxCount: "{count} ምዝገባ(ዎች) ለመላክ በመጠባበቅ ላይ",
		demoOutboxEmpty: "መላኪያ ሳጥኑ ባዶ ነው",
		demoOpenPartnerBtn: "የአጋር መቆጣጠሪያ ክፈት",
		demoViewProfileBtn: "መገለጫዬን ይመልከቱ",
		demoRehearsalTitle: "የማሳያ ልምምድ ዝርዝር",
		demoRehearsal1: "1. ተባባሪ ነዳፊ በNVDA ይመዘገባል፣ እርዳታ (Alt+H) ይጠቀማል፣ 'በአጋር በኩል' ይመርጣል",
		demoRehearsal2: "2. ዋይፋይ ሲጠፋ፦ ምዝገባው ይሰራል እና በመላኪያ ሳጥን ይቀመጣል",
		demoRehearsal3: "3. ቀጥታ ጭነት፦ በባዶ ገጽ ላይ ሁለት መስመር ኮድ",
		widgetStepOf: "ደረጃ {current} ከ {total}",
		widgetReadAloud: "ጮክ ብለህ አንብብ",
		widgetReadEnglishBtn: "የእንግሊዝኛውን ቅጂ አንብብ",
		widgetStopReading: "ማንበብ አቁም",
		widgetNoAmharicVoice: "መሳሪያዎ የአማርኛ ድምፅ የለውም። በእውነተኛው ምርት መዝገብ የራሱን የአማርኛ ድምፅ ያቀርባል።",
		widgetBack: "ተመለስ",
		widgetContinue: "ቀጥል",
		widgetConfirm: "አረጋግጥ",
		widgetChange: "ቀይር",
		widgetFinishLaterSms: "በSMS ሊንክ በኋላ ጨርስ",
		widgetSmsModalTitle: "አስቀምጠህ በኋላ ጨርስ",
		widgetSmsPhoneLabel: "የመቀጠያ ሊንክ የሚላክበት ስልክ ቁጥር",
		widgetSmsSendBtn: "የመቀጠያ ሊንክ ላክ",
		widgetSmsBody: "Learnhub: ምዝገባዎ ተቀምጧል። እዚህ ይቀጥሉ፦",
		widgetResumeBanner: "እንኳን ደህና መጡ። ከደረጃ {step} ይቀጥሉ?",
		widgetResumeBtn: "ከደረጃ {step} ቀጥል",
		widgetStartFreshBtn: "አዲስ ጀምር",
		widgetOfflineNotice: "ኢንተርኔት የለም። መልሶችዎ ተቀምጠዋል፤ ሲገናኙ ይላካሉ።",
		widgetOfflineQueuedTitle: "ተቀምጧል። ኢንተርኔት ሲመለስ በራስ-ሰር ይላካል።",
		widgetErrorSummaryTitle: "ከመቀጠልዎ በፊት እባክዎ ይህን ደረጃ ያረጋግጡ፦",
		widgetSpeakBtn: "ተናገር",
		widgetSpeakChoiceBtn: "ለመምረጥ ተናገር",
		widgetRecordingStatus: "በመቅዳት ላይ… {seconds}ሰ / 20ሰ",
		widgetStopRecording: "ቀረጻ አቁም",
		widgetSendingVoice: "በመላክ ላይ…",
		widgetVoiceTooLarge: "የድምፅ ቅጂው ከ 1 MB በላይ ነው። እባክዎ አጠር ያለ ይቅዱ ወይም ይጻፉ።",
		widgetVoiceChoiceConfirm: "ማለት የፈለጉት ይህን ነው፦ {option}?",
		widgetVoiceChoiceNoMatch: "ተዛማጅ አማራጭ አልተገኘም። እባክዎ እንደገና ይሞክሩ ወይም አማራጩን ይንኩ።",
		widgetTranscribing: "ድምፅ ወደ ጽሑፍ እየተቀየረ ነው…",
		widgetTranscriptConfirmTitle: "ይህ ትክክል ነው? መቀየር ይችላሉ።",
		widgetTranscriptUse: "ይህን መልስ አስቀምጥ",
		widgetTranscriptDiscard: "አስወግድ",
		widgetVoiceTimeout: "ድምፅ አሁን ቀርፋፋ ነው። በምትኩ መጻፍ ይችላሉ።",
		widgetVoiceNoMic: "ማይክሮፎን አይገኝም ወይም ፈቃድ ተከልክሏል። መጻፍ ይችላሉ።",
		widgetHelpBtn: "እርዳታ (Alt+H)",
		widgetHelpTitle: "በዚህ ደረጃ ላይ እርዳታ",
		widgetHelpPlaceholder: "ምን ግራ አጋባዎት ወይም አልሰራም?",
		widgetHelpDefaultQuestion: "በዚህ ገጽ ላይ ምን ማስገባት እንዳለብኝ አስረዳኝ።",
		widgetHelpAskBtn: "AI ጠይቅ",
		widgetHelpOfflineNote: "የስህተት እርዳታ እዚህ ማግኘት ይችላሉ። የራስዎን ጥያቄ ለመጠየቅ ግን ግንኙነት ያስፈልጋል።",
		widgetHelpTakeMeThere: "ወደዚያ ውሰደኝ",
		widgetHelpAskPerson: "ሰው ጠይቅ",
		widgetHelpMovedAnnouncement: "ተዛውሯል ወደ፦ {label}",
		widgetHelpPartnerMessage: "የአጋር ድርጅት ሰራተኛ በአካል ወይም በስልክ ሊረዳዎ ይችላል። እስኪያረጋግጡ ድረስ መልሶችዎ ሚስጥራዊ ናቸው።",
		widgetHelpNoAiFallbackLabel: "አብሮገነብ ግልጽ መመሪያ (AI አልተጠቀመም)፦",
		widgetSimplifyBtn: "በቀላሉ ግለጽልኝ",
		widgetSimplifying: "በማቃለል ላይ…",
		widgetSimplifiedLabel: "ቀለል ያለ አገላለጽ፦",
		widgetCalGroupLabel: "የቀን መቁጠሪያ ስርዓት",
		widgetCalEth: "የኢትዮጵያ ቀን መቁጠሪያ",
		widgetCalGreg: "የግሪጎሪያን ቀን መቁጠሪያ",
		widgetCalDay: "ቀን",
		widgetCalMonth: "ወር",
		widgetCalYear: "ዓመት",
		widgetCalChooseMonth: "ወር ይምረጡ",
		widgetCalConvertedGreg: "የግሪጎሪያን አቻ፦",
		widgetCalConvertedEth: "የኢትዮጵያ አቻ፦",
		widgetPartnerSelectLabel: "አጋር ድርጅት ይምረጡ (ናሙና ዝርዝር)",
		widgetPartner1: "አዲስ የተደራሽነት ማዕከል (ናሙና)",
		widgetPartner2: "የስደተኞች ድጋፍ ዴስክ (ናሙና)",
		widgetPartner3: "የማህበረሰብ ቴክኒክና ሙያ ግንኙነት (ናሙና)",
		widgetPartnerConsent: "ይህ አጋር ቅጹን እንድጨርስ እንዲረዳኝ ተስማምቻለሁ። ካላጋራሁ በስተቀር የግል ድጋፍ መልሶቼን አያዩም።",
		widgetPartnerNotice: "አጋር እንዲጨርሱ ይረዳዎታል። ቅጹን ማየት ይችላሉ፣ መልስዎን ግን አያዩም።",
		widgetPartnerJoinedBanner: "አጋር ተቀላቅሏል። ቅጹን ማየት ይችላሉ፣ መልስዎን ግን አያዩም።",
		widgetSupportPrivacyTitle: "ይህን ማን ማየት ይችላል",
		widgetSupportNoDiagnosis: "ምንም አይነት የህክምና ማረጋገጫ ወይም ምርመራ አይጠየቅም።",
		widgetSupportNothingShared: "ካላበሩት በስተቀር ምንም ነገር አይጋራም።",
		widgetSupportSessionNote: "የድጋፍ ምርጫዎች በዚህ ክፍለ ጊዜ ማህደረ ትውስታ ውስጥ ብቻ ይቀመጣሉ፤ ገጹ ሲታደስ ይጠፋሉ።",
		widgetSupportSharePlatform: "Learnhub (የመማሪያ መድረክዎ)",
		widgetSupportShareEmployers: "ቀጣሪዎች (ሲያመለክቱና ለማጋራት ሲመርጡ ብቻ)",
		widgetSupportSharePartner: "አጋር ድርጅት (በእርዳታ ጊዜ ብቻ)",
		widgetSkillsExtractBtn: "ከታሪኬ ክህሎቶችን አውጣ",
		widgetSkillsExtracting: "ክህሎቶችን በመፈለግ ላይ…",
		widgetSkillsSuggestedTitle: "የተጠቆሙ ክህሎቶች (ወደ መገለጫዎ ለመጨመር 'አስቀምጥ' ይጫኑ)፦",
		widgetSkillsKeepBtn: "አስቀምጥ",
		widgetSkillsKeepAllBtn: "ሁሉንም አስቀምጥ",
		widgetSkillsSavedTitle: "ወደ መገለጫዎ የተቀመጡ ክህሎቶች፦",
		widgetSkillsRemoveLabel: "{skill} አጥፋ",
		widgetSkillsAddPlaceholder: "የራስዎን ክህሎት ይጨምሩ",
		widgetSkillsAddBtn: "ክህሎት ጨምር",
		widgetSkillsFallbackTitle: "የተለመዱ ክህሎቶች ዝርዝር (የሚስማማውን ይምረጡ)፦",
		widgetReviewTitle: "መልሶችዎን ይከልሱና ያረጋግጡ",
		widgetClearDeviceBtn: "ይህን መሳሪያ አጽዳ",
		widgetDeviceClearedNotice: "የተቀመጡ መልሶች ሁሉ ከዚህ አሳሽ ተሰርዘዋል።",
		widgetNextScreenTitle: "ተመዝግበዋል።",
		widgetNextScreenBody: "ቀጣይ፦ ኮርስዎን ይምረጡ። ዝግጁ ሲሆን Learnhub በጽሑፍ መልዕክት ያሳውቅዎታል።",
		widgetNextScreenContinue: "የማረጋገጫ ዝርዝሮችን ይመልከቱ",
		widgetSuccessTitle: "ተመዝግበዋል",
		widgetSuccessBody: "የመለያ መገለጫዎ ተረጋግጧል። ኢንተርኔት ካልነበረ፣ እንደተገናኙ በራስ-ሰር ይላካል።",
		widgetSuccessTokenNote: "ለ learnhub.et የተሰጠ አንድ-ጊዜ ቶከን፦",
		widgetSuccessRestart: "ሌላ ተማሪ መዝግብ (ናሙና)",
		errRequired: "ከመቀጠልዎ በፊት እባክዎ ይህን ጥያቄ ይመልሱ።",
		errPhoneFormat: "በ 09 ወይም 07 የሚጀምር ባለ 10 አሃዝ የኢትዮጵያ ስልክ ቁጥር ያስገቡ።",
		errDateInvalid: "ትክክለኛ ቀን፣ ወር እና ባለ 4 አሃዝ ዓመት ያስገቡ።",
		errPartnerRequired: "ለመቀጠል አጋር ድርጅት ይምረጡ እና የስምምነት ሳጥኑን ምልክት ያድርጉ።",
		helpErrREQUIRED: "ወደ ፊት ከመሄድዎ በፊት ይህ ጥያቄ መልስ ይፈልጋል። ከታች ባለው ሳጥን ይጻፉ ወይም ይምረጡ።",
		helpErrPHONE_INVALID: "በ 09 ወይም 07 የሚጀምር ባለ 10 አሃዝ ስልክ ቁጥር ያስገቡ።",
		helpErrDATE_INVALID: "ቀኑን ያረጋግጡ፣ ከዝርዝሩ ወር ይምረጡ እና ባለ 4 አሃዝ ዓመት ያስገቡ (ለምሳሌ 1990)።",
		helpErrID_ROUTE_REQUIRED: "ማንነትዎን ለማሳየት ከአራቱ አማራጮች አንዱን ይምረጡ። ለመመዝገብ ፋይዳ ግዴታ አይደለም።",
		helpErrPARTNER_CONSENT_REQUIRED: "ከዝርዝሩ አጋር ድርጅት ይምረጡ እና ከስር ያለውን የስምምነት ሳጥን ምልክት ያድርጉ።",
		helpErrCONSENT_REQUIRED: "አረጋግጥ ከመጫንዎ በፊት ከክለሳው ገጽ ግርጌ ያለውን የስምምነት ሳጥን ምልክት ያድርጉ።",
		helpTypeText: "መልስዎን ሳጥኑ ውስጥ ይጻፉ ወይም ድምፅ የሚገኝ ከሆነ 'ተናገር' ይጫኑ።",
		helpTypePhone: "በ 09 ወይም 07 የሚጀምር ባለ 10 አሃዝ የኢትዮጵያ ሞባይል ቁጥር ያስገቡ።",
		helpTypeDate: "ቀን እና ባለ 4 አሃዝ ዓመት ያስገቡ፣ እንዲሁም ወር ይምረጡ። የኢትዮጵያ እና የግሪጎሪያን ቀን መቁጠሪያ መቀያየር ይችላሉ።",
		helpTypeChoice: "ከታች ካለው ዝርዝር አንድ አማራጭ ይምረጡ።",
		helpTypeMultichoice: "ለእርስዎ የሚስማሙትን አማራጮች ይምረጡ ወይም ካልተስማማዎት ይለፉ።",
		helpTypeIdRoutes: "ያለዎትን መታወቂያ ይምረጡ ወይም አጋር ድርጅት እንዲረዳዎ 'በአጋር በኩል' ይምረጡ።",
		helpTypeSupport: "የሚረዳዎትን ተግባራዊ ድጋፍ ይምረጡ። ካላበሩት በስተቀር ማጋራት በነባሪነት ጠፍቷል።",
		helpTypeWorkStory: "ስለሰሩት ክፍያ ያለው ወይም የሌለው ስራ ይጻፉ ወይም ይናገሩ፣ ከዚያ ማስቀመጥ የሚፈልጉትን ክህሎት ይምረጡ።",
		helpTypeReview: "መልሶችዎን ያረጋግጡ። ለማስተካከል 'ቀይር' ይጫኑ፣ ከዚያ ሳጥኑን ምልክት አድርገው 'አረጋግጥ' ይጫኑ።",
		templatesTitle: "የምዝገባ ቅጾች",
		templatesSubtitle: "በአንድ ስክሪን አንድ ጥያቄ፣ ግልጽ ቋንቋ እና ተለዋዋጭ የመታወቂያ አማራጮች ባሉት ተደራሽ ቅጽ ይጀምሩ።",
		templatesQuestionsCount: "{count} ጥያቄዎች",
		templatesIdRoutesLabel: "የመታወቂያ መንገዶች፦",
		templatesPreviewBtn: "ቅድመ-ዕይታ",
		templatesUseBtn: "መሞከሪያው ውስጥ ተጠቀም",
		templatesJsonShow: "የቅጽ JSON አሳይ",
		templatesJsonHide: "የቅጽ JSON ደብቅ",
		templatesBuilderTitle: "በAI ቅጽ ይገንቡ",
		templatesBuilderDesc: "አሁን ያሉዎትን የምዝገባ መስኮች ይለጥፉ ወይም ድርጅትዎ የሚፈልገውን ይግለጹ። መዝገብ የተደራሽነት ችግሮችን ይፈትሻል እና በአንድ ስክሪን አንድ ጥያቄ ያለው ቅጽ ያዘጋጃል።",
		templatesBuilderStartFrom: "መነሻ ቅጽ",
		templatesBuilderInputLabel: "አሁን ያሉዎትን የምዝገባ መስኮች ይለጥፉ ወይም የሚፈልጉትን ይግለጹ",
		templatesBuilderPlaceholder: "ሙሉ ስም፣ ኢሜይል፣ ስልክ፣ የትውልድ ቀን፣ ከፍተኛ የትምህርት ደረጃ፣ መከታተል የሚፈልጉት ማዕከል",
		templatesBuilderLangLabel: "ዋና የረቂቅ ትኩረት",
		templatesBuilderDraftBtn: "ቅጽ አዘጋጅ",
		templatesBuilderDrafting: "ቅጽ በማዘጋጀት ላይ…",
		templatesBuilderFallbackNotice: "የAI ዝግጅት አልተሳካም ወይም ጊዜው አልፏል። ከታች በእጅ ማረም እንዲችሉ መነሻ ቅጹ ተጭኗል።",
		templatesValidationErrorsTitle: "የቅጽ ማረጋገጫ ስህተቶች፦",
		templatesCheckerTitle: "የጥያቄ መፈተሻ",
		templatesCheckerEmpty: "ምንም የተደራሽነት ወይም የውሂብ-ቅነሳ ማስጠንቀቂያ አልተገኘም።",
		templatesCheckerApply: "ምክሩን ተግብር",
		templatesCheckerEdit: "ይህን ጥያቄ አርም",
		templatesCheckerDismiss: "አጥፋ",
		templatesEditorTitle: "ሊታረም የሚችል የጥያቄ ዝርዝር",
		templatesPreviewPaneTitle: "የቅጽ ቀጥታ ዕይታ",
		templatesMoveUp: "ወደ ላይ ውሰድ",
		templatesMoveDown: "ወደ ታች ውሰድ",
		templatesDeleteQ: "አጥፋ",
		templatesAddQ: "+ ጥያቄ ጨምር",
		playgroundTitle: "የማዋሃጃ መሞከሪያ",
		playgroundSubtitle: "መዝገብን ለመድረክዎ ያዋቅሩ፣ የገጽና የሰርቨር ኮድ ያግኙ፣ እና የቀጥታ ምዝገባ ሙከራ ያካሂዱ።",
		playgroundSettingsTitle: "ቅንብሮች",
		playgroundTemplateLabel: "ቅጽ",
		playgroundSiteKeyLabel: "የገጽ ቁልፍ (Site key)",
		playgroundDefaultLangLabel: "ነባሪ ቋንቋ",
		playgroundTypeLabel: "የማዋሃጃ አይነት",
		playgroundTypeEmbed: "የተካተተ (<mezgeb-register>)",
		playgroundTypeButton: "\"በመዝገብ ይመዝገቡ\" አዝራር",
		playgroundAccentLabel: "የማድመቂያ ቀለም",
		playgroundAccentContrastPass: "ከነጭ ጽሑፍ ጋር ያለው የንጽጽር ጥምርታ {ratio}:1 ነው (WCAG AA 4.5:1 ያሟላል)።",
		playgroundAccentContrastFail: "ከነጭ ጽሑፍ ጋር ያለው የንጽጽር ጥምርታ {ratio}:1 ከ WCAG AA (4.5:1) በታች ነው። የአዝራር ጽሑፍ እንዲነበብ ጠቆር ያለ ቀለም ይምረጡ።",
		playgroundHostingLabel: "ማስተናገጃ",
		playgroundHostingHosted: "በመዝገብ የሚስተናገድ",
		playgroundHostingLite: "በራስ ማስተናገድ (lite)",
		playgroundHostingFull: "በራስ ማስተናገድ (full)",
		playgroundTabPage: "ገጽዎ",
		playgroundTabServer: "ሰርቨርዎ",
		playgroundTabWebhook: "Webhook",
		playgroundTabSelfHost: "በራስ ማስተናገድ",
		playgroundTestBtn: "የሙከራ ምዝገባ አሂድ",
		playgroundTestResultTitle: "የተመሰለ የቶከን ልውውጥ ውጤት",
		jobsTitle: "ስራዎች እና የስራ ቦታ ድጋፎች",
		jobsSubtitle: "ሚስጥራዊ የድጋፍ ማጣሪያ፣ በድምፅ ማመልከቻ እና የቀጣሪ JobPosting JSON-LD ውጤት የሚያሳይ የናሙና የስራ መድረክ።",
		jobsTabSeeker: "ለስራ ፈላጊዎች",
		jobsTabEmployer: "ለቀጣሪዎች",
		jobsPrivateFilterTitle: "የሚያስፈልገኝ ድጋፍ (ሚስጥራዊ ማጣሪያ)",
		jobsPrivateFilterNote: "ማጣሪያዎች በመሳሪያዎ ላይ ይቆያሉ። ቀጣሪዎች በፍጹም አያዩዋቸውም።",
		jobsMatchBadge: "ከ {total} ውስጥ {met} ተሟልተዋል",
		jobsNoFilterBadge: "ምንም ማጣሪያ አልተመረጠም",
		jobsRemoteLabel: "በርቀት",
		jobsApplyVoiceBtn: "በድምፅ አመልክት",
		jobsApplyDialogTitle: "ማመልከቻ፦ {title}",
		jobsApplyResultTitle: "የተመሰለ ማመልከቻ ተልኳል",
		jobsApplyResultNote: "የድጋፍ ፍላጎቶች የሚካተቱት በዚህ ማመልከቻ ውስጥ ማጋራትን ካበሩ ብቻ ነው።",
		jobsEmployerIntro: "ድርጅትዎ ለስራው መስጠት የሚችላቸውን የስራ ቦታ ድጋፎች ይዘርዝሩ። መዝገብ መደበኛ schema.org/JobPosting JSON-LD ያወጣል።",
		jobsEmployerOutputTitle: "የተዘጋጀ schema.org/JobPosting JSON-LD",
		jobsEmployerExplain: "የስራ መድረኮች ተወዳዳሪዎች በሚስጥር እንዲያጣሩ ይህን JSON-LD ማንበብ ይችላሉ።",
		partnerTitle: "የአጋር መቆጣጠሪያ",
		partnerBanner: "ለማሳያ የተዘጋጀ የአጋር መቆጣጠሪያ",
		partnerSubtitle: "ተማሪው በቀጥታ ሙከራው ላይ 'በአጋር ድርጅት በኩል ያገናኙኝ' ሲመርጥ፣ ሁሉም የተጻፉ መልሶች ተሸፍነው እዚህ ይታያሉ።",
		partnerOpenDemoLink: "ቀጥታ ሙከራ ክፈት",
		partnerNoSessions: "እስካሁን ንቁ የአጋር ክፍለ ጊዜ የለም። ለመጀመር /demo ላይ 'በአጋር በኩል' ይምረጡ።",
		partnerStepLabel: "አሁን ያለበት ደረጃ፦ {step} ከ {total}",
		partnerMaskedTitle: "የቅጽ አወቃቀር (የተማሪው መልሶች ተሸፍነዋል)",
		partnerJoinBtn: "ክፍለ ጊዜውን ተቀላቀል",
		partnerJoinedLabel: "ክፍለ ጊዜውን ተቀላቅለዋል",
		partnerConfirmBtn: "ማንነት አረጋግጥ",
		partnerVerifiedLabel: "ማንነት ተረጋግጧል (partner_verified)",
		profileTitle: "የእኔ መገለጫ",
		profileSubtitle: "ከመጨረሻው የተጠናቀቀ ምዝገባ የተገኘውን መገለጫ ይመልከቱና ያሻሽሉ፣ ወይም የድጋፍ ፍላጎትዎን ማን እንደሚያይ ያስተዳድሩ።",
		profileEmptyTitle: "እስካሁን በዚህ መሳሪያ ላይ የተቀመጠ መገለጫ የለም",
		profileEmptyBody: "መገለጫዎን እዚህ ለማየት እና ለማረም በቀጥታ ሙከራው ምዝገባ ያጠናቅቁ።",
		profileGoDemo: "ወደ ቀጥታ ሙከራ ሂድ",
		profileEditDialogTitle: "መልስ አሻሽል",
		profileVerifiedBadge: "በአጋር የተረጋገጠ",
		profilePendingBadge: "የአጋር ማረጋገጫ በመጠባበቅ ላይ",
		profileWhoCanSeeTitle: "የድጋፍ ፍላጎቶቼን ማን ማየት ይችላል",
		profileDeleteBtn: "መገለጫዬን ከዚህ መሳሪያ ሰርዝ",
		profileDeletedNotice: "የተቀመጠው መገለጫዎ እና መልሶችዎ ከዚህ መሳሪያ ተሰርዘዋል።",
		a11yPageTitle: "የተደራሽነት መግለጫ",
		a11yPageIntro: "መዝገብ ስክሪን አንባቢ፣ ኪቦርድ፣ ድምፅ ወይም ከፍተኛ ማጉያ የሚጠቀሙ ተማሪዎች በነጻነት እንዲመዘገቡ WCAG 2.2 Level AAን ለማሟላት ተገንብቷል።",
		a11yStandardHeading: "የታለመው ደረጃ",
		a11yStandardBody: "Web Content Accessibility Guidelines (WCAG) 2.2 Level AA.",
		a11yTestedHeading: "የተፈተሹ ነገሮች",
		a11yTestedBody: "በኪቦርድ ብቻ መጠቀም፣ የሚታይ 3px የትኩረት ምልክት፣ ARIA ምልክቶች፣ ትኩረት የሚይዙ መስኮቶች እና 200% ማጉያ በ 320px ስፋት። ሙሉ የNVDA እና TalkBack ፍተሻ በቡድኑ ይጠናቀቃል።",
		a11yLimitsHeading: "የሚታወቁ ገደቦች",
		a11yLimitsBody: "የአሳሽ ንባብ ድምፅ በተጠቃሚው መሳሪያ ላይ ባሉ ድምፆች ይወሰናል፤ የአማርኛ ድምፅ የሌላቸው መሳሪያዎች የእንግሊዝኛ ድምፅ ወይም ቀድመው የተቀዱ የቅጽ ድምፆችን ይጠቀማሉ።",
		a11yReportHeading: "ችግር ያሳውቁ",
		a11yReportBody: "መዝገብን ሲሞክሩ ማንኛውም መሰናክል ካጋጠምዎት ወደ hello@mezgeb.example ይጻፉ ወይም በGitHub ጉዳይ ይክፈቱ።",
		docsBanner: "ለቡድን ውይይት የተዘጋጀ ረቂቅ ሰነድ።",
		docsNavTitle: "ሰነዶች",
		docsMenuBtn: "የሰነዶች ምናሌ",
		docsOnThisPage: "በዚህ ገጽ ላይ",
		tplLearningName: "የመማሪያ መድረክ",
		tplLearningDesc: "ቡትካምፖች፣ ቴክኒክና ሙያ እና የመስመር ላይ ኮርሶች (9 ጥያቄዎች፤ አራቱም የመታወቂያ መንገዶች)።",
		tplJobSeekerName: "የስራ መድረክ፦ ስራ ፈላጊ",
		tplJobSeekerDesc: "ስራ የሚፈልጉ ሰዎች (ከታሪክ የሚወጡ ክህሎቶች፣ የስራ ልምድ፣ የቃለ መጠይቅ ድጋፍ፣ ሚስጥራዊ የስራ ማጣሪያ)።",
		tplEmployerName: "የቀጣሪ ምዝገባ",
		tplEmployerDesc: "ስራ የሚለጥፉ ኩባንያዎች (የስራ መደብ፣ ኩባንያ፣ ቦታ፣ ኩባንያው የሚሰጣቸው የስራ ቦታ ድጋፎች)።",
		tplProgrammeName: "የፕሮግራም ምዝገባ",
		tplProgrammeDesc: "ሰዎችን የሚመዘግቡ ድርጅቶች (አነስተኛ መስኮች፤ አራቱም የመታወቂያ መንገዶች፤ የአጋር ምዝገባ በነባሪ)።",
		tplJobAppName: "የስራ ማመልከቻ",
		tplJobAppDesc: "ሚስጥራዊ የቃለ መጠይቅ ድጋፍ ምርጫዎች ያሉት አጭር የድምፅ ማመልከቻ።",
		qLangLabel: "የትኛውን ቋንቋ ይመርጣሉ?",
		qLangHint: "በማንኛውም ጊዜ መቀየር ይችላሉ።",
		qFullNameLabel: "ሙሉ ስምዎ ማን ነው?",
		qFullNameHint: "ሰዎች የሚያውቁበትን ስም ይጠቀሙ።",
		qAreaLabel: "የት አካባቢ ነው የሚኖሩት?",
		qAreaHint: "አዲስ አበባ ክፍለ ከተማ ወይም ሌላ ይምረጡ።",
		qPhoneLabel: "ስልክ ቁጥርዎ ስንት ነው?",
		qPhoneHint: "በ 09 ወይም 07 የሚጀምር ባለ 10 አሃዝ ቁጥር።",
		qDobLabel: "የተወለዱበት ቀን መቼ ነው?",
		qDobHint: "በነባሪነት የኢትዮጵያ ቀን መቁጠሪያ ተመርጧል።",
		qIdRouteLabel: "ማንነትዎን እንዴት ያሳያሉ?",
		qIdRouteHint: "ማንኛውንም አማራጭ ይምረጡ። ለመጀመር ፋይዳ አያስፈልግም።",
		qSupportLabel: "ለመማር ወይም ለመፈተን የሚረዳዎት ድጋፍ አለ?",
		qSupportHint: "በነባሪ ሚስጥራዊ ነው። ምንም የህክምና ማረጋገጫ አይጠየቅም።",
		qWorkStoryLabel: "ስለሰሩት ስራ ይንገሩን",
		qWorkStoryHint: "ክፍያ ያለው ወይም የሌለው ስራ፣ ቤተሰብን መርዳት ወይም የማህበረሰብ ስራ ሁሉ ይቆጠራል።",
		qJobTitleLabel: "የስራው መደብ ስም ምንድን ነው?",
		qJobTitleHint: "ግልጽ እና ቀላል ስም ይጠቀሙ (ለምሳሌ ጀማሪ የዳታ ባለሙያ)።",
		qCompanyNameLabel: "የኩባንያዎ ወይም የድርጅትዎ ስም ማን ነው?",
		qCompanyNameHint: "በሚለጥፉት የስራ ማስታወቂያ ላይ ይታያል።",
		qJobLocationLabel: "ስራው የት ነው የሚገኘው?",
		qJobLocationHint: "ከተማ፣ ክፍለ ከተማ ወይም በርቀት።",
		qContactRoleLabel: "ዋናው የቅጥር ተጠሪ ማን ነው?",
		qContactRoleHint: "ስም እና የስራ ድርሻ (ለምሳሌ ሰላማዊት፣ የሰው ሀብት አስተባባሪ)።",
		qEmployerAccomLabel: "ኩባንያዎ የትኞቹን የስራ ቦታ ድጋፎች መስጠት ይችላል?",
		qEmployerAccomHint: "አመልካቾች በሚስጥር እንዲያጣሩ በስራ ማስታወቂያ ላይ ይታተማል።",
		qJobGoalLabel: "ምን አይነት ስራ ነው የሚፈልጉት?",
		qJobGoalHint: "በራስዎ ቃል ይጻፉ ወይም ይናገሩ።",
		qInterviewSupportLabel: "ለቃለ መጠይቅ ድጋፍ ይፈልጋሉ?",
		qInterviewSupportHint: "በነባሪ ሚስጥራዊ ነው። ማጋራትን ካበሩ ብቻ ይጋራል።",
		qWhyWantJobLabel: "ይህን ስራ ለምን ይፈልጋሉ?",
		qWhyWantJobHint: "በአማርኛ ወይም በእንግሊዝኛ ጥቂት ዓረፍተ ነገሮችን ይናገሩ ወይም ይጻፉ።",
		qStartWhenLabel: "መቼ መጀመር ይችላሉ?",
		qStartWhenHint: "ቅርቡን አማራጭ ይምረጡ።",
		qConsentLearning: "በዚህ የመማሪያ መድረክ ላይ መገለጫ ለመፍጠር ተስማምቻለሁ።",
		qConsentJobSeeker: "የስራ ፈላጊ መገለጫዬን እና ሚስጥራዊ የድጋፍ ማጣሪያዎቼን ለማስቀመጥ ተስማምቻለሁ።",
		qConsentEmployer: "ድርጅታችን የተመረጡትን የስራ ቦታ ድጋፎች ማቅረብ እንደሚችል አረጋግጣለሁ።",
		qConsentProgramme: "በዚህ ፕሮግራም ወይም በመረጥኩት አጋር በኩል ለመመዝገብ ተስማምቻለሁ።",
		qConsentJobApp: "ይህን ማመልከቻ ለቀጣሪው ለመላክ ተስማምቻለሁ።",
		optLangAm: "አማርኛ (Amharic)",
		optLangEn: "English (እንግሊዝኛ)",
		optStartImmediate: "ወዲያውኑ",
		optStartTwoWeeks: "በሁለት ሳምንት ውስጥ",
		optStartOneMonth: "በአንድ ወር ውስጥ",
		optAreaAddisKetema: "አዲስ ከተማ",
		optAreaAkaky: "አቃቂ ቃሊቲ",
		optAreaArada: "አራዳ",
		optAreaBole: "ቦሌ",
		optAreaGullele: "ጉለሌ",
		optAreaKirkos: "ቂርቆስ",
		optAreaKolfe: "ኮልፌ ቀራኒዮ",
		optAreaLemiKura: "ለሚ ኩራ",
		optAreaLideta: "ልደታ",
		optAreaNifasSilk: "ንፋስ ስልክ ላፍቶ",
		optAreaYeka: "የካ",
		optAreaOther: "ሌላ ከተማ ወይም ክልል",
		optSupportScreenReader: "ስክሪን አንባቢ",
		optSupportExtraTime: "ተጨማሪ ጊዜ",
		optSupportStepFree: "ደረጃ የሌለው መግቢያ",
		optSupportSignLang: "የምልክት ቋንቋ አስተርጓሚ",
		optSupportLargePrint: "ትልቅ ጽሑፍ / ከፍተኛ ንጽጽር",
		optSupportQuietRoom: "ጸጥ ያለ ክፍል",
		optSupportFlexibleHours: "ተለዋዋጭ ሰዓት",
		optSupportRemote: "በርቀት የመስራት አማራጭ",
		optCommonSkillSales: "ሽያጭ",
		optCommonSkillBookkeeping: "የሂሳብ አያያዝ",
		optCommonSkillCustomer: "የደንበኛ አገልግሎት",
		optCommonSkillTailoring: "ልብስ ስፌት / እደ ጥበብ",
		optCommonSkillDigital: "መሰረታዊ የኮምፒውተር አጠቃቀም",
		optCommonSkillTeaching: "ሌሎችን ማስተማር / መርዳት",
		widgetSkipQuestion: "ይህን ጥያቄ ይለፉ",
		widgetHiddenByRule: "ይህ ጥያቄ በህጉ መሰረት ተደብቋል",
		errEmailFormat: "ትክክለኛ የኢሜይል አድራሻ ያስገቡ (ለምሳሌ name@example.com)።",
		errNumberFormat: "ትክክለኛ ቁጥር ያስገቡ።",
		errDigitsOnly: "ቁጥሮችን (0–9) ብቻ ይጠቀሙ።",
		errLettersOnly: "ፊደላትን ብቻ ይጠቀሙ።",
		errMinLength: "ቢያንስ {min} ፊደላት ያስገቡ።",
		errMaxLength: "ይህን መልስ ከ {max} ፊደላት በታች ያድርጉት።",
		errMinNumber: "{min} ወይም ከዚያ በላይ የሆነ ቁጥር ያስገቡ።",
		errMaxNumber: "{max} ወይም ከዚያ በታች የሆነ ቁጥር ያስገቡ።",
		helpErrEMAIL_INVALID: "@ ምልክት ያለው የኢሜይል አድራሻ ያስገቡ (ለምሳሌ selam@example.com)፣ ወይም አማራጭ ከሆነ ይለፉት።",
		helpErrNUMBER_INVALID: "ቁጥሮችን ብቻ በመጠቀም ሙሉ ወይም አስርዮሽ ቁጥር ያስገቡ።",
		helpErrMIN_LENGTH: "መልስዎ ትንሽ አጭር ነው። እባክዎ ተጨማሪ ፊደላት ያክሉ።",
		helpErrMAX_LENGTH: "መልስዎ ከተፈቀደው በላይ ረዝሟል። እባክዎ ትንሽ ያሳጥሩት።",
		helpErrDIGITS_ONLY: "ፊደላትን ሳያካትቱ ቁጥሮችን (0–9) ብቻ ይጻፉ።",
		helpErrLETTERS_ONLY: "ቁጥሮችን ሳያካትቱ ፊደላትን ብቻ ይጻፉ።",
		helpErrNUMBER_RANGE: "በስህተት መልዕክቱ ላይ የሚታየውን ዝቅተኛና ከፍተኛ ቁጥር ያረጋግጡ።",
		helpTypeYesNo: "ከታች 'አዎ' ወይም 'አይ' የሚለውን ይምረጡ።",
		helpTypeEmail: "ካለዎት የኢሜይል አድራሻ ያስገቡ፣ ወይም አማራጭ ከሆነ ይለፉት።",
		helpTypeNumber: "ቁጥሮችን በመጠቀም ሳጥኑ ውስጥ ቁጥር ይጻፉ።",
		helpTypeInfo: "ይህን መረጃ ያንብቡ ወይም ያዳምጡ፣ ከዚያ 'ቀጥል' ይጫኑ።",
		helpTypeConsent: "መግለጫውን በጥንቃቄ አንብበው ለማረጋገጥ ሳጥኑን ምልክት ያድርጉ።",
		idRouteFayda: "ፋይዳ",
		idRouteRefugee: "የስደተኛ መታወቂያ",
		idRouteOther: "ሌላ ሰነድ",
		idRoutePartner: "የአጋር ማጣቀሻ",
		featVoice: "ድምፅ",
		featReadAloud: "ጮክ ብሎ ማንበብ",
		featHelp: "እርዳታ",
		featPartner: "አጋር",
		featOffline: "ከመስመር ውጭ",
		featSms: "በSMS መቀጠል",
		featSimplify: "በቀላሉ መናገር",
		catLearning: "ትምህርት",
		catJobs: "ስራዎች",
		catEmployer: "ቀጣሪዎች",
		catNgo: "መንግስታዊ ያልሆኑ ድርጅቶች",
		catCustom: "የእኔ ቅጽ",
		templatesSearchLabel: "ቅጾችን ይፈልጉ",
		templatesSearchPlaceholder: "ቅጾችን ይፈልጉ",
		templatesResultCount: "{count} ቅጾች",
		templatesResultCountOne: "1 ቅጽ",
		templatesFilterAll: "ሁሉም",
		templatesFilterLearning: "ትምህርት",
		templatesFilterJobs: "ስራዎች",
		templatesFilterEmployer: "ቀጣሪዎች",
		templatesFilterNgo: "መንግስታዊ ያልሆኑ ድርጅቶች",
		templatesFilterMine: "የእኔ ቅጾች",
		templatesEmptySearch: "ከፍለጋዎ ጋር የሚስማማ ቅጽ የለም። የፍለጋ ሳጥኑን አጽድተው ይሞክሩ።",
		templatesEmptyMine: "እስካሁን ያስቀመጡት ቅጽ የለም። ለመፍጠር እና ለማስቀመጥ ቅጽ ገንቢውን ይክፈቱ።",
		templatesTestedBadge: "የተፈተሸ ቃላት",
		templatesBestForLabel: "ተስማሚነቱ ለ፦",
		templatesEstimateTime: "ወደ {min} ደቂቃ",
		templatesBothLangs: "አማርኛ እና እንግሊዝኛ",
		templatesCollectsLabel: "የሚሰበስበው፦",
		templatesSensitiveBadge: "ሚስጥራዊ",
		templatesCustomizeBtn: "አስተካክል",
		templatesBuildAiLink: "በAI ቅጽ ይገንቡ",
		templatesOpenBuilderBtn: "ቅጽ ገንቢ ክፈት",
		templatesEditedOn: "የተስተካከለው {date}",
		templatesMoreActions: "የቅጽ እርምጃዎች",
		templatesActionDuplicate: "ቅዳ (Duplicate)",
		templatesActionRename: "ስም ቀይር",
		templatesActionExport: "JSON አውርድ",
		templatesActionDelete: "ሰርዝ",
		templatesRenameTitle: "የቅጽ ስም ቀይር",
		templatesRenameLabelEn: "የቅጽ ስም (እንግሊዝኛ)",
		templatesRenameLabelAm: "የቅጽ ስም (አማርኛ)",
		templatesDeleteTitle: "የተቀመጠ ቅጽ ይሰረዝ?",
		templatesDeleteConfirm: "\"{name}\"ን ከእኔ ቅጾች ማስወገድ ይፈልጋሉ? ይህ ሊመለስ አይችልም።",
		templatesDeleteBtn: "ቅጹን ሰርዝ",
		templatesCompareBtn: "ቅጾችን ያነጻጽሩ",
		templatesCompareColTemplate: "ቅጽ",
		templatesCompareColQuestions: "ጥያቄዎች",
		templatesCompareColTime: "የሚፈጀው ጊዜ",
		templatesCompareColRoutes: "የመታወቂያ መንገዶች",
		templatesCompareColVoice: "ድምፅ",
		templatesCompareColPartner: "የአጋር ማጣቀሻ",
		templatesCompareColSensitive: "ሚስጥራዊ መረጃ ይሰበስባል",
		templatesPreviewTabPreview: "ቅድመ-ዕይታ",
		templatesPreviewTabQuestions: "ጥያቄዎች",
		templatesPreviewTabJson: "JSON",
		templatesPreviewPhone: "ስልክ",
		templatesPreviewDesktop: "ዴስክቶፕ",
		templatesPreviewQuestionsHeading: "ወደዚያ ለመዝለል ጥያቄን ይጫኑ",
		builderTitle: "ቅጽ ገንቢ",
		builderNamePlaceholder: "ስም የሌለው ቅጽ",
		builderStatusSaved: "ተቀምጧል",
		builderStatusSaving: "በማስቀመጥ ላይ…",
		builderStatusUnsaved: "ያልተቀመጡ ለውጦች",
		builderUndo: "መልስ",
		builderRedo: "ድገም",
		builderShortcutsBtn: "አቋራጮች",
		builderCheckBtn: "ቅጹን ፈትሽ",
		builderPreviewBtn: "ቅድመ-ዕይታ",
		builderExportBtn: "ላክ / አውርድ",
		builderUsePlaygroundBtn: "መሞከሪያው ውስጥ ተጠቀም",
		builderBackGallery: "ወደ ቅጾች ተመለስ",
		builderNewTemplateBtn: "እንደገና ጀምር",
		builderStartTitle: "የምዝገባ ቅጽ ይፍጠሩ ወይም ያስተካክሉ",
		builderStartSubtitle: "እያንዳንዱ ቅጽ በአንድ ስክሪን አንድ ጥያቄ እና የአማርኛና የእንግሊዝኛ ጽሑፎች ይኖሩታል።",
		builderStartFromTplTitle: "ከቅጽ ይጀምሩ",
		builderStartFromTplDesc: "ከአራቱ ዝግጁ ቅጾች አንዱን መርጠው ጥያቄዎችን፣ የመታወቂያ መንገዶችን ወይም መልኩን ያስተካክሉ።",
		builderStartDescribeTitle: "የሚፈልጉትን ይግለጹ",
		builderStartDescribeDesc: "ስለ ፕሮግራምዎ ወይም ተማሪዎችዎ ይግለጹና የመዝገብ AI በግልጽ ቋንቋ ቅጽ ያዘጋጅልዎታል።",
		builderStartDescribeAiOffNote: "የመስመር ላይ AI ግንኙነት ይፈልጋል። ከመስመር ውጭ ሲሆኑ ወይም AI ሲጠፋ ከቅጽ ይጀምሩ ወይም ያለዎትን ቅጽ ይለጥፉ።",
		builderStartPasteTitle: "አሁን ያለዎትን ቅጽ ይለጥፉ",
		builderStartPasteDesc: "የመስክ ስሞችን (በየመስመሩ ወይም በኮማ ተለይተው) ይለጥፉ። መዝገብ የጥያቄውን አይነት ከመስመር ውጭ ገምቶ ፍተሻ ያካሂዳል።",
		builderStartPastePlaceholder: "ሙሉ ስም\nስልክ ቁጥር\nኢሜይል\nየትውልድ ቀን\nክልል\nየትምህርት ደረጃ",
		builderStartPasteCreateBtn: "መስኮችን ወደ ጥያቄዎች ቀይር",
		builderStartPasteAiBtn: "በAI አሻሽል",
		builderImportJsonLink: "JSON አስገባ",
		builderImportJsonTitle: "የቅጽ JSON አስገባ",
		builderImportJsonDesc: "ወደ ውጭ የተላከ የመዝገብ JSON ይለጥፉ ወይም .json ፋይል ይስቀሉ።",
		builderImportJsonFileLabel: "JSON ፋይል ይስቀሉ",
		builderImportJsonTextLabel: "ወይም JSON እዚህ ይለጥፉ",
		builderImportJsonBtn: "ቅጽ አስገባ",
		builderImportJsonBadFormat: "ይህን JSON ማንበብ አልተቻለም። እባክዎ ፋይሉን ወይም አጻጻፉን ያረጋግጡ።",
		builderTabOutline: "ዝርዝር",
		builderTabEdit: "አርም",
		builderTabPreview: "ቅድመ-ዕይታ",
		builderPanelOutlineHeading: "ዝርዝር",
		builderPanelEditHeading: "ጥያቄ አርም",
		builderPanelPreviewHeading: "ቅድመ-ዕይታ",
		builderAddSectionBtn: "ክፍል ጨምር",
		builderNewSectionName: "አዲስ ክፍል",
		builderUnsortedSection: "ያልተመደበ",
		builderRenameSection: "የክፍል ስም ቀይር",
		builderDeleteSection: "ክፍል ሰርዝ",
		builderAddQuestionBtn: "ጥያቄ ጨምር",
		builderRequiredBadge: "ግዴታ",
		builderSensitiveBadge: "ሚስጥራዊ",
		builderBranchBadge: "ቅድመ-ሁኔታ",
		builderMoveToSection: "ወደ ክፍል ውሰድ…",
		builderMovedAnnouncement: "{label} ወደ ቦታ {pos} ተወስዷል",
		builderSectionMovedAnnouncement: "{label} ወደ {section} ተወስዷል",
		builderDeletedToast: "\"{label}\" ተወግዷል።",
		builderUndoDeleteBtn: "መልስ",
		builderNoQuestionSelected: "ለማረም ከዝርዝሩ ጥያቄ ይምረጡ ወይም አዲስ ጥያቄ ያክሉ።",
		qLibTitle: "ጥያቄ ጨምር",
		qLibTabReady: "ዝግጁ ጥያቄዎች",
		qLibTabBlank: "ባዶ ጥያቄ",
		qLibAddBtn: "ጨምር",
		qLibBlankBtn: "ባዶ ፍጠር",
		inspTabQuestion: "ጥያቄ",
		inspTabSettings: "የቅጽ ቅንብሮች",
		inspTabLook: "መልክ",
		inspTabChecker: "መፈተሻ",
		inspTabExport: "ላክ / አስቀምጥ",
		inspGroupQuestion: "ጥያቄ",
		inspTypeLabel: "የጥያቄ አይነት",
		inspTypeChangeWarn: "ወደዚህ አይነት መቀየር ያሉትን የመልስ አማራጮች ያስወግዳል።",
		inspLabelEn: "ጽሑፍ (እንግሊዝኛ)",
		inspLabelAm: "ጽሑፍ (አማርኛ)",
		inspCharsCount: "{count} ፊደላት",
		inspMissingBadge: "ጎድሏል",
		inspHintEn: "ፍንጭ (እንግሊዝኛ)",
		inspHintAm: "ፍንጭ (አማርኛ)",
		inspPlaceholderEn: "ምሳሌ ጽሑፍ (እንግሊዝኛ)",
		inspPlaceholderAm: "ምሳሌ ጽሑፍ (አማርኛ)",
		inspTestReadAloud: "ጮክ ብለህ አንብብ",
		inspGroupOptions: "የመልስ አማራጮች",
		inspOptValue: "የሚቀመጥ ዋጋ",
		inspOptEn: "የእንግሊዝኛ ጽሑፍ",
		inspOptAm: "የአማርኛ ጽሑፍ",
		inspOptAdd: "+ አማራጭ ጨምር",
		inspOptPasteBtn: "አማራጮችን ለጥፍ",
		inspOptPasteLabel: "በየመስመሩ አንድ አማራጭ (እንግሊዝኛ)",
		inspOptPasteApply: "የተለጠፉ አማራጮችን ጨምር",
		inspOptAddOther: "+ 'ሌላ' ጨምር",
		inspOptAddPreferNot: "+ 'መናገር አልፈልግም' ጨምር",
		inspOptDelete: "አማራጭ አስወግድ",
		inspYesNoEditNote: "በ'አዎ' እና 'አይ' አዝራሮች ላይ የሚታዩትን ጽሑፎች ያርሙ።",
		inspGroupRules: "ህጎች",
		inspRequiredToggle: "ግዴታ ጥያቄ",
		inspSkippableToggle: "\"ይህን ጥያቄ ይለፉ\" አዝራር አሳይ",
		inspSkippableDisabledNote: "የሚገኘው 'ግዴታ' ሲጠፋ ብቻ ነው።",
		inspPresetLabel: "የማረጋገጫ ህግ",
		inspPresetNone: "የለም",
		inspPresetPhone: "የኢትዮጵያ ስልክ (09 / 07)",
		inspPresetEmail: "የኢሜይል አድራሻ",
		inspPresetDigits: "ቁጥሮች ብቻ (0–9)",
		inspPresetLetters: "ፊደላት ብቻ",
		inspMinLength: "ዝቅተኛ ፊደላት",
		inspMaxLength: "ከፍተኛ ፊደላት",
		inspMinVal: "ዝቅተኛ ቁጥር",
		inspMaxVal: "ከፍተኛ ቁጥር",
		inspGroupShowIf: "ይህን ጥያቄ አሳይ ከሆነ ብቻ…",
		inspShowIfQuestion: "ቀዳሚ ጥያቄ",
		inspShowIfAlways: "ይህን ጥያቄ ሁልጊዜ አሳይ",
		inspShowIfEquals: "መልሱ ሲሆን",
		inspShowIfSummary: "የሚታየው \"{question}\" \"{answer}\" ሲሆን ብቻ ነው።",
		inspShowIfRemove: "ቅድመ-ሁኔታ አስወግድ",
		inspShowIfNoEarlier: "ቅድመ-ሁኔታ ለማዘጋጀት መጀመሪያ ቀዳሚ ጥያቄ ያክሉ።",
		inspGroupA11y: "ተደራሽነት እና ድምፅ",
		inspAllowVoiceToggle: "የድምፅ መልሶችን ፍቀድ",
		inspAudioAmLabel: "የአማርኛ ድምፅ URL (አማራጭ)",
		inspAudioEnLabel: "የእንግሊዝኛ ድምፅ URL (አማራጭ)",
		inspAudioPlayTest: "ሞክር",
		inspAudioPlayError: "ያንን የድምፅ URL ማጫወት አልተቻለም።",
		inspIconLabel: "የጥያቄ አዶ",
		inspErrorHelpEn: "ቀላል የስህተት እርዳታ (እንግሊዝኛ)",
		inspErrorHelpAm: "ቀላል የስህተት እርዳታ (አማርኛ)",
		inspGroupPrivacy: "ውሂብ እና ግላዊነት",
		inspMapsToLabel: "የሚቀመጥበት መስክ (maps_to)",
		inspMapsToDuplicate: "ሌላ ጥያቄ ቀድሞውኑ ወደ \"{field}\" ያስቀምጣል። ልዩ ስም ይምረጡ።",
		inspSensitiveToggle: "ሚስጥራዊ የግል መረጃ",
		inspSensitiveExplain: "ሚስጥራዊ መልሶች በፍጹም ወደ AI አይላኩም እና ከአጋሮች የተደበቁ ናቸው።",
		inspGroupAi: "የAI መሳሪያዎች",
		inspAiImproveBtn: "ቃላቱን አሻሽል",
		inspAiTranslateBtn: "የጎደለውን ቋንቋ ተርጉም",
		inspAiCheckBtn: "ይህን ጥያቄ ፈትሽ",
		inspAiSuggestionTitle: "የAI ጥቆማ (ከመቀበልዎ በፊት ይመልከቱ)",
		inspAiTranslateNeedsReview: "የAI ትርጉም፣ ክለሳ ያስፈልገዋል",
		inspAiTranslateReviewed: "ተገምግሟል",
		inspAiAcceptBtn: "ተቀበል",
		inspAiDiscardBtn: "ተው",
		inspAiNothingMissing: "የእንግሊዝኛም ሆነ የአማርኛ ጽሑፎች ቀድሞውኑ ተሞልተዋል።",
		inspAiUnavailable: "የAI መሳሪያዎች የመስመር ላይ ግንኙነት እና በቅድመ-ዕይታው AI መብራት ይፈልጋሉ።",
		setCategoryLabel: "ምድብ",
		setBestForEn: "ተስማሚነቱ ለ (እንግሊዝኛ)",
		setBestForAm: "ተስማሚነቱ ለ (አማርኛ)",
		setDescEn: "መግለጫ (እንግሊዝኛ)",
		setDescAm: "መግለጫ (አማርኛ)",
		setIdRoutesTitle: "ተቀባይነት ያላቸው የመታወቂያ መንገዶች",
		setIdRoutesError: "ቢያንስ አንድ የመታወቂያ መንገድ ይምረጡ።",
		setIdRoutesFaydaWarn: "ፋይዳ መታወቂያ የሌላቸው ተማሪዎች ይታገዳሉ።",
		setSupportTitle: "ነባሪ የድጋፍ አማራጮች",
		setSupportRestoreBtn: "ነባሪዎችን መልስ",
		setFeaturesTitle: "የበሩ ባህሪያት",
		setFeatVoiceDesc: "ተማሪዎች በአማርኛ ወይም በእንግሊዝኛ የድምፅ መልስ መቅዳት ይችላሉ።",
		setFeatReadAloudDesc: "በእያንዳንዱ ስክሪን ላይ 'ጮክ ብለህ አንብብ' አዝራር ያሳያል።",
		setFeatHelpDesc: "ግልጽ መመሪያ እና አማራጭ AI ያለው 'እርዳታ (Alt+H)' ያሳያል።",
		setFeatPartnerDesc: "ታማኝ አጋሮች ከተማሪው ጎን ሆነው እንዲመዘገቡ ይፈቅዳል።",
		setFeatSmsDesc: "በቅጹ ግርጌ 'በኋላ በSMS ሊንክ ይጨርሱ' ያሳያል።",
		setFeatOfflineDesc: "ሂደቱን በመሳሪያው ላይ ያስቀምጣል እና ከመስመር ውጭ ወረፋ ያስይዛል።",
		setFeatSimplifyDesc: "ከጥያቄው ርዕስ ጎን 'በቀላል ቃል ንገረኝ' ያሳያል።",
		setConsentTitle: "የስምምነት መግለጫ",
		setConsentEn: "የስምምነት ጽሑፍ (እንግሊዝኛ)",
		setConsentAm: "የስምምነት ጽሑፍ (አማርኛ)",
		setConsentRecommendedBtn: "የተመከረ ቃላት ተጠቀም",
		lookPlatformName: "የመድረክ ስም",
		lookLogoLetter: "የአርማ ፊደል",
		lookAccentLabel: "የማድመቂያ ቀለም",
		lookContrastPass: "AA ያልፋል (ከነጭ ጽሑፍ ጋር {ratio}:1 ንጽጽር)",
		lookContrastFail: "ለነጭ ጽሑፍ በጣም የቀላ ({ratio}:1) — ጠቆር ያለ ቀለም ይምረጡ",
		lookSaveBlockedNote: "ከማስቀመጥዎ ወይም ከመላክዎ በፊት የማድመቂያ ቀለሙን ንጽጽር ያስተካክሉ።",
		checkerSummary: "{must} መስተካከል ያለባቸው · {should} ቢስተካከሉ የሚሻሉ · {tips} ምክሮች",
		checkerMustBadge: "መስተካከል ያለበት",
		checkerShouldBadge: "ቢስተካከል የሚሻል",
		checkerTipBadge: "ምክር",
		checkerEmpty: "ሁሉም ፍተሻዎች አልፈዋል። ቅጽዎ ለማስቀመጥ እና ለመላክ ዝግጁ ነው።",
		checkerGoToBtn: "ወደ ጥያቄው ሂድ",
		checkerFixBtn: "አስተካክል",
		checkerRunAiBtn: "የAI ፍተሻ አሂድ",
		checkerAiRunning: "በAI በመፈተሽ ላይ…",
		checkerAiTag: "የAI ግኝት",
		exportEmbedTitle: "የማካተቻ ኮድ (Embed)",
		exportCopyJson: "JSON ቅዳ",
		exportDownloadJson: "JSON አውርድ",
		exportOpenPlayground: "መሞከሪያው ውስጥ ክፈት",
		exportSaveMyTemplates: "ወደ እኔ ቅጾች አስቀምጥ",
		exportSavedSuccess: "ወደ እኔ ቅጾች ተቀምጧል። አሁን በቅጽ ማሳያው ውስጥ ይታያል።",
		exportStorageBlocked: "በዚህ ሁኔታ የአሳሽ ማከማቻ ታግዷል። ቅጂ ለመያዝ 'JSON አውርድ' ይጠቀሙ።",
		exportValidationBlocked: "ከማስቀመጥዎ ወይም መሞከሪያው ውስጥ ከመክፈትዎ በፊት በመፈተሻው ውስጥ ያሉ 'መስተካከል ያለባቸው' ችግሮችን ሁሉ ያስተካክሉ።",
		previewAiOff: "AI ጠፍቷል",
		previewOffline: "ከመስመር ውጭ",
		previewRestart: "ቅድመ-ዕይታ ዳግም አስጀምር",
		previewNoSaveNote: "የቅድመ-ዕይታ መልሶች በፍጹም አይቀመጡም።",
		shortcutsTitle: "የኪቦርድ አቋራጮች",
		shortcutAltArrows: "የተመረጠውን ጥያቄ ወደ ላይ ወይም ወደ ታች ውሰድ",
		shortcutDuplicate: "የተመረጠውን ጥያቄ ቅዳ",
		shortcutDelete: "የተመረጠውን ጥያቄ ሰርዝ (መመለስ ይቻላል)",
		shortcutUndo: "የመጨረሻውን ለውጥ መልስ",
		shortcutRedo: "ለውጡን ድገም",
		shortcutCheck: "የቅጽ መፈተሻውን አሂድ",
		shortcutHelp: "ይህን የአቋራጮች ዝርዝር ክፈት",
		navHowItWorks: "እንዴት እንደሚሰራ",
		navTryDemo: "ሙከራውን ይሞክሩ",
		navAddToSite: "ወደ ድረ-ገጽዎ ያክሉ",
		navMainAria: "ዋና አሰሳ",
		navMobileAria: "የሞባይል አሰሳ",
		footerColProduct: "ምርት",
		footerColDevelopers: "ገንቢዎች",
		footerColProject: "ፕሮጀክት",
		footerLinkApi: "REST API",
		footerLinkEmployerForm: "የአሰሪ ድጋፍ ቅጽ",
		footerLinkPartner: "የአጋር መቆጣጠሪያ",
		footerLinkSource: "ምንጭ ኮድ",
		footerLicenceLabel: "Apache-2.0 ፈቃድ",
		footerHackathonCredit: "ለዲጂታል ብሪጅ ተደራሽነት ሃካቶን 2026 የተገነባ",
		copyCodeBtn: "ኮድ ቅዳ",
		landingHeroLabel: "ለኢትዮጵያ መድረኮች ተደራሽ ምዝገባ",
		landingHeroH1Line1: "ሁሉንም ተማሪ የሚያዳምጥ",
		landingHeroH1Line2: "የምዝገባ ቅጽ።",
		landingHeroBody: "መዝገብ በሁለት መስመር ኮድ ወደ ድረ-ገጽዎ የሚጨምሩት የምዝገባ እና የመገለጫ ቅጽ ነው። ተማሪዎች በአማርኛ ወይም በእንግሊዝኛ በመናገር ወይም በመጻፍ መመለስ ይችላሉ፣ ከመስመር ውጭም ቢሆን።",
		landingHeroSeeCode: "ኮዱን ይመልከቱ",
		landingHeroDemoVoiceQ: "ስምህ ማን ነው?",
		landingHeroDemoTranscript: "ሐና ተስፋዬ",
		landingHeroFact1: "ከNVDA እና TalkBack ጋር ይሰራል",
		landingHeroFact2: "አማርኛ እና እንግሊዝኛ",
		landingHeroFact3: "ከመስመር ውጭ ይሰራል",
		landingHeroFact4: "ክፍት ምንጭ (Open source)",
		landingWhyStatement: "ብዙ የምዝገባ ቅጾች ጊዜያቸው ያልፋል፣ መለያዎችን ይደብቃሉ፣ እና አንዳንድ ተማሪዎች የሌላቸውን ሰነዶች ይጠይቃሉ።",
		landingWhyCol1Lead: "ጊዜ የሚያልፍባቸው ቅጾች",
		landingWhyCol1Body: "ዝግተኛ ኢንተርኔት እና ስክሪን አንባቢዎች እያንዳንዱን መስክ ለማንበብ ጊዜ ይፈልጋሉ። መዝገብ ያለ ጊዜ ገደብ እያንዳንዱን መልስ ወዲያውኑ ያስቀምጣል።",
		landingWhyCol2Lead: "ለጥቂቶች ብቻ የሚነበቡ ጥያቄዎች",
		landingWhyCol2Body: "ትንሽ ጽሑፍ እና የጎደሉ መለያዎች ዓይነ ስውራን እና አዲስ አንባቢዎችን ያግዳሉ። እያንዳንዱ ጥያቄ ግልጽ መለያ፣ ድምፅ ማንበቢያ እና የድምፅ መቀበያ አለው።",
		landingWhyCol3Lead: "ሰዎች የሌላቸው ማስረጃ",
		landingWhyCol3Body: "ብዙ ተፈናቃዮች እና የገጠር ተማሪዎች ገና የቀበሌ መታወቂያ ወይም ፋይዳ የላቸውም። መዝገብ የስደተኛ መታወቂያን፣ ሌላ ሰነድን እና የአጋር ማረጋገጫን ይቀበላል።",
		landingFeaturesLabel: "ተማሪዎች የሚያገኙት",
		landingFeaturesHeading: "ተማሪዎች የሚያገኙት",
		landingFeat1Title: "እያንዳንዱን መልስ በድምፅ ይመልሱ",
		landingFeat1Body: "ተማሪዎች የማይክሮፎን ቁልፉን ነክተው በአማርኛ ወይም በእንግሊዝኛ ይናገራሉ፣ ከመቀመጡ በፊትም ጽሑፉን ያረጋግጣሉ።",
		landingFeat1Link: "የድምፅ ምዝገባን ይሞክሩ",
		landingFeat2Title: "በአንድ ገጽ አንድ ጥያቄ",
		landingFeat2Body: "እያንዳንዱ ገጽ አንድ ግልጽ ጥያቄ ከትልቅ 'ተመለስ' እና 'አስቀምጥና ቀጥል' ቁልፎች ጋር ያቀርባል።",
		landingFeat2Link: "የተማሪውን ሂደት ይሞክሩ",
		landingFeat3Title: "ለሁሉም ሰው የመታወቂያ መንገዶች",
		landingFeat3Body: "መድረኮች ፋይዳን፣ የስደተኛ መታወቂያን፣ ሌላ ሰነድን ወይም ታማኝ አጋር ከተማሪው ጎን ሆኖ እንዲያረጋግጥ መፍቀድ ይችላሉ።",
		landingFeat3Link: "የአጋር መቆጣጠሪያን ይመልከቱ",
		landingFeat4Title: "ድጋፍን በሚስጥር ይጠይቁ",
		landingFeat4Body: "ተማሪዎች ያለ ህክምና ማስረጃ ተጨማሪ ጊዜ ወይም የምልክት ቋንቋ አስተርጓሚ መጠየቅ ይችላሉ። ማጋራት በነባሪነት ጠፍቷል።",
		landingFeat4Link: "የግላዊነት ዝርዝሮችን ያንብቡ",
		landingFeat5Title: "ከመስመር ውጭ መስራቱን ይቀጥላል",
		landingFeat5Body: "ኔትወርክ ሲቋረጥ መልሶች በስልኩ ላይ ይቀመጣሉ እና ግንኙነት ሲመለስ እስኪላኩ በወረፋ ይጠብቃሉ።",
		landingFeat5Link: "ከመስመር ውጭ ሁኔታን ይሞክሩ",
		landingPlatformsHeading: "በአንድ ከሰዓት በኋላ ይጨምሩት",
		landingPlatStep1Title: "ቅጽ ይምረጡ",
		landingPlatStep1Body: "ከትምህርት መድረክ፣ ስራ ፈላጊ፣ አሰሪ ወይም ፕሮግራም መግቢያ ይጀምሩ።",
		landingPlatStep2Title: "ሁለት መስመር ያክሉ",
		landingPlatStep2Body: "ስክሪፕቱን ይጫኑ እና የመመዝገቢያ ታጉን በገጽዎ ላይ ያስቀምጡ።",
		landingPlatStep3Title: "መገለጫውን ይቀበሉ",
		landingPlatStep3Body: "በሰርቨርዎ ላይ የአንድ ጊዜ ቶከኑን ይለውጡ ወይም webhook ይቀበሉ።",
		landingPlatLinkDocs: "ሰነዶችን ያንብቡ",
		landingPlatLinkPlayground: "መሞከሪያውን ይክፈቱ",
		landingPlatLinkOpenApi: "OpenAPI ዝርዝር ይመልከቱ",
		landingTemplatesHeading: "ከቅጽ ይጀምሩ",
		landingTemplatesPrev: "ቀዳሚ ቅጾች",
		landingTemplatesNext: "ቀጣይ ቅጾች",
		landingTemplatesQuestionsCount: "{count} ጥያቄዎች",
		landingTemplatesLangs: "አማርኛ፣ እንግሊዝኛ",
		widgetWelcomeTitle: "መገለጫዎን ይፍጠሩ",
		widgetWelcomeLine1: "ይህ ቅጽ መገለጫዎን ለማዘጋጀት አጭር ጥያቄዎችን ይጠይቃል።",
		widgetWelcomeLine2: "እያንዳንዱ መልስ በዚህ ስልክ ላይ ወዲያውኑ ይቀመጣል።",
		widgetWelcomeLine3: "የጊዜ ገደብ የለም፤ አቁመው በኋላ መመለስ ይችላሉ።",
		widgetWelcomeLangHeading: "ቋንቋዎን ይምረጡ",
		widgetWelcomeStart: "ጀምር",
		widgetWelcomeHaveLink: "የተቀመጠ ሊንክ አለኝ",
		widgetWelcomeResumePrompt: "የተቀመጠውን ሊንክ ወይም ኮድ ያስገቡ",
		widgetWelcomeResumeOpen: "የተቀመጠውን ክፈት",
		widgetModeHeading: "እንዴት መመለስ ይፈልጋሉ?",
		widgetModeHint: "ይህን ከላይኛው አሞሌ በማንኛውም ጊዜ መቀየር ይችላሉ።",
		widgetModeSpeakTitle: "መናገር እና መስማት",
		widgetModeSpeakDesc: "ጥያቄዎች ሲነበቡ ይስሙ እና መልስዎን በድምፅ ይናገሩ።",
		widgetModeTypeTitle: "ማንበብ እና መጻፍ",
		widgetModeTypeDesc: "እያንዳንዱን ጥያቄ በስክሪኑ ላይ አንብበው መልስዎን ይጻፉ።",
		widgetModeSimpleTitle: "ቀላል ቃላት ከምስሎች ጋር",
		widgetModeSimpleDesc: "ከእያንዳንዱ ጥያቄ ጎን ትልቅ ምልክት ያለው አጭር አጻጻፍ።",
		widgetModeSwitchLabel: "የመመለሻ መንገድ",
		widgetModeAutoReadLabel: "ጥያቄዎችን በራስ-ሰር አንብብ",
		widgetSaveContinue: "አስቀምጥና ቀጥል",
		widgetSpeakAnswerLabel: "መልስዎን ይናገሩ",
		widgetVoiceListeningLabel: "በማዳመጥ ላይ… ለማቆም ይንኩ",
		widgetVoiceProcessingLabel: "የተናገሩትን በመጻፍ ላይ…",
		widgetVoiceKeepBtn: "ያዝ",
		widgetVoiceTryAgainBtn: "እንደገና ሞክር",
		widgetVoiceFailedMsg: "ያንን መስማት አልቻልንም። እንደገና ይሞክሩ ወይም መልስዎን ይጻፉ።",
		widgetOfflineBanner: "ከመስመር ውጭ ነዎት። መልሶችዎ በዚህ ስልክ ላይ ተቀምጠዋል እና ሲገናኙ ይላካሉ።",
		widgetOutboxSendingBanner: "{count} በወረፋ ያሉ መልሶች በመላክ ላይ…",
		widgetOutboxSentBanner: "ሁሉም በወረፋ የነበሩ መልሶች ተልከዋል።",
		widgetSessionRestored: "እንኳን ደህና መጡ። ጥያቄ {step} ላይ ነበሩ።",
		widgetDobThatIs: "ይህ {date} ነው",
		widgetOtherDocUploadLabel: "የሰነድዎን ፎቶ ይጫኑ",
		widgetOtherDocCameraLabel: "በካሜራ ፎቶ ያንሱ",
		widgetOtherDocSelected: "የተመረጠ ፋይል: {name}",
		widgetSupportShareToggle: "ይህን ለመድረኩ አጋራ",
		widgetSupportShareExplainOn: "በርቷል: የመድረኩ ቡድን እነዚህን የተግባር ድጋፍ ጥያቄዎች ያያል።",
		widgetSupportShareExplainOff: "ጠፍቷል: የድጋፍ ፍላጎቶችዎ በመገለጫዎ ላይ ብቻ ይቆያሉ።",
		widgetSupportPrivateBadge: "ሚስጥራዊ",
		widgetDoneGetLink: "በኋላ ለመቀጠል ሊንክ ያግኙ",
		widgetHelpCloseBtn: "እርዳታውን ዝጋ",
		widgetHelpExampleLabel: "የምሳሌ መልስ",
		widgetHelpAskFieldLabel: "ስለዚህ መስክ ጥያቄ ይጠይቁ",
		widgetAssistedBanner: "ይህን ከ{name} ጋር እየሞሉ ነው። ከመላኩ በፊት መስማማት አለባቸው።",
		widgetAssistedSelfConsentTitle: "የተማሪ ማረጋገጫ",
		widgetAssistedSelfConsentBody: "እባክዎ ይህን መገለጫ ለመላክ መስማማታቸውን እንዲያረጋግጡ ስልኩን ለተማሪው ይስጡ።",
		demoSettingsToggle: "የሙከራ ቅንብሮች",
		demoStateTriggersLabel: "የመግብር ሁኔታዎችን አሳይ",
		demoTriggerError: "የመስክ ስህተት",
		demoTriggerVoiceListen: "ድምፅ በማዳመጥ ላይ",
		demoTriggerVoiceReview: "የድምፅ ክለሳ",
		demoTriggerVoiceFail: "ድምፅ አልተሰማም",
		demoTriggerOutboxSending: "ወረፋ በመላክ ላይ",
		demoTriggerHelpOpen: "የእርዳታ ፓነል",
		demoTriggerSmsSent: "የመመለሻ ሊንክ ተልኳል",
		demoTriggerRestored: "ክፍለ-ጊዜ ተመልሷል",
		demoSimulatedVoiceSample: "ሐና ተስፋዬ",
		templatesNewBtn: "አዲስ ቅጽ",
		templatesImportBtn: "JSON አስገባ",
		templatesLangFilterLabel: "ቋንቋ",
		templatesLangFilterAll: "ሁሉም ቋንቋዎች",
		templatesLangFilterAmEn: "አማርኛ እና እንግሊዝኛ",
		templatesSampleBadge: "ናሙና",
		templatesAiCardTitle: "በAI ይፍጠሩ",
		templatesAiCardLabel: "ማን እንደሚመዘገብ ይግለጹ",
		templatesAiCardPlaceholder: "ምሳሌ: በሃዋሳ የማታ ኮርስ የሚመዘገቡ ወጣት መካኒኮች",
		templatesAiCardBtn: "ረቂቅ ቅጽ አዘጋጅ",
		templatesAiDisabledOffline: "በAI ቅጽ ለማዘጋጀት ከኢንተርኔት ጋር ይገናኙ።",
		templatesCardFacts: "{count} ጥያቄዎች · {langs} · {routes} የመታወቂያ መንገዶች",
		builderModeToggleLabel: "የቅድመ-ዕይታ ሁኔታ",
		builderMoveUpBtn: "ወደ ላይ ውሰድ",
		builderMoveDownBtn: "ወደ ታች ውሰድ",
		builderSectionQuestion: "ጥያቄ",
		builderSectionAnswer: "መልስ",
		builderSectionRules: "ደንቦች",
		builderSectionVoiceAudio: "ድምፅ እና ኦዲዮ",
		builderSectionChecks: "ፍተሻዎች",
		builderUseThisBtn: "ይህን ተጠቀም",
		builderDismissBtn: "ዝጋ",
		builderSuggestSimpleBtn: "ቀላል አጻጻፍ ጠቁም",
		builderTranslateAmBtn: "ወደ አማርኛ ተርጉም",
		playgroundThemeLabel: "ገጽታ",
		playgroundThemeLight: "ብሩህ",
		playgroundThemeHc: "ከፍተኛ ንጽጽር",
		playgroundEventsTitle: "የክስተቶች መዝገብ",
		playgroundEventColName: "ክስተት",
		playgroundEventColTime: "ሰዓት",
		playgroundEventColPayload: "ውሂብ",
		playgroundViewJsonBtn: "JSON ይመልከቱ",
		playgroundLevelScript: "ስክሪፕት ታግ",
		playgroundLevelApi: "REST API",
		playgroundLevelJobPosting: "ደረጃዎች (schema.org JobPosting)",
		docsPrevPage: "ቀዳሚ",
		docsNextPage: "ቀጣይ",
		docsTryInPlayground: "ይሞክሩት",
		docsEndpointReqTitle: "የጥያቄ መስኮች",
		docsEndpointResTitle: "የምላሽ መስኮች",
		jobsPrivateFilterHint: "ይህ ማጣሪያ በስልክዎ ላይ ይቆያል። አሰሪዎች አያዩትም።",
		jobsAboutHeading: "ስለ ስራው",
		jobsNeedHeading: "የሚያስፈልጉ ነገሮች",
		jobsSupportHeading: "አሰሪው የሚሰጠው ድጋፍ",
		jobsHowToApplyHeading: "እንዴት ማመልከት እንደሚቻል",
		jobsApplyTypeBtn: "በመጻፍ አመልክት",
		outboxPendingCount: "{count} መልሶች ለመላክ በመጠባበቅ ላይ",
		jobsAccomScreenReader: "ለስክሪን አንባቢ ተስማሚ ማመልከቻ",
		jobsAccomExtraTime: "ለተግባራት ተጨማሪ ጊዜ",
		jobsAccomStepFree: "ደረጃ የሌለው መግቢያ",
		jobsAccomSignLanguage: "የምልክት ቋንቋ አስተርጓሚ",
		jobsAccomLargePrint: "ትልቅ ጽሑፍ ሰነዶች",
		jobsAccomQuietRoom: "ጸጥ ያለ የስራ ቦታ",
		jobsAccomFlexibleHours: "ተለዋዋጭ የስራ ሰዓት",
		jobsAccomRemote: "ከርቀት የመስራት አማራጭ",
		employerAccomTitle: "የአሰሪ ድጋፎች",
		employerAccomSubtitle: "ለስራ ፈላጊዎች ምን ዓይነት የስራ ቦታ ድጋፍ እንደሚሰጡ በአንድ ጊዜ አንድ ጥያቄ ይንገሩ።",
		employerAccomPreviewTitle: "በስራ ዝርዝር ላይ ምልክቶች እንዴት እንደሚታዩ",
		employerAccomForDevs: "ለገንቢዎች (schema.org JobPosting JSON)",
		partnerRegisterLearnerBtn: "ተማሪ መዝግብ",
		partnerStatusWaitingConsent: "የተማሪ ስምምነት በመጠባበቅ ላይ",
		partnerStatusComplete: "ተጠናቋል",
		partnerStatusNeedsDoc: "ሰነድ ያስፈልጋል",
		partnerColLearner: "ተማሪ",
		partnerColTemplate: "ቅጽ",
		partnerColStatus: "ሁኔታ",
		partnerColUpdated: "መጨረሻ የተሻሻለው",
		partnerColAction: "ተግባር",
		partnerOpenBtn: "ክፈት",
		partnerEmptyTitle: "ገና የተመዘገበ ተማሪ የለም",
		partnerEmptyDesc: "እዚህ እንዲታይ ከተማሪ ጎን ሆነው ምዝገባ ይጀምሩ።",
		profileModeLabel: "የመመለሻ መንገድ",
		profileLastSavedLabel: "መጨረሻ የተቀመጠው",
		profileSecAbout: "ስለ እኔ",
		profileSecContact: "መገኛ",
		profileSecIdentity: "ማንነት",
		profileSecEduSkills: "ትምህርት እና ክህሎት",
		profileSecSupport: "የምፈልገው ድጋፍ",
		profileSecConnected: "የተገናኙ መድረኮች",
		profilePrivateToYou: "ለእርስዎ ብቻ ሚስጥራዊ",
		profileStopSharingBtn: "ማጋራት አቁም",
		profileNoConnectedPlatforms: "ገና የተገናኘ መድረክ የለም።",
		profileDownloadDataBtn: "ውሂቤን አውርድ",
		profileDeleteConfirmTitle: "የተቀመጠውን መገለጫዎን ይሰርዙ?",
		profileDeleteConfirmBody: "ይህ ስምዎን፣ ስልክ ቁጥርዎን፣ መልሶችዎን እና የክፍለ-ጊዜ ቅንብሮችዎን ከዚህ አሳሽ ያስወግዳል። የተገናኙ መድረኮች ቀደም ብለው የላኩትን ብቻ ያስቀምጣሉ።",
		profileDeleteConfirmAction: "መገለጫዬን ሰርዝ",
		sys404Title: "ገጹ አልተገኘም",
		sys404Desc: "የጠየቁት ገጽ በዚህ አድራሻ ላይ የለም።",
		sys404Btn: "ወደ መነሻ ገጽ ሂድ",
		sysOfflineTitle: "ከመስመር ውጭ ነዎት",
		sysOfflineDesc: "አዲስ ገጾችን ለመጫን ከኢንተርኔት ጋር ይገናኙ ወይም የተቀመጠ መገለጫዎን ይክፈቱ።",
		sysOfflineBtn: "መገለጫዬን ክፈት",
		sysErrorTitle: "በዚህ ገጽ ላይ ስህተት ተፈጥሯል",
		sysErrorDesc: "መዝገብን መጠቀም ለመቀጠል ገጹን እንደገና ይጫኑ።",
		sysErrorBtn: "ገጹን እንደገና ጫን",
		builderTopBackTemplates: "ቅጾች",
		builderRenameTemplateAria: "የቅጹን ስም ቀይር",
		builderSaveSaved: "ተቀምጧል",
		builderSaveSaving: "በማስቀመጥ ላይ…",
		builderSaveRetry: "አልተቀመጠም: እንደገና ሞክር",
		builderSaveBlockedContrast: "አልተቀመጠም: የቀለም ንጽጽር አስተካክል",
		builderViewSwitchAria: "የገንቢ እይታዎች",
		builderViewQuestions: "ጥያቄዎች",
		builderViewSettings: "ቅንብሮች",
		builderViewTranslations: "ትርጉሞች",
		builderViewShare: "አጋራ",
		builderChecksOk: "ፍተሻዎች",
		builderChecksCount: "ፍተሻዎች {count}",
		builderTestAsLearner: "እንደ ተማሪ ሞክር",
		builderMoreActionsAria: "ተጨማሪ የቅጽ እርምጃዎች",
		builderMenuShortcuts: "የኪቦርድ አቋራጮች",
		builderMenuDuplicate: "ቅጹን ቅዳ",
		builderMenuImportJson: "JSON አስገባ",
		builderMenuDelete: "ቅጹን ሰርዝ",
		builderDeleteConfirmTitle: "ይህን ቅጽ መሰረዝ ይፈልጋሉ?",
		builderDeleteConfirmBody: "ይህ የአካባቢ ረቂቅዎን እና የግል ቅጂዎን ያስወግዳል። ዋናዎቹ ቅጾች በማሳያው ውስጥ ይቆያሉ።",
		builderDeleteConfirmBtn: "ቅጹን ሰርዝ",
		builderDuplicatedAnnounce: "ቅጹ ተቀድቷል",
		builderEditingInLabel: "በማረም ላይ ያለው ቋንቋ፦",
		builderEnglishReference: "እንግሊዝኛ፦ {text}",
		builderQuestionsDrawerBtn: "ጥያቄዎች ({count})",
		builderTabList: "ዝርዝር",
		builderTabCanvas: "አርም",
		builderTabPanel: "ቅንብር",
		builderStatusNeedsFix: "ማስተካከያ ይፈልጋል",
		builderStatusMissingAm: "አማርኛ ጎድሏል",
		builderStatusConditional: "አንዳንድ ጊዜ ብቻ ይታያል",
		builderOptionalLabel: "አማራጭ",
		builderDragHandleAria: "{label}ን ደርድር",
		builderRowMenuAria: "ለ{label} እርምጃዎች",
		builderMoveUp: "ወደ ላይ ውሰድ",
		builderMoveDown: "ወደ ታች ውሰድ",
		builderMoveToSectionMenu: "ወደ ክፍል ውሰድ",
		builderSectionMenuAria: "ለክፍል {name} እርምጃዎች",
		builderQuestionAddedAnnounce: "ጥያቄ ታክሏል",
		builderDeletedShortToast: "ጥያቄው ተሰርዟል",
		builderCanvasOf: "ጥያቄ {current} ከ {total}",
		builderCanvasSimpleWords: "ቀላል ቃላት",
		builderCanvasOffline: "ከመስመር ውጭ",
		builderCanvasEditLabelAria: "የጥያቄ ጽሑፍ ({lang})",
		builderCanvasEditHintAria: "ፍንጭ ({lang})",
		builderCanvasAddHint: "ፍንጭ ያክሉ (አማራጭ)",
		builderCanvasCharsWarn: "{count} ፊደላት። አጭር ጥያቄዎች ለመስማት እና ለማንበብ ቀላል ናቸው።",
		builderCanvasDisabledFooter: "ሙሉውን ሂደት ለመሞከር 'እንደ ተማሪ ሞክር' ይጠቀሙ",
		builderCanvasOptionAria: "አማራጭ {num} ({lang})",
		builderCanvasAddOption: "አማራጭ ጨምር",
		builderCanvasMoreOptionsAria: "ተጨማሪ የአማራጭ እርምጃዎች",
		builderCanvasPasteOptions: "አማራጮችን ለጥፍ",
		builderCanvasAddOther: "'ሌላ' ጨምር",
		builderCanvasAddPreferNot: "'መናገር አልፈልግም' ጨምር",
		builderCanvasSuggestionLabel: "ጥቆማ",
		builderCanvasUseThis: "ይህን ተጠቀም",
		builderCanvasDismiss: "ተው",
		builderSuggestionAppliedAnnounce: "ጥቆማው ተተግብሯል",
		builderImproveBtn: "አሻሽል",
		builderImproveSimpler: "ቀላል ቃላትን ተጠቀም",
		builderImproveToAm: "ወደ አማርኛ ተርጉም",
		builderImproveToEn: "ወደ እንግሊዝኛ ተርጉም",
		builderImproveCheck: "ይህን ጥያቄ ፈትሽ",
		builderImproveAiOffNotice: "AI ጠፍቷል። አሁንም ሁሉንም ነገር በእጅ ማረም ይችላሉ።",
		builderImproveTranslateFromEn: "ከእንግሊዝኛ ተርጉም",
		builderPanelThingsToFix: "{count} መስተካከል ያለበት",
		builderPanelThingsToFixPlural: "{count} መስተካከል ያለባቸው",
		builderPanelSeeIt: "ይመልከቱት",
		builderPanelRequired: "ግዴታ",
		builderPanelShowSkip: "የመዝለያ አዝራር አሳይ",
		builderPanelVoiceAnswers: "የድምፅ መልሶች",
		builderPanelAddCondition: "ቅድመ-ሁኔታ ጨምር",
		builderPanelOnlyIfSummary: "{question} {answer} ሲሆን ብቻ",
		builderPanelChange: "ቀይር",
		builderPanelRemove: "አስወግድ",
		builderPanelSensitive: "ሚስጥራዊ መልስ",
		builderPanelSensitiveNote: "በፍጹም ወደ AI አይላክም። ከአጋሮች የተደበቀ ነው።",
		builderPanelSensitiveLocked: "ለዚህ የጥያቄ አይነት ሁልጊዜ የበራ ነው።",
		builderPanelMoreOptions: "ተጨማሪ አማራጮች",
		builderPanelMoreOptionsSet: "ተጨማሪ አማራጮች · {count} ተሞልተዋል",
		builderPanelAnswerRule: "የመልስ ህግ",
		builderPanelErrorMsg: "የስህተት መልዕክት",
		builderPanelAudioUrl: "የድምፅ ንባብ URL",
		builderPanelPlayBtn: "አጫውት",
		builderPanelSavesToField: "የሚቀመጥበት መስክ",
		builderTypeChangeTitle: "የጥያቄውን አይነት መቀየር ይፈልጋሉ?",
		builderTypeChangeConfirmBody: "ወደ {type} መቀየር {count} የመልስ አማራጮችን ያስወግዳል። አይነቱን ይቀይሩ?",
		builderTypeChangeBtn: "አይነቱን ቀይር",
		builderStartHeading: "ቅጽ ይፍጠሩ",
		builderStartLead: "በአንድ ስክሪን አንድ ጥያቄ ያለው የሁለት ቋንቋ የምዝገባ ቅጽ ይገንቡ።",
		builderStartChooseTplBtn: "ከቅጽ ይጀምሩ",
		builderStartChooseTplShort: "ከአራቱ ዝግጁ ቅጾች አንዱን ለፕሮግራምዎ ያስተካክሉ።",
		builderStartUseTplBtn: "ይህን ቅጽ ተጠቀም",
		builderStartDescribeShort: "መሰብሰብ የሚፈልጉትን ይጻፉና AI ጥያቄዎቹን እንዲያዘጋጅ ያድርጉ።",
		builderStartDescribeBtn: "ይግለጹት",
		builderStartDescribePrompt: "ማን ነው የሚመዘገበው? ስለ እነሱ ምን ማወቅ ይፈልጋሉ?",
		builderStartDraftBtn: "ቅጽ አዘጋጅ",
		builderStartDraftNote: "AI ይጠቀማል። ረቂቁ እንዲገመግሙት በገንቢው ውስጥ ይከፈታል።",
		builderStartNeedsAi: "AI ይፈልጋል። ከሌሎቹ ሁለት አማራጮች አንዱን ይጠቀሙ።",
		builderStartPasteShort: "ካለው ቅጽ የመስክ ስሞችን ለጥፈው ከመስመር ውጭ ይቀይሩ።",
		builderStartPasteBtn: "አሁን ያለዎትን ቅጽ ይለጥፉ",
		builderStartTurnQuestions: "ወደ ጥያቄዎች ቀይር",
		builderStartResumeDraft: "የተቀመጠውን ረቂቅ ቀጥል",
		builderTransShowLabel: "አሳይ፦",
		builderTransFilterMissing: "የጎደሉትን ብቻ",
		builderTransFilterAll: "ሁሉንም",
		builderTransSearchLabel: "ትርጉሞችን ፈልግ",
		builderTransTranslateAllBtn: "የጎደሉትን ሁሉ ተርጉም",
		builderTransAcceptAllBtn: "ሁሉንም ተቀበል",
		builderTransColWhere: "ቦታ",
		builderTransColEn: "እንግሊዝኛ",
		builderTransColAm: "አማርኛ",
		builderTransMissingSr: "ጎድሏል",
		builderTransEmpty: "በዚህ ቅጽ ውስጥ ያለ እያንዳንዱ ጽሑፍ እንግሊዝኛም አማርኛም አለው።",
		builderTransTemplateName: "የቅጹ ስም",
		builderTransTemplateDesc: "መግለጫ",
		builderTransTemplateBestFor: "ተስማሚነቱ",
		builderTransConsent: "የስምምነት መግለጫ",
		builderTransSectionPrefix: "ክፍል",
		builderTransSupportPrefix: "ድጋፍ",
		builderTransHintSuffix: "ፍንጭ",
		builderTransErrorSuffix: "የስህተት መልዕክት",
		builderTransOptionSuffix: "አማራጭ {num}",
		builderSetAboutHeading: "ስለዚህ ቅጽ",
		builderSetIdHeading: "ማንነትን የማረጋገጫ መንገዶች",
		builderSetIdFaydaWarn: "የፋይዳ መታወቂያ የሌላቸው ሰዎች መጨረስ አይችሉም።",
		builderSetSupportHeading: "የድጋፍ አማራጮች",
		builderSetFeaturesHeading: "ባህሪያት",
		builderSetConsentHeading: "የስምምነት መግለጫ",
		builderSetLookHeading: "መልክ",
		builderSetContrastPassShort: "ያልፋል ({ratio}:1)",
		builderSetContrastFailShort: "በጣም የቀላ ({ratio}:1)። ጠቆር ያለ ቀለም ይምረጡ።",
		builderChecksTitle: "ፍተሻዎች",
		builderChecksMustHeading: "መስተካከል ያለባቸው",
		builderChecksShouldHeading: "ቢስተካከሉ የሚሻሉ",
		builderChecksTipsHeading: "ምክሮች",
		builderChecksFromAi: "ከAI",
		builderChecksAllPass: "ሁሉም አልፏል። ይህ ቅጽ ለማጋራት ዝግጁ ነው።",
		builderChecksGoShare: "ወደ አጋራ ሂድ",
		builderChecksShowAll: "ሁሉንም ችግሮች አሳይ",
		builderChecksRemainingAnnounce: "{count} ችግሮች ቀርተዋል",
		builderShareMustFixWarn: "ከማጋራትዎ በፊት {count} ነገሮች መስተካከል አለባቸው።",
		builderShareMustFixOne: "ከማጋራትዎ በፊት 1 ነገር መስተካከል አለበት።",
		builderShareSeeChecks: "ፍተሻዎችን ይመልከቱ።",
		builderShareAddSiteHeading: "ወደ ድረ-ገጽዎ ያክሉ",
		builderShareTryItHeading: "ይሞክሩት",
		builderShareSaveHeading: "አስቀምጥ",
		builderShareDownloadHeading: "አውርድ",
		builderTestCloseBtn: "ሙከራውን ዝጋ",
		builderTestNoSaveNote: "በሙከራ ጊዜ የሚሰጡ መልሶች በፍጹም አይቀመጡም።",
		builderAddQSearchLabel: "ጥያቄዎችን ፈልግ",
		builderAddQNoMatches: "ከፍለጋዎ ጋር የሚዛመድ ጥያቄ የለም።",
		shortcutChecksAltC: "የፍተሻ መሳቢያን ክፈት"
	}
}, dt = (0, x.createContext)({
	lang: "en",
	setLang: () => {},
	t: (e) => lt[e]
});
function ft({ children: e, setDocumentLang: t = !0 }) {
	let [n, r] = (0, x.useState)(() => at("mezgeb_lang").value === "am" ? "am" : "en");
	return (0, x.useEffect)(() => {
		t && (document.documentElement.lang = n);
	}, [n, t]), x.createElement(dt.Provider, { value: {
		lang: n,
		setLang: (e) => {
			r(e), ot("mezgeb_lang", e);
		},
		t: (e, t) => {
			let r = ut[n][e] ?? lt[e] ?? String(e);
			if (t) for (let [e, n] of Object.entries(t)) r = r.replace(RegExp(`\\{${e}\\}`, "g"), String(n));
			return r;
		}
	} }, e);
}
function pt() {
	return (0, x.useContext)(dt);
}
// src/lib/ethiopianCalendar.ts
var mt = [
	{
		num: 1,
		en: "Meskerem",
		am: "መስከረም"
	},
	{
		num: 2,
		en: "Tikimt",
		am: "ጥቅምት"
	},
	{
		num: 3,
		en: "Hidar",
		am: "ኅዳር"
	},
	{
		num: 4,
		en: "Tahsas",
		am: "ታኅሣሥ"
	},
	{
		num: 5,
		en: "Tir",
		am: "ጥር"
	},
	{
		num: 6,
		en: "Yekatit",
		am: "የካቲት"
	},
	{
		num: 7,
		en: "Megabit",
		am: "መጋቢት"
	},
	{
		num: 8,
		en: "Miyazya",
		am: "ሚያዝያ"
	},
	{
		num: 9,
		en: "Ginbot",
		am: "ግንቦት"
	},
	{
		num: 10,
		en: "Sene",
		am: "ሰኔ"
	},
	{
		num: 11,
		en: "Hamle",
		am: "ሐምሌ"
	},
	{
		num: 12,
		en: "Nehase",
		am: "ነሐሴ"
	},
	{
		num: 13,
		en: "Pagume",
		am: "ጳጉሜን"
	}
], ht = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December"
];
function gt(e) {
	return (e % 4 + 4) % 4 == 3;
}
function _t(e, t) {
	return t >= 1 && t <= 12 ? 30 : t === 13 ? gt(e) ? 6 : 5 : 30;
}
function vt(e) {
	return e % 4 == 0 && e % 100 != 0 || e % 400 == 0;
}
function yt(e, t) {
	return t === 2 ? vt(e) ? 29 : 28 : [
		4,
		6,
		9,
		11
	].includes(t) ? 30 : 31;
}
function bt(e, t = /* @__PURE__ */ new Date()) {
	let n = t.getFullYear();
	if (e === "greg") return {
		min: n - 100,
		max: n - 14
	};
	let r = Dt({
		year: n,
		month: t.getMonth() + 1,
		day: t.getDate()
	});
	return {
		min: r.year - 100,
		max: r.year - 14
	};
}
function xt(e, t, n, r = /* @__PURE__ */ new Date()) {
	if (!Number.isInteger(e) || !Number.isInteger(t) || !Number.isInteger(n)) return !1;
	let i = bt("eth", r);
	if (e < i.min || e > i.max || t < 1 || t > 13) return !1;
	let a = _t(e, t);
	return n >= 1 && n <= a;
}
function St(e, t, n, r = /* @__PURE__ */ new Date()) {
	if (!Number.isInteger(e) || !Number.isInteger(t) || !Number.isInteger(n)) return !1;
	let i = bt("greg", r);
	if (e < i.min || e > i.max || t < 1 || t > 12) return !1;
	let a = yt(e, t);
	return n >= 1 && n <= a;
}
function Ct(e, t, n) {
	return 1724220 + 365 * (e - 1) + Math.floor(e / 4) + 30 * (t - 1) + n;
}
function k(e) {
	let t = e + 68569, n = Math.floor(4 * t / 146097), r = t - Math.floor((146097 * n + 3) / 4), i = Math.floor(4e3 * (r + 1) / 1461001), a = r - Math.floor(1461 * i / 4) + 31, o = Math.floor(80 * a / 2447), s = a - Math.floor(2447 * o / 80), c = Math.floor(o / 11), l = o + 2 - 12 * c;
	return {
		year: 100 * (n - 49) + i + c,
		month: l,
		day: s
	};
}
function wt(e, t, n) {
	let r = Math.floor((14 - t) / 12), i = e + 4800 - r, a = t + 12 * r - 3;
	return n + Math.floor((153 * a + 2) / 5) + 365 * i + Math.floor(i / 4) - Math.floor(i / 100) + Math.floor(i / 400) - 32045;
}
function Tt(e) {
	let t = e - 1724221, n = Math.floor(t / 1461), r = (t % 1461 + 1461) % 1461, i = 0, a = 0;
	return r < 365 ? (i = 0, a = r) : r < 730 ? (i = 1, a = r - 365) : r < 1096 ? (i = 2, a = r - 730) : (i = 3, a = r - 1096), {
		year: n * 4 + i + 1,
		month: Math.floor(a / 30) + 1,
		day: a % 30 + 1
	};
}
function Et(e) {
	return k(Ct(e.year, e.month, e.day));
}
function Dt(e) {
	return Tt(wt(e.year, e.month, e.day));
}
function Ot(e) {
	let t = ht[e.month - 1] ?? "";
	return `${e.day} ${t} ${e.year}`;
}
function kt(e) {
	let t = String(e.month).padStart(2, "0"), n = String(e.day).padStart(2, "0");
	return `${e.year}-${t}-${n}`;
}
function At(e, t = "en") {
	let n = mt[e.month - 1], r = t === "am" ? n?.am ?? "" : n?.en ?? "";
	return `${e.day} ${r} ${e.year}`;
}
// src/lib/outbox.ts
var A = "mezgeb_offline_db", jt = "outbox", j = /* @__PURE__ */ new Map();
function Mt() {
	return typeof indexedDB > "u" ? Promise.resolve(null) : new Promise((e) => {
		try {
			let t = indexedDB.open(A, 1);
			t.onupgradeneeded = () => {
				let e = t.result;
				e.objectStoreNames.contains(jt) || e.createObjectStore(jt, { keyPath: "id" });
			}, t.onsuccess = () => e(t.result), t.onerror = () => e(null);
		} catch {
			e(null);
		}
	});
}
async function Nt(e) {
	let t = { ...e.profile };
	e.supportShared || delete t.support_needs;
	let n = {
		...e,
		profile: t
	};
	j.set(n.id, n);
	let r = await Mt();
	r && await new Promise((e) => {
		try {
			let t = r.transaction(jt, "readwrite");
			t.objectStore(jt).put(n), t.oncomplete = () => e(), t.onerror = () => e();
		} catch {
			e();
		}
	});
}
// src/lib/partnerSync.ts
var Pt = "mezgeb_partner_sessions_v1", Ft = "mezgeb_partner_sync";
function It() {
	if (typeof BroadcastChannel > "u") return null;
	try {
		return new BroadcastChannel(Ft);
	} catch {
		return null;
	}
}
function Lt() {
	let e = at(Pt).value;
	if (!e) return [];
	try {
		let t = JSON.parse(e);
		return Array.isArray(t) ? t : [];
	} catch {
		return [];
	}
}
function Rt(e) {
	let t = [e, ...Lt().filter((t) => t.sessionId !== e.sessionId)].slice(0, 10);
	ot(Pt, JSON.stringify(t));
	let n = It();
	n && (n.postMessage({
		type: "session_update",
		snapshot: e
	}), n.close());
}
function zt(e) {
	let t = It(), n = (t) => {
		t.data && t.data.type && e(t.data);
	};
	t?.addEventListener("message", n);
	let r = (t) => {
		if (t.key === Pt) {
			let t = Lt()[0];
			t && e({
				type: "session_update",
				snapshot: t
			});
		}
	};
	return window.addEventListener("storage", r), () => {
		t?.removeEventListener("message", n), t?.close(), window.removeEventListener("storage", r);
	};
}
// src/lib/registrations.ts
async function Bt(e, t) {
	let n = await fetch(He("/v1/registrations"), {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			siteKey: e,
			profile: t
		})
	});
	if (!n.ok) throw Error(`Registration failed (HTTP ${n.status})`);
	let r = await n.json();
	if (typeof r.token != "string" || !r.token) throw Error("Registration returned no token");
	return r.token;
}
// src/lib/profileStore.ts
var Vt = "mezgeb_last_profile_v1", Ht = "mezgeb_support_session_v1", Ut = null;
function Wt(e) {
	let t = { ...e.rawAnswers };
	delete t.support_needs, delete t.support_share_platform, delete t.support_share_employers, delete t.support_share_partner;
	let n = { ...e.profile };
	e.sharing.platform || delete n.support_needs, ot(Vt, JSON.stringify({
		profile: n,
		rawAnswers: t
	})), Ut = {
		supportNeedsInSession: [...e.supportNeeds],
		sharing: { ...e.sharing }
	}, ct(Ht, JSON.stringify(Ut));
}
// src/lib/validation.ts
function Gt(e) {
	if (typeof e != "string") return !1;
	let t = e.trim();
	if (/[a-zA-Z]/.test(t)) return !1;
	let n = t.replace(/[\s\-()]/g, "");
	return /^0[97]\d{8}$/.test(n);
}
function Kt(e) {
	return String(e ?? "").replace(/\D/g, "").slice(0, 10);
}
function qt(e) {
	return {
		stepNumber: e.stepNumber,
		questionId: e.currentQuestion?.id ?? "review",
		questionLabel: e.currentQuestion ? e.currentQuestion.label[e.lang] : e.reviewTitle,
		fieldTypes: e.currentQuestion ? [e.currentQuestion.type] : ["review", "checkbox"],
		errors: e.errors.map((e) => ({
			fieldId: e.fieldId,
			code: e.code,
			message: e.message
		})),
		buttonNames: [...e.buttonNames]
	};
}
function Jt(e, t, n) {
	if (!e.showIf || !e.showIf.questionId) return !0;
	let r = n.findIndex((t) => t.id === e.showIf?.questionId), i = n.findIndex((t) => t.id === e.id);
	if (r === -1 || i !== -1 && r >= i) return !0;
	let a = n[r];
	if (!Jt(a, t, n)) return !1;
	let o = t[e.showIf.questionId], s = e.showIf.equals;
	return Array.isArray(s) ? Array.isArray(o) ? s.some((e) => o.includes(e)) : s.includes(String(o ?? "")) : Array.isArray(o) ? o.includes(String(s)) : String(o ?? "") === String(s);
}
function Yt(e) {
	let { answers: t, template: n } = e, r = {};
	for (let e of n.questions) {
		if (!Jt(e, t, n.questions) || e.type === "info") continue;
		if (e.type === "date") {
			if ((t.dob_calendar === "greg" ? "greg" : "eth") == "eth") {
				let e = Number(t.dob_eth_day), n = Number(t.dob_eth_month), i = Number(t.dob_eth_year);
				xt(i, n, e) && (r.date_of_birth = kt(Et({
					year: i,
					month: n,
					day: e
				})), r.date_of_birth_ethiopian = {
					year: i,
					month: n,
					day: e
				});
			} else {
				let e = Number(t.dob_greg_day), n = Number(t.dob_greg_month), i = Number(t.dob_greg_year);
				St(i, n, e) && (r.date_of_birth = kt({
					year: i,
					month: n,
					day: e
				}));
			}
			continue;
		}
		if (e.type === "id-routes") {
			let e = t.id_route;
			e && (e === "partner_refer" ? (r.id_route = "partner_pending", t.partner_org && (r.partner_org = String(t.partner_org))) : r.id_route = String(e));
			continue;
		}
		if (e.type === "support") continue;
		if (e.type === "work-story") {
			Array.isArray(t.skills) && t.skills.length > 0 && (r.skills = t.skills), typeof t.work_story == "string" && t.work_story.trim() && (r.work_story = t.work_story.trim());
			continue;
		}
		if (e.type === "phone") {
			let n = Kt(t[e.id]);
			n && (r[e.maps_to || "phone"] = n);
			continue;
		}
		if (e.type === "consent") {
			t[e.id] !== void 0 && (r[e.maps_to || e.id] = !!t[e.id]);
			continue;
		}
		let i = t[e.id];
		if (i != null && (typeof i != "string" || i.trim() !== "") && !(Array.isArray(i) && i.length === 0)) {
			if (e.type === "number") {
				let t = Number(i);
				r[e.maps_to] = Number.isFinite(t) ? t : i;
			} else if ((e.type === "choice" || e.type === "yes-no") && e.options) {
				let t = e.options.find((e) => e.value === i);
				r[e.maps_to] = e.id === "language" || e.type === "yes-no" ? i : t ? t.label.en : i;
			} else r[e.maps_to] = i;
		}
	}
	let i = !!t.support_share_platform;
	return r.support_shared = i, i && Array.isArray(t.support_needs) && t.support_needs.length > 0 && (r.support_needs = t.support_needs), {
		profile: r,
		supportShared: i
	};
}
// src/templates/index.ts
var M = ut.en, N = ut.am, Xt = [
	{
		id: "about",
		title: {
			en: "About you",
			am: "ስለ እርስዎ"
		}
	},
	{
		id: "identity",
		title: {
			en: "Identity",
			am: "ማንነት"
		}
	},
	{
		id: "support",
		title: {
			en: "Support",
			am: "ድጋፍ"
		}
	},
	{
		id: "work",
		title: {
			en: "Work and learning",
			am: "ስራ እና ትምህርት"
		}
	},
	{
		id: "review",
		title: {
			en: "Review",
			am: "ክለሳ"
		}
	}
], P = {
	voice: !0,
	readAloud: !0,
	smartHelp: !0,
	partnerReferral: !0,
	smsResume: !1,
	offline: !0,
	sayItSimply: !0
}, Zt = [
	{
		value: "addis_ketema",
		label: {
			am: N.optAreaAddisKetema,
			en: M.optAreaAddisKetema
		}
	},
	{
		value: "akaky_kaliti",
		label: {
			am: N.optAreaAkaky,
			en: M.optAreaAkaky
		}
	},
	{
		value: "arada",
		label: {
			am: N.optAreaArada,
			en: M.optAreaArada
		}
	},
	{
		value: "bole",
		label: {
			am: N.optAreaBole,
			en: M.optAreaBole
		}
	},
	{
		value: "gullele",
		label: {
			am: N.optAreaGullele,
			en: M.optAreaGullele
		}
	},
	{
		value: "kirkos",
		label: {
			am: N.optAreaKirkos,
			en: M.optAreaKirkos
		}
	},
	{
		value: "kolfe_keranio",
		label: {
			am: N.optAreaKolfe,
			en: M.optAreaKolfe
		}
	},
	{
		value: "lemi_kura",
		label: {
			am: N.optAreaLemiKura,
			en: M.optAreaLemiKura
		}
	},
	{
		value: "lideta",
		label: {
			am: N.optAreaLideta,
			en: M.optAreaLideta
		}
	},
	{
		value: "nifas_silk_lafto",
		label: {
			am: N.optAreaNifasSilk,
			en: M.optAreaNifasSilk
		}
	},
	{
		value: "yeka",
		label: {
			am: N.optAreaYeka,
			en: M.optAreaYeka
		}
	},
	{
		value: "other",
		label: {
			am: N.optAreaOther,
			en: M.optAreaOther
		}
	}
], Qt = [
	{
		value: "screen_reader",
		label: {
			am: N.optSupportScreenReader,
			en: M.optSupportScreenReader
		}
	},
	{
		value: "extra_time",
		label: {
			am: N.optSupportExtraTime,
			en: M.optSupportExtraTime
		}
	},
	{
		value: "step_free",
		label: {
			am: N.optSupportStepFree,
			en: M.optSupportStepFree
		}
	},
	{
		value: "sign_language",
		label: {
			am: N.optSupportSignLang,
			en: M.optSupportSignLang
		}
	},
	{
		value: "large_print",
		label: {
			am: N.optSupportLargePrint,
			en: M.optSupportLargePrint
		}
	},
	{
		value: "quiet_room",
		label: {
			am: N.optSupportQuietRoom,
			en: M.optSupportQuietRoom
		}
	}
], $t = [
	...Qt,
	{
		value: "flexible_hours",
		label: {
			am: N.optSupportFlexibleHours,
			en: M.optSupportFlexibleHours
		}
	},
	{
		value: "remote_option",
		label: {
			am: N.optSupportRemote,
			en: M.optSupportRemote
		}
	}
], F = {
	language: {
		id: "language",
		type: "choice",
		section: "about",
		label: {
			am: N.qLangLabel,
			en: M.qLangLabel
		},
		hint: {
			am: N.qLangHint,
			en: M.qLangHint
		},
		icon: "globe",
		required: !0,
		allowVoice: !0,
		options: [{
			value: "am",
			label: {
				am: N.optLangAm,
				en: M.optLangAm
			}
		}, {
			value: "en",
			label: {
				am: N.optLangEn,
				en: M.optLangEn
			}
		}],
		maps_to: "preferred_language"
	},
	fullName: {
		id: "full_name",
		type: "text",
		section: "about",
		label: {
			am: N.qFullNameLabel,
			en: M.qFullNameLabel
		},
		hint: {
			am: N.qFullNameHint,
			en: M.qFullNameHint
		},
		icon: "user",
		required: !0,
		allowVoice: !0,
		maps_to: "name"
	},
	area: {
		id: "area",
		type: "choice",
		section: "about",
		label: {
			am: N.qAreaLabel,
			en: M.qAreaLabel
		},
		hint: {
			am: N.qAreaHint,
			en: M.qAreaHint
		},
		icon: "map-pin",
		required: !0,
		allowVoice: !0,
		options: Zt,
		maps_to: "area"
	},
	phone: {
		id: "phone",
		type: "phone",
		section: "about",
		label: {
			am: N.qPhoneLabel,
			en: M.qPhoneLabel
		},
		hint: {
			am: N.qPhoneHint,
			en: M.qPhoneHint
		},
		placeholder: {
			en: "091 234 5678",
			am: "091 234 5678"
		},
		validation: { preset: "ethiopian-phone" },
		icon: "phone",
		required: !0,
		allowVoice: !0,
		maps_to: "phone"
	},
	dob: {
		id: "dob",
		type: "date",
		section: "about",
		label: {
			am: N.qDobLabel,
			en: M.qDobLabel
		},
		hint: {
			am: N.qDobHint,
			en: M.qDobHint
		},
		icon: "calendar",
		required: !0,
		maps_to: "date_of_birth"
	},
	idRoutes: {
		id: "id_route",
		type: "id-routes",
		section: "identity",
		label: {
			am: N.qIdRouteLabel,
			en: M.qIdRouteLabel
		},
		hint: {
			am: N.qIdRouteHint,
			en: M.qIdRouteHint
		},
		icon: "shield-check",
		required: !0,
		maps_to: "id_route"
	},
	support: {
		id: "support_needs",
		type: "support",
		section: "support",
		label: {
			am: N.qSupportLabel,
			en: M.qSupportLabel
		},
		hint: {
			am: N.qSupportHint,
			en: M.qSupportHint
		},
		icon: "heart-handshake",
		required: !1,
		sensitive: !0,
		allowVoice: !0,
		options: Qt,
		maps_to: "support_needs"
	},
	workStory: {
		id: "work_story",
		type: "work-story",
		section: "work",
		label: {
			am: N.qWorkStoryLabel,
			en: M.qWorkStoryLabel
		},
		hint: {
			am: N.qWorkStoryHint,
			en: M.qWorkStoryHint
		},
		icon: "briefcase",
		required: !1,
		allowVoice: !0,
		maps_to: "skills"
	}
}, en = {
	id: "learning-platform",
	category: "learning",
	tested: !1,
	name: {
		am: N.tplLearningName,
		en: M.tplLearningName
	},
	description: {
		am: N.tplLearningDesc,
		en: M.tplLearningDesc
	},
	bestFor: {
		en: "Coding bootcamps, TVET colleges, and online courses.",
		am: "የኮዲንግ ቡትካምፖች፣ የቴክኒክና ሙያ ኮሌጆች እና የመስመር ላይ ኮርሶች።"
	},
	languages: ["am", "en"],
	idRoutes: [
		"fayda",
		"refugee_id",
		"other_document",
		"partner_refer"
	],
	supportNeeds: Qt.map((e) => e.value),
	sections: Xt,
	settings: {
		...P,
		smsResume: !0
	},
	theme: {
		accent: "#6A4FC4",
		platformName: "Learnhub",
		logoLetter: "L"
	},
	questions: [
		F.language,
		F.fullName,
		F.area,
		F.phone,
		F.dob,
		F.idRoutes,
		F.support,
		F.workStory
	],
	consent: {
		am: N.qConsentLearning,
		en: M.qConsentLearning
	}
}, tn = {
	id: "job-seeker",
	category: "jobs",
	tested: !1,
	name: {
		am: N.tplJobSeekerName,
		en: M.tplJobSeekerName
	},
	description: {
		am: N.tplJobSeekerDesc,
		en: M.tplJobSeekerDesc
	},
	bestFor: {
		en: "Job boards, apprenticeship matching, and career centres.",
		am: "የስራ መድረኮች፣ የስራ ልምምድ ማገናኛዎች እና የሙያ ማዕከላት።"
	},
	languages: ["am", "en"],
	idRoutes: [
		"fayda",
		"refugee_id",
		"other_document",
		"partner_refer"
	],
	supportNeeds: Qt.map((e) => e.value),
	sections: Xt,
	settings: { ...P },
	theme: {
		accent: "#1F5C46",
		platformName: "SiraHub",
		logoLetter: "S"
	},
	questions: [
		F.language,
		F.fullName,
		F.phone,
		F.area,
		{
			id: "job_goal",
			type: "text",
			section: "work",
			label: {
				am: N.qJobGoalLabel,
				en: M.qJobGoalLabel
			},
			hint: {
				am: N.qJobGoalHint,
				en: M.qJobGoalHint
			},
			icon: "briefcase",
			required: !0,
			allowVoice: !0,
			maps_to: "job_goal"
		},
		F.workStory,
		{
			id: "interview_support",
			type: "support",
			section: "support",
			label: {
				am: N.qInterviewSupportLabel,
				en: M.qInterviewSupportLabel
			},
			hint: {
				am: N.qInterviewSupportHint,
				en: M.qInterviewSupportHint
			},
			icon: "heart-handshake",
			required: !1,
			sensitive: !0,
			allowVoice: !0,
			options: Qt,
			maps_to: "support_needs"
		}
	],
	consent: {
		am: N.qConsentJobSeeker,
		en: M.qConsentJobSeeker
	}
}, nn = {
	id: "employer-signup",
	category: "employer",
	tested: !1,
	name: {
		am: N.tplEmployerName,
		en: M.tplEmployerName
	},
	description: {
		am: N.tplEmployerDesc,
		en: M.tplEmployerDesc
	},
	bestFor: {
		en: "Companies listing inclusive jobs and workplace adjustments.",
		am: "አካታች ስራዎችን እና የስራ ቦታ ድጋፎችን የሚያወጡ ኩባንያዎች።"
	},
	languages: ["am", "en"],
	idRoutes: ["other_document"],
	supportNeeds: $t.map((e) => e.value),
	sections: Xt,
	settings: {
		...P,
		partnerReferral: !1
	},
	theme: {
		accent: "#2D4B73",
		platformName: "Employers",
		logoLetter: "E"
	},
	questions: [
		{
			id: "job_title",
			type: "text",
			section: "work",
			label: {
				am: N.qJobTitleLabel,
				en: M.qJobTitleLabel
			},
			hint: {
				am: N.qJobTitleHint,
				en: M.qJobTitleHint
			},
			icon: "briefcase",
			required: !0,
			allowVoice: !0,
			maps_to: "job_title"
		},
		{
			id: "company_name",
			type: "text",
			section: "about",
			label: {
				am: N.qCompanyNameLabel,
				en: M.qCompanyNameLabel
			},
			hint: {
				am: N.qCompanyNameHint,
				en: M.qCompanyNameHint
			},
			icon: "building",
			required: !0,
			allowVoice: !0,
			maps_to: "company_name"
		},
		{
			id: "job_location",
			type: "text",
			section: "work",
			label: {
				am: N.qJobLocationLabel,
				en: M.qJobLocationLabel
			},
			hint: {
				am: N.qJobLocationHint,
				en: M.qJobLocationHint
			},
			icon: "map-pin",
			required: !0,
			allowVoice: !0,
			maps_to: "job_location"
		},
		{
			id: "contact_role",
			type: "text",
			section: "about",
			label: {
				am: N.qContactRoleLabel,
				en: M.qContactRoleLabel
			},
			hint: {
				am: N.qContactRoleHint,
				en: M.qContactRoleHint
			},
			icon: "user",
			required: !1,
			allowVoice: !0,
			maps_to: "contact_person"
		},
		{
			id: "employer_accommodations",
			type: "multichoice",
			section: "support",
			label: {
				am: N.qEmployerAccomLabel,
				en: M.qEmployerAccomLabel
			},
			hint: {
				am: N.qEmployerAccomHint,
				en: M.qEmployerAccomHint
			},
			icon: "heart-handshake",
			required: !1,
			allowVoice: !0,
			options: $t,
			maps_to: "offered_accommodations"
		}
	],
	consent: {
		am: N.qConsentEmployer,
		en: M.qConsentEmployer
	}
}, rn = {
	id: "programme-intake",
	category: "ngo",
	tested: !1,
	name: {
		am: N.tplProgrammeName,
		en: M.tplProgrammeName
	},
	description: {
		am: N.tplProgrammeDesc,
		en: M.tplProgrammeDesc
	},
	bestFor: {
		en: "NGOs, community outreach teams, and refugee support desks.",
		am: "መንግስታዊ ያልሆኑ ድርጅቶች፣ የማህበረሰብ ቡድኖች እና የስደተኞች ድጋፍ ማዕከላት።"
	},
	languages: ["am", "en"],
	idRoutes: [
		"fayda",
		"refugee_id",
		"other_document",
		"partner_refer"
	],
	supportNeeds: Qt.map((e) => e.value),
	partnerDefault: !0,
	sections: Xt,
	settings: {
		...P,
		smsResume: !0
	},
	theme: {
		accent: "#7A3E18",
		platformName: "Intake",
		logoLetter: "I"
	},
	questions: [
		F.language,
		F.fullName,
		F.phone,
		F.idRoutes,
		F.support
	],
	consent: {
		am: N.qConsentProgramme,
		en: M.qConsentProgramme
	}
}, an = {
	id: "job-application",
	category: "jobs",
	tested: !1,
	name: {
		am: N.tplJobAppName,
		en: M.tplJobAppName
	},
	description: {
		am: N.tplJobAppDesc,
		en: M.tplJobAppDesc
	},
	bestFor: {
		en: "Quick voice-ready job applications.",
		am: "በድምፅ የሚሞላ ፈጣን የስራ ማመልከቻ።"
	},
	languages: ["am", "en"],
	idRoutes: [
		"fayda",
		"refugee_id",
		"other_document",
		"partner_refer"
	],
	supportNeeds: Qt.map((e) => e.value),
	sections: Xt,
	settings: { ...P },
	theme: {
		accent: "#1F5C46",
		platformName: "Jobs",
		logoLetter: "J"
	},
	questions: [
		{
			id: "why_want_job",
			type: "text",
			section: "work",
			label: {
				am: N.qWhyWantJobLabel,
				en: M.qWhyWantJobLabel
			},
			hint: {
				am: N.qWhyWantJobHint,
				en: M.qWhyWantJobHint
			},
			icon: "briefcase",
			required: !0,
			allowVoice: !0,
			maps_to: "motivation"
		},
		{
			id: "when_start",
			type: "choice",
			section: "work",
			label: {
				am: N.qStartWhenLabel,
				en: M.qStartWhenLabel
			},
			hint: {
				am: N.qStartWhenHint,
				en: M.qStartWhenHint
			},
			icon: "calendar",
			required: !0,
			allowVoice: !0,
			options: [
				{
					value: "immediate",
					label: {
						am: N.optStartImmediate,
						en: M.optStartImmediate
					}
				},
				{
					value: "two_weeks",
					label: {
						am: N.optStartTwoWeeks,
						en: M.optStartTwoWeeks
					}
				},
				{
					value: "one_month",
					label: {
						am: N.optStartOneMonth,
						en: M.optStartOneMonth
					}
				}
			],
			maps_to: "availability"
		},
		{
			id: "interview_support",
			type: "support",
			section: "support",
			label: {
				am: N.qInterviewSupportLabel,
				en: M.qInterviewSupportLabel
			},
			hint: {
				am: N.qInterviewSupportHint,
				en: M.qInterviewSupportHint
			},
			icon: "heart-handshake",
			required: !1,
			sensitive: !0,
			allowVoice: !0,
			options: Qt,
			maps_to: "interview_support"
		}
	],
	consent: {
		am: N.qConsentJobApp,
		en: M.qConsentJobApp
	}
};
function on(e) {
	return {
		...P,
		...e.settings ?? {}
	};
}
// node_modules/react/cjs/react-jsx-runtime.production.js
var sn = /* @__PURE__ */ o(((e) => {
	var t = Symbol.for("react.transitional.element"), n = Symbol.for("react.fragment");
	function r(e, n, r) {
		var i = null;
		if (r !== void 0 && (i = "" + r), n.key !== void 0 && (i = "" + n.key), "key" in n) for (var a in r = {}, n) a !== "key" && (r[a] = n[a]);
		else r = n;
		return n = r.ref, {
			$$typeof: t,
			type: e,
			key: i,
			ref: n === void 0 ? null : n,
			props: r
		};
	}
	e.Fragment = n, e.jsx = r, e.jsxs = r;
})), I = (/* @__PURE__ */ o(((e, t) => {
	t.exports = sn();
})))(), cn = {
	neutral: "bg-[var(--stone)] text-[var(--ink)] border-[var(--line)]",
	success: "bg-[var(--mint)] text-[var(--mint-ink)] border-[var(--line)]",
	warning: "bg-[var(--warn-bg)] text-[var(--warn)] border-[var(--line)]",
	error: "bg-[var(--error-bg)] text-[var(--error)] border-[var(--error)]",
	accent: "bg-[var(--lilac)] text-[var(--ink)] border-[var(--line)]"
};
function ln({ children: e, icon: t, variant: n = "neutral", className: r = "" }) {
	return /* @__PURE__ */ (0, I.jsxs)("span", {
		className: `inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] border text-[0.8125rem] font-medium leading-none whitespace-nowrap ${cn[n]} ${r}`,
		children: [/* @__PURE__ */ (0, I.jsx)("span", { children: e }), t && /* @__PURE__ */ (0, I.jsx)("span", {
			className: "shrink-0",
			"aria-hidden": "true",
			children: t
		})]
	});
}
// src/ui/Banner.tsx
var un = {
	info: {
		container: "bg-[var(--sand)] border-[var(--line)] text-[var(--ink)]",
		icon: /* @__PURE__ */ (0, I.jsx)(he, {
			size: 20,
			strokeWidth: 1.75,
			className: "text-[var(--ink)] shrink-0",
			"aria-hidden": "true"
		})
	},
	success: {
		container: "bg-[var(--mint)] border-[var(--line)] text-[var(--mint-ink)]",
		icon: /* @__PURE__ */ (0, I.jsx)(w, {
			size: 20,
			strokeWidth: 1.75,
			className: "text-[var(--mint-ink)] shrink-0",
			"aria-hidden": "true"
		})
	},
	warning: {
		container: "bg-[var(--warn-bg)] border-[var(--line)] text-[var(--warn)]",
		icon: /* @__PURE__ */ (0, I.jsx)(Oe, {
			size: 20,
			strokeWidth: 1.75,
			className: "text-[var(--warn)] shrink-0",
			"aria-hidden": "true"
		})
	},
	error: {
		container: "bg-[var(--error-bg)] border-[var(--error)] text-[var(--error)]",
		icon: /* @__PURE__ */ (0, I.jsx)(ce, {
			size: 20,
			strokeWidth: 1.75,
			className: "text-[var(--error)] shrink-0",
			"aria-hidden": "true"
		})
	}
};
function dn({ variant: e, children: t, action: n, role: r, className: i = "" }) {
	let a = un[e];
	return /* @__PURE__ */ (0, I.jsxs)("div", {
		role: r ?? (e === "error" ? "alert" : "status"),
		className: `p-3.5 rounded-[10px] border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm font-medium ${a.container} ${i}`,
		children: [/* @__PURE__ */ (0, I.jsxs)("div", {
			className: "flex items-start gap-2.5",
			children: [/* @__PURE__ */ (0, I.jsx)("span", {
				className: "mt-0.5 shrink-0",
				children: a.icon
			}), /* @__PURE__ */ (0, I.jsx)("div", {
				className: "leading-snug",
				children: t
			})]
		}), n && /* @__PURE__ */ (0, I.jsx)("div", {
			className: "shrink-0",
			children: n
		})]
	});
}
// src/ui/Button.tsx
var fn = {
	primary: "bg-[var(--ink)] text-[var(--paper)] border border-[var(--ink)] rounded-[10px] hover:opacity-90",
	secondary: "bg-[var(--paper)] text-[var(--ink)] border border-[var(--ink)] rounded-[10px] hover:bg-[var(--stone)]",
	quiet: "bg-transparent text-[var(--ink)] border border-transparent rounded-[6px] hover:underline underline-offset-4 px-2",
	danger: "bg-[var(--error)] text-[var(--paper)] border border-[var(--error)] rounded-[10px] hover:opacity-90"
}, pn = {
	md: "min-h-[40px] px-4 text-[0.9375rem]",
	lg: "min-h-[48px] px-5 text-base"
}, L = x.forwardRef(function({ variant: e = "primary", size: t = "md", loading: n = !1, loadingLabel: r = "Saving…", disabledReason: i, fullWidth: a = !1, disabled: o, className: s = "", children: c, type: l = "button", ...u }, d) {
	let f = !!(o || n), p = !!(i && o && !n), m = /* @__PURE__ */ (0, I.jsxs)("button", {
		ref: d,
		type: l,
		disabled: f,
		"aria-busy": n || void 0,
		className: `mezgeb-transition inline-grid place-items-center font-medium whitespace-nowrap cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${fn[e]} ${pn[t]} ${a ? "w-full" : ""} ${s}`,
		...u,
		children: [/* @__PURE__ */ (0, I.jsx)("span", {
			className: `col-start-1 row-start-1 inline-flex items-center justify-center gap-2 ${n ? "invisible" : ""}`,
			children: c
		}), n && /* @__PURE__ */ (0, I.jsxs)("span", {
			className: "col-start-1 row-start-1 inline-flex items-center justify-center gap-2",
			children: [/* @__PURE__ */ (0, I.jsx)(ge, {
				size: 18,
				strokeWidth: 1.75,
				className: "animate-spin",
				"aria-hidden": "true"
			}), /* @__PURE__ */ (0, I.jsx)("span", { children: r })]
		})]
	});
	return p ? /* @__PURE__ */ (0, I.jsxs)("div", {
		className: a ? "w-full space-y-1.5" : "inline-flex flex-col gap-1.5",
		children: [m, /* @__PURE__ */ (0, I.jsx)("p", {
			className: "text-[0.8125rem] text-[var(--muted)] leading-snug",
			children: i
		})]
	}) : m;
});
// src/ui/ChoiceList.tsx
function mn({ name: e, legend: t, options: n, mode: r, value: i, onChange: a, disabled: o = !1, hideLegend: s = !0 }) {
	let c = (e) => r === "single" ? i === e : Array.isArray(i) && i.includes(e), l = (e) => {
		if (!o) {
			if (r === "single") a(e);
			else {
				let t = Array.isArray(i) ? i : [];
				a(t.includes(e) ? t.filter((t) => t !== e) : [...t, e]);
			}
		}
	};
	return /* @__PURE__ */ (0, I.jsxs)("fieldset", {
		className: "w-full border-0 p-0 m-0",
		children: [/* @__PURE__ */ (0, I.jsx)("legend", {
			className: s ? "sr-only" : "text-base font-medium text-[var(--ink)] mb-3",
			children: t
		}), /* @__PURE__ */ (0, I.jsx)("div", {
			className: "grid grid-cols-1 gap-2.5",
			children: n.map((t) => {
				let n = c(t.value);
				return /* @__PURE__ */ (0, I.jsxs)("label", {
					lang: t.lang,
					className: `mezgeb-transition flex items-center justify-between gap-3 min-h-[56px] px-4 py-3 rounded-[10px] cursor-pointer text-left ${n ? "border-2 border-[var(--accent)] bg-[var(--lilac)] text-[var(--ink)]" : "border border-[var(--line-strong)] bg-[var(--paper)] text-[var(--ink)] hover:bg-[var(--stone)]"} ${o ? "opacity-60 cursor-not-allowed" : ""}`,
					children: [
						/* @__PURE__ */ (0, I.jsx)("input", {
							type: r === "single" ? "radio" : "checkbox",
							name: e,
							value: t.value,
							checked: n,
							disabled: o,
							onChange: () => l(t.value),
							className: "sr-only"
						}),
						/* @__PURE__ */ (0, I.jsxs)("div", {
							className: "flex items-start gap-3 min-w-0 flex-1",
							children: [t.icon && /* @__PURE__ */ (0, I.jsx)("span", {
								className: "shrink-0 mt-0.5 text-[var(--ink)]",
								"aria-hidden": "true",
								children: t.icon
							}), /* @__PURE__ */ (0, I.jsxs)("div", {
								className: "min-w-0 space-y-0.5",
								children: [/* @__PURE__ */ (0, I.jsx)("span", {
									className: "block text-base font-medium text-[var(--ink)] leading-snug",
									children: t.title
								}), t.description && /* @__PURE__ */ (0, I.jsx)("span", {
									className: "block text-sm text-[var(--muted)] leading-snug",
									children: t.description
								})]
							})]
						}),
						/* @__PURE__ */ (0, I.jsx)("span", {
							"aria-hidden": "true",
							className: `w-6 h-6 rounded-[6px] flex items-center justify-center shrink-0 ${n ? "bg-[var(--accent)] text-[var(--paper)]" : "border border-[var(--line-strong)] bg-[var(--paper)]"}`,
							children: n && /* @__PURE__ */ (0, I.jsx)(se, {
								size: 16,
								strokeWidth: 2
							})
						})
					]
				}, t.value);
			})
		})]
	});
}
// src/components/LiveAnnouncer.tsx
var hn = (0, x.createContext)({ announce: () => {} });
function gn({ children: e }) {
	let [t, n] = (0, x.useState)(""), r = (0, x.useCallback)((e) => {
		n(""), window.setTimeout(() => {
			n(e);
		}, 30);
	}, []);
	return /* @__PURE__ */ (0, I.jsxs)(hn.Provider, {
		value: { announce: r },
		children: [e, /* @__PURE__ */ (0, I.jsx)("div", {
			className: "sr-only",
			"aria-live": "polite",
			"aria-atomic": "true",
			children: t
		})]
	});
}
function _n() {
	return (0, x.useContext)(hn);
}
// src/ui/Field.tsx
function vn({ id: e, label: t, labelLang: n, hint: r, error: i, required: a, rightSlot: o, children: s, inputProps: c, inputRef: l, as: u = "input", textareaProps: d, textareaRef: f }) {
	let p = (0, x.useId)(), m = e ?? p, h = r ? `${m}-hint` : void 0, g = i ? `${m}-err` : void 0, _ = [h, g].filter(Boolean).join(" ") || void 0, v = !!i, y = `w-full rounded-[6px] text-base text-[var(--ink)] px-3.5 mezgeb-transition focus:outline-none ${v ? "border-2 border-[var(--error)] bg-[var(--error-bg)]" : "border border-[var(--line-strong)] bg-[var(--paper)] focus:border-2 focus:border-[var(--ink)]"}`;
	return /* @__PURE__ */ (0, I.jsxs)("div", {
		className: "space-y-1.5 w-full text-left",
		children: [
			/* @__PURE__ */ (0, I.jsxs)("label", {
				htmlFor: m,
				lang: n,
				className: "block text-base font-medium text-[var(--ink)]",
				children: [t, a === !1 && /* @__PURE__ */ (0, I.jsx)("span", {
					className: "ml-2 text-sm font-normal text-[var(--muted)]",
					children: n === "am" ? "(አማራጭ)" : "(optional)"
				})]
			}),
			r && /* @__PURE__ */ (0, I.jsx)("p", {
				id: h,
				className: "text-sm text-[var(--muted)] leading-snug",
				children: r
			}),
			s || /* @__PURE__ */ (0, I.jsxs)("div", {
				className: "flex items-start gap-2",
				children: [u === "textarea" ? /* @__PURE__ */ (0, I.jsx)("textarea", {
					ref: f,
					id: m,
					"aria-invalid": v || void 0,
					"aria-describedby": _,
					className: `${y} py-3 min-h-[104px] flex-1 ${d?.className ?? ""}`,
					...d
				}) : /* @__PURE__ */ (0, I.jsx)("input", {
					ref: l,
					id: m,
					"aria-invalid": v || void 0,
					"aria-describedby": _,
					className: `${y} min-h-[48px] flex-1 ${c?.className ?? ""}`,
					...c
				}), o && /* @__PURE__ */ (0, I.jsx)("div", {
					className: "shrink-0",
					children: o
				})]
			}),
			i && /* @__PURE__ */ (0, I.jsxs)("p", {
				id: g,
				role: "alert",
				className: "flex items-start gap-1.5 text-sm font-medium text-[var(--error)] pt-0.5",
				children: [/* @__PURE__ */ (0, I.jsx)(ce, {
					size: 16,
					strokeWidth: 1.75,
					className: "shrink-0 mt-0.5",
					"aria-hidden": "true"
				}), /* @__PURE__ */ (0, I.jsx)("span", { children: i })]
			})
		]
	});
}
// src/ui/Progress.tsx
function yn({ current: e, total: t, label: n }) {
	let r = Math.max(1, t), i = Math.min(Math.max(1, e), r), a = Math.round(i / r * 100);
	return /* @__PURE__ */ (0, I.jsxs)("div", {
		className: "space-y-2 w-full",
		children: [/* @__PURE__ */ (0, I.jsx)("p", {
			className: "text-sm font-medium text-[var(--muted)]",
			children: n
		}), /* @__PURE__ */ (0, I.jsx)("div", {
			role: "progressbar",
			"aria-valuenow": i,
			"aria-valuemin": 1,
			"aria-valuemax": r,
			"aria-label": n,
			className: "w-full h-1 bg-[var(--line)] rounded-full overflow-hidden",
			children: /* @__PURE__ */ (0, I.jsx)("div", {
				className: "h-full bg-[var(--widget-accent)] mezgeb-panel-transition",
				style: { width: `${a}%` }
			})
		})]
	});
}
// src/ui/ReadAloudButton.tsx
function bn(e, t, n) {
	let [r, i] = (0, x.useState)(() => typeof window > "u" || !("speechSynthesis" in window) ? !1 : window.speechSynthesis.getVoices().some((e) => e.lang.toLowerCase().startsWith("am")));
	return (0, x.useEffect)(() => {
		if (typeof window > "u" || !("speechSynthesis" in window)) return;
		let e = () => {
			let e = window.speechSynthesis.getVoices();
			i(e.some((e) => e.lang.toLowerCase().startsWith("am")));
		};
		return e(), window.speechSynthesis.addEventListener?.("voiceschanged", e), () => {
			window.speechSynthesis.removeEventListener?.("voiceschanged", e);
		};
	}, []), t || n ? !0 : e === "am" ? r : typeof window < "u" && "speechSynthesis" in window;
}
function xn({ lang: e, audioUrl: t, speaking: n, onToggle: r, label: i = "Read aloud", stopLabel: a = "Stop reading", widgetSize: o = !1, className: s = "", serverReadAloud: c }) {
	if (!bn(e, t, c)) return null;
	let l = o ? 20 : 18;
	return /* @__PURE__ */ (0, I.jsxs)("button", {
		type: "button",
		onClick: r,
		"aria-pressed": n,
		className: `mezgeb-transition inline-flex items-center gap-2 min-h-[44px] px-3.5 rounded-[10px] border border-[var(--line-strong)] bg-[var(--paper)] text-sm font-medium text-[var(--ink)] hover:bg-[var(--stone)] cursor-pointer ${s}`,
		children: [n ? /* @__PURE__ */ (0, I.jsx)(Me, {
			size: l,
			strokeWidth: 1.75,
			"aria-hidden": "true"
		}) : /* @__PURE__ */ (0, I.jsx)(je, {
			size: l,
			strokeWidth: 1.75,
			"aria-hidden": "true"
		}), /* @__PURE__ */ (0, I.jsx)("span", { children: n ? a : i })]
	});
}
// src/ui/VoiceButton.tsx
var Sn = [
	10,
	18,
	26,
	14,
	24,
	16,
	22,
	12
];
function Cn({ state: e, onStart: t, onStop: n, onKeep: r, onRetry: i, transcript: a = "", onTranscriptChange: o, seconds: s = 0, disabled: c = !1, disabledReason: l, widgetSize: u = !1, labels: d = {} }) {
	let { speakLabel: f = "Speak your answer", listeningLabel: p = "Listening… tap to stop", processingLabel: m = "Writing what you said…", keepLabel: h = "Keep", tryAgainLabel: g = "Try again", failedMessage: _ = "We could not hear that. Try again or type your answer.", transcriptLabel: v = "Check what Mezgeb heard" } = d, y = u ? 24 : 20;
	return e === "listening" ? /* @__PURE__ */ (0, I.jsx)("div", {
		className: "space-y-1.5",
		children: /* @__PURE__ */ (0, I.jsxs)("button", {
			type: "button",
			onClick: n,
			"aria-label": p,
			className: "min-h-[48px] px-3.5 rounded-[10px] border-2 border-[var(--accent)] bg-[var(--lilac)] text-[var(--ink)] inline-flex items-center gap-3 font-medium text-sm cursor-pointer",
			children: [
				/* @__PURE__ */ (0, I.jsx)(Ee, {
					size: 16,
					strokeWidth: 1.75,
					className: "text-[var(--accent)] shrink-0",
					"aria-hidden": "true"
				}),
				/* @__PURE__ */ (0, I.jsx)("span", {
					className: "inline-flex items-center gap-[3px] h-6",
					"aria-hidden": "true",
					children: Sn.map((e, t) => /* @__PURE__ */ (0, I.jsx)("span", {
						className: "mezgeb-wave-bar w-[2px] rounded-full bg-[var(--accent-soft)]",
						style: {
							height: `${e}px`,
							animationDelay: `${t * 80}ms`
						}
					}, t))
				}),
				/* @__PURE__ */ (0, I.jsx)("span", { children: p }),
				s > 0 && /* @__PURE__ */ (0, I.jsxs)("span", {
					className: "font-mono text-xs text-[var(--muted)]",
					children: [s, "s"]
				})
			]
		})
	}) : e === "processing" ? /* @__PURE__ */ (0, I.jsxs)("div", {
		role: "status",
		className: "min-h-[48px] px-3.5 rounded-[10px] border border-[var(--line-strong)] bg-[var(--lilac)] text-[var(--ink)] inline-flex items-center gap-2.5 text-sm font-medium",
		children: [/* @__PURE__ */ (0, I.jsx)(ge, {
			size: 18,
			strokeWidth: 1.75,
			className: "animate-spin text-[var(--accent)]",
			"aria-hidden": "true"
		}), /* @__PURE__ */ (0, I.jsx)("span", { children: m })]
	}) : /* @__PURE__ */ (0, I.jsxs)("div", {
		className: "space-y-2",
		children: [
			/* @__PURE__ */ (0, I.jsxs)("div", {
				className: "inline-flex flex-col items-start gap-1",
				children: [/* @__PURE__ */ (0, I.jsx)("button", {
					type: "button",
					disabled: c,
					onClick: t,
					"aria-label": f,
					title: f,
					className: "w-[48px] h-[48px] rounded-[10px] border border-[var(--line-strong)] bg-[var(--paper)] text-[var(--ink)] hover:bg-[var(--stone)] inline-flex items-center justify-center shrink-0 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mezgeb-transition",
					children: /* @__PURE__ */ (0, I.jsx)(xe, {
						size: y,
						strokeWidth: 1.75,
						"aria-hidden": "true"
					})
				}), c && l && /* @__PURE__ */ (0, I.jsx)("p", {
					className: "text-[0.8125rem] text-[var(--muted)]",
					children: l
				})]
			}),
			e === "review" && /* @__PURE__ */ (0, I.jsxs)("div", {
				role: "region",
				"aria-label": v,
				className: "p-3.5 rounded-[10px] border-2 border-[var(--accent)] bg-[var(--lilac)] space-y-2.5 text-left",
				children: [
					/* @__PURE__ */ (0, I.jsx)("p", {
						className: "text-xs font-semibold text-[var(--ink)]",
						children: v
					}),
					o ? /* @__PURE__ */ (0, I.jsx)("input", {
						type: "text",
						value: a,
						onChange: (e) => o(e.target.value),
						"aria-label": v,
						className: "w-full min-h-[44px] px-3 rounded-[6px] border border-[var(--line-strong)] bg-[var(--paper)] text-base text-[var(--ink)]"
					}) : /* @__PURE__ */ (0, I.jsx)("p", {
						className: "px-2.5 py-1.5 rounded-[6px] bg-[var(--paper)] border border-[var(--line)] text-base font-medium text-[var(--ink)]",
						children: a
					}),
					/* @__PURE__ */ (0, I.jsxs)("div", {
						className: "flex flex-wrap items-center gap-2",
						children: [r && /* @__PURE__ */ (0, I.jsxs)("button", {
							type: "button",
							onClick: r,
							className: "min-h-[40px] px-3.5 rounded-[10px] bg-[var(--ink)] text-[var(--paper)] text-sm font-medium inline-flex items-center gap-1.5 cursor-pointer",
							children: [/* @__PURE__ */ (0, I.jsx)(se, {
								size: 16,
								strokeWidth: 1.75,
								"aria-hidden": "true"
							}), /* @__PURE__ */ (0, I.jsx)("span", { children: h })]
						}), i && /* @__PURE__ */ (0, I.jsxs)("button", {
							type: "button",
							onClick: i,
							className: "min-h-[40px] px-3.5 rounded-[10px] bg-[var(--paper)] border border-[var(--ink)] text-[var(--ink)] text-sm font-medium inline-flex items-center gap-1.5 cursor-pointer",
							children: [/* @__PURE__ */ (0, I.jsx)(we, {
								size: 15,
								strokeWidth: 1.75,
								"aria-hidden": "true"
							}), /* @__PURE__ */ (0, I.jsx)("span", { children: g })]
						})]
					})
				]
			}),
			e === "failed" && /* @__PURE__ */ (0, I.jsx)("div", {
				role: "status",
				className: "p-3 rounded-[10px] border border-[var(--warn)] bg-[var(--warn-bg)] text-sm text-[var(--warn)] font-medium",
				children: _
			})
		]
	});
}
// src/ui/QuestionIcon.tsx
function wn({ name: e, size: t = 24, className: n = "" }) {
	let r = {
		size: t,
		strokeWidth: 1.75,
		className: n,
		"aria-hidden": !0
	};
	switch (e) {
		case "globe": return /* @__PURE__ */ (0, I.jsx)(fe, { ...r });
		case "user": return /* @__PURE__ */ (0, I.jsx)(O, { ...r });
		case "map-pin": return /* @__PURE__ */ (0, I.jsx)(ye, { ...r });
		case "phone": return /* @__PURE__ */ (0, I.jsx)(Se, { ...r });
		case "calendar": return /* @__PURE__ */ (0, I.jsx)(ae, { ...r });
		case "shield-check": return /* @__PURE__ */ (0, I.jsx)(E, { ...r });
		case "heart-handshake": return /* @__PURE__ */ (0, I.jsx)(pe, { ...r });
		case "briefcase": return /* @__PURE__ */ (0, I.jsx)(C, { ...r });
		case "mail": return /* @__PURE__ */ (0, I.jsx)(ve, { ...r });
		case "book-open": return /* @__PURE__ */ (0, I.jsx)(re, { ...r });
		case "building": return /* @__PURE__ */ (0, I.jsx)(ie, { ...r });
		case "hash": return /* @__PURE__ */ (0, I.jsx)(me, { ...r });
		case "check-square": return /* @__PURE__ */ (0, I.jsx)(Te, { ...r });
		case "toggle-left": return /* @__PURE__ */ (0, I.jsx)(De, { ...r });
		case "file-text": return /* @__PURE__ */ (0, I.jsx)(T, { ...r });
		default: return /* @__PURE__ */ (0, I.jsx)(he, { ...r });
	}
}
// src/components/MezgebWidget.tsx
function Tn(e) {
	let t = e.replace(/\D/g, "").slice(0, 10);
	return t.length <= 3 ? t : t.length <= 6 ? `${t.slice(0, 3)} ${t.slice(3)}` : `${t.slice(0, 3)} ${t.slice(3, 6)} ${t.slice(6)}`;
}
function En(e) {
	return e === "phone" || e === "number";
}
function Dn(e) {
	return e.replace(/\D/g, "").split("").join(" ");
}
function On(e) {
	return new Promise((t, n) => {
		let r = new FileReader();
		r.onloadend = () => {
			let e = typeof r.result == "string" ? r.result : "", n = e.indexOf(",");
			t(n >= 0 ? e.slice(n + 1) : e);
		}, r.onerror = () => n(/* @__PURE__ */ Error("FileReader error")), r.readAsDataURL(e);
	});
}
function kn(e) {
	let t = { ...e };
	return delete t.support_needs, delete t.support_share_platform, delete t.support_share_employers, delete t.support_share_partner, t;
}
function An(e, t) {
	return {
		language: e,
		id_route: t ? "partner_refer" : void 0,
		support_share_platform: !1,
		support_share_employers: !1,
		support_share_partner: !1,
		support_needs: [],
		skills: [],
		dob_calendar: "eth"
	};
}
function jn({ template: e, aiEnabled: t, offline: n, accentColor: r, platformName: i, readOnly: a = !1, ephemeralPreview: o = !1, storageKey: s = "mezgeb_demo_state_v1", resumeIdParam: c = null, singleQuestionMode: l = !1, jumpToQuestionId: u = null, initialAnswers: d, showWelcomeFlow: f = !1, initialAnswerMode: p = "type", highContrast: m = !1, assistedMode: h = !1, assistedLearnerName: g = "Learner", outboxCount: _ = 0, demoTrigger: v = null, builderCanvas: y, onAnswersChange: b, onAiPayloadLogged: ee, onEvent: te, onComplete: ne, onOutboxUpdated: S, onReset: re, shortcutScope: C = "window", siteKey: ie = "", persistProfile: ae = !0 }) {
	let { lang: se, setLang: ce, t: w } = pt(), T = y ? y.editingLang : se, { announce: fe } = _n(), pe = (0, x.useId)(), [me, he] = (0, x.useState)(null), [ge, ve] = (0, x.useState)(""), [ye, Se] = (0, x.useState)(!1), we = (0, x.useRef)(null), E = (0, x.useRef)(null), Te = (0, x.useRef)(null), Ee = (0, x.useRef)(null), De = (0, x.useRef)(null), Oe = ze(e), O = Oe.template, je = on(O), Me = r ?? O.theme?.accent ?? "var(--accent)", Pe = i ?? O.theme?.platformName ?? "Learnhub", [Fe, Ie] = (0, x.useState)({
		voice: !0,
		smartHelp: !0,
		skillsAi: !0,
		simplifyAi: !0
	});
	(0, x.useEffect)(() => {
		let e = !0;
		return Ye().then((t) => {
			e && Ie(t);
		}), () => {
			e = !1;
		};
	}, [t, n]);
	let Le = t && !n, Re = Fe.voiceProviders ? Fe.voiceProviders[T] : Fe.voiceProvider, Be = Le && Fe.voice && je.voice && (!Fe.voiceProviders || !!Re), Ve = Re ? w("voiceProviderNotice", { provider: Ke[Re] }) : w("cloudAiNotice"), He = Le && Fe.smartHelp && je.smartHelp, Ue = Le && Fe.skillsAi, We = Le && Fe.simplifyAi && je.sayItSimply, Ge = f && !l && !u, [qe, Je] = (0, x.useState)(() => Ge && !c ? "welcome" : "questions"), [tt, nt] = (0, x.useState)(p), [it, ct] = (0, x.useState)(!0), [lt, dt] = (0, x.useState)(!1), [ft, gt] = (0, x.useState)(""), [vt, Ct] = (0, x.useState)("");
	(0, x.useEffect)(() => {
		nt(p);
	}, [p]);
	let [k, wt] = (0, x.useState)(0), [Tt, kt] = (0, x.useState)(!1), [A, jt] = (0, x.useState)(() => ({
		...An(T, O.partnerDefault),
		...d ?? {}
	})), j = O.questions.filter((e) => Jt(e, A, O.questions)), Mt = Math.max(1, l ? j.length : j.length + 1), [Pt, Ft] = (0, x.useState)(!1), [It, Lt] = (0, x.useState)(null), [Vt, Ht] = (0, x.useState)(!1), [Ut, M] = (0, x.useState)(!1), [N, Xt] = (0, x.useState)("idle"), [P, Zt] = (0, x.useState)(null), [Qt] = (0, x.useState)(() => `sess_${Math.random().toString(36).slice(2, 8)}`), [$t, F] = (0, x.useState)(!1), [en, tn] = (0, x.useState)([]), nn = (0, x.useRef)(null), rn = (0, x.useRef)(null), [an, sn] = (0, x.useState)(!1), [cn, un] = (0, x.useState)(!1), fn = (0, x.useRef)(null), pn = (0, x.useRef)(null), hn = (0, x.useRef)(/* @__PURE__ */ new Map()), gn = (0, x.useRef)(null), Sn = (e) => {
		let t = gn.current?.getRootNode();
		return (t && "getElementById" in t ? t : document).getElementById(e);
	}, [jn, R] = (0, x.useState)("idle"), [Mn, Nn] = (0, x.useState)(0), [Pn, Fn] = (0, x.useState)(null), [In, Ln] = (0, x.useState)(null), Rn = (0, x.useRef)(null), zn = (0, x.useRef)(null), Bn = (0, x.useRef)(null), Vn = (0, x.useRef)(null), [Hn, Un] = (0, x.useState)(!1), [Wn, Gn] = (0, x.useState)(""), [Kn, qn] = (0, x.useState)(!1), [Jn, Yn] = (0, x.useState)(null), [Xn, Zn] = (0, x.useState)(!1), Qn = (0, x.useRef)(null), $n = (0, x.useRef)(null), [er, tr] = (0, x.useState)(!1), [nr, rr] = (0, x.useState)(null), [ir, ar] = (0, x.useState)(!1), [or, sr] = (0, x.useState)([]), [cr, lr] = (0, x.useState)(""), [ur, dr] = (0, x.useState)(!1), [fr, pr] = (0, x.useState)(!1), [mr, hr] = (0, x.useState)(""), [gr, _r] = (0, x.useState)(""), [vr, yr] = (0, x.useState)(null);
	(0, x.useEffect)(() => {
		if (a || l || o || !je.offline) return;
		if (c) {
			let e = at(`mezgeb_resume_${c}`);
			if (e.value) try {
				let t = JSON.parse(e.value);
				if (t && typeof t.stepIndex == "number" && t.answers) {
					jt((e) => ({
						...e,
						...t.answers
					})), wt(Math.min(t.stepIndex, Mt - 1)), Lt(t.stepIndex + 1), Je("questions");
					return;
				}
			} catch {}
		}
		let e = at(s);
		if (e.blocked && Ht(!0), e.value) try {
			let t = JSON.parse(e.value);
			t && typeof t.stepIndex == "number" && t.answers && (t.stepIndex > 0 && t.stepIndex < Mt && Lt(t.stepIndex + 1), jt((e) => ({
				...e,
				...t.answers
			})));
		} catch {}
	}, [
		a,
		l,
		o,
		s,
		c,
		Mt,
		je.offline
	]), (0, x.useEffect)(() => {
		if (b?.(A), a || l || o || P || !je.offline) return;
		let e = kn(A);
		ot(s, JSON.stringify({
			stepIndex: k,
			answers: e
		})).blocked && Ht(!0);
	}, [
		A,
		k,
		a,
		l,
		o,
		s,
		P,
		b,
		je.offline
	]), (0, x.useEffect)(() => {
		if (!u) {
			Ft(!1);
			return;
		}
		let e = j.findIndex((e) => e.id === u);
		e >= 0 ? (Zt(null), Je("questions"), wt(e), Ft(!1)) : O.questions.some((e) => e.id === u) && Ft(!0);
	}, [u, j.length]), (0, x.useEffect)(() => {
		k >= Mt && wt(Math.max(0, Mt - 1));
	}, [k, Mt]), (0, x.useEffect)(() => {
		if (!(a || l || o)) return zt((e) => {
			e.type === "partner_joined" && e.sessionId === Qt ? (F(!0), fe(w("widgetPartnerJoinedBanner"))) : e.type === "partner_verified" && e.sessionId === Qt && e.verifiedAt && (F(!0), Zt((t) => t && {
				...t,
				profile: {
					...t.profile,
					id_route: "partner_verified",
					verified_at: e.verifiedAt
				}
			}));
		});
	}, [
		a,
		l,
		o,
		Qt,
		fe,
		w
	]);
	let z = y ? y.rawQuestion : k < j.length ? j[k] : null, br = !l && !y && k === j.length;
	(0, x.useEffect)(() => {
		he(null), Se(!1);
	}, [y?.rawQuestion?.id, y?.editingLang]), (0, x.useEffect)(() => {
		if (!y?.focusLabelTrigger || !y.rawQuestion) return;
		he("label"), ve(y.rawQuestion.label[y.editingLang] ?? "");
		let e = window.setTimeout(() => {
			Te.current?.focus();
		}, 30);
		return () => window.clearTimeout(e);
	}, [y?.focusLabelTrigger]), (0, x.useEffect)(() => {
		if (!ye) return;
		let e = (e) => {
			De.current?.contains(e.target) || Se(!1);
		};
		return document.addEventListener("mousedown", e), () => document.removeEventListener("mousedown", e);
	}, [ye]), (0, x.useEffect)(() => {
		a || l || o || A.id_route === "partner_refer" && A.partner_org && Rt({
			sessionId: Qt,
			partnerOrg: String(A.partner_org),
			stepNumber: k + 1,
			totalSteps: Mt,
			questionLabel: z ? z.label[T] : w("widgetReviewTitle"),
			maskedFields: j.map((e) => {
				let t = A[e.id], n = Array.isArray(t) ? t.length > 0 : !!(t && String(t).trim() !== "");
				return {
					id: e.id,
					label: e.label[T],
					hasValue: n
				};
			}),
			partnerJoined: $t,
			verified: !1,
			updatedAt: (/* @__PURE__ */ new Date()).toISOString()
		});
	}, [
		A,
		k,
		Mt,
		z,
		T,
		Qt,
		$t,
		a,
		l,
		o,
		j,
		w
	]), (0, x.useEffect)(() => () => {
		Bn.current && window.clearInterval(Bn.current), zn.current?.getTracks().forEach((e) => e.stop()), typeof window < "u" && "speechSynthesis" in window && window.speechSynthesis.cancel(), fn.current?.pause(), pn.current?.abort();
		for (let e of hn.current.values()) URL.revokeObjectURL(e);
		hn.current.clear();
	}, []);
	let B = (e) => `${pe}-field-${e}`, V = (e, t) => {
		jt((n) => ({
			...n,
			[e]: t
		})), tn((t) => t.filter((t) => t.fieldId !== B(e)));
	};
	(0, x.useEffect)(() => {
		tn([]), R("idle"), Fn(null), Ln(null), Yn(null), Zn(!1), rr(null), typeof window < "u" && "speechSynthesis" in window && (window.speechSynthesis.cancel(), sn(!1)), fn.current?.pause(), pn.current?.abort(), pn.current = null, un(!1);
	}, [k, qe]);
	let xr = !!(Le && Fe.readAloudProviders?.[T]), Sr = bn(T, z?.audio?.[T], xr), Cr = (0, x.useCallback)((e) => {
		let t = new Audio(e);
		return fn.current = t, t.onended = () => sn(!1), t.onerror = () => sn(!1), sn(!0), t.play();
	}, []), wr = (0, x.useCallback)((e, t) => {
		if (typeof window > "u" || !("speechSynthesis" in window)) return;
		let n = window.speechSynthesis.getVoices(), r = t === "am" ? n.some((e) => e.lang.toLowerCase().startsWith("am")) : n.length === 0 || n.some((e) => e.lang.toLowerCase().startsWith("en"));
		if (t === "am" && !r) {
			un(!0), sn(!1);
			return;
		}
		un(!1);
		let i = new SpeechSynthesisUtterance(e);
		i.lang = t === "am" ? "am-ET" : "en-US", i.onend = () => sn(!1), i.onerror = () => sn(!1), window.speechSynthesis.cancel(), sn(!0), window.speechSynthesis.speak(i);
	}, []), Tr = (0, x.useCallback)((e, t, n) => {
		if (an) typeof window < "u" && "speechSynthesis" in window && window.speechSynthesis.cancel(), fn.current?.pause(), pn.current?.abort(), pn.current = null, sn(!1);
		else if (n) Cr(n).catch(() => sn(!1));
		else if (Le && Fe.readAloudProviders?.[t]) {
			un(!1);
			let n = `${t}|${e}`, r = () => {
				sn(!1), wr(e, t);
			}, i = hn.current.get(n);
			if (i) {
				Cr(i).catch(r);
				return;
			}
			let a = new AbortController();
			pn.current = a, sn(!0), Xe(e, t, a.signal).then((e) => {
				if (a.signal.aborted) return;
				if (pn.current = null, !e) return r();
				let t = URL.createObjectURL(e);
				hn.current.set(n, t), Cr(t).catch(r);
			});
		} else wr(e, t);
	}, [
		an,
		Le,
		Fe.readAloudProviders,
		Cr,
		wr
	]), Er = () => {
		if (z) {
			let e = `${z.label.en}. ${z.hint?.en ?? ""}`;
			Tr(e, "en", z.audio?.en);
		} else Tr(w("widgetReviewTitle"), "en");
	}, Dr = (0, x.useRef)("");
	(0, x.useEffect)(() => {
		if (qe !== "questions" || tt !== "simple" || !it || !je.readAloud || !Sr || a) return;
		let e = `${k}-${z?.id ?? "review"}-${T}`;
		if (Dr.current === e) return;
		Dr.current = e;
		let t = z ? z.hint?.[T] || z.label[T] : w("widgetReviewTitle");
		t && !an && Tr(t, T, z?.audio?.[T]);
	}, [
		qe,
		tt,
		it,
		je.readAloud,
		Sr,
		a,
		k,
		z,
		T,
		w,
		an,
		Tr
	]), (0, x.useEffect)(() => {
		if (!Hn) return;
		let e = window.setTimeout(() => {
			$n.current?.focus();
		}, 20), t = (e) => {
			e.key === "Escape" && (e.preventDefault(), Un(!1), (Vn.current ?? Qn.current)?.focus());
		};
		return window.addEventListener("keydown", t), () => {
			window.clearTimeout(e), window.removeEventListener("keydown", t);
		};
	}, [Hn]), (0, x.useEffect)(() => {
		let e = (e) => {
			if (e.altKey && (e.key === "h" || e.key === "H")) {
				if (C === "widget" && !(gn.current && e.composedPath().includes(gn.current))) return;
				e.preventDefault(), Un((e) => !e);
			}
		};
		return window.addEventListener("keydown", e), () => window.removeEventListener("keydown", e);
	}, [C]), (0, x.useEffect)(() => {
		if (!v) return;
		let { type: e } = v;
		if (Zt(null), Je("questions"), e === "field_error") {
			let e = j.findIndex((e) => e.type === "phone"), t = e >= 0 ? e : Math.min(1, j.length - 1);
			wt(t);
			let n = j[t];
			n && tn([{
				fieldId: B(n.id),
				code: n.type === "phone" ? "PHONE_INVALID" : "REQUIRED",
				message: n.type === "phone" ? w("errPhoneFormat") : w("errRequired"),
				fieldLabel: n.label[T]
			}]);
		} else if (e === "voice_listening") {
			let e = j.findIndex((e) => e.type === "text");
			e >= 0 && wt(e), R("listening"), Nn(3);
		} else if (e === "voice_review") {
			let e = j.findIndex((e) => e.type === "text"), t = e >= 0 ? j[e] : j[0];
			if (e >= 0 && wt(e), t) {
				let e = T === "am" ? "ሐና ተስፋዬ" : w("demoSimulatedVoiceSample");
				Fn({
					fieldKey: t.id,
					transcript: e,
					value: e
				}), R("review");
			}
		} else if (e === "voice_failed") {
			let e = j.findIndex((e) => e.type === "text");
			e >= 0 && wt(e), R("failed");
		} else if (e === "outbox_sending") Xt("sending");
		else if (e === "help_open") Un(!0);
		else if (e === "sms_sent") pr(!0), hr("0911234567"), yr(`${window.location.origin}/demo?resume=mzg_demo_5`);
		else if (e === "restored") {
			let e = Math.min(4, Math.max(0, j.length - 1));
			wt(e), Lt(e + 1);
		}
	}, [v?.seq]);
	let Or = (0, x.useCallback)(() => {
		Bn.current &&= (window.clearInterval(Bn.current), null), Rn.current && Rn.current.state !== "inactive" ? Rn.current.stop() : R("idle");
	}, []), kr = async (e, t, n, r, i) => {
		if (Be && !a) {
			if (Fn(null), Ln(null), !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) R("failed"), Vn.current?.focus();
			else try {
				let a = await navigator.mediaDevices.getUserMedia({ audio: !0 });
				zn.current = a;
				let o = [], s = "audio/webm;codecs=opus", c = typeof MediaRecorder.isTypeSupported == "function" && MediaRecorder.isTypeSupported(s) ? new MediaRecorder(a, {
					mimeType: s,
					audioBitsPerSecond: 16e3
				}) : new MediaRecorder(a);
				Rn.current = c, c.ondataavailable = (e) => {
					e.data.size > 0 && o.push(e.data);
				}, c.onstop = async () => {
					a.getTracks().forEach((e) => e.stop());
					let s = new Blob(o, { type: c.mimeType || "audio/webm" });
					R("processing");
					try {
						let a = await rt(s);
						if (a.size > 1e6) {
							R("failed");
							return;
						}
						let o = await Ze({
							audioBase64: await On(a),
							mimeType: a.type && a.type.toLowerCase().includes("wav") ? "audio/wav" : a.type || "audio/webm",
							questionLabel: t,
							expectedType: n,
							lang: T,
							options: r
						});
						if (!o.ok || !o.transcript) R("failed"), Vn.current?.focus();
						else if (r && r.length > 0) {
							let t = o.matchedValue ? r.find((e) => e.value === o.matchedValue) : void 0;
							t ? (Ln({
								fieldKey: e,
								matchedValue: t.value,
								matchedLabel: t.label,
								isMulti: i
							}), R("idle")) : R("failed");
						} else {
							Fn({
								fieldKey: e,
								transcript: o.transcript,
								value: o.value
							}), R("review");
							let t = En(n) ? Dn(o.value) : o.value || o.transcript;
							fe(`${w("widgetTranscriptConfirmTitle")} ${t}`);
						}
					} catch {
						R("failed"), Vn.current?.focus();
					}
				}, c.start(), R("listening"), Nn(0), Bn.current = window.setInterval(() => {
					Nn((e) => e + 1 >= 20 ? (Or(), 20) : e + 1);
				}, 1e3);
			} catch {
				R("failed"), Vn.current?.focus();
			}
		}
	}, Ar = () => {
		if (a) return [];
		let e = [];
		if (z) {
			let t = B(z.id), n = z.label[T], r = A[z.id], i = String(r ?? "").trim(), a = z.validation;
			if (z.type === "info") return [];
			if (z.type === "text") z.required && !i ? e.push({
				fieldId: t,
				code: "REQUIRED",
				message: w("errRequired"),
				fieldLabel: n
			}) : i && (a?.preset === "ethiopian-phone" && !Gt(i) ? e.push({
				fieldId: t,
				code: "PHONE_INVALID",
				message: w("errPhoneFormat"),
				fieldLabel: n
			}) : a?.preset === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(i) ? e.push({
				fieldId: t,
				code: "EMAIL_INVALID",
				message: w("errEmailFormat"),
				fieldLabel: n
			}) : a?.preset === "digits-only" && !/^\d+$/.test(i) ? e.push({
				fieldId: t,
				code: "DIGITS_ONLY",
				message: w("errDigitsOnly"),
				fieldLabel: n
			}) : a?.preset === "letters-only" && /\d/.test(i) && e.push({
				fieldId: t,
				code: "LETTERS_ONLY",
				message: w("errLettersOnly"),
				fieldLabel: n
			}), typeof a?.minLength == "number" && i.length < a.minLength && e.push({
				fieldId: t,
				code: "MIN_LENGTH",
				message: w("errMinLength", { min: a.minLength }),
				fieldLabel: n
			}), typeof a?.maxLength == "number" && i.length > a.maxLength && e.push({
				fieldId: t,
				code: "MAX_LENGTH",
				message: w("errMaxLength", { max: a.maxLength }),
				fieldLabel: n
			}));
			else if (z.type === "email") z.required && !i ? e.push({
				fieldId: t,
				code: "REQUIRED",
				message: w("errRequired"),
				fieldLabel: n
			}) : i && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(i) && e.push({
				fieldId: t,
				code: "EMAIL_INVALID",
				message: w("errEmailFormat"),
				fieldLabel: n
			});
			else if (z.type === "number") {
				if (z.required && !i) e.push({
					fieldId: t,
					code: "REQUIRED",
					message: w("errRequired"),
					fieldLabel: n
				});
				else if (i) {
					let r = Number(i);
					Number.isFinite(r) ? (typeof a?.min == "number" && r < a.min && e.push({
						fieldId: t,
						code: "NUMBER_RANGE",
						message: w("errMinNumber", { min: a.min }),
						fieldLabel: n
					}), typeof a?.max == "number" && r > a.max && e.push({
						fieldId: t,
						code: "NUMBER_RANGE",
						message: w("errMaxNumber", { max: a.max }),
						fieldLabel: n
					})) : e.push({
						fieldId: t,
						code: "NUMBER_INVALID",
						message: w("errNumberFormat"),
						fieldLabel: n
					});
				}
			} else if (z.type === "choice" || z.type === "yes-no") z.required && !i && e.push({
				fieldId: t,
				code: "REQUIRED",
				message: w("errRequired"),
				fieldLabel: n
			});
			else if (z.type === "multichoice") {
				let i = Array.isArray(r) ? r : [];
				z.required && i.length === 0 && e.push({
					fieldId: t,
					code: "REQUIRED",
					message: w("errRequired"),
					fieldLabel: n
				});
			} else if (z.type === "consent") z.required && !r && e.push({
				fieldId: t,
				code: "CONSENT_REQUIRED",
				message: w("errRequired"),
				fieldLabel: n
			});
			else if (z.type === "phone") (z.required || i !== "") && !Gt(i) && e.push({
				fieldId: t,
				code: "PHONE_INVALID",
				message: w("errPhoneFormat"),
				fieldLabel: n
			});
			else if (z.type === "date") {
				if ((A.dob_calendar === "greg" ? "greg" : "eth") == "eth") {
					let t = Number(String(A.dob_eth_day ?? "").trim()), n = Number(String(A.dob_eth_month ?? "").trim());
					xt(Number(String(A.dob_eth_year ?? "").trim()), n, t) || e.push({
						fieldId: B("dob_eth_year"),
						code: "DATE_INVALID",
						message: w("errDateInvalid"),
						fieldLabel: w("widgetCalYear")
					});
				} else {
					let t = Number(String(A.dob_greg_day ?? "").trim()), n = Number(String(A.dob_greg_month ?? "").trim());
					St(Number(String(A.dob_greg_year ?? "").trim()), n, t) || e.push({
						fieldId: B("dob_greg_year"),
						code: "DATE_INVALID",
						message: w("errDateInvalid"),
						fieldLabel: w("widgetCalYear")
					});
				}
			} else if (z.type === "id-routes") {
				let r = A.id_route;
				r ? r !== "partner_refer" || A.partner_org && A.partner_consent || e.push({
					fieldId: B("partner_consent"),
					code: "PARTNER_CONSENT_REQUIRED",
					message: w("errPartnerRequired"),
					fieldLabel: w("widgetPartnerConsent")
				}) : e.push({
					fieldId: t,
					code: "ID_ROUTE_REQUIRED",
					message: w("errRequired"),
					fieldLabel: n
				});
			}
		} else br && (A.consent_accepted || e.push({
			fieldId: B("consent_accepted"),
			code: "CONSENT_REQUIRED",
			message: w("errRequired"),
			fieldLabel: O.consent[T]
		}));
		return e;
	}, jr = (e) => {
		fe(w("widgetStepOf", {
			current: e,
			total: Mt
		})), window.setTimeout(() => {
			rn.current?.focus();
		}, 20);
	}, Mr = async () => {
		let e = Ar();
		if (e.length > 0) tn(e), fe(e.map((e) => e.message).join(" ")), window.setTimeout(() => {
			nn.current?.focus();
		}, 20);
		else if (z && te?.({
			name: "step.completed",
			timestamp: (/* @__PURE__ */ new Date()).toLocaleTimeString(),
			payload: {
				questionId: z.id,
				maps_to: z.maps_to,
				mode: tt
			}
		}), Tt && !l) kt(!1), wt(j.length), jr(j.length + 1);
		else if (k < Mt - 1) {
			let e = k + 1;
			wt(e), jr(e + 1);
		} else await Pr();
	}, Nr = async () => {
		if (z && !z.required) {
			if (tn([]), k < Mt - 1) {
				let e = k + 1;
				wt(e), jr(e + 1);
			} else await Pr();
		}
	}, Pr = async () => {
		let { profile: e, supportShared: t } = Yt({
			answers: A,
			template: O
		}), r = n || typeof navigator < "u" && !navigator.onLine, i = "";
		if (l || o) i = "mzg_tok_preview";
		else if (!r) try {
			i = ie ? await Bt(ie, e) : `mzg_tok_${Math.random().toString(16).slice(2, 10)}`;
		} catch {
			r = !0;
		}
		!l && !o && ae && Wt({
			profile: e,
			rawAnswers: A,
			supportNeeds: Array.isArray(A.support_needs) ? A.support_needs : [],
			sharing: {
				platform: !!A.support_share_platform,
				employers: !!A.support_share_employers,
				partner: !!A.support_share_partner
			}
		}), r && !o && (await Nt({
			id: `outbox_${Date.now()}`,
			createdAt: (/* @__PURE__ */ new Date()).toISOString(),
			profile: e,
			supportShared: t,
			...ie ? { siteKey: ie } : {}
		}), S?.()), o || st(s);
		let a = {
			token: i,
			profile: e,
			supportShared: t,
			queuedOffline: r
		};
		te?.({
			name: "registration.completed",
			timestamp: (/* @__PURE__ */ new Date()).toLocaleTimeString(),
			payload: {
				token: i,
				id_route: e.id_route ?? null,
				support_shared: t,
				queued_offline: r
			}
		}), Zt(a), fe(w(r ? "widgetOfflineQueuedTitle" : "widgetSuccessTitle")), ne?.(a);
	}, Fr = (e) => z?.errorHelp?.[T]?.trim() ? z.errorHelp[T] : w({
		REQUIRED: "helpErrREQUIRED",
		PHONE_INVALID: "helpErrPHONE_INVALID",
		DATE_INVALID: "helpErrDATE_INVALID",
		ID_ROUTE_REQUIRED: "helpErrID_ROUTE_REQUIRED",
		PARTNER_CONSENT_REQUIRED: "helpErrPARTNER_CONSENT_REQUIRED",
		CONSENT_REQUIRED: "helpErrCONSENT_REQUIRED",
		EMAIL_INVALID: "helpErrEMAIL_INVALID",
		NUMBER_INVALID: "helpErrNUMBER_INVALID",
		MIN_LENGTH: "helpErrMIN_LENGTH",
		MAX_LENGTH: "helpErrMAX_LENGTH",
		DIGITS_ONLY: "helpErrDIGITS_ONLY",
		LETTERS_ONLY: "helpErrLETTERS_ONLY",
		NUMBER_RANGE: "helpErrNUMBER_RANGE"
	}[e] ?? "helpErrREQUIRED"), Ir = () => z ? z.errorHelp?.[T]?.trim() ? z.errorHelp[T] : w({
		text: "helpTypeText",
		phone: "helpTypePhone",
		date: "helpTypeDate",
		choice: "helpTypeChoice",
		multichoice: "helpTypeMultichoice",
		"id-routes": "helpTypeIdRoutes",
		support: "helpTypeSupport",
		"work-story": "helpTypeWorkStory",
		"yes-no": "helpTypeYesNo",
		email: "helpTypeEmail",
		number: "helpTypeNumber",
		info: "helpTypeInfo",
		consent: "helpTypeConsent"
	}[z.type] ?? "helpTypeText") : w("helpTypeReview"), Lr = () => en[0] ? {
		id: en[0].fieldId,
		label: en[0].fieldLabel
	} : z ? z.type === "date" ? {
		id: B(A.dob_calendar === "greg" ? "dob_greg_year" : "dob_eth_year"),
		label: w("widgetCalYear")
	} : {
		id: B(z.id),
		label: z.label[T]
	} : {
		id: B("consent_accepted"),
		label: O.consent[T]
	}, Rr = async (e) => {
		if (e.preventDefault(), !He) return;
		let t = Lr(), n = qt({
			stepNumber: k + 1,
			currentQuestion: z,
			lang: T,
			errors: en.map((e) => ({
				fieldId: e.fieldId,
				code: e.code,
				message: e.message
			})),
			buttonNames: [w("widgetBack"), w(br ? "widgetConfirm" : "widgetSaveContinue")],
			reviewTitle: w("widgetReviewTitle")
		});
		ee?.(n), qn(!0);
		let r = en[0] ? Fr(en[0].code) : Ir(), i = await Qe({
			screenSummary: n,
			userProblem: Wn.trim() || w("widgetHelpDefaultQuestion"),
			lang: T,
			fallbackExplanation: r,
			fallbackTargetFieldId: t.id
		});
		qn(!1), Yn({
			explanation: i.explanation,
			targetFieldId: i.targetFieldId,
			targetFieldLabel: t.label
		}), fe(i.explanation);
	}, zr = async () => {
		if (!z) return;
		if (!We) {
			rr({
				usedAi: !1,
				text: z.hint?.[T] ?? z.label[T]
			});
			return;
		}
		tr(!0);
		let e = await $e({
			label: z.label[T],
			lang: T,
			fallbackHint: z.hint?.[T] ?? z.label[T]
		});
		tr(!1), rr(e);
	}, Br = async () => {
		let e = String(A.work_story ?? "").trim();
		if (!e) return;
		ar(!0), dr(!1);
		let t = await et({
			story: e,
			lang: T
		});
		ar(!1), !t.usedAi || t.skills.length === 0 ? (dr(!0), sr([])) : sr(t.skills);
	}, Vr = () => {
		o || st(s), Zt(null), wt(0), Je(Ge ? "welcome" : "questions"), Lt(null), Xt("idle"), M(!1), sr([]), dr(!1), yr(null), jt(An(T, O.partnerDefault)), re?.();
	}, Hr = (e) => {
		e.preventDefault();
		let t = mr.trim() || String(A.phone ?? "");
		if (!Gt(t)) {
			_r(w("errPhoneFormat"));
			return;
		}
		_r("");
		let n = Math.random().toString(36).slice(2, 10), r = kn({
			...A,
			phone: Kt(t)
		});
		o || ot(`mezgeb_resume_${n}`, JSON.stringify({
			stepIndex: k,
			answers: r
		})), yr(`${window.location.origin}/demo?resume=${n}`);
	}, Ur = (e) => {
		e.preventDefault();
		let t = ft.trim(), n = t.match(/resume=([a-zA-Z0-9_-]+)/), r = n ? n[1] : t;
		if (!r) {
			Ct(w("errRequired"));
			return;
		}
		let i = at(`mezgeb_resume_${r}`).value;
		if (i) try {
			let e = JSON.parse(i);
			if (e && typeof e.stepIndex == "number" && e.answers) {
				jt((t) => ({
					...t,
					...e.answers
				})), wt(Math.min(e.stepIndex, Mt - 1)), Lt(e.stepIndex + 1), Ct(""), dt(!1), Je("questions");
				return;
			}
		} catch {}
		Ct(""), dt(!1), Je("questions");
	}, Wr = `mezgeb-surface rounded-[16px] border border-[var(--line)] bg-[var(--paper)] text-[var(--ink)] text-[1.125rem] leading-[1.6] ${m ? "mezgeb-hc" : ""}`, Gr = { "--widget-accent": m ? "#000000" : Me };
	if (!Oe.valid && O.questions.length === 0) return /* @__PURE__ */ (0, I.jsx)("div", {
		className: Wr,
		style: Gr,
		children: /* @__PURE__ */ (0, I.jsx)("div", {
			className: "p-6",
			children: /* @__PURE__ */ (0, I.jsxs)(dn, {
				variant: "error",
				role: "alert",
				children: [/* @__PURE__ */ (0, I.jsx)("p", {
					className: "font-semibold",
					children: w("templatesValidationErrorsTitle")
				}), /* @__PURE__ */ (0, I.jsx)("ul", {
					className: "list-disc pl-5 mt-1 text-sm",
					children: Oe.errors.map((e, t) => /* @__PURE__ */ (0, I.jsx)("li", { children: e }, t))
				})]
			})
		})
	});
	if (P) {
		let e = String(P.profile.name ?? "");
		return /* @__PURE__ */ (0, I.jsx)("div", {
			className: Wr,
			style: Gr,
			children: /* @__PURE__ */ (0, I.jsxs)("div", {
				className: "p-5 sm:p-6 space-y-5 text-left",
				children: [
					/* @__PURE__ */ (0, I.jsx)(dn, {
						variant: "success",
						children: /* @__PURE__ */ (0, I.jsxs)("div", {
							className: "space-y-1",
							children: [/* @__PURE__ */ (0, I.jsx)("p", {
								className: "font-semibold text-base",
								children: P.queuedOffline ? w("widgetOfflineQueuedTitle") : w("widgetSuccessTitle")
							}), e && /* @__PURE__ */ (0, I.jsx)("p", {
								className: "text-sm font-medium text-[var(--ink)]",
								children: e
							})]
						})
					}),
					/* @__PURE__ */ (0, I.jsx)("p", {
						className: "text-base text-[var(--ink)] leading-relaxed",
						children: w("widgetSuccessBody")
					}),
					!P.queuedOffline && /* @__PURE__ */ (0, I.jsxs)("div", {
						className: "p-4 rounded-[10px] bg-[var(--stone)] border border-[var(--line)] text-sm space-y-1",
						children: [/* @__PURE__ */ (0, I.jsx)("p", {
							className: "text-[var(--muted)]",
							children: w("widgetSuccessTokenNote")
						}), /* @__PURE__ */ (0, I.jsx)("code", {
							className: "text-[var(--ink)] font-medium block break-all",
							style: { fontFamily: "var(--font-mono)" },
							children: P.token
						})]
					}),
					/* @__PURE__ */ (0, I.jsxs)("div", {
						className: "flex flex-wrap items-center gap-3 pt-2",
						children: [je.smsResume && /* @__PURE__ */ (0, I.jsx)(L, {
							variant: "secondary",
							size: "lg",
							onClick: () => {
								hr(String(A.phone ?? "")), pr((e) => !e);
							},
							children: w("widgetDoneGetLink")
						}), /* @__PURE__ */ (0, I.jsx)(L, {
							variant: "primary",
							size: "lg",
							onClick: Vr,
							children: w("widgetSuccessRestart")
						})]
					})
				]
			})
		});
	}
	if (qe === "welcome") return /* @__PURE__ */ (0, I.jsx)("div", {
		className: Wr,
		style: Gr,
		children: /* @__PURE__ */ (0, I.jsxs)("div", {
			className: "p-5 sm:p-6 space-y-6 text-left",
			children: [
				/* @__PURE__ */ (0, I.jsxs)("div", {
					className: "space-y-2",
					children: [
						/* @__PURE__ */ (0, I.jsx)("p", {
							className: "text-sm font-medium text-[var(--muted)]",
							children: Pe
						}),
						/* @__PURE__ */ (0, I.jsx)("h2", {
							ref: rn,
							tabIndex: -1,
							className: "text-[1.5rem] font-semibold text-[var(--ink)] outline-none",
							children: w("widgetWelcomeTitle")
						}),
						/* @__PURE__ */ (0, I.jsxs)("ul", {
							className: "space-y-2 text-base text-[var(--ink-2)] pt-1",
							children: [
								/* @__PURE__ */ (0, I.jsx)("li", { children: w("widgetWelcomeLine1") }),
								/* @__PURE__ */ (0, I.jsx)("li", { children: w("widgetWelcomeLine2") }),
								/* @__PURE__ */ (0, I.jsx)("li", { children: w("widgetWelcomeLine3") })
							]
						})
					]
				}),
				/* @__PURE__ */ (0, I.jsx)(mn, {
					name: `${pe}-welcome-lang`,
					legend: w("widgetWelcomeLangHeading"),
					hideLegend: !1,
					mode: "single",
					value: T,
					onChange: (e) => {
						let t = e === "am" ? "am" : "en";
						ce(t), V("language", t);
					},
					options: [{
						value: "am",
						title: "አማርኛ",
						lang: "am"
					}, {
						value: "en",
						title: "English",
						lang: "en"
					}]
				}),
				/* @__PURE__ */ (0, I.jsxs)("div", {
					className: "space-y-3 pt-2",
					children: [/* @__PURE__ */ (0, I.jsx)(L, {
						variant: "primary",
						size: "lg",
						fullWidth: !0,
						onClick: () => {
							Je("mode"), window.setTimeout(() => rn.current?.focus(), 20);
						},
						children: w("widgetWelcomeStart")
					}), /* @__PURE__ */ (0, I.jsx)(L, {
						variant: "quiet",
						size: "md",
						onClick: () => dt((e) => !e),
						children: w("widgetWelcomeHaveLink")
					})]
				}),
				lt && /* @__PURE__ */ (0, I.jsxs)("form", {
					onSubmit: Ur,
					className: "p-4 rounded-[10px] border border-[var(--line)] bg-[var(--stone)] space-y-3",
					children: [/* @__PURE__ */ (0, I.jsx)(vn, {
						label: w("widgetWelcomeResumePrompt"),
						error: vt,
						inputProps: {
							type: "text",
							value: ft,
							onChange: (e) => gt(e.target.value)
						}
					}), /* @__PURE__ */ (0, I.jsx)(L, {
						type: "submit",
						variant: "secondary",
						size: "md",
						children: w("widgetWelcomeResumeOpen")
					})]
				})
			]
		})
	});
	if (qe === "mode") return /* @__PURE__ */ (0, I.jsx)("div", {
		className: Wr,
		style: Gr,
		children: /* @__PURE__ */ (0, I.jsxs)("div", {
			className: "p-5 sm:p-6 space-y-6 text-left",
			children: [
				/* @__PURE__ */ (0, I.jsxs)("div", {
					className: "space-y-1.5",
					children: [
						/* @__PURE__ */ (0, I.jsx)("p", {
							className: "text-sm font-medium text-[var(--muted)]",
							children: Pe
						}),
						/* @__PURE__ */ (0, I.jsx)("h2", {
							ref: rn,
							tabIndex: -1,
							className: "text-[1.5rem] font-semibold text-[var(--ink)] outline-none",
							children: w("widgetModeHeading")
						}),
						/* @__PURE__ */ (0, I.jsx)("p", {
							className: "text-sm text-[var(--muted)]",
							children: w("widgetModeHint")
						})
					]
				}),
				/* @__PURE__ */ (0, I.jsx)(mn, {
					name: `${pe}-answer-mode`,
					legend: w("widgetModeHeading"),
					mode: "single",
					value: tt,
					onChange: (e) => nt(e),
					options: [
						{
							value: "speak",
							title: w("widgetModeSpeakTitle"),
							description: w("widgetModeSpeakDesc"),
							icon: /* @__PURE__ */ (0, I.jsx)(xe, {
								size: 24,
								strokeWidth: 1.75
							})
						},
						{
							value: "type",
							title: w("widgetModeTypeTitle"),
							description: w("widgetModeTypeDesc"),
							icon: /* @__PURE__ */ (0, I.jsx)(ke, {
								size: 24,
								strokeWidth: 1.75
							})
						},
						{
							value: "simple",
							title: w("widgetModeSimpleTitle"),
							description: w("widgetModeSimpleDesc"),
							icon: /* @__PURE__ */ (0, I.jsx)(Ae, {
								size: 24,
								strokeWidth: 1.75
							})
						}
					]
				}),
				/* @__PURE__ */ (0, I.jsxs)("div", {
					className: "grid grid-cols-3 gap-3 pt-2 border-t border-[var(--line)]",
					children: [/* @__PURE__ */ (0, I.jsx)(L, {
						variant: "secondary",
						size: "lg",
						fullWidth: !0,
						onClick: () => Je("welcome"),
						children: w("widgetBack")
					}), /* @__PURE__ */ (0, I.jsx)("div", {
						className: "col-span-2",
						children: /* @__PURE__ */ (0, I.jsx)(L, {
							variant: "primary",
							size: "lg",
							fullWidth: !0,
							onClick: () => {
								Je("questions"), jr(k + 1);
							},
							children: w("widgetSaveContinue")
						})
					})]
				})
			]
		})
	});
	let Kr = new Map(en.map((e) => [e.fieldId, e.message])), qr = bt("eth"), Jr = bt("greg"), Yr = Array.from({ length: qr.max - qr.min + 1 }, (e, t) => qr.max - t), Xr = Array.from({ length: Jr.max - Jr.min + 1 }, (e, t) => Jr.max - t), Zr = Number(String(A.dob_eth_day ?? "").trim()), Qr = Number(String(A.dob_eth_month ?? "").trim()), $r = Number(String(A.dob_eth_year ?? "").trim()), ei = $r && Qr ? _t($r, Qr) : 30, ti = $r > 0 && Qr > 0 && Zr > 0 && xt($r, Qr, Zr) ? Et({
		year: $r,
		month: Qr,
		day: Zr
	}) : null, ni = Number(String(A.dob_greg_day ?? "").trim()), ri = Number(String(A.dob_greg_month ?? "").trim()), ii = Number(String(A.dob_greg_year ?? "").trim()), ai = ii && ri ? yt(ii, ri) : 31, oi = ii > 0 && ri > 0 && ni > 0 && St(ii, ri, ni) ? Dt({
		year: ii,
		month: ri,
		day: ni
	}) : null, si = tt === "simple", ci = z ? si && z.hint?.[T] || z.label[T] : w("widgetReviewTitle"), li = en[0] ? Fr(en[0].code) : Ir();
	Lr();
	let ui = z?.type === "phone" ? "091 234 5678" : z?.type === "date" ? T === "am" ? "12 መስከረም 1990" : "22 September 1997" : T === "am" ? "ሐና ተስፋዬ" : "Hana Tesfaye", di = (e, t) => {
		if (!Be || e.allowVoice === !1 || a) return null;
		let n = e.options?.map((e) => ({
			value: e.value,
			label: e.label[T]
		})), r = Pn && Pn.fieldKey === e.id;
		return /* @__PURE__ */ (0, I.jsxs)("div", {
			className: "space-y-2",
			children: [/* @__PURE__ */ (0, I.jsx)(Cn, {
				widgetSize: !0,
				state: r ? "review" : jn,
				seconds: Mn,
				transcript: Pn?.value ?? "",
				onTranscriptChange: (e) => Pn && Fn({
					...Pn,
					value: e
				}),
				onStart: () => kr(e.id, e.label[T], e.type, n, t),
				onStop: Or,
				onKeep: () => {
					Pn && (V(e.id, Pn.value), Fn(null), R("idle"));
				},
				onRetry: () => {
					Fn(null), R("idle"), kr(e.id, e.label[T], e.type, n, t);
				},
				labels: {
					speakLabel: w("widgetSpeakAnswerLabel"),
					listeningLabel: w("widgetVoiceListeningLabel"),
					processingLabel: w("widgetVoiceProcessingLabel"),
					keepLabel: w("widgetVoiceKeepBtn"),
					tryAgainLabel: w("widgetVoiceTryAgainBtn"),
					failedMessage: w("widgetVoiceFailedMsg"),
					transcriptLabel: w("widgetTranscriptConfirmTitle")
				}
			}), In && In.fieldKey === e.id && /* @__PURE__ */ (0, I.jsxs)("div", {
				className: "p-3.5 rounded-[10px] border-2 border-[var(--accent)] bg-[var(--lilac)] flex flex-wrap items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, I.jsx)("p", {
					className: "text-sm font-medium text-[var(--ink)]",
					children: w("widgetVoiceChoiceConfirm", { option: In.matchedLabel })
				}), /* @__PURE__ */ (0, I.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, I.jsx)(L, {
						variant: "primary",
						size: "md",
						onClick: () => {
							if (In.isMulti) {
								let t = Array.isArray(A[e.id]) ? A[e.id] : [];
								t.includes(In.matchedValue) || V(e.id, [...t, In.matchedValue]);
							} else V(e.id, In.matchedValue), e.id === "language" && (In.matchedValue === "am" || In.matchedValue === "en") && ce(In.matchedValue);
							Ln(null);
						},
						children: w("widgetVoiceKeepBtn")
					}), /* @__PURE__ */ (0, I.jsx)(L, {
						variant: "secondary",
						size: "md",
						onClick: () => Ln(null),
						children: w("widgetVoiceTryAgainBtn")
					})]
				})]
			})]
		});
	};
	return /* @__PURE__ */ (0, I.jsx)("div", {
		ref: gn,
		className: Wr,
		style: Gr,
		children: /* @__PURE__ */ (0, I.jsxs)("div", {
			className: "p-5 sm:p-6 space-y-5 text-left",
			children: [
				h && /* @__PURE__ */ (0, I.jsx)(dn, {
					variant: "info",
					children: w("widgetAssistedBanner", { name: g })
				}),
				n && /* @__PURE__ */ (0, I.jsx)(dn, {
					variant: "warning",
					children: /* @__PURE__ */ (0, I.jsxs)("div", {
						className: "flex flex-wrap items-center gap-2",
						children: [/* @__PURE__ */ (0, I.jsx)("span", { children: w("widgetOfflineBanner") }), _ > 0 && /* @__PURE__ */ (0, I.jsx)(ln, {
							variant: "warning",
							children: w("outboxPendingCount", { count: _ })
						})]
					})
				}),
				N === "sending" && /* @__PURE__ */ (0, I.jsx)(dn, {
					variant: "info",
					children: w("widgetOutboxSendingBanner", { count: Math.max(1, _ || 3) })
				}),
				$t && /* @__PURE__ */ (0, I.jsx)(dn, {
					variant: "success",
					children: w("widgetPartnerJoinedBanner")
				}),
				Vt && !n && /* @__PURE__ */ (0, I.jsx)("p", {
					role: "status",
					className: "text-xs text-[var(--muted)]",
					children: w("demoStorageBlockedNote")
				}),
				It !== null && !a && !l && /* @__PURE__ */ (0, I.jsx)(dn, {
					variant: "info",
					action: /* @__PURE__ */ (0, I.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, I.jsx)(L, {
							variant: "secondary",
							size: "md",
							onClick: () => Lt(null),
							children: w("widgetResumeBtn", { step: It })
						}), /* @__PURE__ */ (0, I.jsx)(L, {
							variant: "quiet",
							size: "md",
							onClick: Vr,
							children: w("widgetStartFreshBtn")
						})]
					}),
					children: w("widgetSessionRestored", { step: It })
				}),
				Pt && /* @__PURE__ */ (0, I.jsx)(dn, {
					variant: "info",
					children: w("widgetHiddenByRule")
				}),
				/* @__PURE__ */ (0, I.jsxs)("div", {
					className: "space-y-3",
					children: [/* @__PURE__ */ (0, I.jsxs)("div", {
						className: "flex flex-wrap items-center justify-between gap-2",
						children: [/* @__PURE__ */ (0, I.jsx)("span", {
							className: "text-sm font-medium text-[var(--ink)]",
							children: Pe
						}), !l && /* @__PURE__ */ (0, I.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, I.jsx)("label", {
								htmlFor: `${pe}-mode-select`,
								className: "sr-only",
								children: w("widgetModeSwitchLabel")
							}), /* @__PURE__ */ (0, I.jsxs)("select", {
								id: `${pe}-mode-select`,
								value: tt,
								onChange: (e) => nt(e.target.value),
								className: "min-h-[36px] px-2.5 rounded-[6px] border border-[var(--line-strong)] bg-[var(--paper)] text-xs font-medium text-[var(--ink)]",
								children: [
									/* @__PURE__ */ (0, I.jsx)("option", {
										value: "speak",
										children: w("widgetModeSpeakTitle")
									}),
									/* @__PURE__ */ (0, I.jsx)("option", {
										value: "type",
										children: w("widgetModeTypeTitle")
									}),
									/* @__PURE__ */ (0, I.jsx)("option", {
										value: "simple",
										children: w("widgetModeSimpleTitle")
									})
								]
							})]
						})]
					}), y ? /* @__PURE__ */ (0, I.jsx)(yn, {
						current: y.questionPosition,
						total: y.questionTotal,
						label: y.labels.progressLabel
					}) : !l && /* @__PURE__ */ (0, I.jsx)(yn, {
						current: k + 1,
						total: Mt,
						label: w("widgetStepOf", {
							current: k + 1,
							total: Mt
						})
					})]
				}),
				cn && /* @__PURE__ */ (0, I.jsxs)("div", {
					className: "p-3 rounded-[10px] border border-[var(--line)] bg-[var(--stone)] flex flex-wrap items-center justify-between gap-2 text-xs text-[var(--muted)]",
					children: [/* @__PURE__ */ (0, I.jsx)("span", { children: w("widgetNoAmharicVoice") }), /* @__PURE__ */ (0, I.jsx)(L, {
						type: "button",
						variant: "secondary",
						size: "md",
						onClick: Er,
						children: w("widgetReadEnglishBtn")
					})]
				}),
				en.length > 0 && /* @__PURE__ */ (0, I.jsxs)("div", {
					ref: nn,
					tabIndex: -1,
					role: "alert",
					className: "p-4 rounded-[10px] border-2 border-[var(--error)] bg-[var(--error-bg)] text-[var(--error)] space-y-2 outline-none",
					children: [/* @__PURE__ */ (0, I.jsx)("p", {
						className: "text-sm font-semibold",
						children: w("widgetErrorSummaryTitle")
					}), /* @__PURE__ */ (0, I.jsx)("ul", {
						className: "list-disc pl-5 text-sm space-y-1",
						children: en.map((e, t) => /* @__PURE__ */ (0, I.jsx)("li", { children: /* @__PURE__ */ (0, I.jsx)("a", {
							href: `#${e.fieldId}`,
							onClick: (t) => {
								t.preventDefault(), Sn(e.fieldId)?.focus();
							},
							className: "underline font-medium text-[var(--error)]",
							children: e.message
						}) }, t))
					})]
				}),
				/* @__PURE__ */ (0, I.jsxs)("div", {
					className: "space-y-4",
					children: [
						/* @__PURE__ */ (0, I.jsxs)("div", {
							className: "flex items-start gap-4",
							children: [z && si && /* @__PURE__ */ (0, I.jsx)("div", {
								className: "w-20 h-20 rounded-[10px] border border-[var(--line)] bg-[var(--stone)] flex items-center justify-center shrink-0 text-[var(--ink)]",
								"aria-hidden": "true",
								children: /* @__PURE__ */ (0, I.jsx)(wn, {
									name: z.icon,
									size: 64
								})
							}), /* @__PURE__ */ (0, I.jsx)("div", {
								className: "space-y-2 flex-1 min-w-0",
								children: y && z ? /* @__PURE__ */ (0, I.jsxs)(I.Fragment, { children: [/* @__PURE__ */ (0, I.jsxs)("div", {
									className: "space-y-1",
									children: [
										T === "am" && !z.label.am.trim() && z.label.en.trim() && /* @__PURE__ */ (0, I.jsx)("p", {
											className: "text-xs text-[var(--muted)]",
											children: y.labels.englishReference(z.label.en)
										}),
										/* @__PURE__ */ (0, I.jsxs)("div", {
											className: "flex items-start gap-1.5",
											children: [/* @__PURE__ */ (0, I.jsx)("div", {
												className: "flex-1 min-w-0",
												children: me === "label" ? /* @__PURE__ */ (0, I.jsx)("textarea", {
													ref: Te,
													rows: 2,
													"aria-label": y.labels.editQuestionLabelAria,
													value: z.label[T] ?? "",
													onChange: (e) => y.onUpdateLabel(e.target.value),
													onKeyDown: (e) => {
														e.key === "Enter" && !e.shiftKey ? (e.preventDefault(), he(null), window.setTimeout(() => we.current?.focus(), 0)) : e.key === "Escape" && (e.preventDefault(), y.onUpdateLabel(ge), he(null), window.setTimeout(() => we.current?.focus(), 0));
													},
													onBlur: () => he(null),
													className: "w-full rounded-[6px] px-1.5 py-1 -mx-1.5 bg-[var(--paper)] text-[1.375rem] sm:text-[1.75rem] font-semibold text-[var(--ink)] leading-[1.2] outline-2 outline-[var(--accent)] border-0 resize-none"
												}) : /* @__PURE__ */ (0, I.jsx)("button", {
													ref: we,
													type: "button",
													"aria-label": y.labels.editQuestionLabelAria,
													onClick: () => {
														ve(z.label[T] ?? ""), he("label"), window.setTimeout(() => Te.current?.focus(), 0);
													},
													className: "w-full text-left rounded-[6px] px-1.5 py-0.5 -mx-1.5 border border-transparent hover:border-dashed hover:border-[var(--line-strong)] cursor-text text-[1.375rem] sm:text-[1.75rem] font-semibold text-[var(--ink)] leading-[1.2]",
													children: z.label[T]?.trim() ? z.label[T] : /* @__PURE__ */ (0, I.jsx)("span", {
														className: "text-[var(--muted)] font-normal",
														children: z.label.en || y.labels.editQuestionLabelAria
													})
												})
											}), y.renderLabelActions && /* @__PURE__ */ (0, I.jsx)("div", {
												className: "shrink-0 pt-0.5",
												children: y.renderLabelActions
											})]
										}),
										me === "label" && (z.label[T]?.length ?? 0) > 60 && /* @__PURE__ */ (0, I.jsx)("p", {
											role: "status",
											className: "text-xs text-[var(--warn)]",
											children: y.labels.charsWarning(z.label[T].length)
										}),
										y.renderAfterLabel
									]
								}), !si && /* @__PURE__ */ (0, I.jsxs)("div", {
									className: "space-y-1",
									children: [
										T === "am" && !z.hint?.am?.trim() && z.hint?.en?.trim() && /* @__PURE__ */ (0, I.jsx)("p", {
											className: "text-xs text-[var(--muted)]",
											children: y.labels.englishReference(z.hint.en)
										}),
										/* @__PURE__ */ (0, I.jsxs)("div", {
											className: "flex items-start gap-1.5",
											children: [/* @__PURE__ */ (0, I.jsx)("div", {
												className: "flex-1 min-w-0",
												children: me === "hint" ? /* @__PURE__ */ (0, I.jsx)("textarea", {
													ref: Ee,
													rows: 2,
													"aria-label": y.labels.editHintAria,
													value: z.hint?.[T] ?? "",
													onChange: (e) => y.onUpdateHint(e.target.value),
													onKeyDown: (e) => {
														e.key === "Enter" && !e.shiftKey ? (e.preventDefault(), he(null), window.setTimeout(() => E.current?.focus(), 0)) : e.key === "Escape" && (e.preventDefault(), y.onUpdateHint(ge), he(null), window.setTimeout(() => E.current?.focus(), 0));
													},
													onBlur: () => he(null),
													className: "w-full rounded-[6px] px-1.5 py-1 -mx-1.5 bg-[var(--paper)] text-sm text-[var(--ink)] leading-relaxed outline-2 outline-[var(--accent)] border-0 resize-none"
												}) : /* @__PURE__ */ (0, I.jsx)("button", {
													ref: E,
													type: "button",
													"aria-label": z.hint?.[T]?.trim() ? y.labels.editHintAria : y.labels.addHintBtn,
													onClick: () => {
														ve(z.hint?.[T] ?? ""), he("hint"), window.setTimeout(() => Ee.current?.focus(), 0);
													},
													className: "w-full text-left rounded-[6px] px-1.5 py-0.5 -mx-1.5 border border-transparent hover:border-dashed hover:border-[var(--line-strong)] cursor-text text-sm text-[var(--muted)] leading-relaxed",
													children: z.hint?.[T]?.trim() ? z.hint[T] : y.labels.addHintBtn
												})
											}), y.renderHintActions && /* @__PURE__ */ (0, I.jsx)("div", {
												className: "shrink-0",
												children: y.renderHintActions
											})]
										}),
										y.renderAfterHint
									]
								})] }) : /* @__PURE__ */ (0, I.jsxs)(I.Fragment, { children: [/* @__PURE__ */ (0, I.jsx)("h2", {
									ref: rn,
									tabIndex: -1,
									className: "text-[1.375rem] sm:text-[1.75rem] font-semibold text-[var(--ink)] leading-[1.2] outline-none",
									children: ci
								}), z?.hint?.[T] && !si && /* @__PURE__ */ (0, I.jsx)("p", {
									className: "text-sm text-[var(--muted)] leading-relaxed",
									children: z.hint[T]
								})] })
							})]
						}),
						/* @__PURE__ */ (0, I.jsxs)("div", {
							className: "flex flex-wrap items-center gap-2.5",
							children: [
								je.readAloud && /* @__PURE__ */ (0, I.jsx)(xn, {
									widgetSize: !0,
									text: ci,
									lang: T,
									audioUrl: z?.audio?.[T],
									serverReadAloud: xr,
									speaking: an,
									label: y ? y.labels.readAloudLabel : w("widgetReadAloud"),
									stopLabel: w("widgetStopReading"),
									onToggle: () => Tr(`${ci}. ${z?.hint?.[T] ?? ""}`, T, z?.audio?.[T])
								}),
								/* @__PURE__ */ (0, I.jsxs)("button", {
									ref: Qn,
									type: "button",
									onClick: () => Un((e) => !e),
									"aria-expanded": Hn,
									className: "mezgeb-transition inline-flex items-center gap-2 min-h-[44px] px-3.5 rounded-[10px] border border-[var(--line-strong)] bg-[var(--paper)] text-sm font-medium text-[var(--ink)] hover:bg-[var(--stone)] cursor-pointer",
									children: [/* @__PURE__ */ (0, I.jsx)(le, {
										size: 20,
										strokeWidth: 1.75,
										"aria-hidden": "true"
									}), /* @__PURE__ */ (0, I.jsx)("span", { children: y ? y.labels.helpLabel : w("widgetHelpBtn") })]
								}),
								si && je.readAloud && Sr && /* @__PURE__ */ (0, I.jsxs)("label", {
									className: "inline-flex items-center gap-2 text-xs text-[var(--muted)] cursor-pointer ml-auto",
									children: [/* @__PURE__ */ (0, I.jsx)("input", {
										type: "checkbox",
										checked: it,
										onChange: (e) => ct(e.target.checked),
										className: "w-4 h-4 accent-[var(--accent)]"
									}), /* @__PURE__ */ (0, I.jsx)("span", { children: w("widgetModeAutoReadLabel") })]
								}),
								!a && je.sayItSimply && z && z.type !== "info" && !si && /* @__PURE__ */ (0, I.jsx)(L, {
									variant: "quiet",
									size: "md",
									loading: er,
									loadingLabel: w("widgetSimplifying"),
									onClick: zr,
									children: w("widgetSimplifyBtn")
								})
							]
						}),
						nr && /* @__PURE__ */ (0, I.jsx)(dn, {
							variant: "info",
							children: /* @__PURE__ */ (0, I.jsx)("p", {
								className: "font-medium text-[var(--ink)]",
								children: nr.text
							})
						})
					]
				}),
				Hn && /* @__PURE__ */ (0, I.jsxs)("div", {
					role: "region",
					"aria-label": w("widgetHelpTitle"),
					style: { boxShadow: "var(--shadow-float)" },
					className: "fixed inset-x-0 bottom-0 z-50 md:static rounded-t-[16px] md:rounded-[10px] border border-[var(--line-strong)] bg-[var(--sand)] p-5 space-y-4 text-left max-h-[80vh] overflow-y-auto",
					children: [
						/* @__PURE__ */ (0, I.jsxs)("div", {
							className: "flex items-start justify-between gap-3",
							children: [/* @__PURE__ */ (0, I.jsx)("h3", {
								ref: $n,
								tabIndex: -1,
								className: "text-base font-semibold text-[var(--ink)] outline-none",
								children: w("widgetHelpTitle")
							}), /* @__PURE__ */ (0, I.jsxs)(L, {
								variant: "secondary",
								size: "md",
								onClick: () => {
									Un(!1), (Vn.current ?? Qn.current)?.focus();
								},
								children: [/* @__PURE__ */ (0, I.jsx)(Ne, {
									size: 16,
									strokeWidth: 1.75,
									"aria-hidden": "true"
								}), /* @__PURE__ */ (0, I.jsx)("span", { children: w("widgetHelpCloseBtn") })]
							})]
						}),
						/* @__PURE__ */ (0, I.jsxs)("div", {
							className: "p-4 rounded-[10px] border border-[var(--line)] bg-[var(--paper)] space-y-2.5 text-sm",
							children: [
								/* @__PURE__ */ (0, I.jsx)("p", {
									className: "text-[var(--ink)] leading-relaxed",
									children: li
								}),
								/* @__PURE__ */ (0, I.jsxs)("p", {
									className: "text-xs text-[var(--muted)]",
									children: [
										/* @__PURE__ */ (0, I.jsxs)("strong", {
											className: "text-[var(--ink)]",
											children: [w("widgetHelpExampleLabel"), ":"]
										}),
										" ",
										ui
									]
								}),
								/* @__PURE__ */ (0, I.jsxs)("div", {
									className: "flex flex-wrap items-center gap-2 pt-1",
									children: [/* @__PURE__ */ (0, I.jsx)(xn, {
										text: li,
										lang: T,
										serverReadAloud: xr,
										speaking: an,
										label: w("widgetReadAloud"),
										stopLabel: w("widgetStopReading"),
										onToggle: () => Tr(li, T)
									}), /* @__PURE__ */ (0, I.jsx)(L, {
										variant: "secondary",
										size: "md",
										onClick: () => Zn((e) => !e),
										children: w("widgetHelpAskPerson")
									})]
								}),
								Xn && /* @__PURE__ */ (0, I.jsx)(dn, {
									variant: "success",
									children: w("widgetHelpPartnerMessage")
								})
							]
						}),
						He && /* @__PURE__ */ (0, I.jsxs)("form", {
							onSubmit: Rr,
							className: "space-y-3",
							children: [
								/* @__PURE__ */ (0, I.jsx)(vn, {
									label: w("widgetHelpAskFieldLabel"),
									hint: w("cloudAiNotice"),
									inputProps: {
										type: "text",
										value: Wn,
										onChange: (e) => Gn(e.target.value),
										placeholder: w("widgetHelpPlaceholder")
									}
								}),
								/* @__PURE__ */ (0, I.jsx)(L, {
									type: "submit",
									variant: "primary",
									size: "md",
									loading: Kn,
									loadingLabel: w("loadingText"),
									children: w("widgetHelpAskBtn")
								}),
								Jn && /* @__PURE__ */ (0, I.jsxs)("div", {
									className: "p-3.5 rounded-[10px] border border-[var(--line)] bg-[var(--paper)] space-y-2 text-sm",
									children: [/* @__PURE__ */ (0, I.jsx)("p", {
										className: "text-[var(--ink)] leading-relaxed",
										children: Jn.explanation
									}), Jn.targetFieldId && /* @__PURE__ */ (0, I.jsx)(L, {
										variant: "secondary",
										size: "md",
										onClick: () => {
											let e = Sn(Jn.targetFieldId);
											e && (e.focus(), fe(w("widgetHelpMovedAnnouncement", { label: Jn.targetFieldLabel })));
										},
										children: w("widgetHelpTakeMeThere")
									})]
								})
							]
						})
					]
				}),
				z ? /* @__PURE__ */ (0, I.jsxs)("div", {
					className: "space-y-4",
					children: [
						(z.type === "text" || z.type === "email" || z.type === "number" || z.type === "phone") && /* @__PURE__ */ (0, I.jsx)(vn, {
							id: B(z.id),
							label: ci,
							labelLang: T,
							required: z.required,
							hint: Be && z.allowVoice !== !1 && !a ? `${w("widgetRecordingLimit")} ${Ve}` : void 0,
							error: Kr.get(B(z.id)),
							rightSlot: Be && z.allowVoice !== !1 && !a ? /* @__PURE__ */ (0, I.jsx)(Cn, {
								widgetSize: !0,
								state: Pn?.fieldKey === z.id ? "review" : jn === "listening" || jn === "processing" ? jn : "idle",
								seconds: Mn,
								onStart: () => kr(z.id, z.label[T], z.type),
								onStop: Or,
								labels: {
									speakLabel: w("widgetSpeakAnswerLabel"),
									listeningLabel: w("widgetVoiceListeningLabel"),
									processingLabel: w("widgetVoiceProcessingLabel")
								}
							}) : void 0,
							inputRef: (e) => {
								Vn.current = e;
							},
							inputProps: {
								type: z.type === "email" ? "email" : z.type === "phone" ? "tel" : "text",
								inputMode: z.type === "phone" || z.type === "number" ? "numeric" : void 0,
								disabled: a,
								value: z.type === "phone" ? Tn(String(A[z.id] ?? "")) : String(A[z.id] ?? ""),
								onChange: (e) => {
									let t = e.target.value;
									z.type === "phone" ? V(z.id, Kt(t)) : z.type === "number" ? V(z.id, t.replace(/[^\d.-]/g, "")) : V(z.id, t);
								}
							}
						}),
						(z.type === "text" || z.type === "email" || z.type === "number" || z.type === "phone") && (jn === "review" || jn === "failed") && /* @__PURE__ */ (0, I.jsx)(Cn, {
							widgetSize: !0,
							state: jn,
							transcript: Pn?.value ?? "",
							onTranscriptChange: (e) => Pn && Fn({
								...Pn,
								value: e
							}),
							onStart: () => kr(z.id, z.label[T], z.type),
							onStop: Or,
							onKeep: () => {
								Pn && (V(z.id, Pn.value), Fn(null), R("idle"));
							},
							onRetry: () => {
								Fn(null), R("idle"), kr(z.id, z.label[T], z.type);
							},
							labels: {
								keepLabel: w("widgetVoiceKeepBtn"),
								tryAgainLabel: w("widgetVoiceTryAgainBtn"),
								failedMessage: w("widgetVoiceFailedMsg"),
								transcriptLabel: w("widgetTranscriptConfirmTitle")
							}
						}),
						z.type === "yes-no" && /* @__PURE__ */ (0, I.jsxs)("div", {
							className: "space-y-3",
							children: [y ? /* @__PURE__ */ (0, I.jsx)("div", {
								className: "space-y-2.5",
								children: [{
									idx: 0,
									defEn: ut.en.yesButton,
									defAm: ut.am.yesButton
								}, {
									idx: 1,
									defEn: ut.en.noButton,
									defAm: ut.am.noButton
								}].map(({ idx: e, defEn: t, defAm: n }) => {
									let r = z.options?.[e], i = r?.label?.[T] ?? (T === "am" ? n : t), a = r?.label?.en || t;
									return /* @__PURE__ */ (0, I.jsxs)("div", {
										className: "min-h-[48px] px-3.5 py-2 rounded-[10px] border border-[var(--line-strong)] bg-[var(--paper)] flex items-center gap-3",
										children: [/* @__PURE__ */ (0, I.jsx)("span", {
											className: "w-4 h-4 rounded-full border-2 border-[var(--line-strong)] shrink-0",
											"aria-hidden": "true"
										}), /* @__PURE__ */ (0, I.jsxs)("div", {
											className: "flex-1 min-w-0 space-y-0.5",
											children: [T === "am" && !r?.label?.am?.trim() && a.trim() && /* @__PURE__ */ (0, I.jsx)("p", {
												className: "text-xs text-[var(--muted)]",
												children: y.labels.englishReference(a)
											}), /* @__PURE__ */ (0, I.jsx)("input", {
												type: "text",
												"aria-label": w("builderCanvasOptionAria", {
													num: e + 1,
													lang: T === "en" ? "English" : "አማርኛ"
												}),
												value: i,
												onChange: (t) => y.onUpdateOptionLabel?.(e, t.target.value),
												className: "w-full bg-transparent text-base font-medium text-[var(--ink)] focus:outline-2 focus:outline-[var(--accent)] rounded-[4px] px-1 -mx-1"
											})]
										})]
									}, e);
								})
							}) : /* @__PURE__ */ (0, I.jsxs)(I.Fragment, { children: [di({
								...z,
								options: [{
									value: "yes",
									label: z.options?.[0]?.label ?? {
										en: ut.en.yesButton,
										am: ut.am.yesButton
									}
								}, {
									value: "no",
									label: z.options?.[1]?.label ?? {
										en: ut.en.noButton,
										am: ut.am.noButton
									}
								}]
							}, !1), /* @__PURE__ */ (0, I.jsx)(mn, {
								name: `${pe}-${z.id}`,
								legend: ci,
								mode: "single",
								disabled: a,
								value: String(A[z.id] ?? ""),
								onChange: (e) => V(z.id, e),
								options: [{
									value: "yes",
									title: z.options?.[0]?.label[T] || w("yesButton")
								}, {
									value: "no",
									title: z.options?.[1]?.label[T] || w("noButton")
								}]
							})] }), Kr.has(B(z.id)) && /* @__PURE__ */ (0, I.jsx)("p", {
								role: "alert",
								className: "text-sm font-medium text-[var(--error)]",
								children: Kr.get(B(z.id))
							})]
						}),
						z.type === "info" && /* @__PURE__ */ (0, I.jsx)("div", {
							className: "p-4 rounded-[10px] bg-[var(--stone)] border border-[var(--line)] text-base text-[var(--ink)]",
							children: z.hint?.[T] || z.label[T]
						}),
						z.type === "consent" && /* @__PURE__ */ (0, I.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, I.jsxs)("label", {
								className: "flex items-start gap-3 p-4 rounded-[10px] bg-[var(--stone)] border border-[var(--line-strong)] cursor-pointer min-h-[56px]",
								children: [/* @__PURE__ */ (0, I.jsx)("input", {
									id: B(z.id),
									type: "checkbox",
									disabled: a,
									checked: !!A[z.id],
									onChange: (e) => V(z.id, e.target.checked),
									className: "mt-1 w-5 h-5 accent-[var(--accent)]"
								}), /* @__PURE__ */ (0, I.jsx)("span", {
									className: "text-base text-[var(--ink)] font-medium",
									children: z.label[T]
								})]
							}), Kr.has(B(z.id)) && /* @__PURE__ */ (0, I.jsx)("p", {
								role: "alert",
								className: "text-sm font-medium text-[var(--error)]",
								children: Kr.get(B(z.id))
							})]
						}),
						z.type === "date" && /* @__PURE__ */ (0, I.jsxs)("div", {
							className: "space-y-4",
							children: [/* @__PURE__ */ (0, I.jsxs)("div", {
								className: "inline-flex rounded-[6px] border border-[var(--line-strong)] bg-[var(--stone)] p-0.5",
								role: "group",
								"aria-label": w("widgetCalGroupLabel"),
								children: [/* @__PURE__ */ (0, I.jsx)("button", {
									type: "button",
									onClick: () => V("dob_calendar", "eth"),
									"aria-pressed": A.dob_calendar !== "greg",
									className: `px-3.5 min-h-[38px] rounded-[4px] text-xs font-semibold cursor-pointer ${A.dob_calendar === "greg" ? "text-[var(--muted)]" : "bg-[var(--paper)] text-[var(--ink)]"}`,
									children: w("widgetCalEth")
								}), /* @__PURE__ */ (0, I.jsx)("button", {
									type: "button",
									onClick: () => V("dob_calendar", "greg"),
									"aria-pressed": A.dob_calendar === "greg",
									className: `px-3.5 min-h-[38px] rounded-[4px] text-xs font-semibold cursor-pointer ${A.dob_calendar === "greg" ? "bg-[var(--paper)] text-[var(--ink)]" : "text-[var(--muted)]"}`,
									children: w("widgetCalGreg")
								})]
							}), A.dob_calendar === "greg" ? /* @__PURE__ */ (0, I.jsxs)("div", {
								className: "space-y-3",
								children: [
									/* @__PURE__ */ (0, I.jsxs)("div", {
										className: "grid grid-cols-1 sm:grid-cols-3 gap-3",
										children: [
											/* @__PURE__ */ (0, I.jsxs)("div", {
												className: "space-y-1",
												children: [/* @__PURE__ */ (0, I.jsx)("label", {
													htmlFor: B("dob_greg_day"),
													className: "block text-sm font-medium text-[var(--ink)]",
													children: w("widgetCalDay")
												}), /* @__PURE__ */ (0, I.jsxs)("select", {
													id: B("dob_greg_day"),
													disabled: a,
													value: String(A.dob_greg_day ?? ""),
													onChange: (e) => V("dob_greg_day", e.target.value),
													className: "w-full min-h-[48px] px-3 rounded-[6px] border border-[var(--line-strong)] bg-[var(--paper)] text-base",
													children: [/* @__PURE__ */ (0, I.jsx)("option", {
														value: "",
														children: "—"
													}), Array.from({ length: ai }, (e, t) => t + 1).map((e) => /* @__PURE__ */ (0, I.jsx)("option", {
														value: String(e),
														children: e
													}, e))]
												})]
											}),
											/* @__PURE__ */ (0, I.jsxs)("div", {
												className: "space-y-1",
												children: [/* @__PURE__ */ (0, I.jsx)("label", {
													htmlFor: B("dob_greg_month"),
													className: "block text-sm font-medium text-[var(--ink)]",
													children: w("widgetCalMonth")
												}), /* @__PURE__ */ (0, I.jsxs)("select", {
													id: B("dob_greg_month"),
													disabled: a,
													value: String(A.dob_greg_month ?? ""),
													onChange: (e) => V("dob_greg_month", e.target.value),
													className: "w-full min-h-[48px] px-3 rounded-[6px] border border-[var(--line-strong)] bg-[var(--paper)] text-base",
													children: [/* @__PURE__ */ (0, I.jsx)("option", {
														value: "",
														children: w("widgetCalChooseMonth")
													}), ht.map((e, t) => /* @__PURE__ */ (0, I.jsx)("option", {
														value: String(t + 1),
														children: e
													}, e))]
												})]
											}),
											/* @__PURE__ */ (0, I.jsxs)("div", {
												className: "space-y-1",
												children: [/* @__PURE__ */ (0, I.jsx)("label", {
													htmlFor: B("dob_greg_year"),
													className: "block text-sm font-medium text-[var(--ink)]",
													children: w("widgetCalYear")
												}), /* @__PURE__ */ (0, I.jsxs)("select", {
													id: B("dob_greg_year"),
													disabled: a,
													value: String(A.dob_greg_year ?? ""),
													onChange: (e) => V("dob_greg_year", e.target.value),
													"aria-invalid": Kr.has(B("dob_greg_year")),
													className: "w-full min-h-[48px] px-3 rounded-[6px] border border-[var(--line-strong)] bg-[var(--paper)] text-base",
													children: [/* @__PURE__ */ (0, I.jsx)("option", {
														value: "",
														children: "—"
													}), Xr.map((e) => /* @__PURE__ */ (0, I.jsx)("option", {
														value: String(e),
														children: e
													}, e))]
												})]
											})
										]
									}),
									oi && /* @__PURE__ */ (0, I.jsx)("p", {
										className: "text-sm text-[var(--muted)]",
										children: w("widgetDobThatIs", { date: At(oi, T) })
									}),
									Kr.has(B("dob_greg_year")) && /* @__PURE__ */ (0, I.jsx)("p", {
										role: "alert",
										className: "text-sm font-medium text-[var(--error)]",
										children: Kr.get(B("dob_greg_year"))
									})
								]
							}) : /* @__PURE__ */ (0, I.jsxs)("div", {
								className: "space-y-3",
								children: [
									/* @__PURE__ */ (0, I.jsxs)("div", {
										className: "grid grid-cols-1 sm:grid-cols-3 gap-3",
										children: [
											/* @__PURE__ */ (0, I.jsxs)("div", {
												className: "space-y-1",
												children: [/* @__PURE__ */ (0, I.jsx)("label", {
													htmlFor: B("dob_eth_day"),
													className: "block text-sm font-medium text-[var(--ink)]",
													children: w("widgetCalDay")
												}), /* @__PURE__ */ (0, I.jsxs)("select", {
													id: B("dob_eth_day"),
													disabled: a,
													value: String(A.dob_eth_day ?? ""),
													onChange: (e) => V("dob_eth_day", e.target.value),
													className: "w-full min-h-[48px] px-3 rounded-[6px] border border-[var(--line-strong)] bg-[var(--paper)] text-base",
													children: [/* @__PURE__ */ (0, I.jsx)("option", {
														value: "",
														children: "—"
													}), Array.from({ length: ei }, (e, t) => t + 1).map((e) => /* @__PURE__ */ (0, I.jsx)("option", {
														value: String(e),
														children: e
													}, e))]
												})]
											}),
											/* @__PURE__ */ (0, I.jsxs)("div", {
												className: "space-y-1",
												children: [/* @__PURE__ */ (0, I.jsx)("label", {
													htmlFor: B("dob_eth_month"),
													className: "block text-sm font-medium text-[var(--ink)]",
													children: w("widgetCalMonth")
												}), /* @__PURE__ */ (0, I.jsxs)("select", {
													id: B("dob_eth_month"),
													disabled: a,
													value: String(A.dob_eth_month ?? ""),
													onChange: (e) => V("dob_eth_month", e.target.value),
													className: "w-full min-h-[48px] px-3 rounded-[6px] border border-[var(--line-strong)] bg-[var(--paper)] text-base",
													children: [/* @__PURE__ */ (0, I.jsx)("option", {
														value: "",
														children: w("widgetCalChooseMonth")
													}), mt.map((e) => /* @__PURE__ */ (0, I.jsx)("option", {
														value: String(e.num),
														children: T === "am" ? e.am : e.en
													}, e.num))]
												})]
											}),
											/* @__PURE__ */ (0, I.jsxs)("div", {
												className: "space-y-1",
												children: [/* @__PURE__ */ (0, I.jsx)("label", {
													htmlFor: B("dob_eth_year"),
													className: "block text-sm font-medium text-[var(--ink)]",
													children: w("widgetCalYear")
												}), /* @__PURE__ */ (0, I.jsxs)("select", {
													id: B("dob_eth_year"),
													disabled: a,
													value: String(A.dob_eth_year ?? ""),
													onChange: (e) => V("dob_eth_year", e.target.value),
													"aria-invalid": Kr.has(B("dob_eth_year")),
													className: "w-full min-h-[48px] px-3 rounded-[6px] border border-[var(--line-strong)] bg-[var(--paper)] text-base",
													children: [/* @__PURE__ */ (0, I.jsx)("option", {
														value: "",
														children: "—"
													}), Yr.map((e) => /* @__PURE__ */ (0, I.jsx)("option", {
														value: String(e),
														children: e
													}, e))]
												})]
											})
										]
									}),
									ti && /* @__PURE__ */ (0, I.jsx)("p", {
										className: "text-sm text-[var(--muted)]",
										children: w("widgetDobThatIs", { date: Ot(ti) })
									}),
									Kr.has(B("dob_eth_year")) && /* @__PURE__ */ (0, I.jsx)("p", {
										role: "alert",
										className: "text-sm font-medium text-[var(--error)]",
										children: Kr.get(B("dob_eth_year"))
									})
								]
							})]
						}),
						(z.type === "choice" || z.type === "multichoice") && /* @__PURE__ */ (0, I.jsxs)("div", {
							className: "space-y-3",
							id: B(z.id),
							children: [y ? /* @__PURE__ */ (0, I.jsxs)("div", {
								className: "space-y-2.5",
								children: [(z.options ?? []).map((e, t) => {
									let n = e.label?.[T] ?? "", r = e.label?.en ?? "";
									return /* @__PURE__ */ (0, I.jsxs)("div", {
										className: "group min-h-[48px] px-3.5 py-2 rounded-[10px] border border-[var(--line-strong)] bg-[var(--paper)] flex items-center gap-3",
										children: [
											/* @__PURE__ */ (0, I.jsx)("span", {
												className: `w-4 h-4 border-2 border-[var(--line-strong)] shrink-0 ${z.type === "choice" ? "rounded-full" : "rounded-[4px]"}`,
												"aria-hidden": "true"
											}),
											/* @__PURE__ */ (0, I.jsxs)("div", {
												className: "flex-1 min-w-0 space-y-0.5",
												children: [T === "am" && !e.label?.am?.trim() && r.trim() && /* @__PURE__ */ (0, I.jsx)("p", {
													className: "text-xs text-[var(--muted)]",
													children: y.labels.englishReference(r)
												}), /* @__PURE__ */ (0, I.jsx)("input", {
													type: "text",
													"aria-label": w("builderCanvasOptionAria", {
														num: t + 1,
														lang: T === "en" ? "English" : "አማርኛ"
													}),
													value: n,
													onChange: (e) => y.onUpdateOptionLabel?.(t, e.target.value),
													className: "w-full bg-transparent text-base font-medium text-[var(--ink)] focus:outline-2 focus:outline-[var(--accent)] rounded-[4px] px-1 -mx-1"
												})]
											}),
											/* @__PURE__ */ (0, I.jsx)("button", {
												type: "button",
												onClick: () => y.onRemoveOption?.(t),
												"aria-label": y.labels.removeOptionAria(n || r || String(t + 1)),
												className: "min-w-[36px] min-h-[36px] rounded-[6px] inline-flex items-center justify-center text-[var(--muted)] hover:text-[var(--error)] opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 focus:opacity-100 cursor-pointer shrink-0",
												children: /* @__PURE__ */ (0, I.jsx)(Ne, {
													size: 20,
													strokeWidth: 1.75,
													"aria-hidden": "true"
												})
											})
										]
									}, `${e.value}-${t}`);
								}), /* @__PURE__ */ (0, I.jsxs)("div", {
									className: "flex items-center gap-2 pt-1 relative",
									ref: De,
									children: [
										/* @__PURE__ */ (0, I.jsxs)("button", {
											type: "button",
											onClick: () => y.onAddOption?.(),
											className: "flex-1 min-h-[44px] px-3.5 rounded-[10px] border border-dashed border-[var(--line-strong)] text-sm font-medium text-[var(--ink)] hover:bg-[var(--stone)] inline-flex items-center gap-2 cursor-pointer",
											children: [/* @__PURE__ */ (0, I.jsx)(Ce, {
												size: 20,
												strokeWidth: 1.75,
												"aria-hidden": "true"
											}), /* @__PURE__ */ (0, I.jsx)("span", { children: y.labels.addOptionBtn })]
										}),
										/* @__PURE__ */ (0, I.jsx)("button", {
											type: "button",
											"aria-label": y.labels.moreOptionsAria,
											"aria-expanded": ye,
											onClick: () => Se((e) => !e),
											className: "min-w-[44px] min-h-[44px] rounded-[10px] border border-[var(--line-strong)] bg-[var(--paper)] hover:bg-[var(--stone)] inline-flex items-center justify-center text-[var(--ink)] cursor-pointer shrink-0",
											children: /* @__PURE__ */ (0, I.jsx)(ue, {
												size: 20,
												strokeWidth: 1.75,
												"aria-hidden": "true"
											})
										}),
										ye && /* @__PURE__ */ (0, I.jsxs)("div", {
											role: "menu",
											style: { boxShadow: "var(--shadow-float)" },
											className: "absolute right-0 bottom-full mb-1.5 z-30 min-w-[200px] rounded-[10px] border border-[var(--line-strong)] bg-[var(--paper)] p-1.5 space-y-0.5",
											children: [
												/* @__PURE__ */ (0, I.jsx)("button", {
													type: "button",
													role: "menuitem",
													onClick: () => {
														Se(!1), y.onOpenPasteOptions?.();
													},
													className: "w-full text-left px-3 min-h-[40px] rounded-[6px] text-sm text-[var(--ink)] hover:bg-[var(--stone)] cursor-pointer",
													children: y.labels.pasteOptionsItem
												}),
												/* @__PURE__ */ (0, I.jsx)("button", {
													type: "button",
													role: "menuitem",
													onClick: () => {
														Se(!1), y.onAddOtherOption?.();
													},
													className: "w-full text-left px-3 min-h-[40px] rounded-[6px] text-sm text-[var(--ink)] hover:bg-[var(--stone)] cursor-pointer",
													children: y.labels.addOtherItem
												}),
												/* @__PURE__ */ (0, I.jsx)("button", {
													type: "button",
													role: "menuitem",
													onClick: () => {
														Se(!1), y.onAddPreferNotOption?.();
													},
													className: "w-full text-left px-3 min-h-[40px] rounded-[6px] text-sm text-[var(--ink)] hover:bg-[var(--stone)] cursor-pointer",
													children: y.labels.addPreferNotItem
												})
											]
										})
									]
								})]
							}) : z.options && /* @__PURE__ */ (0, I.jsxs)(I.Fragment, { children: [di(z, z.type === "multichoice"), /* @__PURE__ */ (0, I.jsx)(mn, {
								name: `${pe}-${z.id}`,
								legend: ci,
								mode: z.type === "choice" ? "single" : "multi",
								disabled: a,
								value: z.type === "choice" ? String(A[z.id] ?? "") : Array.isArray(A[z.id]) ? A[z.id] : [],
								onChange: (e) => {
									V(z.id, e), z.type === "choice" && z.id === "language" && (e === "am" || e === "en") && ce(e);
								},
								options: z.options.map((e) => ({
									value: e.value,
									title: e.label[T]
								}))
							})] }), Kr.has(B(z.id)) && /* @__PURE__ */ (0, I.jsx)("p", {
								role: "alert",
								className: "text-sm font-medium text-[var(--error)]",
								children: Kr.get(B(z.id))
							})]
						}),
						z.type === "id-routes" && (() => {
							let e = O.idRoutes.filter((e) => je.partnerReferral || e !== "partner_refer"), t = [
								{
									value: "fayda",
									label: {
										en: ut.en.heroOptFayda,
										am: ut.am.heroOptFayda
									}
								},
								{
									value: "refugee_id",
									label: {
										en: ut.en.heroOptRefugee,
										am: ut.am.heroOptRefugee
									}
								},
								{
									value: "other_document",
									label: {
										en: ut.en.heroOptOther,
										am: ut.am.heroOptOther
									}
								},
								{
									value: "partner_refer",
									label: {
										en: ut.en.heroOptPartner,
										am: ut.am.heroOptPartner
									}
								}
							].filter((t) => e.includes(t.value));
							return /* @__PURE__ */ (0, I.jsxs)("div", {
								className: "space-y-4",
								id: B(z.id),
								children: [
									di({
										...z,
										options: t
									}, !1),
									/* @__PURE__ */ (0, I.jsx)(mn, {
										name: `${pe}-id_route`,
										legend: ci,
										mode: "single",
										disabled: a,
										value: String(A.id_route ?? ""),
										onChange: (e) => V("id_route", e),
										options: t.map((e) => ({
											value: e.value,
											title: e.label[T]
										}))
									}),
									A.id_route === "other_document" && /* @__PURE__ */ (0, I.jsxs)("div", {
										className: "p-4 rounded-[10px] border border-[var(--line)] bg-[var(--stone)] space-y-3",
										children: [
											/* @__PURE__ */ (0, I.jsx)("p", {
												className: "text-sm font-medium text-[var(--ink)]",
												children: w("widgetOtherDocUploadLabel")
											}),
											/* @__PURE__ */ (0, I.jsxs)("div", {
												className: "flex flex-wrap items-center gap-3",
												children: [/* @__PURE__ */ (0, I.jsxs)("label", {
													className: "min-h-[48px] px-4 rounded-[10px] border border-[var(--ink)] bg-[var(--paper)] text-sm font-medium text-[var(--ink)] inline-flex items-center gap-2 cursor-pointer",
													children: [
														/* @__PURE__ */ (0, I.jsx)(de, {
															size: 20,
															strokeWidth: 1.75,
															"aria-hidden": "true"
														}),
														/* @__PURE__ */ (0, I.jsx)("span", { children: w("widgetOtherDocUploadLabel") }),
														/* @__PURE__ */ (0, I.jsx)("input", {
															type: "file",
															accept: "image/*,.pdf",
															disabled: a,
															onChange: (e) => {
																let t = e.target.files?.[0];
																t && V("other_doc_name", t.name);
															},
															className: "sr-only"
														})
													]
												}), /* @__PURE__ */ (0, I.jsxs)("label", {
													className: "min-h-[48px] px-4 rounded-[10px] border border-[var(--line-strong)] bg-[var(--paper)] text-sm font-medium text-[var(--ink)] inline-flex items-center gap-2 cursor-pointer",
													children: [
														/* @__PURE__ */ (0, I.jsx)(oe, {
															size: 20,
															strokeWidth: 1.75,
															"aria-hidden": "true"
														}),
														/* @__PURE__ */ (0, I.jsx)("span", { children: w("widgetOtherDocCameraLabel") }),
														/* @__PURE__ */ (0, I.jsx)("input", {
															type: "file",
															accept: "image/*",
															capture: "environment",
															disabled: a,
															onChange: (e) => {
																let t = e.target.files?.[0];
																t && V("other_doc_name", t.name);
															},
															className: "sr-only"
														})
													]
												})]
											}),
											A.other_doc_name && /* @__PURE__ */ (0, I.jsx)("p", {
												className: "text-sm text-[var(--mint-ink)] font-medium",
												children: w("widgetOtherDocSelected", { name: String(A.other_doc_name) })
											})
										]
									}),
									A.id_route === "partner_refer" && /* @__PURE__ */ (0, I.jsxs)("div", {
										className: "p-4 rounded-[10px] bg-[var(--stone)] border border-[var(--line)] space-y-4",
										children: [
											/* @__PURE__ */ (0, I.jsxs)("div", {
												className: "space-y-1.5",
												children: [/* @__PURE__ */ (0, I.jsx)("label", {
													htmlFor: B("partner_org"),
													className: "block text-sm font-medium text-[var(--ink)]",
													children: w("widgetPartnerSelectLabel")
												}), /* @__PURE__ */ (0, I.jsxs)("select", {
													id: B("partner_org"),
													disabled: a,
													value: String(A.partner_org ?? ""),
													onChange: (e) => V("partner_org", e.target.value),
													className: "w-full min-h-[48px] px-3.5 rounded-[6px] border border-[var(--line-strong)] bg-[var(--paper)] text-base",
													children: [
														/* @__PURE__ */ (0, I.jsx)("option", {
															value: "",
															children: "—"
														}),
														/* @__PURE__ */ (0, I.jsx)("option", {
															value: "addis_accessibility",
															children: w("widgetPartner1")
														}),
														/* @__PURE__ */ (0, I.jsx)("option", {
															value: "refugee_support_desk",
															children: w("widgetPartner2")
														}),
														/* @__PURE__ */ (0, I.jsx)("option", {
															value: "community_tvet",
															children: w("widgetPartner3")
														})
													]
												})]
											}),
											/* @__PURE__ */ (0, I.jsxs)("label", {
												className: "flex items-start gap-3 cursor-pointer min-h-[48px]",
												children: [/* @__PURE__ */ (0, I.jsx)("input", {
													id: B("partner_consent"),
													type: "checkbox",
													disabled: a,
													checked: !!A.partner_consent,
													onChange: (e) => V("partner_consent", e.target.checked),
													className: "mt-1 w-5 h-5 accent-[var(--accent)]"
												}), /* @__PURE__ */ (0, I.jsx)("span", {
													className: "text-sm text-[var(--ink)]",
													children: w("widgetPartnerConsent")
												})]
											}),
											/* @__PURE__ */ (0, I.jsx)(dn, {
												variant: "info",
												children: w("widgetPartnerNotice")
											})
										]
									}),
									Kr.has(B(z.id)) && /* @__PURE__ */ (0, I.jsx)("p", {
										role: "alert",
										className: "text-sm font-medium text-[var(--error)]",
										children: Kr.get(B(z.id))
									}),
									Kr.has(B("partner_consent")) && /* @__PURE__ */ (0, I.jsx)("p", {
										role: "alert",
										className: "text-sm font-medium text-[var(--error)]",
										children: Kr.get(B("partner_consent"))
									})
								]
							});
						})(),
						z.type === "support" && /* @__PURE__ */ (0, I.jsxs)("div", {
							className: "space-y-4",
							id: B(z.id),
							children: [
								di({
									...z,
									id: "support_needs"
								}, !0),
								/* @__PURE__ */ (0, I.jsx)(dn, {
									variant: "info",
									children: /* @__PURE__ */ (0, I.jsxs)("span", {
										className: "inline-flex items-center gap-2",
										children: [/* @__PURE__ */ (0, I.jsx)(_e, {
											size: 16,
											strokeWidth: 1.75,
											"aria-hidden": "true"
										}), /* @__PURE__ */ (0, I.jsx)("span", { children: w("widgetSupportNoDiagnosis") })]
									})
								}),
								/* @__PURE__ */ (0, I.jsx)(mn, {
									name: `${pe}-support_needs`,
									legend: ci,
									mode: "multi",
									disabled: a,
									value: Array.isArray(A.support_needs) ? A.support_needs : [],
									onChange: (e) => V("support_needs", e),
									options: (z.options ?? []).map((e) => ({
										value: e.value,
										title: e.label[T]
									}))
								}),
								/* @__PURE__ */ (0, I.jsx)("div", {
									className: "p-4 rounded-[10px] bg-[var(--stone)] border border-[var(--line)] space-y-3",
									children: /* @__PURE__ */ (0, I.jsxs)("div", {
										className: "flex items-center justify-between gap-3",
										children: [/* @__PURE__ */ (0, I.jsxs)("div", { children: [/* @__PURE__ */ (0, I.jsxs)("p", {
											className: "text-base font-semibold text-[var(--ink)] flex items-center gap-2",
											children: [/* @__PURE__ */ (0, I.jsx)(D, {
												size: 18,
												strokeWidth: 1.75,
												"aria-hidden": "true"
											}), /* @__PURE__ */ (0, I.jsx)("span", { children: w("widgetSupportShareToggle") })]
										}), /* @__PURE__ */ (0, I.jsx)("p", {
											className: "text-sm text-[var(--muted)] mt-0.5",
											children: A.support_share_platform ? w("widgetSupportShareExplainOn") : w("widgetSupportShareExplainOff")
										})] }), /* @__PURE__ */ (0, I.jsx)("button", {
											type: "button",
											role: "switch",
											"aria-checked": !!A.support_share_platform,
											"aria-label": w("widgetSupportShareToggle"),
											disabled: a,
											onClick: () => V("support_share_platform", !A.support_share_platform),
											className: `w-12 h-7 rounded-full p-0.5 border shrink-0 cursor-pointer mezgeb-transition ${A.support_share_platform ? "bg-[var(--accent)] border-[var(--accent)]" : "bg-[var(--paper)] border-[var(--line-strong)]"}`,
											children: /* @__PURE__ */ (0, I.jsx)("span", { className: `block w-5 h-5 rounded-full mezgeb-transition ${A.support_share_platform ? "translate-x-5 bg-[var(--paper)]" : "translate-x-0 bg-[var(--ink)]"}` })
										})]
									})
								})
							]
						}),
						z.type === "work-story" && /* @__PURE__ */ (0, I.jsxs)("div", {
							className: "space-y-4",
							children: [
								/* @__PURE__ */ (0, I.jsx)(vn, {
									id: B(z.id),
									as: "textarea",
									label: ci,
									labelLang: T,
									required: z.required,
									rightSlot: Be && z.allowVoice !== !1 && !a ? /* @__PURE__ */ (0, I.jsx)(Cn, {
										widgetSize: !0,
										state: jn === "listening" || jn === "processing" ? jn : "idle",
										seconds: Mn,
										onStart: () => kr(z.id, z.label[T], z.type),
										onStop: Or,
										labels: {
											speakLabel: w("widgetSpeakAnswerLabel"),
											listeningLabel: w("widgetVoiceListeningLabel"),
											processingLabel: w("widgetVoiceProcessingLabel")
										}
									}) : void 0,
									textareaRef: (e) => {
										Vn.current = e;
									},
									textareaProps: {
										rows: 4,
										disabled: a,
										value: String(A.work_story ?? ""),
										onChange: (e) => V("work_story", e.target.value)
									}
								}),
								Ue && !a && /* @__PURE__ */ (0, I.jsxs)("div", {
									className: "flex flex-wrap items-center justify-between gap-2",
									children: [/* @__PURE__ */ (0, I.jsx)(L, {
										variant: "secondary",
										size: "md",
										loading: ir,
										loadingLabel: w("widgetSkillsExtracting"),
										disabled: !String(A.work_story ?? "").trim(),
										disabledReason: String(A.work_story ?? "").trim() ? void 0 : w("qWorkStoryHint"),
										onClick: Br,
										children: w("widgetSkillsExtractBtn")
									}), /* @__PURE__ */ (0, I.jsx)("span", {
										className: "text-xs text-[var(--muted)]",
										children: w("cloudAiNotice")
									})]
								}),
								or.length > 0 && /* @__PURE__ */ (0, I.jsxs)("div", {
									className: "p-4 rounded-[10px] bg-[var(--lilac)] border border-[var(--accent)] space-y-3",
									children: [/* @__PURE__ */ (0, I.jsxs)("div", {
										className: "flex flex-wrap items-center justify-between gap-2",
										children: [/* @__PURE__ */ (0, I.jsx)("p", {
											className: "text-sm font-semibold text-[var(--ink)]",
											children: w("widgetSkillsSuggestedTitle")
										}), /* @__PURE__ */ (0, I.jsx)(L, {
											variant: "primary",
											size: "md",
											onClick: () => {
												let e = Array.isArray(A.skills) ? A.skills : [], t = Array.from(/* @__PURE__ */ new Set([...e, ...or.map((e) => e.name)]));
												V("skills", t), sr([]);
											},
											children: w("widgetSkillsKeepAllBtn")
										})]
									}), /* @__PURE__ */ (0, I.jsx)("div", {
										className: "flex flex-wrap gap-2",
										children: or.map((e, t) => /* @__PURE__ */ (0, I.jsxs)("div", {
											className: "inline-flex items-center gap-2 px-3 py-1.5 rounded-[6px] bg-[var(--paper)] border border-[var(--line-strong)] text-sm",
											children: [/* @__PURE__ */ (0, I.jsx)("span", {
												className: "font-medium text-[var(--ink)]",
												children: e.name
											}), /* @__PURE__ */ (0, I.jsx)(L, {
												variant: "secondary",
												size: "md",
												onClick: () => {
													let n = Array.isArray(A.skills) ? A.skills : [];
													n.includes(e.name) || V("skills", [...n, e.name]), sr((e) => e.filter((e, n) => n !== t));
												},
												children: w("widgetSkillsKeepBtn")
											})]
										}, t))
									})]
								}),
								(!Ue || ur) && /* @__PURE__ */ (0, I.jsxs)("div", {
									className: "p-4 rounded-[10px] bg-[var(--stone)] border border-[var(--line)] space-y-2.5",
									children: [/* @__PURE__ */ (0, I.jsx)("p", {
										className: "text-sm font-medium text-[var(--ink)]",
										children: w("widgetSkillsFallbackTitle")
									}), /* @__PURE__ */ (0, I.jsx)("div", {
										className: "flex flex-wrap gap-2",
										children: [
											w("optCommonSkillSales"),
											w("optCommonSkillBookkeeping"),
											w("optCommonSkillCustomer"),
											w("optCommonSkillTailoring"),
											w("optCommonSkillDigital"),
											w("optCommonSkillTeaching")
										].map((e) => {
											let t = Array.isArray(A.skills) ? A.skills : [], n = t.includes(e);
											return /* @__PURE__ */ (0, I.jsx)("button", {
												type: "button",
												disabled: a,
												"aria-pressed": n,
												onClick: () => {
													let r = n ? t.filter((t) => t !== e) : [...t, e];
													V("skills", r);
												},
												className: `px-3.5 min-h-[44px] rounded-[6px] border text-sm font-medium cursor-pointer ${n ? "bg-[var(--lilac)] border-2 border-[var(--accent)] text-[var(--ink)]" : "bg-[var(--paper)] border-[var(--line-strong)] text-[var(--ink)]"}`,
												children: n ? `✓ ${e}` : `+ ${e}`
											}, e);
										})
									})]
								}),
								Array.isArray(A.skills) && A.skills.length > 0 && /* @__PURE__ */ (0, I.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, I.jsx)("p", {
										className: "text-xs font-semibold text-[var(--muted)]",
										children: w("widgetSkillsSavedTitle")
									}), /* @__PURE__ */ (0, I.jsx)("div", {
										className: "flex flex-wrap gap-2",
										children: A.skills.map((e) => /* @__PURE__ */ (0, I.jsxs)("button", {
											type: "button",
											disabled: a,
											onClick: () => V("skills", (A.skills ?? []).filter((t) => t !== e)),
											"aria-label": w("widgetSkillsRemoveLabel", { skill: e }),
											className: "px-3 min-h-[40px] rounded-[6px] bg-[var(--lilac)] border border-[var(--accent)] text-sm font-medium text-[var(--ink)] inline-flex items-center gap-1.5 cursor-pointer",
											children: [/* @__PURE__ */ (0, I.jsx)("span", { children: e }), /* @__PURE__ */ (0, I.jsx)(Ne, {
												size: 14,
												strokeWidth: 1.75,
												"aria-hidden": "true"
											})]
										}, e))
									})]
								}),
								!a && /* @__PURE__ */ (0, I.jsxs)("div", {
									className: "flex flex-col sm:flex-row gap-2",
									children: [/* @__PURE__ */ (0, I.jsx)("input", {
										type: "text",
										value: cr,
										onChange: (e) => lr(e.target.value),
										placeholder: w("widgetSkillsAddPlaceholder"),
										"aria-label": w("widgetSkillsAddPlaceholder"),
										className: "flex-1 min-h-[48px] px-3.5 rounded-[6px] border border-[var(--line-strong)] bg-[var(--paper)] text-base"
									}), /* @__PURE__ */ (0, I.jsx)(L, {
										variant: "secondary",
										size: "lg",
										onClick: () => {
											let e = cr.trim();
											if (!e) return;
											let t = Array.isArray(A.skills) ? A.skills : [];
											t.includes(e) || V("skills", [...t, e]), lr("");
										},
										children: w("widgetSkillsAddBtn")
									})]
								})
							]
						})
					]
				}) : /* @__PURE__ */ (0, I.jsxs)("div", {
					className: "space-y-5",
					children: [
						/* @__PURE__ */ (0, I.jsxs)("div", {
							className: "flex flex-wrap items-center justify-between gap-2",
							children: [/* @__PURE__ */ (0, I.jsx)("p", {
								className: "text-sm text-[var(--muted)]",
								children: w("widgetReviewTitle")
							}), !a && !o && /* @__PURE__ */ (0, I.jsx)(L, {
								variant: "quiet",
								size: "md",
								onClick: () => {
									st(s), M(!0), fe(w("widgetDeviceClearedNotice"));
								},
								children: w("widgetClearDeviceBtn")
							})]
						}),
						Ut && /* @__PURE__ */ (0, I.jsx)(dn, {
							variant: "success",
							children: w("widgetDeviceClearedNotice")
						}),
						/* @__PURE__ */ (0, I.jsx)("dl", {
							className: "divide-y divide-[var(--line)] border-t border-b border-[var(--line)]",
							children: j.filter((e) => e.type !== "info").map((e) => {
								let t = j.findIndex((t) => t.id === e.id), n = "—";
								if (e.type === "date") {
									if (A.dob_calendar === "greg" && oi) {
										let e = Ot({
											year: ii,
											month: ri,
											day: ni
										}), t = At(oi, T);
										n = T === "am" ? `${t} (${e})` : e;
									} else A.dob_calendar !== "greg" && ti && (n = `${At({
										year: $r,
										month: Qr,
										day: Zr
									}, T)} (${Ot(ti)})`);
								} else if (e.type === "choice") {
									let t = e.options?.find((t) => t.value === A[e.id]);
									n = t ? t.label[T] : String(A[e.id] ?? "—");
								} else if (e.type === "yes-no") A[e.id] === "yes" ? n = e.options?.[0]?.label[T] || w("yesButton") : A[e.id] === "no" && (n = e.options?.[1]?.label[T] || w("noButton"));
								else if (e.type === "consent") n = A[e.id] ? w("yesButton") : w("noButton");
								else if (e.type === "phone") n = A[e.id] ? Tn(String(A[e.id])) : "—";
								else if (e.type === "id-routes") n = A.id_route ? A.id_route === "partner_refer" ? w("widgetPartnerNotice") : String(A.id_route) : "—";
								else if (e.type === "support") {
									let e = Array.isArray(A.support_needs) ? A.support_needs : [];
									n = e.length > 0 ? e.join(", ") : "—";
								} else if (e.type === "work-story") {
									let e = Array.isArray(A.skills) ? A.skills : [];
									n = e.length > 0 ? e.join(", ") : String(A.work_story || "—");
								} else Array.isArray(A[e.id]) ? n = A[e.id].join(", ") || "—" : A[e.id] && (n = String(A[e.id]));
								return /* @__PURE__ */ (0, I.jsxs)("div", {
									className: "py-3.5 flex items-start justify-between gap-4",
									children: [/* @__PURE__ */ (0, I.jsxs)("div", {
										className: "min-w-0 space-y-1",
										children: [/* @__PURE__ */ (0, I.jsx)("dt", {
											className: "text-sm font-medium text-[var(--muted)]",
											children: e.label[T]
										}), /* @__PURE__ */ (0, I.jsxs)("dd", {
											className: "text-base font-medium text-[var(--ink)] flex flex-wrap items-center gap-2",
											children: [/* @__PURE__ */ (0, I.jsx)("span", { children: n }), e.type === "support" && !A.support_share_platform && /* @__PURE__ */ (0, I.jsx)(ln, {
												variant: "neutral",
												children: w("widgetSupportPrivateBadge")
											})]
										})]
									}), /* @__PURE__ */ (0, I.jsx)(L, {
										variant: "quiet",
										size: "md",
										onClick: () => {
											kt(!0), wt(t), jr(t + 1);
										},
										children: w("widgetChange")
									})]
								}, e.id);
							})
						}),
						h && /* @__PURE__ */ (0, I.jsxs)(dn, {
							variant: "warning",
							children: [/* @__PURE__ */ (0, I.jsx)("p", {
								className: "font-semibold",
								children: w("widgetAssistedSelfConsentTitle")
							}), /* @__PURE__ */ (0, I.jsx)("p", {
								className: "text-sm mt-0.5",
								children: w("widgetAssistedSelfConsentBody")
							})]
						}),
						/* @__PURE__ */ (0, I.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, I.jsxs)("label", {
								className: "flex items-start gap-3 p-4 rounded-[10px] bg-[var(--stone)] border border-[var(--line-strong)] cursor-pointer min-h-[56px]",
								children: [/* @__PURE__ */ (0, I.jsx)("input", {
									id: B("consent_accepted"),
									type: "checkbox",
									disabled: a,
									checked: !!A.consent_accepted,
									onChange: (e) => V("consent_accepted", e.target.checked),
									className: "mt-1 w-5 h-5 accent-[var(--accent)]"
								}), /* @__PURE__ */ (0, I.jsx)("span", {
									className: "text-base text-[var(--ink)] font-medium",
									children: O.consent[T]
								})]
							}), Kr.has(B("consent_accepted")) && /* @__PURE__ */ (0, I.jsx)("p", {
								role: "alert",
								className: "text-sm font-medium text-[var(--error)]",
								children: Kr.get(B("consent_accepted"))
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, I.jsxs)("div", {
					className: "pt-4 border-t border-[var(--line)] space-y-3",
					children: [
						z && !z.required && z.skippable && z.type !== "info" && /* @__PURE__ */ (0, I.jsx)("div", {
							className: "flex justify-end",
							children: /* @__PURE__ */ (0, I.jsx)(L, {
								variant: "quiet",
								size: "md",
								onClick: Nr,
								children: w("widgetSkipQuestion")
							})
						}),
						y ? /* @__PURE__ */ (0, I.jsxs)("div", {
							className: "grid grid-cols-3 gap-3",
							children: [/* @__PURE__ */ (0, I.jsx)("button", {
								type: "button",
								"aria-disabled": "true",
								title: y.labels.disabledFooterTitle,
								onClick: (e) => e.preventDefault(),
								className: "min-h-[48px] px-4 rounded-[10px] border border-[var(--line-strong)] bg-[var(--paper)] text-sm font-medium text-[var(--muted)] cursor-not-allowed",
								children: y.labels.backLabel
							}), /* @__PURE__ */ (0, I.jsx)("button", {
								type: "button",
								"aria-disabled": "true",
								title: y.labels.disabledFooterTitle,
								onClick: (e) => e.preventDefault(),
								className: "col-span-2 min-h-[48px] px-4 rounded-[10px] border border-[var(--line-strong)] bg-[var(--stone)] text-sm font-semibold text-[var(--muted)] cursor-not-allowed",
								children: y.labels.saveLabel
							})]
						}) : /* @__PURE__ */ (0, I.jsxs)("div", {
							className: "grid grid-cols-3 gap-3",
							children: [!l && (k > 0 || Ge) && /* @__PURE__ */ (0, I.jsx)(L, {
								variant: "secondary",
								size: "lg",
								fullWidth: !0,
								onClick: () => {
									if (kt(!1), k > 0) {
										let e = k - 1;
										wt(e), jr(e + 1);
									} else Ge && Je("mode");
								},
								children: w("widgetBack")
							}), /* @__PURE__ */ (0, I.jsx)("div", {
								className: !l && (k > 0 || Ge) ? "col-span-2" : "col-span-3",
								children: /* @__PURE__ */ (0, I.jsx)(L, {
									variant: "primary",
									size: "lg",
									fullWidth: !0,
									onClick: Mr,
									children: w(l ? "saveButton" : br ? "widgetConfirm" : "widgetSaveContinue")
								})
							})]
						}),
						!a && !l && je.smsResume && /* @__PURE__ */ (0, I.jsx)("div", {
							className: "pt-1",
							children: /* @__PURE__ */ (0, I.jsxs)(L, {
								variant: "quiet",
								size: "md",
								onClick: () => {
									hr(String(A.phone ?? "")), _r(""), yr(null), pr((e) => !e);
								},
								children: [/* @__PURE__ */ (0, I.jsx)(be, {
									size: 16,
									strokeWidth: 1.75,
									"aria-hidden": "true"
								}), /* @__PURE__ */ (0, I.jsx)("span", { children: w("widgetFinishLaterSms") })]
							})
						})
					]
				}),
				fr && /* @__PURE__ */ (0, I.jsxs)("div", {
					className: "p-4 rounded-[10px] bg-[var(--stone)] border border-[var(--line)] space-y-3",
					children: [
						/* @__PURE__ */ (0, I.jsx)("p", {
							className: "text-sm font-semibold text-[var(--ink)]",
							children: w("widgetSmsModalTitle")
						}),
						/* @__PURE__ */ (0, I.jsxs)("form", {
							onSubmit: Hr,
							className: "space-y-3",
							children: [/* @__PURE__ */ (0, I.jsx)(vn, {
								id: `${pe}-sms-phone`,
								label: w("widgetSmsPhoneLabel"),
								error: gr,
								inputProps: {
									type: "tel",
									inputMode: "numeric",
									placeholder: "091 234 5678",
									value: Tn(mr),
									onChange: (e) => hr(Kt(e.target.value))
								}
							}), /* @__PURE__ */ (0, I.jsx)(L, {
								type: "submit",
								variant: "primary",
								size: "md",
								children: w("widgetSmsSendBtn")
							})]
						}),
						vr && /* @__PURE__ */ (0, I.jsx)(dn, {
							variant: "success",
							children: /* @__PURE__ */ (0, I.jsxs)("div", {
								className: "space-y-1",
								children: [/* @__PURE__ */ (0, I.jsx)("p", { children: w("widgetSmsBody") }), /* @__PURE__ */ (0, I.jsx)("a", {
									href: vr,
									className: "underline break-all font-medium text-[var(--mint-ink)]",
									style: { fontFamily: "var(--font-mono)" },
									children: vr
								})]
							})
						})
					]
				})
			]
		})
	});
}
// src/embed.tsx
var R = "/*! tailwindcss v4.3.5 | MIT License | https://tailwindcss.com */\n@layer properties{@supports (((-webkit-hyphens:none)) and (not (margin-trim:block))) or ((-moz-orient:inline) and (not (color:rgb(from red r g b)))){*,:before,:after,::backdrop{--tw-translate-x:0;--tw-translate-y:0;--tw-translate-z:0;--tw-rotate-x:initial;--tw-rotate-y:initial;--tw-rotate-z:initial;--tw-skew-x:initial;--tw-skew-y:initial;--tw-scroll-snap-strictness:proximity;--tw-space-y-reverse:0;--tw-space-x-reverse:0;--tw-divide-y-reverse:0;--tw-border-style:solid;--tw-gradient-position:initial;--tw-gradient-from:#0000;--tw-gradient-via:#0000;--tw-gradient-to:#0000;--tw-gradient-stops:initial;--tw-gradient-via-stops:initial;--tw-gradient-from-position:0%;--tw-gradient-via-position:50%;--tw-gradient-to-position:100%;--tw-leading:initial;--tw-font-weight:initial;--tw-tracking:initial;--tw-ordinal:initial;--tw-slashed-zero:initial;--tw-numeric-figure:initial;--tw-numeric-spacing:initial;--tw-numeric-fraction:initial;--tw-shadow:0 0 #0000;--tw-shadow-color:initial;--tw-shadow-alpha:100%;--tw-inset-shadow:0 0 #0000;--tw-inset-shadow-color:initial;--tw-inset-shadow-alpha:100%;--tw-ring-color:initial;--tw-ring-shadow:0 0 #0000;--tw-inset-ring-color:initial;--tw-inset-ring-shadow:0 0 #0000;--tw-ring-inset:initial;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-offset-shadow:0 0 #0000;--tw-outline-style:solid;--tw-blur:initial;--tw-brightness:initial;--tw-contrast:initial;--tw-grayscale:initial;--tw-hue-rotate:initial;--tw-invert:initial;--tw-opacity:initial;--tw-saturate:initial;--tw-sepia:initial;--tw-drop-shadow:initial;--tw-drop-shadow-color:initial;--tw-drop-shadow-alpha:100%;--tw-drop-shadow-size:initial;--tw-backdrop-blur:initial;--tw-backdrop-brightness:initial;--tw-backdrop-contrast:initial;--tw-backdrop-grayscale:initial;--tw-backdrop-hue-rotate:initial;--tw-backdrop-invert:initial;--tw-backdrop-opacity:initial;--tw-backdrop-saturate:initial;--tw-backdrop-sepia:initial;--tw-duration:initial;--tw-ease:initial;--tw-content:\"\";--tw-scale-x:1;--tw-scale-y:1;--tw-scale-z:1;--tw-divide-x-reverse:0}}}@layer theme{:root,:host{--font-sans:-apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", \"Noto Sans\", Arial, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\", \"Noto Color Emoji\";--font-mono:ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, \"Liberation Mono\", \"Courier New\", monospace;--color-amber-50:oklch(98.7% .022 95.277);--color-amber-300:oklch(87.9% .169 91.605);--color-amber-500:oklch(76.9% .188 70.08);--color-amber-600:oklch(66.6% .179 58.318);--color-amber-700:oklch(55.5% .163 48.998);--color-emerald-50:oklch(97.9% .021 166.113);--color-emerald-200:oklch(90.5% .093 164.15);--color-emerald-300:oklch(84.5% .143 164.978);--color-emerald-400:oklch(76.5% .177 163.223);--color-emerald-500:oklch(69.6% .17 162.48);--color-emerald-700:oklch(50.8% .118 165.612);--color-purple-900:oklch(38.1% .176 304.987);--color-rose-600:oklch(58.6% .253 17.585);--color-slate-50:oklch(98.4% .003 247.858);--color-slate-100:oklch(96.8% .007 247.896);--color-slate-200:oklch(92.9% .013 255.508);--color-slate-300:oklch(86.9% .022 252.894);--color-slate-400:oklch(70.4% .04 256.788);--color-slate-500:oklch(55.4% .046 257.417);--color-slate-600:oklch(44.6% .043 257.281);--color-slate-900:oklch(20.8% .042 265.755);--color-stone-400:oklch(70.9% .01 56.259);--color-black:#000;--color-white:#fff;--spacing:.25rem;--container-xs:20rem;--container-sm:24rem;--container-md:28rem;--container-lg:32rem;--container-xl:36rem;--container-2xl:42rem;--container-3xl:48rem;--container-4xl:56rem;--container-5xl:64rem;--container-6xl:72rem;--container-7xl:80rem;--text-xs:.75rem;--text-xs--line-height:calc(1 / .75);--text-sm:.875rem;--text-sm--line-height:calc(1.25 / .875);--text-base:1rem;--text-base--line-height:calc(1.5 / 1);--text-lg:1.125rem;--text-lg--line-height:calc(1.75 / 1.125);--text-xl:1.25rem;--text-xl--line-height:calc(1.75 / 1.25);--text-2xl:1.5rem;--text-2xl--line-height:calc(2 / 1.5);--text-3xl:1.875rem;--text-3xl--line-height:calc(2.25 / 1.875);--text-4xl:2.25rem;--text-4xl--line-height:calc(2.5 / 2.25);--text-5xl:3rem;--text-5xl--line-height:1;--text-6xl:3.75rem;--text-6xl--line-height:1;--font-weight-normal:400;--font-weight-medium:500;--font-weight-semibold:600;--font-weight-bold:700;--font-weight-extrabold:800;--tracking-tight:-.025em;--tracking-wide:.025em;--tracking-wider:.05em;--leading-tight:1.25;--leading-snug:1.375;--leading-normal:1.5;--leading-relaxed:1.625;--radius-sm:.25rem;--radius-md:.375rem;--radius-lg:.5rem;--radius-xl:.75rem;--radius-2xl:1rem;--ease-out:cubic-bezier(0, 0, .2, 1);--ease-in-out:cubic-bezier(.4, 0, .2, 1);--animate-spin:spin 1s linear infinite;--animate-pulse:pulse 2s cubic-bezier(.4, 0, .6, 1) infinite;--blur-sm:8px;--blur-md:12px;--default-transition-duration:.15s;--default-transition-timing-function:cubic-bezier(.4, 0, .2, 1);--default-font-family:var(--font-sans);--default-mono-font-family:var(--font-mono)}}@layer base{*,:after,:before,::backdrop{box-sizing:border-box;border:0 solid;margin:0;padding:0}::file-selector-button{box-sizing:border-box;border:0 solid;margin:0;padding:0}html,:host{-webkit-text-size-adjust:100%;tab-size:4;line-height:1.5;font-family:var(--default-font-family,-apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", \"Noto Sans\", Arial, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\", \"Noto Color Emoji\");font-feature-settings:var(--default-font-feature-settings,normal);font-variation-settings:var(--default-font-variation-settings,normal);-webkit-tap-highlight-color:transparent}hr{height:0;color:inherit;border-top-width:1px}abbr:where([title]){-webkit-text-decoration:underline dotted;text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;-webkit-text-decoration:inherit;-webkit-text-decoration:inherit;-webkit-text-decoration:inherit;-webkit-text-decoration:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,samp,pre{font-family:var(--default-mono-font-family,ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, \"Liberation Mono\", \"Courier New\", monospace);font-feature-settings:var(--default-mono-font-feature-settings,normal);font-variation-settings:var(--default-mono-font-variation-settings,normal);font-size:1em}small{font-size:80%}sub,sup{vertical-align:baseline;font-size:75%;line-height:0;position:relative}sub{bottom:-.25em}sup{top:-.5em}table{text-indent:0;border-color:inherit;border-collapse:collapse}:-moz-focusring:where(:not(iframe)){outline:auto}progress{vertical-align:baseline}summary{display:list-item}ol,ul,menu{list-style:none}img,svg,video,canvas,audio,iframe,embed,object{vertical-align:middle;display:block}img,video{max-width:100%;height:auto}button,input,select,optgroup,textarea{font:inherit;font-feature-settings:inherit;font-variation-settings:inherit;letter-spacing:inherit;color:inherit;opacity:1;background-color:#0000;border-radius:0}::file-selector-button{font:inherit;font-feature-settings:inherit;font-variation-settings:inherit;letter-spacing:inherit;color:inherit;opacity:1;background-color:#0000;border-radius:0}:where(select:is([multiple],[size])) optgroup{font-weight:bolder}:where(select:is([multiple],[size])) optgroup option{padding-inline-start:20px}::file-selector-button{margin-inline-end:4px}::placeholder{opacity:1}@supports (not ((-webkit-appearance:-apple-pay-button))) or (contain-intrinsic-size:1px){::placeholder{color:currentColor}@supports (color:color-mix(in lab, red, red)){::placeholder{color:color-mix(in oklab, currentcolor 50%, transparent)}}}textarea{resize:vertical}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-date-and-time-value{min-height:1lh;text-align:inherit}::-webkit-datetime-edit{display:inline-flex}::-webkit-datetime-edit-fields-wrapper{padding:0}::-webkit-datetime-edit{padding-block:0}::-webkit-datetime-edit-year-field{padding-block:0}::-webkit-datetime-edit-month-field{padding-block:0}::-webkit-datetime-edit-day-field{padding-block:0}::-webkit-datetime-edit-hour-field{padding-block:0}::-webkit-datetime-edit-minute-field{padding-block:0}::-webkit-datetime-edit-second-field{padding-block:0}::-webkit-datetime-edit-millisecond-field{padding-block:0}::-webkit-datetime-edit-meridiem-field{padding-block:0}::-webkit-calendar-picker-indicator{line-height:1}:-moz-ui-invalid{box-shadow:none}button,input:where([type=button],[type=reset],[type=submit]){appearance:button}::file-selector-button{appearance:button}::-webkit-inner-spin-button{height:auto}::-webkit-outer-spin-button{height:auto}[hidden]:where(:not([hidden=until-found])){display:none!important}:host{all:initial;font-family:var(--font-sans);color:var(--ink);text-align:left;-webkit-font-smoothing:antialiased;font-size:16px;line-height:1.6;display:block}:host [lang=am],:host [lang=am] p,:host [lang=am] li,:host [lang=am] label,:host [lang=am] input,:host [lang=am] textarea,:host [lang=am] select,:host [lang=am] button{font-family:Noto Sans Ethiopic,Nyala,Ebrima,Inter,system-ui,sans-serif;line-height:1.75}:host label,:host input,:host textarea,:host select,:host button{white-space:normal;max-width:100%}}@layer components;@layer utilities{.pointer-events-auto{pointer-events:auto}.pointer-events-none{pointer-events:none}.collapse{visibility:collapse}.invisible{visibility:hidden}.visible{visibility:visible}.sr-only{clip-path:inset(50%);white-space:nowrap;border-width:0;width:1px;height:1px;margin:-1px;padding:0;position:absolute;overflow:hidden}.absolute{position:absolute}.fixed{position:fixed}.relative{position:relative}.static{position:static}.sticky{position:sticky}.inset-0{inset:0}.inset-x-0{inset-inline:0}.inset-y-0{inset-block:0}.-top-2{top:calc(var(--spacing) * -2)}.top-0{top:0}.top-1\\/2{top:50%}.top-2{top:calc(var(--spacing) * 2)}.top-3{top:calc(var(--spacing) * 3)}.top-4{top:calc(var(--spacing) * 4)}.top-8{top:calc(var(--spacing) * 8)}.top-9{top:calc(var(--spacing) * 9)}.top-14{top:calc(var(--spacing) * 14)}.top-16{top:calc(var(--spacing) * 16)}.top-24{top:calc(var(--spacing) * 24)}.top-full{top:100%}.right-0{right:0}.right-1{right:var(--spacing)}.right-3{right:calc(var(--spacing) * 3)}.right-3\\.5{right:calc(var(--spacing) * 3.5)}.right-4{right:calc(var(--spacing) * 4)}.right-6{right:calc(var(--spacing) * 6)}.bottom-0{bottom:0}.bottom-1{bottom:var(--spacing)}.bottom-2{bottom:calc(var(--spacing) * 2)}.bottom-4{bottom:calc(var(--spacing) * 4)}.bottom-5{bottom:calc(var(--spacing) * 5)}.bottom-full{bottom:100%}.left-0{left:0}.left-3{left:calc(var(--spacing) * 3)}.left-4{left:calc(var(--spacing) * 4)}.left-\\[15px\\]{left:15px}.z-0{z-index:0}.z-10{z-index:10}.z-20{z-index:20}.z-30{z-index:30}.z-40{z-index:40}.z-50{z-index:50}.order-1{order:1}.order-2{order:2}.order-first{order:-9999}.col-span-1{grid-column:span 1/span 1}.col-span-2{grid-column:span 2/span 2}.col-span-3{grid-column:span 3/span 3}.col-start-1{grid-column-start:1}.row-start-1{grid-row-start:1}.container{width:100%}@media (width>=40rem){.container{max-width:40rem}}@media (width>=48rem){.container{max-width:48rem}}@media (width>=64rem){.container{max-width:64rem}}@media (width>=80rem){.container{max-width:80rem}}@media (width>=96rem){.container{max-width:96rem}}.-m-2{margin:calc(var(--spacing) * -2)}.-m-4{margin:calc(var(--spacing) * -4)}.m-0{margin:0}.m-3{margin:calc(var(--spacing) * 3)}.m-auto{margin:auto}.-mx-1{margin-inline:calc(var(--spacing) * -1)}.-mx-1\\.5{margin-inline:calc(var(--spacing) * -1.5)}.-mx-4{margin-inline:calc(var(--spacing) * -4)}.mx-1{margin-inline:var(--spacing)}.mx-4{margin-inline:calc(var(--spacing) * 4)}.mx-auto{margin-inline:auto}.my-1{margin-block:var(--spacing)}.my-auto{margin-block:auto}.-mt-\\[11vw\\]{margin-top:-11vw}.mt-0{margin-top:0}.mt-0\\.5{margin-top:calc(var(--spacing) * .5)}.mt-1{margin-top:var(--spacing)}.mt-1\\.5{margin-top:calc(var(--spacing) * 1.5)}.mt-2{margin-top:calc(var(--spacing) * 2)}.mt-2\\.5{margin-top:calc(var(--spacing) * 2.5)}.mt-3{margin-top:calc(var(--spacing) * 3)}.mt-3\\.5{margin-top:calc(var(--spacing) * 3.5)}.mt-4{margin-top:calc(var(--spacing) * 4)}.mt-5{margin-top:calc(var(--spacing) * 5)}.mt-6{margin-top:calc(var(--spacing) * 6)}.mt-8{margin-top:calc(var(--spacing) * 8)}.mt-10{margin-top:calc(var(--spacing) * 10)}.mt-12{margin-top:calc(var(--spacing) * 12)}.mt-14{margin-top:calc(var(--spacing) * 14)}.mt-16{margin-top:calc(var(--spacing) * 16)}.mt-20{margin-top:calc(var(--spacing) * 20)}.mt-\\[10px\\]{margin-top:10px}.mt-\\[14px\\]{margin-top:14px}.mt-\\[160px\\]{margin-top:160px}.mt-auto{margin-top:auto}.mt-px{margin-top:1px}.mr-2{margin-right:calc(var(--spacing) * 2)}.-mb-6{margin-bottom:calc(var(--spacing) * -6)}.-mb-\\[4vw\\]{margin-bottom:-4vw}.-mb-px{margin-bottom:-1px}.mb-0\\.5{margin-bottom:calc(var(--spacing) * .5)}.mb-1{margin-bottom:var(--spacing)}.mb-1\\.5{margin-bottom:calc(var(--spacing) * 1.5)}.mb-2{margin-bottom:calc(var(--spacing) * 2)}.mb-2\\.5{margin-bottom:calc(var(--spacing) * 2.5)}.mb-3{margin-bottom:calc(var(--spacing) * 3)}.mb-3\\.5{margin-bottom:calc(var(--spacing) * 3.5)}.mb-4{margin-bottom:calc(var(--spacing) * 4)}.mb-5{margin-bottom:calc(var(--spacing) * 5)}.mb-6{margin-bottom:calc(var(--spacing) * 6)}.mb-8{margin-bottom:calc(var(--spacing) * 8)}.mb-10{margin-bottom:calc(var(--spacing) * 10)}.mb-12{margin-bottom:calc(var(--spacing) * 12)}.mb-16{margin-bottom:calc(var(--spacing) * 16)}.-ml-0{margin-left:0}.-ml-0\\.5{margin-left:calc(var(--spacing) * -.5)}.ml-0\\.5{margin-left:calc(var(--spacing) * .5)}.ml-1{margin-left:var(--spacing)}.ml-1\\.5{margin-left:calc(var(--spacing) * 1.5)}.ml-2{margin-left:calc(var(--spacing) * 2)}.ml-3{margin-left:calc(var(--spacing) * 3)}.ml-4{margin-left:calc(var(--spacing) * 4)}.ml-auto{margin-left:auto}.line-clamp-2{-webkit-line-clamp:2;-webkit-box-orient:vertical;display:-webkit-box;overflow:hidden}.line-clamp-3{-webkit-line-clamp:3;-webkit-box-orient:vertical;display:-webkit-box;overflow:hidden}.block{display:block}.contents{display:contents}.flex{display:flex}.grid{display:grid}.hidden{display:none}.inline{display:inline}.inline-block{display:inline-block}.inline-flex{display:inline-flex}.inline-grid{display:inline-grid}.table{display:table}.\\!h-11{height:calc(var(--spacing) * 11)!important}.h-0\\.5{height:calc(var(--spacing) * .5)}.h-1{height:var(--spacing)}.h-1\\.5{height:calc(var(--spacing) * 1.5)}.h-2{height:calc(var(--spacing) * 2)}.h-2\\.5{height:calc(var(--spacing) * 2.5)}.h-3{height:calc(var(--spacing) * 3)}.h-3\\.5{height:calc(var(--spacing) * 3.5)}.h-4{height:calc(var(--spacing) * 4)}.h-5{height:calc(var(--spacing) * 5)}.h-6{height:calc(var(--spacing) * 6)}.h-7{height:calc(var(--spacing) * 7)}.h-8{height:calc(var(--spacing) * 8)}.h-9{height:calc(var(--spacing) * 9)}.h-10{height:calc(var(--spacing) * 10)}.h-11{height:calc(var(--spacing) * 11)}.h-12{height:calc(var(--spacing) * 12)}.h-14{height:calc(var(--spacing) * 14)}.h-16{height:calc(var(--spacing) * 16)}.h-20{height:calc(var(--spacing) * 20)}.h-36{height:calc(var(--spacing) * 36)}.h-40{height:calc(var(--spacing) * 40)}.h-48{height:calc(var(--spacing) * 48)}.h-64{height:calc(var(--spacing) * 64)}.h-\\[3px\\]{height:3px}.h-\\[8px\\]{height:8px}.h-\\[9px\\]{height:9px}.h-\\[11px\\]{height:11px}.h-\\[12px\\]{height:12px}.h-\\[14px\\]{height:14px}.h-\\[15px\\]{height:15px}.h-\\[16px\\]{height:16px}.h-\\[18px\\]{height:18px}.h-\\[19px\\]{height:19px}.h-\\[20px\\]{height:20px}.h-\\[22px\\]{height:22px}.h-\\[24px\\]{height:24px}.h-\\[26px\\]{height:26px}.h-\\[28px\\]{height:28px}.h-\\[30px\\]{height:30px}.h-\\[32px\\]{height:32px}.h-\\[34px\\]{height:34px}.h-\\[35px\\]{height:35px}.h-\\[38px\\]{height:38px}.h-\\[40px\\]{height:40px}.h-\\[45px\\]{height:45px}.h-\\[48px\\]{height:48px}.h-\\[50px\\]{height:50px}.h-\\[55px\\]{height:55px}.h-\\[60px\\]{height:60px}.h-\\[65px\\]{height:65px}.h-\\[70px\\]{height:70px}.h-\\[75px\\]{height:75px}.h-\\[80px\\]{height:80px}.h-\\[85px\\]{height:85px}.h-\\[90px\\]{height:90px}.h-\\[95px\\]{height:95px}.h-\\[98px\\]{height:98px}.h-\\[100dvh\\]{height:100dvh}.h-\\[105px\\]{height:105px}.h-\\[110px\\]{height:110px}.h-\\[115px\\]{height:115px}.h-\\[120px\\]{height:120px}.h-\\[125px\\]{height:125px}.h-\\[130px\\]{height:130px}.h-\\[135px\\]{height:135px}.h-\\[180px\\]{height:180px}.h-\\[440px\\]{height:440px}.h-\\[630px\\]{height:630px}.h-full{height:100%}.h-px{height:1px}.h-screen{height:100vh}.max-h-48{max-height:calc(var(--spacing) * 48)}.max-h-64{max-height:calc(var(--spacing) * 64)}.max-h-96{max-height:calc(var(--spacing) * 96)}.max-h-\\[40vh\\]{max-height:40vh}.max-h-\\[80vh\\]{max-height:80vh}.max-h-\\[88vh\\]{max-height:88vh}.max-h-\\[90vh\\]{max-height:90vh}.max-h-\\[560px\\]{max-height:560px}.max-h-none{max-height:none}.\\!min-h-\\[34px\\]{min-height:34px!important}.\\!min-h-\\[36px\\]{min-height:36px!important}.\\!min-h-\\[38px\\]{min-height:38px!important}.\\!min-h-\\[40px\\]{min-height:40px!important}.min-h-0{min-height:0}.min-h-\\[30px\\]{min-height:30px}.min-h-\\[32px\\]{min-height:32px}.min-h-\\[34px\\]{min-height:34px}.min-h-\\[36px\\]{min-height:36px}.min-h-\\[38px\\]{min-height:38px}.min-h-\\[40px\\]{min-height:40px}.min-h-\\[42px\\]{min-height:42px}.min-h-\\[44px\\]{min-height:44px}.min-h-\\[48px\\]{min-height:48px}.min-h-\\[52px\\]{min-height:52px}.min-h-\\[56px\\]{min-height:56px}.min-h-\\[75vh\\]{min-height:75vh}.min-h-\\[80vh\\]{min-height:80vh}.min-h-\\[104px\\]{min-height:104px}.min-h-\\[120px\\]{min-height:120px}.min-h-\\[400px\\]{min-height:400px}.min-h-\\[420px\\]{min-height:420px}.min-h-\\[460px\\]{min-height:460px}.min-h-\\[520px\\]{min-height:520px}.min-h-\\[calc\\(100vh-64px\\)\\]{min-height:calc(100vh - 64px)}.min-h-full{min-height:100%}.min-h-screen{min-height:100vh}.\\!w-11{width:calc(var(--spacing) * 11)!important}.\\!w-auto{width:auto!important}.w-1{width:var(--spacing)}.w-1\\.5{width:calc(var(--spacing) * 1.5)}.w-1\\/3{width:33.3333%}.w-2{width:calc(var(--spacing) * 2)}.w-2\\.5{width:calc(var(--spacing) * 2.5)}.w-2\\/3{width:66.6667%}.w-3{width:calc(var(--spacing) * 3)}.w-3\\.5{width:calc(var(--spacing) * 3.5)}.w-4{width:calc(var(--spacing) * 4)}.w-5{width:calc(var(--spacing) * 5)}.w-6{width:calc(var(--spacing) * 6)}.w-7{width:calc(var(--spacing) * 7)}.w-8{width:calc(var(--spacing) * 8)}.w-9{width:calc(var(--spacing) * 9)}.w-10{width:calc(var(--spacing) * 10)}.w-11{width:calc(var(--spacing) * 11)}.w-12{width:calc(var(--spacing) * 12)}.w-14{width:calc(var(--spacing) * 14)}.w-16{width:calc(var(--spacing) * 16)}.w-20{width:calc(var(--spacing) * 20)}.w-28{width:calc(var(--spacing) * 28)}.w-32{width:calc(var(--spacing) * 32)}.w-44{width:calc(var(--spacing) * 44)}.w-48{width:calc(var(--spacing) * 48)}.w-56{width:calc(var(--spacing) * 56)}.w-60{width:calc(var(--spacing) * 60)}.w-64{width:calc(var(--spacing) * 64)}.w-96{width:calc(var(--spacing) * 96)}.w-\\[1px\\]{width:1px}.w-\\[2px\\]{width:2px}.w-\\[3px\\]{width:3px}.w-\\[48px\\]{width:48px}.w-\\[220px\\]{width:220px}.w-\\[280px\\]{width:280px}.w-\\[300px\\]{width:300px}.w-\\[320px\\]{width:320px}.w-\\[420px\\]{width:420px}.w-\\[440px\\]{width:440px}.w-\\[calc\\(100\\%-24px\\)\\]{width:calc(100% - 24px)}.w-full{width:100%}.w-px{width:1px}.w-screen{width:100vw}.max-w-2xl{max-width:var(--container-2xl)}.max-w-3xl{max-width:var(--container-3xl)}.max-w-4xl{max-width:var(--container-4xl)}.max-w-5xl{max-width:var(--container-5xl)}.max-w-6xl{max-width:var(--container-6xl)}.max-w-7xl{max-width:var(--container-7xl)}.max-w-\\[34ch\\]{max-width:34ch}.max-w-\\[40ch\\]{max-width:40ch}.max-w-\\[52ch\\]{max-width:52ch}.max-w-\\[60ch\\]{max-width:60ch}.max-w-\\[62ch\\]{max-width:62ch}.max-w-\\[64ch\\]{max-width:64ch}.max-w-\\[68ch\\]{max-width:68ch}.max-w-\\[80\\%\\]{max-width:80%}.max-w-\\[110px\\]{max-width:110px}.max-w-\\[240px\\]{max-width:240px}.max-w-\\[280px\\]{max-width:280px}.max-w-\\[300px\\]{max-width:300px}.max-w-\\[340px\\]{max-width:340px}.max-w-\\[380px\\]{max-width:380px}.max-w-\\[390px\\]{max-width:390px}.max-w-\\[400px\\]{max-width:400px}.max-w-\\[444px\\]{max-width:444px}.max-w-\\[560px\\]{max-width:560px}.max-w-\\[640px\\]{max-width:640px}.max-w-\\[680px\\]{max-width:680px}.max-w-\\[720px\\]{max-width:720px}.max-w-\\[760px\\]{max-width:760px}.max-w-\\[820px\\]{max-width:820px}.max-w-\\[880px\\]{max-width:880px}.max-w-\\[1000px\\]{max-width:1000px}.max-w-\\[1120px\\]{max-width:1120px}.max-w-\\[1160px\\]{max-width:1160px}.max-w-\\[1200px\\]{max-width:1200px}.max-w-\\[1240px\\]{max-width:1240px}.max-w-\\[1440px\\]{max-width:1440px}.max-w-\\[calc\\(100vw-32px\\)\\]{max-width:calc(100vw - 32px)}.max-w-full{max-width:100%}.max-w-lg{max-width:var(--container-lg)}.max-w-md{max-width:var(--container-md)}.max-w-none{max-width:none}.max-w-sm{max-width:var(--container-sm)}.max-w-xl{max-width:var(--container-xl)}.max-w-xs{max-width:var(--container-xs)}.min-w-0{min-width:0}.min-w-\\[20px\\]{min-width:20px}.min-w-\\[36px\\]{min-width:36px}.min-w-\\[40px\\]{min-width:40px}.min-w-\\[44px\\]{min-width:44px}.min-w-\\[68px\\]{min-width:68px}.min-w-\\[110px\\]{min-width:110px}.min-w-\\[200px\\]{min-width:200px}.min-w-\\[220px\\]{min-width:220px}.min-w-\\[230px\\]{min-width:230px}.min-w-\\[760px\\]{min-width:760px}.flex-1{flex:1}.flex-shrink-0,.shrink-0{flex-shrink:0}.grow{flex-grow:1}.basis-full{flex-basis:100%}.border-collapse{border-collapse:collapse}.-translate-x-4{--tw-translate-x:calc(var(--spacing) * -4);translate:var(--tw-translate-x) var(--tw-translate-y)}.translate-x-0{--tw-translate-x:0px;translate:var(--tw-translate-x) var(--tw-translate-y)}.translate-x-5{--tw-translate-x:calc(var(--spacing) * 5);translate:var(--tw-translate-x) var(--tw-translate-y)}.translate-x-6{--tw-translate-x:calc(var(--spacing) * 6);translate:var(--tw-translate-x) var(--tw-translate-y)}.translate-x-12{--tw-translate-x:calc(var(--spacing) * 12);translate:var(--tw-translate-x) var(--tw-translate-y)}.-translate-y-1\\/2{--tw-translate-y:calc(calc(1 / 2 * 100%) * -1);translate:var(--tw-translate-x) var(--tw-translate-y)}.translate-y-2{--tw-translate-y:calc(var(--spacing) * 2);translate:var(--tw-translate-x) var(--tw-translate-y)}.rotate-180{rotate:180deg}.transform{transform:var(--tw-rotate-x, ) var(--tw-rotate-y, ) var(--tw-rotate-z, ) var(--tw-skew-x, ) var(--tw-skew-y, )}.animate-pulse{animation:var(--animate-pulse)}.animate-spin{animation:var(--animate-spin)}.cursor-default{cursor:default}.cursor-grab{cursor:grab}.cursor-not-allowed{cursor:not-allowed}.cursor-pointer{cursor:pointer}.cursor-text{cursor:text}.resize{resize:both}.resize-none{resize:none}.resize-y{resize:vertical}.snap-x{scroll-snap-type:x var(--tw-scroll-snap-strictness)}.snap-mandatory{--tw-scroll-snap-strictness:mandatory}.snap-start{scroll-snap-align:start}.scroll-mt-4{scroll-margin-top:calc(var(--spacing) * 4)}.scroll-mt-20{scroll-margin-top:calc(var(--spacing) * 20)}.scroll-mt-24{scroll-margin-top:calc(var(--spacing) * 24)}.list-disc{list-style-type:disc}.list-none{list-style-type:none}.appearance-none{appearance:none}.grid-cols-1{grid-template-columns:repeat(1,minmax(0,1fr))}.grid-cols-2{grid-template-columns:repeat(2,minmax(0,1fr))}.grid-cols-3{grid-template-columns:repeat(3,minmax(0,1fr))}.grid-cols-\\[160px_minmax\\(0\\,1fr\\)_minmax\\(0\\,1fr\\)\\]{grid-template-columns:160px minmax(0,1fr) minmax(0,1fr)}.grid-cols-\\[minmax\\(0\\,1fr\\)_120px\\]{grid-template-columns:minmax(0,1fr) 120px}.flex-col{flex-direction:column}.flex-col-reverse{flex-direction:column-reverse}.flex-wrap{flex-wrap:wrap}.place-items-center{place-items:center}.items-baseline{align-items:baseline}.items-center{align-items:center}.items-end{align-items:flex-end}.items-start{align-items:flex-start}.items-stretch{align-items:stretch}.justify-between{justify-content:space-between}.justify-center{justify-content:center}.justify-end{justify-content:flex-end}.justify-start{justify-content:flex-start}.gap-1{gap:var(--spacing)}.gap-1\\.5{gap:calc(var(--spacing) * 1.5)}.gap-2{gap:calc(var(--spacing) * 2)}.gap-2\\.5{gap:calc(var(--spacing) * 2.5)}.gap-3{gap:calc(var(--spacing) * 3)}.gap-4{gap:calc(var(--spacing) * 4)}.gap-5{gap:calc(var(--spacing) * 5)}.gap-6{gap:calc(var(--spacing) * 6)}.gap-7{gap:calc(var(--spacing) * 7)}.gap-8{gap:calc(var(--spacing) * 8)}.gap-10{gap:calc(var(--spacing) * 10)}.gap-12{gap:calc(var(--spacing) * 12)}.gap-\\[2px\\]{gap:2px}.gap-\\[3px\\]{gap:3px}.gap-\\[20px\\]{gap:20px}:where(.space-y-0>:not(:last-child)){--tw-space-y-reverse:0;margin-block:0}:where(.space-y-0\\.5>:not(:last-child)){--tw-space-y-reverse:0;margin-block-start:calc(calc(var(--spacing) * .5) * var(--tw-space-y-reverse));margin-block-end:calc(calc(var(--spacing) * .5) * calc(1 - var(--tw-space-y-reverse)))}:where(.space-y-1>:not(:last-child)){--tw-space-y-reverse:0;margin-block-start:calc(var(--spacing) * var(--tw-space-y-reverse));margin-block-end:calc(var(--spacing) * calc(1 - var(--tw-space-y-reverse)))}:where(.space-y-1\\.5>:not(:last-child)){--tw-space-y-reverse:0;margin-block-start:calc(calc(var(--spacing) * 1.5) * var(--tw-space-y-reverse));margin-block-end:calc(calc(var(--spacing) * 1.5) * calc(1 - var(--tw-space-y-reverse)))}:where(.space-y-2>:not(:last-child)){--tw-space-y-reverse:0;margin-block-start:calc(calc(var(--spacing) * 2) * var(--tw-space-y-reverse));margin-block-end:calc(calc(var(--spacing) * 2) * calc(1 - var(--tw-space-y-reverse)))}:where(.space-y-2\\.5>:not(:last-child)){--tw-space-y-reverse:0;margin-block-start:calc(calc(var(--spacing) * 2.5) * var(--tw-space-y-reverse));margin-block-end:calc(calc(var(--spacing) * 2.5) * calc(1 - var(--tw-space-y-reverse)))}:where(.space-y-3>:not(:last-child)){--tw-space-y-reverse:0;margin-block-start:calc(calc(var(--spacing) * 3) * var(--tw-space-y-reverse));margin-block-end:calc(calc(var(--spacing) * 3) * calc(1 - var(--tw-space-y-reverse)))}:where(.space-y-4>:not(:last-child)){--tw-space-y-reverse:0;margin-block-start:calc(calc(var(--spacing) * 4) * var(--tw-space-y-reverse));margin-block-end:calc(calc(var(--spacing) * 4) * calc(1 - var(--tw-space-y-reverse)))}:where(.space-y-5>:not(:last-child)){--tw-space-y-reverse:0;margin-block-start:calc(calc(var(--spacing) * 5) * var(--tw-space-y-reverse));margin-block-end:calc(calc(var(--spacing) * 5) * calc(1 - var(--tw-space-y-reverse)))}:where(.space-y-6>:not(:last-child)){--tw-space-y-reverse:0;margin-block-start:calc(calc(var(--spacing) * 6) * var(--tw-space-y-reverse));margin-block-end:calc(calc(var(--spacing) * 6) * calc(1 - var(--tw-space-y-reverse)))}:where(.space-y-7>:not(:last-child)){--tw-space-y-reverse:0;margin-block-start:calc(calc(var(--spacing) * 7) * var(--tw-space-y-reverse));margin-block-end:calc(calc(var(--spacing) * 7) * calc(1 - var(--tw-space-y-reverse)))}:where(.space-y-8>:not(:last-child)){--tw-space-y-reverse:0;margin-block-start:calc(calc(var(--spacing) * 8) * var(--tw-space-y-reverse));margin-block-end:calc(calc(var(--spacing) * 8) * calc(1 - var(--tw-space-y-reverse)))}:where(.space-y-12>:not(:last-child)){--tw-space-y-reverse:0;margin-block-start:calc(calc(var(--spacing) * 12) * var(--tw-space-y-reverse));margin-block-end:calc(calc(var(--spacing) * 12) * calc(1 - var(--tw-space-y-reverse)))}:where(.space-y-16>:not(:last-child)){--tw-space-y-reverse:0;margin-block-start:calc(calc(var(--spacing) * 16) * var(--tw-space-y-reverse));margin-block-end:calc(calc(var(--spacing) * 16) * calc(1 - var(--tw-space-y-reverse)))}:where(.space-y-\\[10px\\]>:not(:last-child)){--tw-space-y-reverse:0;margin-block-start:calc(10px * var(--tw-space-y-reverse));margin-block-end:calc(10px * calc(1 - var(--tw-space-y-reverse)))}.gap-x-2{column-gap:calc(var(--spacing) * 2)}.gap-x-4{column-gap:calc(var(--spacing) * 4)}.gap-x-5{column-gap:calc(var(--spacing) * 5)}.gap-x-8{column-gap:calc(var(--spacing) * 8)}.gap-x-10{column-gap:calc(var(--spacing) * 10)}:where(.space-x-1\\.5>:not(:last-child)){--tw-space-x-reverse:0;margin-inline-start:calc(calc(var(--spacing) * 1.5) * var(--tw-space-x-reverse));margin-inline-end:calc(calc(var(--spacing) * 1.5) * calc(1 - var(--tw-space-x-reverse)))}:where(.space-x-\\[2px\\]>:not(:last-child)){--tw-space-x-reverse:0;margin-inline-start:calc(2px * var(--tw-space-x-reverse));margin-inline-end:calc(2px * calc(1 - var(--tw-space-x-reverse)))}:where(.space-x-\\[3px\\]>:not(:last-child)){--tw-space-x-reverse:0;margin-inline-start:calc(3px * var(--tw-space-x-reverse));margin-inline-end:calc(3px * calc(1 - var(--tw-space-x-reverse)))}.gap-y-0\\.5{row-gap:calc(var(--spacing) * .5)}.gap-y-1\\.5{row-gap:calc(var(--spacing) * 1.5)}.gap-y-2{row-gap:calc(var(--spacing) * 2)}.gap-y-4{row-gap:calc(var(--spacing) * 4)}:where(.divide-y>:not(:last-child)){--tw-divide-y-reverse:0;border-bottom-style:var(--tw-border-style);border-top-style:var(--tw-border-style);border-top-width:calc(1px * var(--tw-divide-y-reverse));border-bottom-width:calc(1px * calc(1 - var(--tw-divide-y-reverse)))}:where(.divide-\\[\\#E7E7E4\\]>:not(:last-child)){border-color:#e7e7e4}:where(.divide-\\[var\\(--line\\)\\]>:not(:last-child)){border-color:var(--line)}:where(.divide-\\[var\\(--night-line\\)\\]>:not(:last-child)){border-color:var(--night-line)}:where(.divide-white>:not(:last-child)){border-color:var(--color-white)}:where(.divide-white\\/10>:not(:last-child)){border-color:#ffffff1a}@supports (color:color-mix(in lab, red, red)){:where(.divide-white\\/10>:not(:last-child)){border-color:color-mix(in oklab, var(--color-white) 10%, transparent)}}.self-center{align-self:center}.self-end{align-self:flex-end}.self-start{align-self:flex-start}.truncate{text-overflow:ellipsis;white-space:nowrap;overflow:hidden}.overflow-auto{overflow:auto}.overflow-hidden{overflow:hidden}.overflow-visible{overflow:visible}.overflow-x-auto{overflow-x:auto}.overflow-y-auto{overflow-y:auto}.scroll-smooth{scroll-behavior:smooth}.rounded{border-radius:.25rem}.rounded-2xl{border-radius:var(--radius-2xl)}.rounded-\\[4px\\]{border-radius:4px}.rounded-\\[6px\\]{border-radius:6px}.rounded-\\[8px\\]{border-radius:8px}.rounded-\\[10px\\]{border-radius:10px}.rounded-\\[12px\\]{border-radius:12px}.rounded-\\[14px\\]{border-radius:14px}.rounded-\\[16px\\]{border-radius:16px}.rounded-\\[18px\\]{border-radius:18px}.rounded-\\[20px\\]{border-radius:20px}.rounded-\\[24px\\]{border-radius:24px}.rounded-\\[28px\\]{border-radius:28px}.rounded-\\[32px\\]{border-radius:32px}.rounded-full{border-radius:2147483647px}.rounded-lg{border-radius:var(--radius-lg)}.rounded-md{border-radius:var(--radius-md)}.rounded-xl{border-radius:var(--radius-xl)}.rounded-t-\\[16px\\]{border-top-left-radius:16px;border-top-right-radius:16px}.rounded-t-\\[28px\\]{border-top-left-radius:28px;border-top-right-radius:28px}.rounded-t-\\[40px\\]{border-top-left-radius:40px;border-top-right-radius:40px}.border{border-style:var(--tw-border-style);border-width:1px}.border-0{border-style:var(--tw-border-style);border-width:0}.border-2{border-style:var(--tw-border-style);border-width:2px}.border-y{border-block-style:var(--tw-border-style);border-block-width:1px}.border-t{border-top-style:var(--tw-border-style);border-top-width:1px}.border-r{border-right-style:var(--tw-border-style);border-right-width:1px}.border-b{border-bottom-style:var(--tw-border-style);border-bottom-width:1px}.border-b-2{border-bottom-style:var(--tw-border-style);border-bottom-width:2px}.border-l{border-left-style:var(--tw-border-style);border-left-width:1px}.border-l-2{border-left-style:var(--tw-border-style);border-left-width:2px}.border-l-4{border-left-style:var(--tw-border-style);border-left-width:4px}.border-l-\\[3px\\]{border-left-style:var(--tw-border-style);border-left-width:3px}.border-dashed{--tw-border-style:dashed;border-style:dashed}.border-none{--tw-border-style:none;border-style:none}.border-\\[\\#1F5C46\\]\\/20{border-color:oklab(42.8707% -.0707054 .0178211/.2)}.border-\\[\\#2A2A2A\\]{border-color:#2a2a2a}.border-\\[\\#3A3A3A\\]{border-color:#3a3a3a}.border-\\[\\#6A4FC4\\]{border-color:#6a4fc4}.border-\\[\\#6A4FC4\\]\\/20{border-color:oklab(51.8641% .0583195 -.164527/.2)}.border-\\[\\#262626\\]{border-color:#262626}.border-\\[\\#C8C8C4\\]{border-color:#c8c8c4}.border-\\[\\#D2D2CF\\]{border-color:#d2d2cf}.border-\\[\\#D8D2F3\\]{border-color:#d8d2f3}.border-\\[\\#E2E2DF\\]{border-color:#e2e2df}.border-\\[\\#E7E7E4\\]{border-color:#e7e7e4}.border-\\[\\#E7E7E4\\]\\/60{border-color:oklab(92.7127% -.00113857 .00384897/.6)}.border-\\[\\#EFEFEC\\]{border-color:#efefec}.border-\\[\\#F3F3F0\\]{border-color:#f3f3f0}.border-\\[var\\(--accent\\)\\],.border-\\[var\\(--accent\\)\\]\\/20{border-color:var(--accent)}@supports (color:color-mix(in lab, red, red)){.border-\\[var\\(--accent\\)\\]\\/20{border-color:color-mix(in oklab, var(--accent) 20%, transparent)}}.border-\\[var\\(--console-line\\)\\]{border-color:var(--console-line)}.border-\\[var\\(--error\\)\\]{border-color:var(--error)}.border-\\[var\\(--ink\\)\\]{border-color:var(--ink)}.border-\\[var\\(--line\\)\\]{border-color:var(--line)}.border-\\[var\\(--line-strong\\)\\]{border-color:var(--line-strong)}.border-\\[var\\(--mint-ink\\)\\]\\/20{border-color:var(--mint-ink)}@supports (color:color-mix(in lab, red, red)){.border-\\[var\\(--mint-ink\\)\\]\\/20{border-color:color-mix(in oklab, var(--mint-ink) 20%, transparent)}}.border-\\[var\\(--night-line\\)\\]{border-color:var(--night-line)}.border-\\[var\\(--warn\\)\\]{border-color:var(--warn)}.border-amber-500{border-color:var(--color-amber-500)}.border-black{border-color:var(--color-black)}.border-current{border-color:currentColor}.border-emerald-200{border-color:var(--color-emerald-200)}.border-slate-200{border-color:var(--color-slate-200)}.border-slate-200\\/80{border-color:#e2e8f0cc}@supports (color:color-mix(in lab, red, red)){.border-slate-200\\/80{border-color:color-mix(in oklab, var(--color-slate-200) 80%, transparent)}}.border-slate-200\\/90{border-color:#e2e8f0e6}@supports (color:color-mix(in lab, red, red)){.border-slate-200\\/90{border-color:color-mix(in oklab, var(--color-slate-200) 90%, transparent)}}.border-slate-300{border-color:var(--color-slate-300)}.border-slate-300\\/80{border-color:#cad5e2cc}@supports (color:color-mix(in lab, red, red)){.border-slate-300\\/80{border-color:color-mix(in oklab, var(--color-slate-300) 80%, transparent)}}.border-transparent{border-color:#0000}.border-white{border-color:var(--color-white)}.border-white\\/10{border-color:#ffffff1a}@supports (color:color-mix(in lab, red, red)){.border-white\\/10{border-color:color-mix(in oklab, var(--color-white) 10%, transparent)}}.border-white\\/15{border-color:#ffffff26}@supports (color:color-mix(in lab, red, red)){.border-white\\/15{border-color:color-mix(in oklab, var(--color-white) 15%, transparent)}}.border-white\\/70{border-color:#ffffffb3}@supports (color:color-mix(in lab, red, red)){.border-white\\/70{border-color:color-mix(in oklab, var(--color-white) 70%, transparent)}}.border-white\\/80{border-color:#fffc}@supports (color:color-mix(in lab, red, red)){.border-white\\/80{border-color:color-mix(in oklab, var(--color-white) 80%, transparent)}}.\\!bg-\\[var\\(--accent\\)\\]{background-color:var(--accent)!important}.bg-\\[\\#1F1F1F\\]{background-color:#1f1f1f}.bg-\\[\\#1F5C46\\]{background-color:#1f5c46}.bg-\\[\\#2E9E5B\\]{background-color:#2e9e5b}.bg-\\[\\#3A3A3A\\]{background-color:#3a3a3a}.bg-\\[\\#6A4FC4\\]{background-color:#6a4fc4}.bg-\\[\\#8F6FE0\\]{background-color:#8f6fe0}.bg-\\[\\#111111\\]{background-color:#111}.bg-\\[\\#111111\\]\\/40{background-color:oklab(17.7638% 3.72529e-8 -1.49012e-8/.4)}.bg-\\[\\#161616\\]{background-color:#161616}.bg-\\[\\#C9A7F5\\]{background-color:#c9a7f5}.bg-\\[\\#E4E4E1\\]{background-color:#e4e4e1}.bg-\\[\\#E4F2EC\\]{background-color:#e4f2ec}.bg-\\[\\#E7E7E4\\]{background-color:#e7e7e4}.bg-\\[\\#EDEDEA\\]{background-color:#ededea}.bg-\\[\\#EEEBF8\\]{background-color:#eeebf8}.bg-\\[\\#F0F0EE\\]{background-color:#f0f0ee}.bg-\\[\\#F5F5F3\\]{background-color:#f5f5f3}.bg-\\[\\#F9FAF9\\]{background-color:#f9faf9}.bg-\\[\\#FAF9F6\\]{background-color:#faf9f6}.bg-\\[\\#FAFAF8\\]{background-color:#fafaf8}.bg-\\[var\\(--accent\\)\\]{background-color:var(--accent)}.bg-\\[var\\(--accent-soft\\)\\]{background-color:var(--accent-soft)}.bg-\\[var\\(--console-line\\)\\]{background-color:var(--console-line)}.bg-\\[var\\(--console-paper\\)\\]{background-color:var(--console-paper)}.bg-\\[var\\(--error\\)\\]{background-color:var(--error)}.bg-\\[var\\(--error-bg\\)\\]{background-color:var(--error-bg)}.bg-\\[var\\(--ink\\)\\],.bg-\\[var\\(--ink\\)\\]\\/40{background-color:var(--ink)}@supports (color:color-mix(in lab, red, red)){.bg-\\[var\\(--ink\\)\\]\\/40{background-color:color-mix(in oklab, var(--ink) 40%, transparent)}}.bg-\\[var\\(--lilac\\)\\]{background-color:var(--lilac)}.bg-\\[var\\(--line\\)\\]{background-color:var(--line)}.bg-\\[var\\(--line-strong\\)\\]{background-color:var(--line-strong)}.bg-\\[var\\(--mint\\)\\]{background-color:var(--mint)}.bg-\\[var\\(--mint-ink\\)\\]{background-color:var(--mint-ink)}.bg-\\[var\\(--night\\)\\]{background-color:var(--night)}.bg-\\[var\\(--paper\\)\\],.bg-\\[var\\(--paper\\)\\]\\/60{background-color:var(--paper)}@supports (color:color-mix(in lab, red, red)){.bg-\\[var\\(--paper\\)\\]\\/60{background-color:color-mix(in oklab, var(--paper) 60%, transparent)}}.bg-\\[var\\(--paper\\)\\]\\/95{background-color:var(--paper)}@supports (color:color-mix(in lab, red, red)){.bg-\\[var\\(--paper\\)\\]\\/95{background-color:color-mix(in oklab, var(--paper) 95%, transparent)}}.bg-\\[var\\(--sand\\)\\]{background-color:var(--sand)}.bg-\\[var\\(--stone\\)\\],.bg-\\[var\\(--stone\\)\\]\\/50{background-color:var(--stone)}@supports (color:color-mix(in lab, red, red)){.bg-\\[var\\(--stone\\)\\]\\/50{background-color:color-mix(in oklab, var(--stone) 50%, transparent)}}.bg-\\[var\\(--stone\\)\\]\\/60{background-color:var(--stone)}@supports (color:color-mix(in lab, red, red)){.bg-\\[var\\(--stone\\)\\]\\/60{background-color:color-mix(in oklab, var(--stone) 60%, transparent)}}.bg-\\[var\\(--stone\\)\\]\\/90{background-color:var(--stone)}@supports (color:color-mix(in lab, red, red)){.bg-\\[var\\(--stone\\)\\]\\/90{background-color:color-mix(in oklab, var(--stone) 90%, transparent)}}.bg-\\[var\\(--warn-bg\\)\\]{background-color:var(--warn-bg)}.bg-\\[var\\(--widget-accent\\)\\]{background-color:var(--widget-accent)}.bg-amber-50\\/30{background-color:#fffbeb4d}@supports (color:color-mix(in lab, red, red)){.bg-amber-50\\/30{background-color:color-mix(in oklab, var(--color-amber-50) 30%, transparent)}}.bg-black{background-color:var(--color-black)}.bg-black\\/30{background-color:#0000004d}@supports (color:color-mix(in lab, red, red)){.bg-black\\/30{background-color:color-mix(in oklab, var(--color-black) 30%, transparent)}}.bg-black\\/50{background-color:#00000080}@supports (color:color-mix(in lab, red, red)){.bg-black\\/50{background-color:color-mix(in oklab, var(--color-black) 50%, transparent)}}.bg-black\\/65{background-color:#000000a6}@supports (color:color-mix(in lab, red, red)){.bg-black\\/65{background-color:color-mix(in oklab, var(--color-black) 65%, transparent)}}.bg-emerald-50{background-color:var(--color-emerald-50)}.bg-emerald-400{background-color:var(--color-emerald-400)}.bg-emerald-500{background-color:var(--color-emerald-500)}.bg-slate-100{background-color:var(--color-slate-100)}.bg-slate-300{background-color:var(--color-slate-300)}.bg-transparent{background-color:#0000}.bg-white{background-color:var(--color-white)}.bg-white\\/60{background-color:#fff9}@supports (color:color-mix(in lab, red, red)){.bg-white\\/60{background-color:color-mix(in oklab, var(--color-white) 60%, transparent)}}.bg-white\\/70{background-color:#ffffffb3}@supports (color:color-mix(in lab, red, red)){.bg-white\\/70{background-color:color-mix(in oklab, var(--color-white) 70%, transparent)}}.bg-white\\/85{background-color:#ffffffd9}@supports (color:color-mix(in lab, red, red)){.bg-white\\/85{background-color:color-mix(in oklab, var(--color-white) 85%, transparent)}}.bg-white\\/90{background-color:#ffffffe6}@supports (color:color-mix(in lab, red, red)){.bg-white\\/90{background-color:color-mix(in oklab, var(--color-white) 90%, transparent)}}.bg-gradient-to-b{--tw-gradient-position:to bottom in oklab;background-image:linear-gradient(var(--tw-gradient-stops))}.from-white{--tw-gradient-from:var(--color-white);--tw-gradient-stops:var(--tw-gradient-via-stops,var(--tw-gradient-position), var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-to) var(--tw-gradient-to-position))}.to-\\[\\#F9FAF9\\]{--tw-gradient-to:#f9faf9;--tw-gradient-stops:var(--tw-gradient-via-stops,var(--tw-gradient-position), var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-to) var(--tw-gradient-to-position))}.fill-current{fill:currentColor}.p-0{padding:0}.p-0\\.5{padding:calc(var(--spacing) * .5)}.p-1{padding:var(--spacing)}.p-1\\.5{padding:calc(var(--spacing) * 1.5)}.p-2{padding:calc(var(--spacing) * 2)}.p-2\\.5{padding:calc(var(--spacing) * 2.5)}.p-3{padding:calc(var(--spacing) * 3)}.p-3\\.5{padding:calc(var(--spacing) * 3.5)}.p-4{padding:calc(var(--spacing) * 4)}.p-5{padding:calc(var(--spacing) * 5)}.p-6{padding:calc(var(--spacing) * 6)}.p-8{padding:calc(var(--spacing) * 8)}.p-10{padding:calc(var(--spacing) * 10)}.p-\\[2px\\]{padding:2px}.p-\\[3px\\]{padding:3px}.\\!px-2{padding-inline:calc(var(--spacing) * 2)!important}.\\!px-3{padding-inline:calc(var(--spacing) * 3)!important}.px-0{padding-inline:0}.px-1{padding-inline:var(--spacing)}.px-1\\.5{padding-inline:calc(var(--spacing) * 1.5)}.px-2{padding-inline:calc(var(--spacing) * 2)}.px-2\\.5{padding-inline:calc(var(--spacing) * 2.5)}.px-3{padding-inline:calc(var(--spacing) * 3)}.px-3\\.5{padding-inline:calc(var(--spacing) * 3.5)}.px-4{padding-inline:calc(var(--spacing) * 4)}.px-5{padding-inline:calc(var(--spacing) * 5)}.px-6{padding-inline:calc(var(--spacing) * 6)}.px-8{padding-inline:calc(var(--spacing) * 8)}.py-0{padding-block:0}.py-0\\.5{padding-block:calc(var(--spacing) * .5)}.py-1{padding-block:var(--spacing)}.py-1\\.5{padding-block:calc(var(--spacing) * 1.5)}.py-2{padding-block:calc(var(--spacing) * 2)}.py-2\\.5{padding-block:calc(var(--spacing) * 2.5)}.py-3{padding-block:calc(var(--spacing) * 3)}.py-3\\.5{padding-block:calc(var(--spacing) * 3.5)}.py-4{padding-block:calc(var(--spacing) * 4)}.py-5{padding-block:calc(var(--spacing) * 5)}.py-6{padding-block:calc(var(--spacing) * 6)}.py-8{padding-block:calc(var(--spacing) * 8)}.py-10{padding-block:calc(var(--spacing) * 10)}.py-12{padding-block:calc(var(--spacing) * 12)}.py-16{padding-block:calc(var(--spacing) * 16)}.py-20{padding-block:calc(var(--spacing) * 20)}.pt-0{padding-top:0}.pt-0\\.5{padding-top:calc(var(--spacing) * .5)}.pt-1{padding-top:var(--spacing)}.pt-1\\.5{padding-top:calc(var(--spacing) * 1.5)}.pt-2{padding-top:calc(var(--spacing) * 2)}.pt-2\\.5{padding-top:calc(var(--spacing) * 2.5)}.pt-3{padding-top:calc(var(--spacing) * 3)}.pt-4{padding-top:calc(var(--spacing) * 4)}.pt-5{padding-top:calc(var(--spacing) * 5)}.pt-6{padding-top:calc(var(--spacing) * 6)}.pt-7{padding-top:calc(var(--spacing) * 7)}.pt-8{padding-top:calc(var(--spacing) * 8)}.pt-10{padding-top:calc(var(--spacing) * 10)}.pt-12{padding-top:calc(var(--spacing) * 12)}.pt-14{padding-top:calc(var(--spacing) * 14)}.pt-16{padding-top:calc(var(--spacing) * 16)}.pt-\\[3px\\]{padding-top:3px}.pt-\\[72px\\]{padding-top:72px}.pt-\\[120px\\]{padding-top:120px}.pr-1{padding-right:var(--spacing)}.pr-3{padding-right:calc(var(--spacing) * 3)}.pr-3\\.5{padding-right:calc(var(--spacing) * 3.5)}.pr-4{padding-right:calc(var(--spacing) * 4)}.pr-7{padding-right:calc(var(--spacing) * 7)}.pr-8{padding-right:calc(var(--spacing) * 8)}.pr-9{padding-right:calc(var(--spacing) * 9)}.pr-10{padding-right:calc(var(--spacing) * 10)}.pr-16{padding-right:calc(var(--spacing) * 16)}.pb-0{padding-bottom:0}.pb-1{padding-bottom:var(--spacing)}.pb-2{padding-bottom:calc(var(--spacing) * 2)}.pb-3{padding-bottom:calc(var(--spacing) * 3)}.pb-4{padding-bottom:calc(var(--spacing) * 4)}.pb-5{padding-bottom:calc(var(--spacing) * 5)}.pb-6{padding-bottom:calc(var(--spacing) * 6)}.pb-8{padding-bottom:calc(var(--spacing) * 8)}.pb-10{padding-bottom:calc(var(--spacing) * 10)}.pb-12{padding-bottom:calc(var(--spacing) * 12)}.pb-14{padding-bottom:calc(var(--spacing) * 14)}.pb-16{padding-bottom:calc(var(--spacing) * 16)}.pb-20{padding-bottom:calc(var(--spacing) * 20)}.pb-24{padding-bottom:calc(var(--spacing) * 24)}.pb-\\[120px\\]{padding-bottom:120px}.pl-1{padding-left:var(--spacing)}.pl-2{padding-left:calc(var(--spacing) * 2)}.pl-2\\.5{padding-left:calc(var(--spacing) * 2.5)}.pl-3{padding-left:calc(var(--spacing) * 3)}.pl-4{padding-left:calc(var(--spacing) * 4)}.pl-5{padding-left:calc(var(--spacing) * 5)}.pl-8{padding-left:calc(var(--spacing) * 8)}.pl-9{padding-left:calc(var(--spacing) * 9)}.pl-12{padding-left:calc(var(--spacing) * 12)}.pl-\\[38px\\]{padding-left:38px}.text-center{text-align:center}.text-left{text-align:left}.text-right{text-align:right}.align-middle{vertical-align:middle}.align-top{vertical-align:top}.font-mono{font-family:var(--font-mono)}.font-sans{font-family:var(--font-sans)}.\\!text-sm{font-size:var(--text-sm)!important;line-height:var(--tw-leading,var(--text-sm--line-height))!important}.text-2xl{font-size:var(--text-2xl);line-height:var(--tw-leading,var(--text-2xl--line-height))}.text-3xl{font-size:var(--text-3xl);line-height:var(--tw-leading,var(--text-3xl--line-height))}.text-5xl{font-size:var(--text-5xl);line-height:var(--tw-leading,var(--text-5xl--line-height))}.text-base{font-size:var(--text-base);line-height:var(--tw-leading,var(--text-base--line-height))}.text-lg{font-size:var(--text-lg);line-height:var(--tw-leading,var(--text-lg--line-height))}.text-sm{font-size:var(--text-sm);line-height:var(--tw-leading,var(--text-sm--line-height))}.text-xl{font-size:var(--text-xl);line-height:var(--tw-leading,var(--text-xl--line-height))}.text-xs{font-size:var(--text-xs);line-height:var(--tw-leading,var(--text-xs--line-height))}.text-\\[0\\.875rem\\]{font-size:.875rem}.text-\\[0\\.8125rem\\]{font-size:.8125rem}.text-\\[0\\.9375rem\\]{font-size:.9375rem}.text-\\[1\\.5rem\\]{font-size:1.5rem}.text-\\[1\\.25rem\\]{font-size:1.25rem}.text-\\[1\\.75rem\\]{font-size:1.75rem}.text-\\[1\\.125rem\\]{font-size:1.125rem}.text-\\[1\\.375rem\\]{font-size:1.375rem}.text-\\[1\\.0625rem\\]{font-size:1.0625rem}.text-\\[2\\.75rem\\]{font-size:2.75rem}.text-\\[2rem\\]{font-size:2rem}.text-\\[9px\\]{font-size:9px}.text-\\[10px\\]{font-size:10px}.text-\\[11px\\]{font-size:11px}.text-\\[12px\\]{font-size:12px}.text-\\[13px\\]{font-size:13px}.text-\\[14px\\]{font-size:14px}.text-\\[14vw\\]{font-size:14vw}.text-\\[15px\\]{font-size:15px}.text-\\[16px\\]{font-size:16px}.text-\\[17px\\]{font-size:17px}.text-\\[18px\\]{font-size:18px}.text-\\[18vw\\]{font-size:18vw}.text-\\[20px\\]{font-size:20px}.text-\\[22vw\\]{font-size:22vw}.text-\\[24px\\]{font-size:24px}.text-\\[26px\\]{font-size:26px}.text-\\[32px\\]{font-size:32px}.text-\\[36px\\]{font-size:36px}.text-\\[180px\\]{font-size:180px}.leading-8{--tw-leading:calc(var(--spacing) * 8);line-height:calc(var(--spacing) * 8)}.leading-\\[0\\.75\\]{--tw-leading:.75;line-height:.75}.leading-\\[0\\.82\\]{--tw-leading:.82;line-height:.82}.leading-\\[1\\.2\\]{--tw-leading:1.2;line-height:1.2}.leading-\\[1\\.3\\]{--tw-leading:1.3;line-height:1.3}.leading-\\[1\\.05\\]{--tw-leading:1.05;line-height:1.05}.leading-\\[1\\.6\\]{--tw-leading:1.6;line-height:1.6}.leading-\\[1\\.7\\]{--tw-leading:1.7;line-height:1.7}.leading-\\[1\\.15\\]{--tw-leading:1.15;line-height:1.15}.leading-none{--tw-leading:1;line-height:1}.leading-normal{--tw-leading:var(--leading-normal);line-height:var(--leading-normal)}.leading-relaxed{--tw-leading:var(--leading-relaxed);line-height:var(--leading-relaxed)}.leading-snug{--tw-leading:var(--leading-snug);line-height:var(--leading-snug)}.leading-tight{--tw-leading:var(--leading-tight);line-height:var(--leading-tight)}.font-bold{--tw-font-weight:var(--font-weight-bold);font-weight:var(--font-weight-bold)}.font-extrabold{--tw-font-weight:var(--font-weight-extrabold);font-weight:var(--font-weight-extrabold)}.font-medium{--tw-font-weight:var(--font-weight-medium);font-weight:var(--font-weight-medium)}.font-normal{--tw-font-weight:var(--font-weight-normal);font-weight:var(--font-weight-normal)}.font-semibold{--tw-font-weight:var(--font-weight-semibold);font-weight:var(--font-weight-semibold)}.tracking-\\[-0\\.03em\\]{--tw-tracking:-.03em;letter-spacing:-.03em}.tracking-\\[-0\\.04em\\]{--tw-tracking:-.04em;letter-spacing:-.04em}.tracking-\\[0\\.04em\\]{--tw-tracking:.04em;letter-spacing:.04em}.tracking-\\[0\\.06em\\]{--tw-tracking:.06em;letter-spacing:.06em}.tracking-tight{--tw-tracking:var(--tracking-tight);letter-spacing:var(--tracking-tight)}.tracking-wide{--tw-tracking:var(--tracking-wide);letter-spacing:var(--tracking-wide)}.tracking-wider{--tw-tracking:var(--tracking-wider);letter-spacing:var(--tracking-wider)}.break-words{overflow-wrap:break-word}.break-all{word-break:break-all}.whitespace-nowrap{white-space:nowrap}.whitespace-pre-wrap{white-space:pre-wrap}.text-\\[\\#1F5C46\\]{color:#1f5c46}.text-\\[\\#6A4FC4\\]{color:#6a4fc4}.text-\\[\\#6B6B6B\\]{color:#6b6b6b}.text-\\[\\#6B6560\\]{color:#6b6560}.text-\\[\\#9B9B9B\\]{color:#9b9b9b}.text-\\[\\#111111\\]{color:#111}.text-\\[\\#B5B5B5\\]{color:#b5b5b5}.text-\\[\\#B7E2CC\\]{color:#b7e2cc}.text-\\[\\#C8C8C4\\]{color:#c8c8c4}.text-\\[\\#C9B8F2\\]{color:#c9b8f2}.text-\\[\\#D6D6D6\\]{color:#d6d6d6}.text-\\[\\#E4F2EC\\]{color:#e4f2ec}.text-\\[var\\(--accent\\)\\]{color:var(--accent)}.text-\\[var\\(--error\\)\\]{color:var(--error)}.text-\\[var\\(--ink\\)\\]{color:var(--ink)}.text-\\[var\\(--ink-2\\)\\]{color:var(--ink-2)}.text-\\[var\\(--mint-ink\\)\\]{color:var(--mint-ink)}.text-\\[var\\(--muted\\)\\]{color:var(--muted)}.text-\\[var\\(--night-muted\\)\\]{color:var(--night-muted)}.text-\\[var\\(--night-wordmark\\)\\]{color:var(--night-wordmark)}.text-\\[var\\(--paper\\)\\]{color:var(--paper)}.text-\\[var\\(--warn\\)\\]{color:var(--warn)}.text-amber-300{color:var(--color-amber-300)}.text-amber-600{color:var(--color-amber-600)}.text-amber-700{color:var(--color-amber-700)}.text-black{color:var(--color-black)}.text-emerald-300{color:var(--color-emerald-300)}.text-emerald-400{color:var(--color-emerald-400)}.text-emerald-700{color:var(--color-emerald-700)}.text-slate-400{color:var(--color-slate-400)}.text-slate-500{color:var(--color-slate-500)}.text-slate-600{color:var(--color-slate-600)}.text-stone-400{color:var(--color-stone-400)}.text-white{color:var(--color-white)}.text-white\\/\\[0\\.06\\]{color:#ffffff0f}@supports (color:color-mix(in lab, red, red)){.text-white\\/\\[0\\.06\\]{color:color-mix(in oklab, var(--color-white) 6%, transparent)}}.lowercase{text-transform:lowercase}.uppercase{text-transform:uppercase}.italic{font-style:italic}.tabular-nums{--tw-numeric-spacing:tabular-nums;font-variant-numeric:var(--tw-ordinal, ) var(--tw-slashed-zero, ) var(--tw-numeric-figure, ) var(--tw-numeric-spacing, ) var(--tw-numeric-fraction, )}.no-underline{text-decoration-line:none}.underline{text-decoration-line:underline}.decoration-2{text-decoration-thickness:2px}.underline-offset-2{text-underline-offset:2px}.underline-offset-4{text-underline-offset:4px}.underline-offset-\\[6px\\]{text-underline-offset:6px}.antialiased{-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}.placeholder-\\[\\#6B6B6B\\]::placeholder{color:#6b6b6b}.accent-\\[var\\(--accent\\)\\]{accent-color:var(--accent)}.accent-\\[var\\(--ink\\)\\]{accent-color:var(--ink)}.opacity-0{opacity:0}.opacity-40{opacity:.4}.opacity-50{opacity:.5}.opacity-55{opacity:.55}.opacity-60{opacity:.6}.opacity-70{opacity:.7}.opacity-80{opacity:.8}.opacity-90{opacity:.9}.opacity-95{opacity:.95}.opacity-100{opacity:1}.opacity-\\[0\\.03\\]{opacity:.03}.shadow{--tw-shadow:0 1px 3px 0 var(--tw-shadow-color,#0000001a), 0 1px 2px -1px var(--tw-shadow-color,#0000001a);box-shadow:var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow)}.shadow-2xl{--tw-shadow:0 25px 50px -12px var(--tw-shadow-color,#00000040);box-shadow:var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow)}.shadow-\\[0_0_0_1px_var\\(--ink\\)\\]{--tw-shadow:0 0 0 1px var(--tw-shadow-color,var(--ink));box-shadow:var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow)}.shadow-\\[0_1px_2px_rgba\\(0\\,0\\,0\\,0\\.05\\)\\,0_10px_30px_rgba\\(0\\,0\\,0\\,0\\.08\\)\\]{--tw-shadow:0 1px 2px var(--tw-shadow-color,#0000000d), 0 10px 30px var(--tw-shadow-color,#00000014);box-shadow:var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow)}.shadow-\\[0_1px_2px_rgba\\(17\\,17\\,17\\,0\\.08\\)\\]{--tw-shadow:0 1px 2px var(--tw-shadow-color,#11111114);box-shadow:var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow)}.shadow-\\[0_24px_50px_-12px_rgba\\(20\\,32\\,27\\,0\\.12\\)\\]{--tw-shadow:0 24px 50px -12px var(--tw-shadow-color,#14201b1f);box-shadow:var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow)}.shadow-\\[var\\(--shadow-float\\)\\]{--tw-shadow:var(--shadow-float);box-shadow:var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow)}.shadow-inner{--tw-shadow:inset 0 2px 4px 0 var(--tw-shadow-color,#0000000d);box-shadow:var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow)}.shadow-lg{--tw-shadow:0 10px 15px -3px var(--tw-shadow-color,#0000001a), 0 4px 6px -4px var(--tw-shadow-color,#0000001a);box-shadow:var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow)}.shadow-md{--tw-shadow:0 4px 6px -1px var(--tw-shadow-color,#0000001a), 0 2px 4px -2px var(--tw-shadow-color,#0000001a);box-shadow:var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow)}.shadow-none{--tw-shadow:0 0 #0000;box-shadow:var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow)}.shadow-sm{--tw-shadow:0 1px 3px 0 var(--tw-shadow-color,#0000001a), 0 1px 2px -1px var(--tw-shadow-color,#0000001a);box-shadow:var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow)}.shadow-xl{--tw-shadow:0 20px 25px -5px var(--tw-shadow-color,#0000001a), 0 8px 10px -6px var(--tw-shadow-color,#0000001a);box-shadow:var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow)}.shadow-xs{--tw-shadow:0 1px 2px 0 var(--tw-shadow-color,#0000000d);box-shadow:var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow)}.ring,.ring-1{--tw-ring-shadow:var(--tw-ring-inset, ) 0 0 0 calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color,currentcolor);box-shadow:var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow)}.ring-2{--tw-ring-shadow:var(--tw-ring-inset, ) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color,currentcolor);box-shadow:var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow)}.ring-8{--tw-ring-shadow:var(--tw-ring-inset, ) 0 0 0 calc(8px + var(--tw-ring-offset-width)) var(--tw-ring-color,currentcolor);box-shadow:var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow)}.ring-\\[var\\(--ink\\)\\]{--tw-ring-color:var(--ink)}.ring-white{--tw-ring-color:var(--color-white)}.ring-white\\/40{--tw-ring-color:#fff6}@supports (color:color-mix(in lab, red, red)){.ring-white\\/40{--tw-ring-color:color-mix(in oklab, var(--color-white) 40%, transparent)}}.ring-offset-1{--tw-ring-offset-width:1px;--tw-ring-offset-shadow:var(--tw-ring-inset, ) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color)}.ring-offset-2{--tw-ring-offset-width:2px;--tw-ring-offset-shadow:var(--tw-ring-inset, ) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color)}.outline{outline-style:var(--tw-outline-style);outline-width:1px}.outline-2{outline-style:var(--tw-outline-style);outline-width:2px}.outline-\\[var\\(--accent\\)\\]{outline-color:var(--accent)}.blur{--tw-blur:blur(8px);filter:var(--tw-blur, ) var(--tw-brightness, ) var(--tw-contrast, ) var(--tw-grayscale, ) var(--tw-hue-rotate, ) var(--tw-invert, ) var(--tw-saturate, ) var(--tw-sepia, ) var(--tw-drop-shadow, )}.filter{filter:var(--tw-blur, ) var(--tw-brightness, ) var(--tw-contrast, ) var(--tw-grayscale, ) var(--tw-hue-rotate, ) var(--tw-invert, ) var(--tw-saturate, ) var(--tw-sepia, ) var(--tw-drop-shadow, )}.backdrop-blur{--tw-backdrop-blur:blur(8px);-webkit-backdrop-filter:var(--tw-backdrop-blur, ) var(--tw-backdrop-brightness, ) var(--tw-backdrop-contrast, ) var(--tw-backdrop-grayscale, ) var(--tw-backdrop-hue-rotate, ) var(--tw-backdrop-invert, ) var(--tw-backdrop-opacity, ) var(--tw-backdrop-saturate, ) var(--tw-backdrop-sepia, );backdrop-filter:var(--tw-backdrop-blur, ) var(--tw-backdrop-brightness, ) var(--tw-backdrop-contrast, ) var(--tw-backdrop-grayscale, ) var(--tw-backdrop-hue-rotate, ) var(--tw-backdrop-invert, ) var(--tw-backdrop-opacity, ) var(--tw-backdrop-saturate, ) var(--tw-backdrop-sepia, )}.backdrop-blur-\\[2px\\]{--tw-backdrop-blur:blur(2px);-webkit-backdrop-filter:var(--tw-backdrop-blur, ) var(--tw-backdrop-brightness, ) var(--tw-backdrop-contrast, ) var(--tw-backdrop-grayscale, ) var(--tw-backdrop-hue-rotate, ) var(--tw-backdrop-invert, ) var(--tw-backdrop-opacity, ) var(--tw-backdrop-saturate, ) var(--tw-backdrop-sepia, );backdrop-filter:var(--tw-backdrop-blur, ) var(--tw-backdrop-brightness, ) var(--tw-backdrop-contrast, ) var(--tw-backdrop-grayscale, ) var(--tw-backdrop-hue-rotate, ) var(--tw-backdrop-invert, ) var(--tw-backdrop-opacity, ) var(--tw-backdrop-saturate, ) var(--tw-backdrop-sepia, )}.backdrop-blur-md{--tw-backdrop-blur:blur(var(--blur-md));-webkit-backdrop-filter:var(--tw-backdrop-blur, ) var(--tw-backdrop-brightness, ) var(--tw-backdrop-contrast, ) var(--tw-backdrop-grayscale, ) var(--tw-backdrop-hue-rotate, ) var(--tw-backdrop-invert, ) var(--tw-backdrop-opacity, ) var(--tw-backdrop-saturate, ) var(--tw-backdrop-sepia, );backdrop-filter:var(--tw-backdrop-blur, ) var(--tw-backdrop-brightness, ) var(--tw-backdrop-contrast, ) var(--tw-backdrop-grayscale, ) var(--tw-backdrop-hue-rotate, ) var(--tw-backdrop-invert, ) var(--tw-backdrop-opacity, ) var(--tw-backdrop-saturate, ) var(--tw-backdrop-sepia, )}.backdrop-blur-sm{--tw-backdrop-blur:blur(var(--blur-sm));-webkit-backdrop-filter:var(--tw-backdrop-blur, ) var(--tw-backdrop-brightness, ) var(--tw-backdrop-contrast, ) var(--tw-backdrop-grayscale, ) var(--tw-backdrop-hue-rotate, ) var(--tw-backdrop-invert, ) var(--tw-backdrop-opacity, ) var(--tw-backdrop-saturate, ) var(--tw-backdrop-sepia, );backdrop-filter:var(--tw-backdrop-blur, ) var(--tw-backdrop-brightness, ) var(--tw-backdrop-contrast, ) var(--tw-backdrop-grayscale, ) var(--tw-backdrop-hue-rotate, ) var(--tw-backdrop-invert, ) var(--tw-backdrop-opacity, ) var(--tw-backdrop-saturate, ) var(--tw-backdrop-sepia, )}.transition{transition-property:color,background-color,border-color,outline-color,text-decoration-color,fill,stroke,--tw-gradient-from,--tw-gradient-via,--tw-gradient-to,opacity,box-shadow,transform,translate,scale,rotate,filter,-webkit-backdrop-filter,backdrop-filter,display,content-visibility,overlay,pointer-events;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function));transition-duration:var(--tw-duration,var(--default-transition-duration))}.transition-all{transition-property:all;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function));transition-duration:var(--tw-duration,var(--default-transition-duration))}.transition-colors{transition-property:color,background-color,border-color,outline-color,text-decoration-color,fill,stroke,--tw-gradient-from,--tw-gradient-via,--tw-gradient-to;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function));transition-duration:var(--tw-duration,var(--default-transition-duration))}.transition-opacity{transition-property:opacity;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function));transition-duration:var(--tw-duration,var(--default-transition-duration))}.transition-transform{transition-property:transform,translate,scale,rotate;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function));transition-duration:var(--tw-duration,var(--default-transition-duration))}.duration-200{--tw-duration:.2s;transition-duration:.2s}.duration-300{--tw-duration:.3s;transition-duration:.3s}.ease-in-out{--tw-ease:var(--ease-in-out);transition-timing-function:var(--ease-in-out)}.ease-out{--tw-ease:var(--ease-out);transition-timing-function:var(--ease-out)}.outline-none{--tw-outline-style:none;outline-style:none}.select-all{-webkit-user-select:all;user-select:all}.select-none{-webkit-user-select:none;user-select:none}:is(:where(.group):is([open],:popover-open,:open) .group-open\\:block){display:block}:is(:where(.group):is([open],:popover-open,:open) .group-open\\:hidden){display:none}:is(:where(.group):is([open],:popover-open,:open) .group-open\\:rotate-45){rotate:45deg}:is(:where(.group):is([open],:popover-open,:open) .group-open\\:rotate-90){rotate:90deg}:is(:where(.group):is([open],:popover-open,:open) .group-open\\:rotate-180){rotate:180deg}:is(:where(.group):focus-within .group-focus-within\\:pointer-events-auto){pointer-events:auto}:is(:where(.group):focus-within .group-focus-within\\:opacity-100){opacity:1}@media (hover:hover){:is(:where(.group):hover .group-hover\\:pointer-events-auto){pointer-events:auto}:is(:where(.group):hover .group-hover\\:scale-\\[1\\.01\\]){scale:1.01}:is(:where(.group):hover .group-hover\\:border-\\[\\#6A4FC4\\]){border-color:#6a4fc4}:is(:where(.group):hover .group-hover\\:border-\\[var\\(--accent\\)\\]){border-color:var(--accent)}:is(:where(.group):hover .group-hover\\:bg-\\[\\#6A4FC4\\]){background-color:#6a4fc4}:is(:where(.group):hover .group-hover\\:bg-\\[\\#EEEBF8\\]){background-color:#eeebf8}:is(:where(.group):hover .group-hover\\:bg-\\[var\\(--lilac\\)\\]){background-color:var(--lilac)}:is(:where(.group):hover .group-hover\\:text-\\[\\#6A4FC4\\]){color:#6a4fc4}:is(:where(.group):hover .group-hover\\:text-\\[var\\(--accent\\)\\]){color:var(--accent)}:is(:where(.group):hover .group-hover\\:text-purple-900){color:var(--color-purple-900)}:is(:where(.group):hover .group-hover\\:opacity-60){opacity:.6}:is(:where(.group):hover .group-hover\\:opacity-100),:is(:where(.group\\/sec):hover .group-hover\\/sec\\:opacity-100){opacity:1}}:is(:where(.peer):focus~.peer-focus\\:outline-none){--tw-outline-style:none;outline-style:none}.selection\\:bg-\\[\\#EEEBF8\\] ::selection{background-color:#eeebf8}.selection\\:bg-\\[\\#EEEBF8\\]::selection{background-color:#eeebf8}.selection\\:text-\\[\\#6A4FC4\\] ::selection{color:#6a4fc4}.selection\\:text-\\[\\#6A4FC4\\]::selection{color:#6a4fc4}.selection\\:text-\\[\\#543EA6\\] ::selection{color:#543ea6}.selection\\:text-\\[\\#543EA6\\]::selection{color:#543ea6}.file\\:mr-3::file-selector-button{margin-right:calc(var(--spacing) * 3)}.file\\:min-h-\\[40px\\]::file-selector-button{min-height:40px}.file\\:cursor-pointer::file-selector-button{cursor:pointer}.file\\:rounded-\\[10px\\]::file-selector-button{border-radius:10px}.file\\:border::file-selector-button{border-style:var(--tw-border-style);border-width:1px}.file\\:border-\\[var\\(--line-strong\\)\\]::file-selector-button{border-color:var(--line-strong)}.file\\:bg-\\[var\\(--paper\\)\\]::file-selector-button{background-color:var(--paper)}.file\\:px-4::file-selector-button{padding-inline:calc(var(--spacing) * 4)}.file\\:font-medium::file-selector-button{--tw-font-weight:var(--font-weight-medium);font-weight:var(--font-weight-medium)}.file\\:text-\\[var\\(--ink\\)\\]::file-selector-button{color:var(--ink)}.placeholder\\:text-\\[var\\(--muted\\)\\]::placeholder{color:var(--muted)}.placeholder\\:text-stone-400::placeholder{color:var(--color-stone-400)}.placeholder\\:italic::placeholder{font-style:italic}.after\\:absolute:after{content:var(--tw-content);position:absolute}.after\\:top-\\[2px\\]:after{content:var(--tw-content);top:2px}.after\\:left-\\[2px\\]:after{content:var(--tw-content);left:2px}.after\\:h-5:after{content:var(--tw-content);height:calc(var(--spacing) * 5)}.after\\:w-5:after{content:var(--tw-content);width:calc(var(--spacing) * 5)}.after\\:rounded-full:after{content:var(--tw-content);border-radius:2147483647px}.after\\:bg-white:after{content:var(--tw-content);background-color:var(--color-white)}.after\\:transition-all:after{content:var(--tw-content);transition-property:all;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function));transition-duration:var(--tw-duration,var(--default-transition-duration))}.after\\:content-\\[\\'\\'\\]:after{--tw-content:\"\";content:var(--tw-content)}:is(:where(.peer):checked~.peer-checked\\:after\\:translate-x-full):after{content:var(--tw-content);--tw-translate-x:100%;translate:var(--tw-translate-x) var(--tw-translate-y)}:is(:where(.peer):checked~.peer-checked\\:after\\:border-white):after{content:var(--tw-content);border-color:var(--color-white)}.last\\:border-b-0:last-child{border-bottom-style:var(--tw-border-style);border-bottom-width:0}.last\\:pb-0:last-child{padding-bottom:0}.open\\:bg-\\[var\\(--stone\\)\\]\\/50:is([open],:popover-open,:open){background-color:var(--stone)}@supports (color:color-mix(in lab, red, red)){.open\\:bg-\\[var\\(--stone\\)\\]\\/50:is([open],:popover-open,:open){background-color:color-mix(in oklab, var(--stone) 50%, transparent)}}.focus-within\\:ring-2:focus-within{--tw-ring-shadow:var(--tw-ring-inset, ) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color,currentcolor);box-shadow:var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow)}.focus-within\\:ring-\\[\\#6A4FC4\\]:focus-within{--tw-ring-color:#6a4fc4}@media (hover:hover){.hover\\:scale-105:hover{--tw-scale-x:105%;--tw-scale-y:105%;--tw-scale-z:105%;scale:var(--tw-scale-x) var(--tw-scale-y)}.hover\\:scale-110:hover{--tw-scale-x:110%;--tw-scale-y:110%;--tw-scale-z:110%;scale:var(--tw-scale-x) var(--tw-scale-y)}.hover\\:border-dashed:hover{--tw-border-style:dashed;border-style:dashed}.hover\\:border-\\[\\#6A4FC4\\]:hover{border-color:#6a4fc4}.hover\\:border-\\[\\#E7E7E4\\]:hover{border-color:#e7e7e4}.hover\\:border-\\[var\\(--accent\\)\\]:hover{border-color:var(--accent)}.hover\\:border-\\[var\\(--console-line\\)\\]:hover{border-color:var(--console-line)}.hover\\:border-\\[var\\(--ink\\)\\]:hover{border-color:var(--ink)}.hover\\:border-\\[var\\(--line-strong\\)\\]:hover{border-color:var(--line-strong)}.hover\\:\\!bg-\\[var\\(--accent-hover\\)\\]:hover{background-color:var(--accent-hover)!important}.hover\\:bg-\\[\\#2A2A2A\\]:hover{background-color:#2a2a2a}.hover\\:bg-\\[\\#6A4FC4\\]:hover{background-color:#6a4fc4}.hover\\:bg-\\[\\#543EA6\\]:hover{background-color:#543ea6}.hover\\:bg-\\[\\#EEEBF8\\]:hover{background-color:#eeebf8}.hover\\:bg-\\[\\#F5F5F3\\]:hover{background-color:#f5f5f3}.hover\\:bg-\\[\\#FAF9F6\\]:hover{background-color:#faf9f6}.hover\\:bg-\\[\\#FAFAF8\\]:hover{background-color:#fafaf8}.hover\\:bg-\\[var\\(--accent-hover\\)\\]:hover{background-color:var(--accent-hover)}.hover\\:bg-\\[var\\(--console-paper\\)\\]:hover{background-color:var(--console-paper)}.hover\\:bg-\\[var\\(--error-bg\\)\\]:hover{background-color:var(--error-bg)}.hover\\:bg-\\[var\\(--paper\\)\\]:hover{background-color:var(--paper)}.hover\\:bg-\\[var\\(--stone\\)\\]:hover,.hover\\:bg-\\[var\\(--stone\\)\\]\\/70:hover{background-color:var(--stone)}@supports (color:color-mix(in lab, red, red)){.hover\\:bg-\\[var\\(--stone\\)\\]\\/70:hover{background-color:color-mix(in oklab, var(--stone) 70%, transparent)}}.hover\\:bg-black:hover{background-color:var(--color-black)}.hover\\:bg-slate-50:hover{background-color:var(--color-slate-50)}.hover\\:bg-slate-200:hover{background-color:var(--color-slate-200)}.hover\\:bg-slate-900:hover{background-color:var(--color-slate-900)}.hover\\:bg-white:hover{background-color:var(--color-white)}.hover\\:\\!text-\\[var\\(--error\\)\\]:hover{color:var(--error)!important}.hover\\:text-\\[\\#6A4FC4\\]:hover{color:#6a4fc4}.hover\\:text-\\[\\#543EA6\\]:hover{color:#543ea6}.hover\\:text-\\[\\#111111\\]:hover{color:#111}.hover\\:text-\\[\\#C9B8F2\\]:hover{color:#c9b8f2}.hover\\:text-\\[var\\(--accent\\)\\]:hover{color:var(--accent)}.hover\\:text-\\[var\\(--error\\)\\]:hover{color:var(--error)}.hover\\:text-\\[var\\(--ink\\)\\]:hover{color:var(--ink)}.hover\\:text-\\[var\\(--paper\\)\\]:hover{color:var(--paper)}.hover\\:text-rose-600:hover{color:var(--color-rose-600)}.hover\\:text-white:hover{color:var(--color-white)}.hover\\:underline:hover{text-decoration-line:underline}.hover\\:opacity-80:hover{opacity:.8}.hover\\:opacity-85:hover{opacity:.85}.hover\\:opacity-90:hover{opacity:.9}.hover\\:brightness-95:hover{--tw-brightness:brightness(95%);filter:var(--tw-blur, ) var(--tw-brightness, ) var(--tw-contrast, ) var(--tw-grayscale, ) var(--tw-hue-rotate, ) var(--tw-invert, ) var(--tw-saturate, ) var(--tw-sepia, ) var(--tw-drop-shadow, )}}.focus\\:border-2:focus{border-style:var(--tw-border-style);border-width:2px}.focus\\:border-\\[\\#6A4FC4\\]:focus{border-color:#6a4fc4}.focus\\:border-\\[var\\(--accent\\)\\]:focus{border-color:var(--accent)}.focus\\:border-\\[var\\(--ink\\)\\]:focus{border-color:var(--ink)}.focus\\:border-amber-600:focus{border-color:var(--color-amber-600)}.focus\\:border-transparent:focus{border-color:#0000}.focus\\:opacity-100:focus{opacity:1}.focus\\:ring-0:focus{--tw-ring-shadow:var(--tw-ring-inset, ) 0 0 0 calc(0px + var(--tw-ring-offset-width)) var(--tw-ring-color,currentcolor);box-shadow:var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow)}.focus\\:ring-1:focus{--tw-ring-shadow:var(--tw-ring-inset, ) 0 0 0 calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color,currentcolor);box-shadow:var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow)}.focus\\:ring-2:focus{--tw-ring-shadow:var(--tw-ring-inset, ) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color,currentcolor);box-shadow:var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow)}.focus\\:ring-4:focus{--tw-ring-shadow:var(--tw-ring-inset, ) 0 0 0 calc(4px + var(--tw-ring-offset-width)) var(--tw-ring-color,currentcolor);box-shadow:var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow)}.focus\\:ring-\\[\\#6A4FC4\\]:focus{--tw-ring-color:#6a4fc4}.focus\\:ring-\\[\\#EEEBF8\\]:focus{--tw-ring-color:#eeebf8}.focus\\:ring-\\[var\\(--lilac\\)\\]:focus{--tw-ring-color:var(--lilac)}.focus\\:ring-white:focus{--tw-ring-color:var(--color-white)}.focus\\:outline:focus{outline-style:var(--tw-outline-style);outline-width:1px}.focus\\:outline-2:focus{outline-style:var(--tw-outline-style);outline-width:2px}.focus\\:outline-offset-2:focus{outline-offset:2px}.focus\\:outline-\\[var\\(--accent\\)\\]:focus{outline-color:var(--accent)}.focus\\:outline-white:focus{outline-color:var(--color-white)}.focus\\:outline-none:focus{--tw-outline-style:none;outline-style:none}.focus-visible\\:outline:focus-visible{outline-style:var(--tw-outline-style);outline-width:1px}.focus-visible\\:outline-2:focus-visible{outline-style:var(--tw-outline-style);outline-width:2px}.focus-visible\\:outline-offset-2:focus-visible{outline-offset:2px}.focus-visible\\:outline-\\[var\\(--accent\\)\\]:focus-visible{outline-color:var(--accent)}.active\\:scale-95:active{--tw-scale-x:95%;--tw-scale-y:95%;--tw-scale-z:95%;scale:var(--tw-scale-x) var(--tw-scale-y)}.active\\:scale-\\[0\\.98\\]:active{scale:.98}.active\\:cursor-grabbing:active{cursor:grabbing}.active\\:bg-\\[\\#432F85\\]:active{background-color:#432f85}.disabled\\:cursor-not-allowed:disabled{cursor:not-allowed}.disabled\\:opacity-30:disabled{opacity:.3}.disabled\\:opacity-40:disabled{opacity:.4}.disabled\\:opacity-50:disabled{opacity:.5}@media (width>=40rem){.sm\\:not-sr-only{clip-path:none;white-space:normal;width:auto;height:auto;margin:0;padding:0;position:static;overflow:visible}.sm\\:top-12{top:calc(var(--spacing) * 12)}.sm\\:top-20{top:calc(var(--spacing) * 20)}.sm\\:-mx-6{margin-inline:calc(var(--spacing) * -6)}.sm\\:block{display:block}.sm\\:flex{display:flex}.sm\\:hidden{display:none}.sm\\:inline{display:inline}.sm\\:inline-block{display:inline-block}.sm\\:inline-flex{display:inline-flex}.sm\\:w-72{width:calc(var(--spacing) * 72)}.sm\\:w-\\[300px\\]{width:300px}.sm\\:max-w-\\[260px\\]{max-width:260px}.sm\\:max-w-\\[390px\\]{max-width:390px}.sm\\:max-w-md{max-width:var(--container-md)}.sm\\:grid-cols-2{grid-template-columns:repeat(2,minmax(0,1fr))}.sm\\:grid-cols-3{grid-template-columns:repeat(3,minmax(0,1fr))}.sm\\:grid-cols-4{grid-template-columns:repeat(4,minmax(0,1fr))}.sm\\:flex-row{flex-direction:row}.sm\\:items-center{align-items:center}.sm\\:justify-end{justify-content:flex-end}.sm\\:gap-2{gap:calc(var(--spacing) * 2)}.sm\\:gap-4{gap:calc(var(--spacing) * 4)}.sm\\:gap-6{gap:calc(var(--spacing) * 6)}.sm\\:self-auto{align-self:auto}.sm\\:rounded-\\[16px\\]{border-radius:16px}.sm\\:border{border-style:var(--tw-border-style);border-width:1px}.sm\\:border-t-0{border-top-style:var(--tw-border-style);border-top-width:0}.sm\\:p-5{padding:calc(var(--spacing) * 5)}.sm\\:p-6{padding:calc(var(--spacing) * 6)}.sm\\:p-8{padding:calc(var(--spacing) * 8)}.sm\\:p-10{padding:calc(var(--spacing) * 10)}.sm\\:\\!px-3\\.5{padding-inline:calc(var(--spacing) * 3.5)!important}.sm\\:px-2\\.5{padding-inline:calc(var(--spacing) * 2.5)}.sm\\:px-3{padding-inline:calc(var(--spacing) * 3)}.sm\\:px-4{padding-inline:calc(var(--spacing) * 4)}.sm\\:px-6{padding-inline:calc(var(--spacing) * 6)}.sm\\:px-8{padding-inline:calc(var(--spacing) * 8)}.sm\\:py-10{padding-block:calc(var(--spacing) * 10)}.sm\\:pt-0{padding-top:0}.sm\\:pb-0{padding-bottom:0}.sm\\:text-center{text-align:center}.sm\\:text-right{text-align:right}.sm\\:text-3xl{font-size:var(--text-3xl);line-height:var(--tw-leading,var(--text-3xl--line-height))}.sm\\:text-4xl{font-size:var(--text-4xl);line-height:var(--tw-leading,var(--text-4xl--line-height))}.sm\\:text-6xl{font-size:var(--text-6xl);line-height:var(--tw-leading,var(--text-6xl--line-height))}.sm\\:text-lg{font-size:var(--text-lg);line-height:var(--tw-leading,var(--text-lg--line-height))}.sm\\:text-sm{font-size:var(--text-sm);line-height:var(--tw-leading,var(--text-sm--line-height))}.sm\\:text-\\[1\\.75rem\\]{font-size:1.75rem}.sm\\:text-\\[2\\.25rem\\]{font-size:2.25rem}.sm\\:text-\\[2rem\\]{font-size:2rem}.sm\\:text-\\[3\\.5rem\\]{font-size:3.5rem}.sm\\:text-\\[32px\\]{font-size:32px}.sm\\:text-\\[220px\\]{font-size:220px}}@media (width>=48rem){.md\\:sr-only{clip-path:inset(50%);white-space:nowrap;border-width:0;width:1px;height:1px;margin:-1px;padding:0;position:absolute;overflow:hidden}.md\\:static{position:static}.md\\:sticky{position:sticky}.md\\:top-0{top:0}.md\\:top-16{top:calc(var(--spacing) * 16)}.md\\:top-24{top:calc(var(--spacing) * 24)}.md\\:right-12{right:calc(var(--spacing) * 12)}.md\\:col-span-2{grid-column:span 2/span 2}.md\\:col-span-3{grid-column:span 3/span 3}.md\\:col-span-4{grid-column:span 4/span 4}.md\\:col-span-5{grid-column:span 5/span 5}.md\\:col-span-7{grid-column:span 7/span 7}.md\\:col-span-8{grid-column:span 8/span 8}.md\\:col-span-9{grid-column:span 9/span 9}.md\\:col-span-10{grid-column:span 10/span 10}.md\\:-mb-10{margin-bottom:calc(var(--spacing) * -10)}.md\\:mb-20{margin-bottom:calc(var(--spacing) * 20)}.md\\:block{display:block}.md\\:flex{display:flex}.md\\:grid{display:grid}.md\\:hidden{display:none}.md\\:inline{display:inline}.md\\:inline-flex{display:inline-flex}.md\\:w-\\[880px\\]{width:880px}.md\\:grid-cols-2{grid-template-columns:repeat(2,minmax(0,1fr))}.md\\:grid-cols-3{grid-template-columns:repeat(3,minmax(0,1fr))}.md\\:grid-cols-4{grid-template-columns:repeat(4,minmax(0,1fr))}.md\\:grid-cols-12{grid-template-columns:repeat(12,minmax(0,1fr))}.md\\:grid-cols-\\[160px_minmax\\(0\\,1fr\\)_minmax\\(0\\,1fr\\)\\]{grid-template-columns:160px minmax(0,1fr) minmax(0,1fr)}.md\\:grid-cols-\\[220px_minmax\\(0\\,1fr\\)\\]{grid-template-columns:220px minmax(0,1fr)}.md\\:grid-cols-\\[minmax\\(0\\,1fr\\)_280px\\]{grid-template-columns:minmax(0,1fr) 280px}.md\\:flex-row{flex-direction:row}.md\\:items-center{align-items:center}.md\\:items-end{align-items:flex-end}.md\\:justify-between{justify-content:space-between}.md\\:gap-6{gap:calc(var(--spacing) * 6)}.md\\:gap-8{gap:calc(var(--spacing) * 8)}.md\\:gap-12{gap:calc(var(--spacing) * 12)}:where(.md\\:space-y-24>:not(:last-child)){--tw-space-y-reverse:0;margin-block-start:calc(calc(var(--spacing) * 24) * var(--tw-space-y-reverse));margin-block-end:calc(calc(var(--spacing) * 24) * calc(1 - var(--tw-space-y-reverse)))}:where(.md\\:divide-x>:not(:last-child)){--tw-divide-x-reverse:0;border-inline-style:var(--tw-border-style);border-inline-start-width:calc(1px * var(--tw-divide-x-reverse));border-inline-end-width:calc(1px * calc(1 - var(--tw-divide-x-reverse)))}:where(.md\\:divide-y-0>:not(:last-child)){--tw-divide-y-reverse:0;border-bottom-style:var(--tw-border-style);border-top-style:var(--tw-border-style);border-top-width:calc(0px * var(--tw-divide-y-reverse));border-bottom-width:calc(0px * calc(1 - var(--tw-divide-y-reverse)))}.md\\:rounded-\\[10px\\]{border-radius:10px}.md\\:p-8{padding:calc(var(--spacing) * 8)}.md\\:p-10{padding:calc(var(--spacing) * 10)}.md\\:p-14{padding:calc(var(--spacing) * 14)}.md\\:px-10{padding-inline:calc(var(--spacing) * 10)}.md\\:py-8{padding-block:calc(var(--spacing) * 8)}.md\\:py-12{padding-block:calc(var(--spacing) * 12)}.md\\:py-14{padding-block:calc(var(--spacing) * 14)}.md\\:py-16{padding-block:calc(var(--spacing) * 16)}.md\\:py-24{padding-block:calc(var(--spacing) * 24)}.md\\:py-32{padding-block:calc(var(--spacing) * 32)}.md\\:pt-3{padding-top:calc(var(--spacing) * 3)}.md\\:pt-12{padding-top:calc(var(--spacing) * 12)}.md\\:pt-16{padding-top:calc(var(--spacing) * 16)}.md\\:pt-24{padding-top:calc(var(--spacing) * 24)}.md\\:pb-24{padding-bottom:calc(var(--spacing) * 24)}.md\\:text-3xl{font-size:var(--text-3xl);line-height:var(--tw-leading,var(--text-3xl--line-height))}.md\\:text-4xl{font-size:var(--text-4xl);line-height:var(--tw-leading,var(--text-4xl--line-height))}.md\\:text-lg{font-size:var(--text-lg);line-height:var(--tw-leading,var(--text-lg--line-height))}.md\\:text-\\[1\\.75rem\\]{font-size:1.75rem}.md\\:text-\\[2\\.5rem\\]{font-size:2.5rem}.md\\:text-\\[2\\.25rem\\]{font-size:2.25rem}.md\\:text-\\[4\\.75rem\\]{font-size:4.75rem}.md\\:text-\\[36px\\]{font-size:36px}.md\\:text-\\[44px\\]{font-size:44px}.md\\:text-\\[76px\\]{font-size:76px}.md\\:text-\\[260px\\]{font-size:260px}}@media (width>=64rem){.lg\\:sticky{position:sticky}.lg\\:top-0{top:0}.lg\\:top-10{top:calc(var(--spacing) * 10)}.lg\\:top-20{top:calc(var(--spacing) * 20)}.lg\\:top-24{top:calc(var(--spacing) * 24)}.lg\\:order-1{order:1}.lg\\:order-2{order:2}.lg\\:order-none{order:0}.lg\\:col-span-2{grid-column:span 2/span 2}.lg\\:col-span-4{grid-column:span 4/span 4}.lg\\:col-span-5{grid-column:span 5/span 5}.lg\\:col-span-7{grid-column:span 7/span 7}.lg\\:col-span-8{grid-column:span 8/span 8}.lg\\:block{display:block}.lg\\:flex{display:flex}.lg\\:grid{display:grid}.lg\\:hidden{display:none}.lg\\:inline-flex{display:inline-flex}.lg\\:w-\\[30\\%\\]{width:30%}.lg\\:w-\\[320px\\]{width:320px}.lg\\:w-auto{width:auto}.lg\\:flex-none{flex:none}.lg\\:grid-cols-3{grid-template-columns:repeat(3,minmax(0,1fr))}.lg\\:grid-cols-4{grid-template-columns:repeat(4,minmax(0,1fr))}.lg\\:grid-cols-12{grid-template-columns:repeat(12,minmax(0,1fr))}.lg\\:grid-cols-\\[200px_minmax\\(0\\,1fr\\)\\]{grid-template-columns:200px minmax(0,1fr)}.lg\\:grid-cols-\\[240px_minmax\\(0\\,1fr\\)\\]{grid-template-columns:240px minmax(0,1fr)}.lg\\:grid-cols-\\[300px_minmax\\(0\\,1fr\\)\\]{grid-template-columns:300px minmax(0,1fr)}.lg\\:grid-cols-\\[340px_minmax\\(0\\,1fr\\)\\]{grid-template-columns:340px minmax(0,1fr)}.lg\\:grid-cols-\\[minmax\\(0\\,1fr\\)_320px\\]{grid-template-columns:minmax(0,1fr) 320px}.lg\\:grid-cols-\\[minmax\\(0\\,1fr\\)_400px\\]{grid-template-columns:minmax(0,1fr) 400px}.lg\\:grid-cols-\\[minmax\\(0\\,1fr\\)_minmax\\(0\\,2fr\\)\\]{grid-template-columns:minmax(0,1fr) minmax(0,2fr)}.lg\\:flex-row{flex-direction:row}.lg\\:gap-8{gap:calc(var(--spacing) * 8)}.lg\\:gap-10{gap:calc(var(--spacing) * 10)}.lg\\:gap-12{gap:calc(var(--spacing) * 12)}.lg\\:overflow-visible{overflow:visible}.lg\\:border-y-0{border-block-style:var(--tw-border-style);border-block-width:0}.lg\\:border-t{border-top-style:var(--tw-border-style);border-top-width:1px}.lg\\:border-r{border-right-style:var(--tw-border-style);border-right-width:1px}.lg\\:px-8{padding-inline:calc(var(--spacing) * 8)}.lg\\:pb-0{padding-bottom:0}.lg\\:text-5xl{font-size:var(--text-5xl);line-height:var(--tw-leading,var(--text-5xl--line-height))}.lg\\:text-\\[2\\.75rem\\]{font-size:2.75rem}}@media (width>=80rem){.xl\\:col-span-1{grid-column:span 1/span 1}.xl\\:block{display:block}.xl\\:w-auto{width:auto}.xl\\:flex-1{flex:1}.xl\\:grid-cols-\\[200px_minmax\\(0\\,1fr\\)_380px\\]{grid-template-columns:200px minmax(0,1fr) 380px}.xl\\:grid-cols-\\[240px_minmax\\(0\\,1fr\\)_200px\\]{grid-template-columns:240px minmax(0,1fr) 200px}.xl\\:grid-cols-\\[300px_minmax\\(0\\,1fr\\)_minmax\\(0\\,500px\\)\\]{grid-template-columns:300px minmax(0,1fr) minmax(0,500px)}.xl\\:border-t-0{border-top-style:var(--tw-border-style);border-top-width:0}.xl\\:border-r{border-right-style:var(--tw-border-style);border-right-width:1px}.xl\\:border-b-0{border-bottom-style:var(--tw-border-style);border-bottom-width:0}}}:root{--ink:#111;--ink-2:#3d3935;--muted:#6b6560;--line:#e4e1dc;--line-strong:#c9c4bd;--paper:#fff;--console-paper:#faf9f6;--console-line:#e7e7e4;--accent-hover:#543ea6;--builder-surface:#fbf9f8;--sand:#f9f3ea;--stone:#f5f5f3;--mint:#e4f2ec;--mint-ink:#1f5c46;--lilac:#eeebf8;--accent:#6a4fc4;--accent-soft:#8f6fe0;--night:#161616;--night-muted:#a8a29e;--night-line:#2a2a2a;--night-wordmark:#262626;--error:#b42318;--error-bg:#fdecea;--warn:#8a5a00;--warn-bg:#fff4dc;--widget-accent:var(--accent);--font-sans:\"Inter\", \"Noto Sans Ethiopic\", system-ui, -apple-system, sans-serif;--font-mono:\"JetBrains Mono\", ui-monospace, SFMono-Regular, Menlo, monospace;--radius-sm:6px;--radius-md:10px;--radius-lg:16px;--radius-dark:28px;--shadow-float:0 1px 2px #1111110f, 0 8px 24px #11111114}.mezgeb-hc{--ink:#000;--ink-2:#000;--muted:#000;--line:#000;--line-strong:#000;--paper:#fff;--sand:#fff;--stone:#fff;--mint:#fff;--mint-ink:#000;--lilac:#fff;--accent:#000;--accent-soft:#000;--widget-accent:#000;--error:#900;--error-bg:#fff;--warn:#000;--warn-bg:#fff;--shadow-float:none}.mezgeb-hc .mezgeb-surface,.mezgeb-hc input,.mezgeb-hc select,.mezgeb-hc textarea,.mezgeb-hc button{border-width:2px!important}html{background-color:var(--paper);color:var(--ink);font-size:16px;font-family:var(--font-sans);-webkit-font-smoothing:antialiased}body{background-color:var(--paper);color:var(--ink);font-family:var(--font-sans);margin:0;font-size:1rem;line-height:1.6}[lang=am],html[lang=am] body{line-height:1.8}h1,h2,h3,h4{line-height:1.15}.mezgeb-display-heading:not([lang=am]){letter-spacing:-.02em}html[lang=am] .mezgeb-display-heading{letter-spacing:0}.mezgeb-section-label{letter-spacing:.06em;text-transform:uppercase;color:var(--muted);font-size:.8125rem;font-weight:600}[lang=am] .mezgeb-section-label,html[lang=am] .mezgeb-section-label{letter-spacing:0;text-transform:none}:focus-visible{outline:3px solid var(--accent);outline-offset:2px}.skip-link{z-index:100;background:var(--ink);color:var(--paper);border-radius:0 0 var(--radius-md) 0;padding:12px 18px;font-size:.875rem;font-weight:600;text-decoration:none;position:absolute;top:0;left:-9999px}.skip-link:focus{outline:3px solid var(--accent);outline-offset:2px;top:12px;left:16px}.mezgeb-container{max-width:1200px;margin-left:auto;margin-right:auto;padding-left:24px;padding-right:24px}@media (width<=479px){.mezgeb-container{padding-left:16px;padding-right:16px}}dialog.mezgeb-dialog::backdrop{background:#1111118f}@media (prefers-reduced-motion:no-preference){.mezgeb-transition{transition-property:color,background-color,border-color,text-decoration-color;transition-duration:.15s;transition-timing-function:ease-out}.mezgeb-panel-transition{transition-property:transform,opacity,width;transition-duration:.2s;transition-timing-function:ease-out}@keyframes mezgebWavePulse{0%,to{transform:scaleY(.45)}50%{transform:scaleY(1)}}.mezgeb-wave-bar{transform-origin:50%;animation:.9s ease-in-out infinite mezgebWavePulse}}.mz-canvas{background-color:var(--stone);background-image:radial-gradient(circle at 1px 1px,#dcd8d1 1px,#0000 0);background-size:18px 18px}.mezgeb-hc .mz-canvas{background-image:none}.mz-phone{border:1px solid var(--line-strong);background:var(--paper);border-radius:28px;padding:10px;box-shadow:0 1px #1111110a,0 18px 40px -18px #11111147}.mz-phone>.mz-phone-screen{border:1px solid var(--line);background:var(--paper);border-radius:20px;overflow:hidden}.mezgeb-hc .mz-phone{box-shadow:none;border:2px solid #000}input[type=checkbox].mz-switch{appearance:none;background:var(--line-strong);cursor:pointer;border-radius:999px;flex-shrink:0;width:40px;height:24px;margin:0;position:relative}input[type=checkbox].mz-switch:after{content:\"\";background:var(--paper);border-radius:999px;width:18px;height:18px;position:absolute;top:3px;left:3px;box-shadow:0 1px 2px #11111140}input[type=checkbox].mz-switch:checked{background:var(--ink)}input[type=checkbox].mz-switch:checked:after{left:19px}input[type=checkbox].mz-switch:disabled{opacity:.45;cursor:not-allowed}.mezgeb-hc input[type=checkbox].mz-switch{background:#fff;border:2px solid #000}.mezgeb-hc input[type=checkbox].mz-switch:after{background:#000;top:1px;left:1px}.mezgeb-hc input[type=checkbox].mz-switch:checked{background:#000}.mezgeb-hc input[type=checkbox].mz-switch:checked:after{background:#fff;left:17px}@media (prefers-reduced-motion:no-preference){input[type=checkbox].mz-switch,input[type=checkbox].mz-switch:after{transition:background-color .15s ease-out,left .15s ease-out}}.mz-autogrow{field-sizing:content;resize:none;min-height:2.75rem}.mz-scroll{scrollbar-width:thin;scrollbar-color:var(--line-strong) transparent}.mz-hero-gradient{background:linear-gradient(#eeebf8 0%,#edebed 35%,#e9f0ee 65%,#e4f2ec 100%)}.mz-waveform-bar{background:#c9b8f2bf;border-radius:9999px;flex-shrink:0;width:2px;margin:0 2px;display:inline-block}@media (prefers-reduced-motion:no-preference){@keyframes mzMicRipple{0%,to{opacity:.35;transform:scale(1)}50%{opacity:.12;transform:scale(1.12)}}.mz-mic-ripple{animation:2.8s ease-in-out infinite mzMicRipple}}.mz-console-page{background-color:var(--console-paper);color:var(--ink)}.template-card-stitch{border:1px solid var(--console-line);background:var(--paper);border-radius:1rem;transition:border-color .15s ease-out}.template-card-stitch:hover,.template-card-stitch:focus-within{border-color:var(--accent)}.template-card-stitch .card-hover-actions{opacity:0;transition:opacity .2s ease-in-out}.template-card-stitch:hover .card-hover-actions,.template-card-stitch:focus-within .card-hover-actions{opacity:1}.mz-phone-stitch{border:1px solid var(--console-line);background:var(--paper);border-radius:32px;box-shadow:0 16px 40px -12px #1111111a}.mz-builder-surface{background-color:var(--builder-surface)}@property --tw-translate-x{syntax:\"*\";inherits:false;initial-value:0}@property --tw-translate-y{syntax:\"*\";inherits:false;initial-value:0}@property --tw-translate-z{syntax:\"*\";inherits:false;initial-value:0}@property --tw-rotate-x{syntax:\"*\";inherits:false}@property --tw-rotate-y{syntax:\"*\";inherits:false}@property --tw-rotate-z{syntax:\"*\";inherits:false}@property --tw-skew-x{syntax:\"*\";inherits:false}@property --tw-skew-y{syntax:\"*\";inherits:false}@property --tw-scroll-snap-strictness{syntax:\"*\";inherits:false;initial-value:proximity}@property --tw-space-y-reverse{syntax:\"*\";inherits:false;initial-value:0}@property --tw-space-x-reverse{syntax:\"*\";inherits:false;initial-value:0}@property --tw-divide-y-reverse{syntax:\"*\";inherits:false;initial-value:0}@property --tw-border-style{syntax:\"*\";inherits:false;initial-value:solid}@property --tw-gradient-position{syntax:\"*\";inherits:false}@property --tw-gradient-from{syntax:\"<color>\";inherits:false;initial-value:#0000}@property --tw-gradient-via{syntax:\"<color>\";inherits:false;initial-value:#0000}@property --tw-gradient-to{syntax:\"<color>\";inherits:false;initial-value:#0000}@property --tw-gradient-stops{syntax:\"*\";inherits:false}@property --tw-gradient-via-stops{syntax:\"*\";inherits:false}@property --tw-gradient-from-position{syntax:\"<length-percentage>\";inherits:false;initial-value:0%}@property --tw-gradient-via-position{syntax:\"<length-percentage>\";inherits:false;initial-value:50%}@property --tw-gradient-to-position{syntax:\"<length-percentage>\";inherits:false;initial-value:100%}@property --tw-leading{syntax:\"*\";inherits:false}@property --tw-font-weight{syntax:\"*\";inherits:false}@property --tw-tracking{syntax:\"*\";inherits:false}@property --tw-ordinal{syntax:\"*\";inherits:false}@property --tw-slashed-zero{syntax:\"*\";inherits:false}@property --tw-numeric-figure{syntax:\"*\";inherits:false}@property --tw-numeric-spacing{syntax:\"*\";inherits:false}@property --tw-numeric-fraction{syntax:\"*\";inherits:false}@property --tw-shadow{syntax:\"*\";inherits:false;initial-value:0 0 #0000}@property --tw-shadow-color{syntax:\"*\";inherits:false}@property --tw-shadow-alpha{syntax:\"<percentage>\";inherits:false;initial-value:100%}@property --tw-inset-shadow{syntax:\"*\";inherits:false;initial-value:0 0 #0000}@property --tw-inset-shadow-color{syntax:\"*\";inherits:false}@property --tw-inset-shadow-alpha{syntax:\"<percentage>\";inherits:false;initial-value:100%}@property --tw-ring-color{syntax:\"*\";inherits:false}@property --tw-ring-shadow{syntax:\"*\";inherits:false;initial-value:0 0 #0000}@property --tw-inset-ring-color{syntax:\"*\";inherits:false}@property --tw-inset-ring-shadow{syntax:\"*\";inherits:false;initial-value:0 0 #0000}@property --tw-ring-inset{syntax:\"*\";inherits:false}@property --tw-ring-offset-width{syntax:\"<length>\";inherits:false;initial-value:0}@property --tw-ring-offset-color{syntax:\"*\";inherits:false;initial-value:#fff}@property --tw-ring-offset-shadow{syntax:\"*\";inherits:false;initial-value:0 0 #0000}@property --tw-outline-style{syntax:\"*\";inherits:false;initial-value:solid}@property --tw-blur{syntax:\"*\";inherits:false}@property --tw-brightness{syntax:\"*\";inherits:false}@property --tw-contrast{syntax:\"*\";inherits:false}@property --tw-grayscale{syntax:\"*\";inherits:false}@property --tw-hue-rotate{syntax:\"*\";inherits:false}@property --tw-invert{syntax:\"*\";inherits:false}@property --tw-opacity{syntax:\"*\";inherits:false}@property --tw-saturate{syntax:\"*\";inherits:false}@property --tw-sepia{syntax:\"*\";inherits:false}@property --tw-drop-shadow{syntax:\"*\";inherits:false}@property --tw-drop-shadow-color{syntax:\"*\";inherits:false}@property --tw-drop-shadow-alpha{syntax:\"<percentage>\";inherits:false;initial-value:100%}@property --tw-drop-shadow-size{syntax:\"*\";inherits:false}@property --tw-backdrop-blur{syntax:\"*\";inherits:false}@property --tw-backdrop-brightness{syntax:\"*\";inherits:false}@property --tw-backdrop-contrast{syntax:\"*\";inherits:false}@property --tw-backdrop-grayscale{syntax:\"*\";inherits:false}@property --tw-backdrop-hue-rotate{syntax:\"*\";inherits:false}@property --tw-backdrop-invert{syntax:\"*\";inherits:false}@property --tw-backdrop-opacity{syntax:\"*\";inherits:false}@property --tw-backdrop-saturate{syntax:\"*\";inherits:false}@property --tw-backdrop-sepia{syntax:\"*\";inherits:false}@property --tw-duration{syntax:\"*\";inherits:false}@property --tw-ease{syntax:\"*\";inherits:false}@property --tw-content{syntax:\"*\";inherits:false;initial-value:\"\"}@property --tw-scale-x{syntax:\"*\";inherits:false;initial-value:1}@property --tw-scale-y{syntax:\"*\";inherits:false;initial-value:1}@property --tw-scale-z{syntax:\"*\";inherits:false;initial-value:1}@property --tw-divide-x-reverse{syntax:\"*\";inherits:false;initial-value:0}@keyframes spin{to{transform:rotate(360deg)}}@keyframes pulse{50%{opacity:.5}}".replace(/(-?\d*\.?\d+)rem\b/g, (e, t) => `${+(parseFloat(t) * 16).toFixed(3)}px`), Mn = {
	"learning-platform": en,
	"job-seeker": tn,
	"employer-signup": nn,
	"programme-intake": rn,
	"job-application": an
}, Nn = (() => {
	try {
		return new URL(import.meta.url).origin;
	} catch {
		return "";
	}
})(), Pn = R.match(/@property\s+--[\w-]+\s*\{[^}]*\}/g) ?? [];
function Fn() {
	if (!Pn.length || document.getElementById("mezgeb-properties")) return;
	let e = document.createElement("style");
	e.id = "mezgeb-properties", e.textContent = Pn.join("\n"), document.head.appendChild(e);
}
function In(e) {
	try {
		let t = new CSSStyleSheet();
		t.replaceSync(R), e.adoptedStyleSheets = [t];
	} catch {
		let t = document.createElement("style");
		t.textContent = R, e.appendChild(t);
	}
}
function Ln({ lang: e }) {
	let { setLang: t } = pt();
	return (0, x.useEffect)(() => {
		t(e);
	}, [e]), null;
}
var Rn = class extends HTMLElement {
	constructor(...e) {
		super(...e), this.root = null;
	}
	static {
		this.observedAttributes = [
			"lang",
			"ai",
			"template",
			"site-key",
			"platform-name",
			"api-base"
		];
	}
	connectedCallback() {
		Fn();
		let e = this.shadowRoot ?? this.attachShadow({ mode: "open" });
		if (!e.firstChild) {
			In(e);
			let t = document.createElement("div");
			t.className = "mezgeb-root", e.appendChild(t), this.root = (0, Pe.createRoot)(t);
		}
		this.renderWidget();
	}
	disconnectedCallback() {
		this.root?.unmount(), this.root = null, this.shadowRoot && this.shadowRoot.replaceChildren();
	}
	attributeChangedCallback() {
		this.root && this.renderWidget();
	}
	renderWidget() {
		Ve(this.getAttribute("api-base") || Nn);
		let e = this.getAttribute("lang") === "am" ? "am" : "en", t = (this.getAttribute("ai") || "").toLowerCase() === "off", n = Mn[this.getAttribute("template") || "learning-platform"] ?? en, r = this.getAttribute("platform-name") || void 0, i = new URLSearchParams(window.location.search).get("resume");
		this.root.render(/* @__PURE__ */ (0, I.jsx)(ft, {
			setDocumentLang: !1,
			children: /* @__PURE__ */ (0, I.jsxs)(gn, { children: [/* @__PURE__ */ (0, I.jsx)(Ln, { lang: e }), /* @__PURE__ */ (0, I.jsx)(jn, {
				template: n,
				aiEnabled: !t,
				offline: !1,
				platformName: r,
				resumeIdParam: i,
				shortcutScope: "widget",
				siteKey: this.getAttribute("site-key") || "",
				persistProfile: !1,
				onComplete: (e) => {
					e.token && this.dispatchEvent(new CustomEvent("mezgeb:complete", {
						bubbles: !0,
						composed: !0,
						detail: { token: e.token }
					}));
				}
			})] })
		}));
	}
};
customElements.get("mezgeb-register") || customElements.define("mezgeb-register", Rn);

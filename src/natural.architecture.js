/*!
 * Natural-ARCHITECTURE v0.8.1.4
 * bbalganjjm@gmail.com
 *
 * Copyright 2014 KIM HWANG MAN
 * Released under the LGPL license
 *
 * Date: 2014-09-26T11:11Z
 */
(function(window, $) {
	N.version["Natural-ARCHITECTURE"] = "0.8.1.4";

	$.fn.extend($.extend(N.prototype, {
		ajax : function(opts) {
			return N.ajax(opts);
		},
		comm : function(url) {
			return new N.comm(this, url);
		},
		request : function() {
			return this.get(0).request;
		},
		cont : function(callback) {
			return new N.cont(this, callback);
		}
	}));

	(function(N) {
		// Ajax
		var Ajax = N.ajax = $.ajax;

		// Communicator
		var Communicator = N.comm = function(obj, url) {
			if (obj === undefined) {
				N.error("[Communicator]You must input arguments[0]");
			} else {
				if ((N.isPlainObject(obj) || N.isString(obj)) && url === undefined) {
					url = obj;
					obj = [];
				}
			}

			obj.request = new Communicator.request(obj, N.isString(url) ? {
				"url" : url
			} : url);

			$($.map(Communicator, function(v, i){
				if(N.type(Communicator[i]) === "function") {
					if(i !== "request") {
						return i;
					}
				}
			})).each(function(i, v) {
				obj[v] = function(arg0) {
					return Communicator[v].call(obj, arg0);
				};
			});

			return obj;
		};

		$.extend(Communicator, {
			xhr : null,
			submit : function(callback) {
				var obj = this;
				if (N.isElement(obj)) {
					$.extend(this.request.options, {
						contentType : "text/html; charset=UTF-8",
						dataType : "html",
						type : "GET"
					});
					this.request.options.target = obj;
				}

				var afterInitFilters = [];
				var beforeSendFilters = [];
				var successFilters = [];
				var errorFilters = [];
				var completeFilters = [];
				var filters = N.context.attr("architecture").comm.filters;
				for ( var key in filters) {
					for ( var filterKey in filters[key]) {
						if (filterKey === "afterInit") {
							afterInitFilters.push(filters[key][filterKey]);
						} else if (filterKey === "beforeSend") {
							beforeSendFilters.push(filters[key][filterKey]);
						} else if (filterKey === "success") {
							successFilters.push(filters[key][filterKey]);
						} else if (filterKey === "error") {
							errorFilters.push(filters[key][filterKey]);
						} else if (filterKey === "complete") {
							completeFilters.push(filters[key][filterKey]);
						}
					}
				}

				// request filter
				$(afterInitFilters).each(function(i) {
					this(obj.request);
				});

				$.extend(obj.request.options, {
					beforeSend : function(xhr, settings) {
						// request filter
						$(beforeSendFilters).each(function(i) {
							this(obj.request, xhr, settings);
						});
					},
					success : function(data, textStatus, xhr) {
						// request filter
						$(successFilters).each(function(i) {
							var fData = this(obj.request, data, textStatus, xhr);
							if(fData !== undefined) {
								data = fData;
							}
							fData = undefined;
						});

						if (!N.isElement(obj)) {
							if (obj.request.options.urlSync && obj.request.options.referrer.replace(/!/g, "") != window.location.href.replace(/!/g, "")) {
								xhr.abort();
								return false;
							}
						} else {
							if(obj.is(N.context.attr("architecture").page.context)) {
								N.gc[N.context.attr("core").gcMode]();
							}
							if (!obj.request.options.append) {
								obj.html(data);
							} else {
								obj.append(data);
							}
							// Deprecated
							if (obj.request.options.effect) {
								obj.hide()[obj.request.options.effect[0]](obj.request.options.effect[1], obj.request.options.effect[2]);
							}
							if(obj.children(".view_context__:last").length > 0) {
								var cont = obj.children(".view_context__:last").instance("cont");
								if(cont !== undefined) {
									// triggering "init" method
									Controller.trInit.call(this, cont, obj.request);
								}
							}
						}

						if (callback !== undefined) {
							try {
								callback.call(obj, data, obj.request);
							} catch (e) {
								N.error("[Communicator.submit.success.callback]" + e, e);
							}
						}
					},
					error : function(xhr, textStatus, errorThrown) {
						// request filter
						$(errorFilters).each(function(i) {
							this(obj.request, xhr, textStatus, errorThrown);
						});

						N.error("[N.ajax." + textStatus + "]" + errorThrown, errorThrown);
					},
					complete : function(xhr, textStatus) {
						// request filter
						$(completeFilters).each(function(i) {
							this(obj.request, xhr, textStatus);
						});
					}
				});
				this.xhr = N.ajax(obj.request.options);
				return obj;
			}
		});

		Communicator.request = function(obj, opts) {
			this.options = {
				referrer : window.location.href,
				contentType : "application/json; charset=utf-8",
				cache : false,
				async : true,
				type : "POST",
				data : null,
				dataIsArray : false,
				dataType : "json",
				urlSync : true,
				crossDomain : false,
				browserHistory : true, // TODO
				append : false,
				effect : false, // Deprecated
				target : null
			};

			// global config
			try {
				$.extend(this.options, N.context.attr("architecture").comm.request.options);
			} catch (e) {
			}
			$.extend(this.options, opts);

			this.attrObj = {};

			this.obj = obj;
			if(!N.isString(this.options.data)) {
				// Set parameters
				this.options.data = JSON.stringify(
					this.options.data === null ?
						!N.isWrappedSet(obj) ? obj
							: !N.isElement(obj) ?
								this.options.dataIsArray ?
									obj.get()
								: obj.get(0)
						: null
					: this.options.data
				);
			}

			if(this.options.data !== undefined) {
				if(this.options.type.toUpperCase() === "GET") {
					var firstChar = this.options.data.charAt(0);
					var lastChar = this.options.data.charAt(this.options.data.length - 1);
					if(firstChar === "{" && lastChar === "}" || firstChar === "[" && lastChar === "]") {
						this.options.data = "q=" + encodeURI(this.options.data);
					}
				}
			}
		};

		// Communicator.request local variable;
		$.fn.extend(Communicator.request.prototype, {
			/**
			 * get request attribute
			 */
			attr : function(name, obj_) {
				if (name === undefined) {
					return this.attrObj;
				}
				if (obj_ === undefined) {
					return this.attrObj !== undefined && this.attrObj[name] !== undefined ? this.attrObj[name] : undefined;
				} else {
					if (this.attrObj === undefined) {
						this.attrObj = {};
					}
					this.attrObj[name] = obj_;
					// this.obj : Defined by Communicator.request constructor;
					return this.obj;
				}
			},
			/**
			 * remove request attribute
			 */
			removeAttr : function(name) {
				if(this.attrObj[name] != undefined) {
					delete this.attrObj[name];
				}
				return this;
			},
			/**
			 * get query parmas from request url
			 */
			param : function(name) {
				if (N.isEmptyObject(name)) {
					if (this.options.url.indexOf("?") < 0) {
						return {};
					} else {
						var params = {};
						var parts = this.options.url.split("?")[1].substring(1).split('&');
						for (var i = 0; i < parts.length; i++) {
							var nv = parts[i].split('=');
							if (!nv[0])
								continue;
							params[nv[0]] = decodeURIComponent(nv[1]) || true;
						}
						return params;
					}
				} else {
					return this.param()[name];
				}
			},
			get : function(key) {
				if(key !== undefined) {
					return this.options[key];
				} else {
					return this.options;
				}
			}
		});

		var Controller = N.cont = function(obj, callback) {
			if(N("[id='" + obj.attr("id") + "']").length > 1) {
				obj = N("#" + obj.attr("id") + ":not(.view_context__)");
			}
			if(callback === undefined) {
				return obj.data(obj.attr("id"));
			}
			if(obj.length > 1) {
				N.error("[Controller]Only one view element must be selected.");
			}
			obj.addClass(obj.attr("id") + "__ view_context__");

			obj.instance("cont", callback);

			callback.view = obj;
			return callback;
		};

		$.extend(Controller, {
			/**
			 * "init" method trigger
			 */
			trInit : function(cont, request) {
				// set request attribute
				cont.request = request;

				// AOP processing
				Controller.aop.wrap.call(this, cont);

				// run Controller's "init" method
				if(cont.init !== undefined) {
					cont.init(cont.view, request);
				}
			},
			/**
			 * AOP processing module
			 */
			aop : {
				pointcuts : {
					"regexp" : {
						"fn" : function(param, contFrag, fnChain){
							var regexp = param instanceof RegExp ? param : new RegExp(param);
							return regexp.test(fnChain);
						}
					}
				},
				wrap : function(cont) {
					if (N.context.attr("architecture").cont &&
					    N.context.attr("architecture").cont.advisors &&
					    N.context.attr("architecture").cont.advisors.length > 0) {
						var o = N.context.attr("architecture").cont;

						$(o.advisors).each(function (idx, advisor) {
							var pointcut;
							if (!N.isPlainObject(advisor.pointcut)) {
								pointcut = Controller.aop.pointcuts.regexp;
							} else {
								pointcut = o.pointcuts[advisor.pointcut.type];
							}

							var wrapFn = function(contFrag, fnPath){
								for (var x in contFrag) {
									if (!contFrag.hasOwnProperty(x)) continue;

									if($.isFunction(contFrag[x])) {
										if (pointcut.fn(advisor.pointcut, contFrag, fnPath + x)) {
											var real = contFrag[x];

											contFrag[x] = (function (real, x) {
												var wrappedFn;

												switch(advisor.adviceType){
													case "before":
													wrappedFn = function(){
														var args = [].slice.call(arguments);
														advisor.fn.call(advisor, contFrag, fnPath + x, args);
														return real.apply(contFrag, args);
													};
													break;
													case "after":
													wrappedFn = function(){
														var args = [].slice.call(arguments);
														var result = real.apply(contFrag, args);
														advisor.fn.call(advisor, contFrag, fnPath + x, args, result);
														return result;
													};
													break;
													case "around":
													wrappedFn = function(){
														var args = [].slice.call(arguments);
														return advisor.fn.call(advisor, contFrag, fnPath + x, args, {
															"contFrag" : contFrag,
															"args" : args,
															"real" : real,
															"proceed" : function(){
																return this.real.apply(this.contFrag, this.args);
															}
														});
													};
													break;
													case "error":
													wrappedFn = function(){
														var args = [].slice.call(arguments);
														var result;
														try{
															result = real.apply(contFrag, args);
														} catch(e) {
															if (advisor.adviceType == "error") {
																result = advisor.fn.call(advisor, contFrag, fnPath + x, args, e);
															} else {
																throw e;
															}
														}
														return result;
													};
													break;
												}
												return wrappedFn;
											})(real, x);
										}
									} else if(N.isPlainObject(contFrag[x])) {
										wrapFn.call(this, contFrag[x], fnPath + x + ".");
									}
								}
							};
							wrapFn.call(this, cont, cont.view.selector + ":");
						});
				   	}
				}
			}
		});

		// Context Object
		N.context = {
			attrObj : {},
			attr : Communicator.request.prototype.attr
		};

	})(N);

})(window, jQuery);
function wrapPluginInitFn(e: any, t: any, r: any) {
	const n = e.init;
	return (
		t && (e.name = t),
		(e.init = function (t: any, i: any) {
			if ((t.readyState && t.readyState.state >= 3) || !t.on) return o();
			function o() {
				n.call(e, t, i);
			}
			t.on(r, o);
		}),
		e
	);
}
let sd: any;
let _: any;
let log: any;
const EXPOSURE_ATTR_EVENT_NAME = 'data-sensors-exposure-event-name';
let exposureIntersection: any = {};
let exposureEleOption: any = [];
let exposureConfig = { area_rate: 0, stay_duration: 0, repeated: !0 };
function isSupport() {
	return (
		('MutationObserver' in window ||
			'WebKitMutationObserver' in window ||
			'MozMutationObserver' in window) &&
		'IntersectionObserver' in window
	);
}
function formatConfig(e: any) {
	const t: any = {};
	return (
		_.each(e, function (r: any, n: any) {
			switch (n) {
				case 'area_rate':
					(r = Number(r)),
						!isNaN(r) && r >= 0 && r <= 1
							? (t.area_rate = r)
							: log('parameter config.area_rate error. config:', e);
					break;
				case 'stay_duration':
					(r = Number(r)),
						!isNaN(r) && r >= 0
							? (t.stay_duration = r)
							: log('parameter config.stay_duration error. config:', e);
					break;
				case 'repeated':
					r === 'false' || !1 === r || r === 'true' || !0 === r
						? (t.repeated = r)
						: log('parameter config.repeated error. config:', e);
			}
		}),
		t
	);
}
var exposurePlugin = {
	isReady: !1,
	init(e: any) {
		if (isSupport()) {
			const t: any = this;
			_.isObject(e) && (exposureConfig = _.extend(exposureConfig, formatConfig(e))),
				_.bindReady(function () {
					const e = t.getElesByEventName();
					t.addObserveByNodes(e), mutation.init();
				}),
				sd.ee.spa.on('switch', function (e: any) {
					if (e === location.href) return !1;
					t.clear();
					const r = t.getElesByEventName();
					t.addObserveByNodes(r);
				}),
				_.listenPageState({
					visible() {
						t.start();
					},
					hidden() {
						t.stop();
					}
				}),
				(this.isReady = !0);
		} else
			log(
				'The current browser does not support the element exposure key API, and the element exposure plugin initialization failed.'
			);
	},
	getElesByEventName(e: any) {
		return (e = e || document).querySelectorAll(`[${EXPOSURE_ATTR_EVENT_NAME}]`);
	},
	getEleEventName(e: any) {
		return e.getAttribute(EXPOSURE_ATTR_EVENT_NAME);
	},
	getEleAttr(e: any, t: any) {
		t = t || e.attributes;
		const r: any = {};
		const n: any = {};
		const i = this.getEleEventName(e);
		return (
			_.each(t, function (e: any) {
				const t = e.value;
				try {
					const i = e.name.match(/^data-sensors-exposure-property-(.+)/);
					i && (r[i[1]] = t);
				} catch (a) {}
				try {
					const o = e.name.match(/^data-sensors-exposure-config-(.+)/);
					if (o)
						switch (o[1]) {
							case 'area_rate':
								n.area_rate = t;
								break;
							case 'stay_duration':
								n.stay_duration = t;
								break;
							case 'repeated':
								n.repeated = !1;
						}
				} catch (a) {}
			}),
			{ eventName: i, config: formatConfig(n), properties: r }
		);
	},
	addObserveByNodes(e: any) {
		if (e.length) {
			const t: any = this;
			_.each(e, function (e: any) {
				if (e.nodeType === 1 && e.hasAttribute(EXPOSURE_ATTR_EVENT_NAME)) {
					const r: any = t.getEleAttr(e);
					(r.config = _.extend({}, exposureConfig, r.config)),
						(r.ele = e),
						t.addOrUpdateWatchEle(r);
				}
			});
		}
	},
	getIntersection(e: any) {
		const t: any = this;
		return exposureIntersection[e.area_rate]
			? exposureIntersection[e.area_rate]
			: (exposureIntersection[e.area_rate] = new IntersectionObserver(
					function () {
						t.exposure.apply(t, arguments);
					},
					{ threshold: e.area_rate }
				));
	},
	exposure(e: any) {
		const t: any = this;
		_.each(e, function (e: any) {
			const r: any = e.target;
			const n: any = t.getEleOption(r);
			!1 !== e.isIntersecting && n && !n.config.isSend
				? e.intersectionRatio >= n.config.area_rate &&
					(n.timer && (clearTimeout(n.timer), (n.timer = null)),
					(n.timer = setTimeout(function () {
						const e = r.getBoundingClientRect();
						const n = t.getEleOption(r);
						if (e.width && e.height && n && n.eventName && !n.config.isSend) {
							const i = sd.heatmap.getEleDetail(r);
							sd.track(n.eventName, _.extend({}, i, n.properties)),
								(n.config.isSend = !0),
								n.config.repeated && (n.config.isSend = !1);
						}
					}, 1e3 * n.config.stay_duration)))
				: n && n.timer && (clearTimeout(n.timer), (n.timer = null));
		});
	},
	getEleOption(e: any) {
		let t: any = null;
		return (
			_.each(exposureEleOption, function (r: any) {
				e === r.ele && (t = r);
			}),
			t
		);
	},
	addOrUpdateWatchEle(e: any) {
		const t = e.ele;
		const r = e.config;
		const n = exposurePlugin.getEleOption(t);
		if (n) _.extend2Lev(n, e), n.config.repeated && (n.config.isSend = !1);
		else {
			if (!e.eventName) return log('parameter option.eventName error. option:', e), !1;
			_.isElement(t) || log('parameter element error. option:', e),
				this.getIntersection(r).observe(t),
				exposureEleOption.push(e);
		}
	},
	removeWatchEle(e: any) {
		let t: any = null;
		let r = -1;
		if (
			(_.each(exposureEleOption, function (n: any, i: any) {
				e === n.ele && ((t = n), (r = i));
			}),
			t)
		) {
			const n = t.config;
			const i = exposureIntersection[n.area_rate];
			i &&
				_.isElement(e) &&
				(i.unobserve(e),
				t.timer && (clearTimeout(t.timer), (t.timer = null)),
				r > -1 && exposureEleOption.splice(r, 1));
		}
	},
	start() {
		_.each(exposureEleOption, function (e: any) {
			const t = e.config;
			const r = e.ele;
			const n = exposureIntersection[t.area_rate];
			n && _.isElement(r) && n.observe(r);
		});
	},
	stop() {
		_.each(exposureEleOption, function (e: any) {
			const t = e.config;
			const r = e.ele;
			const n = exposureIntersection[t.area_rate];
			n && _.isElement(r) && (n.unobserve(r), e.timer && (clearTimeout(e.timer), (e.timer = null)));
		});
	},
	clear() {
		this.stop(), (exposureIntersection = {}), (exposureEleOption = []);
	}
};
var mutation = {
	mo: null,
	init() {
		const e =
			window.MutationObserver ||
			(window as any).WebKitMutationObserver ||
			(window as any).MozMutationObserver;
		(this.mo = new e(this.listenNodesChange)), this.observe();
	},
	observe() {
		this.mo?.observe(document.body, {
			attributes: !0,
			childList: !0,
			subtree: !0,
			attributeOldValue: !0
		});
	},
	listenNodesChange(e: MutationRecord[]) {
		_.each(e, function (e: MutationRecord) {
			switch (e.type) {
				case 'childList':
					e.removedNodes.length > 0
						? _.each(e.removedNodes, function (e: any) {
								if (e.nodeType === 1) {
									exposurePlugin.removeWatchEle(e);
									const t = exposurePlugin.getElesByEventName(e);
									t.length &&
										_.each(t, function (e: any) {
											exposurePlugin.removeWatchEle(e);
										});
								}
							})
						: e.addedNodes.length &&
							(exposurePlugin.addObserveByNodes(e.addedNodes),
							_.each(e.addedNodes, function (e: any) {
								if (e.nodeType === 1) {
									const t = exposurePlugin.getElesByEventName(e);
									exposurePlugin.addObserveByNodes(t);
								}
							}));
					break;
				case 'attributes':
					if (!e.attributeName) return !1;
					var t = e.target;
					var r = e.attributeName;
					if (!_.isString(r) || r.indexOf('data-sensors-exposure') < 0) return;
					var n = exposurePlugin.getEleAttr(t, [{ name: r }]);
					var i = exposurePlugin.getEleOption(t) || { ele: t, config: exposureConfig };
					var o = _.extend2Lev({}, i, n);
					Object.prototype.hasOwnProperty.call(o, 'eventName')
						? exposurePlugin.addOrUpdateWatchEle(o)
						: exposurePlugin.removeWatchEle(t);
			}
		});
	}
};
const Exposure = {
	exposureViews: exposureEleOption,
	init(e: any, t: any) {
		if (!e || sd) return !1;
		(_ = (sd = e)._),
			(log = sd.log),
			exposurePlugin.init(t),
			log('Exposure Plugin initialized successfully');
	},
	addExposureView(e: any, t: any) {
		if (exposurePlugin.isReady)
			if (_.isElement(e)) {
				const r = {
					ele: e,
					config: _.isObject(t.config) ? formatConfig(t.config) : {},
					eventName: t.eventName,
					properties: _.isObject(t.properties) ? t.properties : {}
				};
				let n = exposurePlugin.getEleOption(e);
				if (n) {
					if (((n = _.extend2Lev({}, n, r)), !_.isString(n.eventName) || !n.eventName))
						return void log('parameter option.eventName error. option', t);
					n.config.repeated && (n.config.isSend = !1);
				} else {
					if (!_.isString(r.eventName) || !r.eventName)
						return void log('parameter option.eventName error. option', t);
					exposurePlugin.addOrUpdateWatchEle(r);
				}
			} else log('parameter element error.');
		else log('Exposure Plugin uninitialized.');
	},
	removeExposureView(e: any) {
		exposurePlugin.isReady
			? _.isElement(e)
				? exposurePlugin.removeWatchEle(e)
				: log('removeExposureView parameter ele errors.')
			: log('Exposure Plugin uninitialized.');
	}
};
wrapPluginInitFn(Exposure, 'Exposure', 'sdkAfterInitPara');
export default Exposure;

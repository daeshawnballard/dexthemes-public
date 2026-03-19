import {
  __commonJS,
  __toESM,
  currentUser
} from "./chunk-HEY2YPIO.js";

// node_modules/@statsig/client-core/src/Log.js
var require_Log = __commonJS({
  "node_modules/@statsig/client-core/src/Log.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Log = exports.LogLevel = void 0;
    var DEBUG = " DEBUG ";
    var _INFO = "  INFO ";
    var _WARN = "  WARN ";
    var ERROR = " ERROR ";
    function addTag(args) {
      args.unshift("[Statsig]");
      return args;
    }
    exports.LogLevel = {
      None: 0,
      Error: 1,
      Warn: 2,
      Info: 3,
      Debug: 4
    };
    var Log = class _Log {
      static info(...args) {
        if (_Log.level >= exports.LogLevel.Info) {
          console.info(_INFO, ...addTag(args));
        }
      }
      static debug(...args) {
        if (_Log.level >= exports.LogLevel.Debug) {
          console.debug(DEBUG, ...addTag(args));
        }
      }
      static warn(...args) {
        if (_Log.level >= exports.LogLevel.Warn) {
          console.warn(_WARN, ...addTag(args));
        }
      }
      static error(...args) {
        if (_Log.level >= exports.LogLevel.Error) {
          console.error(ERROR, ...addTag(args));
        }
      }
    };
    exports.Log = Log;
    Log.level = exports.LogLevel.Warn;
  }
});

// node_modules/@statsig/client-core/src/$_StatsigGlobal.js
var require_StatsigGlobal = __commonJS({
  "node_modules/@statsig/client-core/src/$_StatsigGlobal.js"(exports) {
    "use strict";
    var _a;
    var _b;
    var _c;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports._getInstance = exports._getStatsigGlobalFlag = exports._getStatsigGlobal = void 0;
    var Log_1 = require_Log();
    var _getStatsigGlobal = () => {
      try {
        return typeof __STATSIG__ !== "undefined" ? __STATSIG__ : statsigGlobal;
      } catch (e) {
        return statsigGlobal;
      }
    };
    exports._getStatsigGlobal = _getStatsigGlobal;
    var _getStatsigGlobalFlag = (flag) => {
      return (0, exports._getStatsigGlobal)()[flag];
    };
    exports._getStatsigGlobalFlag = _getStatsigGlobalFlag;
    var _getInstance = (sdkKey) => {
      const gbl = (0, exports._getStatsigGlobal)();
      if (!sdkKey) {
        if (gbl.instances && Object.keys(gbl.instances).length > 1) {
          Log_1.Log.warn("Call made to Statsig global instance without an SDK key but there is more than one client instance. If you are using mulitple clients, please specify the SDK key.");
        }
        return gbl.firstInstance;
      }
      return gbl.instances && gbl.instances[sdkKey];
    };
    exports._getInstance = _getInstance;
    var GLOBAL_KEY = "__STATSIG__";
    var _window = typeof window !== "undefined" ? window : {};
    var _global = typeof global !== "undefined" ? global : {};
    var _globalThis = typeof globalThis !== "undefined" ? globalThis : {};
    var statsigGlobal = (_c = (_b = (_a = _window[GLOBAL_KEY]) !== null && _a !== void 0 ? _a : _global[GLOBAL_KEY]) !== null && _b !== void 0 ? _b : _globalThis[GLOBAL_KEY]) !== null && _c !== void 0 ? _c : {
      instance: exports._getInstance
    };
    _window[GLOBAL_KEY] = statsigGlobal;
    _global[GLOBAL_KEY] = statsigGlobal;
    _globalThis[GLOBAL_KEY] = statsigGlobal;
  }
});

// node_modules/@statsig/client-core/src/Diagnostics.js
var require_Diagnostics = __commonJS({
  "node_modules/@statsig/client-core/src/Diagnostics.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Diagnostics = void 0;
    var MARKER_MAP = /* @__PURE__ */ new Map();
    var ACT_START = "start";
    var ACT_END = "end";
    var DIAGNOSTICS_EVENT = "statsig::diagnostics";
    exports.Diagnostics = {
      _getMarkers: (sdkKey) => {
        return MARKER_MAP.get(sdkKey);
      },
      _markInitOverallStart: (sdkKey) => {
        _addMarker(sdkKey, _createMarker({}, ACT_START, "overall"));
      },
      _markInitOverallEnd: (sdkKey, success, evaluationDetails) => {
        _addMarker(sdkKey, _createMarker({
          success,
          error: success ? void 0 : { name: "InitializeError", message: "Failed to initialize" },
          evaluationDetails
        }, ACT_END, "overall"));
      },
      _markInitNetworkReqStart: (sdkKey, data) => {
        _addMarker(sdkKey, _createMarker(data, ACT_START, "initialize", "network_request"));
      },
      _markInitNetworkReqEnd: (sdkKey, data) => {
        _addMarker(sdkKey, _createMarker(data, ACT_END, "initialize", "network_request"));
      },
      _markInitProcessStart: (sdkKey) => {
        _addMarker(sdkKey, _createMarker({}, ACT_START, "initialize", "process"));
      },
      _markInitProcessEnd: (sdkKey, data) => {
        _addMarker(sdkKey, _createMarker(data, ACT_END, "initialize", "process"));
      },
      _clearMarkers: (sdkKey) => {
        MARKER_MAP.delete(sdkKey);
      },
      _formatError(e) {
        if (!(e && typeof e === "object")) {
          return;
        }
        return {
          code: _safeGetField(e, "code"),
          name: _safeGetField(e, "name"),
          message: _safeGetField(e, "message")
        };
      },
      _getDiagnosticsData(res, attempt, body, e) {
        var _a;
        return {
          success: (res === null || res === void 0 ? void 0 : res.ok) === true,
          statusCode: res === null || res === void 0 ? void 0 : res.status,
          sdkRegion: (_a = res === null || res === void 0 ? void 0 : res.headers) === null || _a === void 0 ? void 0 : _a.get("x-statsig-region"),
          isDelta: body.includes('"is_delta":true') === true ? true : void 0,
          attempt,
          error: exports.Diagnostics._formatError(e)
        };
      },
      _enqueueDiagnosticsEvent(user, logger, sdk, options) {
        const markers = exports.Diagnostics._getMarkers(sdk);
        if (markers == null || markers.length <= 0) {
          return -1;
        }
        const overallInitDuration = markers[markers.length - 1].timestamp - markers[0].timestamp;
        exports.Diagnostics._clearMarkers(sdk);
        const event = _makeDiagnosticsEvent(user, {
          context: "initialize",
          markers: markers.slice(),
          statsigOptions: options
        });
        logger.enqueue(event);
        return overallInitDuration;
      }
    };
    function _createMarker(data, action, key, step) {
      return Object.assign({ key, action, step, timestamp: Date.now() }, data);
    }
    function _makeDiagnosticsEvent(user, data) {
      const latencyEvent = {
        eventName: DIAGNOSTICS_EVENT,
        user,
        value: null,
        metadata: data,
        time: Date.now()
      };
      return latencyEvent;
    }
    function _addMarker(sdkKey, marker) {
      var _a;
      const markers = (_a = MARKER_MAP.get(sdkKey)) !== null && _a !== void 0 ? _a : [];
      markers.push(marker);
      MARKER_MAP.set(sdkKey, markers);
    }
    function _safeGetField(data, field) {
      if (field in data) {
        return data[field];
      }
      return void 0;
    }
  }
});

// node_modules/@statsig/client-core/src/EventBatch.js
var require_EventBatch = __commonJS({
  "node_modules/@statsig/client-core/src/EventBatch.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.EventBatch = void 0;
    var EventBatch = class {
      constructor(events) {
        this.attempts = 0;
        this.createdAt = Date.now();
        this.events = events;
      }
      incrementAttempts() {
        this.attempts++;
      }
    };
    exports.EventBatch = EventBatch;
  }
});

// node_modules/@statsig/client-core/src/EventRetryConstants.js
var require_EventRetryConstants = __commonJS({
  "node_modules/@statsig/client-core/src/EventRetryConstants.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.EventRetryConstants = void 0;
    exports.EventRetryConstants = {
      MAX_RETRY_ATTEMPTS: 5,
      DEFAULT_BATCH_SIZE: 100,
      MAX_PENDING_BATCHES: 30,
      TICK_INTERVAL_MS: 1e3,
      QUICK_FLUSH_WINDOW_MS: 200,
      MAX_LOCAL_STORAGE: 500,
      get MAX_QUEUED_EVENTS() {
        return this.DEFAULT_BATCH_SIZE * this.MAX_PENDING_BATCHES;
      }
    };
  }
});

// node_modules/@statsig/client-core/src/BatchedEventsQueue.js
var require_BatchedEventsQueue = __commonJS({
  "node_modules/@statsig/client-core/src/BatchedEventsQueue.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BatchQueue = void 0;
    var EventBatch_1 = require_EventBatch();
    var EventRetryConstants_1 = require_EventRetryConstants();
    var BatchQueue = class {
      constructor(batchSize = EventRetryConstants_1.EventRetryConstants.DEFAULT_BATCH_SIZE) {
        this._batches = [];
        this._batchSize = batchSize;
      }
      batchSize() {
        return this._batchSize;
      }
      requeueBatch(batch) {
        return this._enqueueBatch(batch);
      }
      hasFullBatch() {
        return this._batches.some((batch) => batch.events.length >= this._batchSize);
      }
      takeNextBatch() {
        return this._batches.shift();
      }
      takeAllBatches() {
        const batches = this._batches;
        this._batches = [];
        return batches;
      }
      createBatches(events) {
        let i = 0;
        let droppedCount = 0;
        while (i < events.length) {
          const chunk = events.slice(i, i + this._batchSize);
          droppedCount += this._enqueueBatch(new EventBatch_1.EventBatch(chunk));
          i += this._batchSize;
        }
        return droppedCount;
      }
      _enqueueBatch(batch) {
        this._batches.push(batch);
        let droppedEventCount = 0;
        while (this._batches.length > EventRetryConstants_1.EventRetryConstants.MAX_PENDING_BATCHES) {
          const dropped = this._batches.shift();
          if (dropped) {
            droppedEventCount += dropped.events.length;
          }
        }
        return droppedEventCount;
      }
    };
    exports.BatchQueue = BatchQueue;
  }
});

// node_modules/@statsig/client-core/src/TypingUtils.js
var require_TypingUtils = __commonJS({
  "node_modules/@statsig/client-core/src/TypingUtils.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports._isTypeMatch = exports._typeOf = void 0;
    function _typeOf(input) {
      return Array.isArray(input) ? "array" : typeof input;
    }
    exports._typeOf = _typeOf;
    function _isTypeMatch(a, b) {
      const typeOf = (x) => Array.isArray(x) ? "array" : x === null ? "null" : typeof x;
      return typeOf(a) === typeOf(b);
    }
    exports._isTypeMatch = _isTypeMatch;
  }
});

// node_modules/@statsig/client-core/src/Hashing.js
var require_Hashing = __commonJS({
  "node_modules/@statsig/client-core/src/Hashing.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports._getSortedObject = exports._DJB2Object = exports._DJB2 = void 0;
    var TypingUtils_1 = require_TypingUtils();
    var _DJB2 = (value) => {
      let hash = 0;
      for (let i = 0; i < value.length; i++) {
        const character = value.charCodeAt(i);
        hash = (hash << 5) - hash + character;
        hash = hash & hash;
      }
      return String(hash >>> 0);
    };
    exports._DJB2 = _DJB2;
    var _DJB2Object = (value, maxLevels) => {
      return (0, exports._DJB2)(JSON.stringify((0, exports._getSortedObject)(value, maxLevels)));
    };
    exports._DJB2Object = _DJB2Object;
    var _getSortedObject = (object, maxDepth) => {
      if (object == null) {
        return null;
      }
      const keys = Object.keys(object).sort();
      const sortedObject = {};
      keys.forEach((key) => {
        const value = object[key];
        if (maxDepth === 0 || (0, TypingUtils_1._typeOf)(value) !== "object") {
          sortedObject[key] = value;
          return;
        }
        sortedObject[key] = (0, exports._getSortedObject)(value, maxDepth != null ? maxDepth - 1 : maxDepth);
      });
      return sortedObject;
    };
    exports._getSortedObject = _getSortedObject;
  }
});

// node_modules/@statsig/client-core/src/CacheKey.js
var require_CacheKey = __commonJS({
  "node_modules/@statsig/client-core/src/CacheKey.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports._getStorageKey = exports._getUserStorageKey = void 0;
    var Hashing_1 = require_Hashing();
    function _getUserStorageKey(sdkKey, user, customKeyGenerator) {
      var _a;
      if (customKeyGenerator) {
        return customKeyGenerator(sdkKey, user);
      }
      const cids = user && user.customIDs ? user.customIDs : {};
      const parts = [
        `uid:${(_a = user === null || user === void 0 ? void 0 : user.userID) !== null && _a !== void 0 ? _a : ""}`,
        `cids:${Object.keys(cids).sort((leftKey, rightKey) => leftKey.localeCompare(rightKey)).map((key) => `${key}-${cids[key]}`).join(",")}`,
        `k:${sdkKey}`
      ];
      return (0, Hashing_1._DJB2)(parts.join("|"));
    }
    exports._getUserStorageKey = _getUserStorageKey;
    function _getStorageKey(sdkKey, user, customKeyGenerator) {
      if (user) {
        return _getUserStorageKey(sdkKey, user, customKeyGenerator);
      }
      return (0, Hashing_1._DJB2)(`k:${sdkKey}`);
    }
    exports._getStorageKey = _getStorageKey;
  }
});

// node_modules/@statsig/client-core/src/NetworkConfig.js
var require_NetworkConfig = __commonJS({
  "node_modules/@statsig/client-core/src/NetworkConfig.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.NetworkParam = exports.NetworkDefault = exports.Endpoint = void 0;
    exports.Endpoint = {
      _initialize: "initialize",
      _rgstr: "rgstr",
      _download_config_specs: "download_config_specs"
    };
    exports.NetworkDefault = {
      [exports.Endpoint._rgstr]: "https://prodregistryv2.org/v1",
      [exports.Endpoint._initialize]: "https://featureassets.org/v1",
      [exports.Endpoint._download_config_specs]: "https://api.statsigcdn.com/v1"
    };
    exports.NetworkParam = {
      EventCount: "ec",
      SdkKey: "k",
      SdkType: "st",
      SdkVersion: "sv",
      Time: "t",
      SessionID: "sid",
      StatsigEncoded: "se",
      IsGzipped: "gz"
    };
  }
});

// node_modules/@statsig/client-core/src/SafeJs.js
var require_SafeJs = __commonJS({
  "node_modules/@statsig/client-core/src/SafeJs.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports._cloneObject = exports._getUnloadEvent = exports._getCurrentPageUrlSafe = exports._addDocumentEventListenerSafe = exports._addWindowEventListenerSafe = exports._isServerEnv = exports._getDocumentSafe = exports._getWindowSafe = void 0;
    var Log_1 = require_Log();
    var _getWindowSafe = () => {
      return typeof window !== "undefined" ? window : null;
    };
    exports._getWindowSafe = _getWindowSafe;
    var _getDocumentSafe = () => {
      var _a;
      const win = (0, exports._getWindowSafe)();
      return (_a = win === null || win === void 0 ? void 0 : win.document) !== null && _a !== void 0 ? _a : null;
    };
    exports._getDocumentSafe = _getDocumentSafe;
    var _isServerEnv = () => {
      if ((0, exports._getDocumentSafe)() !== null) {
        return false;
      }
      const isNode = typeof process !== "undefined" && process.versions != null && process.versions.node != null;
      const isVercel = typeof EdgeRuntime === "string";
      return isVercel || isNode;
    };
    exports._isServerEnv = _isServerEnv;
    var _addWindowEventListenerSafe = (key, listener) => {
      const win = (0, exports._getWindowSafe)();
      if (typeof (win === null || win === void 0 ? void 0 : win.addEventListener) === "function") {
        win.addEventListener(key, listener);
      }
    };
    exports._addWindowEventListenerSafe = _addWindowEventListenerSafe;
    var _addDocumentEventListenerSafe = (key, listener) => {
      const doc = (0, exports._getDocumentSafe)();
      if (typeof (doc === null || doc === void 0 ? void 0 : doc.addEventListener) === "function") {
        doc.addEventListener(key, listener);
      }
    };
    exports._addDocumentEventListenerSafe = _addDocumentEventListenerSafe;
    var _getCurrentPageUrlSafe = () => {
      var _a;
      try {
        return (_a = (0, exports._getWindowSafe)()) === null || _a === void 0 ? void 0 : _a.location.href.split(/[?#]/)[0];
      } catch (_b) {
        return;
      }
    };
    exports._getCurrentPageUrlSafe = _getCurrentPageUrlSafe;
    var _getUnloadEvent = () => {
      const win = (0, exports._getWindowSafe)();
      if (!win) {
        return "beforeunload";
      }
      const eventType = "onpagehide" in win ? "pagehide" : "beforeunload";
      return eventType;
    };
    exports._getUnloadEvent = _getUnloadEvent;
    var _cloneObject = (tag, obj) => {
      try {
        return JSON.parse(JSON.stringify(obj));
      } catch (error) {
        Log_1.Log.error(`Failed to clone object ${tag}`);
        return null;
      }
    };
    exports._cloneObject = _cloneObject;
  }
});

// node_modules/@statsig/client-core/src/VisibilityObserving.js
var require_VisibilityObserving = __commonJS({
  "node_modules/@statsig/client-core/src/VisibilityObserving.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports._notifyVisibilityChanged = exports._subscribeToVisiblityChanged = exports._isUnloading = exports._isCurrentlyVisible = void 0;
    var SafeJs_1 = require_SafeJs();
    var FOREGROUND = "foreground";
    var BACKGROUND = "background";
    var LISTENERS = [];
    var current = FOREGROUND;
    var isUnloading = false;
    var _isCurrentlyVisible = () => {
      return current === FOREGROUND;
    };
    exports._isCurrentlyVisible = _isCurrentlyVisible;
    var _isUnloading = () => isUnloading;
    exports._isUnloading = _isUnloading;
    var _subscribeToVisiblityChanged = (listener) => {
      LISTENERS.unshift(listener);
    };
    exports._subscribeToVisiblityChanged = _subscribeToVisiblityChanged;
    var _notifyVisibilityChanged = (visibility) => {
      if (visibility === current) {
        return;
      }
      current = visibility;
      LISTENERS.forEach((l) => l(visibility));
    };
    exports._notifyVisibilityChanged = _notifyVisibilityChanged;
    (0, SafeJs_1._addWindowEventListenerSafe)("focus", () => {
      isUnloading = false;
      (0, exports._notifyVisibilityChanged)(FOREGROUND);
    });
    (0, SafeJs_1._addWindowEventListenerSafe)("blur", () => (0, exports._notifyVisibilityChanged)(BACKGROUND));
    (0, SafeJs_1._addDocumentEventListenerSafe)("visibilitychange", () => {
      (0, exports._notifyVisibilityChanged)(document.visibilityState === "visible" ? FOREGROUND : BACKGROUND);
    });
    (0, SafeJs_1._addWindowEventListenerSafe)((0, SafeJs_1._getUnloadEvent)(), () => {
      isUnloading = true;
      (0, exports._notifyVisibilityChanged)(BACKGROUND);
    });
  }
});

// node_modules/@statsig/client-core/src/EventSender.js
var require_EventSender = __commonJS({
  "node_modules/@statsig/client-core/src/EventSender.js"(exports) {
    "use strict";
    var __awaiter = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.EventSender = void 0;
    var Log_1 = require_Log();
    var NetworkConfig_1 = require_NetworkConfig();
    var VisibilityObserving_1 = require_VisibilityObserving();
    var EventSender = class {
      constructor(sdkKey, network, emitter, logEventUrlConfig, options) {
        this._sdkKey = sdkKey;
        this._network = network;
        this._emitter = emitter;
        this._options = options;
        this._logEventUrlConfig = logEventUrlConfig;
      }
      setLogEventCompressionMode(mode) {
        this._network.setLogEventCompressionMode(mode);
      }
      sendBatch(batch) {
        return __awaiter(this, void 0, void 0, function* () {
          var _a, _b;
          try {
            const isClosing = (0, VisibilityObserving_1._isUnloading)();
            const shouldUseBeacon = isClosing && this._network.isBeaconSupported() && ((_b = (_a = this._options) === null || _a === void 0 ? void 0 : _a.networkConfig) === null || _b === void 0 ? void 0 : _b.networkOverrideFunc) == null;
            this._emitter({
              name: "pre_logs_flushed",
              events: batch.events
            });
            const response = shouldUseBeacon ? this._sendEventsViaBeacon(batch) : yield this._sendEventsViaPost(batch);
            if (response.success) {
              this._emitter({
                name: "logs_flushed",
                events: batch.events
              });
              return response;
            }
            return { success: false, statusCode: response.statusCode };
          } catch (error) {
            Log_1.Log.warn("Failed to send batch:", error);
            return { success: false, statusCode: -1 };
          }
        });
      }
      _sendEventsViaPost(batch) {
        return __awaiter(this, void 0, void 0, function* () {
          var _a;
          const result = yield this._network.post(this._getRequestData(batch));
          const code = (_a = result === null || result === void 0 ? void 0 : result.code) !== null && _a !== void 0 ? _a : -1;
          return { success: code >= 200 && code < 300, statusCode: code };
        });
      }
      _sendEventsViaBeacon(batch) {
        const success = this._network.beacon(this._getRequestData(batch));
        return {
          success,
          statusCode: success ? 200 : -1
        };
      }
      _getRequestData(batch) {
        return {
          sdkKey: this._sdkKey,
          data: {
            events: batch.events
          },
          urlConfig: this._logEventUrlConfig,
          retries: 3,
          preserveFailedStatusCode: true,
          isCompressable: true,
          params: {
            [NetworkConfig_1.NetworkParam.EventCount]: String(batch.events.length)
          },
          headers: {
            "statsig-event-count": String(batch.events.length),
            "statsig-retry-count": String(batch.attempts)
          },
          credentials: "same-origin"
        };
      }
    };
    exports.EventSender = EventSender;
  }
});

// node_modules/@statsig/client-core/src/FlushInterval.js
var require_FlushInterval = __commonJS({
  "node_modules/@statsig/client-core/src/FlushInterval.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.FlushInterval = void 0;
    var MIN_FLUSH_INTERVAL_MS = 1e3;
    var MAX_FLUSH_INTERVAL_MS = 6e4;
    var FlushInterval = class {
      constructor() {
        this._currentIntervalMs = MIN_FLUSH_INTERVAL_MS;
        this._lastFlushAttemptTime = Date.now();
      }
      getCurrentIntervalMs() {
        return this._currentIntervalMs;
      }
      markFlushAttempt() {
        this._lastFlushAttemptTime = Date.now();
      }
      getTimeSinceLastAttempt() {
        return Date.now() - this._lastFlushAttemptTime;
      }
      hasReachedMaxInterval() {
        return this.getTimeSinceLastAttempt() >= MAX_FLUSH_INTERVAL_MS;
      }
      getTimeTillMaxInterval() {
        return MAX_FLUSH_INTERVAL_MS - this.getTimeSinceLastAttempt();
      }
      hasCompletelyRecoveredFromBackoff() {
        return this._currentIntervalMs <= MIN_FLUSH_INTERVAL_MS;
      }
      adjustForSuccess() {
        const current = this._currentIntervalMs;
        if (current === MIN_FLUSH_INTERVAL_MS) {
          return;
        }
        this._currentIntervalMs = Math.max(MIN_FLUSH_INTERVAL_MS, Math.floor(current / 2));
      }
      adjustForFailure() {
        const current = this._currentIntervalMs;
        this._currentIntervalMs = Math.min(MAX_FLUSH_INTERVAL_MS, current * 2);
      }
      getTimeUntilNextFlush() {
        return this.getCurrentIntervalMs() - this.getTimeSinceLastAttempt();
      }
    };
    exports.FlushInterval = FlushInterval;
  }
});

// node_modules/@statsig/client-core/src/FlushTypes.js
var require_FlushTypes = __commonJS({
  "node_modules/@statsig/client-core/src/FlushTypes.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.FlushType = void 0;
    var FlushType;
    (function(FlushType2) {
      FlushType2["ScheduledMaxTime"] = "scheduled:max_time";
      FlushType2["ScheduledFullBatch"] = "scheduled:full_batch";
      FlushType2["Limit"] = "limit";
      FlushType2["Manual"] = "manual";
      FlushType2["Shutdown"] = "shutdown";
    })(FlushType || (exports.FlushType = FlushType = {}));
  }
});

// node_modules/@statsig/client-core/src/DnsTxtQuery.js
var require_DnsTxtQuery = __commonJS({
  "node_modules/@statsig/client-core/src/DnsTxtQuery.js"(exports) {
    "use strict";
    var __awaiter = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports._fetchTxtRecords = void 0;
    var FEATURE_ASSETS_DNS_QUERY = new Uint8Array([
      0,
      0,
      1,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      0,
      0,
      13,
      102,
      101,
      97,
      116,
      117,
      114,
      101,
      97,
      115,
      115,
      101,
      116,
      115,
      3,
      111,
      114,
      103,
      0,
      0,
      16,
      0,
      1
    ]);
    var DNS_QUERY_ENDPOINT = "https://cloudflare-dns.com/dns-query";
    var DOMAIN_CHARS = [
      "i",
      // initialize
      "e",
      // events
      "d"
      // dcs
    ];
    var MAX_START_LOOKUP = 200;
    function _fetchTxtRecords(networkFunc) {
      return __awaiter(this, void 0, void 0, function* () {
        const response = yield networkFunc(DNS_QUERY_ENDPOINT, {
          method: "POST",
          headers: {
            "Content-Type": "application/dns-message",
            Accept: "application/dns-message"
          },
          body: FEATURE_ASSETS_DNS_QUERY
        });
        if (!response.ok) {
          const err = new Error("Failed to fetch TXT records from DNS");
          err.name = "DnsTxtFetchError";
          throw err;
        }
        const data = yield response.arrayBuffer();
        const bytes = new Uint8Array(data);
        return _parseDnsResponse(bytes);
      });
    }
    exports._fetchTxtRecords = _fetchTxtRecords;
    function _parseDnsResponse(input) {
      const start = input.findIndex((byte, index) => index < MAX_START_LOOKUP && String.fromCharCode(byte) === "=" && DOMAIN_CHARS.includes(String.fromCharCode(input[index - 1])));
      if (start === -1) {
        const err = new Error("Failed to parse TXT records from DNS");
        err.name = "DnsTxtParseError";
        throw err;
      }
      let result = "";
      for (let i = start - 1; i < input.length; i++) {
        result += String.fromCharCode(input[i]);
      }
      return result.split(",");
    }
  }
});

// node_modules/@statsig/client-core/src/StorageProvider.js
var require_StorageProvider = __commonJS({
  "node_modules/@statsig/client-core/src/StorageProvider.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports._setObjectInStorage = exports._getObjectFromStorage = exports.Storage = void 0;
    var Log_1 = require_Log();
    var SafeJs_1 = require_SafeJs();
    var inMemoryStore = {};
    var _inMemoryProvider = {
      isReady: () => true,
      isReadyResolver: () => null,
      getProviderName: () => "InMemory",
      getItem: (key) => inMemoryStore[key] ? inMemoryStore[key] : null,
      setItem: (key, value) => {
        inMemoryStore[key] = value;
      },
      removeItem: (key) => {
        delete inMemoryStore[key];
      },
      getAllKeys: () => Object.keys(inMemoryStore)
    };
    var _localStorageProvider = null;
    try {
      const win = (0, SafeJs_1._getWindowSafe)();
      if (win && win.localStorage && typeof win.localStorage.getItem === "function") {
        _localStorageProvider = {
          isReady: () => true,
          isReadyResolver: () => null,
          getProviderName: () => "LocalStorage",
          getItem: (key) => win.localStorage.getItem(key),
          setItem: (key, value) => win.localStorage.setItem(key, value),
          removeItem: (key) => win.localStorage.removeItem(key),
          getAllKeys: () => Object.keys(win.localStorage)
        };
      }
    } catch (error) {
      Log_1.Log.warn("Failed to setup localStorageProvider.");
    }
    var _main = _localStorageProvider !== null && _localStorageProvider !== void 0 ? _localStorageProvider : _inMemoryProvider;
    var _current = _main;
    function _inMemoryBreaker(action) {
      try {
        return action();
      } catch (error) {
        if (error instanceof Error && error.name === "SecurityError") {
          exports.Storage._setProvider(_inMemoryProvider);
          return null;
        }
        throw error;
      }
    }
    exports.Storage = {
      isReady: () => _current.isReady(),
      isReadyResolver: () => _current.isReadyResolver(),
      getProviderName: () => _current.getProviderName(),
      getItem: (key) => _inMemoryBreaker(() => _current.getItem(key)),
      setItem: (key, value) => _inMemoryBreaker(() => _current.setItem(key, value)),
      removeItem: (key) => _current.removeItem(key),
      getAllKeys: () => _current.getAllKeys(),
      // StorageProviderManagment
      _setProvider: (newProvider) => {
        _main = newProvider;
        _current = newProvider;
      },
      _setDisabled: (isDisabled) => {
        if (isDisabled) {
          _current = _inMemoryProvider;
        } else {
          _current = _main;
        }
      }
    };
    function _getObjectFromStorage(key) {
      const value = exports.Storage.getItem(key);
      try {
        return JSON.parse(value !== null && value !== void 0 ? value : "null");
      } catch (e) {
        Log_1.Log.error(`Failed to parse value for key "${key}"`);
        return null;
      }
    }
    exports._getObjectFromStorage = _getObjectFromStorage;
    function _setObjectInStorage(key, obj) {
      exports.Storage.setItem(key, JSON.stringify(obj));
    }
    exports._setObjectInStorage = _setObjectInStorage;
  }
});

// node_modules/@statsig/client-core/src/NetworkFallbackResolver.js
var require_NetworkFallbackResolver = __commonJS({
  "node_modules/@statsig/client-core/src/NetworkFallbackResolver.js"(exports) {
    "use strict";
    var __awaiter = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports._isDomainFailure = exports.NetworkFallbackResolver = void 0;
    var DnsTxtQuery_1 = require_DnsTxtQuery();
    var Hashing_1 = require_Hashing();
    var Log_1 = require_Log();
    var StorageProvider_1 = require_StorageProvider();
    var DEFAULT_TTL_MS = 7 * 24 * 60 * 60 * 1e3;
    var COOLDOWN_TIME_MS = 4 * 60 * 60 * 1e3;
    var NetworkFallbackResolver = class {
      constructor(options) {
        var _a;
        this._fallbackInfo = null;
        this._errorBoundary = null;
        this._dnsQueryCooldowns = {};
        this._networkOverrideFunc = (_a = options.networkConfig) === null || _a === void 0 ? void 0 : _a.networkOverrideFunc;
      }
      setErrorBoundary(errorBoundary) {
        this._errorBoundary = errorBoundary;
      }
      tryBumpExpiryTime(sdkKey, urlConfig) {
        var _a;
        const info = (_a = this._fallbackInfo) === null || _a === void 0 ? void 0 : _a[urlConfig.endpoint];
        if (!info) {
          return;
        }
        info.expiryTime = Date.now() + DEFAULT_TTL_MS;
        _tryWriteFallbackInfoToCache(sdkKey, Object.assign(Object.assign({}, this._fallbackInfo), { [urlConfig.endpoint]: info }));
      }
      getActiveFallbackUrl(sdkKey, urlConfig) {
        var _a, _b;
        if (urlConfig.customUrl != null && urlConfig.fallbackUrls != null) {
          return null;
        }
        let info = this._fallbackInfo;
        if (info == null) {
          info = (_a = _readFallbackInfoFromCache(sdkKey)) !== null && _a !== void 0 ? _a : {};
          this._fallbackInfo = info;
        }
        const entry = info[urlConfig.endpoint];
        if (!entry || Date.now() > ((_b = entry.expiryTime) !== null && _b !== void 0 ? _b : 0) || urlConfig.getChecksum() !== entry.urlConfigChecksum) {
          delete info[urlConfig.endpoint];
          this._fallbackInfo = info;
          _tryWriteFallbackInfoToCache(sdkKey, this._fallbackInfo);
          return null;
        }
        if (entry.url) {
          return entry.url;
        }
        return null;
      }
      tryFetchUpdatedFallbackInfo(sdkKey, urlConfig, errorMessage, timedOut) {
        return __awaiter(this, void 0, void 0, function* () {
          var _a, _b;
          try {
            if (!_isDomainFailure(errorMessage, timedOut)) {
              return false;
            }
            const canUseNetworkFallbacks = urlConfig.customUrl == null && urlConfig.fallbackUrls == null;
            const urls = canUseNetworkFallbacks ? yield this._tryFetchFallbackUrlsFromNetwork(urlConfig) : urlConfig.fallbackUrls;
            const newUrl = this._pickNewFallbackUrl((_a = this._fallbackInfo) === null || _a === void 0 ? void 0 : _a[urlConfig.endpoint], urls);
            if (!newUrl) {
              return false;
            }
            this._updateFallbackInfoWithNewUrl(sdkKey, urlConfig, newUrl);
            return true;
          } catch (error) {
            (_b = this._errorBoundary) === null || _b === void 0 ? void 0 : _b.logError("tryFetchUpdatedFallbackInfo", error);
            return false;
          }
        });
      }
      _updateFallbackInfoWithNewUrl(sdkKey, urlConfig, newUrl) {
        var _a, _b, _c;
        const newFallbackInfo = {
          urlConfigChecksum: urlConfig.getChecksum(),
          url: newUrl,
          expiryTime: Date.now() + DEFAULT_TTL_MS,
          previous: []
        };
        const endpoint = urlConfig.endpoint;
        const previousInfo = (_a = this._fallbackInfo) === null || _a === void 0 ? void 0 : _a[endpoint];
        if (previousInfo) {
          newFallbackInfo.previous.push(...previousInfo.previous);
        }
        if (newFallbackInfo.previous.length > 10) {
          newFallbackInfo.previous = [];
        }
        const previousUrl = (_c = (_b = this._fallbackInfo) === null || _b === void 0 ? void 0 : _b[endpoint]) === null || _c === void 0 ? void 0 : _c.url;
        if (previousUrl != null) {
          newFallbackInfo.previous.push(previousUrl);
        }
        this._fallbackInfo = Object.assign(Object.assign({}, this._fallbackInfo), { [endpoint]: newFallbackInfo });
        _tryWriteFallbackInfoToCache(sdkKey, this._fallbackInfo);
      }
      _tryFetchFallbackUrlsFromNetwork(urlConfig) {
        return __awaiter(this, void 0, void 0, function* () {
          var _a;
          const cooldown = this._dnsQueryCooldowns[urlConfig.endpoint];
          if (cooldown && Date.now() < cooldown) {
            return null;
          }
          this._dnsQueryCooldowns[urlConfig.endpoint] = Date.now() + COOLDOWN_TIME_MS;
          const result = [];
          const records = yield (0, DnsTxtQuery_1._fetchTxtRecords)((_a = this._networkOverrideFunc) !== null && _a !== void 0 ? _a : fetch);
          const path = _extractPathFromUrl(urlConfig.defaultUrl);
          for (const record of records) {
            if (!record.startsWith(urlConfig.endpointDnsKey + "=")) {
              continue;
            }
            const parts = record.split("=");
            if (parts.length > 1) {
              let baseUrl = parts[1];
              if (baseUrl.endsWith("/")) {
                baseUrl = baseUrl.slice(0, -1);
              }
              result.push(`https://${baseUrl}${path}`);
            }
          }
          return result;
        });
      }
      _pickNewFallbackUrl(currentFallbackInfo, urls) {
        var _a;
        if (urls == null) {
          return null;
        }
        const previouslyUsed = new Set((_a = currentFallbackInfo === null || currentFallbackInfo === void 0 ? void 0 : currentFallbackInfo.previous) !== null && _a !== void 0 ? _a : []);
        const currentFallbackUrl = currentFallbackInfo === null || currentFallbackInfo === void 0 ? void 0 : currentFallbackInfo.url;
        let found = null;
        for (const loopUrl of urls) {
          const url = loopUrl.endsWith("/") ? loopUrl.slice(0, -1) : loopUrl;
          if (!previouslyUsed.has(loopUrl) && url !== currentFallbackUrl) {
            found = url;
            break;
          }
        }
        return found;
      }
    };
    exports.NetworkFallbackResolver = NetworkFallbackResolver;
    function _isDomainFailure(errorMsg, timedOut) {
      var _a;
      const lowerErrorMsg = (_a = errorMsg === null || errorMsg === void 0 ? void 0 : errorMsg.toLowerCase()) !== null && _a !== void 0 ? _a : "";
      return timedOut || lowerErrorMsg.includes("uncaught exception") || lowerErrorMsg.includes("failed to fetch") || lowerErrorMsg.includes("networkerror when attempting to fetch resource");
    }
    exports._isDomainFailure = _isDomainFailure;
    function _getFallbackInfoStorageKey(sdkKey) {
      return `statsig.network_fallback.${(0, Hashing_1._DJB2)(sdkKey)}`;
    }
    function _tryWriteFallbackInfoToCache(sdkKey, info) {
      const hashKey = _getFallbackInfoStorageKey(sdkKey);
      if (!info || Object.keys(info).length === 0) {
        StorageProvider_1.Storage.removeItem(hashKey);
        return;
      }
      StorageProvider_1.Storage.setItem(hashKey, JSON.stringify(info));
    }
    function _readFallbackInfoFromCache(sdkKey) {
      const hashKey = _getFallbackInfoStorageKey(sdkKey);
      const data = StorageProvider_1.Storage.getItem(hashKey);
      if (!data) {
        return null;
      }
      try {
        return JSON.parse(data);
      } catch (_a) {
        Log_1.Log.error("Failed to parse FallbackInfo");
        return null;
      }
    }
    function _extractPathFromUrl(urlString) {
      try {
        const url = new URL(urlString);
        return url.pathname;
      } catch (error) {
        return null;
      }
    }
  }
});

// node_modules/@statsig/client-core/src/SDKFlags.js
var require_SDKFlags = __commonJS({
  "node_modules/@statsig/client-core/src/SDKFlags.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SDKFlags = void 0;
    var FLAGMAP = {};
    exports.SDKFlags = {
      setFlags: (sdkKey, flags) => {
        FLAGMAP[sdkKey] = flags;
      },
      get: (sdkKey, flagKey) => {
        var _a, _b;
        return (_b = (_a = FLAGMAP[sdkKey]) === null || _a === void 0 ? void 0 : _a[flagKey]) !== null && _b !== void 0 ? _b : false;
      }
    };
  }
});

// node_modules/@statsig/client-core/src/SDKType.js
var require_SDKType = __commonJS({
  "node_modules/@statsig/client-core/src/SDKType.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SDKType = void 0;
    var SDK_CLIENT = {};
    var suffix;
    exports.SDKType = {
      _get: (sdkKey) => {
        var _a;
        return ((_a = SDK_CLIENT[sdkKey]) !== null && _a !== void 0 ? _a : "js-mono") + (suffix !== null && suffix !== void 0 ? suffix : "");
      },
      _setClientType(sdkKey, client) {
        SDK_CLIENT[sdkKey] = client;
      },
      _setBindingType(binding) {
        if (!suffix || suffix === "-react") {
          suffix = "-" + binding;
        }
      }
    };
  }
});

// node_modules/@statsig/client-core/src/UUID.js
var require_UUID = __commonJS({
  "node_modules/@statsig/client-core/src/UUID.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getUUID = void 0;
    function getUUID() {
      if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
        return crypto.randomUUID();
      }
      let d = (/* @__PURE__ */ new Date()).getTime();
      let d2 = typeof performance !== "undefined" && performance.now && performance.now() * 1e3 || 0;
      const y = "89ab"[Math.floor(Math.random() * 4)];
      return `xxxxxxxx-xxxx-4xxx-${y}xxx-xxxxxxxxxxxx`.replace(/[xy]/g, (c) => {
        let r = Math.random() * 16;
        if (d > 0) {
          r = (d + r) % 16 | 0;
          d = Math.floor(d / 16);
        } else {
          r = (d2 + r) % 16 | 0;
          d2 = Math.floor(d2 / 16);
        }
        return (c === "x" ? r : r & 7 | 8).toString(16);
      });
    }
    exports.getUUID = getUUID;
  }
});

// node_modules/@statsig/client-core/src/SessionID.js
var require_SessionID = __commonJS({
  "node_modules/@statsig/client-core/src/SessionID.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.StatsigSession = exports.SessionID = void 0;
    var CacheKey_1 = require_CacheKey();
    var Log_1 = require_Log();
    var StorageProvider_1 = require_StorageProvider();
    var UUID_1 = require_UUID();
    var VisibilityObserving_1 = require_VisibilityObserving();
    var MAX_SESSION_IDLE_TIME = 30 * 60 * 1e3;
    var MAX_SESSION_AGE = 4 * 60 * 60 * 1e3;
    var PERSIST_THROTTLE_MS = 15e3;
    var SESSION_MAP = {};
    (0, VisibilityObserving_1._subscribeToVisiblityChanged)((visibility) => {
      if (visibility === "background") {
        Object.values(SESSION_MAP).forEach((session) => _persistNow(session));
      }
    });
    exports.SessionID = {
      get: (sdkKey) => {
        return exports.StatsigSession.get(sdkKey).data.sessionID;
      }
    };
    exports.StatsigSession = {
      get: (sdkKey, bumpSession = true) => {
        if (SESSION_MAP[sdkKey] == null) {
          SESSION_MAP[sdkKey] = _loadOrCreateSharedSession(sdkKey);
        }
        const session = SESSION_MAP[sdkKey];
        return _maybeBumpSession(session, bumpSession);
      },
      overrideInitialSessionID: (override, sdkKey) => {
        const now = Date.now();
        const session = {
          data: {
            sessionID: override,
            startTime: now,
            lastUpdate: now
          },
          sdkKey,
          lastPersistedAt: Date.now(),
          storageKey: _getSessionIDStorageKey(sdkKey)
        };
        _persistNow(session);
        SESSION_MAP[sdkKey] = session;
      },
      checkForIdleSession: (sdkKey) => {
        const session = SESSION_MAP[sdkKey];
        if (!session) {
          return;
        }
        const sessionExpired = _checkForExpiredSession(session);
        if (sessionExpired) {
          _persistNow(session);
        }
      }
    };
    function _maybeBumpSession(session, allowSessionBump) {
      const now = Date.now();
      const sessionExpired = _checkForExpiredSession(session);
      if (sessionExpired) {
        _persistNow(session);
      } else if (allowSessionBump) {
        session.data.lastUpdate = now;
        _persistThrottled(session);
      }
      return session;
    }
    function _checkForExpiredSession(session) {
      var _a;
      const data = session.data;
      const sessionExpired = _isIdle(data) || _hasRunTooLong(data);
      if (sessionExpired) {
        session.data = _newSessionData();
        (_a = __STATSIG__ === null || __STATSIG__ === void 0 ? void 0 : __STATSIG__.instance(session.sdkKey)) === null || _a === void 0 ? void 0 : _a.$emt({ name: "session_expired" });
      }
      return sessionExpired;
    }
    function _isIdle({ lastUpdate }) {
      return Date.now() - lastUpdate > MAX_SESSION_IDLE_TIME;
    }
    function _hasRunTooLong({ startTime }) {
      return Date.now() - startTime > MAX_SESSION_AGE;
    }
    function _getSessionIDStorageKey(sdkKey) {
      return `statsig.session_id.${(0, CacheKey_1._getStorageKey)(sdkKey)}`;
    }
    function _persistNow(session) {
      try {
        (0, StorageProvider_1._setObjectInStorage)(session.storageKey, session.data);
        session.lastPersistedAt = Date.now();
      } catch (e) {
        Log_1.Log.warn("Failed to save SessionID");
      }
    }
    function _persistThrottled(session) {
      const now = Date.now();
      if (now - session.lastPersistedAt > PERSIST_THROTTLE_MS) {
        _persistNow(session);
      }
    }
    function _loadSessionFromStorage(storageKey) {
      const data = (0, StorageProvider_1._getObjectFromStorage)(storageKey);
      return data;
    }
    function _loadOrCreateSharedSession(sdkKey) {
      const storageKey = _getSessionIDStorageKey(sdkKey);
      const existing = _loadSessionFromStorage(storageKey);
      if (existing && existing.sessionID && existing.startTime && existing.lastUpdate) {
        return { data: existing, sdkKey, lastPersistedAt: 0, storageKey };
      }
      return {
        data: _newSessionData(),
        sdkKey,
        lastPersistedAt: 0,
        storageKey
      };
    }
    function _newSessionData() {
      return {
        sessionID: (0, UUID_1.getUUID)(),
        startTime: Date.now(),
        lastUpdate: Date.now()
      };
    }
  }
});

// node_modules/@statsig/client-core/src/StableID.js
var require_StableID = __commonJS({
  "node_modules/@statsig/client-core/src/StableID.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getCookieName = exports.StableID = void 0;
    var CacheKey_1 = require_CacheKey();
    var Log_1 = require_Log();
    var SafeJs_1 = require_SafeJs();
    var StorageProvider_1 = require_StorageProvider();
    var UUID_1 = require_UUID();
    var PROMISE_MAP = {};
    var COOKIE_ENABLED_MAP = {};
    var DISABLED_MAP = {};
    exports.StableID = {
      cookiesEnabled: false,
      randomID: Math.random().toString(36),
      get: (sdkKey) => {
        if (DISABLED_MAP[sdkKey]) {
          return null;
        }
        if (PROMISE_MAP[sdkKey] != null) {
          return PROMISE_MAP[sdkKey];
        }
        let stableID = null;
        stableID = _loadFromCookie(sdkKey);
        if (stableID != null) {
          PROMISE_MAP[sdkKey] = stableID;
          _persistToStorage(stableID, sdkKey);
          return stableID;
        }
        stableID = _loadFromStorage(sdkKey);
        if (stableID == null) {
          stableID = (0, UUID_1.getUUID)();
        }
        _persistToStorage(stableID, sdkKey);
        _persistToCookie(stableID, sdkKey);
        PROMISE_MAP[sdkKey] = stableID;
        return stableID;
      },
      setOverride: (override, sdkKey) => {
        PROMISE_MAP[sdkKey] = override;
        _persistToStorage(override, sdkKey);
        _persistToCookie(override, sdkKey);
      },
      _setCookiesEnabled: (sdkKey, cookiesEnabled) => {
        COOKIE_ENABLED_MAP[sdkKey] = cookiesEnabled;
      },
      _setDisabled: (sdkKey, disabled) => {
        DISABLED_MAP[sdkKey] = disabled;
      }
    };
    function _getStableIDStorageKey(sdkKey) {
      return `statsig.stable_id.${(0, CacheKey_1._getStorageKey)(sdkKey)}`;
    }
    function _persistToStorage(stableID, sdkKey) {
      const storageKey = _getStableIDStorageKey(sdkKey);
      try {
        (0, StorageProvider_1._setObjectInStorage)(storageKey, stableID);
      } catch (e) {
        Log_1.Log.warn("Failed to save StableID to storage");
      }
    }
    function _loadFromStorage(sdkKey) {
      const storageKey = _getStableIDStorageKey(sdkKey);
      return (0, StorageProvider_1._getObjectFromStorage)(storageKey);
    }
    function _loadFromCookie(sdkKey) {
      if (!COOKIE_ENABLED_MAP[sdkKey] || (0, SafeJs_1._getDocumentSafe)() == null) {
        return null;
      }
      const cookies = document.cookie.split(";");
      for (const cookie of cookies) {
        const [key, value] = cookie.trim().split("=");
        if (key === getCookieName(sdkKey)) {
          return decodeURIComponent(value);
        }
      }
      return null;
    }
    function _persistToCookie(stableID, sdkKey) {
      if (!COOKIE_ENABLED_MAP[sdkKey] || (0, SafeJs_1._getDocumentSafe)() == null) {
        return;
      }
      const expiryDate = /* @__PURE__ */ new Date();
      expiryDate.setFullYear(expiryDate.getFullYear() + 1);
      document.cookie = `${getCookieName(sdkKey)}=${encodeURIComponent(stableID)}; expires=${expiryDate.toUTCString()}; path=/`;
    }
    function getCookieName(sdkKey) {
      return `statsig.stable_id.${(0, CacheKey_1._getStorageKey)(sdkKey)}`;
    }
    exports.getCookieName = getCookieName;
  }
});

// node_modules/@statsig/client-core/src/StatsigClientEventEmitter.js
var require_StatsigClientEventEmitter = __commonJS({
  "node_modules/@statsig/client-core/src/StatsigClientEventEmitter.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ErrorTag = void 0;
    exports.ErrorTag = {
      NetworkError: "NetworkError"
    };
  }
});

// node_modules/@statsig/client-core/src/StatsigMetadata.js
var require_StatsigMetadata = __commonJS({
  "node_modules/@statsig/client-core/src/StatsigMetadata.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.StatsigMetadataProvider = exports.SDK_VERSION = void 0;
    exports.SDK_VERSION = "3.32.2";
    var metadata = {
      sdkVersion: exports.SDK_VERSION,
      sdkType: "js-mono"
      // js-mono is overwritten by Precomp and OnDevice clients
    };
    exports.StatsigMetadataProvider = {
      get: () => metadata,
      add: (additions) => {
        metadata = Object.assign(Object.assign({}, metadata), additions);
      }
    };
  }
});

// node_modules/@statsig/client-core/src/StatsigOptionsCommon.js
var require_StatsigOptionsCommon = __commonJS({
  "node_modules/@statsig/client-core/src/StatsigOptionsCommon.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.LoggingEnabledOption = exports.LogEventCompressionMode = void 0;
    exports.LogEventCompressionMode = {
      /** Do not compress request bodies */
      Disabled: "d",
      /** Compress request bodies unless a network proxy is configured */
      Enabled: "e",
      /** Always compress request bodies, even when a proxy is configured */
      Forced: "f"
    };
    exports.LoggingEnabledOption = {
      disabled: "disabled",
      browserOnly: "browser-only",
      always: "always"
    };
  }
});

// node_modules/@statsig/client-core/src/NetworkCore.js
var require_NetworkCore = __commonJS({
  "node_modules/@statsig/client-core/src/NetworkCore.js"(exports) {
    "use strict";
    var __awaiter = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.NetworkCore = exports.RETRYABLE_CODES = void 0;
    require_StatsigGlobal();
    var __StatsigGlobal_1 = require_StatsigGlobal();
    var Diagnostics_1 = require_Diagnostics();
    var Log_1 = require_Log();
    var NetworkConfig_1 = require_NetworkConfig();
    var NetworkFallbackResolver_1 = require_NetworkFallbackResolver();
    var SDKFlags_1 = require_SDKFlags();
    var SDKType_1 = require_SDKType();
    var SafeJs_1 = require_SafeJs();
    var SessionID_1 = require_SessionID();
    var StableID_1 = require_StableID();
    var StatsigClientEventEmitter_1 = require_StatsigClientEventEmitter();
    var StatsigMetadata_1 = require_StatsigMetadata();
    var StatsigOptionsCommon_1 = require_StatsigOptionsCommon();
    var VisibilityObserving_1 = require_VisibilityObserving();
    var DEFAULT_TIMEOUT_MS = 1e4;
    var BACKOFF_BASE_MS = 500;
    var BACKOFF_MAX_MS = 3e4;
    var RATE_LIMIT_WINDOW_MS = 1e3;
    var RATE_LIMIT_MAX_REQ_COUNT = 50;
    var LEAK_RATE = RATE_LIMIT_MAX_REQ_COUNT / RATE_LIMIT_WINDOW_MS;
    exports.RETRYABLE_CODES = /* @__PURE__ */ new Set([
      408,
      500,
      502,
      503,
      504,
      522,
      524,
      599
    ]);
    var NetworkCore = class {
      constructor(options, _emitter) {
        this._emitter = _emitter;
        this._errorBoundary = null;
        this._timeout = DEFAULT_TIMEOUT_MS;
        this._netConfig = {};
        this._options = {};
        this._leakyBucket = {};
        this._lastUsedInitUrl = null;
        if (options) {
          this._options = options;
        }
        if (this._options.networkConfig) {
          this._netConfig = this._options.networkConfig;
        }
        if (this._netConfig.networkTimeoutMs) {
          this._timeout = this._netConfig.networkTimeoutMs;
        }
        this._fallbackResolver = new NetworkFallbackResolver_1.NetworkFallbackResolver(this._options);
        this.setLogEventCompressionMode(this._getLogEventCompressionMode(options));
      }
      setLogEventCompressionMode(mode) {
        this._options.logEventCompressionMode = mode;
      }
      setErrorBoundary(errorBoundary) {
        this._errorBoundary = errorBoundary;
        this._errorBoundary.wrap(this);
        this._errorBoundary.wrap(this._fallbackResolver);
        this._fallbackResolver.setErrorBoundary(errorBoundary);
      }
      isBeaconSupported() {
        return typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function";
      }
      getLastUsedInitUrlAndReset() {
        const tempUrl = this._lastUsedInitUrl;
        this._lastUsedInitUrl = null;
        return tempUrl;
      }
      beacon(args) {
        if (!_ensureValidSdkKey(args)) {
          return false;
        }
        const argsInternal = this._getInternalRequestArgs("POST", args);
        const url = this._getPopulatedURL(argsInternal);
        const nav = navigator;
        return nav.sendBeacon.bind(nav)(url, argsInternal.body);
      }
      post(args) {
        return __awaiter(this, void 0, void 0, function* () {
          const argsInternal = this._getInternalRequestArgs("POST", args);
          this._tryEncodeBody(argsInternal);
          yield this._tryToCompressBody(argsInternal);
          return this._sendRequest(argsInternal);
        });
      }
      get(args) {
        const argsInternal = this._getInternalRequestArgs("GET", args);
        return this._sendRequest(argsInternal);
      }
      _sendRequest(args) {
        return __awaiter(this, void 0, void 0, function* () {
          var _a, _b, _c, _d;
          if (!_ensureValidSdkKey(args)) {
            return null;
          }
          if (this._netConfig.preventAllNetworkTraffic) {
            return null;
          }
          const { method, body, retries, attempt } = args;
          const endpoint = args.urlConfig.endpoint;
          if (this._isRateLimited(endpoint)) {
            Log_1.Log.warn(`Request to ${endpoint} was blocked because you are making requests too frequently.`);
            return null;
          }
          const currentAttempt = attempt !== null && attempt !== void 0 ? attempt : 1;
          let reqTimedOut = false;
          const populatedUrl = this._getPopulatedURL(args);
          let response = null;
          const keepalive = (0, VisibilityObserving_1._isUnloading)();
          try {
            const config = {
              method,
              body,
              headers: Object.assign({}, args.headers),
              priority: args.priority,
              keepalive
            };
            _tryMarkInitStart(args, currentAttempt);
            const bucket = this._leakyBucket[endpoint];
            if (bucket) {
              bucket.lastRequestTime = Date.now();
              this._leakyBucket[endpoint] = bucket;
            }
            const func = (_a = this._netConfig.networkOverrideFunc) !== null && _a !== void 0 ? _a : fetch;
            let timeoutId;
            response = yield Promise.race([
              func(populatedUrl, config).finally(() => clearTimeout(timeoutId)),
              new Promise((_, reject) => {
                timeoutId = setTimeout(() => {
                  reqTimedOut = true;
                  reject(new Error(`Timeout of ${this._timeout}ms expired.`));
                }, this._timeout);
              })
            ]);
            if (!response.ok) {
              const text2 = yield response.text().catch(() => "No Text");
              const err = new Error(`NetworkError: ${populatedUrl} ${text2}`);
              err.name = "NetworkError";
              throw err;
            }
            const text = yield response.text();
            _tryMarkInitEnd(args, response, currentAttempt, text);
            this._fallbackResolver.tryBumpExpiryTime(args.sdkKey, args.urlConfig);
            return {
              body: text,
              code: response.status
            };
          } catch (error) {
            const errorMessage = _getErrorMessage(error);
            const timedOut = _didTimeout(errorMessage !== null && errorMessage !== void 0 ? errorMessage : "", reqTimedOut);
            _tryMarkInitEnd(args, response, currentAttempt, "", error);
            const fallbackUpdated = yield this._fallbackResolver.tryFetchUpdatedFallbackInfo(args.sdkKey, args.urlConfig, errorMessage, timedOut);
            if (fallbackUpdated) {
              args.fallbackUrl = this._fallbackResolver.getActiveFallbackUrl(args.sdkKey, args.urlConfig);
            }
            if (!retries || currentAttempt > retries || !exports.RETRYABLE_CODES.has((_b = response === null || response === void 0 ? void 0 : response.status) !== null && _b !== void 0 ? _b : 500)) {
              (_c = this._emitter) === null || _c === void 0 ? void 0 : _c.call(this, {
                name: "error",
                error,
                tag: StatsigClientEventEmitter_1.ErrorTag.NetworkError,
                requestArgs: args
              });
              const formattedErrorMsg = `A networking error occurred during ${method} request to ${populatedUrl}.`;
              Log_1.Log.error(formattedErrorMsg, errorMessage, error);
              (_d = this._errorBoundary) === null || _d === void 0 ? void 0 : _d.attachErrorIfNoneExists(formattedErrorMsg);
              if (args.preserveFailedStatusCode && response != null) {
                return {
                  body: null,
                  code: response.status
                };
              }
              return null;
            }
            yield _exponentialBackoff(currentAttempt);
            return this._sendRequest(Object.assign(Object.assign({}, args), { retries, attempt: currentAttempt + 1 }));
          }
        });
      }
      _getLogEventCompressionMode(options) {
        let compressionMode = options === null || options === void 0 ? void 0 : options.logEventCompressionMode;
        if (!compressionMode && (options === null || options === void 0 ? void 0 : options.disableCompression) === true) {
          compressionMode = StatsigOptionsCommon_1.LogEventCompressionMode.Disabled;
        }
        if (!compressionMode) {
          compressionMode = StatsigOptionsCommon_1.LogEventCompressionMode.Enabled;
        }
        return compressionMode;
      }
      _isRateLimited(endpoint) {
        var _a;
        const now = Date.now();
        const bucket = (_a = this._leakyBucket[endpoint]) !== null && _a !== void 0 ? _a : {
          count: 0,
          lastRequestTime: now
        };
        const elapsed = now - bucket.lastRequestTime;
        const leakedRequests = Math.floor(elapsed * LEAK_RATE);
        bucket.count = Math.max(0, bucket.count - leakedRequests);
        if (bucket.count >= RATE_LIMIT_MAX_REQ_COUNT) {
          return true;
        }
        bucket.count += 1;
        bucket.lastRequestTime = now;
        this._leakyBucket[endpoint] = bucket;
        return false;
      }
      _getPopulatedURL(args) {
        var _a;
        const url = (_a = args.fallbackUrl) !== null && _a !== void 0 ? _a : args.urlConfig.getUrl();
        if (args.urlConfig.endpoint === NetworkConfig_1.Endpoint._initialize || args.urlConfig.endpoint === NetworkConfig_1.Endpoint._download_config_specs) {
          this._lastUsedInitUrl = url;
        }
        const params = Object.assign({ [NetworkConfig_1.NetworkParam.SdkKey]: args.sdkKey, [NetworkConfig_1.NetworkParam.SdkType]: SDKType_1.SDKType._get(args.sdkKey), [NetworkConfig_1.NetworkParam.SdkVersion]: StatsigMetadata_1.SDK_VERSION, [NetworkConfig_1.NetworkParam.Time]: String(Date.now()), [NetworkConfig_1.NetworkParam.SessionID]: SessionID_1.SessionID.get(args.sdkKey) }, args.params);
        const query = Object.keys(params).map((key) => {
          return `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`;
        }).join("&");
        return `${url}${query ? `?${query}` : ""}`;
      }
      _tryEncodeBody(args) {
        var _a;
        const win = (0, SafeJs_1._getWindowSafe)();
        const body = args.body;
        if (!args.isStatsigEncodable || this._options.disableStatsigEncoding || typeof body !== "string" || (0, __StatsigGlobal_1._getStatsigGlobalFlag)("no-encode") != null || !(win === null || win === void 0 ? void 0 : win.btoa)) {
          return;
        }
        try {
          args.body = win.btoa(body).split("").reverse().join("");
          args.params = Object.assign(Object.assign({}, (_a = args.params) !== null && _a !== void 0 ? _a : {}), { [NetworkConfig_1.NetworkParam.StatsigEncoded]: "1" });
        } catch (e) {
          Log_1.Log.warn(`Request encoding failed for ${args.urlConfig.getUrl()}`, e);
        }
      }
      _tryToCompressBody(args) {
        return __awaiter(this, void 0, void 0, function* () {
          var _a;
          const body = args.body;
          if (typeof body !== "string" || !_allowCompression(args, this._options)) {
            return;
          }
          try {
            const bytes = new TextEncoder().encode(body);
            const stream = new CompressionStream("gzip");
            const writer = stream.writable.getWriter();
            writer.write(bytes).catch(Log_1.Log.error);
            writer.close().catch(Log_1.Log.error);
            const reader = stream.readable.getReader();
            const chunks = [];
            let result;
            while (!(result = yield reader.read()).done) {
              chunks.push(result.value);
            }
            const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
            const combined = new Uint8Array(totalLength);
            let offset = 0;
            for (const chunk of chunks) {
              combined.set(chunk, offset);
              offset += chunk.length;
            }
            args.body = combined;
            args.params = Object.assign(Object.assign({}, (_a = args.params) !== null && _a !== void 0 ? _a : {}), { [NetworkConfig_1.NetworkParam.IsGzipped]: "1" });
          } catch (e) {
            Log_1.Log.warn(`Request compression failed for ${args.urlConfig.getUrl()}`, e);
          }
        });
      }
      _getInternalRequestArgs(method, args) {
        const fallbackUrl = this._fallbackResolver.getActiveFallbackUrl(args.sdkKey, args.urlConfig);
        const result = Object.assign(Object.assign({}, args), {
          method,
          fallbackUrl
        });
        if ("data" in args) {
          _populateRequestBody(result, args.data);
        }
        return result;
      }
    };
    exports.NetworkCore = NetworkCore;
    var _ensureValidSdkKey = (args) => {
      if (!args.sdkKey) {
        Log_1.Log.warn("Unable to make request without an SDK key");
        return false;
      }
      return true;
    };
    var _populateRequestBody = (args, data) => {
      const { sdkKey, fallbackUrl } = args;
      const stableID = StableID_1.StableID.get(sdkKey);
      const sessionID = SessionID_1.SessionID.get(sdkKey);
      const sdkType = SDKType_1.SDKType._get(sdkKey);
      args.body = JSON.stringify(Object.assign(Object.assign({}, data), { statsigMetadata: Object.assign(Object.assign({}, StatsigMetadata_1.StatsigMetadataProvider.get()), {
        stableID,
        sessionID,
        sdkType,
        fallbackUrl
      }) }));
    };
    function _allowCompression(args, options) {
      if (!args.isCompressable) {
        return false;
      }
      if ((0, __StatsigGlobal_1._getStatsigGlobalFlag)("no-compress") != null || typeof CompressionStream === "undefined" || typeof TextEncoder === "undefined") {
        return false;
      }
      const isProxy = args.urlConfig.customUrl != null || args.urlConfig.fallbackUrls != null;
      const flagEnabled = SDKFlags_1.SDKFlags.get(args.sdkKey, "enable_log_event_compression") === true;
      switch (options.logEventCompressionMode) {
        case StatsigOptionsCommon_1.LogEventCompressionMode.Disabled:
          return false;
        case StatsigOptionsCommon_1.LogEventCompressionMode.Enabled:
          if (isProxy && !flagEnabled) {
            return false;
          }
          return true;
        case StatsigOptionsCommon_1.LogEventCompressionMode.Forced:
          return true;
        default:
          return false;
      }
    }
    function _getErrorMessage(error) {
      if (typeof error === "string") {
        return error;
      }
      if (error instanceof Error) {
        return `${error.name}: ${error.message}`;
      }
      return "Unknown Error";
    }
    function _didTimeout(errorMsg, abortedByTimeout) {
      const timeout = errorMsg.includes("Timeout");
      return timeout || abortedByTimeout;
    }
    function _tryMarkInitStart(args, attempt) {
      if (args.urlConfig.endpoint !== NetworkConfig_1.Endpoint._initialize) {
        return;
      }
      Diagnostics_1.Diagnostics._markInitNetworkReqStart(args.sdkKey, {
        attempt
      });
    }
    function _tryMarkInitEnd(args, response, attempt, body, err) {
      if (args.urlConfig.endpoint !== NetworkConfig_1.Endpoint._initialize) {
        return;
      }
      Diagnostics_1.Diagnostics._markInitNetworkReqEnd(args.sdkKey, Diagnostics_1.Diagnostics._getDiagnosticsData(response, attempt, body, err));
    }
    function _exponentialBackoff(attempt) {
      return __awaiter(this, void 0, void 0, function* () {
        yield new Promise((r) => setTimeout(r, Math.min(BACKOFF_BASE_MS * (attempt * attempt), BACKOFF_MAX_MS)));
      });
    }
  }
});

// node_modules/@statsig/client-core/src/FlushCoordinator.js
var require_FlushCoordinator = __commonJS({
  "node_modules/@statsig/client-core/src/FlushCoordinator.js"(exports) {
    "use strict";
    var __awaiter = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.FlushCoordinator = void 0;
    var EventRetryConstants_1 = require_EventRetryConstants();
    var EventSender_1 = require_EventSender();
    var FlushInterval_1 = require_FlushInterval();
    var FlushTypes_1 = require_FlushTypes();
    var Hashing_1 = require_Hashing();
    var Log_1 = require_Log();
    var NetworkCore_1 = require_NetworkCore();
    var SafeJs_1 = require_SafeJs();
    var SessionID_1 = require_SessionID();
    var StatsigOptionsCommon_1 = require_StatsigOptionsCommon();
    var StorageProvider_1 = require_StorageProvider();
    var FlushCoordinator = class {
      constructor(batchQueue, pendingEvents, onPrepareFlush, sdkKey, network, emitter, logEventUrlConfig, options, loggingEnabled, errorBoundary) {
        this._cooldownTimer = null;
        this._maxIntervalTimer = null;
        this._hasRunQuickFlush = false;
        this._currentFlushPromise = null;
        this._creationTime = Date.now();
        this._isShuttingDown = false;
        this._storageKey = null;
        this._flushInterval = new FlushInterval_1.FlushInterval();
        this._batchQueue = batchQueue;
        this._pendingEvents = pendingEvents;
        this._onPrepareFlush = onPrepareFlush;
        this._errorBoundary = errorBoundary;
        this._sdkKey = sdkKey;
        this._loggingEnabled = loggingEnabled;
        this._eventSender = new EventSender_1.EventSender(sdkKey, network, emitter, logEventUrlConfig, options);
      }
      setLoggingEnabled(loggingEnabled) {
        this._loggingEnabled = loggingEnabled;
      }
      setLogEventCompressionMode(mode) {
        this._eventSender.setLogEventCompressionMode(mode);
      }
      startScheduledFlushCycle() {
        this._scheduleNextFlush();
      }
      stopScheduledFlushCycle() {
        this._clearAllTimers();
      }
      addEvent(event) {
        this._pendingEvents.addToPendingEventsQueue(event);
        if (this._currentFlushPromise) {
          return;
        }
        if (this._pendingEvents.hasEventsForFullBatch()) {
          this.processLimitFlush();
        }
      }
      processManualFlush() {
        return __awaiter(this, void 0, void 0, function* () {
          if (this._currentFlushPromise) {
            yield this._currentFlushPromise;
          }
          this._currentFlushPromise = this._executeFlush(FlushTypes_1.FlushType.Manual).finally(() => {
            this._currentFlushPromise = null;
            this._scheduleNextFlush();
          });
          return this._currentFlushPromise;
        });
      }
      processShutdown() {
        return __awaiter(this, void 0, void 0, function* () {
          this._isShuttingDown = true;
          this._clearAllTimers();
          if (this._currentFlushPromise) {
            yield this._currentFlushPromise;
          }
          this._currentFlushPromise = this._executeFlush(FlushTypes_1.FlushType.Shutdown).catch((error) => {
            Log_1.Log.error(`Error during shutdown flush: ${error}`);
          }).finally(() => {
            this._currentFlushPromise = null;
          });
          return this._currentFlushPromise;
        });
      }
      _executeFlush(flushType) {
        return __awaiter(this, void 0, void 0, function* () {
          this._clearAllTimers();
          try {
            this._prepareQueueForFlush(flushType);
            const batches = this._batchQueue.takeAllBatches();
            if (batches.length === 0) {
              return;
            }
            yield Promise.all(batches.map((batch) => this._processOneBatch(batch, flushType)));
          } finally {
            if (!this._isShuttingDown) {
              this._scheduleNextFlush();
            }
          }
        });
      }
      checkQuickFlush() {
        if (this._hasRunQuickFlush) {
          return;
        }
        if (Date.now() - this._creationTime > EventRetryConstants_1.EventRetryConstants.QUICK_FLUSH_WINDOW_MS) {
          return;
        }
        this._hasRunQuickFlush = true;
        setTimeout(() => {
          this.processManualFlush().catch((error) => {
            Log_1.Log.warn("Quick flush failed:", error);
          });
        }, EventRetryConstants_1.EventRetryConstants.QUICK_FLUSH_WINDOW_MS);
      }
      _attemptScheduledFlush() {
        if (this._currentFlushPromise) {
          this._scheduleNextFlush();
          return;
        }
        const shouldFlushBySize = this.containsAtLeastOneFullBatch();
        const shouldFlushByTime = this._flushInterval.hasReachedMaxInterval();
        if (!shouldFlushBySize && !shouldFlushByTime) {
          this._scheduleNoopPollTick();
          return;
        }
        this._flushInterval.markFlushAttempt();
        let flushType;
        if (shouldFlushBySize) {
          flushType = FlushTypes_1.FlushType.ScheduledFullBatch;
        } else {
          flushType = FlushTypes_1.FlushType.ScheduledMaxTime;
        }
        this._currentFlushPromise = this._processNextBatch(flushType).then(() => {
        }).catch((error) => {
          Log_1.Log.error("Error during scheduled flush:", error);
        }).finally(() => {
          this._currentFlushPromise = null;
          this._scheduleNextFlush();
        });
      }
      processLimitFlush() {
        if (!this._flushInterval.hasCompletelyRecoveredFromBackoff()) {
          return;
        }
        if (this._currentFlushPromise) {
          return;
        }
        this._currentFlushPromise = this._processLimitFlushInternal().catch((error) => {
          Log_1.Log.error(`Error during limit flush`, error);
        }).finally(() => {
          this._currentFlushPromise = null;
          this._scheduleNextFlush();
        });
      }
      _processLimitFlushInternal() {
        return __awaiter(this, void 0, void 0, function* () {
          const success = yield this._processNextBatch(FlushTypes_1.FlushType.Limit);
          if (!success) {
            return;
          }
          while (this._flushInterval.hasCompletelyRecoveredFromBackoff() && this.containsAtLeastOneFullBatch()) {
            const success2 = yield this._processNextBatch(FlushTypes_1.FlushType.Limit);
            if (!success2) {
              break;
            }
          }
        });
      }
      _scheduleNextFlush() {
        this._clearAllTimers();
        if (this._isShuttingDown) {
          return;
        }
        const cooldownDelay = Math.max(0, this._flushInterval.getTimeUntilNextFlush());
        this._cooldownTimer = setTimeout(() => {
          this._cooldownTimer = null;
          SessionID_1.StatsigSession.checkForIdleSession(this._sdkKey);
          this._attemptScheduledFlush();
        }, cooldownDelay);
        const maxIntervalDelay = Math.max(0, this._flushInterval.getTimeTillMaxInterval());
        this._maxIntervalTimer = setTimeout(() => {
          this._maxIntervalTimer = null;
          SessionID_1.StatsigSession.checkForIdleSession(this._sdkKey);
          this._attemptScheduledFlush();
        }, maxIntervalDelay);
      }
      _clearAllTimers() {
        if (this._cooldownTimer !== null) {
          clearTimeout(this._cooldownTimer);
          this._cooldownTimer = null;
        }
        if (this._maxIntervalTimer !== null) {
          clearTimeout(this._maxIntervalTimer);
          this._maxIntervalTimer = null;
        }
      }
      _scheduleNoopPollTick() {
        this._clearAllTimers();
        if (this._isShuttingDown) {
          return;
        }
        this._cooldownTimer = setTimeout(() => {
          this._cooldownTimer = null;
          SessionID_1.StatsigSession.checkForIdleSession(this._sdkKey);
          this._attemptScheduledFlush();
        }, EventRetryConstants_1.EventRetryConstants.TICK_INTERVAL_MS);
        const maxIntervalDelay = Math.max(0, this._flushInterval.getTimeTillMaxInterval());
        this._maxIntervalTimer = setTimeout(() => {
          this._maxIntervalTimer = null;
          SessionID_1.StatsigSession.checkForIdleSession(this._sdkKey);
          this._attemptScheduledFlush();
        }, maxIntervalDelay);
      }
      _processNextBatch(flushType) {
        return __awaiter(this, void 0, void 0, function* () {
          this._prepareQueueForFlush(flushType);
          const batch = this._batchQueue.takeNextBatch();
          if (!batch) {
            return false;
          }
          return this._processOneBatch(batch, flushType);
        });
      }
      _processOneBatch(batch, flushType) {
        return __awaiter(this, void 0, void 0, function* () {
          if (this._loggingEnabled !== StatsigOptionsCommon_1.LoggingEnabledOption.always && (0, SafeJs_1._isServerEnv)()) {
            this._flushInterval.adjustForSuccess();
            return true;
          }
          const result = yield this._eventSender.sendBatch(batch);
          if (result.success) {
            this._flushInterval.adjustForSuccess();
            return true;
          }
          this._flushInterval.adjustForFailure();
          this._handleFailure(batch, flushType, result.statusCode);
          return false;
        });
      }
      _prepareQueueForFlush(flushType) {
        this._onPrepareFlush();
        const droppedCount = this.convertPendingEventsToBatches();
        if (droppedCount > 0) {
          Log_1.Log.warn(`Dropped ${droppedCount} events`);
          this._errorBoundary.logDroppedEvents(droppedCount, `Batch queue limit reached during batching`, {
            loggingInterval: this._flushInterval.getCurrentIntervalMs(),
            batchSize: this._batchQueue.batchSize(),
            maxPendingBatches: EventRetryConstants_1.EventRetryConstants.MAX_PENDING_BATCHES,
            flushType,
            retries: "dropped before batching"
          });
        }
      }
      containsAtLeastOneFullBatch() {
        return this._pendingEvents.hasEventsForFullBatch() || this._batchQueue.hasFullBatch();
      }
      convertPendingEventsToBatches() {
        if (this._pendingEvents.isEmpty()) {
          return 0;
        }
        const allEvents = this._pendingEvents.takeAll();
        return this._batchQueue.createBatches(allEvents);
      }
      _handleFailure(batch, flushType, statusCode) {
        if (flushType === FlushTypes_1.FlushType.Shutdown) {
          Log_1.Log.warn(`${flushType} flush failed during shutdown. ${batch.events.length} event(s) will be saved to storage for retry in next session.`);
          this._saveShutdownFailedEventsToStorage(batch.events);
          return;
        }
        if (!NetworkCore_1.RETRYABLE_CODES.has(statusCode)) {
          Log_1.Log.warn(`${flushType} flush failed after ${batch.attempts} attempt(s). ${batch.events.length} event(s) will be dropped. Non-retryable error: ${statusCode}`);
          this._errorBoundary.logEventRequestFailure(batch.events.length, `non-retryable error`, flushType, statusCode, batch.attempts);
          return;
        }
        if (batch.attempts >= EventRetryConstants_1.EventRetryConstants.MAX_RETRY_ATTEMPTS) {
          Log_1.Log.warn(`${flushType} flush failed after ${batch.attempts} attempt(s). ${batch.events.length} event(s) will be dropped.`);
          this._errorBoundary.logEventRequestFailure(batch.events.length, `max retry attempts exceeded`, flushType, statusCode, batch.attempts);
          return;
        }
        batch.incrementAttempts();
        const droppedCount = this._batchQueue.requeueBatch(batch);
        if (droppedCount > 0) {
          Log_1.Log.warn(`Failed to requeue batch : dropped ${droppedCount} events due to full queue`);
          this._errorBoundary.logDroppedEvents(droppedCount, `Batch queue limit reached during requeue`, {
            loggingInterval: this._flushInterval.getCurrentIntervalMs(),
            batchSize: this._batchQueue.batchSize(),
            maxPendingBatches: EventRetryConstants_1.EventRetryConstants.MAX_PENDING_BATCHES,
            flushType,
            retries: batch.attempts
          });
        }
      }
      loadAndRetryShutdownFailedEvents() {
        return __awaiter(this, void 0, void 0, function* () {
          const storageKey = this._getStorageKey();
          try {
            if (!StorageProvider_1.Storage.isReady()) {
              yield StorageProvider_1.Storage.isReadyResolver();
            }
            const events = this._getShutdownFailedEventsFromStorage(storageKey);
            if (events.length === 0) {
              return;
            }
            Log_1.Log.debug(`Loading ${events.length} failed shutdown event(s) from storage for retry`);
            StorageProvider_1.Storage.removeItem(storageKey);
            events.forEach((event) => {
              this.addEvent(event);
            });
            yield this.processManualFlush();
          } catch (error) {
            Log_1.Log.warn("Failed to load and retry failed shutdown events:", error);
          }
        });
      }
      _getStorageKey() {
        if (!this._storageKey) {
          this._storageKey = `statsig.failed_shutdown_events.${(0, Hashing_1._DJB2)(this._sdkKey)}`;
        }
        return this._storageKey;
      }
      _saveShutdownFailedEventsToStorage(events) {
        const storageKey = this._getStorageKey();
        try {
          const existingEvents = this._getShutdownFailedEventsFromStorage(storageKey);
          let allEvents = [...existingEvents, ...events];
          if (allEvents.length > EventRetryConstants_1.EventRetryConstants.MAX_LOCAL_STORAGE) {
            allEvents = allEvents.slice(-EventRetryConstants_1.EventRetryConstants.MAX_LOCAL_STORAGE);
          }
          (0, StorageProvider_1._setObjectInStorage)(storageKey, allEvents);
          Log_1.Log.debug(`Saved ${events.length} failed shutdown event(s) to storage (total stored: ${allEvents.length})`);
        } catch (error) {
          Log_1.Log.warn("Unable to save failed shutdown events to storage:", error);
        }
      }
      _getShutdownFailedEventsFromStorage(storageKey) {
        try {
          const events = (0, StorageProvider_1._getObjectFromStorage)(storageKey);
          if (Array.isArray(events)) {
            return events;
          }
          return [];
        } catch (_a) {
          return [];
        }
      }
    };
    exports.FlushCoordinator = FlushCoordinator;
  }
});

// node_modules/@statsig/client-core/src/PendingEvents.js
var require_PendingEvents = __commonJS({
  "node_modules/@statsig/client-core/src/PendingEvents.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PendingEvents = void 0;
    var Log_1 = require_Log();
    var PendingEvents = class {
      constructor(batchSize) {
        this._pendingEvents = [];
        this._batchSize = batchSize;
      }
      addToPendingEventsQueue(event) {
        this._pendingEvents.push(event);
        Log_1.Log.debug("Enqueued Event:", event);
      }
      hasEventsForFullBatch() {
        return this._pendingEvents.length >= this._batchSize;
      }
      takeAll() {
        const events = this._pendingEvents;
        this._pendingEvents = [];
        return events;
      }
      isEmpty() {
        return this._pendingEvents.length === 0;
      }
    };
    exports.PendingEvents = PendingEvents;
  }
});

// node_modules/@statsig/client-core/src/StatsigEvent.js
var require_StatsigEvent = __commonJS({
  "node_modules/@statsig/client-core/src/StatsigEvent.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports._createLayerParameterExposure = exports._createConfigExposure = exports._mapExposures = exports._createGateExposure = exports._isExposureEvent = void 0;
    var CONFIG_EXPOSURE_NAME = "statsig::config_exposure";
    var GATE_EXPOSURE_NAME = "statsig::gate_exposure";
    var LAYER_EXPOSURE_NAME = "statsig::layer_exposure";
    var _createExposure = (eventName, user, details, metadata, secondaryExposures) => {
      if (details.bootstrapMetadata) {
        metadata["bootstrapMetadata"] = details.bootstrapMetadata;
      }
      return {
        eventName,
        user,
        value: null,
        metadata: _addEvaluationDetailsToMetadata(details, metadata),
        secondaryExposures,
        time: Date.now()
      };
    };
    var _isExposureEvent = ({ eventName }) => {
      return eventName === GATE_EXPOSURE_NAME || eventName === CONFIG_EXPOSURE_NAME || eventName === LAYER_EXPOSURE_NAME;
    };
    exports._isExposureEvent = _isExposureEvent;
    var _createGateExposure = (user, gate, exposureMapping) => {
      var _a, _b, _c;
      const metadata = {
        gate: gate.name,
        gateValue: String(gate.value),
        ruleID: gate.ruleID
      };
      if (((_a = gate.__evaluation) === null || _a === void 0 ? void 0 : _a.version) != null) {
        metadata["configVersion"] = gate.__evaluation.version;
      }
      return _createExposure(GATE_EXPOSURE_NAME, user, gate.details, metadata, _mapExposures((_c = (_b = gate.__evaluation) === null || _b === void 0 ? void 0 : _b.secondary_exposures) !== null && _c !== void 0 ? _c : [], exposureMapping));
    };
    exports._createGateExposure = _createGateExposure;
    function _mapExposures(exposures, exposureMapping) {
      return exposures.map((exposure) => {
        if (typeof exposure === "string") {
          return (exposureMapping !== null && exposureMapping !== void 0 ? exposureMapping : {})[exposure];
        }
        return exposure;
      }).filter((exposure) => exposure != null);
    }
    exports._mapExposures = _mapExposures;
    var _createConfigExposure = (user, config, exposureMapping) => {
      var _a, _b, _c, _d;
      const metadata = {
        config: config.name,
        ruleID: config.ruleID
      };
      if (((_a = config.__evaluation) === null || _a === void 0 ? void 0 : _a.version) != null) {
        metadata["configVersion"] = config.__evaluation.version;
      }
      if (((_b = config.__evaluation) === null || _b === void 0 ? void 0 : _b.passed) != null) {
        metadata["rulePassed"] = String(config.__evaluation.passed);
      }
      return _createExposure(CONFIG_EXPOSURE_NAME, user, config.details, metadata, _mapExposures((_d = (_c = config.__evaluation) === null || _c === void 0 ? void 0 : _c.secondary_exposures) !== null && _d !== void 0 ? _d : [], exposureMapping));
    };
    exports._createConfigExposure = _createConfigExposure;
    var _createLayerParameterExposure = (user, layer, parameterName, exposureMapping) => {
      var _a, _b, _c, _d, _e, _f, _g;
      const evaluation = layer.__evaluation;
      const isExplicit = ((_a = evaluation === null || evaluation === void 0 ? void 0 : evaluation.explicit_parameters) === null || _a === void 0 ? void 0 : _a.includes(parameterName)) === true;
      let allocatedExperiment = "";
      let secondaryExposures = (_b = evaluation === null || evaluation === void 0 ? void 0 : evaluation.undelegated_secondary_exposures) !== null && _b !== void 0 ? _b : [];
      if (isExplicit) {
        allocatedExperiment = (_c = evaluation.allocated_experiment_name) !== null && _c !== void 0 ? _c : "";
        secondaryExposures = (_d = evaluation.secondary_exposures) !== null && _d !== void 0 ? _d : [];
      }
      const parameterRuleIDs = (_e = layer.__evaluation) === null || _e === void 0 ? void 0 : _e.parameter_rule_ids;
      const metadata = {
        config: layer.name,
        parameterName,
        ruleID: (_f = parameterRuleIDs === null || parameterRuleIDs === void 0 ? void 0 : parameterRuleIDs[parameterName]) !== null && _f !== void 0 ? _f : layer.ruleID,
        allocatedExperiment,
        isExplicitParameter: String(isExplicit)
      };
      if (((_g = layer.__evaluation) === null || _g === void 0 ? void 0 : _g.version) != null) {
        metadata["configVersion"] = layer.__evaluation.version;
      }
      return _createExposure(LAYER_EXPOSURE_NAME, user, layer.details, metadata, _mapExposures(secondaryExposures, exposureMapping));
    };
    exports._createLayerParameterExposure = _createLayerParameterExposure;
    var _addEvaluationDetailsToMetadata = (details, metadata) => {
      metadata["reason"] = details.reason;
      if (details.lcut) {
        metadata["lcut"] = String(details.lcut);
      }
      if (details.receivedAt) {
        metadata["receivedAt"] = String(details.receivedAt);
      }
      return metadata;
    };
  }
});

// node_modules/@statsig/client-core/src/UrlConfiguration.js
var require_UrlConfiguration = __commonJS({
  "node_modules/@statsig/client-core/src/UrlConfiguration.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.UrlConfiguration = void 0;
    var Hashing_1 = require_Hashing();
    var NetworkConfig_1 = require_NetworkConfig();
    var ENDPOINT_DNS_KEY_MAP = {
      [NetworkConfig_1.Endpoint._initialize]: "i",
      [NetworkConfig_1.Endpoint._rgstr]: "e",
      [NetworkConfig_1.Endpoint._download_config_specs]: "d"
    };
    var UrlConfiguration = class {
      constructor(endpoint, customUrl, customApi, fallbackUrls) {
        this.customUrl = null;
        this.fallbackUrls = null;
        this.endpoint = endpoint;
        this.endpointDnsKey = ENDPOINT_DNS_KEY_MAP[endpoint];
        if (customUrl) {
          this.customUrl = customUrl;
        }
        if (!customUrl && customApi) {
          this.customUrl = customApi.endsWith("/") ? `${customApi}${endpoint}` : `${customApi}/${endpoint}`;
        }
        if (fallbackUrls) {
          this.fallbackUrls = fallbackUrls;
        }
        const defaultApi = NetworkConfig_1.NetworkDefault[endpoint];
        this.defaultUrl = `${defaultApi}/${endpoint}`;
      }
      getUrl() {
        var _a;
        return (_a = this.customUrl) !== null && _a !== void 0 ? _a : this.defaultUrl;
      }
      getChecksum() {
        var _a;
        const fallbacks = ((_a = this.fallbackUrls) !== null && _a !== void 0 ? _a : []).sort().join(",");
        return (0, Hashing_1._DJB2)(this.customUrl + fallbacks);
      }
    };
    exports.UrlConfiguration = UrlConfiguration;
  }
});

// node_modules/@statsig/client-core/src/EventLogger.js
var require_EventLogger = __commonJS({
  "node_modules/@statsig/client-core/src/EventLogger.js"(exports) {
    "use strict";
    var __awaiter = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.EventLogger = void 0;
    var BatchedEventsQueue_1 = require_BatchedEventsQueue();
    var CacheKey_1 = require_CacheKey();
    var EventRetryConstants_1 = require_EventRetryConstants();
    var FlushCoordinator_1 = require_FlushCoordinator();
    var Hashing_1 = require_Hashing();
    var Log_1 = require_Log();
    var NetworkConfig_1 = require_NetworkConfig();
    var PendingEvents_1 = require_PendingEvents();
    var SafeJs_1 = require_SafeJs();
    var StatsigEvent_1 = require_StatsigEvent();
    var StatsigOptionsCommon_1 = require_StatsigOptionsCommon();
    var StorageProvider_1 = require_StorageProvider();
    var UrlConfiguration_1 = require_UrlConfiguration();
    var VisibilityObserving_1 = require_VisibilityObserving();
    var MAX_DEDUPER_KEYS = 1e3;
    var DEDUPER_WINDOW_DURATION_MS = 6e5;
    var EVENT_LOGGER_MAP = {};
    var EventLogger = class _EventLogger {
      static _safeFlushAndForget(sdkKey) {
        var _a;
        (_a = EVENT_LOGGER_MAP[sdkKey]) === null || _a === void 0 ? void 0 : _a.flush().catch(() => {
        });
      }
      constructor(_sdkKey, _emitter, _network, _options, _errorBoundary) {
        var _a;
        this._sdkKey = _sdkKey;
        this._emitter = _emitter;
        this._network = _network;
        this._options = _options;
        this._errorBoundary = _errorBoundary;
        this._pendingEvents = null;
        this._batchQueue = null;
        this._flushCoordinator = null;
        this._lastExposureTimeMap = {};
        this._nonExposedChecks = {};
        this._isShuttingDown = false;
        this._storageKey = null;
        this._pendingCompressionMode = null;
        this._loggingEnabled = (_a = _options === null || _options === void 0 ? void 0 : _options.loggingEnabled) !== null && _a !== void 0 ? _a : (_options === null || _options === void 0 ? void 0 : _options.disableLogging) === true ? StatsigOptionsCommon_1.LoggingEnabledOption.disabled : StatsigOptionsCommon_1.LoggingEnabledOption.browserOnly;
        if ((_options === null || _options === void 0 ? void 0 : _options.loggingEnabled) && _options.disableLogging !== void 0) {
          Log_1.Log.warn("Detected both loggingEnabled and disableLogging options. loggingEnabled takes precedence - please remove disableLogging.");
        }
        const config = _options === null || _options === void 0 ? void 0 : _options.networkConfig;
        this._logEventUrlConfig = new UrlConfiguration_1.UrlConfiguration(NetworkConfig_1.Endpoint._rgstr, config === null || config === void 0 ? void 0 : config.logEventUrl, config === null || config === void 0 ? void 0 : config.api, config === null || config === void 0 ? void 0 : config.logEventFallbackUrls);
      }
      setLogEventCompressionMode(mode) {
        if (this._flushCoordinator) {
          this._flushCoordinator.setLogEventCompressionMode(mode);
        } else {
          this._pendingCompressionMode = mode;
        }
      }
      setLoggingEnabled(loggingEnabled) {
        const wasDisabled = this._loggingEnabled === "disabled";
        const isNowEnabled = loggingEnabled !== "disabled";
        this._loggingEnabled = loggingEnabled;
        if (this._flushCoordinator) {
          this._flushCoordinator.setLoggingEnabled(loggingEnabled);
        }
        if (wasDisabled && isNowEnabled) {
          const events = this._loadStoredEvents();
          Log_1.Log.debug(`Loaded ${events.length} stored event(s) from storage`);
          if (events.length > 0) {
            events.forEach((event) => {
              this._initFlushCoordinator().addEvent(event);
            });
            this.flush().catch((error) => {
              Log_1.Log.warn("Failed to flush events after enabling logging:", error);
            });
          }
        }
      }
      enqueue(event) {
        var _a;
        if (!this._shouldLogEvent(event)) {
          return;
        }
        const normalizedEvent = this._normalizeEvent(event);
        if (this._loggingEnabled === "disabled") {
          this._storeEventToStorage(normalizedEvent);
          return;
        }
        this._initFlushCoordinator().addEvent(normalizedEvent);
        (_a = this._flushCoordinator) === null || _a === void 0 ? void 0 : _a.checkQuickFlush();
      }
      incrementNonExposureCount(name) {
        var _a;
        const current = (_a = this._nonExposedChecks[name]) !== null && _a !== void 0 ? _a : 0;
        this._nonExposedChecks[name] = current + 1;
      }
      reset() {
        this.flush().catch(() => {
        });
        this._lastExposureTimeMap = {};
      }
      start() {
        var _a;
        const isServerEnv = (0, SafeJs_1._isServerEnv)();
        if (isServerEnv && ((_a = this._options) === null || _a === void 0 ? void 0 : _a.loggingEnabled) !== "always") {
          return;
        }
        const flushCoordinator = this._initFlushCoordinator();
        EVENT_LOGGER_MAP[this._sdkKey] = this;
        if (!isServerEnv) {
          (0, VisibilityObserving_1._subscribeToVisiblityChanged)((visibility) => {
            if (visibility === "background") {
              _EventLogger._safeFlushAndForget(this._sdkKey);
            } else if (visibility === "foreground") {
              flushCoordinator.startScheduledFlushCycle();
            }
          });
        }
        flushCoordinator.loadAndRetryShutdownFailedEvents().catch((error) => {
          Log_1.Log.warn("Failed to load failed shutdown events:", error);
        });
        flushCoordinator.startScheduledFlushCycle();
      }
      stop() {
        return __awaiter(this, void 0, void 0, function* () {
          this._isShuttingDown = true;
          if (this._flushCoordinator) {
            yield this._flushCoordinator.processShutdown();
          }
          delete EVENT_LOGGER_MAP[this._sdkKey];
          this._flushCoordinator = null;
          this._pendingEvents = null;
          this._batchQueue = null;
        });
      }
      flush() {
        return __awaiter(this, void 0, void 0, function* () {
          if (!this._flushCoordinator) {
            return;
          }
          return this._flushCoordinator.processManualFlush();
        });
      }
      appendAndResetNonExposedChecks() {
        if (Object.keys(this._nonExposedChecks).length === 0) {
          return;
        }
        const checks = Object.assign({}, this._nonExposedChecks);
        this._nonExposedChecks = {};
        const event = this._normalizeEvent({
          eventName: "statsig::non_exposed_checks",
          user: null,
          time: Date.now(),
          metadata: {
            checks
          }
        });
        if (!this._flushCoordinator) {
          return;
        }
        this._flushCoordinator.addEvent(event);
      }
      _shouldLogEvent(event) {
        var _a;
        if (((_a = this._options) === null || _a === void 0 ? void 0 : _a.loggingEnabled) !== "always" && (0, SafeJs_1._isServerEnv)()) {
          return false;
        }
        if (!(0, StatsigEvent_1._isExposureEvent)(event)) {
          return true;
        }
        const user = event.user ? event.user : { statsigEnvironment: void 0 };
        const userKey = (0, CacheKey_1._getUserStorageKey)(this._sdkKey, user);
        const metadata = event.metadata ? event.metadata : {};
        const key = [
          event.eventName,
          userKey,
          metadata["gate"],
          metadata["config"],
          metadata["ruleID"],
          metadata["allocatedExperiment"],
          metadata["parameterName"],
          String(metadata["isExplicitParameter"]),
          metadata["reason"]
        ].join("|");
        const previous = this._lastExposureTimeMap[key];
        const now = Date.now();
        if (previous && now - previous < DEDUPER_WINDOW_DURATION_MS) {
          return false;
        }
        if (Object.keys(this._lastExposureTimeMap).length > MAX_DEDUPER_KEYS) {
          this._lastExposureTimeMap = {};
        }
        this._lastExposureTimeMap[key] = now;
        return true;
      }
      _getCurrentPageUrl() {
        var _a;
        if (((_a = this._options) === null || _a === void 0 ? void 0 : _a.includeCurrentPageUrlWithEvents) === false) {
          return;
        }
        return (0, SafeJs_1._getCurrentPageUrlSafe)();
      }
      _getStorageKey() {
        if (!this._storageKey) {
          this._storageKey = `statsig.pending_events.${(0, Hashing_1._DJB2)(this._sdkKey)}`;
        }
        return this._storageKey;
      }
      _initFlushCoordinator() {
        var _a, _b;
        if (this._flushCoordinator) {
          return this._flushCoordinator;
        }
        const batchSize = (_b = (_a = this._options) === null || _a === void 0 ? void 0 : _a.loggingBufferMaxSize) !== null && _b !== void 0 ? _b : EventRetryConstants_1.EventRetryConstants.DEFAULT_BATCH_SIZE;
        this._pendingEvents = new PendingEvents_1.PendingEvents(batchSize);
        this._batchQueue = new BatchedEventsQueue_1.BatchQueue(batchSize);
        this._flushCoordinator = new FlushCoordinator_1.FlushCoordinator(this._batchQueue, this._pendingEvents, () => this.appendAndResetNonExposedChecks(), this._sdkKey, this._network, this._emitter, this._logEventUrlConfig, this._options, this._loggingEnabled, this._errorBoundary);
        if (this._pendingCompressionMode) {
          this._flushCoordinator.setLogEventCompressionMode(this._pendingCompressionMode);
          this._pendingCompressionMode = null;
        }
        return this._flushCoordinator;
      }
      _storeEventToStorage(event) {
        const storageKey = this._getStorageKey();
        try {
          let existingEvents = this._getEventsFromStorage(storageKey);
          existingEvents.push(event);
          if (existingEvents.length > EventRetryConstants_1.EventRetryConstants.MAX_LOCAL_STORAGE) {
            existingEvents = existingEvents.slice(-EventRetryConstants_1.EventRetryConstants.MAX_LOCAL_STORAGE);
          }
          (0, StorageProvider_1._setObjectInStorage)(storageKey, existingEvents);
        } catch (error) {
          Log_1.Log.warn("Unable to save events to storage");
        }
      }
      _getEventsFromStorage(storageKey) {
        try {
          const events = (0, StorageProvider_1._getObjectFromStorage)(storageKey);
          if (Array.isArray(events)) {
            return events;
          }
          return [];
        } catch (_a) {
          return [];
        }
      }
      _loadStoredEvents() {
        const storageKey = this._getStorageKey();
        const events = this._getEventsFromStorage(storageKey);
        if (events.length > 0) {
          StorageProvider_1.Storage.removeItem(storageKey);
        }
        return events;
      }
      _normalizeEvent(event) {
        if (event.user) {
          event.user = Object.assign({}, event.user);
          delete event.user.privateAttributes;
        }
        const extras = {};
        const currentPage = this._getCurrentPageUrl();
        if (currentPage) {
          extras.statsigMetadata = { currentPage };
        }
        return Object.assign(Object.assign({}, event), extras);
      }
    };
    exports.EventLogger = EventLogger;
  }
});

// node_modules/@statsig/client-core/src/ClientInterfaces.js
var require_ClientInterfaces = __commonJS({
  "node_modules/@statsig/client-core/src/ClientInterfaces.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PrecomputedEvaluationsContextHandle = void 0;
    var Log_1 = require_Log();
    var SafeJs_1 = require_SafeJs();
    var SessionID_1 = require_SessionID();
    var StableID_1 = require_StableID();
    var PrecomputedEvaluationsContextHandle = class {
      constructor(sdkKey, getOptions, getErrorBoundary, getValues, getUser, getSdkInstanceID) {
        this._sdkKey = sdkKey;
        this._getOptions = getOptions;
        this._getErrorBoundary = getErrorBoundary;
        this._getValues = getValues;
        this._getUser = getUser;
        this._getSdkInstanceID = getSdkInstanceID;
      }
      get sdkKey() {
        return this._sdkKey;
      }
      get options() {
        return this._getOptions();
      }
      get errorBoundary() {
        return this._getErrorBoundary();
      }
      get values() {
        return this._getValues();
      }
      get user() {
        let user = (0, SafeJs_1._cloneObject)("StatsigUser", this._getUser());
        if (user == null) {
          Log_1.Log.error("Failed to clone user");
          user = {};
        }
        return user;
      }
      /**
       * Gets the current session.
       * @param {boolean} [bumpSession=true] - Whether to bump/update the session timing. Set to false to read without affecting session state.
       */
      getSession(bumpSession = true) {
        return SessionID_1.StatsigSession.get(this._sdkKey, bumpSession);
      }
      get stableID() {
        return StableID_1.StableID.get(this._sdkKey);
      }
      get sdkInstanceID() {
        return this._getSdkInstanceID();
      }
      /**
       * Returns the full PrecomputedEvaluationsContext object.
       * Use this when you need all fields at once.
       * @param {boolean} [bumpSession=true] - Whether to bump the session when building the context.
       */
      toContext(bumpSession = true) {
        return {
          sdkKey: this.sdkKey,
          options: this.options,
          values: this.values,
          user: this.user,
          errorBoundary: this.errorBoundary,
          session: this.getSession(bumpSession),
          stableID: this.stableID,
          sdkInstanceID: this.sdkInstanceID
        };
      }
    };
    exports.PrecomputedEvaluationsContextHandle = PrecomputedEvaluationsContextHandle;
  }
});

// node_modules/@statsig/client-core/src/StatsigUser.js
var require_StatsigUser = __commonJS({
  "node_modules/@statsig/client-core/src/StatsigUser.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports._getUnitIDFromUser = exports._getFullUserHash = exports._normalizeUser = void 0;
    var Hashing_1 = require_Hashing();
    var Log_1 = require_Log();
    var SafeJs_1 = require_SafeJs();
    function _normalizeUser(original, options, fallbackEnvironment) {
      const copy = (0, SafeJs_1._cloneObject)("StatsigUser", original);
      if (copy == null) {
        Log_1.Log.error("Failed to clone user");
        return { statsigEnvironment: void 0 };
      }
      if (options != null && options.environment != null) {
        copy.statsigEnvironment = options.environment;
      } else if (fallbackEnvironment != null) {
        copy.statsigEnvironment = { tier: fallbackEnvironment };
      }
      return copy;
    }
    exports._normalizeUser = _normalizeUser;
    function _getFullUserHash(user) {
      return user ? (0, Hashing_1._DJB2Object)(user) : null;
    }
    exports._getFullUserHash = _getFullUserHash;
    function _getUnitIDFromUser(user, idType) {
      var _a, _b, _c;
      if (typeof idType !== "string") {
        return user.userID;
      }
      const lowered = idType.toLowerCase();
      if (lowered !== "userid") {
        return (_b = (_a = user.customIDs) === null || _a === void 0 ? void 0 : _a[idType]) !== null && _b !== void 0 ? _b : (_c = user.customIDs) === null || _c === void 0 ? void 0 : _c[lowered];
      }
      return user.userID;
    }
    exports._getUnitIDFromUser = _getUnitIDFromUser;
  }
});

// node_modules/@statsig/client-core/src/TypedJsonParse.js
var require_TypedJsonParse = __commonJS({
  "node_modules/@statsig/client-core/src/TypedJsonParse.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports._typedJsonParse = void 0;
    var Log_1 = require_Log();
    function _typedJsonParse(data, guard, typeName) {
      try {
        const result = JSON.parse(data);
        if (result && typeof result === "object" && guard in result) {
          return result;
        }
      } catch (_a) {
      }
      Log_1.Log.error(`Failed to parse ${typeName}`);
      return null;
    }
    exports._typedJsonParse = _typedJsonParse;
  }
});

// node_modules/@statsig/client-core/src/DataAdapterCore.js
var require_DataAdapterCore = __commonJS({
  "node_modules/@statsig/client-core/src/DataAdapterCore.js"(exports) {
    "use strict";
    var __awaiter = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports._makeDataAdapterResult = exports.DataAdapterCore = void 0;
    var Log_1 = require_Log();
    var StableID_1 = require_StableID();
    var StatsigUser_1 = require_StatsigUser();
    var StorageProvider_1 = require_StorageProvider();
    var TypedJsonParse_1 = require_TypedJsonParse();
    var CACHE_LIMIT = 10;
    var MAX_CACHE_WRITE_ATTEMPTS = 8;
    var DataAdapterCore = class {
      constructor(_adapterName, _cacheSuffix) {
        this._adapterName = _adapterName;
        this._cacheSuffix = _cacheSuffix;
        this._options = null;
        this._sdkKey = null;
        this._cacheLimit = CACHE_LIMIT;
        this._lastModifiedStoreKey = `statsig.last_modified_time.${_cacheSuffix}`;
        this._inMemoryCache = new InMemoryCache();
      }
      attach(sdkKey, options, _network) {
        this._sdkKey = sdkKey;
        this._options = options;
      }
      getDataSync(user) {
        const normalized = user && (0, StatsigUser_1._normalizeUser)(user, this._options);
        const cacheKey = this._getCacheKey(normalized);
        const inMem = this._inMemoryCache.get(cacheKey, normalized);
        if (inMem && this._getIsCacheValueValid(inMem)) {
          return inMem;
        }
        const cache = this._loadFromCache(cacheKey);
        if (cache && this._getIsCacheValueValid(cache)) {
          this._inMemoryCache.add(cacheKey, cache, this._cacheLimit);
          return this._inMemoryCache.get(cacheKey, normalized);
        }
        return null;
      }
      setData(data, user) {
        const normalized = user && (0, StatsigUser_1._normalizeUser)(user, this._options);
        const cacheKey = this._getCacheKey(normalized);
        this._inMemoryCache.add(cacheKey, _makeDataAdapterResult("Bootstrap", data, null, normalized), this._cacheLimit);
      }
      _getIsCacheValueValid(current) {
        return current.stableID == null || current.stableID === StableID_1.StableID.get(this._getSdkKey());
      }
      _getDataAsyncImpl(current, user, options) {
        return __awaiter(this, void 0, void 0, function* () {
          if (!StorageProvider_1.Storage.isReady()) {
            yield StorageProvider_1.Storage.isReadyResolver();
          }
          const cache = current !== null && current !== void 0 ? current : this.getDataSync(user);
          const ops = [this._fetchAndPrepFromNetwork(cache, user, options)];
          if (options === null || options === void 0 ? void 0 : options.timeoutMs) {
            ops.push(new Promise((r) => setTimeout(r, options.timeoutMs)).then(() => {
              Log_1.Log.debug("Fetching latest value timed out");
              return null;
            }));
          }
          return yield Promise.race(ops);
        });
      }
      _prefetchDataImpl(user, options) {
        return __awaiter(this, void 0, void 0, function* () {
          const normalized = user && (0, StatsigUser_1._normalizeUser)(user, this._options);
          const cacheKey = this._getCacheKey(normalized);
          const result = yield this._getDataAsyncImpl(null, normalized, options);
          if (result) {
            this._inMemoryCache.add(cacheKey, Object.assign(Object.assign({}, result), { source: "Prefetch" }), this._cacheLimit);
          }
        });
      }
      _fetchAndPrepFromNetwork(cachedResult, user, options) {
        return __awaiter(this, void 0, void 0, function* () {
          var _a;
          const cachedData = (_a = cachedResult === null || cachedResult === void 0 ? void 0 : cachedResult.data) !== null && _a !== void 0 ? _a : null;
          const isCacheValidFor204 = cachedResult != null && this._isCachedResultValidFor204(cachedResult, user);
          const latest = yield this._fetchFromNetwork(cachedData, user, options, isCacheValidFor204);
          if (!latest) {
            Log_1.Log.debug("No response returned for latest value");
            return null;
          }
          const response = (0, TypedJsonParse_1._typedJsonParse)(latest, "has_updates", "Response");
          const sdkKey = this._getSdkKey();
          const stableID = StableID_1.StableID.get(sdkKey);
          let result = null;
          if ((response === null || response === void 0 ? void 0 : response.has_updates) === true) {
            result = _makeDataAdapterResult("Network", latest, stableID, user);
          } else if (cachedData && (response === null || response === void 0 ? void 0 : response.has_updates) === false) {
            result = _makeDataAdapterResult("NetworkNotModified", cachedData, stableID, user);
          } else {
            return null;
          }
          const cacheKey = this._getCacheKey(user);
          this._inMemoryCache.add(cacheKey, result, this._cacheLimit);
          this._writeToCache(cacheKey, result);
          return result;
        });
      }
      _getSdkKey() {
        if (this._sdkKey != null) {
          return this._sdkKey;
        }
        Log_1.Log.error(`${this._adapterName} is not attached to a Client`);
        return "";
      }
      _loadFromCache(cacheKey) {
        var _a;
        const cache = (_a = StorageProvider_1.Storage.getItem) === null || _a === void 0 ? void 0 : _a.call(StorageProvider_1.Storage, cacheKey);
        if (cache == null) {
          return null;
        }
        const result = (0, TypedJsonParse_1._typedJsonParse)(cache, "source", "Cached Result");
        return result ? Object.assign(Object.assign({}, result), { source: "Cache" }) : null;
      }
      _writeToCache(cacheKey, result) {
        const resultString = JSON.stringify(result);
        for (let i = 0; i < MAX_CACHE_WRITE_ATTEMPTS; i++) {
          try {
            StorageProvider_1.Storage.setItem(cacheKey, resultString);
            break;
          } catch (error) {
            if (!(error instanceof Error) || !(error.toString().includes("QuotaExceededError") || error.toString().includes("QUOTA_EXCEEDED_ERR")) || this._cacheLimit <= 1) {
              throw error;
            }
            this._cacheLimit = Math.ceil(this._cacheLimit / 2);
            this._runLocalStorageCacheEviction(cacheKey, this._cacheLimit - 1);
          }
        }
        this._runLocalStorageCacheEviction(cacheKey);
      }
      _runLocalStorageCacheEviction(cacheKey, cacheLimit = this._cacheLimit) {
        var _a;
        const lastModifiedTimeMap = (_a = (0, StorageProvider_1._getObjectFromStorage)(this._lastModifiedStoreKey)) !== null && _a !== void 0 ? _a : {};
        lastModifiedTimeMap[cacheKey] = Date.now();
        const evictableKeys = _getEvictableKeys(lastModifiedTimeMap, cacheLimit);
        for (const evictable of evictableKeys) {
          delete lastModifiedTimeMap[evictable];
          StorageProvider_1.Storage.removeItem(evictable);
        }
        (0, StorageProvider_1._setObjectInStorage)(this._lastModifiedStoreKey, lastModifiedTimeMap);
      }
    };
    exports.DataAdapterCore = DataAdapterCore;
    function _makeDataAdapterResult(source, data, stableID, user) {
      return {
        source,
        data,
        receivedAt: Date.now(),
        stableID,
        fullUserHash: (0, StatsigUser_1._getFullUserHash)(user)
      };
    }
    exports._makeDataAdapterResult = _makeDataAdapterResult;
    var InMemoryCache = class {
      constructor() {
        this._data = {};
      }
      get(cacheKey, user) {
        var _a;
        const result = this._data[cacheKey];
        const cached = result === null || result === void 0 ? void 0 : result.stableID;
        const provided = (_a = user === null || user === void 0 ? void 0 : user.customIDs) === null || _a === void 0 ? void 0 : _a.stableID;
        if (provided && cached && provided !== cached) {
          Log_1.Log.warn("'StatsigUser.customIDs.stableID' mismatch");
          return null;
        }
        return result;
      }
      add(cacheKey, value, cacheLimit) {
        const evictableKeys = _getEvictableKeys(this._data, cacheLimit - 1);
        for (const evictable of evictableKeys) {
          delete this._data[evictable];
        }
        this._data[cacheKey] = value;
      }
      merge(values) {
        this._data = Object.assign(Object.assign({}, this._data), values);
      }
    };
    function _getEvictableKeys(data, limit) {
      const keys = Object.keys(data);
      if (keys.length <= limit) {
        return [];
      }
      if (limit === 0) {
        return keys;
      }
      return keys.sort((keyA, keyB) => {
        const valueA = data[keyA];
        const valueB = data[keyB];
        if (typeof valueA === "object" && typeof valueB === "object") {
          return valueA.receivedAt - valueB.receivedAt;
        }
        return valueA - valueB;
      }).slice(0, keys.length - limit);
    }
  }
});

// node_modules/@statsig/client-core/src/DownloadConfigSpecsResponse.js
var require_DownloadConfigSpecsResponse = __commonJS({
  "node_modules/@statsig/client-core/src/DownloadConfigSpecsResponse.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// node_modules/@statsig/client-core/src/ErrorBoundary.js
var require_ErrorBoundary = __commonJS({
  "node_modules/@statsig/client-core/src/ErrorBoundary.js"(exports) {
    "use strict";
    var __awaiter = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ErrorBoundary = exports.EXCEPTION_ENDPOINT = void 0;
    var Log_1 = require_Log();
    var SDKType_1 = require_SDKType();
    var StatsigMetadata_1 = require_StatsigMetadata();
    exports.EXCEPTION_ENDPOINT = "https://statsigapi.net/v1/sdk_exception";
    var UNKNOWN_ERROR = "[Statsig] UnknownError";
    var ErrorBoundary = class {
      constructor(_sdkKey, _options, _emitter, _lastSeenError) {
        this._sdkKey = _sdkKey;
        this._options = _options;
        this._emitter = _emitter;
        this._lastSeenError = _lastSeenError;
        this._seen = /* @__PURE__ */ new Set();
      }
      wrap(instance, namePrefix) {
        try {
          const obj = instance;
          _getAllInstanceMethodNames(obj).forEach((name) => {
            const original = obj[name];
            if ("$EB" in original) {
              return;
            }
            obj[name] = (...args) => {
              return this._capture(namePrefix ? `${namePrefix}:${name}` : name, () => original.apply(instance, args));
            };
            obj[name].$EB = true;
          });
        } catch (err) {
          this._onError("eb:wrap", err);
        }
      }
      logError(tag, error) {
        this._onError(tag, error);
      }
      logDroppedEvents(count, reason, metadata) {
        const extra = {
          eventCount: String(count),
          reason
        };
        if (metadata) {
          Object.keys(metadata).forEach((key) => {
            extra[key] = String(metadata[key]);
          });
        }
        this._onError(`statsig::log_event_dropped_event_count`, new Error(reason), true, extra);
      }
      logEventRequestFailure(count, reason, flushType, statusCode, retries) {
        const extra = {
          eventCount: String(count),
          flushType,
          statusCode: String(statusCode),
          reason,
          retries: String(retries)
        };
        this._onError(`statsig::log_event_failed`, new Error(reason), true, extra);
      }
      getLastSeenErrorAndReset() {
        const tempError = this._lastSeenError;
        this._lastSeenError = void 0;
        return tempError !== null && tempError !== void 0 ? tempError : null;
      }
      attachErrorIfNoneExists(error) {
        if (this._lastSeenError) {
          return;
        }
        this._lastSeenError = _resolveError(error);
      }
      _capture(tag, task) {
        try {
          const res = task();
          if (res && res instanceof Promise) {
            return res.catch((err) => this._onError(tag, err));
          }
          return res;
        } catch (error) {
          this._onError(tag, error);
          return null;
        }
      }
      _onError(tag, error, bypassDedupe = false, extra) {
        try {
          Log_1.Log.warn(`Caught error in ${tag}`, { error });
          const impl = () => __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f, _g;
            const unwrapped = error ? error : Error(UNKNOWN_ERROR);
            const isError = unwrapped instanceof Error;
            const name = isError ? unwrapped.name : "No Name";
            const resolvedError = _resolveError(unwrapped);
            this._lastSeenError = resolvedError;
            if (!bypassDedupe && this._seen.has(name)) {
              return;
            }
            this._seen.add(name);
            if ((_b = (_a = this._options) === null || _a === void 0 ? void 0 : _a.networkConfig) === null || _b === void 0 ? void 0 : _b.preventAllNetworkTraffic) {
              (_c = this._emitter) === null || _c === void 0 ? void 0 : _c.call(this, {
                name: "error",
                error,
                tag
              });
              return;
            }
            const sdkType = SDKType_1.SDKType._get(this._sdkKey);
            const statsigMetadata = StatsigMetadata_1.StatsigMetadataProvider.get();
            const info = isError ? unwrapped.stack : _getDescription(unwrapped);
            const body = Object.assign(Object.assign({ tag, exception: name, info, statsigOptions: _getStatsigOptionLoggingCopy(this._options) }, Object.assign(Object.assign({}, statsigMetadata), { sdkType })), extra !== null && extra !== void 0 ? extra : {});
            const func = (_f = (_e = (_d = this._options) === null || _d === void 0 ? void 0 : _d.networkConfig) === null || _e === void 0 ? void 0 : _e.networkOverrideFunc) !== null && _f !== void 0 ? _f : fetch;
            yield func(exports.EXCEPTION_ENDPOINT, {
              method: "POST",
              headers: {
                "STATSIG-API-KEY": this._sdkKey,
                "STATSIG-SDK-TYPE": String(sdkType),
                "STATSIG-SDK-VERSION": String(statsigMetadata.sdkVersion),
                "Content-Type": "application/json"
              },
              body: JSON.stringify(body)
            });
            (_g = this._emitter) === null || _g === void 0 ? void 0 : _g.call(this, {
              name: "error",
              error,
              tag
            });
          });
          impl().then(() => {
          }).catch(() => {
          });
        } catch (_error) {
        }
      }
    };
    exports.ErrorBoundary = ErrorBoundary;
    function _resolveError(error) {
      if (error instanceof Error) {
        return error;
      } else if (typeof error === "string") {
        return new Error(error);
      } else {
        return new Error("An unknown error occurred.");
      }
    }
    function _getDescription(obj) {
      try {
        return JSON.stringify(obj);
      } catch (_a) {
        return UNKNOWN_ERROR;
      }
    }
    function _getAllInstanceMethodNames(instance) {
      const names = /* @__PURE__ */ new Set();
      let proto = Object.getPrototypeOf(instance);
      while (proto && proto !== Object.prototype) {
        Object.getOwnPropertyNames(proto).filter((prop) => typeof (proto === null || proto === void 0 ? void 0 : proto[prop]) === "function").forEach((name) => names.add(name));
        proto = Object.getPrototypeOf(proto);
      }
      return Array.from(names);
    }
    function _getStatsigOptionLoggingCopy(options) {
      if (!options) {
        return {};
      }
      const loggingCopy = {};
      Object.keys(options).forEach((key) => {
        const option = key;
        const value = options[option];
        const valueType = typeof value;
        switch (valueType) {
          case "number":
          case "bigint":
          case "boolean":
            loggingCopy[String(option)] = value;
            break;
          case "string":
            if (value.length < 50) {
              loggingCopy[String(option)] = value;
            } else {
              loggingCopy[String(option)] = "set";
            }
            break;
          case "object":
            if (option === "environment") {
              loggingCopy["environment"] = value;
            } else if (option === "networkConfig") {
              loggingCopy["networkConfig"] = value;
            } else {
              loggingCopy[String(option)] = value != null ? "set" : "unset";
            }
            break;
          default:
        }
      });
      return loggingCopy;
    }
  }
});

// node_modules/@statsig/client-core/src/EvaluationOptions.js
var require_EvaluationOptions = __commonJS({
  "node_modules/@statsig/client-core/src/EvaluationOptions.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// node_modules/@statsig/client-core/src/EvaluationTypes.js
var require_EvaluationTypes = __commonJS({
  "node_modules/@statsig/client-core/src/EvaluationTypes.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// node_modules/@statsig/client-core/src/InitializeResponse.js
var require_InitializeResponse = __commonJS({
  "node_modules/@statsig/client-core/src/InitializeResponse.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// node_modules/@statsig/client-core/src/MemoKey.js
var require_MemoKey = __commonJS({
  "node_modules/@statsig/client-core/src/MemoKey.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.createMemoKey = exports.MemoPrefix = void 0;
    exports.MemoPrefix = {
      _gate: "g",
      _dynamicConfig: "c",
      _experiment: "e",
      _configList: "cl",
      _layer: "l",
      _paramStore: "p"
    };
    var EXIST_KEYS = /* @__PURE__ */ new Set([
      // Add keys that should be memoized based only on their existence, not their value
    ]);
    var DO_NOT_MEMO_KEYS = /* @__PURE__ */ new Set([
      // Add keys that if exist, should not be memoized
      "userPersistedValues"
    ]);
    function createMemoKey(prefix, name, options) {
      let cacheKey = `${prefix}|${name}`;
      if (!options) {
        return cacheKey;
      }
      for (const key of Object.keys(options)) {
        if (DO_NOT_MEMO_KEYS.has(key)) {
          return void 0;
        }
        if (EXIST_KEYS.has(key)) {
          cacheKey += `|${key}=true`;
        } else {
          cacheKey += `|${key}=${options[key]}`;
        }
      }
      return cacheKey;
    }
    exports.createMemoKey = createMemoKey;
  }
});

// node_modules/@statsig/client-core/src/OverrideAdapter.js
var require_OverrideAdapter = __commonJS({
  "node_modules/@statsig/client-core/src/OverrideAdapter.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// node_modules/@statsig/client-core/src/ParamStoreTypes.js
var require_ParamStoreTypes = __commonJS({
  "node_modules/@statsig/client-core/src/ParamStoreTypes.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// node_modules/@statsig/client-core/src/SizeOf.js
var require_SizeOf = __commonJS({
  "node_modules/@statsig/client-core/src/SizeOf.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports._fastApproxSizeOf = void 0;
    var CURLY_AND_SQUARE_BRACKET_SIZE = 2;
    var APPROX_ADDITIONAL_SIZE = 1;
    var _fastApproxSizeOf = (obj, max) => {
      let size = 0;
      const keys = Object.keys(obj);
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const value = obj[key];
        size += key.length;
        if (typeof value === "object" && value !== null) {
          size += (0, exports._fastApproxSizeOf)(value, max) + CURLY_AND_SQUARE_BRACKET_SIZE;
        } else {
          size += String(value).length + APPROX_ADDITIONAL_SIZE;
        }
        if (size >= max) {
          return size;
        }
      }
      return size;
    };
    exports._fastApproxSizeOf = _fastApproxSizeOf;
  }
});

// node_modules/@statsig/client-core/src/StatsigClientBase.js
var require_StatsigClientBase = __commonJS({
  "node_modules/@statsig/client-core/src/StatsigClientBase.js"(exports) {
    "use strict";
    var __awaiter = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.StatsigClientBase = void 0;
    require_StatsigGlobal();
    var __StatsigGlobal_1 = require_StatsigGlobal();
    var ErrorBoundary_1 = require_ErrorBoundary();
    var EventLogger_1 = require_EventLogger();
    var Log_1 = require_Log();
    var MemoKey_1 = require_MemoKey();
    var SafeJs_1 = require_SafeJs();
    var SessionID_1 = require_SessionID();
    var StableID_1 = require_StableID();
    var StatsigOptionsCommon_1 = require_StatsigOptionsCommon();
    var StorageProvider_1 = require_StorageProvider();
    var MAX_MEMO_CACHE_SIZE = 3e3;
    var StatsigClientBase = class {
      constructor(sdkKey, adapter, network, options) {
        var _a, _b, _c, _d;
        this.loadingStatus = "Uninitialized";
        this._initializePromise = null;
        this._listeners = {};
        const emitter = this.$emt.bind(this);
        (options === null || options === void 0 ? void 0 : options.logLevel) != null && (Log_1.Log.level = options.logLevel);
        (options === null || options === void 0 ? void 0 : options.disableStorage) && StorageProvider_1.Storage._setDisabled(true);
        (options === null || options === void 0 ? void 0 : options.initialSessionID) && SessionID_1.StatsigSession.overrideInitialSessionID(options.initialSessionID, sdkKey);
        (options === null || options === void 0 ? void 0 : options.storageProvider) && StorageProvider_1.Storage._setProvider(options.storageProvider);
        (options === null || options === void 0 ? void 0 : options.enableCookies) && StableID_1.StableID._setCookiesEnabled(sdkKey, options.enableCookies);
        (options === null || options === void 0 ? void 0 : options.disableStableID) && StableID_1.StableID._setDisabled(sdkKey, true);
        this._sdkKey = sdkKey;
        this._options = options !== null && options !== void 0 ? options : {};
        this._memoCache = {};
        this.overrideAdapter = (_a = options === null || options === void 0 ? void 0 : options.overrideAdapter) !== null && _a !== void 0 ? _a : null;
        this._errorBoundary = new ErrorBoundary_1.ErrorBoundary(sdkKey, options, emitter);
        this._logger = new EventLogger_1.EventLogger(sdkKey, emitter, network, options, this._errorBoundary);
        this._errorBoundary.wrap(this);
        this._errorBoundary.wrap(adapter);
        this._errorBoundary.wrap(this._logger);
        network.setErrorBoundary(this._errorBoundary);
        this.dataAdapter = adapter;
        this.dataAdapter.attach(sdkKey, options, network);
        this.storageProvider = StorageProvider_1.Storage;
        (_d = (_c = (_b = this.overrideAdapter) === null || _b === void 0 ? void 0 : _b.loadFromStorage) === null || _c === void 0 ? void 0 : _c.call(_b)) === null || _d === void 0 ? void 0 : _d.catch((e) => this._errorBoundary.logError("OA::loadFromStorage", e));
        this._primeReadyRipcord();
        _assignGlobalInstance(sdkKey, this);
      }
      /**
       * Updates runtime configuration options for the SDK, allowing toggling of certain behaviors such as logging and storage to comply with user preferences or regulations such as GDPR.
       *
       * @param {StatsigRuntimeMutableOptions} options - The configuration options that dictate the runtime behavior of the SDK.
       */
      updateRuntimeOptions(options) {
        if (options.loggingEnabled) {
          this._options.loggingEnabled = options.loggingEnabled;
          this._logger.setLoggingEnabled(options.loggingEnabled);
        } else if (options.disableLogging != null) {
          this._options.disableLogging = options.disableLogging;
          this._logger.setLoggingEnabled(options.disableLogging ? "disabled" : "browser-only");
        }
        if (options.disableStorage != null) {
          this._options.disableStorage = options.disableStorage;
          StorageProvider_1.Storage._setDisabled(options.disableStorage);
        }
        if (options.enableCookies != null) {
          this._options.enableCookies = options.enableCookies;
          StableID_1.StableID._setCookiesEnabled(this._sdkKey, options.enableCookies);
        }
        if (options.logEventCompressionMode) {
          this._logger.setLogEventCompressionMode(options.logEventCompressionMode);
        } else if (options.disableCompression) {
          this._logger.setLogEventCompressionMode(StatsigOptionsCommon_1.LogEventCompressionMode.Disabled);
        }
      }
      /**
       * Flushes any currently queued events.
       */
      flush() {
        return this._logger.flush();
      }
      /**
       * Gracefully shuts down the SDK, ensuring that all pending events are send before the SDK stops.
       * This function emits a 'pre_shutdown' event and then waits for the logger to complete its shutdown process.
       *
       * @returns {Promise<void>} A promise that resolves when all shutdown procedures, including logging shutdown, have been completed.
       */
      shutdown() {
        return __awaiter(this, void 0, void 0, function* () {
          this.$emt({ name: "pre_shutdown" });
          this._setStatus("Uninitialized", null);
          this._initializePromise = null;
          yield this._logger.stop();
        });
      }
      /**
       * Subscribes a callback function to a specific {@link StatsigClientEvent} or all StatsigClientEvents if the wildcard '*' is used.
       * Once subscribed, the listener callback will be invoked whenever the specified event is emitted.
       *
       * @param {StatsigClientEventName} event - The name of the event to subscribe to, or '*' to subscribe to all events.
       * @param {StatsigClientEventCallback<T>} listener - The callback function to execute when the event occurs. The function receives event-specific data as its parameter.
       * @see {@link off} for unsubscribing from events.
       */
      on(event, listener) {
        if (!this._listeners[event]) {
          this._listeners[event] = [];
        }
        this._listeners[event].push(listener);
      }
      /**
       * Unsubscribes a previously registered callback function from a specific {@link StatsigClientEvent} or all StatsigClientEvents if the wildcard '*' is used.
       *
       * @param {StatsigClientEventName} event - The name of the event from which to unsubscribe, or '*' to unsubscribe from all events.
       * @param {StatsigClientEventCallback<T>} listener - The callback function to remove from the event's notification list.
       * @see {@link on} for subscribing to events.
       */
      off(event, listener) {
        if (this._listeners[event]) {
          const index = this._listeners[event].indexOf(listener);
          if (index !== -1) {
            this._listeners[event].splice(index, 1);
          }
        }
      }
      $on(event, listener) {
        listener.__isInternal = true;
        this.on(event, listener);
      }
      $emt(event) {
        var _a;
        const barrier = (listener) => {
          try {
            listener(event);
          } catch (error) {
            if (listener.__isInternal === true) {
              this._errorBoundary.logError(`__emit:${event.name}`, error);
              return;
            }
            Log_1.Log.error(`An error occurred in a StatsigClientEvent listener. This is not an issue with Statsig.`, event);
          }
        };
        if (this._listeners[event.name]) {
          this._listeners[event.name].forEach((l) => barrier(l));
        }
        (_a = this._listeners["*"]) === null || _a === void 0 ? void 0 : _a.forEach(barrier);
      }
      _setStatus(newStatus, values) {
        this.loadingStatus = newStatus;
        this._memoCache = {};
        this.$emt({ name: "values_updated", status: newStatus, values });
      }
      _enqueueExposure(name, exposure, options) {
        if ((options === null || options === void 0 ? void 0 : options.disableExposureLog) === true) {
          this._logger.incrementNonExposureCount(name);
          return;
        }
        this._logger.enqueue(exposure);
      }
      _memoize(prefix, fn) {
        return (name, options) => {
          if (this._options.disableEvaluationMemoization) {
            return fn(name, options);
          }
          const memoKey = (0, MemoKey_1.createMemoKey)(prefix, name, options);
          if (!memoKey) {
            return fn(name, options);
          }
          if (!(memoKey in this._memoCache)) {
            if (Object.keys(this._memoCache).length >= MAX_MEMO_CACHE_SIZE) {
              this._memoCache = {};
            }
            this._memoCache[memoKey] = fn(name, options);
          }
          return this._memoCache[memoKey];
        };
      }
    };
    exports.StatsigClientBase = StatsigClientBase;
    function _assignGlobalInstance(sdkKey, client) {
      var _a;
      if ((0, SafeJs_1._isServerEnv)()) {
        return;
      }
      const statsigGlobal = (0, __StatsigGlobal_1._getStatsigGlobal)();
      const instances = (_a = statsigGlobal.instances) !== null && _a !== void 0 ? _a : {};
      const inst = client;
      if (instances[sdkKey] != null) {
        Log_1.Log.warn("Creating multiple Statsig clients with the same SDK key can lead to unexpected behavior. Multi-instance support requires different SDK keys.");
      }
      instances[sdkKey] = inst;
      if (!statsigGlobal.firstInstance) {
        statsigGlobal.firstInstance = inst;
      }
      statsigGlobal.instances = instances;
      __STATSIG__ = statsigGlobal;
    }
  }
});

// node_modules/@statsig/client-core/src/StatsigDataAdapter.js
var require_StatsigDataAdapter = __commonJS({
  "node_modules/@statsig/client-core/src/StatsigDataAdapter.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DataAdapterCachePrefix = void 0;
    exports.DataAdapterCachePrefix = "statsig.cached";
  }
});

// node_modules/@statsig/client-core/src/StatsigPlugin.js
var require_StatsigPlugin = __commonJS({
  "node_modules/@statsig/client-core/src/StatsigPlugin.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// node_modules/@statsig/client-core/src/StatsigTypeFactories.js
var require_StatsigTypeFactories = __commonJS({
  "node_modules/@statsig/client-core/src/StatsigTypeFactories.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports._makeTypedGet = exports._mergeOverride = exports._makeLayer = exports._makeExperiment = exports._makeDynamicConfig = exports._makeFeatureGate = void 0;
    var Log_1 = require_Log();
    var TypingUtils_1 = require_TypingUtils();
    function _makeEvaluation(name, details, evaluation, value) {
      var _a;
      return {
        name,
        details,
        ruleID: (_a = evaluation === null || evaluation === void 0 ? void 0 : evaluation.rule_id) !== null && _a !== void 0 ? _a : "",
        __evaluation: evaluation,
        value
      };
    }
    function _makeFeatureGate(name, details, evaluation) {
      var _a;
      return Object.assign(Object.assign({}, _makeEvaluation(name, details, evaluation, (evaluation === null || evaluation === void 0 ? void 0 : evaluation.value) === true)), { idType: (_a = evaluation === null || evaluation === void 0 ? void 0 : evaluation.id_type) !== null && _a !== void 0 ? _a : null });
    }
    exports._makeFeatureGate = _makeFeatureGate;
    function _makeDynamicConfig(name, details, evaluation) {
      var _a, _b;
      const value = (_a = evaluation === null || evaluation === void 0 ? void 0 : evaluation.value) !== null && _a !== void 0 ? _a : {};
      return Object.assign(Object.assign({}, _makeEvaluation(name, details, evaluation, value)), { idType: (_b = evaluation === null || evaluation === void 0 ? void 0 : evaluation.id_type) !== null && _b !== void 0 ? _b : null, get: _makeTypedGet(name, evaluation === null || evaluation === void 0 ? void 0 : evaluation.value) });
    }
    exports._makeDynamicConfig = _makeDynamicConfig;
    function _makeExperiment(name, details, evaluation) {
      var _a;
      const result = _makeDynamicConfig(name, details, evaluation);
      return Object.assign(Object.assign({}, result), { groupName: (_a = evaluation === null || evaluation === void 0 ? void 0 : evaluation.group_name) !== null && _a !== void 0 ? _a : null });
    }
    exports._makeExperiment = _makeExperiment;
    function _makeLayer(name, details, evaluation, exposeFunc) {
      var _a, _b;
      return Object.assign(Object.assign({}, _makeEvaluation(name, details, evaluation, void 0)), { get: _makeTypedGet(name, evaluation === null || evaluation === void 0 ? void 0 : evaluation.value, exposeFunc), groupName: (_a = evaluation === null || evaluation === void 0 ? void 0 : evaluation.group_name) !== null && _a !== void 0 ? _a : null, __value: (_b = evaluation === null || evaluation === void 0 ? void 0 : evaluation.value) !== null && _b !== void 0 ? _b : {} });
    }
    exports._makeLayer = _makeLayer;
    function _mergeOverride(original, overridden, value, exposeFunc) {
      return Object.assign(Object.assign(Object.assign({}, original), overridden), { get: _makeTypedGet(original.name, value, exposeFunc) });
    }
    exports._mergeOverride = _mergeOverride;
    function _makeTypedGet(name, value, exposeFunc) {
      return (param, fallback) => {
        var _a;
        const found = (_a = value === null || value === void 0 ? void 0 : value[param]) !== null && _a !== void 0 ? _a : null;
        if (found == null) {
          return fallback !== null && fallback !== void 0 ? fallback : null;
        }
        if (fallback != null && !(0, TypingUtils_1._isTypeMatch)(found, fallback)) {
          Log_1.Log.warn(`Parameter type mismatch. '${name}.${param}' was found to be type '${typeof found}' but fallback/return type is '${typeof fallback}'. See https://docs.statsig.com/client/javascript-sdk/#typed-getters`);
          return fallback !== null && fallback !== void 0 ? fallback : null;
        }
        exposeFunc === null || exposeFunc === void 0 ? void 0 : exposeFunc(param);
        return found;
      };
    }
    exports._makeTypedGet = _makeTypedGet;
  }
});

// node_modules/@statsig/client-core/src/StatsigTypes.js
var require_StatsigTypes = __commonJS({
  "node_modules/@statsig/client-core/src/StatsigTypes.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// node_modules/@statsig/client-core/src/StatsigUpdateDetails.js
var require_StatsigUpdateDetails = __commonJS({
  "node_modules/@statsig/client-core/src/StatsigUpdateDetails.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.UPDATE_DETAIL_ERROR_MESSAGES = exports.createUpdateDetails = void 0;
    var createUpdateDetails = (success, source, initDuration, error, sourceUrl, warnings) => {
      return {
        duration: initDuration,
        source,
        success,
        error,
        sourceUrl,
        warnings
      };
    };
    exports.createUpdateDetails = createUpdateDetails;
    exports.UPDATE_DETAIL_ERROR_MESSAGES = {
      NO_NETWORK_DATA: "No data was returned from the network. This may be due to a network timeout if a timeout value was specified in the options or ad blocker error."
    };
  }
});

// node_modules/@statsig/client-core/src/index.js
var require_src = __commonJS({
  "node_modules/@statsig/client-core/src/index.js"(exports) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    } : function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    });
    var __exportStar = exports && exports.__exportStar || function(m, exports2) {
      for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p)) __createBinding(exports2, m, p);
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Storage = exports.Log = exports.EventLogger = exports.Diagnostics = void 0;
    require_StatsigGlobal();
    var __StatsigGlobal_1 = require_StatsigGlobal();
    var Diagnostics_1 = require_Diagnostics();
    Object.defineProperty(exports, "Diagnostics", { enumerable: true, get: function() {
      return Diagnostics_1.Diagnostics;
    } });
    var EventLogger_1 = require_EventLogger();
    Object.defineProperty(exports, "EventLogger", { enumerable: true, get: function() {
      return EventLogger_1.EventLogger;
    } });
    var Log_1 = require_Log();
    Object.defineProperty(exports, "Log", { enumerable: true, get: function() {
      return Log_1.Log;
    } });
    var StatsigMetadata_1 = require_StatsigMetadata();
    var StorageProvider_1 = require_StorageProvider();
    Object.defineProperty(exports, "Storage", { enumerable: true, get: function() {
      return StorageProvider_1.Storage;
    } });
    __exportStar(require_StatsigGlobal(), exports);
    __exportStar(require_CacheKey(), exports);
    __exportStar(require_ClientInterfaces(), exports);
    __exportStar(require_DataAdapterCore(), exports);
    __exportStar(require_Diagnostics(), exports);
    __exportStar(require_DownloadConfigSpecsResponse(), exports);
    __exportStar(require_ErrorBoundary(), exports);
    __exportStar(require_EvaluationOptions(), exports);
    __exportStar(require_EvaluationTypes(), exports);
    __exportStar(require_Hashing(), exports);
    __exportStar(require_InitializeResponse(), exports);
    __exportStar(require_Log(), exports);
    __exportStar(require_MemoKey(), exports);
    __exportStar(require_NetworkConfig(), exports);
    __exportStar(require_NetworkCore(), exports);
    __exportStar(require_OverrideAdapter(), exports);
    __exportStar(require_ParamStoreTypes(), exports);
    __exportStar(require_SafeJs(), exports);
    __exportStar(require_SDKType(), exports);
    __exportStar(require_SessionID(), exports);
    __exportStar(require_SizeOf(), exports);
    __exportStar(require_StableID(), exports);
    __exportStar(require_StatsigClientBase(), exports);
    __exportStar(require_StatsigClientEventEmitter(), exports);
    __exportStar(require_StatsigDataAdapter(), exports);
    __exportStar(require_StatsigEvent(), exports);
    __exportStar(require_StatsigMetadata(), exports);
    __exportStar(require_StatsigOptionsCommon(), exports);
    __exportStar(require_StatsigPlugin(), exports);
    __exportStar(require_StatsigTypeFactories(), exports);
    __exportStar(require_StatsigTypes(), exports);
    __exportStar(require_StatsigUser(), exports);
    __exportStar(require_StorageProvider(), exports);
    __exportStar(require_TypedJsonParse(), exports);
    __exportStar(require_TypingUtils(), exports);
    __exportStar(require_UrlConfiguration(), exports);
    __exportStar(require_UUID(), exports);
    __exportStar(require_VisibilityObserving(), exports);
    __exportStar(require_StatsigUpdateDetails(), exports);
    __exportStar(require_SDKFlags(), exports);
    Object.assign((0, __StatsigGlobal_1._getStatsigGlobal)(), { Log: Log_1.Log, SDK_VERSION: StatsigMetadata_1.SDK_VERSION });
  }
});

// node_modules/@statsig/js-client/src/V1InitializeContainer.js
var require_V1InitializeContainer = __commonJS({
  "node_modules/@statsig/js-client/src/V1InitializeContainer.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.V1InitializeContainer = void 0;
    var client_core_1 = require_src();
    var V1InitializeContainer = class {
      constructor(_values) {
        this._values = _values;
      }
      getGate(name) {
        return this._getResultFromLookup(this._values.feature_gates, name);
      }
      getConfig(name) {
        return this._getResultFromLookup(this._values.dynamic_configs, name);
      }
      getLayer(name) {
        return this._getResultFromLookup(this._values.layer_configs, name);
      }
      getParamStore(name) {
        return this._getResultFromLookup(this._values.param_stores, name);
      }
      getConfigList() {
        return Object.keys(this._values.dynamic_configs);
      }
      getExposureMapping() {
        return this._values.exposures;
      }
      _getResultFromLookup(lookup, name) {
        var _a, _b;
        if (!lookup) {
          return null;
        }
        return (_b = (_a = lookup[name]) !== null && _a !== void 0 ? _a : lookup[(0, client_core_1._DJB2)(name)]) !== null && _b !== void 0 ? _b : null;
      }
    };
    exports.V1InitializeContainer = V1InitializeContainer;
  }
});

// node_modules/@statsig/js-client/src/V2InitializeContainer.js
var require_V2InitializeContainer = __commonJS({
  "node_modules/@statsig/js-client/src/V2InitializeContainer.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.V2InitializeContainer = void 0;
    var client_core_1 = require_src();
    var V2InitializeContainer = class {
      constructor(_values) {
        this._values = _values;
      }
      getGate(name) {
        var _a, _b, _c;
        const evalV2 = this._getResultFromLookup(this._values.feature_gates, name);
        if (!evalV2) {
          return null;
        }
        return {
          name,
          value: evalV2.v === true,
          rule_id: (_a = evalV2.r) !== null && _a !== void 0 ? _a : "default",
          secondary_exposures: (_b = evalV2.s) !== null && _b !== void 0 ? _b : [],
          id_type: (_c = evalV2.i) !== null && _c !== void 0 ? _c : ""
        };
      }
      getConfig(name) {
        var _a, _b, _c, _d;
        const evalV2 = this._getResultFromLookup(this._values.dynamic_configs, name);
        if (!evalV2) {
          return null;
        }
        return {
          name,
          value: (_a = this._values.values[evalV2.v]) !== null && _a !== void 0 ? _a : {},
          rule_id: evalV2.r,
          secondary_exposures: (_b = evalV2.s) !== null && _b !== void 0 ? _b : [],
          id_type: (_c = evalV2.i) !== null && _c !== void 0 ? _c : "",
          is_user_in_experiment: evalV2.ue === true ? true : false,
          passed: evalV2.p === true,
          group_name: (_d = evalV2.gn) !== null && _d !== void 0 ? _d : void 0,
          is_experiment_active: evalV2.ea === true ? true : false,
          group: evalV2.r,
          is_device_based: evalV2.i === "stableID"
        };
      }
      getLayer(name) {
        var _a, _b, _c, _d, _e, _f;
        const evalV2 = this._getResultFromLookup(this._values.layer_configs, name);
        if (!evalV2) {
          return null;
        }
        return {
          name,
          value: (_a = this._values.values[evalV2.v]) !== null && _a !== void 0 ? _a : {},
          rule_id: evalV2.r,
          secondary_exposures: (_b = evalV2.s) !== null && _b !== void 0 ? _b : [],
          is_user_in_experiment: evalV2.ue === true ? true : false,
          group_name: (_c = evalV2.gn) !== null && _c !== void 0 ? _c : void 0,
          is_experiment_active: evalV2.ea === true ? true : false,
          group: evalV2.r,
          is_device_based: evalV2.i === "stableID",
          allocated_experiment_name: (_d = evalV2.ae) !== null && _d !== void 0 ? _d : "",
          explicit_parameters: (_e = evalV2.ep) !== null && _e !== void 0 ? _e : [],
          undelegated_secondary_exposures: (_f = evalV2.us) !== null && _f !== void 0 ? _f : [],
          parameter_rule_ids: evalV2.pr
        };
      }
      getParamStore(name) {
        return this._getResultFromLookup(this._values.param_stores, name);
      }
      getConfigList() {
        return Object.keys(this._values.dynamic_configs);
      }
      getExposureMapping() {
        return this._values.exposures;
      }
      _getResultFromLookup(lookup, name) {
        var _a, _b;
        if (!lookup) {
          return null;
        }
        return (_b = (_a = lookup[name]) !== null && _a !== void 0 ? _a : lookup[(0, client_core_1._DJB2)(name)]) !== null && _b !== void 0 ? _b : null;
      }
    };
    exports.V2InitializeContainer = V2InitializeContainer;
  }
});

// node_modules/@statsig/js-client/src/EvaluationStore.js
var require_EvaluationStore = __commonJS({
  "node_modules/@statsig/js-client/src/EvaluationStore.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var client_core_1 = require_src();
    var V1InitializeContainer_1 = require_V1InitializeContainer();
    var V2InitializeContainer_1 = require_V2InitializeContainer();
    var EvaluationStore = class {
      constructor(_sdkKey, _options) {
        this._sdkKey = _sdkKey;
        this._options = _options;
        this._valuesForExternalUse = null;
        this._values = null;
        this._source = "Uninitialized";
        this._lcut = 0;
        this._receivedAt = 0;
        this._bootstrapMetadata = null;
        this._warnings = /* @__PURE__ */ new Set();
      }
      reset() {
        this._values = null;
        this._valuesForExternalUse = null;
        this._source = "Loading";
        this._lcut = 0;
        this._receivedAt = 0;
        this._bootstrapMetadata = null;
        this._warnings.clear();
      }
      finalize() {
        if (this._values) {
          return;
        }
        this._source = "NoValues";
      }
      getValues() {
        return this._valuesForExternalUse;
      }
      setValues(result, user) {
        var _a, _b;
        if (!result) {
          return false;
        }
        const values = (0, client_core_1._typedJsonParse)(result.data, "has_updates", "EvaluationResponse");
        if (values == null) {
          return false;
        }
        this._source = result.source;
        if ((values === null || values === void 0 ? void 0 : values.has_updates) !== true) {
          return true;
        }
        const updatedLcut = (_a = values.time) !== null && _a !== void 0 ? _a : 0;
        if (updatedLcut < this._lcut) {
          return true;
        }
        this._valuesForExternalUse = (0, client_core_1._typedJsonParse)(result.data, "has_updates", "EvaluationResponse");
        this._lcut = values.time;
        this._receivedAt = result.receivedAt;
        if (values.response_format === "init-v2") {
          this._values = new V2InitializeContainer_1.V2InitializeContainer(values);
        } else {
          this._values = new V1InitializeContainer_1.V1InitializeContainer(values);
        }
        this._bootstrapMetadata = this._extractBootstrapMetadata(result.source, values);
        if (result.source && values.user) {
          this._setWarningState(user, values);
        }
        client_core_1.SDKFlags.setFlags(this._sdkKey, (_b = values.sdk_flags) !== null && _b !== void 0 ? _b : {});
        return true;
      }
      getWarnings() {
        if (this._warnings.size === 0) {
          return void 0;
        }
        return Array.from(this._warnings);
      }
      getGate(name) {
        const res = this._values ? this._values.getGate(name) : null;
        return this._getDetailedStoreResult(res);
      }
      getConfig(name) {
        const res = this._values ? this._values.getConfig(name) : null;
        return this._getDetailedStoreResult(res);
      }
      getConfigList() {
        if (!this._values) {
          return [];
        }
        return this._values.getConfigList();
      }
      getLayer(name) {
        const res = this._values ? this._values.getLayer(name) : null;
        return this._getDetailedStoreResult(res);
      }
      getParamStore(name) {
        const res = this._values ? this._values.getParamStore(name) : null;
        return this._getDetailedStoreResult(res);
      }
      getSource() {
        return this._source;
      }
      getExposureMapping() {
        var _a;
        return (_a = this._values) === null || _a === void 0 ? void 0 : _a.getExposureMapping();
      }
      _extractBootstrapMetadata(source, values) {
        if (source !== "Bootstrap") {
          return null;
        }
        const bootstrapMetadata = {};
        if (values.user) {
          bootstrapMetadata.user = values.user;
        }
        if (values.sdkInfo) {
          bootstrapMetadata.generatorSDKInfo = values.sdkInfo;
        }
        bootstrapMetadata.lcut = values.time;
        return bootstrapMetadata;
      }
      _getDetailedStoreResult(result) {
        return {
          result,
          details: this._getDetails(result == null)
        };
      }
      _setWarningState(user, values) {
        var _a, _b, _c;
        const stableID = client_core_1.StableID.get(this._sdkKey);
        if (((_a = user.customIDs) === null || _a === void 0 ? void 0 : _a.stableID) !== stableID && // don't throw if they're both undefined
        (((_b = user.customIDs) === null || _b === void 0 ? void 0 : _b.stableID) || stableID)) {
          this._warnings.add("StableIDMismatch");
          return;
        }
        if ("user" in values) {
          let bootstrapUser = values["user"];
          let userForComparison = Object.assign(Object.assign({}, user), { analyticsOnlyMetadata: void 0, privateAttributes: void 0 });
          if ((_c = this._options) === null || _c === void 0 ? void 0 : _c.disableStableID) {
            userForComparison = Object.assign(Object.assign({}, userForComparison), { customIDs: Object.assign(Object.assign({}, userForComparison.customIDs), { stableID: void 0 }) });
            bootstrapUser = Object.assign(Object.assign({}, bootstrapUser), { customIDs: Object.assign(Object.assign({}, bootstrapUser.customIDs), { stableID: void 0 }) });
          }
          if ((0, client_core_1._getFullUserHash)(userForComparison) !== (0, client_core_1._getFullUserHash)(bootstrapUser)) {
            this._warnings.add("PartialUserMatch");
          }
        }
      }
      getCurrentSourceDetails() {
        if (this._source === "Uninitialized" || this._source === "NoValues") {
          return { reason: this._source };
        }
        const sourceDetails = {
          reason: this._source,
          lcut: this._lcut,
          receivedAt: this._receivedAt
        };
        if (this._warnings.size > 0) {
          sourceDetails.warnings = Array.from(this._warnings);
        }
        return sourceDetails;
      }
      _getDetails(isUnrecognized) {
        var _a, _b;
        const sourceDetails = this.getCurrentSourceDetails();
        let reason = sourceDetails.reason;
        const warnings = (_a = sourceDetails.warnings) !== null && _a !== void 0 ? _a : [];
        if (this._source === "Bootstrap" && warnings.length > 0) {
          reason = reason + warnings[0];
        }
        if (reason !== "Uninitialized" && reason !== "NoValues") {
          const subreason = isUnrecognized ? "Unrecognized" : "Recognized";
          reason = `${reason}:${subreason}`;
        }
        const bootstrapMetadata = this._source === "Bootstrap" ? (_b = this._bootstrapMetadata) !== null && _b !== void 0 ? _b : void 0 : void 0;
        if (bootstrapMetadata) {
          sourceDetails.bootstrapMetadata = bootstrapMetadata;
        }
        return Object.assign(Object.assign({}, sourceDetails), { reason });
      }
    };
    exports.default = EvaluationStore;
  }
});

// node_modules/@statsig/js-client/src/EvaluationResponseDeltas.js
var require_EvaluationResponseDeltas = __commonJS({
  "node_modules/@statsig/js-client/src/EvaluationResponseDeltas.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports._resolveDeltasResponse = void 0;
    var client_core_1 = require_src();
    var MAX_DELTAS_SORT_DEPTH = 2;
    function _resolveDeltasResponse(cache, deltasString) {
      const deltas = (0, client_core_1._typedJsonParse)(deltasString, "checksum", "DeltasEvaluationResponse");
      if (!deltas) {
        return {
          hadBadDeltaChecksum: true
        };
      }
      const merged = _mergeDeltasIntoCache(cache, deltas);
      const resolved = _handleDeletedEntries(merged);
      const actualChecksum = (0, client_core_1._DJB2Object)({
        feature_gates: resolved.feature_gates,
        dynamic_configs: resolved.dynamic_configs,
        layer_configs: resolved.layer_configs
      }, MAX_DELTAS_SORT_DEPTH);
      const isMatch = actualChecksum === deltas.checksumV2;
      if (!isMatch) {
        return {
          hadBadDeltaChecksum: true,
          badChecksum: actualChecksum,
          badMergedConfigs: resolved,
          badFullResponse: deltas.deltas_full_response
        };
      }
      return JSON.stringify(resolved);
    }
    exports._resolveDeltasResponse = _resolveDeltasResponse;
    function _mergeDeltasIntoCache(cache, deltas) {
      return Object.assign(Object.assign(Object.assign({}, cache), deltas), { feature_gates: Object.assign(Object.assign({}, cache.feature_gates), deltas.feature_gates), layer_configs: Object.assign(Object.assign({}, cache.layer_configs), deltas.layer_configs), dynamic_configs: Object.assign(Object.assign({}, cache.dynamic_configs), deltas.dynamic_configs) });
    }
    function _handleDeletedEntries(deltas) {
      const result = deltas;
      _deleteEntriesInRecord(deltas.deleted_gates, result.feature_gates);
      delete result.deleted_gates;
      _deleteEntriesInRecord(deltas.deleted_configs, result.dynamic_configs);
      delete result.deleted_configs;
      _deleteEntriesInRecord(deltas.deleted_layers, result.layer_configs);
      delete result.deleted_layers;
      return result;
    }
    function _deleteEntriesInRecord(keys, values) {
      keys === null || keys === void 0 ? void 0 : keys.forEach((key) => {
        delete values[key];
      });
    }
  }
});

// node_modules/@statsig/js-client/src/Network.js
var require_Network = __commonJS({
  "node_modules/@statsig/js-client/src/Network.js"(exports) {
    "use strict";
    var __awaiter = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    var client_core_1 = require_src();
    var EvaluationResponseDeltas_1 = require_EvaluationResponseDeltas();
    var StatsigNetwork = class extends client_core_1.NetworkCore {
      constructor(options, emitter) {
        super(options, emitter);
        const config = options === null || options === void 0 ? void 0 : options.networkConfig;
        this._option = options;
        this._initializeUrlConfig = new client_core_1.UrlConfiguration(client_core_1.Endpoint._initialize, config === null || config === void 0 ? void 0 : config.initializeUrl, config === null || config === void 0 ? void 0 : config.api, config === null || config === void 0 ? void 0 : config.initializeFallbackUrls);
      }
      fetchEvaluations(sdkKey, current, priority, user, isCacheValidFor204) {
        return __awaiter(this, void 0, void 0, function* () {
          var _a, _b, _c, _d, _e, _f;
          const cache = current ? (0, client_core_1._typedJsonParse)(current, "has_updates", "InitializeResponse") : null;
          let data = {
            user,
            hash: (_c = (_b = (_a = this._option) === null || _a === void 0 ? void 0 : _a.networkConfig) === null || _b === void 0 ? void 0 : _b.initializeHashAlgorithm) !== null && _c !== void 0 ? _c : "djb2",
            deltasResponseRequested: false,
            full_checksum: null
          };
          if (cache === null || cache === void 0 ? void 0 : cache.has_updates) {
            const hasHashChanged = (cache === null || cache === void 0 ? void 0 : cache.hash_used) !== ((_f = (_e = (_d = this._option) === null || _d === void 0 ? void 0 : _d.networkConfig) === null || _e === void 0 ? void 0 : _e.initializeHashAlgorithm) !== null && _f !== void 0 ? _f : "djb2");
            data = Object.assign(Object.assign({}, data), { sinceTime: isCacheValidFor204 && !hasHashChanged ? cache.time : 0, previousDerivedFields: "derived_fields" in cache && isCacheValidFor204 ? cache.derived_fields : {}, deltasResponseRequested: true, full_checksum: cache.full_checksum, partialUserMatchSinceTime: !hasHashChanged ? cache.time : 0 });
          }
          return this._fetchEvaluations(sdkKey, cache, data, priority);
        });
      }
      _fetchEvaluations(sdkKey, cache, data, priority) {
        return __awaiter(this, void 0, void 0, function* () {
          var _a, _b;
          const response = yield this.post({
            sdkKey,
            urlConfig: this._initializeUrlConfig,
            data,
            retries: 2,
            isStatsigEncodable: true,
            priority
          });
          if ((response === null || response === void 0 ? void 0 : response.code) === 204) {
            return '{"has_updates": false}';
          }
          if ((response === null || response === void 0 ? void 0 : response.code) !== 200) {
            return (_a = response === null || response === void 0 ? void 0 : response.body) !== null && _a !== void 0 ? _a : null;
          }
          if ((cache === null || cache === void 0 ? void 0 : cache.has_updates) !== true || ((_b = response.body) === null || _b === void 0 ? void 0 : _b.includes('"is_delta":true')) !== true || data.deltasResponseRequested !== true) {
            return response.body;
          }
          const result = (0, EvaluationResponseDeltas_1._resolveDeltasResponse)(cache, response.body);
          if (typeof result === "string") {
            return result;
          }
          return this._fetchEvaluations(sdkKey, cache, Object.assign(Object.assign(Object.assign({}, data), result), { deltasResponseRequested: false }), priority);
        });
      }
    };
    exports.default = StatsigNetwork;
  }
});

// node_modules/@statsig/js-client/src/ParamStoreGetterFactory.js
var require_ParamStoreGetterFactory = __commonJS({
  "node_modules/@statsig/js-client/src/ParamStoreGetterFactory.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports._makeParamStoreGetter = void 0;
    var client_core_1 = require_src();
    var NO_EXPOSURE_OPT = {
      disableExposureLog: true
    };
    function _shouldLogExposure(options) {
      return options == null || options.disableExposureLog === false;
    }
    function _shouldReturnFallback(value, fallback) {
      return fallback != null && !(0, client_core_1._isTypeMatch)(value, fallback);
    }
    function _getMappedStaticValue(param, _options) {
      return param.value;
    }
    function _getMappedGateValue(client, param, options) {
      const gate = client.getFeatureGate(param.gate_name, _shouldLogExposure(options) ? void 0 : NO_EXPOSURE_OPT);
      if (gate.value) {
        return param.pass_value;
      }
      return param.fail_value;
    }
    function _getMappedDynamicConfigValue(client, param, fallback, options) {
      const config = client.getDynamicConfig(param.config_name, _shouldLogExposure(options) ? void 0 : NO_EXPOSURE_OPT);
      const value = config.get(param.param_name);
      if (_shouldReturnFallback(value, fallback)) {
        return fallback;
      }
      return value;
    }
    function _getMappedExperimentValue(client, param, fallback, options) {
      const experiment = client.getExperiment(param.experiment_name, _shouldLogExposure(options) ? void 0 : NO_EXPOSURE_OPT);
      const value = experiment.get(param.param_name);
      if (_shouldReturnFallback(value, fallback)) {
        return fallback;
      }
      return value;
    }
    function _getMappedLayerValue(client, param, fallback, options) {
      const layer = client.getLayer(param.layer_name, _shouldLogExposure(options) ? void 0 : NO_EXPOSURE_OPT);
      const value = layer.get(param.param_name);
      if (_shouldReturnFallback(value, fallback)) {
        return fallback;
      }
      return value;
    }
    function _makeParamStoreGetter(client, config, options) {
      return (paramName, fallback) => {
        if (config == null) {
          return fallback;
        }
        const param = config[paramName];
        if (param == null || fallback != null && (0, client_core_1._typeOf)(fallback) !== param.param_type) {
          return fallback;
        }
        switch (param.ref_type) {
          case "static":
            return _getMappedStaticValue(param, options);
          case "gate":
            return _getMappedGateValue(client, param, options);
          case "dynamic_config":
            return _getMappedDynamicConfigValue(client, param, fallback, options);
          case "experiment":
            return _getMappedExperimentValue(client, param, fallback, options);
          case "layer":
            return _getMappedLayerValue(client, param, fallback, options);
          default:
            return fallback;
        }
      };
    }
    exports._makeParamStoreGetter = _makeParamStoreGetter;
  }
});

// node_modules/@statsig/js-client/src/StatsigEvaluationsDataAdapter.js
var require_StatsigEvaluationsDataAdapter = __commonJS({
  "node_modules/@statsig/js-client/src/StatsigEvaluationsDataAdapter.js"(exports) {
    "use strict";
    var __awaiter = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.StatsigEvaluationsDataAdapter = void 0;
    var client_core_1 = require_src();
    var Network_1 = require_Network();
    var StatsigEvaluationsDataAdapter = class extends client_core_1.DataAdapterCore {
      constructor() {
        super("EvaluationsDataAdapter", "evaluations");
        this._network = null;
        this._options = null;
      }
      attach(sdkKey, options, network) {
        super.attach(sdkKey, options, network);
        if (network !== null && network instanceof Network_1.default) {
          this._network = network;
        } else {
          this._network = new Network_1.default(options !== null && options !== void 0 ? options : {});
        }
      }
      getDataAsync(current, user, options) {
        return this._getDataAsyncImpl(current, (0, client_core_1._normalizeUser)(user, this._options), options);
      }
      prefetchData(user, options) {
        return this._prefetchDataImpl(user, options);
      }
      setData(data) {
        const values = (0, client_core_1._typedJsonParse)(data, "has_updates", "data");
        if (values && "user" in values) {
          super.setData(data, values.user);
        } else {
          client_core_1.Log.error("StatsigUser not found. You may be using an older server SDK version. Please upgrade your SDK or use setDataLegacy.");
        }
      }
      setDataLegacy(data, user) {
        super.setData(data, user);
      }
      _fetchFromNetwork(current, user, options, isCacheValidFor204) {
        return __awaiter(this, void 0, void 0, function* () {
          var _a;
          const result = yield (_a = this._network) === null || _a === void 0 ? void 0 : _a.fetchEvaluations(this._getSdkKey(), current, options === null || options === void 0 ? void 0 : options.priority, user, isCacheValidFor204);
          return result !== null && result !== void 0 ? result : null;
        });
      }
      _getCacheKey(user) {
        var _a;
        const key = (0, client_core_1._getStorageKey)(this._getSdkKey(), user, (_a = this._options) === null || _a === void 0 ? void 0 : _a.customUserCacheKeyFunc);
        return `${client_core_1.DataAdapterCachePrefix}.${this._cacheSuffix}.${key}`;
      }
      _isCachedResultValidFor204(result, user) {
        return result.fullUserHash != null && result.fullUserHash === (0, client_core_1._getFullUserHash)(user);
      }
    };
    exports.StatsigEvaluationsDataAdapter = StatsigEvaluationsDataAdapter;
  }
});

// node_modules/@statsig/js-client/src/StatsigClient.js
var require_StatsigClient = __commonJS({
  "node_modules/@statsig/js-client/src/StatsigClient.js"(exports) {
    "use strict";
    var __awaiter = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    var client_core_1 = require_src();
    var EvaluationStore_1 = require_EvaluationStore();
    var Network_1 = require_Network();
    var ParamStoreGetterFactory_1 = require_ParamStoreGetterFactory();
    var StatsigEvaluationsDataAdapter_1 = require_StatsigEvaluationsDataAdapter();
    var StatsigClient2 = class _StatsigClient extends client_core_1.StatsigClientBase {
      /**
       * Retrieves an instance of the StatsigClient based on the provided SDK key.
       *  If no SDK key is provided, the method returns the most recently created instance of the StatsigClient.
       *  The method ensures that each unique SDK key corresponds to a single instance of StatsigClient, effectively implementing a singleton pattern for each key.
       *  If no instance exists for the given SDK key, a new StatsigClient instance will be created and returned.
       *
       * @param {string} [sdkKey] - Optional. The SDK key used to identify a specific instance of the StatsigClient. If omitted, the method returns the last created instance.
       * @returns {StatsigClient} Returns the StatsigClient instance associated with the given SDK key, creating a new one if needed.
       */
      static instance(sdkKey) {
        const instance = (0, client_core_1._getStatsigGlobal)().instance(sdkKey);
        if (instance instanceof _StatsigClient) {
          return instance;
        }
        client_core_1.Log.warn((0, client_core_1._isServerEnv)() ? "StatsigClient.instance is not supported in server environments" : "Unable to find StatsigClient instance");
        return new _StatsigClient(sdkKey !== null && sdkKey !== void 0 ? sdkKey : "", {});
      }
      /**
       * StatsigClient constructor
       *
       * @param {string} sdkKey A Statsig client SDK key. eg "client-xyz123..."
       * @param {StatsigUser} user StatsigUser object containing various attributes related to a user.
       * @param {StatsigOptions | null} options StatsigOptions, used to customize the behavior of the SDK.
       */
      constructor(sdkKey, user, options = null) {
        var _a, _b;
        client_core_1.SDKType._setClientType(sdkKey, "javascript-client");
        const network = new Network_1.default(options, (e) => {
          this.$emt(e);
        });
        super(sdkKey, (_a = options === null || options === void 0 ? void 0 : options.dataAdapter) !== null && _a !== void 0 ? _a : new StatsigEvaluationsDataAdapter_1.StatsigEvaluationsDataAdapter(), network, options);
        this._possibleFirstTouchMetadata = {};
        this.getFeatureGate = this._memoize(client_core_1.MemoPrefix._gate, this._getFeatureGateImpl.bind(this));
        this.getDynamicConfig = this._memoize(client_core_1.MemoPrefix._dynamicConfig, this._getDynamicConfigImpl.bind(this));
        this.getExperiment = this._memoize(client_core_1.MemoPrefix._experiment, this._getExperimentImpl.bind(this));
        this.getConfigList = this._memoize(client_core_1.MemoPrefix._configList, this._getConfigListImpl.bind(this));
        this.getLayer = this._memoize(client_core_1.MemoPrefix._layer, this._getLayerImpl.bind(this));
        this.getParameterStore = this._memoize(client_core_1.MemoPrefix._paramStore, this._getParameterStoreImpl.bind(this));
        this._store = new EvaluationStore_1.default(sdkKey, options !== null && options !== void 0 ? options : null);
        this._network = network;
        this._user = this._configureUser(user, options);
        this._sdkInstanceID = (0, client_core_1.getUUID)();
        this._contextHandle = new client_core_1.PrecomputedEvaluationsContextHandle(sdkKey, () => this._options, () => this._errorBoundary, () => this._store.getValues(), () => this._user, () => this._sdkInstanceID);
        const plugins = (_b = options === null || options === void 0 ? void 0 : options.plugins) !== null && _b !== void 0 ? _b : [];
        for (const plugin of plugins) {
          plugin.bind(this);
        }
      }
      /**
       * Initializes the StatsigClient using cached values. This method sets up the client synchronously by utilizing previously cached values.
       * After initialization, cache values are updated in the background for future use, either in subsequent sessions or when `updateUser` is called.
       * This is useful for quickly starting with the last-known-good configurations while refreshing data to keep settings up-to-date.
       *
       * @see {@link initializeAsync} for the asynchronous version of this method.
       */
      initializeSync(options) {
        var _a;
        if (this.loadingStatus !== "Uninitialized") {
          return (0, client_core_1.createUpdateDetails)(true, this._store.getSource(), -1, null, null, ["MultipleInitializations", ...(_a = this._store.getWarnings()) !== null && _a !== void 0 ? _a : []]);
        }
        this._logger.start();
        return this.updateUserSync(this._user, options);
      }
      /**
       * Initializes the StatsigClient asynchronously by first using cached values and then updating to the latest values from the network.
       * Once the network values are fetched, they replace the existing cached values. If this method's promise is not awaited,
       * there might be a transition from cached to network values during the session, which can affect consistency.
       * This method is useful when it's acceptable to begin with potentially stale data and switch to the latest configuration as it becomes available.
       *
       * @param {AsyncUpdateOptions} [options] - Optional. Additional options to customize the method call.
       * @returns {Promise<void>} A promise that resolves once the client is fully initialized with the latest values from the network or a timeout (if set) is hit.
       * @see {@link initializeSync} for the synchronous version of this method.
       */
      initializeAsync(options) {
        return __awaiter(this, void 0, void 0, function* () {
          if (this._initializePromise) {
            return this._initializePromise;
          }
          this._initializePromise = this._initializeAsyncImpl(options);
          return this._initializePromise;
        });
      }
      /**
       * Synchronously updates the user in the Statsig client and switches the internal state to use cached values for the newly specified user.
       * After the initial switch to cached values, this method updates these values in the background, preparing them for future sessions or subsequent calls to updateUser.
       * This method ensures the client is quickly ready with available data.
       *
       * @param {StatsigUser} user - The new StatsigUser for which the client should update its internal state.
       * @see {@link updateUserAsync} for the asynchronous version of this method.
       */
      updateUserSync(user, options) {
        const startTime = performance.now();
        try {
          return this._updateUserSyncImpl(user, options, startTime);
        } catch (e) {
          const err = e instanceof Error ? e : new Error(String(e));
          return this._createErrorUpdateDetails(err, startTime);
        }
      }
      _updateUserSyncImpl(user, options, startTime) {
        var _a;
        const warnings = [...(_a = this._store.getWarnings()) !== null && _a !== void 0 ? _a : []];
        this._resetForUser(user);
        const result = this.dataAdapter.getDataSync(this._user);
        if (result == null) {
          warnings.push("NoCachedValues");
        }
        this._store.setValues(result, this._user);
        this._finalizeUpdate(result);
        const disable = options === null || options === void 0 ? void 0 : options.disableBackgroundCacheRefresh;
        if (disable === true || disable == null && (result === null || result === void 0 ? void 0 : result.source) === "Bootstrap") {
          return (0, client_core_1.createUpdateDetails)(true, this._store.getSource(), performance.now() - startTime, this._errorBoundary.getLastSeenErrorAndReset(), this._network.getLastUsedInitUrlAndReset(), warnings);
        }
        this._runPostUpdate(result !== null && result !== void 0 ? result : null, this._user);
        return (0, client_core_1.createUpdateDetails)(true, this._store.getSource(), performance.now() - startTime, this._errorBoundary.getLastSeenErrorAndReset(), this._network.getLastUsedInitUrlAndReset(), warnings);
      }
      /**
       * Asynchronously updates the user in the Statsig client by initially using cached values and then fetching the latest values from the network.
       * When the latest values are fetched, they replace the cached values. If the promise returned by this method is not awaited,
       * the client's state may shift from cached to updated network values during the session, potentially affecting consistency.
       * This method is best used in scenarios where up-to-date configuration is critical and initial delays are acceptable.
       *
       * @param {StatsigUser} user - The new StatsigUser for which the client should update its internal state.
       * @param {AsyncUpdateOptions} [options] - Optional. Additional options to customize the method call.
       * @returns {Promise<void>} A promise that resolves once the client is fully updated with the latest values from the network or a timeout (if set) is hit.
       * @see {@link updateUserSync} for the synchronous version of this method.
       */
      updateUserAsync(user, options) {
        return __awaiter(this, void 0, void 0, function* () {
          const startTime = performance.now();
          try {
            return yield this._updateUserAsyncImpl(user, options);
          } catch (e) {
            const err = e instanceof Error ? e : new Error(String(e));
            return this._createErrorUpdateDetails(err, startTime);
          }
        });
      }
      _updateUserAsyncImpl(user, options) {
        return __awaiter(this, void 0, void 0, function* () {
          this._resetForUser(user);
          const initiator = this._user;
          client_core_1.Diagnostics._markInitOverallStart(this._sdkKey);
          let result = this.dataAdapter.getDataSync(initiator);
          this._store.setValues(result, this._user);
          this._setStatus("Loading", result);
          result = yield this.dataAdapter.getDataAsync(result, initiator, options);
          if (initiator !== this._user) {
            return (0, client_core_1.createUpdateDetails)(false, this._store.getSource(), -1, new Error("User changed during update"), this._network.getLastUsedInitUrlAndReset());
          }
          let isUsingNetworkValues = false;
          if (result != null) {
            client_core_1.Diagnostics._markInitProcessStart(this._sdkKey);
            isUsingNetworkValues = this._store.setValues(result, this._user);
            client_core_1.Diagnostics._markInitProcessEnd(this._sdkKey, {
              success: isUsingNetworkValues
            });
          }
          this._finalizeUpdate(result);
          if (!isUsingNetworkValues) {
            this._errorBoundary.attachErrorIfNoneExists(client_core_1.UPDATE_DETAIL_ERROR_MESSAGES.NO_NETWORK_DATA);
            this.$emt({ name: "initialization_failure" });
          }
          client_core_1.Diagnostics._markInitOverallEnd(this._sdkKey, isUsingNetworkValues, this._store.getCurrentSourceDetails());
          const initDuration = client_core_1.Diagnostics._enqueueDiagnosticsEvent(this._user, this._logger, this._sdkKey, this._options);
          return (0, client_core_1.createUpdateDetails)(isUsingNetworkValues, this._store.getSource(), initDuration, this._errorBoundary.getLastSeenErrorAndReset(), this._network.getLastUsedInitUrlAndReset(), this._store.getWarnings());
        });
      }
      /**
       * Retrieves a synchronous context containing data currently being used by the SDK. Represented as a {@link PrecomputedEvaluationsContext} object.
       *
       * @returns {PrecomputedEvaluationsContext} The current synchronous context for the this StatsigClient instance.
       */
      getContext() {
        let user = (0, client_core_1._cloneObject)("StatsigUser", this._user);
        if (user == null) {
          client_core_1.Log.error("Failed to clone user");
          user = {};
        }
        return {
          sdkKey: this._sdkKey,
          options: this._options,
          values: this._store.getValues(),
          user,
          errorBoundary: this._errorBoundary,
          session: client_core_1.StatsigSession.get(this._sdkKey),
          stableID: client_core_1.StableID.get(this._sdkKey),
          sdkInstanceID: this._sdkInstanceID
        };
      }
      /**
       * Retrieves a context handle that computes fields lazily on access.
       * This is more efficient than getContext() when you only need certain fields,
       *
       * @returns {PrecomputedEvaluationsContextHandle} A handle with lazy getters for context fields.
       */
      getContextHandle() {
        return this._contextHandle;
      }
      /**
       * Retrieves the value of a feature gate for the current user, represented as a simple boolean.
       *
       * @param {string} name - The name of the feature gate to retrieve.
       * @param {FeatureGateEvaluationOptions} [options] - Optional. Additional options to customize the method call.
       * @returns {boolean} - The boolean value representing the gate's current evaluation results for the user.
       */
      checkGate(name, options) {
        return this.getFeatureGate(name, options).value;
      }
      /**
       * Logs an event to the internal logging system. This function allows logging by either passing a fully formed event object or by specifying the event name with optional value and metadata.
       *
       * @param {StatsigEvent|string} eventOrName - The event object conforming to the StatsigEvent interface, or the name of the event as a string.
       * @param {string|number} value - Optional. The value associated with the event, which can be a string or a number. This parameter is ignored if the first parameter is a StatsigEvent object.
       * @param {Record<string, string>} metadata - Optional. A key-value record containing metadata about the event. This is also ignored if the first parameter is an event object.
       */
      logEvent(eventOrName, value, metadata) {
        const event = typeof eventOrName === "string" ? {
          eventName: eventOrName,
          value,
          metadata
        } : eventOrName;
        this.$emt({
          name: "log_event_called",
          event
        });
        this._logger.enqueue(Object.assign(Object.assign({}, event), { user: this._user, time: Date.now() }));
      }
      /**
       * Updates the user with analytics only metadata. This will override any existing analytics only metadata.
       *
       * @param {Record<string, string | number | boolean>} metadata - The metadata to add to the user.
       */
      updateUserWithAnalyticsOnlyMetadata(metadata) {
        this._user = this._configureUser(Object.assign(Object.assign({}, this._user), { analyticsOnlyMetadata: metadata }), this._options);
      }
      _primeReadyRipcord() {
        this.$on("error", () => {
          this.loadingStatus === "Loading" && this._finalizeUpdate(null);
        });
      }
      _initializeAsyncImpl(options) {
        return __awaiter(this, void 0, void 0, function* () {
          if (!client_core_1.Storage.isReady()) {
            yield client_core_1.Storage.isReadyResolver();
          }
          this._logger.start();
          return this.updateUserAsync(this._user, options);
        });
      }
      _createErrorUpdateDetails(error, startTime) {
        var _a;
        return (0, client_core_1.createUpdateDetails)(false, this._store.getSource(), performance.now() - startTime, error, null, [...(_a = this._store.getWarnings()) !== null && _a !== void 0 ? _a : []]);
      }
      _finalizeUpdate(values) {
        this._store.finalize();
        this._setStatus("Ready", values);
      }
      _runPostUpdate(current, user) {
        this.dataAdapter.getDataAsync(current, user, { priority: "low" }).catch((err) => {
          client_core_1.Log.error("An error occurred after update.", err);
        });
      }
      _resetForUser(user) {
        this._logger.reset();
        this._store.reset();
        this._user = this._configureUser(user, this._options);
      }
      _configureUser(originalUser, options) {
        var _a, _b, _c;
        const user = (0, client_core_1._normalizeUser)(originalUser, options);
        const stableIdOverride = (_a = user.customIDs) === null || _a === void 0 ? void 0 : _a.stableID;
        if (stableIdOverride) {
          const readyPromise = (_c = (_b = this.storageProvider).isReadyResolver) === null || _c === void 0 ? void 0 : _c.call(_b);
          if (readyPromise) {
            readyPromise.then(() => client_core_1.StableID.setOverride(stableIdOverride, this._sdkKey), () => client_core_1.StableID.setOverride(stableIdOverride, this._sdkKey));
          } else {
            client_core_1.StableID.setOverride(stableIdOverride, this._sdkKey);
          }
        }
        if (Object.keys(this._possibleFirstTouchMetadata).length > 0) {
          user.analyticsOnlyMetadata = Object.assign(Object.assign({}, user.analyticsOnlyMetadata), this._possibleFirstTouchMetadata);
        }
        return user;
      }
      _getFeatureGateImpl(name, options) {
        var _a, _b;
        const { result: evaluation, details } = this._store.getGate(name);
        this._checkUserHasIdForEvaluation(evaluation === null || evaluation === void 0 ? void 0 : evaluation.id_type, name, "Gate");
        this._checkInitializationStatus(details.reason);
        const gate = (0, client_core_1._makeFeatureGate)(name, details, evaluation);
        const overridden = (_b = (_a = this.overrideAdapter) === null || _a === void 0 ? void 0 : _a.getGateOverride) === null || _b === void 0 ? void 0 : _b.call(_a, gate, this._user, options);
        const result = overridden !== null && overridden !== void 0 ? overridden : gate;
        this._enqueueExposure(name, (0, client_core_1._createGateExposure)(this._user, result, this._store.getExposureMapping()), options);
        this.$emt({ name: "gate_evaluation", gate: result });
        return result;
      }
      _getDynamicConfigImpl(name, options) {
        var _a, _b;
        const { result: evaluation, details } = this._store.getConfig(name);
        this._checkUserHasIdForEvaluation(evaluation === null || evaluation === void 0 ? void 0 : evaluation.id_type, name, "Dynamic config");
        this._checkInitializationStatus(details.reason);
        const config = (0, client_core_1._makeDynamicConfig)(name, details, evaluation);
        const overridden = (_b = (_a = this.overrideAdapter) === null || _a === void 0 ? void 0 : _a.getDynamicConfigOverride) === null || _b === void 0 ? void 0 : _b.call(_a, config, this._user, options);
        const result = overridden !== null && overridden !== void 0 ? overridden : config;
        this._enqueueExposure(name, (0, client_core_1._createConfigExposure)(this._user, result, this._store.getExposureMapping()), options);
        this.$emt({ name: "dynamic_config_evaluation", dynamicConfig: result });
        return result;
      }
      _getExperimentImpl(name, options) {
        var _a, _b, _c, _d;
        const { result: evaluation, details } = this._store.getConfig(name);
        this._checkUserHasIdForEvaluation(evaluation === null || evaluation === void 0 ? void 0 : evaluation.id_type, name, "Experiment");
        this._checkInitializationStatus(details.reason);
        const experiment = (0, client_core_1._makeExperiment)(name, details, evaluation);
        if (experiment.__evaluation != null) {
          experiment.__evaluation.secondary_exposures = (0, client_core_1._mapExposures)((_b = (_a = experiment.__evaluation) === null || _a === void 0 ? void 0 : _a.secondary_exposures) !== null && _b !== void 0 ? _b : [], this._store.getExposureMapping());
        }
        const overridden = (_d = (_c = this.overrideAdapter) === null || _c === void 0 ? void 0 : _c.getExperimentOverride) === null || _d === void 0 ? void 0 : _d.call(_c, experiment, this._user, options);
        const result = overridden !== null && overridden !== void 0 ? overridden : experiment;
        this._enqueueExposure(name, (0, client_core_1._createConfigExposure)(this._user, result, this._store.getExposureMapping()), options);
        this.$emt({ name: "experiment_evaluation", experiment: result });
        return result;
      }
      _getConfigListImpl() {
        return this._store.getConfigList();
      }
      _getLayerImpl(name, options) {
        var _a, _b, _c;
        const { result: evaluation, details } = this._store.getLayer(name);
        const layer = (0, client_core_1._makeLayer)(name, details, evaluation);
        const overridden = (_b = (_a = this.overrideAdapter) === null || _a === void 0 ? void 0 : _a.getLayerOverride) === null || _b === void 0 ? void 0 : _b.call(_a, layer, this._user, options);
        if (options === null || options === void 0 ? void 0 : options.disableExposureLog) {
          this._logger.incrementNonExposureCount(name);
        }
        const result = (0, client_core_1._mergeOverride)(layer, overridden, (_c = overridden === null || overridden === void 0 ? void 0 : overridden.__value) !== null && _c !== void 0 ? _c : layer.__value, (param) => {
          if (options === null || options === void 0 ? void 0 : options.disableExposureLog) {
            return;
          }
          this._enqueueExposure(name, (0, client_core_1._createLayerParameterExposure)(this._user, result, param, this._store.getExposureMapping()), options);
        });
        this.$emt({ name: "layer_evaluation", layer: result });
        return result;
      }
      _getParameterStoreImpl(name, options) {
        var _a, _b;
        const { result: configuration, details } = this._store.getParamStore(name);
        this._logger.incrementNonExposureCount(name);
        const paramStore = {
          name,
          details,
          __configuration: configuration,
          get: (0, ParamStoreGetterFactory_1._makeParamStoreGetter)(this, configuration, options)
        };
        const overridden = (_b = (_a = this.overrideAdapter) === null || _a === void 0 ? void 0 : _a.getParamStoreOverride) === null || _b === void 0 ? void 0 : _b.call(_a, paramStore, options);
        if (overridden != null) {
          paramStore.__configuration = overridden.config;
          paramStore.details = overridden.details;
          paramStore.get = (0, ParamStoreGetterFactory_1._makeParamStoreGetter)(this, overridden.config, options);
        }
        return paramStore;
      }
      _checkUserHasIdForEvaluation(idType, name, type) {
        if (!idType) {
          return;
        }
        if (!(0, client_core_1._getUnitIDFromUser)(this._user, idType)) {
          client_core_1.Log.warn(`The user does not have the required id_type "${idType}" for ${type} "${name}"`);
        }
      }
      _checkInitializationStatus(reason) {
        if (reason === "Uninitialized" || reason.startsWith("Loading")) {
          client_core_1.Log.warn(`SDK initialization has not completed. Reason: ${reason}`);
        }
      }
    };
    exports.default = StatsigClient2;
  }
});

// node_modules/@statsig/js-client/src/index.js
var require_src2 = __commonJS({
  "node_modules/@statsig/js-client/src/index.js"(exports) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    } : function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    });
    var __exportStar = exports && exports.__exportStar || function(m, exports2) {
      for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p)) __createBinding(exports2, m, p);
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.StatsigClient = void 0;
    var client_core_1 = require_src();
    var StatsigClient_1 = require_StatsigClient();
    exports.StatsigClient = StatsigClient_1.default;
    __exportStar(require_src(), exports);
    var __STATSIG__2 = Object.assign((0, client_core_1._getStatsigGlobal)(), {
      StatsigClient: StatsigClient_1.default
    });
    exports.default = __STATSIG__2;
  }
});

// src/analytics.js
var import_js_client = __toESM(require_src2(), 1);
var statsigClient = null;
var statsigInitPromise = null;
var statsigReady = false;
function getStatsigUser() {
  if (currentUser) {
    return {
      userID: currentUser._id,
      email: currentUser.username || void 0,
      custom: {
        provider: currentUser.provider,
        signed_in: true,
        username: currentUser.username
      }
    };
  }
  return {
    custom: {
      signed_in: false
    }
  };
}
async function initStatsig() {
  let clientKey = "";
  try {
    const res = await fetch("/api/config");
    if (res.ok) {
      const config = await res.json();
      clientKey = config.statsigClientKey;
    }
  } catch (e) {
    console.warn("Failed to fetch config:", e);
  }
  if (!clientKey) return;
  try {
    statsigClient = new import_js_client.StatsigClient(clientKey, getStatsigUser());
    statsigInitPromise = statsigClient.initializeAsync().then(() => {
      statsigReady = true;
      trackEvent("site_loaded", null, { surface: "gallery" });
    }).catch((error) => {
      console.warn("Statsig init failed:", error);
    });
  } catch (error) {
    console.warn("Statsig unavailable:", error);
  }
}
async function syncStatsigUser() {
  if (!statsigClient || typeof statsigClient.updateUserAsync !== "function") return;
  try {
    if (statsigInitPromise) await statsigInitPromise;
    await statsigClient.updateUserAsync(getStatsigUser());
  } catch (error) {
    console.warn("Statsig user sync failed:", error);
  }
}
function trackEvent(name, value, metadata) {
  if (!statsigClient) return;
  const log = () => {
    try {
      statsigClient.logEvent(
        name,
        typeof value === "number" || typeof value === "string" ? value : null,
        metadata || {}
      );
    } catch (error) {
      console.warn(`Statsig event failed: ${name}`, error);
    }
  };
  if (statsigReady) {
    log();
    return;
  }
  if (statsigInitPromise) {
    statsigInitPromise.then(log).catch(() => {
    });
  }
}

export {
  initStatsig,
  syncStatsigUser,
  trackEvent
};

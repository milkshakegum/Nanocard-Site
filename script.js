(()=>{
  var d, p, D, y, m = function(e, t) {
      return {
          name: e,
          value: t === void 0 ? -1 : t,
          delta: 0,
          entries: [],
          id: "v2-".concat(Date.now(), "-").concat(Math.floor(8999999999999 * Math.random()) + 1e12)
      }
  }, S = function(e, t) {
      try {
          if (PerformanceObserver.supportedEntryTypes.includes(e)) {
              if (e === "first-input" && !("PerformanceEventTiming"in self))
                  return;
              var n = new PerformanceObserver(function(a) {
                  return a.getEntries().map(t)
              }
              );
              return n.observe({
                  type: e,
                  buffered: !0
              }),
              n
          }
      } catch (a) {}
  }, w = function(e, t) {
      var n = function a(i) {
          i.type !== "pagehide" && document.visibilityState !== "hidden" || (e(i),
          t && (removeEventListener("visibilitychange", a, !0),
          removeEventListener("pagehide", a, !0)))
      };
      addEventListener("visibilitychange", n, !0),
      addEventListener("pagehide", n, !0)
  }, v = function(e) {
      addEventListener("pageshow", function(t) {
          t.persisted && e(t)
      }, !0)
  }, f = function(e, t, n) {
      var a;
      return function(i) {
          t.value >= 0 && (i || n) && (t.delta = t.value - (a || 0),
          (t.delta || a === void 0) && (a = t.value,
          e(t)))
      }
  }, h = -1, I = function() {
      return document.visibilityState === "hidden" ? 0 : 1 / 0
  }, M = function() {
      w(function(e) {
          var t = e.timeStamp;
          h = t
      }, !0)
  }, E = function() {
      return h < 0 && (h = I(),
      M(),
      v(function() {
          setTimeout(function() {
              h = I(),
              M()
          }, 0)
      })),
      {
          get firstHiddenTime() {
              return h
          }
      }
  }, L = function(e, t) {
      var n, a = E(), i = m("FCP"), o = function(u) {
          u.name === "first-contentful-paint" && (c && c.disconnect(),
          u.startTime < a.firstHiddenTime && (i.value = u.startTime,
          i.entries.push(u),
          n(!0)))
      }, r = performance.getEntriesByName && performance.getEntriesByName("first-contentful-paint")[0], c = r ? null : S("paint", o);
      (r || c) && (n = f(e, i, t),
      r && o(r),
      v(function(u) {
          i = m("FCP"),
          n = f(e, i, t),
          requestAnimationFrame(function() {
              requestAnimationFrame(function() {
                  i.value = performance.now() - u.timeStamp,
                  n(!0)
              })
          })
      }))
  }, R = !1, b = -1, k = function(e, t) {
      R || (L(function(s) {
          b = s.value
      }),
      R = !0);
      var n, a = function(s) {
          b > -1 && e(s)
      }, i = m("CLS", 0), o = 0, r = [], c = function(s) {
          if (!s.hadRecentInput) {
              var l = r[0]
                , _ = r[r.length - 1];
              o && s.startTime - _.startTime < 1e3 && s.startTime - l.startTime < 5e3 ? (o += s.value,
              r.push(s)) : (o = s.value,
              r = [s]),
              o > i.value && (i.value = o,
              i.entries = r,
              n())
          }
      }, u = S("layout-shift", c);
      u && (n = f(a, i, t),
      w(function() {
          u.takeRecords().map(c),
          n(!0)
      }),
      v(function() {
          o = 0,
          b = -1,
          i = m("CLS", 0),
          n = f(a, i, t)
      }))
  }, g = {
      passive: !0,
      capture: !0
  }, J = new Date, x = function(e, t) {
      d || (d = t,
      p = e,
      D = new Date,
      O(removeEventListener),
      B())
  }, B = function() {
      if (p >= 0 && p < D - J) {
          var e = {
              entryType: "first-input",
              name: d.type,
              target: d.target,
              cancelable: d.cancelable,
              startTime: d.timeStamp,
              processingStart: d.timeStamp + p
          };
          y.forEach(function(t) {
              t(e)
          }),
          y = []
      }
  }, Q = function(e) {
      if (e.cancelable) {
          var t = (e.timeStamp > 1e12 ? new Date : performance.now()) - e.timeStamp;
          e.type == "pointerdown" ? function(n, a) {
              var i = function() {
                  x(n, a),
                  r()
              }
                , o = function() {
                  r()
              }
                , r = function() {
                  removeEventListener("pointerup", i, g),
                  removeEventListener("pointercancel", o, g)
              };
              addEventListener("pointerup", i, g),
              addEventListener("pointercancel", o, g)
          }(t, e) : x(t, e)
      }
  }, O = function(e) {
      ["mousedown", "keydown", "touchstart", "pointerdown"].forEach(function(t) {
          return e(t, Q, g)
      })
  }, q = function(e, t) {
      var n, a = E(), i = m("FID"), o = function(c) {
          c.startTime < a.firstHiddenTime && (i.value = c.processingStart - c.startTime,
          i.entries.push(c),
          n(!0))
      }, r = S("first-input", o);
      n = f(e, i, t),
      r && w(function() {
          r.takeRecords().map(o),
          r.disconnect()
      }, !0),
      r && v(function() {
          var c;
          i = m("FID"),
          n = f(e, i, t),
          y = [],
          p = -1,
          d = null,
          O(addEventListener),
          c = o,
          y.push(c),
          B()
      })
  }, P = new Set, z = function(e, t) {
      var n, a = E(), i = m("LCP"), o = function(u) {
          var s = u.startTime;
          s < a.firstHiddenTime && (i.value = s,
          i.entries.push(u)),
          n()
      }, r = S("largest-contentful-paint", o);
      if (r) {
          n = f(e, i, t);
          var c = function() {
              P.has(i.id) || (r.takeRecords().map(o),
              r.disconnect(),
              P.add(i.id),
              n(!0))
          };
          ["keydown", "click"].forEach(function(u) {
              addEventListener(u, c, {
                  once: !0,
                  capture: !0
              })
          }),
          w(c, !0),
          v(function(u) {
              i = m("LCP"),
              n = f(e, i, t),
              requestAnimationFrame(function() {
                  requestAnimationFrame(function() {
                      i.value = performance.now() - u.timeStamp,
                      P.add(i.id),
                      n(!0)
                  })
              })
          })
      }
  };
  var A = document.currentScript ? {
      src: document.currentScript.src,
      framerSiteId: document.currentScript.getAttribute("data-fid")
  } : {
      src: "https://events.framer.com/",
      framerSiteId: null
  }
    , U = new URL(A.src)
    , j = U.origin + "/anonymous";
  function W() {
      var e = function() {
          return Math.floor((1 + Math.random()) * 65536).toString(16).substring(1)
      };
      return "" + e() + e() + "-" + e() + "-" + e() + "-" + e() + "-" + e() + e() + e()
  }
  function C(e) {
      if (!location.protocol.startsWith("http"))
          return;
      let t = {
          framerSiteId: A.framerSiteId,
          origin: document.location.origin,
          pathname: document.location.pathname,
          search: document.location.search
      };
      fetch(j, {
          body: JSON.stringify(e.map(n=>({
              ...n,
              data: {
                  ...n.data,
                  context: {
                      ...t,
                      ...n.data.context
                  }
              }
          }))),
          method: "POST",
          keepalive: !0,
          headers: {
              "Content-Type": "application/json"
          }
      })
  }
  function T(e, t) {
      return {
          source: "framer.site",
          timestamp: Date.now(),
          data: {
              type: "track",
              uuid: W(),
              event: e,
              ...t
          }
      }
  }
  function G() {
      let e = new Set
        , [t] = performance.getEntriesByType("navigation")
        , n = document.querySelector("div#main").dataset.framerPageOptimizedAt ? new Date(document.querySelector("div#main").dataset.framerPageOptimizedAt).getTime() : null
        , a = document.querySelector("div#main").dataset.framerSsrReleasedAt ? new Date(document.querySelector("div#main").dataset.framerSsrReleasedAt).getTime() : null
        , {origin: i, pathname: o, search: r} = document.location;
      function c(s) {
          e.add(s)
      }
      function u() {
          if (e.size > 0) {
              let s = [...e].map(({name: _, delta: N, id: H})=>T("published_site_performance_web_vitals", {
                  metric: _,
                  label: H,
                  value: Math.round(N),
                  pageOptimizedAt: n,
                  ssrReleasedAt: a,
                  context: {
                      origin: i,
                      pathname: o,
                      search: r
                  }
              }))
                , l = T("published_site_performance", {
                  domNodes: document.getElementsByTagName("*").length,
                  pageLoadDurationMs: Math.round(t.domContentLoadedEventEnd - t.domContentLoadedEventStart),
                  timeToFirstByteMs: Math.round(t.responseStart),
                  resourcesCount: performance.getEntriesByType("resource").length,
                  hydrationDurationMs: window.__html_time_to_render_start && window.__html_time_to_render_end ? Math.round(window.__html_time_to_render_end - window.__html_time_to_render_start) : null,
                  pageOptimizedAt: n,
                  ssrReleasedAt: a,
                  context: {
                      origin: i,
                      pathname: o,
                      search: r
                  }
              });
              e.clear(),
              C([...s, l])
          }
      }
      q(c),
      z(c),
      L(c),
      k(({delta: s, ...l})=>{
          c({
              ...l,
              delta: s * 1e3
          })
      }
      ),
      addEventListener("visibilitychange", ()=>{
          document.visibilityState === "hidden" && u()
      }
      ),
      addEventListener("pagehide", u)
  }
  function K() {
      window.addEventListener("popstate", F),
      typeof Proxy != "undefined" && (window.history.pushState = new Proxy(window.history.pushState,{
          apply: (e,t,n)=>{
              e.apply(t, n),
              F()
          }
      }))
  }
  function F(e) {
      let t = [T("published_site_pageview", {
          referrer: e && e.initialReferrer || null,
          url: location.href,
          hostname: location.hostname || null,
          pathname: location.pathname || null,
          hash: location.hash || null,
          search: location.search || null,
          framerSiteId: A.framerSiteId
      })];
      C(t)
  }
  function V() {
      window.__send_framer_event = (e,t)=>{
          let n = T(e, t);
          C([n])
      }
  }
  (function() {
      let e = typeof document.referrer == "string";
      G(),
      K(),
      V(),
      F({
          initialReferrer: e && document.referrer || null
      })
  }
  )();
}
)();

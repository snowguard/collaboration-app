/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "app/api/auth/login/route";
exports.ids = ["app/api/auth/login/route"];
exports.modules = {

/***/ "@prisma/client":
/*!*********************************!*\
  !*** external "@prisma/client" ***!
  \*********************************/
/***/ ((module) => {

"use strict";
module.exports = require("@prisma/client");

/***/ }),

/***/ "next/dist/compiled/next-server/app-page.runtime.dev.js":
/*!*************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-page.runtime.dev.js" ***!
  \*************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/app-page.runtime.dev.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-route.runtime.dev.js":
/*!**************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-route.runtime.dev.js" ***!
  \**************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/app-route.runtime.dev.js");

/***/ }),

/***/ "../app-render/action-async-storage.external":
/*!*******************************************************************************!*\
  !*** external "next/dist/server/app-render/action-async-storage.external.js" ***!
  \*******************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/action-async-storage.external.js");

/***/ }),

/***/ "../app-render/after-task-async-storage.external":
/*!***********************************************************************************!*\
  !*** external "next/dist/server/app-render/after-task-async-storage.external.js" ***!
  \***********************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/after-task-async-storage.external.js");

/***/ }),

/***/ "../app-render/work-async-storage.external":
/*!*****************************************************************************!*\
  !*** external "next/dist/server/app-render/work-async-storage.external.js" ***!
  \*****************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/work-async-storage.external.js");

/***/ }),

/***/ "./work-unit-async-storage.external":
/*!**********************************************************************************!*\
  !*** external "next/dist/server/app-render/work-unit-async-storage.external.js" ***!
  \**********************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/work-unit-async-storage.external.js");

/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("crypto");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fauth%2Flogin%2Froute&page=%2Fapi%2Fauth%2Flogin%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2Flogin%2Froute.ts&appDir=%2FUsers%2Fsaurabhksingh%2Fdev%2Fdomains%2Fcollaboration-app%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fsaurabhksingh%2Fdev%2Fdomains%2Fcollaboration-app&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fauth%2Flogin%2Froute&page=%2Fapi%2Fauth%2Flogin%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2Flogin%2Froute.ts&appDir=%2FUsers%2Fsaurabhksingh%2Fdev%2Fdomains%2Fcollaboration-app%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fsaurabhksingh%2Fdev%2Fdomains%2Fcollaboration-app&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   workAsyncStorage: () => (/* binding */ workAsyncStorage),\n/* harmony export */   workUnitAsyncStorage: () => (/* binding */ workUnitAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/route-kind */ \"(rsc)/./node_modules/next/dist/server/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _Users_saurabhksingh_dev_domains_collaboration_app_app_api_auth_login_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app/api/auth/login/route.ts */ \"(rsc)/./app/api/auth/login/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/auth/login/route\",\n        pathname: \"/api/auth/login\",\n        filename: \"route\",\n        bundlePath: \"app/api/auth/login/route\"\n    },\n    resolvedPagePath: \"/Users/saurabhksingh/dev/domains/collaboration-app/app/api/auth/login/route.ts\",\n    nextConfigOutput,\n    userland: _Users_saurabhksingh_dev_domains_collaboration_app_app_api_auth_login_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { workAsyncStorage, workUnitAsyncStorage, serverHooks } = routeModule;\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        workAsyncStorage,\n        workUnitAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIvaW5kZXguanM/bmFtZT1hcHAlMkZhcGklMkZhdXRoJTJGbG9naW4lMkZyb3V0ZSZwYWdlPSUyRmFwaSUyRmF1dGglMkZsb2dpbiUyRnJvdXRlJmFwcFBhdGhzPSZwYWdlUGF0aD1wcml2YXRlLW5leHQtYXBwLWRpciUyRmFwaSUyRmF1dGglMkZsb2dpbiUyRnJvdXRlLnRzJmFwcERpcj0lMkZVc2VycyUyRnNhdXJhYmhrc2luZ2glMkZkZXYlMkZkb21haW5zJTJGY29sbGFib3JhdGlvbi1hcHAlMkZhcHAmcGFnZUV4dGVuc2lvbnM9dHN4JnBhZ2VFeHRlbnNpb25zPXRzJnBhZ2VFeHRlbnNpb25zPWpzeCZwYWdlRXh0ZW5zaW9ucz1qcyZyb290RGlyPSUyRlVzZXJzJTJGc2F1cmFiaGtzaW5naCUyRmRldiUyRmRvbWFpbnMlMkZjb2xsYWJvcmF0aW9uLWFwcCZpc0Rldj10cnVlJnRzY29uZmlnUGF0aD10c2NvbmZpZy5qc29uJmJhc2VQYXRoPSZhc3NldFByZWZpeD0mbmV4dENvbmZpZ091dHB1dD0mcHJlZmVycmVkUmVnaW9uPSZtaWRkbGV3YXJlQ29uZmlnPWUzMCUzRCEiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFBK0Y7QUFDdkM7QUFDcUI7QUFDOEI7QUFDM0c7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLHlHQUFtQjtBQUMzQztBQUNBLGNBQWMsa0VBQVM7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLFlBQVk7QUFDWixDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0EsUUFBUSxzREFBc0Q7QUFDOUQ7QUFDQSxXQUFXLDRFQUFXO0FBQ3RCO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDMEY7O0FBRTFGIiwic291cmNlcyI6WyIiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQXBwUm91dGVSb3V0ZU1vZHVsZSB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL3JvdXRlLW1vZHVsZXMvYXBwLXJvdXRlL21vZHVsZS5jb21waWxlZFwiO1xuaW1wb3J0IHsgUm91dGVLaW5kIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvcm91dGUta2luZFwiO1xuaW1wb3J0IHsgcGF0Y2hGZXRjaCBhcyBfcGF0Y2hGZXRjaCB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL2xpYi9wYXRjaC1mZXRjaFwiO1xuaW1wb3J0ICogYXMgdXNlcmxhbmQgZnJvbSBcIi9Vc2Vycy9zYXVyYWJoa3NpbmdoL2Rldi9kb21haW5zL2NvbGxhYm9yYXRpb24tYXBwL2FwcC9hcGkvYXV0aC9sb2dpbi9yb3V0ZS50c1wiO1xuLy8gV2UgaW5qZWN0IHRoZSBuZXh0Q29uZmlnT3V0cHV0IGhlcmUgc28gdGhhdCB3ZSBjYW4gdXNlIHRoZW0gaW4gdGhlIHJvdXRlXG4vLyBtb2R1bGUuXG5jb25zdCBuZXh0Q29uZmlnT3V0cHV0ID0gXCJcIlxuY29uc3Qgcm91dGVNb2R1bGUgPSBuZXcgQXBwUm91dGVSb3V0ZU1vZHVsZSh7XG4gICAgZGVmaW5pdGlvbjoge1xuICAgICAgICBraW5kOiBSb3V0ZUtpbmQuQVBQX1JPVVRFLFxuICAgICAgICBwYWdlOiBcIi9hcGkvYXV0aC9sb2dpbi9yb3V0ZVwiLFxuICAgICAgICBwYXRobmFtZTogXCIvYXBpL2F1dGgvbG9naW5cIixcbiAgICAgICAgZmlsZW5hbWU6IFwicm91dGVcIixcbiAgICAgICAgYnVuZGxlUGF0aDogXCJhcHAvYXBpL2F1dGgvbG9naW4vcm91dGVcIlxuICAgIH0sXG4gICAgcmVzb2x2ZWRQYWdlUGF0aDogXCIvVXNlcnMvc2F1cmFiaGtzaW5naC9kZXYvZG9tYWlucy9jb2xsYWJvcmF0aW9uLWFwcC9hcHAvYXBpL2F1dGgvbG9naW4vcm91dGUudHNcIixcbiAgICBuZXh0Q29uZmlnT3V0cHV0LFxuICAgIHVzZXJsYW5kXG59KTtcbi8vIFB1bGwgb3V0IHRoZSBleHBvcnRzIHRoYXQgd2UgbmVlZCB0byBleHBvc2UgZnJvbSB0aGUgbW9kdWxlLiBUaGlzIHNob3VsZFxuLy8gYmUgZWxpbWluYXRlZCB3aGVuIHdlJ3ZlIG1vdmVkIHRoZSBvdGhlciByb3V0ZXMgdG8gdGhlIG5ldyBmb3JtYXQuIFRoZXNlXG4vLyBhcmUgdXNlZCB0byBob29rIGludG8gdGhlIHJvdXRlLlxuY29uc3QgeyB3b3JrQXN5bmNTdG9yYWdlLCB3b3JrVW5pdEFzeW5jU3RvcmFnZSwgc2VydmVySG9va3MgfSA9IHJvdXRlTW9kdWxlO1xuZnVuY3Rpb24gcGF0Y2hGZXRjaCgpIHtcbiAgICByZXR1cm4gX3BhdGNoRmV0Y2goe1xuICAgICAgICB3b3JrQXN5bmNTdG9yYWdlLFxuICAgICAgICB3b3JrVW5pdEFzeW5jU3RvcmFnZVxuICAgIH0pO1xufVxuZXhwb3J0IHsgcm91dGVNb2R1bGUsIHdvcmtBc3luY1N0b3JhZ2UsIHdvcmtVbml0QXN5bmNTdG9yYWdlLCBzZXJ2ZXJIb29rcywgcGF0Y2hGZXRjaCwgIH07XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWFwcC1yb3V0ZS5qcy5tYXAiXSwibmFtZXMiOltdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fauth%2Flogin%2Froute&page=%2Fapi%2Fauth%2Flogin%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2Flogin%2Froute.ts&appDir=%2FUsers%2Fsaurabhksingh%2Fdev%2Fdomains%2Fcollaboration-app%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fsaurabhksingh%2Fdev%2Fdomains%2Fcollaboration-app&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true!":
/*!******************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true! ***!
  \******************************************************************************************************/
/***/ (() => {



/***/ }),

/***/ "(ssr)/./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true!":
/*!******************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true! ***!
  \******************************************************************************************************/
/***/ (() => {



/***/ }),

/***/ "(rsc)/./app/api/auth/login/route.ts":
/*!*************************************!*\
  !*** ./app/api/auth/login/route.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   POST: () => (/* binding */ POST)\n/* harmony export */ });\n/* harmony import */ var bcryptjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! bcryptjs */ \"(rsc)/./node_modules/bcryptjs/index.js\");\n/* harmony import */ var bcryptjs__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(bcryptjs__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/next/dist/api/server.js\");\n/* harmony import */ var zod__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! zod */ \"(rsc)/./node_modules/zod/v3/types.js\");\n/* harmony import */ var _lib_auth__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/lib/auth */ \"(rsc)/./lib/auth.ts\");\n/* harmony import */ var _lib_constants__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @/lib/constants */ \"(rsc)/./lib/constants.ts\");\n/* harmony import */ var _lib_prisma__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @/lib/prisma */ \"(rsc)/./lib/prisma.ts\");\n\n\n\n\n\n\nconst schema = zod__WEBPACK_IMPORTED_MODULE_5__.object({\n    email: zod__WEBPACK_IMPORTED_MODULE_5__.string().email(),\n    password: zod__WEBPACK_IMPORTED_MODULE_5__.string().min(8)\n});\nasync function POST(request) {\n    const body = await request.json().catch(()=>null);\n    const parsed = schema.safeParse(body);\n    if (!parsed.success) {\n        return next_server__WEBPACK_IMPORTED_MODULE_1__.NextResponse.json({\n            error: \"Invalid credentials payload.\"\n        }, {\n            status: 400\n        });\n    }\n    const email = parsed.data.email.toLowerCase().trim();\n    const user = await _lib_prisma__WEBPACK_IMPORTED_MODULE_4__.prisma.user.findUnique({\n        where: {\n            email\n        }\n    });\n    if (!user) {\n        return next_server__WEBPACK_IMPORTED_MODULE_1__.NextResponse.json({\n            error: \"Invalid email or password.\"\n        }, {\n            status: 401\n        });\n    }\n    const ok = await bcryptjs__WEBPACK_IMPORTED_MODULE_0___default().compare(parsed.data.password, user.passwordHash);\n    if (!ok) {\n        return next_server__WEBPACK_IMPORTED_MODULE_1__.NextResponse.json({\n            error: \"Invalid email or password.\"\n        }, {\n            status: 401\n        });\n    }\n    const { token, expiresAt } = await (0,_lib_auth__WEBPACK_IMPORTED_MODULE_2__.createSession)(user.id);\n    const response = next_server__WEBPACK_IMPORTED_MODULE_1__.NextResponse.json({\n        ok: true\n    });\n    response.cookies.set({\n        name: _lib_constants__WEBPACK_IMPORTED_MODULE_3__.SESSION_COOKIE_NAME,\n        value: token,\n        httpOnly: true,\n        sameSite: \"lax\",\n        secure: \"development\" === \"production\",\n        path: \"/\",\n        expires: expiresAt\n    });\n    return response;\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9hcHAvYXBpL2F1dGgvbG9naW4vcm91dGUudHMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBOEI7QUFDYTtBQUNuQjtBQUNtQjtBQUNXO0FBQ2hCO0FBRXRDLE1BQU1NLFNBQVNKLHVDQUFRLENBQUM7SUFDdEJNLE9BQU9OLHVDQUFRLEdBQUdNLEtBQUs7SUFDdkJFLFVBQVVSLHVDQUFRLEdBQUdTLEdBQUcsQ0FBQztBQUMzQjtBQUVPLGVBQWVDLEtBQUtDLE9BQWdCO0lBQ3pDLE1BQU1DLE9BQU8sTUFBTUQsUUFBUUUsSUFBSSxHQUFHQyxLQUFLLENBQUMsSUFBTTtJQUM5QyxNQUFNQyxTQUFTWCxPQUFPWSxTQUFTLENBQUNKO0lBRWhDLElBQUksQ0FBQ0csT0FBT0UsT0FBTyxFQUFFO1FBQ25CLE9BQU9sQixxREFBWUEsQ0FBQ2MsSUFBSSxDQUFDO1lBQUVLLE9BQU87UUFBK0IsR0FBRztZQUFFQyxRQUFRO1FBQUk7SUFDcEY7SUFFQSxNQUFNYixRQUFRUyxPQUFPSyxJQUFJLENBQUNkLEtBQUssQ0FBQ2UsV0FBVyxHQUFHQyxJQUFJO0lBQ2xELE1BQU1DLE9BQU8sTUFBTXBCLCtDQUFNQSxDQUFDb0IsSUFBSSxDQUFDQyxVQUFVLENBQUM7UUFBRUMsT0FBTztZQUFFbkI7UUFBTTtJQUFFO0lBQzdELElBQUksQ0FBQ2lCLE1BQU07UUFDVCxPQUFPeEIscURBQVlBLENBQUNjLElBQUksQ0FBQztZQUFFSyxPQUFPO1FBQTZCLEdBQUc7WUFBRUMsUUFBUTtRQUFJO0lBQ2xGO0lBRUEsTUFBTU8sS0FBSyxNQUFNNUIsdURBQWMsQ0FBQ2lCLE9BQU9LLElBQUksQ0FBQ1osUUFBUSxFQUFFZSxLQUFLSyxZQUFZO0lBQ3ZFLElBQUksQ0FBQ0YsSUFBSTtRQUNQLE9BQU8zQixxREFBWUEsQ0FBQ2MsSUFBSSxDQUFDO1lBQUVLLE9BQU87UUFBNkIsR0FBRztZQUFFQyxRQUFRO1FBQUk7SUFDbEY7SUFFQSxNQUFNLEVBQUVVLEtBQUssRUFBRUMsU0FBUyxFQUFFLEdBQUcsTUFBTTdCLHdEQUFhQSxDQUFDc0IsS0FBS1EsRUFBRTtJQUN4RCxNQUFNQyxXQUFXakMscURBQVlBLENBQUNjLElBQUksQ0FBQztRQUFFYSxJQUFJO0lBQUs7SUFDOUNNLFNBQVNDLE9BQU8sQ0FBQ0MsR0FBRyxDQUFDO1FBQ25CQyxNQUFNakMsK0RBQW1CQTtRQUN6QmtDLE9BQU9QO1FBQ1BRLFVBQVU7UUFDVkMsVUFBVTtRQUNWQyxRQUFRQyxrQkFBeUI7UUFDakNDLE1BQU07UUFDTkMsU0FBU1o7SUFDWDtJQUVBLE9BQU9FO0FBQ1QiLCJzb3VyY2VzIjpbIi9Vc2Vycy9zYXVyYWJoa3NpbmdoL2Rldi9kb21haW5zL2NvbGxhYm9yYXRpb24tYXBwL2FwcC9hcGkvYXV0aC9sb2dpbi9yb3V0ZS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgYmNyeXB0IGZyb20gXCJiY3J5cHRqc1wiO1xuaW1wb3J0IHsgTmV4dFJlc3BvbnNlIH0gZnJvbSBcIm5leHQvc2VydmVyXCI7XG5pbXBvcnQgeyB6IH0gZnJvbSBcInpvZFwiO1xuaW1wb3J0IHsgY3JlYXRlU2Vzc2lvbiB9IGZyb20gXCJAL2xpYi9hdXRoXCI7XG5pbXBvcnQgeyBTRVNTSU9OX0NPT0tJRV9OQU1FIH0gZnJvbSBcIkAvbGliL2NvbnN0YW50c1wiO1xuaW1wb3J0IHsgcHJpc21hIH0gZnJvbSBcIkAvbGliL3ByaXNtYVwiO1xuXG5jb25zdCBzY2hlbWEgPSB6Lm9iamVjdCh7XG4gIGVtYWlsOiB6LnN0cmluZygpLmVtYWlsKCksXG4gIHBhc3N3b3JkOiB6LnN0cmluZygpLm1pbig4KVxufSk7XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBQT1NUKHJlcXVlc3Q6IFJlcXVlc3QpIHtcbiAgY29uc3QgYm9keSA9IGF3YWl0IHJlcXVlc3QuanNvbigpLmNhdGNoKCgpID0+IG51bGwpO1xuICBjb25zdCBwYXJzZWQgPSBzY2hlbWEuc2FmZVBhcnNlKGJvZHkpO1xuXG4gIGlmICghcGFyc2VkLnN1Y2Nlc3MpIHtcbiAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oeyBlcnJvcjogXCJJbnZhbGlkIGNyZWRlbnRpYWxzIHBheWxvYWQuXCIgfSwgeyBzdGF0dXM6IDQwMCB9KTtcbiAgfVxuXG4gIGNvbnN0IGVtYWlsID0gcGFyc2VkLmRhdGEuZW1haWwudG9Mb3dlckNhc2UoKS50cmltKCk7XG4gIGNvbnN0IHVzZXIgPSBhd2FpdCBwcmlzbWEudXNlci5maW5kVW5pcXVlKHsgd2hlcmU6IHsgZW1haWwgfSB9KTtcbiAgaWYgKCF1c2VyKSB7XG4gICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHsgZXJyb3I6IFwiSW52YWxpZCBlbWFpbCBvciBwYXNzd29yZC5cIiB9LCB7IHN0YXR1czogNDAxIH0pO1xuICB9XG5cbiAgY29uc3Qgb2sgPSBhd2FpdCBiY3J5cHQuY29tcGFyZShwYXJzZWQuZGF0YS5wYXNzd29yZCwgdXNlci5wYXNzd29yZEhhc2gpO1xuICBpZiAoIW9rKSB7XG4gICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHsgZXJyb3I6IFwiSW52YWxpZCBlbWFpbCBvciBwYXNzd29yZC5cIiB9LCB7IHN0YXR1czogNDAxIH0pO1xuICB9XG5cbiAgY29uc3QgeyB0b2tlbiwgZXhwaXJlc0F0IH0gPSBhd2FpdCBjcmVhdGVTZXNzaW9uKHVzZXIuaWQpO1xuICBjb25zdCByZXNwb25zZSA9IE5leHRSZXNwb25zZS5qc29uKHsgb2s6IHRydWUgfSk7XG4gIHJlc3BvbnNlLmNvb2tpZXMuc2V0KHtcbiAgICBuYW1lOiBTRVNTSU9OX0NPT0tJRV9OQU1FLFxuICAgIHZhbHVlOiB0b2tlbixcbiAgICBodHRwT25seTogdHJ1ZSxcbiAgICBzYW1lU2l0ZTogXCJsYXhcIixcbiAgICBzZWN1cmU6IHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSBcInByb2R1Y3Rpb25cIixcbiAgICBwYXRoOiBcIi9cIixcbiAgICBleHBpcmVzOiBleHBpcmVzQXRcbiAgfSk7XG5cbiAgcmV0dXJuIHJlc3BvbnNlO1xufVxuIl0sIm5hbWVzIjpbImJjcnlwdCIsIk5leHRSZXNwb25zZSIsInoiLCJjcmVhdGVTZXNzaW9uIiwiU0VTU0lPTl9DT09LSUVfTkFNRSIsInByaXNtYSIsInNjaGVtYSIsIm9iamVjdCIsImVtYWlsIiwic3RyaW5nIiwicGFzc3dvcmQiLCJtaW4iLCJQT1NUIiwicmVxdWVzdCIsImJvZHkiLCJqc29uIiwiY2F0Y2giLCJwYXJzZWQiLCJzYWZlUGFyc2UiLCJzdWNjZXNzIiwiZXJyb3IiLCJzdGF0dXMiLCJkYXRhIiwidG9Mb3dlckNhc2UiLCJ0cmltIiwidXNlciIsImZpbmRVbmlxdWUiLCJ3aGVyZSIsIm9rIiwiY29tcGFyZSIsInBhc3N3b3JkSGFzaCIsInRva2VuIiwiZXhwaXJlc0F0IiwiaWQiLCJyZXNwb25zZSIsImNvb2tpZXMiLCJzZXQiLCJuYW1lIiwidmFsdWUiLCJodHRwT25seSIsInNhbWVTaXRlIiwic2VjdXJlIiwicHJvY2VzcyIsInBhdGgiLCJleHBpcmVzIl0sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./app/api/auth/login/route.ts\n");

/***/ }),

/***/ "(rsc)/./lib/auth.ts":
/*!*********************!*\
  !*** ./lib/auth.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   authCookieConfig: () => (/* binding */ authCookieConfig),\n/* harmony export */   clearSessionByToken: () => (/* binding */ clearSessionByToken),\n/* harmony export */   createSession: () => (/* binding */ createSession),\n/* harmony export */   getCurrentUser: () => (/* binding */ getCurrentUser),\n/* harmony export */   requireAdmin: () => (/* binding */ requireAdmin),\n/* harmony export */   requireUser: () => (/* binding */ requireUser)\n/* harmony export */ });\n/* harmony import */ var crypto__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! crypto */ \"crypto\");\n/* harmony import */ var crypto__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(crypto__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_headers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/headers */ \"(rsc)/./node_modules/next/dist/api/headers.js\");\n/* harmony import */ var next_navigation__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/navigation */ \"(rsc)/./node_modules/next/dist/api/navigation.react-server.js\");\n/* harmony import */ var _lib_constants__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @/lib/constants */ \"(rsc)/./lib/constants.ts\");\n/* harmony import */ var _lib_prisma__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @/lib/prisma */ \"(rsc)/./lib/prisma.ts\");\n\n\n\n\n\nasync function createSession(userId) {\n    const token = crypto__WEBPACK_IMPORTED_MODULE_0___default().randomBytes(32).toString(\"hex\");\n    const expiresAt = new Date(Date.now() + _lib_constants__WEBPACK_IMPORTED_MODULE_3__.SESSION_DURATION_MS);\n    await _lib_prisma__WEBPACK_IMPORTED_MODULE_4__.prisma.session.create({\n        data: {\n            token,\n            userId,\n            expiresAt\n        }\n    });\n    return {\n        token,\n        expiresAt\n    };\n}\nasync function getCurrentUser() {\n    const cookieStore = await (0,next_headers__WEBPACK_IMPORTED_MODULE_1__.cookies)();\n    const token = cookieStore.get(_lib_constants__WEBPACK_IMPORTED_MODULE_3__.SESSION_COOKIE_NAME)?.value;\n    if (!token) return null;\n    const session = await _lib_prisma__WEBPACK_IMPORTED_MODULE_4__.prisma.session.findUnique({\n        where: {\n            token\n        },\n        include: {\n            user: true\n        }\n    });\n    if (!session) return null;\n    if (session.expiresAt.getTime() < Date.now()) {\n        await _lib_prisma__WEBPACK_IMPORTED_MODULE_4__.prisma.session.delete({\n            where: {\n                token\n            }\n        }).catch(()=>undefined);\n        return null;\n    }\n    return session.user;\n}\nasync function requireUser() {\n    const user = await getCurrentUser();\n    if (!user) (0,next_navigation__WEBPACK_IMPORTED_MODULE_2__.redirect)(\"/login\");\n    return user;\n}\nasync function requireAdmin() {\n    const user = await requireUser();\n    if (user.role !== \"ADMIN\") (0,next_navigation__WEBPACK_IMPORTED_MODULE_2__.redirect)(\"/chat\");\n    return user;\n}\nasync function clearSessionByToken(token) {\n    await _lib_prisma__WEBPACK_IMPORTED_MODULE_4__.prisma.session.delete({\n        where: {\n            token\n        }\n    }).catch(()=>undefined);\n}\nfunction authCookieConfig(expiresAt) {\n    return {\n        name: _lib_constants__WEBPACK_IMPORTED_MODULE_3__.SESSION_COOKIE_NAME,\n        value: \"\",\n        options: {\n            httpOnly: true,\n            sameSite: \"lax\",\n            secure: \"development\" === \"production\",\n            path: \"/\",\n            expires: expiresAt\n        }\n    };\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9saWIvYXV0aC50cyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFBNEI7QUFDVztBQUNJO0FBRWdDO0FBQ3JDO0FBRS9CLGVBQWVNLGNBQWNDLE1BQWM7SUFDaEQsTUFBTUMsUUFBUVIseURBQWtCLENBQUMsSUFBSVUsUUFBUSxDQUFDO0lBQzlDLE1BQU1DLFlBQVksSUFBSUMsS0FBS0EsS0FBS0MsR0FBRyxLQUFLVCwrREFBbUJBO0lBRTNELE1BQU1DLCtDQUFNQSxDQUFDUyxPQUFPLENBQUNDLE1BQU0sQ0FBQztRQUMxQkMsTUFBTTtZQUFFUjtZQUFPRDtZQUFRSTtRQUFVO0lBQ25DO0lBRUEsT0FBTztRQUFFSDtRQUFPRztJQUFVO0FBQzVCO0FBRU8sZUFBZU07SUFDcEIsTUFBTUMsY0FBYyxNQUFNakIscURBQU9BO0lBQ2pDLE1BQU1PLFFBQVFVLFlBQVlDLEdBQUcsQ0FBQ2hCLCtEQUFtQkEsR0FBR2lCO0lBQ3BELElBQUksQ0FBQ1osT0FBTyxPQUFPO0lBRW5CLE1BQU1NLFVBQVUsTUFBTVQsK0NBQU1BLENBQUNTLE9BQU8sQ0FBQ08sVUFBVSxDQUFDO1FBQzlDQyxPQUFPO1lBQUVkO1FBQU07UUFDZmUsU0FBUztZQUFFQyxNQUFNO1FBQUs7SUFDeEI7SUFFQSxJQUFJLENBQUNWLFNBQVMsT0FBTztJQUVyQixJQUFJQSxRQUFRSCxTQUFTLENBQUNjLE9BQU8sS0FBS2IsS0FBS0MsR0FBRyxJQUFJO1FBQzVDLE1BQU1SLCtDQUFNQSxDQUFDUyxPQUFPLENBQUNZLE1BQU0sQ0FBQztZQUFFSixPQUFPO2dCQUFFZDtZQUFNO1FBQUUsR0FBR21CLEtBQUssQ0FBQyxJQUFNQztRQUM5RCxPQUFPO0lBQ1Q7SUFFQSxPQUFPZCxRQUFRVSxJQUFJO0FBQ3JCO0FBRU8sZUFBZUs7SUFDcEIsTUFBTUwsT0FBTyxNQUFNUDtJQUNuQixJQUFJLENBQUNPLE1BQU10Qix5REFBUUEsQ0FBQztJQUNwQixPQUFPc0I7QUFDVDtBQUVPLGVBQWVNO0lBQ3BCLE1BQU1OLE9BQU8sTUFBTUs7SUFDbkIsSUFBSUwsS0FBS08sSUFBSSxLQUFLLFNBQVM3Qix5REFBUUEsQ0FBQztJQUNwQyxPQUFPc0I7QUFDVDtBQUVPLGVBQWVRLG9CQUFvQnhCLEtBQWE7SUFDckQsTUFBTUgsK0NBQU1BLENBQUNTLE9BQU8sQ0FBQ1ksTUFBTSxDQUFDO1FBQUVKLE9BQU87WUFBRWQ7UUFBTTtJQUFFLEdBQUdtQixLQUFLLENBQUMsSUFBTUM7QUFDaEU7QUFFTyxTQUFTSyxpQkFBaUJ0QixTQUFlO0lBQzlDLE9BQU87UUFDTHVCLE1BQU0vQiwrREFBbUJBO1FBQ3pCaUIsT0FBTztRQUNQZSxTQUFTO1lBQ1BDLFVBQVU7WUFDVkMsVUFBVTtZQUNWQyxRQUFRQyxrQkFBeUI7WUFDakNDLE1BQU07WUFDTkMsU0FBUzlCO1FBQ1g7SUFDRjtBQUNGIiwic291cmNlcyI6WyIvVXNlcnMvc2F1cmFiaGtzaW5naC9kZXYvZG9tYWlucy9jb2xsYWJvcmF0aW9uLWFwcC9saWIvYXV0aC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgY3J5cHRvIGZyb20gXCJjcnlwdG9cIjtcbmltcG9ydCB7IGNvb2tpZXMgfSBmcm9tIFwibmV4dC9oZWFkZXJzXCI7XG5pbXBvcnQgeyByZWRpcmVjdCB9IGZyb20gXCJuZXh0L25hdmlnYXRpb25cIjtcbmltcG9ydCB0eXBlIHsgVXNlciB9IGZyb20gXCJAcHJpc21hL2NsaWVudFwiO1xuaW1wb3J0IHsgU0VTU0lPTl9DT09LSUVfTkFNRSwgU0VTU0lPTl9EVVJBVElPTl9NUyB9IGZyb20gXCJAL2xpYi9jb25zdGFudHNcIjtcbmltcG9ydCB7IHByaXNtYSB9IGZyb20gXCJAL2xpYi9wcmlzbWFcIjtcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGNyZWF0ZVNlc3Npb24odXNlcklkOiBzdHJpbmcpIHtcbiAgY29uc3QgdG9rZW4gPSBjcnlwdG8ucmFuZG9tQnl0ZXMoMzIpLnRvU3RyaW5nKFwiaGV4XCIpO1xuICBjb25zdCBleHBpcmVzQXQgPSBuZXcgRGF0ZShEYXRlLm5vdygpICsgU0VTU0lPTl9EVVJBVElPTl9NUyk7XG5cbiAgYXdhaXQgcHJpc21hLnNlc3Npb24uY3JlYXRlKHtcbiAgICBkYXRhOiB7IHRva2VuLCB1c2VySWQsIGV4cGlyZXNBdCB9XG4gIH0pO1xuXG4gIHJldHVybiB7IHRva2VuLCBleHBpcmVzQXQgfTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldEN1cnJlbnRVc2VyKCk6IFByb21pc2U8VXNlciB8IG51bGw+IHtcbiAgY29uc3QgY29va2llU3RvcmUgPSBhd2FpdCBjb29raWVzKCk7XG4gIGNvbnN0IHRva2VuID0gY29va2llU3RvcmUuZ2V0KFNFU1NJT05fQ09PS0lFX05BTUUpPy52YWx1ZTtcbiAgaWYgKCF0b2tlbikgcmV0dXJuIG51bGw7XG5cbiAgY29uc3Qgc2Vzc2lvbiA9IGF3YWl0IHByaXNtYS5zZXNzaW9uLmZpbmRVbmlxdWUoe1xuICAgIHdoZXJlOiB7IHRva2VuIH0sXG4gICAgaW5jbHVkZTogeyB1c2VyOiB0cnVlIH1cbiAgfSk7XG5cbiAgaWYgKCFzZXNzaW9uKSByZXR1cm4gbnVsbDtcblxuICBpZiAoc2Vzc2lvbi5leHBpcmVzQXQuZ2V0VGltZSgpIDwgRGF0ZS5ub3coKSkge1xuICAgIGF3YWl0IHByaXNtYS5zZXNzaW9uLmRlbGV0ZSh7IHdoZXJlOiB7IHRva2VuIH0gfSkuY2F0Y2goKCkgPT4gdW5kZWZpbmVkKTtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHJldHVybiBzZXNzaW9uLnVzZXI7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiByZXF1aXJlVXNlcigpIHtcbiAgY29uc3QgdXNlciA9IGF3YWl0IGdldEN1cnJlbnRVc2VyKCk7XG4gIGlmICghdXNlcikgcmVkaXJlY3QoXCIvbG9naW5cIik7XG4gIHJldHVybiB1c2VyO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gcmVxdWlyZUFkbWluKCkge1xuICBjb25zdCB1c2VyID0gYXdhaXQgcmVxdWlyZVVzZXIoKTtcbiAgaWYgKHVzZXIucm9sZSAhPT0gXCJBRE1JTlwiKSByZWRpcmVjdChcIi9jaGF0XCIpO1xuICByZXR1cm4gdXNlcjtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGNsZWFyU2Vzc2lvbkJ5VG9rZW4odG9rZW46IHN0cmluZykge1xuICBhd2FpdCBwcmlzbWEuc2Vzc2lvbi5kZWxldGUoeyB3aGVyZTogeyB0b2tlbiB9IH0pLmNhdGNoKCgpID0+IHVuZGVmaW5lZCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhdXRoQ29va2llQ29uZmlnKGV4cGlyZXNBdDogRGF0ZSkge1xuICByZXR1cm4ge1xuICAgIG5hbWU6IFNFU1NJT05fQ09PS0lFX05BTUUsXG4gICAgdmFsdWU6IFwiXCIsXG4gICAgb3B0aW9uczoge1xuICAgICAgaHR0cE9ubHk6IHRydWUsXG4gICAgICBzYW1lU2l0ZTogXCJsYXhcIiBhcyBjb25zdCxcbiAgICAgIHNlY3VyZTogcHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09IFwicHJvZHVjdGlvblwiLFxuICAgICAgcGF0aDogXCIvXCIsXG4gICAgICBleHBpcmVzOiBleHBpcmVzQXRcbiAgICB9XG4gIH07XG59XG4iXSwibmFtZXMiOlsiY3J5cHRvIiwiY29va2llcyIsInJlZGlyZWN0IiwiU0VTU0lPTl9DT09LSUVfTkFNRSIsIlNFU1NJT05fRFVSQVRJT05fTVMiLCJwcmlzbWEiLCJjcmVhdGVTZXNzaW9uIiwidXNlcklkIiwidG9rZW4iLCJyYW5kb21CeXRlcyIsInRvU3RyaW5nIiwiZXhwaXJlc0F0IiwiRGF0ZSIsIm5vdyIsInNlc3Npb24iLCJjcmVhdGUiLCJkYXRhIiwiZ2V0Q3VycmVudFVzZXIiLCJjb29raWVTdG9yZSIsImdldCIsInZhbHVlIiwiZmluZFVuaXF1ZSIsIndoZXJlIiwiaW5jbHVkZSIsInVzZXIiLCJnZXRUaW1lIiwiZGVsZXRlIiwiY2F0Y2giLCJ1bmRlZmluZWQiLCJyZXF1aXJlVXNlciIsInJlcXVpcmVBZG1pbiIsInJvbGUiLCJjbGVhclNlc3Npb25CeVRva2VuIiwiYXV0aENvb2tpZUNvbmZpZyIsIm5hbWUiLCJvcHRpb25zIiwiaHR0cE9ubHkiLCJzYW1lU2l0ZSIsInNlY3VyZSIsInByb2Nlc3MiLCJwYXRoIiwiZXhwaXJlcyJdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./lib/auth.ts\n");

/***/ }),

/***/ "(rsc)/./lib/constants.ts":
/*!**************************!*\
  !*** ./lib/constants.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   SESSION_COOKIE_NAME: () => (/* binding */ SESSION_COOKIE_NAME),\n/* harmony export */   SESSION_DURATION_MS: () => (/* binding */ SESSION_DURATION_MS)\n/* harmony export */ });\nconst SESSION_COOKIE_NAME = process.env.SESSION_COOKIE_NAME || \"collab_session\";\nconst SESSION_DURATION_MS = 1000 * 60 * 60 * 24 * 14; // 14 days\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9saWIvY29uc3RhbnRzLnRzIiwibWFwcGluZ3MiOiI7Ozs7O0FBQU8sTUFBTUEsc0JBQXNCQyxRQUFRQyxHQUFHLENBQUNGLG1CQUFtQixJQUFJLGlCQUFpQjtBQUNoRixNQUFNRyxzQkFBc0IsT0FBTyxLQUFLLEtBQUssS0FBSyxHQUFHLENBQUMsVUFBVSIsInNvdXJjZXMiOlsiL1VzZXJzL3NhdXJhYmhrc2luZ2gvZGV2L2RvbWFpbnMvY29sbGFib3JhdGlvbi1hcHAvbGliL2NvbnN0YW50cy50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgY29uc3QgU0VTU0lPTl9DT09LSUVfTkFNRSA9IHByb2Nlc3MuZW52LlNFU1NJT05fQ09PS0lFX05BTUUgfHwgXCJjb2xsYWJfc2Vzc2lvblwiO1xuZXhwb3J0IGNvbnN0IFNFU1NJT05fRFVSQVRJT05fTVMgPSAxMDAwICogNjAgKiA2MCAqIDI0ICogMTQ7IC8vIDE0IGRheXNcbiJdLCJuYW1lcyI6WyJTRVNTSU9OX0NPT0tJRV9OQU1FIiwicHJvY2VzcyIsImVudiIsIlNFU1NJT05fRFVSQVRJT05fTVMiXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./lib/constants.ts\n");

/***/ }),

/***/ "(rsc)/./lib/prisma.ts":
/*!***********************!*\
  !*** ./lib/prisma.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   prisma: () => (/* binding */ prisma)\n/* harmony export */ });\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @prisma/client */ \"@prisma/client\");\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_prisma_client__WEBPACK_IMPORTED_MODULE_0__);\n\nconst prisma = global.prisma || new _prisma_client__WEBPACK_IMPORTED_MODULE_0__.PrismaClient({\n    log:  true ? [\n        \"error\",\n        \"warn\"\n    ] : 0\n});\nif (true) {\n    global.prisma = prisma;\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9saWIvcHJpc21hLnRzIiwibWFwcGluZ3MiOiI7Ozs7OztBQUE4QztBQU92QyxNQUFNQyxTQUNYQyxPQUFPRCxNQUFNLElBQ2IsSUFBSUQsd0RBQVlBLENBQUM7SUFDZkcsS0FBS0MsS0FBc0MsR0FBRztRQUFDO1FBQVM7S0FBTyxHQUFHLENBQVM7QUFDN0UsR0FBRztBQUVMLElBQUlBLElBQXFDLEVBQUU7SUFDekNGLE9BQU9ELE1BQU0sR0FBR0E7QUFDbEIiLCJzb3VyY2VzIjpbIi9Vc2Vycy9zYXVyYWJoa3NpbmdoL2Rldi9kb21haW5zL2NvbGxhYm9yYXRpb24tYXBwL2xpYi9wcmlzbWEudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUHJpc21hQ2xpZW50IH0gZnJvbSBcIkBwcmlzbWEvY2xpZW50XCI7XG5cbmRlY2xhcmUgZ2xvYmFsIHtcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXZhclxuICB2YXIgcHJpc21hOiBQcmlzbWFDbGllbnQgfCB1bmRlZmluZWQ7XG59XG5cbmV4cG9ydCBjb25zdCBwcmlzbWEgPVxuICBnbG9iYWwucHJpc21hIHx8XG4gIG5ldyBQcmlzbWFDbGllbnQoe1xuICAgIGxvZzogcHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09IFwiZGV2ZWxvcG1lbnRcIiA/IFtcImVycm9yXCIsIFwid2FyblwiXSA6IFtcImVycm9yXCJdXG4gIH0pO1xuXG5pZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKSB7XG4gIGdsb2JhbC5wcmlzbWEgPSBwcmlzbWE7XG59XG4iXSwibmFtZXMiOlsiUHJpc21hQ2xpZW50IiwicHJpc21hIiwiZ2xvYmFsIiwibG9nIiwicHJvY2VzcyJdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./lib/prisma.ts\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/zod","vendor-chunks/bcryptjs"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fauth%2Flogin%2Froute&page=%2Fapi%2Fauth%2Flogin%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2Flogin%2Froute.ts&appDir=%2FUsers%2Fsaurabhksingh%2Fdev%2Fdomains%2Fcollaboration-app%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fsaurabhksingh%2Fdev%2Fdomains%2Fcollaboration-app&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();
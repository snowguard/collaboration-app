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
exports.id = "app/api/users/route";
exports.ids = ["app/api/users/route"];
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

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fusers%2Froute&page=%2Fapi%2Fusers%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fusers%2Froute.ts&appDir=%2FUsers%2Fsaurabhksingh%2Fdev%2Fdomains%2Fcollaboration-app%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fsaurabhksingh%2Fdev%2Fdomains%2Fcollaboration-app&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!*************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fusers%2Froute&page=%2Fapi%2Fusers%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fusers%2Froute.ts&appDir=%2FUsers%2Fsaurabhksingh%2Fdev%2Fdomains%2Fcollaboration-app%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fsaurabhksingh%2Fdev%2Fdomains%2Fcollaboration-app&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \*************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   workAsyncStorage: () => (/* binding */ workAsyncStorage),\n/* harmony export */   workUnitAsyncStorage: () => (/* binding */ workUnitAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/route-kind */ \"(rsc)/./node_modules/next/dist/server/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _Users_saurabhksingh_dev_domains_collaboration_app_app_api_users_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app/api/users/route.ts */ \"(rsc)/./app/api/users/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/users/route\",\n        pathname: \"/api/users\",\n        filename: \"route\",\n        bundlePath: \"app/api/users/route\"\n    },\n    resolvedPagePath: \"/Users/saurabhksingh/dev/domains/collaboration-app/app/api/users/route.ts\",\n    nextConfigOutput,\n    userland: _Users_saurabhksingh_dev_domains_collaboration_app_app_api_users_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { workAsyncStorage, workUnitAsyncStorage, serverHooks } = routeModule;\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        workAsyncStorage,\n        workUnitAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIvaW5kZXguanM/bmFtZT1hcHAlMkZhcGklMkZ1c2VycyUyRnJvdXRlJnBhZ2U9JTJGYXBpJTJGdXNlcnMlMkZyb3V0ZSZhcHBQYXRocz0mcGFnZVBhdGg9cHJpdmF0ZS1uZXh0LWFwcC1kaXIlMkZhcGklMkZ1c2VycyUyRnJvdXRlLnRzJmFwcERpcj0lMkZVc2VycyUyRnNhdXJhYmhrc2luZ2glMkZkZXYlMkZkb21haW5zJTJGY29sbGFib3JhdGlvbi1hcHAlMkZhcHAmcGFnZUV4dGVuc2lvbnM9dHN4JnBhZ2VFeHRlbnNpb25zPXRzJnBhZ2VFeHRlbnNpb25zPWpzeCZwYWdlRXh0ZW5zaW9ucz1qcyZyb290RGlyPSUyRlVzZXJzJTJGc2F1cmFiaGtzaW5naCUyRmRldiUyRmRvbWFpbnMlMkZjb2xsYWJvcmF0aW9uLWFwcCZpc0Rldj10cnVlJnRzY29uZmlnUGF0aD10c2NvbmZpZy5qc29uJmJhc2VQYXRoPSZhc3NldFByZWZpeD0mbmV4dENvbmZpZ091dHB1dD0mcHJlZmVycmVkUmVnaW9uPSZtaWRkbGV3YXJlQ29uZmlnPWUzMCUzRCEiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFBK0Y7QUFDdkM7QUFDcUI7QUFDeUI7QUFDdEc7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLHlHQUFtQjtBQUMzQztBQUNBLGNBQWMsa0VBQVM7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLFlBQVk7QUFDWixDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0EsUUFBUSxzREFBc0Q7QUFDOUQ7QUFDQSxXQUFXLDRFQUFXO0FBQ3RCO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDMEY7O0FBRTFGIiwic291cmNlcyI6WyIiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQXBwUm91dGVSb3V0ZU1vZHVsZSB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL3JvdXRlLW1vZHVsZXMvYXBwLXJvdXRlL21vZHVsZS5jb21waWxlZFwiO1xuaW1wb3J0IHsgUm91dGVLaW5kIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvcm91dGUta2luZFwiO1xuaW1wb3J0IHsgcGF0Y2hGZXRjaCBhcyBfcGF0Y2hGZXRjaCB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL2xpYi9wYXRjaC1mZXRjaFwiO1xuaW1wb3J0ICogYXMgdXNlcmxhbmQgZnJvbSBcIi9Vc2Vycy9zYXVyYWJoa3NpbmdoL2Rldi9kb21haW5zL2NvbGxhYm9yYXRpb24tYXBwL2FwcC9hcGkvdXNlcnMvcm91dGUudHNcIjtcbi8vIFdlIGluamVjdCB0aGUgbmV4dENvbmZpZ091dHB1dCBoZXJlIHNvIHRoYXQgd2UgY2FuIHVzZSB0aGVtIGluIHRoZSByb3V0ZVxuLy8gbW9kdWxlLlxuY29uc3QgbmV4dENvbmZpZ091dHB1dCA9IFwiXCJcbmNvbnN0IHJvdXRlTW9kdWxlID0gbmV3IEFwcFJvdXRlUm91dGVNb2R1bGUoe1xuICAgIGRlZmluaXRpb246IHtcbiAgICAgICAga2luZDogUm91dGVLaW5kLkFQUF9ST1VURSxcbiAgICAgICAgcGFnZTogXCIvYXBpL3VzZXJzL3JvdXRlXCIsXG4gICAgICAgIHBhdGhuYW1lOiBcIi9hcGkvdXNlcnNcIixcbiAgICAgICAgZmlsZW5hbWU6IFwicm91dGVcIixcbiAgICAgICAgYnVuZGxlUGF0aDogXCJhcHAvYXBpL3VzZXJzL3JvdXRlXCJcbiAgICB9LFxuICAgIHJlc29sdmVkUGFnZVBhdGg6IFwiL1VzZXJzL3NhdXJhYmhrc2luZ2gvZGV2L2RvbWFpbnMvY29sbGFib3JhdGlvbi1hcHAvYXBwL2FwaS91c2Vycy9yb3V0ZS50c1wiLFxuICAgIG5leHRDb25maWdPdXRwdXQsXG4gICAgdXNlcmxhbmRcbn0pO1xuLy8gUHVsbCBvdXQgdGhlIGV4cG9ydHMgdGhhdCB3ZSBuZWVkIHRvIGV4cG9zZSBmcm9tIHRoZSBtb2R1bGUuIFRoaXMgc2hvdWxkXG4vLyBiZSBlbGltaW5hdGVkIHdoZW4gd2UndmUgbW92ZWQgdGhlIG90aGVyIHJvdXRlcyB0byB0aGUgbmV3IGZvcm1hdC4gVGhlc2Vcbi8vIGFyZSB1c2VkIHRvIGhvb2sgaW50byB0aGUgcm91dGUuXG5jb25zdCB7IHdvcmtBc3luY1N0b3JhZ2UsIHdvcmtVbml0QXN5bmNTdG9yYWdlLCBzZXJ2ZXJIb29rcyB9ID0gcm91dGVNb2R1bGU7XG5mdW5jdGlvbiBwYXRjaEZldGNoKCkge1xuICAgIHJldHVybiBfcGF0Y2hGZXRjaCh7XG4gICAgICAgIHdvcmtBc3luY1N0b3JhZ2UsXG4gICAgICAgIHdvcmtVbml0QXN5bmNTdG9yYWdlXG4gICAgfSk7XG59XG5leHBvcnQgeyByb3V0ZU1vZHVsZSwgd29ya0FzeW5jU3RvcmFnZSwgd29ya1VuaXRBc3luY1N0b3JhZ2UsIHNlcnZlckhvb2tzLCBwYXRjaEZldGNoLCAgfTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YXBwLXJvdXRlLmpzLm1hcCJdLCJuYW1lcyI6W10sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fusers%2Froute&page=%2Fapi%2Fusers%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fusers%2Froute.ts&appDir=%2FUsers%2Fsaurabhksingh%2Fdev%2Fdomains%2Fcollaboration-app%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fsaurabhksingh%2Fdev%2Fdomains%2Fcollaboration-app&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

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

/***/ "(rsc)/./app/api/users/route.ts":
/*!********************************!*\
  !*** ./app/api/users/route.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   GET: () => (/* binding */ GET)\n/* harmony export */ });\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/next/dist/api/server.js\");\n/* harmony import */ var _lib_api_auth__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/lib/api-auth */ \"(rsc)/./lib/api-auth.ts\");\n/* harmony import */ var _lib_prisma__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/lib/prisma */ \"(rsc)/./lib/prisma.ts\");\n\n\n\nasync function GET(request) {\n    const user = await (0,_lib_api_auth__WEBPACK_IMPORTED_MODULE_1__.getRequestUser)(request);\n    if (!user) {\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: \"Unauthorized\"\n        }, {\n            status: 401\n        });\n    }\n    const now = new Date();\n    const users = await _lib_prisma__WEBPACK_IMPORTED_MODULE_2__.prisma.user.findMany({\n        where: {\n            id: {\n                not: user.id\n            }\n        },\n        select: {\n            id: true,\n            name: true,\n            email: true,\n            sessions: {\n                where: {\n                    expiresAt: {\n                        gt: now\n                    }\n                },\n                select: {\n                    id: true\n                },\n                take: 1\n            }\n        },\n        orderBy: {\n            name: \"asc\"\n        }\n    });\n    return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n        users: users.map((entry)=>({\n                id: entry.id,\n                name: entry.name,\n                email: entry.email,\n                online: entry.sessions.length > 0\n            }))\n    });\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9hcHAvYXBpL3VzZXJzL3JvdXRlLnRzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBd0Q7QUFDUjtBQUNWO0FBRS9CLGVBQWVHLElBQUlDLE9BQW9CO0lBQzVDLE1BQU1DLE9BQU8sTUFBTUosNkRBQWNBLENBQUNHO0lBQ2xDLElBQUksQ0FBQ0MsTUFBTTtRQUNULE9BQU9MLHFEQUFZQSxDQUFDTSxJQUFJLENBQUM7WUFBRUMsT0FBTztRQUFlLEdBQUc7WUFBRUMsUUFBUTtRQUFJO0lBQ3BFO0lBRUEsTUFBTUMsTUFBTSxJQUFJQztJQUNoQixNQUFNQyxRQUFRLE1BQU1ULCtDQUFNQSxDQUFDRyxJQUFJLENBQUNPLFFBQVEsQ0FBQztRQUN2Q0MsT0FBTztZQUFFQyxJQUFJO2dCQUFFQyxLQUFLVixLQUFLUyxFQUFFO1lBQUM7UUFBRTtRQUM5QkUsUUFBUTtZQUNORixJQUFJO1lBQ0pHLE1BQU07WUFDTkMsT0FBTztZQUNQQyxVQUFVO2dCQUNSTixPQUFPO29CQUFFTyxXQUFXO3dCQUFFQyxJQUFJWjtvQkFBSTtnQkFBRTtnQkFDaENPLFFBQVE7b0JBQUVGLElBQUk7Z0JBQUs7Z0JBQ25CUSxNQUFNO1lBQ1I7UUFDRjtRQUNBQyxTQUFTO1lBQUVOLE1BQU07UUFBTTtJQUN6QjtJQUVBLE9BQU9qQixxREFBWUEsQ0FBQ00sSUFBSSxDQUFDO1FBQ3ZCSyxPQUFPQSxNQUFNYSxHQUFHLENBQUMsQ0FBQ0MsUUFBVztnQkFDM0JYLElBQUlXLE1BQU1YLEVBQUU7Z0JBQ1pHLE1BQU1RLE1BQU1SLElBQUk7Z0JBQ2hCQyxPQUFPTyxNQUFNUCxLQUFLO2dCQUNsQlEsUUFBUUQsTUFBTU4sUUFBUSxDQUFDUSxNQUFNLEdBQUc7WUFDbEM7SUFDRjtBQUNGIiwic291cmNlcyI6WyIvVXNlcnMvc2F1cmFiaGtzaW5naC9kZXYvZG9tYWlucy9jb2xsYWJvcmF0aW9uLWFwcC9hcHAvYXBpL3VzZXJzL3JvdXRlLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5leHRSZXF1ZXN0LCBOZXh0UmVzcG9uc2UgfSBmcm9tIFwibmV4dC9zZXJ2ZXJcIjtcbmltcG9ydCB7IGdldFJlcXVlc3RVc2VyIH0gZnJvbSBcIkAvbGliL2FwaS1hdXRoXCI7XG5pbXBvcnQgeyBwcmlzbWEgfSBmcm9tIFwiQC9saWIvcHJpc21hXCI7XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBHRVQocmVxdWVzdDogTmV4dFJlcXVlc3QpIHtcbiAgY29uc3QgdXNlciA9IGF3YWl0IGdldFJlcXVlc3RVc2VyKHJlcXVlc3QpO1xuICBpZiAoIXVzZXIpIHtcbiAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oeyBlcnJvcjogXCJVbmF1dGhvcml6ZWRcIiB9LCB7IHN0YXR1czogNDAxIH0pO1xuICB9XG5cbiAgY29uc3Qgbm93ID0gbmV3IERhdGUoKTtcbiAgY29uc3QgdXNlcnMgPSBhd2FpdCBwcmlzbWEudXNlci5maW5kTWFueSh7XG4gICAgd2hlcmU6IHsgaWQ6IHsgbm90OiB1c2VyLmlkIH0gfSxcbiAgICBzZWxlY3Q6IHtcbiAgICAgIGlkOiB0cnVlLFxuICAgICAgbmFtZTogdHJ1ZSxcbiAgICAgIGVtYWlsOiB0cnVlLFxuICAgICAgc2Vzc2lvbnM6IHtcbiAgICAgICAgd2hlcmU6IHsgZXhwaXJlc0F0OiB7IGd0OiBub3cgfSB9LFxuICAgICAgICBzZWxlY3Q6IHsgaWQ6IHRydWUgfSxcbiAgICAgICAgdGFrZTogMVxuICAgICAgfVxuICAgIH0sXG4gICAgb3JkZXJCeTogeyBuYW1lOiBcImFzY1wiIH1cbiAgfSk7XG5cbiAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHtcbiAgICB1c2VyczogdXNlcnMubWFwKChlbnRyeSkgPT4gKHtcbiAgICAgIGlkOiBlbnRyeS5pZCxcbiAgICAgIG5hbWU6IGVudHJ5Lm5hbWUsXG4gICAgICBlbWFpbDogZW50cnkuZW1haWwsXG4gICAgICBvbmxpbmU6IGVudHJ5LnNlc3Npb25zLmxlbmd0aCA+IDBcbiAgICB9KSlcbiAgfSk7XG59XG4iXSwibmFtZXMiOlsiTmV4dFJlc3BvbnNlIiwiZ2V0UmVxdWVzdFVzZXIiLCJwcmlzbWEiLCJHRVQiLCJyZXF1ZXN0IiwidXNlciIsImpzb24iLCJlcnJvciIsInN0YXR1cyIsIm5vdyIsIkRhdGUiLCJ1c2VycyIsImZpbmRNYW55Iiwid2hlcmUiLCJpZCIsIm5vdCIsInNlbGVjdCIsIm5hbWUiLCJlbWFpbCIsInNlc3Npb25zIiwiZXhwaXJlc0F0IiwiZ3QiLCJ0YWtlIiwib3JkZXJCeSIsIm1hcCIsImVudHJ5Iiwib25saW5lIiwibGVuZ3RoIl0sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./app/api/users/route.ts\n");

/***/ }),

/***/ "(rsc)/./lib/api-auth.ts":
/*!*************************!*\
  !*** ./lib/api-auth.ts ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   getRequestToken: () => (/* binding */ getRequestToken),\n/* harmony export */   getRequestUser: () => (/* binding */ getRequestUser)\n/* harmony export */ });\n/* harmony import */ var _lib_constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @/lib/constants */ \"(rsc)/./lib/constants.ts\");\n/* harmony import */ var _lib_prisma__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/lib/prisma */ \"(rsc)/./lib/prisma.ts\");\n\n\nasync function getRequestUser(request) {\n    const token = request.cookies.get(_lib_constants__WEBPACK_IMPORTED_MODULE_0__.SESSION_COOKIE_NAME)?.value;\n    if (!token) return null;\n    const session = await _lib_prisma__WEBPACK_IMPORTED_MODULE_1__.prisma.session.findUnique({\n        where: {\n            token\n        },\n        include: {\n            user: true\n        }\n    });\n    if (!session) return null;\n    if (session.expiresAt.getTime() < Date.now()) {\n        await _lib_prisma__WEBPACK_IMPORTED_MODULE_1__.prisma.session.delete({\n            where: {\n                token\n            }\n        }).catch(()=>undefined);\n        return null;\n    }\n    return session.user;\n}\nfunction getRequestToken(request) {\n    return request.cookies.get(_lib_constants__WEBPACK_IMPORTED_MODULE_0__.SESSION_COOKIE_NAME)?.value;\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9saWIvYXBpLWF1dGgudHMiLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUNzRDtBQUNoQjtBQUUvQixlQUFlRSxlQUFlQyxPQUFvQjtJQUN2RCxNQUFNQyxRQUFRRCxRQUFRRSxPQUFPLENBQUNDLEdBQUcsQ0FBQ04sK0RBQW1CQSxHQUFHTztJQUN4RCxJQUFJLENBQUNILE9BQU8sT0FBTztJQUVuQixNQUFNSSxVQUFVLE1BQU1QLCtDQUFNQSxDQUFDTyxPQUFPLENBQUNDLFVBQVUsQ0FBQztRQUM5Q0MsT0FBTztZQUFFTjtRQUFNO1FBQ2ZPLFNBQVM7WUFBRUMsTUFBTTtRQUFLO0lBQ3hCO0lBRUEsSUFBSSxDQUFDSixTQUFTLE9BQU87SUFDckIsSUFBSUEsUUFBUUssU0FBUyxDQUFDQyxPQUFPLEtBQUtDLEtBQUtDLEdBQUcsSUFBSTtRQUM1QyxNQUFNZiwrQ0FBTUEsQ0FBQ08sT0FBTyxDQUFDUyxNQUFNLENBQUM7WUFBRVAsT0FBTztnQkFBRU47WUFBTTtRQUFFLEdBQUdjLEtBQUssQ0FBQyxJQUFNQztRQUM5RCxPQUFPO0lBQ1Q7SUFFQSxPQUFPWCxRQUFRSSxJQUFJO0FBQ3JCO0FBRU8sU0FBU1EsZ0JBQWdCakIsT0FBb0I7SUFDbEQsT0FBT0EsUUFBUUUsT0FBTyxDQUFDQyxHQUFHLENBQUNOLCtEQUFtQkEsR0FBR087QUFDbkQiLCJzb3VyY2VzIjpbIi9Vc2Vycy9zYXVyYWJoa3NpbmdoL2Rldi9kb21haW5zL2NvbGxhYm9yYXRpb24tYXBwL2xpYi9hcGktYXV0aC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOZXh0UmVxdWVzdCB9IGZyb20gXCJuZXh0L3NlcnZlclwiO1xuaW1wb3J0IHsgU0VTU0lPTl9DT09LSUVfTkFNRSB9IGZyb20gXCJAL2xpYi9jb25zdGFudHNcIjtcbmltcG9ydCB7IHByaXNtYSB9IGZyb20gXCJAL2xpYi9wcmlzbWFcIjtcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldFJlcXVlc3RVc2VyKHJlcXVlc3Q6IE5leHRSZXF1ZXN0KSB7XG4gIGNvbnN0IHRva2VuID0gcmVxdWVzdC5jb29raWVzLmdldChTRVNTSU9OX0NPT0tJRV9OQU1FKT8udmFsdWU7XG4gIGlmICghdG9rZW4pIHJldHVybiBudWxsO1xuXG4gIGNvbnN0IHNlc3Npb24gPSBhd2FpdCBwcmlzbWEuc2Vzc2lvbi5maW5kVW5pcXVlKHtcbiAgICB3aGVyZTogeyB0b2tlbiB9LFxuICAgIGluY2x1ZGU6IHsgdXNlcjogdHJ1ZSB9XG4gIH0pO1xuXG4gIGlmICghc2Vzc2lvbikgcmV0dXJuIG51bGw7XG4gIGlmIChzZXNzaW9uLmV4cGlyZXNBdC5nZXRUaW1lKCkgPCBEYXRlLm5vdygpKSB7XG4gICAgYXdhaXQgcHJpc21hLnNlc3Npb24uZGVsZXRlKHsgd2hlcmU6IHsgdG9rZW4gfSB9KS5jYXRjaCgoKSA9PiB1bmRlZmluZWQpO1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgcmV0dXJuIHNlc3Npb24udXNlcjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFJlcXVlc3RUb2tlbihyZXF1ZXN0OiBOZXh0UmVxdWVzdCkge1xuICByZXR1cm4gcmVxdWVzdC5jb29raWVzLmdldChTRVNTSU9OX0NPT0tJRV9OQU1FKT8udmFsdWU7XG59XG4iXSwibmFtZXMiOlsiU0VTU0lPTl9DT09LSUVfTkFNRSIsInByaXNtYSIsImdldFJlcXVlc3RVc2VyIiwicmVxdWVzdCIsInRva2VuIiwiY29va2llcyIsImdldCIsInZhbHVlIiwic2Vzc2lvbiIsImZpbmRVbmlxdWUiLCJ3aGVyZSIsImluY2x1ZGUiLCJ1c2VyIiwiZXhwaXJlc0F0IiwiZ2V0VGltZSIsIkRhdGUiLCJub3ciLCJkZWxldGUiLCJjYXRjaCIsInVuZGVmaW5lZCIsImdldFJlcXVlc3RUb2tlbiJdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./lib/api-auth.ts\n");

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
var __webpack_require__ = require("../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fusers%2Froute&page=%2Fapi%2Fusers%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fusers%2Froute.ts&appDir=%2FUsers%2Fsaurabhksingh%2Fdev%2Fdomains%2Fcollaboration-app%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fsaurabhksingh%2Fdev%2Fdomains%2Fcollaboration-app&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();
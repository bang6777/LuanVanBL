/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/vtk.js/Sources/favicon.js":
/*!************************************************!*\
  !*** ./node_modules/vtk.js/Sources/favicon.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("var head = document.querySelector('head');\n\nif (head) {\n  [16, 32, 96, 160, 196].forEach(function (resolution) {\n    var link = document.createElement('link');\n    link.setAttribute('rel', 'icon');\n    link.setAttribute('href', \"https://kitware.github.io/vtk-js/icon/favicon-\".concat(resolution, \"x\").concat(resolution, \".png\"));\n    link.setAttribute('sizes', \"\".concat(resolution, \"x\").concat(resolution));\n    link.setAttribute('type', 'image/png');\n    head.appendChild(link);\n  });\n}\n\n//# sourceURL=webpack:///./node_modules/vtk.js/Sources/favicon.js?");

/***/ }),

/***/ "./node_modules/webpack/buildin/global.js":
/*!***********************************!*\
  !*** (webpack)/buildin/global.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("var g;\n\n// This works in non-strict mode\ng = (function() {\n\treturn this;\n})();\n\ntry {\n\t// This works if eval is allowed (see CSP)\n\tg = g || new Function(\"return this\")();\n} catch (e) {\n\t// This works if the window reference is available\n\tif (typeof window === \"object\") g = window;\n}\n\n// g can still be undefined, but nothing to do about it...\n// We return undefined, instead of nothing here, so it's\n// easier to handle this case. if(!global) { ...}\n\nmodule.exports = g;\n\n\n//# sourceURL=webpack:///(webpack)/buildin/global.js?");

/***/ }),

/***/ "./src/controlPanel.html":
/*!*******************************!*\
  !*** ./src/controlPanel.html ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("// Module\nvar code = \"<!DOCTYPE html>\\r\\n<html lang=\\\"en\\\">\\r\\n  <head>\\r\\n    <meta charset=\\\"UTF-8\\\" />\\r\\n    <meta name=\\\"viewport\\\" content=\\\"width=device-width, initial-scale=1.0\\\" />\\r\\n    <meta http-equiv=\\\"X-UA-Compatible\\\" content=\\\"ie=edge\\\" />\\r\\n    <title>Document</title>\\r\\n  </head>\\r\\n  <body>\\r\\n    <table>\\r\\n      <tr>\\r\\n        <td>I</td>\\r\\n        <td>\\r\\n          <input\\r\\n            class=\\\"Imin\\\"\\r\\n            type=\\\"range\\\"\\r\\n            min=\\\"0\\\"\\r\\n            max=\\\"2.0\\\"\\r\\n            step=\\\"1\\\"\\r\\n            value=\\\"1\\\"\\r\\n          />\\r\\n        </td>\\r\\n        <td>\\r\\n          <input\\r\\n            class=\\\"Imax\\\"\\r\\n            type=\\\"range\\\"\\r\\n            min=\\\"0\\\"\\r\\n            max=\\\"2.0\\\"\\r\\n            step=\\\"1\\\"\\r\\n            value=\\\"1\\\"\\r\\n          />\\r\\n        </td>\\r\\n      </tr>\\r\\n      <tr>\\r\\n        <td>J</td>\\r\\n        <td>\\r\\n          <input\\r\\n            class=\\\"Jmin\\\"\\r\\n            type=\\\"range\\\"\\r\\n            min=\\\"0\\\"\\r\\n            max=\\\"2.0\\\"\\r\\n            step=\\\"1\\\"\\r\\n            value=\\\"1\\\"\\r\\n          />\\r\\n        </td>\\r\\n        <td>\\r\\n          <input\\r\\n            class=\\\"Jmax\\\"\\r\\n            type=\\\"range\\\"\\r\\n            min=\\\"0\\\"\\r\\n            max=\\\"2.0\\\"\\r\\n            step=\\\"1\\\"\\r\\n            value=\\\"1\\\"\\r\\n          />\\r\\n        </td>\\r\\n      </tr>\\r\\n      <tr>\\r\\n        <td>K</td>\\r\\n        <td>\\r\\n          <input\\r\\n            class=\\\"Kmin\\\"\\r\\n            type=\\\"range\\\"\\r\\n            min=\\\"0\\\"\\r\\n            max=\\\"2.0\\\"\\r\\n            step=\\\"1\\\"\\r\\n            value=\\\"1\\\"\\r\\n          />\\r\\n        </td>\\r\\n        <td>\\r\\n          <input\\r\\n            class=\\\"Kmax\\\"\\r\\n            type=\\\"range\\\"\\r\\n            min=\\\"0\\\"\\r\\n            max=\\\"2.0\\\"\\r\\n            step=\\\"1\\\"\\r\\n            value=\\\"1\\\"\\r\\n          />\\r\\n        </td>\\r\\n      </tr>\\r\\n    </table>\\r\\n  </body>\\r\\n</html>\\r\\n\";\n// Exports\nmodule.exports = code;\n\n//# sourceURL=webpack:///./src/controlPanel.html?");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* WEBPACK VAR INJECTION */(function(global) {/* harmony import */ var vtk_js_Sources_favicon__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vtk.js/Sources/favicon */ \"./node_modules/vtk.js/Sources/favicon.js\");\n/* harmony import */ var vtk_js_Sources_favicon__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(vtk_js_Sources_favicon__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _controlPanel_html__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./controlPanel.html */ \"./src/controlPanel.html\");\n/* harmony import */ var _controlPanel_html__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_controlPanel_html__WEBPACK_IMPORTED_MODULE_1__);\n\n\n// import vtkColorTransferFunction from \"vtk.js/Sources/Rendering/Core/ColorTransferFunction\";\n// import vtkFullScreenRenderWindow from \"vtk.js/Sources/Rendering/Misc/FullScreenRenderWindow\";\n// import vtkHttpDataSetReader from \"vtk.js/Sources/IO/Core/HttpDataSetReader\";\n// import vtkPiecewiseFunction from \"vtk.js/Sources/Common/DataModel/PiecewiseFunction\";\n// import vtkVolume from \"vtk.js/Sources/Rendering/Core/Volume\";\n// import vtkVolumeMapper from \"vtk.js/Sources/Rendering/Core/VolumeMapper\";\n// import vtkImageCropFilter from \"vtk.js/Sources/Filters/General/ImageCropFilter\";\n\n\nconst __BASE_PATH__ = \"https://kitware.github.io/vtk-js\";\n\n// ----------------------------------------------------------------------------\n// Standard rendering code setup\n// ----------------------------------------------------------------------------\n\nconst fullScreenRenderer = vtkFullScreenRenderWindow.newInstance({\n  background: [0, 0, 0]\n});\nconst renderer = fullScreenRenderer.getRenderer();\nconst renderWindow = fullScreenRenderer.getRenderWindow();\n\nfullScreenRenderer.addController(_controlPanel_html__WEBPACK_IMPORTED_MODULE_1___default.a);\n\nfunction setupControlPanel(data, cropFilter) {\n  const axes = [\"I\", \"J\", \"K\"];\n  const minmax = [\"min\", \"max\"];\n\n  const extent = data.getExtent();\n\n  axes.forEach((ax, axi) => {\n    minmax.forEach((m, mi) => {\n      const el = document.querySelector(`.${ax}${m}`);\n      el.setAttribute(\"min\", extent[axi * 2]);\n      el.setAttribute(\"max\", extent[axi * 2 + 1]);\n      el.setAttribute(\"value\", extent[axi * 2 + mi]);\n\n      el.addEventListener(\"input\", () => {\n        const planes = cropFilter.getCroppingPlanes().slice();\n        planes[axi * 2 + mi] = Number(el.value);\n        cropFilter.setCroppingPlanes(...planes);\n        console.log(planes);\n        renderWindow.render();\n      });\n    });\n  });\n}\n\n// ----------------------------------------------------------------------------\n// Example code\n// ----------------------------------------------------------------------------\n// Server is not sending the .gz and with the compress header\n// Need to fetch the true file name and uncompress it locally\n// ----------------------------------------------------------------------------\n\n// create filter\nconst cropFilter = vtkImageCropFilter.newInstance();\n\nconst reader = vtkHttpDataSetReader.newInstance({ fetchGzip: true });\n\nconst actor = vtkVolume.newInstance();\nconst mapper = vtkVolumeMapper.newInstance();\nmapper.setSampleDistance(1.1);\nactor.setMapper(mapper);\n\n// create color and opacity transfer functions\nconst ctfun = vtkColorTransferFunction.newInstance();\nctfun.addRGBPoint(0, 85 / 255.0, 0, 0);\nctfun.addRGBPoint(95, 1.0, 1.0, 1.0);\nctfun.addRGBPoint(225, 0.66, 0.66, 0.5);\nctfun.addRGBPoint(255, 0.3, 1.0, 0.5);\nconst ofun = vtkPiecewiseFunction.newInstance();\nofun.addPoint(0.0, 0.0);\nofun.addPoint(255.0, 1.0);\nactor.getProperty().setRGBTransferFunction(0, ctfun);\nactor.getProperty().setScalarOpacity(0, ofun);\nactor.getProperty().setScalarOpacityUnitDistance(0, 3.0);\nactor.getProperty().setInterpolationTypeToLinear();\nactor.getProperty().setUseGradientOpacity(0, true);\nactor.getProperty().setGradientOpacityMinimumValue(0, 2);\nactor.getProperty().setGradientOpacityMinimumOpacity(0, 0.0);\nactor.getProperty().setGradientOpacityMaximumValue(0, 20);\nactor.getProperty().setGradientOpacityMaximumOpacity(0, 1.0);\nactor.getProperty().setShade(true);\nactor.getProperty().setAmbient(0.2);\nactor.getProperty().setDiffuse(0.7);\nactor.getProperty().setSpecular(0.3);\nactor.getProperty().setSpecularPower(8.0);\n\ncropFilter.setInputConnection(reader.getOutputPort());\nmapper.setInputConnection(cropFilter.getOutputPort());\n\nreader.setUrl(`${__BASE_PATH__}/data/volume/LIDC2.vti`).then(() => {\n  reader.loadData().then(() => {\n    renderer.addVolume(actor);\n\n    const data = reader.getOutputData();\n    cropFilter.setCroppingPlanes(...data.getExtent());\n\n    setupControlPanel(data, cropFilter);\n\n    const interactor = renderWindow.getInteractor();\n    interactor.setDesiredUpdateRate(15.0);\n    renderer.resetCamera();\n    renderWindow.render();\n  });\n});\n\n// -----------------------------------------------------------\n// Make some variables global so that you can inspect and\n// modify objects in your browser's developer console:\n// -----------------------------------------------------------\n\nglobal.source = reader;\nglobal.mapper = mapper;\nglobal.actor = actor;\nglobal.ctfun = ctfun;\nglobal.ofun = ofun;\nglobal.renderer = renderer;\nglobal.renderWindow = renderWindow;\nglobal.cropFilter = cropFilter;\n\n/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../node_modules/webpack/buildin/global.js */ \"./node_modules/webpack/buildin/global.js\")))\n\n//# sourceURL=webpack:///./src/index.js?");

/***/ })

/******/ });
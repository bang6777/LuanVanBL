import vtkProxyManager from "vtk.js/Sources/Proxy/Core/ProxyManager";
import macro from "vtk.js/Sources/macro";

import ResizeSensor from "css-element-queries/src/ResizeSensor";

import proxyConfiguration from "./proxyManagerConfiguration";
import createImageUI from "./createImageUI";
import createMainUI from "./createMainUI";
import vtkImageCropFilter from "vtk.js/Sources/Filters/General/ImageCropFilter";
import "vtk.js/Sources/favicon";
import vtkColorTransferFunction from "vtk.js/Sources/Rendering/Core/ColorTransferFunction";
import vtkHttpDataSetReader from "vtk.js/Sources/IO/Core/HttpDataSetReader";
import vtkPiecewiseFunction from "vtk.js/Sources/Common/DataModel/PiecewiseFunction";
import vtkVolume from "vtk.js/Sources/Rendering/Core/Volume";
import vtkVolumeMapper from "vtk.js/Sources/Rendering/Core/VolumeMapper";
// import addKeyboardShortcuts from './addKeyboardShortcuts';

//Làm trống container
function emptyContainer(container) {
  if (container) {
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
  }
}
let geometryNameCount = 0; //số lượng tên hình slice

//set css cho container
const STYLE_CONTAINER = {
  position: "relative",
  width: "100%",
  height: "100%",
  minHeight: "100px",
  minWidth: "200px",
  margin: "0",
  padding: "0",
  top: "0",
  left: "0",
  overflow: "hidden"
};

//ap dụng slice cho mỗi thuộc tính el là phần tử thuộc tính
function applyStyle(el, style) {
  Object.keys(style).forEach(key => {
    el.style[key] = style[key];
  });
}
function setupControlPanel(data, cropFilter, renderWindow) {
  const axes = ["I", "J", "K"];
  const minmax = ["min", "max"];

  const extent = data.getExtent();

  axes.forEach((ax, axi) => {
    minmax.forEach((m, mi) => {
      const el = document.querySelector(`.${ax}${m}`);
      console.log(el);
      el.setAttribute("min", extent[axi * 2]);
      el.setAttribute("max", extent[axi * 2 + 1]);
      el.setAttribute("value", extent[axi * 2 + mi]);

      el.addEventListener("input", () => {
        const planes = cropFilter.getCroppingPlanes().slice();
        planes[axi * 2 + mi] = Number(el.value);
        cropFilter.setCroppingPlanes(...planes);
        console.log(planes);
        renderWindow.render();
      });
    });
  });
}
//hàm tạo view quan trọng, rootcontainer là nơi để show images
const createViewer = (
  rootContainer,
  rootContainerX,
  rootContainerY,
  rootContainerZ,
  { image, geometries, use2D = false, viewerStyle, viewerState }
) => {
  emptyContainer(rootContainer);
  emptyContainer(rootContainerX);
  emptyContainer(rootContainerY);
  emptyContainer(rootContainerZ);
  console.log("rootContainer", rootContainer);
  console.log("rootContainerX", rootContainerX);
  console.log("rootContainerY", rootContainerY);
  console.log("rootContainerZ", rootContainerZ);
  const proxyManager = vtkProxyManager.newInstance({ proxyConfiguration });
  window.addEventListener("resize", proxyManager.resizeAllViews);

  const container = document.createElement("div");
  const containerX = document.createElement("div");
  const containerY = document.createElement("div");
  const containerZ = document.createElement("div");
  const defaultStyle = {
    backgroundColor: [0, 0, 0],
    containerStyle: STYLE_CONTAINER
  };
  const config = viewerStyle || defaultStyle;
  const isBackgroundDark =
    config.backgroundColor[0] +
      config.backgroundColor[1] +
      config.backgroundColor[2] <
    1.5;
  emptyContainer(container);
  emptyContainer(containerX);
  emptyContainer(containerY);
  emptyContainer(containerZ);
  applyStyle(container, config.containerStyle || STYLE_CONTAINER);
  applyStyle(containerX, config.containerStyle || STYLE_CONTAINER);
  applyStyle(containerY, config.containerStyle || STYLE_CONTAINER);
  applyStyle(containerZ, config.containerStyle || STYLE_CONTAINER);
  rootContainer.appendChild(container);
  rootContainerX.appendChild(containerX);
  rootContainerY.appendChild(containerY);
  rootContainerZ.appendChild(containerZ);

  const testCanvas = document.createElement("canvas");
  const gl =
    testCanvas.getContext("webgl") ||
    testCanvas.getContext("experimental-webgl");
  if (!(gl && gl instanceof WebGLRenderingContext)) {
    const suggestion = document.createElement("p");
    const preSuggestionText = document.createTextNode(
      "WebGL could not be loaded. "
    );
    suggestion.appendChild(preSuggestionText);
    const getWebGLA = document.createElement("a");
    getWebGLA.setAttribute("href", "http://get.webgl.org/troubleshooting");
    const getWebGLAText = document.createTextNode(
      "Try a different browser or video drivers for WebGL support."
    );
    getWebGLA.appendChild(getWebGLAText);
    suggestion.appendChild(getWebGLA);
    const suggestionText = document.createTextNode(
      " This is required to view interactive 3D visualizations."
    );
    suggestion.appendChild(suggestionText);
    container.appendChild(suggestion);
    containerX.appendChild(suggestion);
    containerY.appendChild(suggestion);
    containerZ.appendChild(suggestion);
    return null;
  }

  const view = proxyManager.createProxy("Views", "ItkVtkView");
  const viewx = proxyManager.createProxy("Views", "ItkVtkView");
  const viewy = proxyManager.createProxy("Views", "ItkVtkView");
  const viewz = proxyManager.createProxy("Views", "ItkVtkView");

  view.setContainer(container);
  view.setBackground(config.backgroundColor);
  viewx.setContainer(containerX);
  viewx.setBackground(config.backgroundColor);
  viewy.setContainer(containerY);
  viewy.setBackground(config.backgroundColor);
  viewz.setContainer(containerZ);
  viewz.setBackground(config.backgroundColor);

  const imageSource = proxyManager.createProxy("Sources", "TrivialProducer", {
    name: "Image"
  });
  let lookupTableProxy = null;
  let piecewiseFunction = null;
  let dataArray = null;
  let imageRepresentation = null;
  let imageRepresentationX = null;
  let imageRepresentationY = null;
  let imageRepresentationZ = null;
  let imageUI = null;
  let update;
  if (image) {
    imageSource.setInputData(image);

    proxyManager.createRepresentationInAllViews(imageSource);
    imageRepresentation = proxyManager.getRepresentation(imageSource, view);
    imageRepresentationX = proxyManager.getRepresentation(imageSource, viewx);
    imageRepresentationY = proxyManager.getRepresentation(imageSource, viewy);
    imageRepresentationZ = proxyManager.getRepresentation(imageSource, viewz);
    dataArray = image.getPointData().getScalars();
    lookupTableProxy = proxyManager.getLookupTable(dataArray.getName());
    if (dataArray.getNumberOfComponents() > 1) {
      lookupTableProxy.setPresetName("Grayscale");
    } else {
      // lookupTableProxy.setPresetName("Viridis (matplotlib)");
      lookupTableProxy.setPresetName("Grayscale");
    }
    piecewiseFunction = proxyManager.getPiecewiseFunction(dataArray.getName());

    // Slices share the same lookup table as the volume rendering.
    const lut = lookupTableProxy.getLookupTable();
    const sliceActors = imageRepresentation.getActors();
    const sliceActorsX = imageRepresentationX.getActors();
    const sliceActorsY = imageRepresentationY.getActors();
    const sliceActorsZ = imageRepresentationZ.getActors();
    sliceActors.forEach(actor => {
      actor.getProperty().setRGBTransferFunction(lut);
    });
    sliceActorsX.forEach(actor => {
      actor.getProperty().setRGBTransferFunction(lut);
    });
    sliceActorsY.forEach(actor => {
      actor.getProperty().setRGBTransferFunction(lut);
    });
    sliceActorsZ.forEach(actor => {
      actor.getProperty().setRGBTransferFunction(lut);
    });
    if (use2D) {
      viewx.setOrientationAxesVisibility(false);
      viewy.setOrientationAxesVisibility(false);
      viewz.setOrientationAxesVisibility(false);
      view.setOrientationAxesVisibility(false);
    } else {
      view.setViewMode("VolumeRendering");
      viewx.setViewMode("XPlane");
      viewy.setViewMode("YPlane");
      viewz.setViewMode("ZPlane");
    }
  }

  if (geometries) {
    const uid = `Geometry${geometryNameCount++}`;
    geometries.forEach(geometry => {
      const geometrySource = proxyManager.createProxy(
        "Sources",
        "TrivialProducer",
        {
          name: uid
        }
      );
      geometrySource.setInputData(geometry);
      proxyManager.createRepresentationInAllViews(geometrySource);
      const geometryRepresentation = proxyManager.getRepresentation(
        geometrySource,
        view,
        viewx,
        viewy,
        viewz
      );
    });
  }

  const viewerDOMId =
    "itk-vtk-viewer-" +
    performance
      .now()
      .toString()
      .replace(".", "");

  const {
    uiContainer,
    croppingWidget,
    addCroppingPlanesChangedHandler,
    addResetCropHandler
  } = createMainUI(
    viewerDOMId,
    isBackgroundDark,
    use2D,
    imageSource,
    imageRepresentation,
    imageRepresentationX,
    imageRepresentationY,
    imageRepresentationZ,
    view,
    viewx,
    viewy,
    viewz
  );

  if (image) {
    imageUI = createImageUI(
      uiContainer,
      viewerDOMId,
      lookupTableProxy,
      piecewiseFunction,
      imageRepresentation,
      dataArray,
      view,
      viewx,
      viewy,
      viewz,
      isBackgroundDark,
      use2D
    );

    const annotationContainer = container.querySelector(".js-se");
    annotationContainer.style.fontFamily = "monospace";

    const annotationContainerX = containerX.querySelector(".js-se");
    annotationContainerX.style.fontFamily = "monospace";

    const annotationContainerY = containerY.querySelector(".js-se");
    annotationContainerY.style.fontFamily = "monospace";

    const annotationContainerZ = containerZ.querySelector(".js-se");
    annotationContainerZ.style.fontFamily = "monospace";

    const cropFilter = imageRepresentation.getCropFilter();
    const cropFilterX = imageRepresentationX.getCropFilter();
    const cropFilterY = imageRepresentationY.getCropFilter();
    const cropFilterZ = imageRepresentationZ.getCropFilter();
    setupControlPanel(image, cropFilter, view.getRenderWindow());
    setupControlPanel(image, cropFilterX, viewx.getRenderWindow());
    setupControlPanel(image, cropFilterY, viewy.getRenderWindow());
    setupControlPanel(image, cropFilterZ, viewz.getRenderWindow());
    cropFilter.reset();
    cropFilterX.reset();
    cropFilterY.reset();
    cropFilterZ.reset();
  }
  view.resize();
  viewx.resize();
  viewy.resize();
  viewz.resize();
  // addKeyboardShortcuts(rootContainer, publicAPI, viewerDOMId);

  return;
};

export default createViewer;

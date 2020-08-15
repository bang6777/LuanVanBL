import vtkProxyManager from 'vtk.js/Sources/Proxy/Core/ProxyManager';
import macro from 'vtk.js/Sources/macro';

import ResizeSensor from 'css-element-queries/src/ResizeSensor';

import proxyConfiguration from './proxyManagerConfiguration';
import createImageUI from './createImageUI';
import createMainUI from './createMainUI';
// import addKeyboardShortcuts from './addKeyboardShortcuts';

//Làm trống container
function emptyContainer(container) {
  if (container) {
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
  }
}

let geometryNameCount = 0 //số lượng tên hình slice

//set css cho container
const STYLE_CONTAINER = {
  position: 'relative',
  width: '100%',
  height: '100%',
  minHeight: '200px',
  minWidth: '450px',
  margin: '0',
  padding: '0',
  top: '0',
  left: '0',
  overflow: 'hidden',
};

//ap dụng slice cho mỗi thuộc tính el là phần tử thuộc tính
function applyStyle(el, style) {
  Object.keys(style).forEach((key) => {
    el.style[key] = style[key];
  });
}

//hàm tạo view quan trọng, rootcontainer là nơi để show images
const createViewer = (
  rootContainer, 
  { image, geometries, use2D = false, viewerStyle, viewerState }
) => 
{
  emptyContainer(rootContainer);

  const proxyManager = vtkProxyManager.newInstance({ proxyConfiguration });
  window.addEventListener('resize', proxyManager.resizeAllViews);

  const container = document.createElement('div');
  var containerX = document.querySelector('.displayX');
  var containerY = document.querySelector('.displayY');
  var containerZ = document.querySelector('.displayZ');
  const defaultStyle = {
    backgroundColor: [0, 0, 0],
    containerStyle: STYLE_CONTAINER,
  };
  const config = viewerStyle || defaultStyle;
  const isBackgroundDark =
    config.backgroundColor[0] +
      config.backgroundColor[1] +
      config.backgroundColor[2] <
    1.5;
  emptyContainer(container);
  applyStyle(container, config.containerStyle || STYLE_CONTAINER);
  applyStyle(containerX, config.containerStyle || STYLE_CONTAINER);
  applyStyle(containerY, config.containerStyle || STYLE_CONTAINER);
  applyStyle(containerZ, config.containerStyle || STYLE_CONTAINER);
  rootContainer.appendChild(container);

  const testCanvas = document.createElement("canvas");
  const gl = testCanvas.getContext("webgl")
      || testCanvas.getContext("experimental-webgl");
  if (!(gl && gl instanceof WebGLRenderingContext)) {
    const suggestion = document.createElement("p");
    const preSuggestionText = document.createTextNode("WebGL could not be loaded. ");
    suggestion.appendChild(preSuggestionText);
    const getWebGLA = document.createElement("a");
    getWebGLA.setAttribute("href", "http://get.webgl.org/troubleshooting");
    const getWebGLAText = document.createTextNode("Try a different browser or video drivers for WebGL support.");
    getWebGLA.appendChild(getWebGLAText);
    suggestion.appendChild(getWebGLA);
    const suggestionText = document.createTextNode(" This is required to view interactive 3D visualizations.");
    suggestion.appendChild(suggestionText);
    container.appendChild(suggestion);
    return null;
  }

  const viewx = proxyManager.createProxy('Views', 'ItkVtkView');
  const viewy = proxyManager.createProxy('Views', 'ItkVtkView');
  const viewz = proxyManager.createProxy('Views', 'ItkVtkView');
  const view = proxyManager.createProxy('Views', 'ItkVtkView');
  view.setContainer(container);
  view.setBackground(config.backgroundColor);
  viewx.setContainer(containerX);
  viewx.setBackground(config.backgroundColor);
  viewy.setContainer(containerY);
  viewy.setBackground(config.backgroundColor);
  viewz.setContainer(containerZ);
  viewz.setBackground(config.backgroundColor);
  const imageSource = proxyManager.createProxy('Sources', 'TrivialProducer', {
    name: 'Image',
  });
  let lookupTableProxy = null;
  let piecewiseFunction = null;
  let dataArray = null;
  let imageRepresentation = null;
  let imageUI = null;
  let update
  if (image) {
    imageSource.setInputData(image);

    proxyManager.createRepresentationInAllViews(imageSource);
    imageRepresentation = proxyManager.getRepresentation(imageSource, view);

    dataArray = image.getPointData().getScalars();
    lookupTableProxy = proxyManager.getLookupTable(dataArray.getName());
    if (dataArray.getNumberOfComponents() > 1) {
      lookupTableProxy.setPresetName('Grayscale');
    } else {
      lookupTableProxy.setPresetName('Viridis (matplotlib)');
    }
    piecewiseFunction = proxyManager.getPiecewiseFunction(dataArray.getName());

    // Slices share the same lookup table as the volume rendering.
    const lut = lookupTableProxy.getLookupTable();
    const sliceActors = imageRepresentation.getActors();
    sliceActors.forEach((actor) => {
      actor.getProperty().setRGBTransferFunction(lut);
    });

    if (use2D) {
      view.setViewMode('ZPlane');
      view.setOrientationAxesVisibility(false);
    } else {
      view.setViewMode('VolumeRendering');
    }
  }

  if(geometries) {
    const uid = `Geometry${geometryNameCount++}`
    geometries.forEach((geometry) => {
      const geometrySource = proxyManager.createProxy('Sources', 'TrivialProducer', {
        name: uid,
      });
      geometrySource.setInputData(geometry)
      proxyManager.createRepresentationInAllViews(geometrySource);
      const geometryRepresentation = proxyManager.getRepresentation(geometrySource, view);
    })
  }

  const viewerDOMId =
    'itk-vtk-viewer-' +
    performance
      .now()
      .toString()
      .replace('.', '');

  const { uiContainer, croppingWidget, addCroppingPlanesChangedHandler, addResetCropHandler } = createMainUI(
    rootContainer,
    viewerDOMId,
    isBackgroundDark,
    use2D,
    imageSource,
    imageRepresentation,
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
      isBackgroundDark,
      use2D
    );
    const annotationContainer = container.querySelector('.js-se');
    annotationContainer.style.fontFamily = 'monospace';
  }

  view.resize();
  const resizeSensor = new ResizeSensor(container, function() {
    view.resize();
  });
  proxyManager.renderAllViews();

  setTimeout(view.resetCamera, 1);

  const publicAPI = {};

  publicAPI.renderLater = () => {
    view.renderLater();
  }

  let updatingImage = false;
  const setImage = (image) => {
    if (updatingImage) {
      return;
    }
    updatingImage = true;
    imageSource.setInputData(image);
    imageUI.transferFunctionWidget.setDataArray(image.getPointData().getScalars().getData());
    imageUI.transferFunctionWidget.invokeOpacityChange(imageUI.transferFunctionWidget);
    imageUI.transferFunctionWidget.modified();
    croppingWidget.setVolumeMapper(imageRepresentation.getMapper());
    const cropFilter = imageRepresentation.getCropFilter();
    cropFilter.reset();
    croppingWidget.resetWidgetState();
    setTimeout(() => {
      imageUI.transferFunctionWidget.render();
      view.getRenderWindow().render();
      updatingImage = false;
    }, 0);
  }
  publicAPI.setImage = macro.throttle(setImage, 100);

  // Start collapsed on mobile devices or small pages
  // if (window.screen.availWidth < 768 || window.screen.availHeight < 800) {
  //   publicAPI.setUserInterfaceCollapsed(true);
  // }


  publicAPI.captureImage = () => {
    return view.captureImage();
  }

  publicAPI.subscribeCroppingPlanesChanged = (handler) => {
    return addCroppingPlanesChangedHandler(handler);
  }

  publicAPI.subscribeResetCrop = (handler) => {
    return addResetCropHandler(handler);
  }

  const colorMapSelector = document.getElementById(`${viewerDOMId}-colorMapSelector`);

  const selectColorMapHandlers = [];
  const selectColorMapListener = (event) => {
    const value = colorMapSelector.value;
    selectColorMapHandlers.forEach((handler) => {
      handler.call(null, value);
    })
  }
  if (colorMapSelector !== null) {
    colorMapSelector.addEventListener('change', selectColorMapListener);
  }

  publicAPI.subscribeSelectColorMap = (handler) => {
    const index = selectColorMapHandlers.length;
    selectColorMapHandlers.push(handler);
    function unsubscribe() {
      selectColorMapHandlers[index] = null;
    }
    return Object.freeze({ unsubscribe });
  }

  publicAPI.setColorMap = (colorMap) => {
    if (colorMapSelector !== null) {
      const currentColorMap = colorMapSelector.value;
      if (currentColorMap !== colorMap) {
        colorMapSelector.value = colorMap;
        imageUI.updateColorMap();
      }
    }
  }


  if (!use2D) {
    const xPlaneButton = document.getElementById(`${viewerDOMId}-xPlaneButton`);
    const yPlaneButton = document.getElementById(`${viewerDOMId}-yPlaneButton`);
    const zPlaneButton = document.getElementById(`${viewerDOMId}-zPlaneButton`);
    const volumeRenderingButton = document.getElementById(`${viewerDOMId}-volumeRenderingButton`);

    const viewModeChangedHandlers = [];
    const xPlaneButtonListener = (event) => {
      viewModeChangedHandlers.forEach((handler) => {
        handler.call(null, 'XPlane');
      })
    }
    xPlaneButton.addEventListener('click', xPlaneButtonListener)
    const yPlaneButtonListener = (event) => {
      viewModeChangedHandlers.forEach((handler) => {
        handler.call(null, 'YPlane');
      })
    }
    yPlaneButton.addEventListener('click', yPlaneButtonListener)
    const zPlaneButtonListener = (event) => {
      viewModeChangedHandlers.forEach((handler) => {
        handler.call(null, 'ZPlane');
      })
    }
    zPlaneButton.addEventListener('click', zPlaneButtonListener)
    const volumeRenderingButtonListener = (event) => {
      viewModeChangedHandlers.forEach((handler) => {
        handler.call(null, 'VolumeRendering');
      })
    }
    volumeRenderingButton.addEventListener('click', volumeRenderingButtonListener)

    publicAPI.subscribeViewModeChanged = (handler) => {
      const index = viewModeChangedHandlers.length;
      viewModeChangedHandlers.push(handler);
      function unsubscribe() {
        viewModeChangedHandlers[index] = null;
      }
      return Object.freeze({ unsubscribe });
    }

    publicAPI.setViewMode = (mode) => {
      if (!image) {
        return
      }
      switch(mode) {
      case 'XPlane':
        const xPlaneButton = document.getElementById(`${viewerDOMId}-xPlaneButton`);
        xPlaneButton.click();
        break;
      case 'YPlane':
        const yPlaneButton = document.getElementById(`${viewerDOMId}-yPlaneButton`);
        yPlaneButton.click();
        break;
      case 'ZPlane':
        const zPlaneButton = document.getElementById(`${viewerDOMId}-zPlaneButton`);
        zPlaneButton.click();
        break;
      case 'VolumeRendering':
        const volumeRenderingButton = document.getElementById(`${viewerDOMId}-volumeRenderingButton`);
        volumeRenderingButton.click();
        break;
      default:
        console.error('Invalid view mode: ' + mode);
      }
    }


    const xSliceChangedHandlers = [];
    const xSliceChangedListener = (event) => {
      xSliceChangedHandlers.forEach((handler) => {
        handler.call(null, event.target.valueAsNumber);
      })
    }
    const xSliceElement = document.getElementById(`${viewerDOMId}-xSlice`);
    xSliceElement && xSliceElement.addEventListener('input', xSliceChangedListener);
    publicAPI.subscribeXSliceChanged = (handler) => {
      const index = xSliceChangedHandlers.length;
      xSliceChangedHandlers.push(handler);
      function unsubscribe() {
        xSliceChangedHandlers[index] = null;
      }
      return Object.freeze({ unsubscribe });
    }

    const ySliceChangedHandlers = [];
    const ySliceChangedListener = (event) => {
      ySliceChangedHandlers.forEach((handler) => {
        handler.call(null, event.target.valueAsNumber);
      })
    }
    const ySliceElement = document.getElementById(`${viewerDOMId}-ySlice`);
    ySliceElement && ySliceElement.addEventListener('input', ySliceChangedListener);
    publicAPI.subscribeYSliceChanged = (handler) => {
      const index = ySliceChangedHandlers.length;
      ySliceChangedHandlers.push(handler);
      function unsubscribe() {
        ySliceChangedHandlers[index] = null;
      }
      return Object.freeze({ unsubscribe });
    }

    const zSliceChangedHandlers = [];
    const zSliceChangedListener = (event) => {
      zSliceChangedHandlers.forEach((handler) => {
        handler.call(null, event.target.valueAsNumber);
      })
    }
    const zSliceElement = document.getElementById(`${viewerDOMId}-zSlice`);
    zSliceElement && zSliceElement.addEventListener('input', zSliceChangedListener);
    publicAPI.subscribeZSliceChanged = (handler) => {
      const index = zSliceChangedHandlers.length;
      zSliceChangedHandlers.push(handler);
      function unsubscribe() {
        zSliceChangedHandlers[index] = null;
      }
      return Object.freeze({ unsubscribe });
    }



    const gradientOpacitySlider = document.getElementById(`${viewerDOMId}-gradientOpacitySlider`);

    const gradientOpacitySliderHandlers = [];
    const gradientOpacitySliderListener = (event) => {
      const value = gradientOpacitySlider.value;
      gradientOpacitySliderHandlers.forEach((handler) => {
        handler.call(null, value);
      })
    }
    gradientOpacitySlider && gradientOpacitySlider.addEventListener('change', gradientOpacitySliderListener)

    publicAPI.subscribeGradientOpacityChanged = (handler) => {
      const index = gradientOpacitySliderHandlers.length;
      gradientOpacitySliderHandlers.push(handler);
      function unsubscribe() {
        gradientOpacitySliderHandlers[index] = null;
      }
      return Object.freeze({ unsubscribe });
    }

    publicAPI.setGradientOpacity = (opacity) => {
      const current_opacity = parseFloat(gradientOpacitySlider.value);
      if (current_opacity !== parseFloat(opacity)) {
        gradientOpacitySlider.value = opacity;
        imageUI.updateGradientOpacity()
      }
    }
  }


  publicAPI.getViewProxy = () => {
    return view;
  }

  //publicAPI.saveState = () => {
    //// todo
  //}

  //publicAPI.loadState = (state) => {
    //// todo
  //}
  // addKeyboardShortcuts(rootContainer, publicAPI, viewerDOMId);

  return publicAPI;
};

export default createViewer;

import vtkColorMaps from "vtk.js/Sources/Rendering/Core/ColorTransferFunction/ColorMaps";
import vtkPiecewiseGaussianWidget from "vtk.js/Sources/Interaction/Widgets/PiecewiseGaussianWidget";
import vtkMouseRangeManipulator from "vtk.js/Sources/Interaction/Manipulators/MouseRangeManipulator";
import getContrastSensitiveStyle from "./getContrastSensitiveStyle";
import style from "./ItkVtkViewer.module.css";
// import createDistanceButton from "./Image/createDistanceButton";

function createTransferFunctionWidget(
  uiContainertb,
  viewerDOMId,
  lookupTableProxy,
  piecewiseFunctionProxy,
  dataArray,
  view,
  viewx,
  viewy,
  viewz,
  renderWindow,
  renderWindowx,
  renderWindowy,
  renderWindowz,
  use2D
) {
  const uiContainer = document.querySelector(".table");
  const piecewiseFunction = piecewiseFunctionProxy.getPiecewiseFunction();
  
  const transferFunctionWidget = vtkPiecewiseGaussianWidget.newInstance({
    numberOfBins: 256,
    size: [400, 150]
  });
  let iconSize = 20;
  if (use2D) {
    iconSize = 0;
  }
  transferFunctionWidget.updateStyle({
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    histogramColor: "rgba(30, 30, 30, 0.6)",
    strokeColor: "rgb(0, 0, 0)",
    activeColor: "rgb(255, 255, 255)",
    handleColor: "rgb(50, 50, 150)",
    buttonDisableFillColor: "rgba(255, 255, 255, 0.5)",
    buttonDisableStrokeColor: "rgba(0, 0, 0, 0.5)",
    buttonStrokeColor: "rgba(0, 0, 0, 1)",
    buttonFillColor: "rgba(255, 255, 255, 1)",
    strokeWidth: 2,
    activeStrokeWidth: 3,
    buttonStrokeWidth: 1.5,
    handleWidth: 4,
    iconSize, // Can be 0 if you want to remove buttons (dblClick for (+) / rightClick for (-))
    padding: 10
  });
  transferFunctionWidget.setDataArray(dataArray.getData());

  const lookupTable = lookupTableProxy.getLookupTable();

  const piecewiseWidgetContainer = document.createElement("div");
  piecewiseWidgetContainer.setAttribute("class", style.piecewiseWidget);

  transferFunctionWidget.setContainer(piecewiseWidgetContainer);
  transferFunctionWidget.bindMouseListeners();

  // Put distance tools in their own row
  // const distanceRulerRow = document.createElement("div");
  // distanceRulerRow.setAttribute("class", style.uiRow);
  // distanceRulerRow.className += ` ${viewerDOMId}-distanceRuler ${viewerDOMId}-toggle`;
  // distanceRulerRow.style.display = use2D ? "flex" : "none";

  // createDistanceButton(store, distanceRulerRow);

  // Manage update when opacity changes
  transferFunctionWidget.onAnimation(start => {
    if (start) {
      renderWindow.getInteractor().requestAnimation(transferFunctionWidget);
      renderWindowx.getInteractor().requestAnimation(transferFunctionWidget);
      renderWindowy.getInteractor().requestAnimation(transferFunctionWidget);
      renderWindowz.getInteractor().requestAnimation(transferFunctionWidget);
    } else {
      renderWindow.getInteractor().cancelAnimation(transferFunctionWidget);
      renderWindow.render();
      renderWindowx.getInteractor().cancelAnimation(transferFunctionWidget);
      renderWindowx.render();
      renderWindowy.getInteractor().cancelAnimation(transferFunctionWidget);
      renderWindowy.render();
      renderWindowz.getInteractor().cancelAnimation(transferFunctionWidget);
      renderWindowz.render();
    }
  });
  transferFunctionWidget.onOpacityChange(() => {
    if (!use2D) {
      transferFunctionWidget.applyOpacity(piecewiseFunction);
    }
    const colorDataRange = transferFunctionWidget.getOpacityRange();
    const preset = vtkColorMaps.getPresetByName(
      lookupTableProxy.getPresetName()
    );
    lookupTable.applyColorMap(preset);
    lookupTable.setMappingRange(...colorDataRange);
    lookupTable.updateRange();

    if (!renderWindow.getInteractor().isAnimating()) {
      renderWindow.render();

      renderWindowx.render();
      renderWindowy.render();
      renderWindowz.render();
    }
  });

  // Manage update when lookupTable changes
  lookupTable.onModified(() => {
    transferFunctionWidget.render();
    if (!renderWindow.getInteractor().isAnimating()) {
      renderWindow.render();
      renderWindowx.render();
      renderWindowy.render();
      renderWindowz.render();
    }
  });

  transferFunctionWidget.setColorTransferFunction(lookupTable);
  if (use2D) {
    // Necessary side effect: addGaussian calls invokeOpacityChange, which
    // calls onOpacityChange, which updates the lut (does not have a low
    // opacity in 2D)
    transferFunctionWidget.addGaussian(0.5, 1.0, 0.5, 0.0, 3.0);
  } else {
    transferFunctionWidget.addGaussian(0.5, 1.0, 0.5, 0.5, 0.4);
  }
  transferFunctionWidget.applyOpacity(piecewiseFunction);
  transferFunctionWidget.render();

  const transferFunctionWidgetRow = document.createElement("div");
  transferFunctionWidgetRow.setAttribute("class", style.uiRow);
  transferFunctionWidgetRow.className += ` ${viewerDOMId}-toggle`;
  transferFunctionWidgetRow.appendChild(piecewiseWidgetContainer);
  uiContainer.appendChild(transferFunctionWidgetRow);

  // Create range manipulator
  const rangeManipulator = vtkMouseRangeManipulator.newInstance({
    button: 1,
    alt: true
  });

  // Window
  const windowMotionScale = 150.0;
  const windowGet = () => {
    const gaussian = transferFunctionWidget.getGaussians()[0];
    return gaussian.width * windowMotionScale;
  };
  const windowSet = value => {
    const gaussians = transferFunctionWidget.getGaussians();
    const newGaussians = gaussians.slice();
    newGaussians[0].width = value / windowMotionScale;
    transferFunctionWidget.setGaussians(newGaussians);
  };
  rangeManipulator.setVerticalListener(
    0,
    windowMotionScale,
    1,
    windowGet,
    windowSet
  );

  // Level
  const levelMotionScale = 150.0;
  const levelGet = () => {
    const gaussian = transferFunctionWidget.getGaussians()[0];
    return gaussian.position * levelMotionScale;
  };
  const levelSet = value => {
    const gaussians = transferFunctionWidget.getGaussians();
    const newGaussians = gaussians.slice();
    newGaussians[0].position = value / levelMotionScale;
    transferFunctionWidget.setGaussians(newGaussians);
  };
  rangeManipulator.setHorizontalListener(
    0,
    levelMotionScale,
    1,
    levelGet,
    levelSet
  );

  // Add range manipulator
  view.getInteractorStyle2D().addMouseManipulator(rangeManipulator);
  view.getInteractorStyle3D().addMouseManipulator(rangeManipulator);
  viewx.getInteractorStyle2D().addMouseManipulator(rangeManipulator);
  viewx.getInteractorStyle3D().addMouseManipulator(rangeManipulator);
  viewy.getInteractorStyle2D().addMouseManipulator(rangeManipulator);
  viewy.getInteractorStyle3D().addMouseManipulator(rangeManipulator);
  viewz.getInteractorStyle2D().addMouseManipulator(rangeManipulator);
  viewz.getInteractorStyle3D().addMouseManipulator(rangeManipulator);

  const opacityRangeManipulator = vtkMouseRangeManipulator.newInstance({
    button: 3, // Right mouse
    alt: true
  });
  const opacityRangeManipulatorShift = vtkMouseRangeManipulator.newInstance({
    button: 1, // Left mouse
    shift: true, // For the macOS folks
    alt: true
  });

  // Opacity
  const opacityMotionScale = 200.0;
  const opacityGet = () => {
    const gaussian = transferFunctionWidget.getGaussians()[0];
    return gaussian.height * opacityMotionScale;
  };
  const opacitySet = value => {
    const gaussians = transferFunctionWidget.getGaussians();
    const newGaussians = gaussians.slice();
    newGaussians[0].height = value / opacityMotionScale;
    transferFunctionWidget.setGaussians(newGaussians);
  };
  opacityRangeManipulator.setVerticalListener(
    0,
    opacityMotionScale,
    1,
    opacityGet,
    opacitySet
  );
  opacityRangeManipulatorShift.setVerticalListener(
    0,
    opacityMotionScale,
    1,
    opacityGet,
    opacitySet
  );
  view.getInteractorStyle3D().addMouseManipulator(opacityRangeManipulator);
  view.getInteractorStyle3D().addMouseManipulator(opacityRangeManipulatorShift);
  viewx.getInteractorStyle3D().addMouseManipulator(opacityRangeManipulator);
  viewx
    .getInteractorStyle3D()
    .addMouseManipulator(opacityRangeManipulatorShift);
  viewy.getInteractorStyle3D().addMouseManipulator(opacityRangeManipulator);
  viewy
    .getInteractorStyle3D()
    .addMouseManipulator(opacityRangeManipulatorShift);
  viewz.getInteractorStyle3D().addMouseManipulator(opacityRangeManipulator);
  viewz
    .getInteractorStyle3D()
    .addMouseManipulator(opacityRangeManipulatorShift);
  return transferFunctionWidget;
}

function createColorPresetSelector(
  uiContainer,
  viewerDOMId,
  lookupTableProxy,
  renderWindow,
  renderWindowx,
  renderWindowy,
  renderWindowz
) {
  //const presetNames = vtkColorMaps.rgbPresetNames;
  // More selective
  const presetNames = [
    "2hot",
    "Asymmtrical Earth Tones (6_21b)",
    "Black, Blue and White",
    "Black, Orange and White",
    "Black-Body Radiation",
    "Blue to Red Rainbow",
    "Blue to Yellow",
    "Blues",
    "BrBG",
    "BrOrYl",
    "BuGn",
    "BuGnYl",
    "BuPu",
    "BuRd",
    "CIELab Blue to Red",
    "Cold and Hot",
    "Cool to Warm",
    "Cool to Warm (Extended)",
    "GBBr",
    "GYPi",
    "BkRd",
    "GnBu",
    "GnBuPu",
    "GnRP",
    "GnYlRd",
    "Grayscale",
    "Green-Blue Asymmetric Divergent (62Blbc)",
    "Greens",
    "GyRd",
    "Haze",
    "Haze_cyan",
    "Haze_green",
    "Haze_lime",
    "Inferno (matplotlib)",
    "Linear Blue (8_31f)",
    "Linear YGB 1211g",
    "Magma (matplotlib)",
    "Muted Blue-Green",
    "OrPu",
    "Oranges",
    "PRGn",
    "PiYG",
    "Plasma (matplotlib)",
    "PuBu",
    "PuOr",
    "PuRd",
    "Purples",
    "Rainbow Blended Black",
    "Rainbow Blended Grey",
    "Rainbow Blended White",
    "Rainbow Desaturated",
    "RdOr",
    "RdOrYl",
    "RdPu",
    "Red to Blue Rainbow",
    "Reds",
    "Spectral_lowBlue",
    "Viridis (matplotlib)",
    "Warm to Cool",
    "Warm to Cool (Extended)",
    "X Ray",
    "Yellow 15",
    "blot",
    "blue2cyan",
    "blue2yellow",
    "bone_Matlab",
    "coolwarm",
    "copper_Matlab",
    "gist_earth",
    "gray_Matlab",
    "heated_object",
    "hsv",
    "hue_L60",
    "jet",
    "magenta",
    "nic_CubicL",
    "nic_CubicYF",
    "nic_Edge",
    "pink_Matlab",
    "rainbow"
  ];

  const presetSelector = document.createElement("select");
  presetSelector.setAttribute("class", style.selector);
  presetSelector.id = `${viewerDOMId}-colorMapSelector`;
  presetSelector.innerHTML = presetNames
    .map(name => `<option value="${name}">${name}</option>`)
    .join("");

  function updateColorMap(event) {
    lookupTableProxy.setPresetName(presetSelector.value);
    renderWindow.render();
    renderWindowx.render();
    renderWindowy.render();
    renderWindowz.render();
  }
  presetSelector.addEventListener("change", updateColorMap);
  uiContainer.appendChild(presetSelector);
  presetSelector.value = lookupTableProxy.getPresetName();

  return updateColorMap;
}

function createGradientOpacitySlider(
  uiContainer,
  viewerDOMId,
  isBackgroundDark,
  volumeRepresentation,
  renderWindow,
  renderWindowx,
  renderWindowy,
  renderWindowz
) {
  const contrastSensitiveStyle = getContrastSensitiveStyle(
    ["invertibleButton"],
    isBackgroundDark
  );

  const sliderEntry = document.createElement("div");
  sliderEntry.setAttribute("class", style.sliderEntry);
  sliderEntry.innerHTML = `
    <div itk-vtk-tooltip itk-vtk-tooltip-top itk-vtk-tooltip-content="Gradient opacity" class="${
      contrastSensitiveStyle.invertibleButton
    } ${style.gradientOpacitySlider}">
    </div>
    <input type="range" min="0" max="1" value="0.2" step="0.01"
      id="${viewerDOMId}-gradientOpacitySlider"
      class="${style.slider}" />`;
  const edgeElement = sliderEntry.querySelector(
    `#${viewerDOMId}-gradientOpacitySlider`
  );
  function updateGradientOpacity() {
    const value = Number(edgeElement.value);
    volumeRepresentation.setEdgeGradient(value);
    renderWindow.render();
    renderWindowx.render();
    renderWindowy.render();
    renderWindowz.render();
  }
  edgeElement.addEventListener("input", updateGradientOpacity);
  updateGradientOpacity();
  uiContainer.appendChild(sliderEntry);

  return updateGradientOpacity;
}

function createImageUI(
  uiContainer,
  viewerDOMId,
  lookupTableProxy,
  piecewiseFunctionProxy,
  volumeRepresentation,
  dataArray,
  view,
  viewx,
  viewy,
  viewz,
  isBackgroundDark,
  use2D
) {
  const renderWindow = view.getRenderWindow();
  const renderWindowx = viewx.getRenderWindow();
  const renderWindowy = viewy.getRenderWindow();
  const renderWindowz = viewz.getRenderWindow();
  const imageUIGroup = document.createElement("div");
  imageUIGroup.setAttribute("class", style.uiGroup);

  let updateColorMap = null;
  if (dataArray.getNumberOfComponents() === 1) {
    const presetRow = document.createElement("div");
    presetRow.setAttribute("class", style.uiRow);
    updateColorMap = createColorPresetSelector(
      presetRow,
      viewerDOMId,
      lookupTableProxy,
      renderWindow,
      renderWindowx,
      renderWindowy,
      renderWindowz
    );
    presetRow.className += ` ${viewerDOMId}-toggle`;
    imageUIGroup.appendChild(presetRow);
  }

  const transferFunctionWidget = createTransferFunctionWidget(
    imageUIGroup,
    viewerDOMId,
    lookupTableProxy,
    piecewiseFunctionProxy,
    dataArray,
    view,
    viewx,
    viewy,
    viewz,
    renderWindow,
    renderWindowx,
    renderWindowy,
    renderWindowz,
    use2D
  );

  let updateGradientOpacity = null;
  if (!use2D) {
    const volumeRenderingRow = document.createElement("div");
    volumeRenderingRow.setAttribute("class", style.uiRow);
    volumeRenderingRow.className += ` ${viewerDOMId}-volumeRendering ${viewerDOMId}-toggle`;
    volumeRenderingRow.className += ` ${viewerDOMId}-XPlane ${viewerDOMId}-toggle`;
    volumeRenderingRow.className += ` ${viewerDOMId}-YPlane ${viewerDOMId}-toggle`;
    volumeRenderingRow.className += ` ${viewerDOMId}-ZPlane ${viewerDOMId}-toggle`;
    updateGradientOpacity = createGradientOpacitySlider(
      volumeRenderingRow,
      viewerDOMId,
      isBackgroundDark,
      volumeRepresentation,
      renderWindow,
      renderWindowx,
      renderWindowy,
      renderWindowz
    );
    imageUIGroup.appendChild(volumeRenderingRow);
  }

  uiContainer.appendChild(imageUIGroup);

  return { transferFunctionWidget, updateGradientOpacity, updateColorMap };
}

export default createImageUI;

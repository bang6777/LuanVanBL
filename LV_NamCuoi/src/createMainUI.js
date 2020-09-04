import macro from 'vtk.js/Sources/macro';
import vtkImageCroppingRegionsWidget from 'vtk.js/Sources/Interaction/Widgets/ImageCroppingRegionsWidget';

import getContrastSensitiveStyle from './getContrastSensitiveStyle';

import style from './ItkVtkViewer.module.css';

function createMainUI(

  viewerDOMId,
  isBackgroundDark,
  use2D,
  imageSource,
  imageRepresentation,
  view,
  viewx,
  viewy,
  viewz
  ) 
  {
  const uiContainertb = document.querySelector(".control")
  const uiContainer = document.createElement('div');

  uiContainertb.appendChild(uiContainer);
  uiContainer.setAttribute('class', style.uiContainer); 
  const contrastSensitiveStyle = getContrastSensitiveStyle(
    ['invertibleButton', 'tooltipButton'],
    isBackgroundDark
  );

  const mainUIGroup = document.createElement('div');
  mainUIGroup.setAttribute('class', style.uiGroup);

  const mainUIRow = document.createElement('div');
  mainUIRow.setAttribute('class', style.mainUIRow);
  mainUIRow.className += ` ${viewerDOMId}-toggle`;
  mainUIGroup.appendChild(mainUIRow);

  function setViewModeXPlane() {
    view.setViewMode('XPlane');
    
  }
  function setViewModeYPlane() {
    view.setViewMode('YPlane');

  }
  function setViewModeZPlane() {
    view.setViewMode('ZPlane');
  }
  function setViewModeVolumeRendering() {
    view.setViewMode('VolumeRendering'); 
  }
  if (!use2D) {
    const xPlaneButton = document.createElement('div');
    xPlaneButton.innerHTML = `<input id="${viewerDOMId}-xPlaneButton" type="checkbox" class="${
      style.toggleInput
    }"><label itk-vtk-tooltip itk-vtk-tooltip-top itk-vtk-tooltip-content="X plane [1]" class="${
      contrastSensitiveStyle.tooltipButton
    } ${style.viewModeButton} ${
      style.toggleButton
    }" for="${viewerDOMId}-xPlaneButton">X</label>`;
    xPlaneButton.addEventListener('click', setViewModeXPlane);
    mainUIRow.appendChild(xPlaneButton);

    const yPlaneButton = document.createElement('div');
    yPlaneButton.innerHTML = `<input id="${viewerDOMId}-yPlaneButton" type="checkbox" class="${
      style.toggleInput
    }"><label itk-vtk-tooltip itk-vtk-tooltip-top itk-vtk-tooltip-content="Y plane [2]" class="${
      contrastSensitiveStyle.tooltipButton
    } ${style.viewModeButton} ${
      style.toggleButton
    }" for="${viewerDOMId}-yPlaneButton">Y</label>`;
    yPlaneButton.addEventListener('click', setViewModeYPlane);
    mainUIRow.appendChild(yPlaneButton);

    const zPlaneButton = document.createElement('div');
    zPlaneButton.innerHTML = `<input id="${viewerDOMId}-zPlaneButton" type="checkbox" class="${
      style.toggleInput
    }"><label itk-vtk-tooltip itk-vtk-tooltip-top itk-vtk-tooltip-content="Z plane [3]" class="${
      contrastSensitiveStyle.tooltipButton
    } ${style.viewModeButton} ${
      style.toggleButton
    }" for="${viewerDOMId}-zPlaneButton">Z</label>`;
    zPlaneButton.addEventListener('click', setViewModeZPlane);
    mainUIRow.appendChild(zPlaneButton);

    const volumeRenderingButton = document.createElement('div');
    volumeRenderingButton.innerHTML = `<input id="${viewerDOMId}-volumeRenderingButton" type="checkbox" class="${
      style.toggleInput
    }" checked><label itk-vtk-tooltip itk-vtk-tooltip-top itk-vtk-tooltip-content="Volume [4]" class="${
      contrastSensitiveStyle.tooltipButton
    } ${style.viewModeButton} ${
      style.toggleButton
    }" for="${viewerDOMId}-volumeRenderingButton">3D</label>`;
    volumeRenderingButton.addEventListener('click', setViewModeVolumeRendering);
    mainUIRow.appendChild(volumeRenderingButton);
  }

  let croppingWidget = null
  let addCroppingPlanesChangedHandler = () => {}
  let addResetCropHandler = () => {}

  uiContainer.appendChild(mainUIGroup);

  return { uiContainer, croppingWidget, addCroppingPlanesChangedHandler, addResetCropHandler };
}

export default createMainUI;

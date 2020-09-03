import '@babel/polyfill';
import vtkURLExtract from 'vtk.js/Sources/Common/Core/URLExtract';
import fetchBinaryContent from './fetchBinaryContent';
import style from './ItkVtkViewer.module.css';
import Mousetrap from 'mousetrap';
import processFiles from './processFiles';
let doNotInitViewers = false;
function preventDefaults(e) {
  e.preventDefault();
  e.stopPropagation();
}
function getRootContainer(container) {
  // const workContainer = document.querySelector('.display');

  return container ;
}
function createLoadingProgress(container) {
  const rootContainer = getRootContainer(container);

  const loading = document.createElement('div');
  loading.setAttribute('class', style.loading);
  rootContainer.appendChild(loading);

  const progressContainer = document.createElement('div');
  progressContainer.setAttribute('class', style.progress);
  rootContainer.appendChild(progressContainer);

  function progressCallback(progressEvent) {
    const percent = Math.floor(
      100 * progressEvent.loaded / progressEvent.total
    );
    progressContainer.innerHTML = `${percent}%`;
  }

  return progressCallback;
}
function emptyContainer(container) {
  if (container) {
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
  }
}
const MOUSETRAP = new Mousetrap();

function createFileDragAndDrop(container, onDataChange) {
  const myContainer = getRootContainer(container);

  const fileContainer = document.createElement('div');
  fileContainer.innerHTML = `<div class="${
    style.bigFileDrop
  }"/><input type="file" class="file" style="display: none;" multiple/>`;
  myContainer.appendChild(fileContainer);

  const fileInput = fileContainer.querySelector('input');

  MOUSETRAP.bind('enter', (event) => {
    fileInput.click();
  })

  function handleFile(e) {
    preventDefaults(e);
    MOUSETRAP.unbind('enter');
    const dataTransfer = e.dataTransfer;
    const files = e.target.files || dataTransfer.files;
    myContainer.removeChild(fileContainer);
    const use2D = !!vtkURLExtract.extractURLParameters().use2D;
    onDataChange(myContainer, { files, use2D })
      .catch((error) => {
        const message = 'An error occurred while loading the file:\n\n' + error.message
        alert(message);
        createFileDragAndDrop(container, onDataChange);
      })
  }

  fileInput.addEventListener('change', handleFile);
  fileContainer.addEventListener('drop', handleFile);
  fileContainer.addEventListener('click', (e) => fileInput.click());
  fileContainer.addEventListener('dragover', preventDefaults);
}
export function createViewerFromLocalFiles(container) {
  doNotInitViewers = true;
  createFileDragAndDrop(container, processFiles);
}

export function createViewerFromUrl(el, url, use2D = false) {
  emptyContainer(el);
  const progressCallback = createLoadingProgress(el);

  return fetchBinaryContent(url, progressCallback).then((arrayBuffer) => {
    const file = new File(
      [new Blob([arrayBuffer])],
      url.split('/').slice(-1)[0]
    );
    return processFiles(el, { files: [file], use2D });
  });
}

export function initializeEmbeddedViewers() {
  if (doNotInitViewers) {
    return;
  }
  const viewers = document.querySelectorAll('.display');
  const viewersX = document.querySelectorAll('.displayX');
  const viewersY = document.querySelectorAll('.displayY');
  const viewersZ = document.querySelectorAll('.displayZ');
  let count = viewers.length;
  let countX = viewersX.length;
  let countY = viewersY.length;
  let countZ = viewersZ.length;
  whilesloop(count,viewers);
  whilesloop(countX,viewersX);
  whilesloop(countY,viewersY);
  whilesloop(countZ,viewersZ);
}
function whilesloop(count,viewers){
  while (count--) {
    const el = viewers[count];
    if (!el.dataset.loaded) {
      el.dataset.loaded = true;
      // Apply size to conatiner
      const [width, height] = (el.dataset.viewport || '500x500').split('x');
      el.style.position = 'relative';
      el.style.width = Number.isFinite(Number(width)) ? `${width}px` : width;
      el.style.height = Number.isFinite(Number(height))
        ? `${height}px`
        : height;
      createViewerFromUrl(el, el.dataset.url, !!el.dataset.slice).then(
        (viewer) => {
          // Background color handling
          if (el.dataset.backgroundColor && viewer.renderWindow) {
            const color = el.dataset.backgroundColor;
            const bgColor = [
              color.slice(0, 2),
              color.slice(2, 4),
              color.slice(4, 6),
            ].map((v) => parseInt(v, 16) / 255);
            viewer.renderer.setBackground(bgColor);
          }

          // Render
          if (viewer.renderWindow && viewer.renderWindow.render) {
            viewer.renderWindow.render();
          }
        }
      );
      createViewerFromUrl(el, el.dataset.url, !!el.dataset.slice).then(
        (viewerX) => {
          // Background color handling
          if (el.dataset.backgroundColor && viewerX.renderWindow) {
            const color = el.dataset.backgroundColor;
            const bgColor = [
              color.slice(0, 2),
              color.slice(2, 4),
              color.slice(4, 6),
            ].map((v) => parseInt(v, 16) / 255);
            viewerX.renderer.setBackground(bgColor);
          }

          // Render
          if (viewerX.renderWindow && viewerX.renderWindow.render) {
            viewerX.renderWindow.render();
          }
        }
      );
      createViewerFromUrl(el, el.dataset.url, !!el.dataset.slice).then(
        (viewerY) => {
          // Background color handling
          if (el.dataset.backgroundColor && viewerY.renderWindow) {
            const color = el.dataset.backgroundColor;
            const bgColor = [
              color.slice(0, 2),
              color.slice(2, 4),
              color.slice(4, 6),
            ].map((v) => parseInt(v, 16) / 255);
            viewerY.renderer.setBackground(bgColor);
          }

          // Render
          if (viewerY.renderWindow && viewerY.renderWindow.render) {
            viewerY.renderWindow.render();
          }
        }
      );
      createViewerFromUrl(el, el.dataset.url, !!el.dataset.slice).then(
        (viewerZ) => {
          // Background color handling
          if (el.dataset.backgroundColor && viewerZ.renderWindow) {
            const color = el.dataset.backgroundColor;
            const bgColor = [
              color.slice(0, 2),
              color.slice(2, 4),
              color.slice(4, 6),
            ].map((v) => parseInt(v, 16) / 255);
            viewerZ.renderer.setBackground(bgColor);
          }

          // Render
          if (viewerZ.renderWindow && viewerZ.renderWindow.render) {
            viewerZ.renderWindow.render();
          }
        }
      );
    }
  }
}
export function processParameters(
  container,
  addOnParameters = {},
  keyName = 'fileToLoad'
) {
  const userParams = Object.assign(
    {},
    vtkURLExtract.extractURLParameters(),
    addOnParameters
  );
  const myContainer = getRootContainer(container);

  if (userParams.fullscreen) {
    myContainer.classList.add(style.fullscreenContainer);
  }

  if (userParams[keyName]) {
    return createViewerFromUrl(
      myContainer,
      userParams[keyName],
      !!userParams.use2D
    );
  }
  return null;
}

// Ensure processing of embedded viewers
setTimeout(initializeEmbeddedViewers, 100);

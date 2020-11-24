import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

/**
 * Initialization data for the apod-lab-extension extension.
 */
const extension: JupyterFrontEndPlugin<void> = {
  id: 'apod-lab-extension',
  autoStart: true,
  activate: (app: JupyterFrontEnd) => {
    console.log('JupyterLab extension apod-lab-extension is activated!');
  }
};

export default extension;

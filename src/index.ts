import { JupyterFrontEnd, JupyterFrontEndPlugin } from '@jupyterlab/application';
import { ICommandPalette, MainAreaWidget } from '@jupyterlab/apputils';
import { Widget } from '@lumino/widgets'

/**
 * Initialization data for the apod-lab-extension extension.
 */
const extension: JupyterFrontEndPlugin<void> = {
  id: 'apod-lab-extension',
  autoStart: true,
  requires: [ICommandPalette],
  activate: (app: JupyterFrontEnd, palette: ICommandPalette) => {
    const content= new Widget()
    const widget= new MainAreaWidget({ content })
    widget.id= 'apod-jupyterlab'
    widget.title.label= 'Random Astronomy Picture'
    widget.title.closable= true
    const command:string= 'apod:open'
    app.commands.addCommand(command, {
      label: 'Astronomy Picture',
      execute:() => {
        if(!widget.isAttached){
          app.shell.add(widget, 'main')
        }else{
          app.shell.activateById(widget.id)
        }
      }
    });
    palette.addItem({command, category: 'Tutorial'})
    console.log('JupyterLab extension apod-lab-extension is activated!');
    console.log('Palette', palette)
  }
};

export default extension;

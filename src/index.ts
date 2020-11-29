import { JupyterFrontEnd, JupyterFrontEndPlugin } from '@jupyterlab/application';
import { ICommandPalette, MainAreaWidget } from '@jupyterlab/apputils';
import { Widget } from '@lumino/widgets'

interface APODResponse{
    copyright: string;
    date: string;
    explanation: string;
    media_type: 'video' | 'image';
    title: string;
    url: string;
}

/**
 * Initialization data for the apod-lab-extension extension.
 */
const extension: JupyterFrontEndPlugin<void> = {
  id: 'apod-lab-extension',
  autoStart: true,
  requires: [ICommandPalette],
  activate: async (app: JupyterFrontEnd, palette: ICommandPalette) => {
    const content= new Widget()
    let img = document.createElement('img');
    content.node.appendChild(img);

    function randomDate() {
      const start = new Date(2010, 1, 1);
      const end = new Date();
      const randomDate = new Date(start.getTime() + Math.random()*(end.getTime() - start.getTime()));
      return randomDate.toISOString().slice(0, 10);
    }

    const response = await fetch(`https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY&date=${randomDate()}`);
    const data = await response.json() as APODResponse;

    if (data.media_type === 'image') {
      img.src = data.url;
      img.title = data.title;
    } else {
      console.log('Random APOD was not a picture.');
    }
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

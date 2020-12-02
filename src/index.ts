import { JupyterFrontEnd, JupyterFrontEndPlugin, ILayoutRestorer } from '@jupyterlab/application';
import { ICommandPalette, MainAreaWidget, WidgetTracker } from '@jupyterlab/apputils';
import { Widget } from '@lumino/widgets'
import { Message } from '@lumino/messaging'; 

interface APODResponse{
    copyright: string;
    date: string;
    explanation: string;
    media_type: 'video' | 'image';
    title: string;
    url: string;
}

class APODWidget extends Widget {
  constructor() {
    super();
    this.addClass('my-apodWidget');

    this.img = document.createElement('img');
    this.node.appendChild(this.img);
    this.summary = document.createElement('p');
    this.node.appendChild(this.summary);
  }

  readonly img: HTMLImageElement;
  readonly summary: HTMLParagraphElement;

  async onUpdateRequest(msg: Message): Promise<void> {
    const response = await fetch(`https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY&date=${this.randomDate()}`);
    if (!response.ok) {
      const data = await response.json();
      if (data.error) {
        this.summary.innerText = data.error.message;
      } else {
        this.summary.innerText = response.statusText;
      }
      return;
    }
    const data = await response.json() as APODResponse;
    if (data.media_type === 'image') {
      // Populate the image
      this.img.src = data.url;
      this.img.title = data.title;
      this.summary.innerText = data.title;
      if (data.copyright) {
        this.summary.innerText += ` (Copyright ${data.copyright})`;
      }
    } else {
      this.summary.innerText = 'Random APOD fetched was not an image.';
    }
  }
  randomDate(): string {
    const start = new Date(2010, 1, 1);
    const end = new Date();
    const randomDate = new Date(start.getTime() + Math.random()*(end.getTime() - start.getTime()));
    return randomDate.toISOString().slice(0, 10);
  }
}

function activate(app: JupyterFrontEnd, palette: ICommandPalette, restorer: ILayoutRestorer) {
  console.log('JupyterLab extension jupyterlab_apod is activated!');

  let widget: MainAreaWidget<APODWidget>
  
  const command: string = 'apod:open';
  app.commands.addCommand(command, {
    label: 'Random Astronomy Picture',
    execute: () => {
      if(!widget){
        const content = new APODWidget();
        widget = new MainAreaWidget({content});
        widget.id = 'apod-jupyterlab';
        widget.title.label = 'Astronomy Picture';
        widget.title.closable = true;
      }
      if(!tracker.has(widget)){
        tracker.add(widget)
      }
      if (!widget.isAttached) {
        app.shell.add(widget, 'main');
      }
      //update content
      widget.content.update();
      app.shell.activateById(widget.id);
    }
  });

  palette.addItem({ command, category: 'Tutorial' });

  let tracker= new WidgetTracker<MainAreaWidget<APODWidget>>({
    namespace: 'apod'
  })
  restorer.restore(tracker, {
    command,
    name: ()=>'apod'
  })
}


const extension: JupyterFrontEndPlugin<void> = {
  id: 'apod-lab-extension',
  autoStart: true,
  requires: [ICommandPalette, ILayoutRestorer],
  activate: activate
};

export default extension;

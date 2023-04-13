import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';

import Map from 'ol/Map';
import View from 'ol/View';
import OSM from 'ol/source/OSM';
import TileLayer from 'ol/layer/Tile';

@Component({
  selector: 'app-viewer2d',
  templateUrl: './viewer2d.component.html',
  styleUrls: ['./viewer2d.component.scss']
})
export class Viewer2dComponent implements AfterViewInit {

  @ViewChild('map', { static: false }) map!: ElementRef;

  ngAfterViewInit(): void {
    const map = new Map({
      layers: [
        new TileLayer({source: new OSM()}),
      ],
      view: new View({
        center: [0, 0],
        zoom: 0
      }),
      target: this.map.nativeElement
    });
  }

  

}

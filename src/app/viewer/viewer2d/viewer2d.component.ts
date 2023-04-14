import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';

import { DataLayers } from 'src/app/shared/dataLayers';

import GeoTIFF from 'ol/source/GeoTIFF';
import Map from 'ol/Map';
import OSM from 'ol/source/OSM';
import TileLayer from 'ol/layer/WebGLTile';
import View from 'ol/View';

@Component({
  selector: 'app-viewer2d',
  templateUrl: './viewer2d.component.html',
  styleUrls: ['./viewer2d.component.scss']
})
export class Viewer2dComponent implements AfterViewInit {

  @ViewChild('map', { static: false }) map!: ElementRef;

  ngAfterViewInit(): void {
    const cog = new TileLayer({
      extent: DataLayers.extend,
      source: new GeoTIFF({
        sources: [
          {
            url: DataLayers.datasets[0].orthoURL
          },
        ],
      })
    })
    cog.getSource().setAttributions(DataLayers.attribution);

    const map = new Map({
      layers: [
        new TileLayer({source: new OSM()}),
        cog
      ],
      view: new View({
        center: [0, 0],
        zoom: 0
      }),
      target: this.map.nativeElement
    });

    map.getView().fit(DataLayers.extend, { padding: [25, 25, 25, 25] });
  }
}
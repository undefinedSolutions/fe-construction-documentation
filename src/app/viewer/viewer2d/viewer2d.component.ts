import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';

import { DataLayers } from 'src/app/shared/dataLayers';

import GeoTIFF from 'ol/source/GeoTIFF';
import Map from 'ol/Map';
import OSM from 'ol/source/OSM';
import TileLayer from 'ol/layer/WebGLTile';
import View from 'ol/View';
import {getRenderPixel} from 'ol/render';

@Component({
  selector: 'app-viewer2d',
  templateUrl: './viewer2d.component.html',
  styleUrls: ['./viewer2d.component.scss']
})
export class Viewer2dComponent implements AfterViewInit {

  @ViewChild('map', { static: false }) map!: ElementRef;
  @ViewChild('swipe', { static: false }) swipe!: ElementRef;

  ngAfterViewInit(): void {

    const osm = new TileLayer({
      source: new OSM({wrapX: true}),
    });

    const imagery1 = new TileLayer({
      extent: DataLayers.extend,
      source: new GeoTIFF({
        sources: [
          {
            url: DataLayers.datasets[0].orthoURL
          },
        ],
      })
    })

    const imagery2 = new TileLayer({
      extent: DataLayers.extend,
      source: new GeoTIFF({
        sources: [
          {
            url: DataLayers.datasets[1].orthoURL
          },
        ],
      })
    })

    const map = new Map({
      layers: [osm, imagery2, imagery1 ],
      target: this.map.nativeElement,
      view: new View({
        center: [0, 0],
        zoom: 2,
      }),
    });
    map.getView().fit(DataLayers.extend, { padding: [25, 25, 25, 25] });

    const swipe = <HTMLInputElement> document.getElementById('swipe');

    imagery1.on('prerender', function (event) {
      const gl = <WebGLRenderingContext> event.context;
      gl.enable(gl.SCISSOR_TEST);

      const mapSize = map.getSize(); // [width, height] in CSS pixels

      // get render coordinates and dimensions given CSS coordinates
      const bottomLeft = getRenderPixel(event, [0, mapSize[1]]);
      const topRight = getRenderPixel(event, [mapSize[0], 0]);

      const width = Math.round((topRight[0] - bottomLeft[0]) * (Number(swipe.value) / 100));
      const height = topRight[1] - bottomLeft[1];

      gl.scissor(bottomLeft[0], bottomLeft[1], width, height);
    });

    imagery1.on('postrender', function (event) {
      const gl = <WebGLRenderingContext> event.context;
      gl.disable(gl.SCISSOR_TEST);
    });

    swipe.addEventListener('input', function () {
      map.render();
    });
  }
}
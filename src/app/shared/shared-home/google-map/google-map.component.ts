import { Component, OnInit } from '@angular/core';
import { GoogleMap, GoogleMapsModule , MapMarker  } from '@angular/google-maps';

@Component({
  selector: 'app-google-map',
  standalone: true,
  imports: [GoogleMap, GoogleMapsModule, MapMarker],
  templateUrl: './google-map.component.html',
  styleUrls: ['./google-map.component.css']
})
export class GoogleMapComponent implements OnInit {

    // Coordenadas fijas para el marcador y centro del mapa
    center: google.maps.LatLngLiteral = { lat: 24, lng: 12 };
    zoom = 15; // Zoom más cercano para mejor visualización
    markerPosition: google.maps.LatLngLiteral = this.center;
    display: google.maps.LatLngLiteral = this.center;

    // Opciones del marcador
    markerOptions: google.maps.MarkerOptions = {
    draggable: false, // El marcador no se puede arrastrar
    };

    // Opciones personalizadas para el mapa
    mapOptions: google.maps.MapOptions = {
      gestureHandling: 'none',
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: true,
      zoomControl: true,
      scrollwheel: true,
      disableDoubleClickZoom: true,
      maxZoom: 20,
      minZoom: 2,
      styles: [
        {
          featureType: 'all',
          elementType: 'labels.text.fill',
          stylers: [{ color: '#444444' }]
        },
        {
          featureType: 'landscape',
          elementType: 'all',
          stylers: [{ color: '#f2f2f2' }]
        },
        {
          featureType: 'poi',
          elementType: 'all',
          stylers: [{ visibility: 'off' }]
        },
        {
          featureType: 'road',
          elementType: 'all',
          stylers: [{ saturation: -100 }, { lightness: 45 }]
        },
        {
          featureType: 'water',
          elementType: 'all',
          stylers: [{ color: '#0ea5e9' }, { visibility: 'on' }]
        }
      ]
    };
    
  ngOnInit() {
    // Puedes establecer las coordenadas iniciales aquí
    const initialLocation = { lat: -12.179367, lng: -77.003870 }; // Ejemplo: Ciudad de México
    this.center = initialLocation;
    this.markerPosition = initialLocation;
    this.display = initialLocation;
  }

  // moveMap(event: google.maps.MapMouseEvent) {
  //   if (event.latLng) {
  //     this.center = event.latLng.toJSON();
  //   }
  // }
  
  // move(event: google.maps.MapMouseEvent) {
  //   if (event.latLng) {
  //     this.display = event.latLng.toJSON();
  //   }
  // }

}

/* eslint-disable @typescript-eslint/no-namespace */
declare namespace L {
  function map(element: HTMLElement, options?: Record<string, unknown>): Map
  function tileLayer(
    urlTemplate: string,
    options?: Record<string, unknown>
  ): TileLayer
  function marker(
    latlng: [number, number],
    options?: Record<string, unknown>
  ): Marker
  function divIcon(options?: Record<string, unknown>): DivIcon

  interface Map {
    setView(center: [number, number], zoom: number): Map
    remove(): void
  }

  interface TileLayer {
    addTo(map: Map): TileLayer
  }

  interface Marker {
    addTo(map: Map): Marker
    bindPopup(content: string): Marker
  }

  interface DivIcon {}
}

import { DecorateContext, Decorator } from "@itwin/core-frontend";
import { IModelDataApi, SmartDevice } from "./IModelDataApi";
import { SmartDeviceMarker } from "./SmartDeviceMarker";
import { DeviceData, DeviceStatusApi } from "./DeviceStatusApi";

// A fresh Decorator.
export class SmartDeviceDecorator implements Decorator {
  private _markers: SmartDeviceMarker[];

  constructor() {
    // Initialize the markers
    this._markers = [];
    this.addMarkers();
  }

  private async addMarkers() {
    // Fetch the data from the iModel
    const devices: SmartDevice[] = await IModelDataApi.getSmartDevices();

    // Fetch the API data using the method we created in ch.5.1!
    const federatedData: DeviceData = await DeviceStatusApi.getData();
    console.log(federatedData)

    // Create a new marker for each of the devices
    devices.forEach((device) => {

      const marker = new SmartDeviceMarker(
        { x: device.origin.x, y: device.origin.y, z: device.origin.z },
        { x: 40, y: 40 },
        device.smartDeviceId,
        device.smartDeviceType,
        federatedData[device.smartDeviceId],
      );
      // We moved a whole 4 lines of code to a new home!

      this._markers.push(marker) // within the devices array loop.
    });
  }
  public decorate(context: DecorateContext): void {
    /*  This is where we draw! */

    this._markers.forEach(marker => {
      marker.addDecoration(context);
    });
  }
}
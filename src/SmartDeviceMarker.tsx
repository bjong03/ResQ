import { XAndY, XYAndZ } from "@itwin/core-geometry"; //@ts-ignore no-unused-vars
import { BeButtonEvent, IModelApp, MarginOptions, Marker, StandardViewId, ViewChangeOptions, ZoomToOptions } from "@itwin/core-frontend";
import { DeviceData } from "./DeviceStatusApi";

export class SmartDeviceMarker extends Marker {

  // Override the default constructor to include smart device information
  constructor(
    location: XYAndZ,
    size: XAndY,
    smartDeviceId: string,
    smartDeviceType: string,
    federatedData: DeviceData, // passing in the cloud data through the constructor
  ) {
    // Call base class constructor
    super(location, size);

    this.setImageUrl(`${smartDeviceType}.png`);
    this.title = this.populateTitle(smartDeviceId, federatedData);
    //this.label = smartDeviceType;
    //this.labelOffset = { x: 0, y: 30 };
    //this.labelColor = "black"; // ✅ Add this line to set label text color    
  }

  private populateTitle(smartDeviceId: string, federatedData: DeviceData) {
    // Iterate through the cloud data object to create a row for each data entry 
    let smartTable = "";
    for (const [key, value] of Object.entries(federatedData)) {
      smartTable += `
        <tr>
            <td>${key}</td>
            <td>${value}</td>
        </tr>
      `;
    };

    const smartTableDiv = document.createElement("div");
    smartTableDiv.className = "smart-table"; // Now our table will look awesome!
    smartTableDiv.innerHTML = `
      <h3>${smartDeviceId}</h3>
      <table>
      ${smartTable}
      </table>
    `;
    return smartTableDiv;
  }
}
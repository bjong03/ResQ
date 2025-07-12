// import React, { useEffect, useState } from "react";
// import {
//   UiItemsProvider,
//   StagePanelLocation,
//   StagePanelSection,
//   WidgetState,
//   Widget
// } from "@itwin/appui-react";
// import { IModelDataApi, SmartDevice } from "./IModelDataApi"; // method from previous lesson
// import { IModelApp, StandardViewId } from "@itwin/core-frontend";

// export const SmartDeviceListWidget = () => {
//     const [smartDevices, setSmartDevices] = useState<SmartDevice[]>([]); // variable for storing Smart Device list

//     useEffect(() => {
//     const interval = setInterval(() => {
//         const selectedView = IModelApp.viewManager.selectedView;
//         if (selectedView) {
//         IModelDataApi.getSmartDevices().then((devices: SmartDevice[]) => {
//             console.log("Fetched Smart Devices:", devices);
//             setSmartDevices(devices);
//             clearInterval(interval); // stop retrying
//         });
//         }
//     }, 500); // check every 500ms

//     // Optional: timeout after 10s to avoid infinite polling
//     const timeout = setTimeout(() => clearInterval(interval), 10000);

//     return () => {
//         clearInterval(interval);
//         clearTimeout(timeout);
//     };
//     }, []);


//     const handleClick = (id: string) => {
//         console.log("Clicked Smart Device ID:", id);
//         IModelApp.viewManager.selectedView?.zoomToElements(id, {
//         animateFrustumChange: true,
//         standardViewId: StandardViewId.RightIso
//         });
//     }

//   return <table className="smart-table">
//     <tbody>
//       <tr>
//         <th>SmartDeviceId</th>
//         <th>SmartDeviceType</th>
//       </tr>
//       {
//         smartDevices.map(smartDevice => <tr key={smartDevice.id} className="clickable" onClick={() => handleClick(smartDevice.id)}>
//           <td>{smartDevice.smartDeviceId}</td>
//           <td>{smartDevice.smartDeviceType}</td>
//         </tr>)
//       }
//     </tbody>
//   </table>;
// }


// export class SmartDeviceListWidgetProvider implements UiItemsProvider {
//   public readonly id = "SmartDeviceUiProvider";

//   public provideWidgets(
//     _stageId: string,
//     _stageUsage: string,
//     location: StagePanelLocation,
//     _section?: StagePanelSection
//   ): ReadonlyArray<Widget> {
//     const widgets: Widget[] = []; // An empty widget array!

//     if (location === StagePanelLocation.Right) {
//       widgets.push({
//         id: "smartDeviceListWidget",                // required id
//         label: "Smart Devices",                     // label that shows on the widget tab
//         defaultState: WidgetState.Open,             // default state of widget (on screen) 
//         content: <SmartDeviceListWidget />,           // contents of widget
//       });
//     }

//     return widgets;
//   }
// }

import React, { useEffect, useState } from "react";
import {
  UiItemsProvider,
  StagePanelLocation,
  StagePanelSection,
  WidgetState,
  Widget
} from "@itwin/appui-react";
import { IModelDataApi, SmartDevice } from "./IModelDataApi"; // method from previous lesson
import { IModelApp, StandardViewId } from "@itwin/core-frontend";

import { SmartDeviceAlertWidget } from "./SmartDeviceAlertWidget";

export class SmartDeviceListWidgetProvider implements UiItemsProvider {
  public readonly id = "SmartDeviceUiProvider";

  public provideWidgets(
    _stageId: string,
    _stageUsage: string,
    location: StagePanelLocation
  ): ReadonlyArray<Widget> {
    if (location === StagePanelLocation.Right) {
      return [
        {
          id: "smartDeviceAlertWidget",
          label: "Fire Plan",
          defaultState: WidgetState.Open,
          content: <SmartDeviceAlertWidget />,
        },
      ];
    }
    return [];
  }
}

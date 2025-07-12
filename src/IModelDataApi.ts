import { QueryRowFormat } from "@itwin/core-common";
import { IModelApp } from "@itwin/core-frontend";
import { XYZ } from "@itwin/core-geometry";

// Smart Device object.
export interface SmartDevice {
    id: string;
    smartDeviceId: string;
    smartDeviceType: string;
    origin: XYZ;
}

export class IModelDataApi {
    // Method for fetching Smart Device properties.
    public static async getSmartDevices(): Promise<SmartDevice[]> {
        // Our query.
        const query = `
            SELECT  ECInstanceId, SmartDeviceId, SmartDeviceType, Origin
                FROM DgnCustomItemTypes_smartdevices.SmartDevice
                WHERE Origin IS NOT NULL
        `;

        // Get the IModelConnection
        const iModel = IModelApp.viewManager.selectedView?.iModel;
        if (!iModel) return [];

        // Perform the query on the IModelConnection
        const results = iModel.createQueryReader(query, undefined, {
            rowFormat: QueryRowFormat.UseJsPropertyNames,
        });

        // Returning results as an array of objects.
        return await results.toArray();
    }
}
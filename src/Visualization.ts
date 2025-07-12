import { ColorDef, DisplayStyleSettingsProps, QueryRowFormat } from "@itwin/core-common";
import { IModelConnection, ScreenViewport } from "@itwin/core-frontend";
  
export class Visualization {

    // Method for changing view background color. 
    public static changeBackground = (viewport: ScreenViewport, bgColor: string) => {
        const displayStyleProps: DisplayStyleSettingsProps = {
            backgroundColor: ColorDef.fromString(bgColor).tbgr
        }
        viewport.overrideDisplayStyle(displayStyleProps);
    }

}
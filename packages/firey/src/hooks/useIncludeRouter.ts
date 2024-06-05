import {IFY} from "../types";

export const useIncludeRouter = (path: string, appPath: string): IFY.IncludeRouter => ({path, appPath})
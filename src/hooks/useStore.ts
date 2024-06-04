import {IFY} from "../types";

class Store {
    private static instance: Store | null = null;
    private data: Record<string, any> = {}; // 添加data属性及其类型定义

    private constructor() {
        if (!Store.instance) {
            Store.instance = this;
        }
        return Store.instance;
    }

    get response(): IFY.Response | undefined {
        return this.data.response;
    }

    set response(response: IFY.Response | undefined) {
        this.data.response = response;
    }

    get isWaitResponse(): boolean {
        return this.data.response?.__status === 'Wait';
    }

    set waitResponse(response: IFY.Response | undefined) {
        this.data.response = {...response, __status: 'Wait'};
    }

    get isReleaseResponse(): boolean {
        return this.data.response?.__status === 'Release';
    }

    set releaseResponse(response: IFY.Response | undefined) {
        this.data.response = {...response, __status: 'Release'};
    }

    public static getInstance(): Store {
        if (!Store.instance) {
            Store.instance = new Store();
        }
        return Store.instance;
    }
}

export const useStore = Store.getInstance
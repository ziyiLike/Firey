import {IFY} from "../types";
import * as fs from "fs";

export class FileData {
    private readonly key: string;
    private readonly name: string;
    private readonly content: string | undefined;

    constructor(file: IFY.File) {
        this.key = file.key;
        this.name = file.name;
        this.content = file.content;
    }

    get size() {
        return this.toBuffer().length / 1024
    }

    toBuffer(encoding: BufferEncoding = 'binary') {
        return Buffer.from(this.content || '', encoding)
    }

    save(path: string, encoding: BufferEncoding = 'binary') {
        const buffer = this.toBuffer(encoding)
        return new Promise((resolve, reject) => {
            fs.writeFile(path, buffer, (err: any) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(path)
                }
            })
        })
    }

    toJson() {
        return {
            key: this.key,
            name: this.name,
            size: this.size,
            content: this.content
        }
    }
}
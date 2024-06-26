import fs from 'fs';
import path from 'path';

export const useAsyncGetFiles = async (dirPath: string): Promise<string[]> => {
    const entries = await fs.promises.readdir(dirPath, {withFileTypes: true});
    const filePathPromises = entries.flatMap(async (entry) => {
        const fullPath = path.join(dirPath, entry.name);
        return entry.isDirectory() ? useAsyncGetFiles(fullPath) : Promise.resolve(fullPath);
    });

    return (await Promise.all(filePathPromises)).flat();
};


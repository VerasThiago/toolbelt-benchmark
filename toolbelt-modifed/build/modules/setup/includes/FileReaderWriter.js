"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = require("path");
const manifest_1 = require("../../../manifest");
const FILE_PATHS = {
    tsconfig: (builder) => path_1.join(manifest_1.getAppRoot(), builder, 'tsconfig.json'),
    eslintrc: (builder) => path_1.join(manifest_1.getAppRoot(), builder, '.eslintrc'),
    packageJson: (builder) => path_1.join(manifest_1.getAppRoot(), builder, 'package.json'),
    eslintIgnore: (builder) => path_1.join(manifest_1.getAppRoot(), builder, '.eslintignore'),
    prettierrc: (builder) => path_1.join(manifest_1.getAppRoot(), builder, '.prettierrc'),
};
class FileReaderWriter {
    constructor(file, isJSON = true) {
        this.file = file;
        this.isJSON = isJSON;
        this.path = (builder) => {
            return FILE_PATHS[this.file](builder);
        };
        this.read = (builder) => {
            if (this.isJSON) {
                return JSON.parse(fs_1.readFileSync(this.path(builder)).toString());
            }
            return fs_1.readFileSync(this.path(builder));
        };
        this.write = (builder, data) => {
            if (this.isJSON) {
                return fs_1.writeFileSync(this.path(builder), JSON.stringify(data, null, 2));
            }
            return fs_1.writeFileSync(this.path(builder), data);
        };
    }
}
exports.FileReaderWriter = FileReaderWriter;

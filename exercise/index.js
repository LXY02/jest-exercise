const path = require('path');
const fs = require('fs');

module.exports = class HandleFile {
    getJestSource(sourcePath = path.resolve()) {
        const testPath = path.resolve(sourcePath, '__test__');

        if (!fs.existsSync(testPath)) {
            fs.mkdirSync(testPath);
        }

        let list = fs.readdirSync(sourcePath);

        list
            .map(fileName => path.resolve(sourcePath, fileName))
            .filter(file => fs.statSync(file).isFile())
            .map(file => this.getTestFile(file));
    }

    getTestFile(filename) {
        // filename 是路径全称
        const testFileName = this.getTestFileName(filename);

        if (fs.existsSync(testFileName)) {
            console.log('该测试代码已存在：', testFileName);
            return;
        }

        const mod = require(filename);
        let source;

        if (typeof mod === 'object') {
            source = Object.keys(mod)
                .map(v => {
                    return this.getTestSource(v, path.basename(filename), true);
                })
                .join('\n');
        } else if (typeof mod === 'function') {
            const basename = path.basename(filename);
            const extname = path.extname(filename);
            source = this.getTestSource(path.basename(filename, extname), basename);
        }

        fs.writeFileSync(testFileName, source);
    }

    getTestSource(methodName, classFile, isClass = false) {
        return `
test('TEST ${methodName}', () => {
    const ${isClass ? '{' + methodName + '}' : methodName} = require('${'../' + classFile}');
    const ret = ${methodName}();
    // expect(ret)
    // .toBe('test');
})
        `;
    }

    getTestFileName(filename) {
        // filename 是路径全称
        const dirName = path.dirname(filename);
        const baseName = path.basename(filename);
        const extName = path.extname(filename);
        const testName = baseName.replace(extName, `.spec${extName}`);
        return path.format({
            dir: path.resolve(dirName, '__test__'),
            base: testName
        });
    }
};

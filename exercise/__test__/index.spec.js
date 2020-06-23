const path = require('path');
const fs = require('fs');

test('测试一下', () => {

    // const handleFile = new (require('../index'))();
    // const ret = handleFile.getJestSource('/abc/class.js');
    fs.rmdirSync(path.resolve(__dirname, './data/__test__'), {
        recursive: true
    });

    const handleFile = new (require('../index'))();
    handleFile.getJestSource(path.resolve(__dirname, './data'));
});

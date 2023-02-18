(function() {
    exports.value = async function() {
        const test2 = await exrequire("lib/test2.js");
        return test2.value;
    }
})();
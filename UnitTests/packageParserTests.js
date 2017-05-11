QUnit.module("package parser tests", {
    before: function () {
        this.oneDependentPackage = [
            "KittenService: CamelCaser",
            "CamelCaser: "
        ]

        this.onePackage = [
            "testPackage: "
        ]
    }
});

QUnit.test("test input is empty", function (assert) {
    var output = PackageInstaller.PackageParser.parseInput();
    assert.equal(output, false);
});

QUnit.test("parser null is input", function (assert) {
    var output = PackageInstaller.PackageParser.parseInput(null);
    assert.equal(output, false);
});

QUnit.test("parser input is not array", function (assert) {
    var output = PackageInstaller.PackageParser.parseInput(9);
    assert.equal(output, false);
});

QUnit.test("parser input is valid", function (assert) {
    var output = PackageInstaller.PackageParser.parseInput(this.oneDependentPackage);
    assert.equal(output.length, this.oneDependentPackage.length);

    var output1 = PackageInstaller.PackageParser.parseInput(this.onePackage);
    assert.equal(output1.length, this.onePackage.length);
});

QUnit.test("parser input returns packages", function (assert) {
    var output = PackageInstaller.PackageParser.parseInput(this.oneDependentPackage);
    assert.equal(output.length, this.oneDependentPackage.length);

    assert.equal(output[0].constructor, PackageInstaller.Package);
});

QUnit.test("parser input returns packages with dependencies", function (assert) {
    var output = PackageInstaller.PackageParser.parseInput(this.oneDependentPackage);
    assert.equal(output.length, this.oneDependentPackage.length);

    assert.equal(output[0].dependency, "CamelCaser");
    assert.equal(output[0].name, "KittenService");
});
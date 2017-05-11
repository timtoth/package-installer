QUnit.module("package installer tests", {
    before: function () {
        this.cyclicDependencies = [
            "KittenService: ",
            "Leetmeme: Cyberportal",
            "Cyberportal: Ice",
            "CamelCaser: KittenService",
            "Fraudstream: ",
            "Ice: Leetmeme"
        ];

        this.oneDependentPackage = [
            "KittenService: CamelCaser",
            "CamelCaser: "
        ];

        this.onePackage = [
            "testPackage: "
        ];

        this.complexPackages = [
            "KittenService: ",
            "Leetmeme: Cyberportal",
            "Cyberportal: Ice",
            "CamelCaser: KittenService",
            "Fraudstream: Leetmeme",
            "Ice: "
        ];
    }
});

QUnit.test("checkForValidity input is empty", function (assert) {
    var output = PackageInstaller.Installer.checkForValidity();
    assert.equal(output, false);
});
QUnit.test("checkForValidity input is null", function (assert) {
    var output = PackageInstaller.Installer.checkForValidity(null);
    assert.equal(output, false);
});
QUnit.test("checkForValidity input is not array", function (assert) {
    var output = PackageInstaller.Installer.checkForValidity("hello");
    assert.equal(output, false);
});

QUnit.test("checkForValidity input is cyclic", function (assert) {
    var packages = PackageInstaller.PackageParser.parseInput(this.cyclicDependencies);

    var output = PackageInstaller.Installer.checkForValidity(packages);
    assert.equal(output, false);
});

QUnit.test("checkForValidity input is non-cyclic", function (assert) {
    var packages = PackageInstaller.PackageParser.parseInput(this.complexPackages);

    var output = PackageInstaller.Installer.checkForValidity(packages);
    assert.equal(output, true);
});

QUnit.test("checkForValidity package has empty name", function (assert) {
    var packages = PackageInstaller.PackageParser.parseInput(this.complexPackages);
    packages[0].name = undefined;

    var output = PackageInstaller.Installer.checkForValidity(packages);
    assert.equal(output, false);
});


QUnit.test("sortPackages input is one dependent", function (assert) {
    var packages = PackageInstaller.PackageParser.parseInput(this.oneDependentPackage);

    var output = PackageInstaller.Installer.sortPackages(packages);
    assert.equal(output.length, packages.length);
    assert.equal(output[0].name, 'CamelCaser');
    assert.equal(output[1].name, 'KittenService');
});

QUnit.test("sortPackages input is complex", function (assert) {
    var packages = PackageInstaller.PackageParser.parseInput(this.complexPackages);

    var output = PackageInstaller.Installer.sortPackages(packages);
    assert.equal(output[0].name, 'KittenService');
    assert.equal(output[1].name, 'Ice');
    assert.equal(output[2].name, 'Cyberportal');
    assert.equal(output[3].name, 'Leetmeme');
    assert.equal(output[4].name, 'CamelCaser');
    assert.equal(output[5].name, 'Fraudstream');
});

QUnit.test("sortPackages input is invalid", function (assert) {
    var output = PackageInstaller.Installer.sortPackages(null);
    assert.equal(output, 'Invalid package configuration');
});

QUnit.test("removePackage input removed", function (assert) {
    var packages = PackageInstaller.PackageParser.parseInput(this.complexPackages);

    var output = PackageInstaller.Installer.removePackage(packages[2], packages);
    assert.equal(output.length, 5);
    assert.equal(output[2].name, 'CamelCaser');
});

QUnit.test("removePackage input invalid packages", function (assert) {
    var packages = PackageInstaller.PackageParser.parseInput(this.complexPackages);
    var output = PackageInstaller.Installer.removePackage(packages[2], undefined);
    assert.equal(output, undefined);
});

QUnit.test("removePackage input removed", function (assert) {
    var packages = PackageInstaller.PackageParser.parseInput(this.complexPackages);
    var output = PackageInstaller.Installer.removePackage(packages[2], packages);
    assert.equal(output.length, packages.length - 1);

    var newOutput = PackageInstaller.Installer.removePackage(packages[2], output);
    assert.equal(newOutput.length, output.length - 1);
});

QUnit.test("convertToPackages regular objects converted to packages", function (assert) {
    var output = PackageInstaller.Installer.convertToPackages([{name: 'the', dependency: 'oliphant'},{name: 'was', dependency: 'huge'}]);
    assert.equal(output.length, 2);
    assert.equal(output[0].constructor, PackageInstaller.Package)
});

QUnit.test("convertToPackages null input", function (assert) {
    var output = PackageInstaller.Installer.convertToPackages(null);
    assert.equal(output, null);
});


QUnit.test("installPackages input is complex", function (assert) {
    var packages = PackageInstaller.PackageParser.parseInput(this.complexPackages);

    var output = PackageInstaller.Installer.installPackages(packages);
    assert.equal(output, 'KittenService, Ice, Cyberportal, Leetmeme, CamelCaser, Fraudstream');
});

QUnit.test("installPackages input is null", function (assert) {
    var packages = PackageInstaller.PackageParser.parseInput(this.complexPackages);

    var output = PackageInstaller.Installer.installPackages(null);
    assert.equal(output, 'Invalid package configuration');
});

QUnit.test("installPackages input is not array", function (assert) {
    var packages = PackageInstaller.PackageParser.parseInput(this.complexPackages);

    var output = PackageInstaller.Installer.installPackages(new PackageInstaller.Package('twice', 'now'));
    assert.equal(output, 'Invalid package configuration');
});



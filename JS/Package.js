(function (window, PackageInstaller) {
    if (PackageInstaller == null) {
        Object.assign(window, { PackageInstaller: {} });
		PackageInstaller = window.PackageInstaller;
    }

    PackageInstaller.Package = class Package {
        constructor(name, dependency) {
            this.name = name;
            this.dependency = dependency;
        }
    }
})(window, window.PackageInstaller);

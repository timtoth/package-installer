(function (window, PackageInstaller) {

    function Installer() {
        this.packagesToInstall = [];
        this.independentPackages = [];
        this.sortedPackages = [];

        this.checkForValidity = function (packages) {
            this.packagesToInstall = packages;
            if (!packages || packages.constructor !== Array) return false;
            for (var i = 0; i < packages.length; i++) {
                var package = packages[i];
                if (!package.name || this.isCycliclyDependent(package, this.packagesToInstall)) return false;
            }
            return true;
        }
        this.installPackages = function (packages) {
            if (!packages || packages.constructor !== Array) return 'Invalid package configuration';

            var sorted = this.sortPackages(packages);
            if (sorted === 'Invalid package configuration') return sorted;
            var packageNames = sorted.map(function(package) {return package.name;});
            return packageNames.join(', ');
        }

        this.isCycliclyDependent = function (package, packages) {
            if (!package || !packages) return true;
            var name = package.name;
            var dependency = this.findPackageByDependency(package.dependency, packages);
            while (dependency && dependency.dependency) {
                if (dependency.dependency === name) return true;
                dependency = this.findPackageByDependency(dependency.dependency, packages);
            }
            return false;
        }

        this.findPackageByDependency = function (dependency, packages) {
            if (!packages || !dependency) return false;
            for (var i = 0; i < packages.length; i++) {
                if (dependency === packages[i].name) return packages[i]
            }
            return false;
        }

        this.sortPackages = function (packages) {
            this.sortedPackages = [];
            var isValid = this.checkForValidity(packages);
            if (!isValid) return 'Invalid package configuration';

            var packagesToSort = JSON.parse(JSON.stringify(packages)),
                index = 0;
            while (packagesToSort.length) {
                var package = packagesToSort[index];
                if (!package.dependency) {
                    this.sortedPackages.push(package);
                    packagesToSort.splice(index, 1);
                }
                else if (package.dependency) {
                    var dependency = this.findPackageByDependency(package.dependency, packages);
                    while (dependency.dependency && !this.findPackageByDependency(dependency.dependency, this.sortedPackages)) {
                        dependency = this.findPackageByDependency(dependency.dependency, packages);
                    }

                    if (this.findPackageByDependency(dependency.name, this.sortedPackages)) dependency = package;
                    this.sortedPackages.push(dependency);
                    packagesToSort = this.removePackage(dependency, packagesToSort);
                }
            }
            this.sortedPackages = this.convertToPackages(this.sortedPackages)
            return this.sortedPackages;
        }

        this.removePackage = function (package, list) {
            if (!list) return list;
            var index = 0,
                packages = JSON.parse(JSON.stringify(list));
            for (var i = 0; i < packages.length; i++) {
                if (package.name === packages[i].name && package.dependency === packages[i].dependency) index = i;
            }
            packages.splice(index, 1);
            return packages;
        }
        this.convertToPackages = function (packages) {
            var list = [];
            if (!packages) return packages;
            for (var i = 0; i < packages.length; i++) {
                var package = packages[i];
                list.push(new PackageInstaller.Package(package.name, package.dependency));
            }
            return list;
        }
    }

    if (PackageInstaller == null) {
        Object.assign(window, { PackageInstaller: {} });
        PackageInstaller = window.PackageInstaller;
    }
    PackageInstaller.Installer = new Installer();
})(window, window.PackageInstaller);
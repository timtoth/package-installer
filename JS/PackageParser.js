(function (window, PackageInstaller) {
    
    function PackageParser() {

        this.parseInput = function (input) {
            if (!input || input.constructor !== Array) return false;
            var packages = [];
            for (var i = 0; i < input.length; i++) {
                var packageStrings = input[i].split(':');
                var packageName = packageStrings[0].trim();
                var packageDependency = packageStrings[1].trim();

                var package = new PackageInstaller.Package(packageName, packageDependency);
                packages.push(package);
            }
            return packages;
        }        
    }

    if (PackageInstaller == null) {
        Object.assign(window, { PackageInstaller: {} });
		PackageInstaller = window.PackageInstaller;
    }
    PackageInstaller.PackageParser = new PackageParser();
})(window, window.PackageInstaller);
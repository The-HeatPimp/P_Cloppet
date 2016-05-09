function Ctrl($scope) {
    var x = true;
    $scope.getInclude = function() {
        if (x) {
            return "CV.ejs";
        }
        return "";
    };
}
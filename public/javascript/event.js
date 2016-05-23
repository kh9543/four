var four = angular.module('four', ['inputDropdown']);
four.controller("LoginController", function($scope, $window){
    $scope.message = "請登入";
    $scope.fb_login = function(){
        $scope.message = "登入中";
    };
    $scope.gp_login = function(){
            $scope.message = "登入中"
    };

});

four.controller('caseFormController', ['$scope', function($scope) {
     $scope.case = {
         name: "我的案子",
         money: 20000,
         location: null,
    }
}]);

four.controller('InputDropdownController', [
    '$scope',
    '$q',
    function($scope, $q) {
        var self = this;
        self.selectedDropdownItem = null;
        self.defaultDropdownStrings = ['不限', '基隆市', '台北市', '新北市', '桃園市', '新竹市', '新竹縣', '苗栗縣', '台中市', '彰化縣', '雲林縣', '嘉義市', '嘉義縣', '台南市', '台南縣', '高雄市', '高雄縣', '屏東縣', '宜蘭縣', '花蓮縣', '台東縣', '澎湖縣', '其他'];
        self.filterStringList = function(userInput) {
            var filter = $q.defer();
            var normalisedInput = userInput.toLowerCase();

            var filteredArray =     self.defaultDropdownStrings.filter(function(country) {
            return country.toLowerCase().indexOf(normalisedInput) === 0;
            });

            filter.resolve(filteredArray);
            return filter.promise;
        };
        self.itemStringSelected = function(item) {
            console.log('Handle item string selected in controller:', item);
        };
}]);

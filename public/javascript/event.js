var four = angular.module('four', ['ngRoute']);

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

four.controller('AppCtrl', function($scope) {
    $scope.myDate = new Date();

    $scope.minDate = new Date(
    $scope.myDate.getFullYear(),
    $scope.myDate.getMonth(),
    $scope.myDate.getDate());

    $scope.maxDate = new Date(
    $scope.myDate.getFullYear(),
    $scope.myDate.getMonth() + 2,
    $scope.myDate.getDate());
});

four.controller('mycaseController', ['$scope', function($scope) {
     $scope.cases = [
     {name: '那些年我們一起追的女孩', applicant: 20, date: '2016.5.10', location: '台北市', money: 20000, pic_url: '/image/thatyear.jpg', status: 'finding', status_word: '找人中'},
     {name: '等一個人咖啡', applicant: 5, date: '2016.5.20', location: '台中市', money: 50000, pic_url: '/image/waiting.jpg', status: 'found', status_word: '找人成功'},
     {name: '我的少女時代', applicant: 0, date: '2016.5.15', location: '新北市', money: 25000, pic_url: '/image/ourtime.jpg', status: 'finding', status_word: '找人中'},
     {name: '那些年我們一起追的女孩', applicant: 20, date: '2016.5.10', location: '台北市', money: 20000, pic_url: '/image/thatyear.jpg', status: 'found', status_word: '找人成功'},
     {name: '那些年我們一起追的女孩', applicant: 20, date: '2016.5.10', location: '台北市', money: 20000, pic_url: '/image/thatyear.jpg', status: 'found', status_word: '找人成功'},
     {name: '那些年我們一起追的女孩', applicant: 20, date: '2016.5.10', location: '台北市', money: 20000, pic_url: '/image/thatyear.jpg', status: 'finding', status_word: '找人中'},
     {name: '那些年我們一起追的女孩', applicant: 20, date: '2016.5.10', location: '台北市', money: 20000, pic_url: '/image/thatyear.jpg', status: 'finding', status_word: '找人中'},
     {name: '那些年我們一起追的女孩', applicant: 20, date: '2016.5.10', location: '台北市', money: 20000, pic_url: '/image/thatyear.jpg', status: 'finished', status_word: '已完工'},
     {name: '那些年我們一起追的女孩', applicant: 20, date: '2016.5.10', location: '台北市', money: 20000, pic_url: '/image/thatyear.jpg', status: 'finished', status_word: '已完工'},
     {name: '那些年我們一起追的女孩', applicant: 20, date: '2016.5.10', location: '台北市', money: 20000, pic_url: '/image/thatyear.jpg', status: 'finished', status_word: '已完工'}
    ];
}]);

four.factory('resumeFactory', function(){
    var resume = {
      "education" : "國立台灣大學 資訊管理學系(在學中)",
      "workExperience" : "陳立數學輔導老師",
      "achievement" : "在大二那年參加政大生活創客黑客松比賽在三天內架好了網站還有摸了一些java然後寫出一個android版本的app獲得評審的肯定。那幾天幾乎是挑戰自己的極限沒日沒夜討論跟努力趕出作品。",
      "worklink" : "詳細履歷"
    };

    return resume;
});

four.controller('resumeController', function($scope,resumeFactory){
    $scope.resume = resumeFactory;
});

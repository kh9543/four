var four = angular.module('four', ['ngRoute']);

//directive
four.directive('fileModel', ['$parse', function($parse){
	return {
		restrict: 'A',
		link: function(scope, element, attrs){
			var model = $parse(attrs.fileModel);
			var modelSetter = model.assign;

			element.bind('change', function(){
				scope.$apply(function(){
					modelSetter(scope, element[0].files[0]);
				})
			})
		}
	}
}])

//service
four.service('multipartForm', ['$http', function($http){
	this.post = function(uploadUrl, data){
		var fd = new FormData();
		for(var key in data)
			fd.append(key, data[key]);
		$http.post(uploadUrl, fd, {
			transformRequest: angular.indentity,
			headers: { 'Content-Type': undefined }
		});
	}
}])

//controller


four.controller('caseFormController', ['$scope', 'multipartForm', '$window', function($scope, multipartForm ,$window) {
     $scope.case = {
         name: "我的案子",
         money: 20000,
         endDate: null,
         fromDate: null,
         toDate: null,
         applicant: 0,
         location: "地區",
         detail: null
    };
    $scope.submit = function() {
        // alert($scope.case.location);
        var uploadUrl = '/create_case';
		multipartForm.post(uploadUrl, $scope.case);
		$window.location.reload();
    }
}]);

four.controller('SelectHeaderController', function($scope, $element) {
      $scope.cities = ['不限', '基隆市', '台北市', '新北市', '桃園市', '新竹市', '新竹縣', '苗栗縣', '台中市', '彰化縣', '雲林縣', '嘉義市', '嘉義縣', '台南市', '台南縣', '高雄市', '高雄縣', '屏東縣', '宜蘭縣', '花蓮縣', '台東縣', '澎湖縣', '其他'];
      $scope.searchTerm;
      $scope.clearSearchTerm = function() {
        $scope.searchTerm = '';
      };
      // The md-select directive eats keydown events for some quick select
      // logic. Since we have a search input here, we don't need that logic.
      $element.find('input').on('keydown', function(ev) {
          ev.stopPropagation();
      });
});

four.controller('AppCtrl', function($scope) {
    $scope.endDate = new Date();

    $scope.minDate = new Date(
    $scope.endDate.getFullYear(),
    $scope.endDate.getMonth(),
    $scope.endDate.getDate());

    $scope.maxDate = new Date(
    $scope.endDate.getFullYear(),
    $scope.endDate.getMonth() + 2,
    $scope.endDate.getDate());
});


four.controller('mycaseController', ['$scope', '$http', '$window', function($scope, $http, $window) {
     $scope.cases = $window.cases;
	 $scope.remove = function(casee){
		 url = '/mycase/remove/'+casee.id;
		 $http.post(url, {}).then(function(data) {
 					console.log("posted successfully");
 			},function(data) {
 					console.error("error in posting");
 			});
	 }
}]);


four.controller('resumeController', function($scope,resumeFactory){
    $scope.resume = resumeFactory;
});
four.controller('profileController',function($http,$scope){

	$scope.sendPost = function() {
		$scope.myTxt = "";
		$http.post('/profile/edit/profile', {
			intro: $scope.Intro,
			s_exp: $scope.S_exp,
			w_exp: $scope.W_exp,
			achievement: $scope.Achievement
		}). then(function(data) {
					console.log("posted successfully");
			},function(data) {
					console.error("error in posting");
			});
	 }

	 $scope.sendPostUser = function() {
		 var birth= $("#birthday").val();
		 $scope.myTxt = "修改成功!";
		 $http.post('/profile/edit/user', {
			 birthdate: birth,
			 email: $scope.email
		 }). then(function(data) {
					 console.log("posted successfully");
			 },function(data) {
					 console.error("error in posting");
			 });
		}

	$scope.EditIntro = function () {
		$scope.tempIntro = $scope.Intro;
		$scope.isEditIntro = !$scope.isEditIntro;
	}
	$scope.EditIntroCancel = function () {
		$scope.Intro=$scope.tempIntro;
		$scope.isEditIntro = !$scope.isEditIntro;
	}
	$scope.EditIntroCheck = function () {
		$scope.tempIntro="";
		$scope.isEditIntro = !$scope.isEditIntro;
		$scope.sendPost();//http
	}
	$scope.isEditS_exp=false;
	$scope.EditS_exp = function () {
		$scope.tempS_exp = $scope.S_exp;
		$scope.isEditS_exp = !$scope.isEditS_exp;
	}
	$scope.EditS_expCancel = function () {
		$scope.S_exp=$scope.tempS_exp;
		$scope.isEditS_exp = !$scope.isEditS_exp;
	}
	$scope.EditS_expCheck = function () {
		$scope.tempS_exp="";
		$scope.isEditS_exp = !$scope.isEditS_exp;
		$scope.sendPost();//http
	}
	$scope.isEditW_exp=false;
	$scope.EditW_exp = function () {
		$scope.tempW_exp = $scope.W_exp;
		$scope.isEditW_exp = !$scope.isEditW_exp;
	}
	$scope.EditW_expCancel = function () {
		$scope.W_exp=$scope.tempW_exp;
		$scope.isEditW_exp = !$scope.isEditW_exp;
	}
	$scope.EditW_expCheck = function () {
		$scope.tempW_exp="";
		$scope.isEditW_exp = !$scope.isEditW_exp;
		$scope.sendPost();//http
	}
	$scope.isEditAchievement=false;
	$scope.EditAchievement = function () {
		$scope.tempmyTxt = $scope.myTxt;
		$scope.isEditAchievement = !$scope.isEditAchievement;
	}
	$scope.EditAchievementCancel = function () {
		$scope.myTxt=$scope.tempmyTxt;
		$scope.isEditAchievement = !$scope.isEditAchievement;
	}
	$scope.EditAchievementCheck = function () {
		$scope.tempmyTxt="";
		$scope.isEditAchievement = !$scope.isEditAchievement;
		$scope.sendPost();//http
	}
});

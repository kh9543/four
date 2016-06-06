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
four.controller("LoginController", function($scope, $window){
    $scope.message = "請登入";
    $scope.fb_login = function(){
        $scope.message = "登入中";
    };
    $scope.gp_login = function(){
            $scope.message = "登入中"
    };
});

four.controller('caseFormController', function($scope, multipartForm, $element) {
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
    }

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


four.controller('mycaseController', function($scope, $element) {
     $scope.cases = [
     {name: '那些年我們一起追的女孩', applicant: 20, date: '2016.5.10', location: '台北市', money: numberWithCommas(20000), pic_url: '/image/thatyear.jpg', status: 'finding', status_word: '找人中'},
     {name: '等一個人咖啡', applicant: 5, date: '2016.5.20', location: '台中市', money: numberWithCommas(50000), pic_url: '/image/waiting.jpg', status: 'found', status_word: '找人成功'},
     {name: '我的少女時代', applicant: 0, date: '2016.5.15', location: '新北市', money: numberWithCommas(25000), pic_url: '/image/ourtime.jpg', status: 'finding', status_word: '找人中'},
     {name: '那些年我們一起追的女孩', applicant: 20, date: '2016.5.10', location: '台北市', money: numberWithCommas(20000), pic_url: '/image/thatyear.jpg', status: 'found', status_word: '找人成功'},
     {name: '那些年我們一起追的女孩', applicant: 20, date: '2016.5.10', location: '台北市', money: numberWithCommas(20000), pic_url: '/image/thatyear.jpg', status: 'found', status_word: '找人成功'},
     {name: '那些年我們一起追的女孩', applicant: 20, date: '2016.5.10', location: '台北市', money: numberWithCommas(20000), pic_url: '/image/thatyear.jpg', status: 'finding', status_word: '找人中'},
     {name: '那些年我們一起追的女孩', applicant: 20, date: '2016.5.10', location: '台北市', money: numberWithCommas(20000), pic_url: '/image/thatyear.jpg', status: 'finding', status_word: '找人中'},
     {name: '那些年我們一起追的女孩', applicant: 20, date: '2016.5.10', location: '台北市', money: numberWithCommas(20000), pic_url: '/image/thatyear.jpg', status: 'finished', status_word: '已完工'},
     {name: '那些年我們一起追的女孩', applicant: 20, date: '2016.5.10', location: '台北市', money: numberWithCommas(20000), pic_url: '/image/thatyear.jpg', status: 'finished', status_word: '已完工'},
     {name: '那些年我們一起追的女孩', applicant: 20, date: '2016.5.10', location: '台北市', money: numberWithCommas(20000), pic_url: '/image/thatyear.jpg', status: 'finished', status_word: '已完工'}
    ];
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

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}




four.controller('ErrorCtrl', function($scope, $mdDialog, $mdMedia) {
  $scope.status = '  ';
  $scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');
  $scope.showAlert = function(ev) {
    // Appending dialog to document.body to cover sidenav in docs app
    // Modal dialogs should fully cover application
    // to prevent interaction outside of dialog
    $mdDialog.show(
      $mdDialog.alert()
        .parent(angular.element(document.querySelector('#popupContainer')))
        .clickOutsideToClose(true)
        .title('This is an alert title')
        .textContent('You can specify some description text in here.')
        .ariaLabel('Alert Dialog Demo')
        .ok('Got it!')
        .targetEvent(ev)
    );
  };
});
function DialogController($scope, $mdDialog) {
  $scope.hide = function() {
    $mdDialog.hide();
  };
  $scope.cancel = function() {
    $mdDialog.cancel();
  };
  $scope.answer = function(answer) {
    $mdDialog.hide(answer);
  };
}

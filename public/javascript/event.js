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
four.service('multipartForm', ['$http', '$window', function($http, $window){
	this.post = function(uploadUrl, successurl, reload, data){
		var fd = new FormData();
		for(var key in data)
			fd.append(key, data[key]);
		$http.post(uploadUrl, fd, {
			transformRequest: angular.indentity,
			headers: { 'Content-Type': undefined }
		}).then(function success(response){
			if(reload)
				$window.location.reload();
			else
				$window.location.href=successurl;
			// console.log(response);
		},function error(response){
			console.log(response);
		});
	}
}])

//controller

four.controller('caseFormController', function($element, $scope, multipartForm ,$window) {
     $scope.case = {
         name: "我的案子",
         money: 20000,
         endDate: new Date(),
         fromDate: null,
         toDate: null,
         applicant: 0,
         location: "地區",
         detail: null
    };
    $scope.submit = function() {
        // alert($scope.case.location);
        var uploadUrl = '/create_case';
				var successurl = "/mycase";
				var reload = false;
				multipartForm.post(uploadUrl, "/mycase", reload, $scope.case);
    }

	$scope.cities = ['不限', '基隆市', '台北市', '新北市', '桃園市', '新竹市', '新竹縣', '苗栗縣', '台中市', '彰化縣', '雲林縣', '嘉義市', '嘉義縣', '台南市', '台南縣', '高雄市', '高雄縣', '屏東縣', '宜蘭縣', '花蓮縣', '台東縣', '澎湖縣', '其他'];
	$scope.searchTerm;
	$scope.clearSearchTerm = function() {
	  $scope.searchTerm = '';
	};

	$scope.endDate = new Date();

    $scope.minDate = new Date(
    $scope.endDate.getFullYear(),
    $scope.endDate.getMonth(),
    $scope.endDate.getDate());

    $scope.maxDate = new Date(
    $scope.endDate.getFullYear(),
    $scope.endDate.getMonth() + 2,
    $scope.endDate.getDate());



	// The md-select directive eats keydown events for some quick select
	// logic. Since we have a search input here, we don't need that logic.
	$element.find('input').on('keydown', function(ev) {
		ev.stopPropagation();
	});
	$scope.numberWithCommas = function(x) {
		return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	}
});


four.controller('mycaseController', function($scope, $http, $window) {
     $scope.cases = $window.cases;
	 $scope.remove = function(casee){
		 url = '/mycase/remove/'+casee.id;
		 $http.post(url, {}).then(function(data) {
 					console.log("posted successfully");
 			},function(data) {
 					console.error("error in posting");
 			});
	 }
	 $scope.isFinished = function() {
		 for (var i = 0; i < cases.length; i++) {
			if(cases[i].status == 'finished')
				return false;
		 }
		 return true;
	 }
	 $scope.numberWithCommas = function(x) {
	     return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	 }
});
four.controller('displayCaseController', function($scope, $element, $window) {
    $scope.cases = $window.cases;

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
	$scope.numberWithCommas = function(x) {
		return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	}
});

four.controller('resumeController', function($scope,resumeFactory){
    $scope.resume = resumeFactory;
});

four.controller('caseController',function($scope){
		$scope.caseDescriptions = [
			{info:'《伏地，挺伸》是一部關於臺灣大學資訊管理學系林翰伸同學的一部紀錄片。內容為翰伸同學親自講述關於未來即將競選總統的政見發表與他的的半自傳小說《我與九把刀的雙胞胎故事》改編而成，這部片也是臺大資管第一位未來總統參選人的真實紀錄片。電影男主角為林翰伸飾演、喜歡唱林俊傑的歌，熱愛籃球的柯景騰，女主角則是涂靖雯飾演、受班上大鐵錘喜歡的優秀女學生。電影拍攝的地點大都選在臺灣大學管院五樓，主要場景包括朱瑤章大一幫翰伸約舞伴不成，但卻把資管大象吳乙瑩耍的團團轉的故事與林翰伸的練球哲學與系藍人生。九把刀還幫翰伸創作電影主題曲《那些年，我們班上的翰伸》的歌詞，並交由日本作曲家木村充利作曲、歌手資管胡抽抽演唱；這首歌後來獲得許多學長姐語學弟妹的喜愛。',finished:'	紀錄片初版劇本撰寫'},
			{info:'	目前預計於2017年6月5日，《伏地，挺伸》將首次在第XX屆資管系系卡上映，期望能為翰伸在大四那年發表他的畢業宣言與總統參選人證件，也預計吸引美國、澳洲、韓國等國家接洽版權。隨著同年8月19日於臺灣各家電影院上映後，這部電影之後希望接連在澳門、香港、新加坡、馬來西亞、中國大陸、韓國、日本等地上映。'}
		],
		$scope.finished =[
			{finished:'	紀錄片初版劇本撰寫'},
			{finished:'	演員招募完成'}
		],
		$scope.future = [
			{plan:' 誠徵： 1.攝影  2.導演  3.文案 等人才'},
			{plan :' 預計於2016/6/30開拍,期望能在2017/3/30完成'},
			{plan :' 預計參加明年初的臺北 新一代設計展,高雄 放視大賞與高雄 青春設計節'},
			{plan :' 預計6月份在台中舉辦首映會，場地仍在洽談中'}
		],
		$scope.founders=[
			{ profile :'我是江孟軒，國立台灣大學資訊管理學系大四生。偶然之下接觸到拍片，就無法自拔愛上。熱愛拍片，只要是拍片相關的前製期、拍攝期、後製期都一併參與。喜歡拍片的過程，喜歡用鏡頭跟觀眾說故事，最想拍出令人感動的影片。'},
		],
		$scope.characters= [
			{name:'林翰伸(HandSome Lin)' , pic_url:'/image/Handsome-Selphie.png',info:'進入大學後，立志要當總統。熱愛籃球，為臺大資管系籃隊長，並且喜歡唱歌是個熱血練球唱歌少年。',mate:'左右手'},
			{name:'涂靖雯(Bonnie Tu)', pic_url:'/image/Bonnie.jpg', info:'臺大資管的媽媽，能與動物有良好的相處能力，為少數與大象同處一室卻不會發生意外的人之一。', mate:'資管大鐵錘'},
			{name:'郭毓堂(Hammer Kuo)', pic_url :'/image/Hammer.jpg',info:'身為資管鐵錘王與涂靖雯的男朋友，雖然是系醜但是卻是大家喜愛的大鐵錘。',mate:'涂靖雯'}
		],
		$scope.Questions = [
			{Q:'請問工作地點是固定在臺北拍攝嗎？',A:'工作地點會應取景而變，不過大部份的時間應該都會選擇臺北的地點作為拍攝地點'},
			{Q:'請問如何討論拍攝事宜？會需要每週固定開會嗎？',A:'討論與開會的細節我們會運用四人幫的系統或是其他方式請專案負責人聯繫各位'},
			{Q:'請問我如果有其他的專案在身，可以申請嗎？',A:'可以的，但我們會考慮是否身兼多職有辦法將我們的專案做完，我們會從個人資料裡評估以往你的工作狀況與你現在正在進行的專案來做審核條件'},
			{Q:'請問報酬的方式可以調整嗎？',A:'原則上我們網頁上公佈的報酬只是一個大概粗估的數字，我們會是工作量與表現適當的調整報酬'}
		],
		$scope.celebrities = [
			{name:'Jordan Pan Junior', response:'這個計劃聽起來蠻interesting的，算我一個！', pic_url:'/image/JPJ.jpg'},
			{name:'Chou Chou Hu', response:'竟然如風都答應了，只好幫總統拍微電影了'+'\n'+'阿～～～以碟!', pic_url:'/image/ChouChouHu.jpg'},
			{name:'Win姐', response:'到底誰是大象啊＝　＝╬', pic_url:'/image/elephant.jpg'},
			{name:'TengaMan', response:'這計劃到底是三～小～', pic_url:'/image/TengaMan.jpg'}
		];
});



four.controller('profileController',function($http,multipartForm, $window  ,$scope){

	$scope.LookAtResume = false;

	$scope.tempispublic = true;

	$scope.newInfo = {ispublic:true};

	$scope.newInfo.uploaddate=new Date();

	$scope.AddResume = function(newInfo){
		var uploadUrl = '/profile/edit/pdfs';
		var successurl = '';
		var reload = true;
		multipartForm.post(uploadUrl, successurl, reload, $scope.newInfo);
	}
	$scope.resumes = $window.pdfs;

	$scope.getbirth= function(date1){
    var b = new Date(date1);
    $scope.birthdate =b.getFullYear()+"/" + ("0" + (b.getMonth() + 1)).slice(-2)+"/"+("0" + b.getDate()).slice(-2);
  }



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

	$scope.isEditResume=false;
	$scope.EditResume = function () {
		$scope.isEditResume = !$scope.isEditResume;
	}
	$scope.EditPublic = function (resume) {
		resume.ispublic= !resume.ispublic;
	}
	$scope.EditResumeCancel = function () {
		$scope.isEditResume = !$scope.isEditResume;
	}
	$scope.EditResumeCheck = function () {
		$scope.isEditResume = !$scope.isEditResume;
	}
});






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

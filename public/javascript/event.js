var four = angular.module('four', []);
four.run(['$rootScope', '$window', 'srvAuth',
  function($rootScope, $window, sAuth) {
  $rootScope.user = {};
  $window.fbAsyncInit = function() {
    FB.init({
      appId: '1724459747801852',
      status: true,
      cookie: true,
      xfbml: true
    });

    sAuth.watchAuthenticationStatusChange();

  };
  (function(d){
    // load the Facebook javascript SDK
    var js,
    id = 'facebook-jssdk',
    ref = d.getElementsByTagName('script')[0];
    if (d.getElementById(id)) {
      return;
    }
    js = d.createElement('script');
    js.id = id;
    js.async = true;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    ref.parentNode.insertBefore(js, ref);
  }(document));

  fb_login = function() {
  var _self = this;
  FB.api('/me', function(res) {
      $rootScope.$apply(function() {
      $rootScope.user = _self.user = res;
    });
  });
}

  fb_logout = function() {
    var _self = this;
    FB.logout(function(response) {
        $rootScope.$apply(function() {
            $rootScope.user = _self.user = {};
        });
    });
   }

}]);

four.controller("LoginController", function($scope){
    $scope.message = "請登入";
    $scope.fb_login = function(){
        $scope.message = "登入中";
    };
    $scope.gp_login = function(){
            $scope.message = "登入中"
    };
});
$window.fbAsyncInit = function() {
    FB.init({
      appId: '1724459747801852',
      status: true,
      cookie: true,
      xfbml: true,
      version: 'v2.4'
    });
};

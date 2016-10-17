
var myApp = angular.module('myApp',[]);

myApp.controller('index', ['$scope','$location','$window', function($scope,$location,$window) {
    
     var accessToken=sessionStorage.getItem('accessToken');
     
    $scope.login=function()
    {
        console.log("login");
       FB.init({
        appId      : '347561542256670',
        xfbml      : true,
        version    : 'v2.8'
        });

        (function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
     js.src = "//connect.facebook.net/en_US/sdk.js";
     fjs.parentNode.insertBefore(js, fjs);
   }(document, 'script', 'facebook-jssdk'));


        FB.getLoginStatus(function(response) {
        console.log("response",response);
       if (response.status === 'connected') 
        {
            
            var uid = response.authResponse.userID;
            var accessToken = response.authResponse.accessToken;
			sessionStorage.setItem('accessToken',accessToken);
			window.location.href="/home";
        } 
        else if (response.status === 'not_authorized') 
        {
            // the user is logged in to Facebook, 
            // but has not authenticated your app
            console.log("but has not authenticated your app");
        } 
        else 
        {
            // the user isn't logged in to Facebook.
            console.log("the user isn't logged in to Facebook.");
        }
        });
    }
}]);


myApp.controller('homeCtl', ['$scope','$http','$location','$window', 
    function($scope,$http,$location,$window,$rootScope) {

        var accessToken = sessionStorage.getItem('accessToken');
       
       var selected=[];

        serialize = function (obj) {
              var str = [];
              for (var p in obj)
                if (obj.hasOwnProperty(p)) {
                  str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                }
              return str.join("&");
            };
            var data={
                accessToken:accessToken
            };
        $http({
                url: "http://localhost:8080/getuser", 
                method: "POST",
                data: serialize(data),
                headers: {
                  'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).then(
                function successCallback(res) 
                {
                        $scope.username=res.data.data[0].uname;

                        var totalfriend=res.data.data.length;
                        var FriendData=[];
                        for(var i=0;i<totalfriend;i++)
                        {
                            FriendData.push({
                                    fUid:res.data.data[i].fUid,
                                    fbirthdate:res.data.data[i].fbirthdate,
                                    finterests:res.data.data[i].finterests,
                                    fname:res.data.data[i].fname,
                                    fphoto:res.data.data[i].fphoto
                                });
                        }
                        $scope.data = FriendData;
                        
                    
                        
                        $scope.viewselected=function()
                        {
                             selected=$scope.data.filter(
                                function(item) {
                                    return item.selected;
                                });
                        
                          /* $scope.listdata=selected;
                            $scope.viewselectedFriends=function(item)
                            {  
                                console.log('item',item);
                            }*/
                         }
                         console.log('selected',selected);         
                },
                function myError(res) 
                {
                    console.log("Error", res);
                });
}]);


myApp.controller('FriendDetailClt', ['$scope','$http','$location','$window', 
         function($scope,$http,$location,$window) {

             $scope.username=$window.sessionStorage.getItem("username");

}]);

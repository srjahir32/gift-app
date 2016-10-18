
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
                url: "https://intense-fjord-89814.herokuapp.com/MyDetails", 
                method: "POST",
                data: serialize(data),
                headers: {
                  'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).then(
                function successCallback(res) 
                {
                        var myId=res.data.data[0].myid;

                        $scope.username=res.data.data[0].myname;
                         $http({
                            url: "https://intense-fjord-89814.herokuapp.com/MyFrineds", 
                            method: "POST",
                            data: serialize(data),
                            headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                            }
                        }).then(
                            function successCallback(res) 
                            {
                                var totalfriend=res.data.data.length;
                                var FriendData=[];
                                for(var i=0;i<totalfriend;i++)
                                {
                                    FriendData.push({
                                            myId:myId,
                                            Frinedid:res.data.data[i].Frinedid,
                                            fbirthday:res.data.data[i].fbirthday,
                                            fname:res.data.data[i].fname,
                                            fpicture:res.data.data[i].fpicture,
                                            fgender:res.data.data[i].fgender
                                        });
                                }
                                $scope.data = FriendData;
                                
                                
                                serialize = function (obj) {
                                    var str = [];
                                    for (var p in obj)
                                        if (obj.hasOwnProperty(p)) {
                                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                                        }
                                    return str.join("&");
                                    };
                                
                                var selected=[];
                                 var newdata=[];
                                $scope.viewselected=function()
                                {
                                     selected=$scope.data.filter(
                                        function(item) {
                                            console.log('item.selected',item.selected);
                                            return item.selected;
                                            
                                        });
                                    
                                    var totalselected=selected.length;
                                    console.log("selected",selected);
                                   
                                    var array = []
                                    
                                   
                                    for(var i=0;i<totalselected;i++)
                                    {
                                        newdata={
                                            Frinedid:selected[i].Frinedid,
                                            //Userid:myId
                                            //Name:selected[i].fname,
                                            //Birthdate:selected[i].fbirthday,
                                            //Photoid:selected[i].fpicture
                                        };
                                        array.push(serialize(newdata));
                                    }
                                 
                                    console.log('json',array);
                                    $http({
                                        url: "https://intense-fjord-89814.herokuapp.com/selectFrineds", 
                                        method: "POST",
                                        data: serialize(array),
                                        headers: {
                                            'Content-Type': 'application/x-www-form-urlencoded'
                                        }
                                    }).then(
                                        function successCallback(res) 
                                        {
                                            console.log('res',res);
                                        },
                                        function myError(res) 
                                        {
                                            console.log("Error", res);
                                        });
                                 }
                            },
                            function myError(res) 
                            {
                                console.log("Error", res);
                            });
                               
                },
                function myError(res) 
                {
                    console.log("Error", res);
                });
}]);

myApp.controller('friendData', ['$scope', '$http', '$location', '$window',
    function ($scope, $http, $location, $window) {
            var accessToken = sessionStorage.getItem('accessToken');
      
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
                url: "https://intense-fjord-89814.herokuapp.com/PrevselectedFrineds",
                method: "POST",
                data: serialize(data),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).then(
                function successCallback(res) 
                {
                    console.log("data",res);
                    var totalfriend=res.data.data.length;
                    var FriendData=[];
                    console.log("friend",res.data);
                    for(var i=0;i<totalfriend;i++)
                    {
                        FriendData.push({
                            fname:res.data.data[i].Name,
                            fbirthday:res.data.data[i].Birthdate,
                            fsex:res.data.data[i].sex,
                            Userid:res.data.data[i].Userid
                                   });
                    }
                    $scope.data = FriendData;
                    
                    $scope.viewselectedFriends=function(item)
                    {
                        console.log('item',item.Userid);
                        
                       sessionStorage.setItem('item',item.Userid);
                       window.location.href="/frienddetail";
                      
                     }
                },
                function myError(res) 
                {
                    console.log("Error", res);
                }); 
    }]);

myApp.controller('FriendDetailClt', ['$scope', '$http', '$location', '$window',
    function ($scope, $http, $location, $window) {
    
      serialize = function (obj) {
              var str = [];
              for (var p in obj)
                if (obj.hasOwnProperty(p)) {
                  str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                }
              return str.join("&");
            };
             
      var item = sessionStorage.getItem('item');
}]);

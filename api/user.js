
var config = require('../configuration/config');
var mysql = require('mysql');
var fbgraph = require('fbgraphapi');
var FB = require('fb');
var graph = require('fbgraph');

var FacebookStrategy = require('passport-facebook').Strategy;

var pool = mysql.createPool({
    host: config.host,
    user: config.username,
    password: config.password,
    database: config.database
});
 
  
 
exports.MyDetails=function(req,res)
{
    var accessToken=req.body.accessToken;
                graph.setAccessToken('EAACEdEose0cBACAZA4fmIcHmAsWafGBEZB7BGEr3dGZCCVLoZAMuYXBdAQ5QFRYOLL7EEp1QKYsQfCprasgIH9g5UNYFdcSLoLa1HU40cElTWFjZCds4KjMk9YzKYw1KxPfms1Kf0bjv1XCo8bWR36x35SjAELL5VCq5e2ILRrQZDZD');
                graph.batch([
                    {
                        method: "GET",
                        relative_url: "me"
                    },
                    {
                        method: "GET",
                        relative_url: "me?fields=id,name,birthday,email,picture{url},gender" // Get the first 50 friends of the current user
                    }
                ], function (err, LoginUserData) {
                        if (!err) 
                        {
                            
                            var my_details=JSON.parse(LoginUserData[1].body);
                            
                            var myid = my_details.id;
                            var myname = my_details.name;
                            var mybirthday = new Date(my_details.birthday);
                            var myemail = my_details.email;
                            var mypicture = my_details.picture.data.url;
                            var gender=my_details.gender;
                            var myData=[];
                            
                            myData.push({
                                myid:myid,
                                myname:myname,
                                mybirthday:mybirthday,
                                myemail:myemail,
                                mypicture:mypicture,
                                gender:gender
                            });
                            
                            res.json({'code':200,'status':'success','message':'My details found','data':myData});
                            return;
                        }
                        else
                        {
                            
                            res.json({'code':200,'status':'error','message':'Error for selecting data'});
                            return;
                        }
                });
}

exports.Frienddata=function(req,res)
{
     var accessToken=req.body.accessToken;
    graph.setAccessToken('EAACEdEose0cBACAZA4fmIcHmAsWafGBEZB7BGEr3dGZCCVLoZAMuYXBdAQ5QFRYOLL7EEp1QKYsQfCprasgIH9g5UNYFdcSLoLa1HU40cElTWFjZCds4KjMk9YzKYw1KxPfms1Kf0bjv1XCo8bWR36x35SjAELL5VCq5e2ILRrQZDZD');
    graph.batch([
                                {
                                    method:"GET",
                                    relative_url:"me/friends"
                                },
                                {
                                    method:"GET",
                                    relative_url: "me/friends?fields=id,name,birthday,email,picture{url},gender"
                                }
                            ],function(err,friendData){
                                if(!err)
                                {   
                                    var my_friends=JSON.parse(friendData[1].body);
                                   
                                    
                                    var totalFriendFound = my_friends.data.length;

                                    console.log("total", totalFriendFound);
                                    if (totalFriendFound != 0) 
                                    {
                                        var MyFriends=[];
                                        for (var i = 0; i < totalFriendFound; i++) 
                                        {
                                            //console.log("friend ",data.data[i]);
                                            var Frinedid = my_friends.data[i].id;
                                            var fname = my_friends.data[i].name;
                                            var fbirthday = new Date(my_friends.data[i].birthday);
                                            
                                            var fpicture = my_friends.data[i].picture.data.url;
                                            var fgender=my_friends.data[i].gender;

                                            MyFriends.push({
                                                Frinedid:Frinedid,
                                                fname:fname,
                                                fbirthday:fbirthday,
                                                fpicture:fpicture,
                                                fgender:fgender
                                            });
                                        }
                                        
                                        res.json({'code':200,'status':'success','message':'Friends found','data':MyFriends});
                                        return;
                                    }
                                    else 
                                    {
                                        res.json({'code':200,'status':'success','message':'No frineds found '});
                                        return;
                                    }
                                                                        
                                }
                                else
                                {
                                    res.json({'code':200,'status':'error','message':'Error for selecting data for Friends'});
                                    return;
                                }
                            });
}

exports.SelectedFriend=function(req,res)
{
    var friendData = req.body;
    var accessToken = req.body.accessToken;
    graph.setAccessToken('EAACEdEose0cBACAZA4fmIcHmAsWafGBEZB7BGEr3dGZCCVLoZAMuYXBdAQ5QFRYOLL7EEp1QKYsQfCprasgIH9g5UNYFdcSLoLa1HU40cElTWFjZCds4KjMk9YzKYw1KxPfms1Kf0bjv1XCo8bWR36x35SjAELL5VCq5e2ILRrQZDZD');

    var data = JSON.stringify(friendData);
    var array = JSON.parse(data);
    pool.getConnection(function (err, connection) {
        if (!err) 
        {

            var matchData = [];
            var InsertedData = [];

            
            graph.batch([
                {
                    method: "GET",
                    relative_url: "me"
                },
                {
                    method: "GET",
                    relative_url: "me?fields=id,name,birthday,email,picture{url},gender" // Get the first 50 friends of the current user
                }
            ], function (err, LoginUserData) {
                if (!err) 
                {

                    var my_details = JSON.parse(LoginUserData[1].body);

                    var myid = my_details.id;
                    var myname = my_details.name;
                    var mybirthday = new Date(my_details.birthday);
                    var myemail = my_details.email;
                    var mypicture = my_details.picture.data.url;
                    var gender = my_details.gender;
                    var myData = [];

                    myData.push({
                        myid: myid,
                        myname: myname,
                        mybirthday: mybirthday,
                        myemail: myemail,
                        mypicture: mypicture,
                        gender: gender
                    });
                      connection.query('select * from User where Userid=?',[myid],
                    function(err,Userselected){
                        if(!err)
                        {
                            if (Userselected.length === 0) 
                            {
                                   var userDetails = [myid, myname,mybirthday, myemail, mypicture];
                                   
                                   connection.query("INSERT into User(Userid,Name,Birthdate,Email,Photoid) VALUES(?)", [userDetails],
                                   function (err, successIns) {
                                        if (!err) 
                                        {
                                                console.log("Data inserted for new user");
                                                var id=successIns.insertId;
                                        }
                                        else
                                        {
                                            console.log("Error for inserying data into user table",err);
                                        }  
                                   }); 

                            }
                            else 
                            {
                                var id=Userselected[0].id;
                            }

                            function getSecondPart(str) 
                            {
                                return str.split('=')[1];
                            }
                            for(i in array) 
                            {
                                matchData.push({
                                        matchData:array[i]
                                    });
                                  
                                graph.batch([
                                        {
                                            method: "GET",
                                            relative_url: "me"
                                        },
                                        {
                                            method: "GET",
                                            relative_url: getSecondPart(array[i])+"?fields=id,name,birthday,email,picture{url},gender" // Get the first 50 friends of the current user
                                        }
                                    ], function (err, data) {
                                            if (!err) 
                                            {
                                                
                                                    var data=JSON.parse(data[1].body);
                                                    InsertedData.push({
                                                        selectedFrined:data
                                                    }) 
                                                    var Userid=data.id;
                                                    var Name=data.name;
                                                    var Birthdate=new Date(data.birthday);
                                                    var Photoid = data.picture.data.url;
                                                
                                                          var frienddata=[id,Userid,Name,Birthdate,Photoid];
                                                            console.log("friendData",frienddata);
                                                            
                                                            connection.query("insert into friend(id,Userid,Name,Birthdate,Photoid) values(?)",[frienddata],
                                                            function(err,friendINs){
                                                                if(!err)
                                                                {
                                                                    console.log("OK inserted");
                                                                }
                                                                else
                                                                {
                                                                    console.log("Error ",err);
                                                                }
                                                            });
                                                        
                                                            
                                            }
                                            else
                                            {
                                                console.log("Error",err);
                                            }
                                    });
                            }
                            connection.query("select * from friend where id=?",[id],
                                function(err,selectedFriend){
                                    if(!err)
                                    {
                                        res.json({"code":200,'status':'success','data':selectedFriend});
                                        return;
                                    }
                                    else
                                    {
                                        console.log("Error for selecting data from friends data ",err);
                                    }
                                });
                        }
                        else
                        {
                            console.log("Error ",err);
                        }
                    });
                    
                }
                else 
                {
                    console.log("Error for Selecting data of user",err);
                }
            });
            connection.release();
        }
        else 
        {
            console.log("Connection Errror",err);
        }
    });
}

exports.PrevselectedFrineds=function(req,res)
{
    var friendData = req.body;
    var accessToken = req.body.accessToken;
    graph.setAccessToken('EAACEdEose0cBACAZA4fmIcHmAsWafGBEZB7BGEr3dGZCCVLoZAMuYXBdAQ5QFRYOLL7EEp1QKYsQfCprasgIH9g5UNYFdcSLoLa1HU40cElTWFjZCds4KjMk9YzKYw1KxPfms1Kf0bjv1XCo8bWR36x35SjAELL5VCq5e2ILRrQZDZD');

    var data = JSON.stringify(friendData);
    var array = JSON.parse(data);
    pool.getConnection(function (err, connection) {
        if (!err) 
        {

            var matchData = [];
            var InsertedData = [];

            
            graph.batch([
                {
                    method: "GET",
                    relative_url: "me"
                },
                {
                    method: "GET",
                    relative_url: "me?fields=id,name,birthday,email,picture{url},gender" // Get the first 50 friends of the current user
                }
            ], function (err, LoginUserData) {
                if (!err) 
                {

                    var my_details = JSON.parse(LoginUserData[1].body);
                    var myid = my_details.id;
                    connection.query("select u.id as uid, f.* from User u , friend f where u.Userid=? and u.id=f.id ",[myid],
                                function(err,selectedFriend){
                                    if(!err)
                                    {
                                        res.json({"code":200,'status':'success','data':selectedFriend});
                                        return;
                                    }
                                    else
                                    {
                                        console.log("Error for selecting data from friends data ",err);
                                    }
                                });
                }
                else
                {
                    console.log("can not select data from user ");
                    return;
                }
            });
        connection.release();
        }
        else
        {
            console.log("Connection Error",err);
        }
    });

}

exports.OwnDetails=function(req,res)
{   
        console.log("req",req.body);
        pool.getConnection(function (err, connection) {
        if (!err) 
        {
                 function getSecondPart(str) 
                            {
                                return str.split('=')[1];
                            }
                connection.query("select * from friend where Userid=?",[req.body.Userid],
                function(err,data){
                    if(!err)
                    {
                        console.log("selected data",data);
                        res.json({'code':200,'status':'success','data':data});
                        return;
                    }
                    else
                    {
                        console.log("Error for selectiong data from frined",err);
                    }
                });
        }
        else
        {
            console.log("Errpr",err);
        }
        });
}

exports.user=function(req,res)
{
    var accessToken=req.body.accessToken;
    
    graph.setAccessToken('EAACEdEose0cBACAZA4fmIcHmAsWafGBEZB7BGEr3dGZCCVLoZAMuYXBdAQ5QFRYOLL7EEp1QKYsQfCprasgIH9g5UNYFdcSLoLa1HU40cElTWFjZCds4KjMk9YzKYw1KxPfms1Kf0bjv1XCo8bWR36x35SjAELL5VCq5e2ILRrQZDZD');
      
    pool.getConnection(function (err, connection) 
    {
        if (!err) 
        {
            graph.batch([
                {
                    method: "GET",
                    relative_url: "me"
                },
                {
                    method: "GET",
                    relative_url: "me?fields=id,name,birthday,email,picture{url},gender" // Get the first 50 friends of the current user
                }
            ], function (err, LoginUserData) {
                    if (!err) {
                        var me = JSON.parse(LoginUserData[1].body);
                        var id = me.id;
                        var name = me.name;
                        var birthday = new Date(me.birthday);
                        var email = me.email;
                        var picture = me.picture.data.url;
                        if (config.use_database === 'true') 
                        {
                            connection.query("SELECT * from User where Userid=" + id,
                                function (err, rows) {
                                    if (err) throw err;
                                    if (rows.length === 0) 
                                    {
                                        console.log("There is no such user, adding now", id);
                                        var userDetails = [id, name, birthday, email, picture];
                                        console.log("userDetails", userDetails);
                                        
                                    }
                                    else 
                                    {
                                        console.log("User already exists in database", rows[0].id);
                                        connection.query("select * from friend where id=?", [rows[0].id],
                                            function (err, userdata) {
                                                if (!err) 
                                                {
                                                    if(userdata!="")
                                                    {
                                                        console.log("Userdata", userdata);
                                                        connection.query("SELECT u.id as uid,u.Birthdate ubirthdate,u.Email as uemail,u.Name as uname,u.Photoid as uphoto,u.Userid as uUid ,f.Birthdate as fbirthdate,f.Interests as finterests ,f.Name as fname,f.Photoid as fphoto,f.Userid as fUid FROM User u,friend f where u.id=? and f.id=u.id",[rows[0].id],
                                                        function(err,friends){
                                                            if(!err)
                                                            {
                                                                res.json({'code':200,'status':'success','message':'All data found','data':friends});
                                                                return;
                                                            }
                                                            else
                                                            {
                                                                
                                                                res.json({'code':200,'status':'Error','message':'Error for Selecting friend data'});
                                                                return;
                                                            }
                                                        });
                                                    }
                                                    else
                                                    {
                                                            console.log("friends Friend not found");
                                                                    connection.query("select u.*,u.Name as uname from User u where u.id=?",[rows[0].id],
                                                                    function(err,userdata){
                                                                        if(!err)
                                                                        {
                                                                            console.log("userdata",userdata);
                                                                            res.json({'code':200,'status':'success','message':'Friend not found','data':userdata});
                                                                            return;
                                                                        }
                                                                        else
                                                                        {
                                                                            res.json({'code':200,'status':'Error','message':'Error for selecting data'});
                                                                            return;
                                                                        }
                                                                    });
                                                    }
                                                }
                                                else 
                                                {
                                                    console.log("Err", err);
                                                }
                                            });
                                        
                                    }
                                });


                        }
                    }
                    else 
                    {
                        console.log("Error For get User data",err);
                        res.json({'code':200,'status':'Error','message':'Error For get User data'});
                        return;
                    }

                });
            connection.release();
        }
        else 
        {
            console.log("Connection Error");
            res.json({'code':200,'status':'Error','message':'Connection Error'});
            return;
        }
    });

}

/*

connection.query("INSERT into User(Userid,Name,Birthdate,Email,Photoid) VALUES(?)", [userDetails],
                                            function (err, successIns) {
                                                if (!err) {
                                                    //Add Friends to database
                                                    graph.batch([
                                                        {
                                                            method: "GET",
                                                            relative_url: "me/friends" // Get the current user's profile information
                                                        },
                                                        {
                                                            method: "GET",
                                                            relative_url: "me/friends?fields=id,name,first_name,last_name,birthday,picture{url},interested_in,gender" // Get the first 50 friends of the current user
                                                        }
                                                    ], function (err, LoginUserFriendData) {
                                                            if (!err) 
                                                            {

                                                                var data = JSON.parse(LoginUserFriendData[1].body);
                                                               
                                                                var totalFriendFound = data.data.length;

                                                                var id = successIns.insertId;
                                                                console.log("total",totalFriendFound);
                                                                if(totalFriendFound!=0)
                                                                {
                                                                    for (var i = 0; i < totalFriendFound; i++) 
                                                                    {
                                                                        //console.log("friend ",data.data[i]);
                                                                        var Userid = data.data[i].id;
                                                                        var name = data.data[i].name;
                                                                        var birthday = new Date(data.data[i].birthday);
                                                                        var interested_in = data.data[i].interested_in;
                                                                        var picture = data.data[i].picture.data.url;
                                                                        
                                                                        var userDetails = [id, Userid, name, birthday, interested_in, picture];
                                                                        console.log("userDetails",userDetails);
                                                                        connection.query("INSERT into friend(id,Userid,Name,Birthdate,Interests,Photoid) VALUES(?)", [userDetails],
                                                                            function (err, successIns) {
                                                                                if (!err) 
                                                                                {
                                                                                    console.log("data inserted");
                                                                                }
                                                                                else 
                                                                                {
                                                                                    console.log("Error For insert data", err);
                                                                                    res.json({'code':200,'status':'Error','message':'Error For insert data'});
                                                                                    return;
                                                                                }
                                                                            });
                                                                    }

                                                                    connection.query("SELECT u.id as uid,u.Birthdate ubirthdate,u.Email as uemail,u.Name as uname,u.Photoid as uphoto,u.Userid as uUid ,f.Birthdate as fbirthdate,f.Interests as finterests ,f.Name as fname,f.Photoid as fphoto,f.Userid as fUid FROM User u,friend f where u.id=? and f.id=u.id",[id],
                                                                                    function(err,friends){
                                                                                        if(!err)
                                                                                        {
                                                                                            console.log("friends",friends);
                                                                                            res.json({'code':200,'status':'success','message':'Data Inserted','data':friends});
                                                                                            return;
                                                                                        }
                                                                                        else
                                                                                        {
                                                                                            connection.log("Error for Selecting friend data",err);
                                                                                            res.json({'code':200,'status':'Error','message':'Error for Selecting friend data'});
                                                                                            return;
                                                                                        }
                                                                                    });
                                                                }
                                                                else
                                                                {
                                                                    console.log("friends Friend not found");
                                                                    connection.query("select * from User where id=?",[id],
                                                                    function(err,userdata){
                                                                        if(!err)
                                                                        {
                                                                            console.log("Userdata",userdata);
                                                                        }
                                                                        else
                                                                        {
                                                                            console.log("Err",err);
                                                                        }
                                                                    });
                                                                }
                                                                
                                                            }
                                                            else 
                                                            {
                                                                console.log("Error For get Fiends data", err);
                                                                res.json({'code':200,'status':'Error','message':'Error For get Fiends data'});
                                                                return;
                                                            }

                                                        });

                                                }
                                                else {
                                                    console.log("Error for inserting data into User", err);
                                                    res.json({'code':200,'status':'error','message':'Error for inserting data'});
                                                    return;
                                                }
                                            });

*/
exports.getFriends = function(req,res)
{
    var accessToken=req.body.accessToken;

    graph.setAccessToken(accessToken);
   
    graph.batch([
        {
            method: "GET",
            relative_url: "me/friends" // Get the current user's profile information
        },
        {
            method: "GET",
            relative_url: "me/friends?fields=id,name,first_name,last_name,birthday,email,picture{url}" // Get the first 50 friends of the current user
        }
    ], function (err, UserData) {
            if (!err) 
            {
                var data = JSON.parse(UserData[1].body);
                console.log("data",data)
                res.json({ 'code': 200, 'status': 'Success', 'message': 'selected appointment_req',});
                return;
            }
            else {
                console.log("Error", err);
            }

        });
}

    // passport.use(new FacebookStrategy({
    //     clientID: config.facebook_api_key,
    //     clientSecret: config.facebook_api_secret,
    //     callbackURL: config.callback_url,
    //     scope:config.scope
    // },
    // function (accessToken, refreshToken, profile, done) 
    // {
    //     console.log("accessToken",accessToken);

    //     facebook.get('EAACEdEose0cBALiwZC1QqgZC0LLrntM1Re9UTTjdIdWLcWETknEN2B5MGESNNUnEcqLHO4EqNZBQJRrhOYIPVNBTPem2ZA1Gzy919a82eSySM4pJh3s83nqYrjSA2hXa83ZAZCfaXYm0t3TZAZA47UabFS7CusjwmeBWPlIq6uanyQZDZD', '/me/friends', 
    //         function(data){
    //         var friends=JSON.parse(data);
    //         console.log("Friends",friends);

    //         var totalfriendsFound=friends.data.length;
    //         var friendsDetails=[];
    //         for(var i=0;i<totalfriendsFound;i++)
    //         {
    //             var id=friends.data[i].id;
    //             req.facebook.graph(id+'?fields=id,name,birthday,email,picture{url}', 
    //             function(err, me) {
    //             if(!err)
    //             {
    //                 var friend=JSON.parse(me)
    //                 console.log("data",friend);
    //                 // friendsDetails.push({
    //                 //     id:
    //                 // });
    //             }
    //             else
    //             {
    //                 console.log("Error",err);
    //             }
    //             });
    //         }

    //     });
    // }
    // ));
/*
        facebook.get(req.session.access_token, '/me/friends', 
            function(data){
            var friends=JSON.parse(data);
            console.log("Friends",friends.data[0].id);
            
            req.facebook.graph(friends.data[0].id+'?fields=id,name,birthday,email,picture{url}', 
                function(err, me) {
                  if(!err)
                  {
                      console.log("me",me);
                  }
                  else
                  {
                      console.log("Error",err);
                  }
                });

            var totalfriendsFound=friends.data.length;
            var friendsDetails=[];
            for(var i=0;i<totalfriendsFound;i++)
            {
                var id=friends.data[i].id;
                req.facebook.graph(id+'?fields=id,name,birthday,email,picture{url}', 
                function(err, me) {
                if(!err)
                {
                    var friend=JSON.parse(me)
                    console.log("data",friend);
                    // friendsDetails.push({
                    //     id:
                    // });
                }
                else
                {
                    console.log("Error",err);
                }
                });
            }
            
        });
*/



// graph.setAccessToken('EAACEdEose0cBADls6Dr647oGpeEP8djUMZCm6wNtgYoKC5bQWSpS7IxOVsWSKGTKaBX6FLxMQgEwpohGX2sqzZArPF6XixtLCp6pQeGuDFdiiNZB6wcTPt6IDZCrao41LJH7EEZBUqGYXZA1xLt5tn9QXPKk1ZBfXZChvbfxYRogbAZDZD');

    //     graph.batch([
    //       {
    //         method: "GET",
    //         relative_url: "me" // Get the current user's profile information
    //       },
    //       {
    //         method: "GET",
    //         relative_url: "me?fields=id,name,birthday,email,picture{url}" // Get the first 50 friends of the current user
    //       }
    //     ], function(err, res) 
    //     {
    //         if(!err)
    //         {
    //               var data=JSON.parse(res[1].body);
    //               console.log("res",data);
    //         }
    //         else
    //         {
    //             console.log("Error",err);
    //         }
    //     });


/*

 req.facebook.graph('/me?fields=id,name,birthday,email,picture{url}', 
        function(err, me) {
          if(!err)
          {
              var id=parseInt(me.id) ;
              var name= me.name ;
              var birthday= new Date(me.birthday);
              var email=me.email ;
              var picture=me.picture.data.url ;
                        
              if (config.use_database === 'true') 
                {
                   pool.getConnection(function(err,connection){
                        if(!err)
                        {
                            connection.query("SELECT * from User where Userid=" + id, 
                            function (err, rows, fields) {
                                if (err) throw err;
                                if (rows.length === 0) 
                                {
                                    console.log("There is no such user, adding now",id);
                                    var userDetails=[id,name,birthday,email,picture];
                                    console.log("userDetails",userDetails);
                                    connection.query("INSERT into User(Userid,Name,Birthdate,Email,Photoid) VALUES(?)",[userDetails],
                                    function(err,successIns){
                                    if(!err)
                                    {
                                        
                                        connection.query('select * from User where Userid=?',[id],
                                            function(err,rows){
                                                if(!err)
                                                {
                                                        console.log("Data inserted success",rows);
                                                        res.json({'code':200,'status':'success','message':'Data inserted success','userData':rows});
                                                        return;
                                                }
                                                else
                                                {

                                                }
                                            });
                                       
                                    }
                                    else
                                    {
                                        console.log("Error for inserting data into User",err);
                                        res.json({'code':200,'status':'error','message':'Error for inserting data'});
                                        return;
                                    }
                                    });
                                }
                                else 
                                {
                                    console.log("User already exists in database",rows);
                                    res.json({'code':200,'status':'success','message':'Useris exist','userData':rows});
                                    return;
                                }
                            });
                            connection.release();
                        }
                        else
                        {
                            console.log("Connection Error",err);
                            res.json({'code':200,'status':'error','message':'Connection Error'});
                            return;
                        }
                    });
                    
                }
              
          }
          else
          {
              console.log("User select Error",err);
              res.json({'code':200,'status':'error','message':'User select Error'});
              return;
          }
          
      });


*/
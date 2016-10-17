
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


exports.user=function(req,res)
{
    var accessToken=req.body.accessToken;
    
    graph.setAccessToken(accessToken);
    
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
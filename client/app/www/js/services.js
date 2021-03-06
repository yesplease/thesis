angular.module('starter.factories', [])

.factory('Payment', ['$http', function($http){
  var payment = {};
  payment.stripeInfo = {};

  payment.sendToken = function(token){
    console.log("you are sending token now! let's see what happens, here is the token", token);
    $http.post('/payments/stripe', {JSONtoken: token, choices: payment.stripeInfo})
      .success(function(data, status, headers, config) {
        console.log('You were able to send payment token to server!!');
      })
      .error(function(data, status, headers, config) {
        console.log('Your token was not added to server');
      });
  };
  return payment;
}])

.factory('User', ['$http', '$state', function($http, $state) {
  var user = {};

  user.loggedIn = {
    goals: []
  };

  user.getUncelebrated = function(goals) {
    return goals.filter(function(goal){
      if(goal.completed && !goal.celebrated) {
        return goal;
      }
    });
  };

  user.getOldestUncelebrated = function(goals) {
    return user.getUncelebrated(goals)[0];
  }

  user.initialDirect = function(currentUser){

    var uncelebrated = user.getOldestUncelebrated(currentUser.goals);
    if (currentUser.goals.length === 0){
      $state.go('goaltype');
      return;
    }
    if(uncelebrated[0]) {
      return user.celebrate(uncelebrated[0]);
    }
    $state.go('progress');
  };

  user.celebrate = function(goal) {
    goal.celebrated = true;
    user.putGoal(goal);
    if(+goal.target - +goal.progress > 0) {
      $state.go('tab-success');
    } else {
      $state.go('tab-failure');
    }
  };

  user.putGoal = function(goal) {
    $http.put('/api/goal', goal)
      .success(function(data, status, headers, config) {
        console.log('Load was performed.', data);
      })
      .error(function(data, status, headers, config) {
        console.log('error', data);
      });
  };

  //fix later to only save most pertinent data
    //also to standardize the 'username' concern b/c they're different based on
    //how they logged in
  user.getUser = function(){
    return $http.get('/api/user')
      .then(function(userData){
        user.loggedIn = userData.data;
        user.initialDirect(user.loggedIn);
      });
  };

  user.checkJawbone = function(currentUser){
    if (currentUser.jawbone === undefined){
      return false;
    } else {
      return true;
    }
  };

  return user;
}])

.factory('GoalBuilder', ['$state', 'User', '$http', 'Payment', function($state, User, $http, Payment) {
  var goalBuilder = {};

  //THE GOAL
  goalBuilder.goal = {
    completed: false,
    celebrated: false
  };

  //DATA
  goalBuilder.returnGoals = function(){
    var goalTypes = [
      {
        title: "Step Goal",
        unit: "steps"
      },
      {
        title: "Sleep Goal",
        unit: "hours"
      },
      {
        title: "Cycling Distance Goal",
        unit: "miles"
      },
      {
        title: "Cycling Climbing Goal",
        unit: "feet"
      },
      {
        title: "Tech Usage Goal",
        unit: "minutes"
      },
      {
        title: "Running Distance Goal",
        unit: "miles"
      },
      {
        title: "Focus Goal",
        unit: "minutes"
      }
    ];

    return goalTypes;
  };

  goalBuilder.returnSucesses = function(){
    var successTypes = [
      {
        orgName: 'Arbor Day Foundation',
        description: 'Plant a tree!',
        price: '$5',
        stripePrice: 500,
        img: 'imgurl'
      },
      {
        orgName: 'Red Cross',
        description: 'Buy a vaccination',
        price: '$5',
        stripePrice: 500,
        img: 'imgurl'
      },
      {
        orgName: 'TerraPass',
        description: 'Offset a flight',
        price: '$5',
        stripePrice: 500,
        img: 'imgurl'
      }
    ];
    return successTypes;
  };

  goalBuilder.returnTimes = function(){
    var times = [
      "One Day",
      "One Week",
      "One Month",
      "One Year"
    ];
    return times;
  };

  goalBuilder.returnFailures = function(){
    var failTypes = [
      {
        orgName: 'Tip the developers',
        description: "We're broke",
        img: 'imgurl'
      },
      {
        orgName: 'Cupcake of condesention',
        description: 'Sweets',
        img: 'imgurl'
      }
    ];
    return failTypes;
  };

  //CLICK THROUGH GOAL SETUP
  goalBuilder.goalClick = function(goal){
    goalBuilder.goal.goalType = goal;
    if (User.checkJawbone(User.loggedIn)){
      $state.go('goaldetails');
    } else {
      $state.go('deviceAuth');
    }
  };

  goalBuilder.successClick = function(success){
    goalBuilder.goal.success = success;
    $state.go('goalfailure');
  };

  goalBuilder.failClick = function(fail){
    var goal = goalBuilder.goal;
    goal.fail = fail;
    goal.startTime = Date.now();

    /////////////////
    // console.log(Payment.sendToken)
    Payment.stripeInfo = goal;
    /////////////////



    goalBuilder.saveGoal(goal);
    goalBuilder.sendGoal(goal);

    if(User.loggedIn.hasPayment){
      $state.go('progress');
    } else {
      $state.go('payment');
    }
  };

  //UTILS
  goalBuilder.saveGoal = function(goal) {
    var copy = angular.copy(goal);
    User.loggedIn.goals.push(copy);
  };

  goalBuilder.sendGoal = function(goal){
    $http.post('/api/goals', goal)
      .success(function(data, status, headers, config) {
        console.log('YAY!!');
      })
      .error(function(data, status, headers, config) {
        console.log('Your goal could not be added');
      });
    goalBuilder.goal = {
      completed: false,
      celebrated: false
    };
  };

  goalBuilder.convertTime = function(timeframe) {
    var millis = {
      'One Day': 86400000,
      'One Week': 604800000,
      'One Month': 2419200000,
      'One Year': 3.15569e10
    }
    return millis[timeframe];
  };

  goalBuilder.updateDeets = function() {
    goalBuilder.goal.period = {
      human: this.timeframe,
      millis: goalBuilder.convertTime(this.timeframe)
    }
    goalBuilder.goal.target = this.target;
    $state.go('goalsuccess');
  };

  return goalBuilder;
}]);

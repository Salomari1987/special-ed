var states = [
  { name: 'base', state: { abstract: true, url: '', templateUrl: 'views/base.html', data: {text: 'Base', visible: false } } },
  { name: 'login', state: { url: '/login', parent: 'base', templateUrl: 'views/login.html', controller: 'LoginCtrl', data: {text: 'Login', visible: false } } },
  { name: 'dashboard', state: { url: '/dashboard', parent: 'base', templateUrl: 'views/dashboard.html', controller: 'DashboardCtrl', data: {text: 'Dashboard', visible: false } } },
  { name: 'overview', state: { url: '/overview', parent: 'dashboard', templateUrl: 'views/dashboard/overview.html', controller: 'OverviewCtrl', data: {text: 'Overview', visible: true } } },
  { name: 'reports', state: { url: '/reports', parent: 'dashboard', templateUrl: 'views/dashboard/reports.html',controller:'report' , data: {text: 'Reports', visible: true } } },
  { name: 'logout', state: { url: '/logout', templateUrl: 'views/logout.html', controller: 'LogoutCtrl', data: {text: 'Logout', visible: true }} },
  { name: 'signup', state: { url: '/signup', parent: 'base', templateUrl: 'views/signup.html', controller: 'SignupCtrl', data: {text: 'SignUp', visible: false }} },
  { name: 'play', state: { url: '/play', parent: 'dashboard', templateUrl: 'views/dashboard/game.html', controller: 'MainController', data: {text: 'Play Game', visible: true }} },
  { name: 'assessment', state: { url: '/assessment', parent: 'dashboard', templateUrl: 'views/dashboard/assessmentForm.html', controller: 'assessmentController', data: {text: 'C.A.R.S Assessment', visible: true }} },
  { name: 'profile', state: { url: '/profile', parent: 'dashboard', templateUrl: 'views/dashboard/profile.html', controller: 'ProfileCtrl', data: {text: 'Profile page', visible: false }} },
  { name: 'centers', state: { url: '/centers', parent: 'dashboard', templateUrl: 'views/dashboard/centers.html', controller: 'centersCtr', data: {text: 'centers', visible: true }} },
  { name: 'game', state: { url: '/game', parent: 'dashboard', templateUrl: 'views/dashboard/picGame.html', controller: 'oneCtrl', data: {text: 'PIC Game', visible: true }} },
  { name: 'teacherProfile', state: { url: '/teacherProfile', parent: 'dashboard', templateUrl: 'views/dashboard/teacherProfile.html', controller: 'teacherCtrl', data: {text: 'teacherProfile', visible: false }} },
  { name: 'studentProfile', state: { url: '/studentProfile', parent: 'dashboard', templateUrl: 'views/dashboard/studentProfile.html', controller: 'studentCtrl', data: {text: 'studentProfile', visible: false }} },
  { name: 'centerProfile', state: { url: '/centerProfile', parent: 'dashboard', templateUrl: 'views/dashboard/centerProfile.html', controller: 'centerCtrl', data: {text: 'centerProfile', visible: false }} },
  { name: 'publicCenters', state: { url: '/publicCenters', templateUrl: 'views/guest/publicCenters.html', controller: 'centersCtr', data: {text: 'publicCenters', visible: true }} },
  { name: 'freeAssessment', state: { url: '/freeAssessment', templateUrl: 'views/guest/freeAssessment.html', controller: 'assessmentController', data: {text: 'C.A.R.S Assessment', visible: true }} },
  { name: 'freePlay', state: { url: '/freePlay', templateUrl: 'views/guest/freeGame.html', controller: 'MainController', data: {text: 'Play Free Game', visible: true }} },
  { name: 'landingPage', state: { url: '/landingPage', templateUrl: 'views/landingPage.html', controller: 'landingController', data: {text: 'landingPage', visible: true }} },
  { name: 'YOUTUBE', state: { url: '/YOUTUBE', templateUrl: 'views/dashboard/youtubeAPI.html', controller: 'youtube', data: {text: 'Youtube', visible: true }} },
];
angular.module('SED', [
  'SED.youtube',
  'SED.report',
  'ngAnimate',
  'ngTouch',
  'ngResource',
  'ui.bootstrap',
  'ui.router',
  'snap',
  'drag-and-drop',
  'SED.services',
  'dragDropSampleApp',
  'SED.centers',
  'SED.multiForms',
  'SED.Login',
  'SED.Signup',
  'SED.Profile',
  'SED.Overview',
  'SED.Dashboard',
  'SED.centerProfile',
  'SED.studentProfile',
  'SED.teacherProfile',
  'SED.landing',
  'SED.Logout'
])

.config(function($stateProvider, $urlRouterProvider, $httpProvider) {
  $urlRouterProvider.when('/dashboard', '/dashboard/overview');
  $urlRouterProvider.otherwise('/landingPage');

  angular.forEach(states, function (state) {
    $stateProvider.state(state.name, state.state);
  });
  $httpProvider.interceptors.push('AttachTokens');
})

.factory('AttachTokens', function ($window) {
  // this is an $httpInterceptor
  // its job is to stop all out going request
  // then look in local storage and find the user's token
  // then add it to the header so the server can validate the request
  var attach = {
    request: function (object) {
      var jwt = $window.localStorage.getItem('com.SEDuser') || $window.localStorage.getItem('com.SEDteacher') || $window.localStorage.getItem('com.SEDcenter');
      console.log(jwt);
      if (jwt) {
        object.headers['x-access-token'] = jwt;
      }
      object.headers['Allow-Control-Allow-Origin'] = '*';
      return object;
    }
  };
  return attach;
})

.run(function ($rootScope, $location, Auth) {
  // here inside the run phase of angular, our services and controllers
  // have just been registered and our app is ready
  // however, we want to make sure the user is authorized
  // we listen for when angular is trying to change routes
  // when it does change routes, we then look for the token in localstorage
  // and send that token to the server to see if it is a real user or hasn't expired
  // if it's not valid, we then redirect back to signin/signup
  var allowedURLS = ['/landingPage', '/freePlay', '/freeAssessment', '/publicCenters', '/signup', '/logout', '/login'];
  $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
    if (event && allowedURLS.indexOf(toState.url) === -1 && (!Auth.isAuthuser() && !Auth.isAuthteacher() && !Auth.isAuthcenter())) {
      $location.path('/login');
    }
  });
}); 

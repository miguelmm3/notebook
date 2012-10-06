'use strict';


// Declare app level module which depends on filters, and services
angular.module('notebook', [ 'notebook.filters', 'notebook.services', 'notebook.directives' ]).
  config(['$routeProvider', '$locationProvider', function( $routeProvider, $locationProvider ) {
    $routeProvider.when( '/group/new', { templateUrl: '/partials/group/new', controller: GroupNewCtrl });
    $routeProvider.when( '/group/list', { templateUrl: '/partials/group/list', controller: GroupListCtrl });
    $routeProvider.when( '/configure', { templateUrl: '/partials/configure' });
    $routeProvider.when( '/login', { templateUrl: '/partials/login' });
    $routeProvider.when( "logout",{ controller: LogoutCtrl });
    $routeProvider.when( "/examination/new",{ templateUrl:"/partials/examination/new",controller:ExaminationNewCtrl });
    $routeProvider.when( "/examination/list",{ templateUrl:"/partials/examination/list",controller:ExaminationListCtrl });
    $routeProvider.when( "/",{templateUrl:"/partials/home"});
    $routeProvider.otherwise( { redirectTo: '/' } );
    $locationProvider.html5Mode(true);
  }]);
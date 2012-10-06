'use strict';

/* Controllers */

function LogoutCtrl($http){
  $http.get("/logout")
}
LogoutCtrl.$inject = [ "$http" ];

function GroupNewCtrl($scope,$http, $location) {
  $scope.students=[];
  
  $scope.addStudent=function($event){
  	$event.preventDefault();
  	$event.stopPropagation();
    $scope.students.push({
  	  firstName: $scope.firstName,
  	  lastName : $scope.lastName,
  	  fatherName: $scope.fatherName,
  	  motherName: $scope.motherName,
  	  birthday: $scope.birthday,
  	  telephones: $scope.telephones,
  	  notes: $scope.notes
    });
    $scope.firstName="";
    $scope.lastName="";
    $scope.fatherName="";
    $scope.motherName="";
    $scope.birthday="";
    $scope.telephones="";
    $scope.notes=""; 
  };
  $scope.removeStudent=function($event, index){
  	$event.preventDefault();
  	$event.stopPropagation();
  	$scope.students.splice(index,1);
  }
  $scope.saveGroup=function($event){
  	$event.preventDefault();
  	$event.stopPropagation();
  	var group = {
  		name:$scope.name,
  		year:$scope.year,
  		students:$scope.students
  	};
  	$http.post('/group/create', group).
    success(function(data, status, headers, config) {
      $location.path("/group/list");
    }).
    error(function(data, status, headers, config) {
      $scope.name = 'Error!'
    });
  }
}
GroupNewCtrl.$inject = ['$scope','$http',"$location"];

function GroupListCtrl($scope, $http, $location){
	$http.get("/group/list").success(function(data){
		$scope.groups = data;
	});
	$scope.showStudentsForGroup=null;

	$scope.showStudents=function( $event, index ){
		$event.preventDefault();
		$event.stopPropagation();
		if($scope.showStudentsForGroup === index){
			$scope.showStudentsForGroup = null;
		}else{
			$scope.showStudentsForGroup = index;	
		}
		
	};
	$scope.isShowStudents=function(index){
		return index === $scope.showStudentsForGroup;	
	};
	$scope.chooseGroup=function($event,index){
		$http.get("/user/profile").success(function(profile){
			profile.group = $scope.groups[index].id;
			$http.put("/user/profile",profile).success(function(){
              $location.path("/");
			});
		})
		
	}
}
GroupListCtrl.$inject= ["$scope", "$http","$location"];

function ExaminationNewCtrl($scope,$http, $location){
  $scope.subject="";
  $scope.date = new Date;
  $scope.students= [];
  $scope.maximal=0;
  $scope.mark=[];
  $scope.groupId=0;

  $http.get("/controlTables").success(function( data ){
  	$scope.subjects = data.subject;
  });
  $http.get("/user/profile").success(function( profile ){
    $http.get("/group/"+profile.group).success(function(group){
      $scope.students = group.students;
      $scope.groupId = group.id;
    });
  });
  $scope.saveExam = function($event){
    $event.preventDefault();
    $event.stopPropagation();
    var exam = {
      subject: $scope.subject.code,
      date: $scope.date,
      maximal: $scope.maximal,
      group:$scope.groupId,
      marks: $scope.students.map(function(student, index){
        return { firstName:student.firstName,
                 lastName:student.lastName,
                 mark:$scope.mark[index]
               }
      })
    };
    $http.post("/examination/create",exam).success(function(){
      $location.path("/");
    });
    
  }
}
ExaminationNewCtrl.$inject = [ "$scope","$http","$location" ];

function ExaminationListCtrl($scope, $http){
  $scope.exams = [];
  $scope.examsBySubjectCode = {};
  $scope.students=[];

  $http.get("/user/profile").success(function( profile ){
    $http.get("/group/"+profile.group).success(function(group){
      $scope.students = group.students;
    });
  });
  
  $http.get("/controlTables").success(function( data ){
    var competenceToSubjectSize = {};
    $scope.subjects = data.subject;
    $http.get("/examination/list").success(function( data ){
      $scope.exams = data;
      $scope.examsBySubjectCode = createExamBySubject(data);
    });
  });


  var createExamBySubject = function(exams){
    var acc = {};
    exams.forEach(function(exam){
        if(!acc[exam.exam.subject]){
          acc[exam.exam.subject]= [];
        }
        acc[exam.exam.subject].push(exam);
      });
    return acc;
  };
  $scope.getStudentInExamMarks=function(firstName,lastName, marks){
    var result =  marks.filter(function(mark){
      return mark.firstName === firstName &&
             mark.lastName === lastName;
    });
    return result[0];
  };
  $scope.getStudentAverageForSubject = function(firstName, lastName, subject){
    var cumulative = 0;
    var nbOfMark = 0;
    if( $scope.examsBySubjectCode[subject] ){
      $scope.examsBySubjectCode[subject].forEach(function(exam){
        var mark = $scope.getStudentInExamMarks(firstName,lastName,exam.exam.marks).mark;
        cumulative = cumulative + mark;
        nbOfMark++;
      });
    return cumulative/nbOfMark;
    }
    return 0;
  }
}
ExaminationListCtrl.$inject = ["$scope","$http"]

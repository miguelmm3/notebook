$(document).ready(function(){
  editClass = Backbone.View.extend({    
    el: $('body'),
    initialize: function(){
      _.bindAll(this, 'render', 'addStudent','appendStudent','clearForm', "changeClass", "saveClass");
      this.model = new Class({students:new Students()});
      this.model.get("students").bind('add', this.appendStudent);
      this.render();
    },
    events: {
      "change .group"          : "changeClass",
      "change .year"           : "changeClass",
      "change .firstname"      : "changeClass",
      "change .lastname"       : "changeClass",
      "change .birthday"       : "changeClass",
      "change .notes"          : "changeClass",
      "change .telephone"      : "changeClass",
      "change .fatherName"     : "changeClass",
      "change .motherName"     : "changeClass",
      "click .saveClassButton" : "saveClass",
      
//, add ability to remove a student
    },
    render: function(){
      var self = this;
       _(this.model.get("students").models).each(function(student){ 
        self.appendItem(student);
      }, this);
    },
    addStudent: function(){
      var s = new Student({
         firstname:$(".firstname").val(),
         lastname:$(".lastname").val(),
         birthday:$(".birthday").val(),
         notes:$(".notes").val(),
         telephoneNumber:$(".telephone").val(),
         fatherName:$(".fatherName").val(),
         motherName:$(".motherName").val()
      });
      this.model.get("students").add(s);
      this.clearForm();
    },
    clearForm:function(){
      $(".firstname").val("");
      $(".lastname").val("");
      $(".birthday").val("");
      $(".notes").val("");
      $(".telephone").val("");
      $(".fatherName").val("");
      $(".motherName").val("");
    },
    appendStudent: function(student){
      $(".studentList table tbody",this.el).append( 
                  "<tr>  <td class='firstname'>"+ student.get("firstname") + "</td>"+
                         "<td class='lastname'>"+ student.get("lastname") + "</td>"+
                         "<td class='birthday'>"+ student.get("birthday") + "</td>"+
                         "<td class='fatherName'>"+ student.get("fatherName") + "</td>"+
                         "<td class='motherName'>"+ student.get("motherName") + "</td>"+
                         "<td class='telephone'>"+ student.get("telephone") + "</td>"+
                         "<td class='notes'>"+ student.get("notes") + "</td> </tr>");
    },
    changeClass:function(){
      this.model.set({
        "group":$("group").val(),
        "year":$("year").val()
      });
      
      $(".firstname").each(function(){ this.model.get("students").set({ firstname: $(this).val() });  });
      $(".lastname").each(function(){ this.model.get("students").set({ lastname: $(this).val() });  });
      $(".birthday").each(function(){ this.model.get("students").set({ birthday: $(this).val() });  });
      $(".fatherName").each(function(){ this.model.get("students").set({ fatherName: $(this).val() });  });
      $(".motherName").each(function(){ this.model.get("students").set({ motherName: $(this).val() });  });
      $(".telephone").each(function(){ this.model.get("students").set({ telephone: $(this).val() });  });
      $(".notes").each(function(){ this.model.get("students").set({ notes: $(this).val() });  });
      
    },
    saveClass:function(){
      var json = JSON.parse( JSON.stringify( this.model ) );
      $.ajax({
        type: 'PUT',
        url: "./",
        data: json,
        success: function(data){
          window.location = data;
        }
      });
    }
  });
  var editClass = new editClass()
});

$(".delete").click(function(event){
  console.log(event);
  $.ajax(
    { url:"/class/deleteStudent/"+$("tr")
  });
});

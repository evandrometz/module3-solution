(function () {
'use strict';

angular.module('NarrowItDownApp', [])
.controller('NarrowItDownController', NarrowItDownController )
.service('MenuSearchService', MenuSearchService)
.constant('ApiBasePath', "https://davids-restaurant.herokuapp.com")
.directive('fItems', FItemsDirective)
;


function FItemsDirective() {
  var ddo = {
    templateUrl: 'fItems.html',
    scope: {
      foundItems: '<',
      onRemove: '&'
    },
    controller: NarrowItDownController,
    controllerAs: 'narrow',
    bindToController: true
  };

  return ddo;
}


NarrowItDownController.$inject = ['MenuSearchService'];
function NarrowItDownController (MenuSearchService) {

  var narrow = this;
  narrow.searchTerm = "";

  narrow.foundItems = MenuSearchService.getFoundItems();

var promise = MenuSearchService.getMatchedMenuItems();
  promise.then(function (response){
  narrow.items = response.data;
  //console.log(narrow.items.menu_items[1].description)
  })
  .catch(function (error){
    console.log(error);
  });

narrow.getMatchedMenuItems = function (searchTerm){
  //narrow.foundItems = [];
narrow.foundItems = MenuSearchService.clearFoundItems();
  if(narrow.searchTerm.length> 0 ){
    narrow.errorMessage = "";

narrow.foundItems = MenuSearchService.selectRightItemsService (searchTerm, narrow.items);



if(narrow.foundItems.length<1)
{
    narrow.errorMessage = "Nothing found";
}
else {
  narrow.errorMessage = "";
}
}
else {
  narrow.errorMessage = "Nothing found";
}
};

narrow.removeItem = function (itemIndex){

  MenuSearchService.removeItem(itemIndex)
};

}

MenuSearchService.$inject = ['$http', 'ApiBasePath']
function MenuSearchService($http, ApiBasePath) {
var service = this;

var foundItems = [];

service.getMatchedMenuItems = function () {

  var response = $http({
    method: "GET",
    url: (ApiBasePath + "/menu_items.json"),
    // params:{
    //   menu_items: searchTerm
    // }
  });

  return response;
};

service.selectRightItemsService = function (searchTerm, items){


for(var i = 0;i<items.menu_items.length;i++)
{
  //console.log(items.menu_items[i].description.toLowerCase());
  //console.log(searchTerm.toLowerCase());
  if(items.menu_items[i].description.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1)
  {
    foundItems.push(items.menu_items[i]);
  }

}
return foundItems;

};

service.clearFoundItems = function (){
  foundItems = [];
  return foundItems;
};

service.removeItem = function (itemIndex){
  foundItems.splice(itemIndex, 1);
};

service.getFoundItems = function(){
  return foundItems;
};
}

})();

/* 
* Main
* Sets up the menu
* Parts based off of: http://clav.cz/google-apps-script-menu-functions-with-parameters/
*/

function onOpen(e) {
  
}

(function (globalScope) {
  
  //Collect stored JSON data and iterate over it
  var ss = SpreadsheetApp.getActive();
  var trophy_list = ss.getSheetByName('Trophy List');
  var ui = SpreadsheetApp.getUi();
  var menu = ui.createMenu('MS2 Trophy Tracker');
  var update_menu = ui.createMenu('Update');
  
  menu.addItem('Remove Protection', 'removeProtection_');
  
  for (i = 1; i < (trophy_list.getRange('B1').getValue() + 1); i++){
    
    //Variables needed for initial page setup
    var raw_data = trophy_list.getRange('A' + i).getValue();
    var data = JSON.parse(raw_data.toString());
    var category_menu = ui.createMenu(data.name);
    
    //Loop over categories
    for (category in data){          
      
      //Skip over non-object categories
      if (data[category].constructor !== Object) continue;
      
      category_menu.addItem(data[category].name, 'update' + category + data.name);      
      createMenuFunction(category, i);
      
    }
    
    update_menu.addSubMenu(category_menu);
    
  }
  
  menu.addSubMenu(update_menu);
  menu.addToUi();
  
  // you need to generate menuFunction via another function,
  // because that way you generate scope to keep param unchanged.
  // If you'll generate menuFunction right inside for loop,
  // all your menuFunctions will refer to same instance of var i,
  // which will be undefined after this closure terminates.
  function createMenuFunction(category, i) {
    // here we define new function inside global scope
    globalScope['update' + category + data.name] = function() {
      updater_(category, i);
    }
  }
})(this) // here we passing global scope and call the closure

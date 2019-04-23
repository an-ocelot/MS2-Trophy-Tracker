/* Main
* Contains general functions needed for operation.
*/

function onOpen() {
  
  var ss = SpreadsheetApp.getActive();
  var menu = [
    {name : 'Update', functionName : 'updater_'}
  ];
  
  ss.addMenu('MS2 Trophy Tracker', menu);
  
}

//Cell formatting 
function formatCell_(cell, cell_color, cell_value) {
  
  cell.setBackground(cell_color);
  cell.setHorizontalAlignment('center');
  cell.setFontWeight('bold');
  cell.setFontFamily('Comfortaa');
  cell.setNumberFormat('@');
  cell.setValue(cell_value);
  cell.protect().setWarningOnly(true);
  
}

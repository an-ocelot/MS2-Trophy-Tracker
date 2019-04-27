/* 
* Tools
* Useful functions that are not big enough for their own file
*/

//Remove protection
function removeProtection_() {
  var ss = SpreadsheetApp.getActive();
  var r_protections = ss.getProtections(SpreadsheetApp.ProtectionType.RANGE);
  for (var i = 0; i < r_protections.length; i++) {
    var protection = r_protections[i];
    if (protection.canEdit()) {
      protection.remove();
    }
  }
}

//Cell formatting 
function formatCell_(cell, cell_color, cell_value) {
  
  cell.setBackground(cell_color);
  cell.setHorizontalAlignment('center');
  cell.setFontWeight('bold');
  cell.setFontFamily('Comfortaa');
  cell.setNumberFormat('@');
  cell.setValue(cell_value);
  
}

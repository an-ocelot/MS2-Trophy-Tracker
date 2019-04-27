/* 
* Updater
* Contains the main function for creating and updating the spreadsheet.
*/

function updater_(category, i) {
  
  //Variables needed for page setup and updating
  var ss = SpreadsheetApp.getActive();
  var trophy_list = ss.getSheetByName('Trophy List');
  
  var raw_data = trophy_list.getRange('A' + i).getValue();
  var data = JSON.parse(raw_data.toString());
  var page = ss.getSheetByName(data.name);
  
  var last_row = 0;
  var last_column = 1;
  
  //Get correct row offset
  for (c in data) {
    if (data[c].constructor !== Object) continue;
    if (c !== category) {
      last_row += 7;
    } else {
      break;
    }
  }
  
  //General page checking
  if (!page) {
    
    //Create Page and set default values and cells
    ss.insertSheet(data.name);
    page = ss.getSheetByName(data.name);
    
    //Freeze sidebar
    var sidebar = page.getRange(1, 1, page.getMaxRows(), 1);
    page.setFrozenColumns(1);
    
  }
  
  //Variables needed to create the category
  var range = page.getRange(last_row + 1, 1, 7, page.getMaxColumns());
  var page_rules = page.getConditionalFormatRules();
  var last_color = 0;
  var color = ['#9c96be', '#d2beff'];
  var cf_color = [
    ['#004203'],
    ['#004203', '#bdffa5'],
    ['#004203', '#008006', '#bdffa5'],
    ['#004203', '#008006', '#759e66', '#bdffa5'],
    ['#004203', '#008006', '#759e66', '#bdffa5', '#ffc7c7'],
    ['#004203', '#008006', '#759e66', '#a8e392', '#bdffa5', '#ffc7c7'],
    ['#004203', '#008006', '#759e66', '#a8e392', '#bdffa5', '#ffc7c7', '#ff9090'],
    ['#004203', '#005b04', '#008006', '#759e66', '#a8e392', '#bdffa5', '#ffc7c7', '#ff9090'],
    ['#004203', '#005b04', '#008006', '#759e66', '#a8e392', '#bdffa5', '#ffc7c7', '#ff9090', '#ff6c6c']
  ];
  var user_data = {};
  
  //Clear conditional formatting
  range.clearFormat();
  
  //Unmerge to prevent an error from occurring
  var group_titles = page.getRange(last_row + 2, last_column + 1, 1, page.getMaxColumns());
  group_titles.merge();
  group_titles.setBackground('white');
  group_titles.breakApart();
  
  //Top blank row
  var top_row = page.getRange(last_row + 1, last_column + 1, 1, page.getMaxColumns());
  top_row.setBackground(color[0]);
  
  //Bottom blank row
  var bot_row = page.getRange(last_row + 7, last_column + 1, 1, page.getMaxColumns());
  bot_row.setBackground(color[0]);
  
  //Sidebar type row
  var sidebar_type = page.getRange(last_row + 1, 1);
  formatCell_(sidebar_type, color[0], data[category].name);
  
  //Sidebar name row
  var sidebar_name = page.getRange(last_row + 2, 1);
  formatCell_(sidebar_name, color[0], data[category].type);
  
  //Sidebar trophy name row
  var sidebar_tname = page.getRange(last_row + 3, 1);
  formatCell_(sidebar_tname, color[0], 'Trophy Name');
  
  //Sidebar description row
  var sidebar_desc = page.getRange(last_row + 4, 1);
  formatCell_(sidebar_desc, color[0], 'Description');
  
  //Sidebar amount row
  var sidebar_amnt = page.getRange(last_row + 5, 1);
  formatCell_(sidebar_amnt, color[0], 'Amount');
  
  //Sidebar completed row
  var sidebar_comp = page.getRange(last_row + 6, 1);
  formatCell_(sidebar_comp, color[0], 'Completed');
  
  //Sidebar bottom row
  var sidebar_bot = page.getRange(last_row + 7, 1);
  sidebar_bot.setBackground(color[0]);
  
  //Loop over trophy groups
  for (group in data[category]){
    
    if (data[category][group].constructor !== Object) continue;
    
    var columns = [1];
    var group_column_offset = 0;
    
    while (columns.length < data[category][group].size) {
      
      columns.push(columns.length + 1);
      
    }
    
    //Group Title            
    var title = page.getRange(last_row + 2,last_column + 1, 1, data[category][group].size);
    title.merge();
    formatCell_(title, color[last_color], data[category][group].name);
    
    //Loop over individual trophies
    for (trophy in data[category][group]) {
      
      if (data[category][group][trophy].constructor !== Object) continue;
      
      //Trophy Names
      var trophy_name = page.getRange(last_row + 3,last_column + 1 + group_column_offset);
      
      //Save user data before replacing the trophy name cell
      var trophy_comp = page.getRange(last_row + 6,last_column + 1 + group_column_offset);
      if (trophy_comp.getValue() !== '' && trophy_name !== data[category][group][trophy].name) user_data[data[category][group][trophy].name] = trophy_comp.getValue();
      
      //Continue with setting the trophy name cell
      formatCell_(trophy_name, color[last_color], data[category][group][trophy].name);
      
      //Trophy Descriptions
      var trophy_desc = page.getRange(last_row + 4,last_column + 1 + group_column_offset);
      formatCell_(trophy_desc, color[last_color], data[category][group][trophy].desc);
      
      //Trophy Amounts
      var trophy_amnt = page.getRange(last_row + 5,last_column + 1 + group_column_offset);
      formatCell_(trophy_amnt, color[last_color], data[category][group][trophy].amnt);
      
      //Completed Amounts
      trophy_comp.setHorizontalAlignment('center');
      trophy_comp.setFontFamily('Comfortaa');
      
      for (t in user_data) {
        
        if (t === data[category][group][trophy].name) trophy_comp.setValue(user_data[t]);
        
      }
      
      var amounts = data[category][group][trophy].amnt.split('/');
      var amount_keys = Object.keys(amounts).reverse();
      
      for (a = 0; a < amount_keys.length; a++){
        
        var rule = SpreadsheetApp.newConditionalFormatRule().whenNumberGreaterThanOrEqualTo(parseInt(amounts[amount_keys[a]])).setBackground(cf_color[Object.keys(amounts).length - 1][a]).setRanges([trophy_comp]).build();
        page_rules.push(rule);
        page.setConditionalFormatRules(page_rules);  
        
      }
      
      group_column_offset += 1;
    }
    
    //Recalculate column offset
    last_column += columns[columns.length - 1];
    if (last_color === 1){
      last_color = 0;
    } else {
      last_color ++;
    }
    
  }
  
  //Set conditional formatting rule for player inputted completed trophies after individual formatting.
  var completed_row = page.getRange(last_row + 6, 1, 1, page.getMaxColumns());
  var completed_row_rule = SpreadsheetApp.newConditionalFormatRule().whenNumberGreaterThanOrEqualTo(0).setBackground('red').setRanges([completed_row]).build();
  page_rules.push(completed_row_rule);
  page.setConditionalFormatRules(page_rules);
  
  //Resize all columns
  page.autoResizeColumns(1, page.getMaxColumns());
  
}

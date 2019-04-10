function onOpen() {
  
  var ss = SpreadsheetApp.getActive();
  var menu = [
    {name : 'Update', functionName : 'updateSheets_'}
  ];
  
  ss.addMenu('MS2 Trophy Tracker', menu);
  
}

function formatCell_(cell, cell_color, cell_value) {
 
  cell.setBackground(cell_color);
  cell.setHorizontalAlignment('center');
  cell.setFontWeight('bold');
  cell.setFontFamily('Comfortaa');
  cell.setNumberFormat('@');
  cell.setValue(cell_value);
  cell.protect().setWarningOnly(true);
  
}

function updateSheets_() {
  
  var ss = SpreadsheetApp.getActive();
  var trophy_list = ss.getSheetByName('Trophy List');
  var ui = SpreadsheetApp.getUi();
  
  //Verify the spreadsheet.
  if (!trophy_list || trophy_list.getRange('B2').getValue() !== 'DO NOT EDIT THIS PAGE' || !ss.getSheetByName('Welcome') || !ss.getSheetByName('At a glance')) {
    
    ui.alert('Either the Trophy List page is missing or broken, or this has not been copied from the correct sheet. Please check the troubleshooting page at: https://github.com/an-ocelot/MS2-Trophy-Tracker/blob/master/README.md', ui.ButtonSet.OK);
    return;
    
  }
  
  // Collect the stored JSON data.
  for (i = 1; i < trophy_list.getRange('B1').getValue(); i++){
    
    //Variables needed for initial page setup
    var raw_data = trophy_list.getRange('A' + i).getValue();
    var data = JSON.parse(raw_data.toString());
    var page = ss.getSheetByName(data.name); 
    var last_row = 0;
    var last_column = 0;
    
    if (!page) {
      
      //Create Page and set default values and cells
      ss.insertSheet(data.name);
      page = ss.getSheetByName(data.name);
      
      //Freeze sidebar
      var sidebar = page.getRange(1, 1, page.getMaxRows(), 1);
      page.setFrozenColumns(1);
      
    } else {
      
      //Format by removing conditional formatting and removing protection.
      page.clearConditionalFormatRules();
      
      var protections = ss.getProtections(SpreadsheetApp.ProtectionType.RANGE);
      for (var j = 0; j < protections.length; j++) {
        var protection = protections[j];
        if (protection.canEdit()) protection.remove();
      }
      
    }
    
    //Change column offset
    last_column += 1;
    
    //Variables needed to create spreadsheet
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
    
    //Loop over categories
    for (category in data){          
      
      if (data[category].constructor !== Object) continue;
      
      //Unmerge to prevent an error from occurring
      var group_titles = page.getRange(last_row + 2, last_column + 1, 1, page.getMaxColumns());
      group_titles.merge();
      group_titles.setBackground('white');
      group_titles.breakApart();
      
      //Merge the top blank row
      var top_row = page.getRange(last_row + 1, last_column + 1, 1, page.getMaxColumns());
      top_row.merge();
      top_row.protect().setWarningOnly(true);
      top_row.setBackground(color[0]);
      
      //Sidebar
      var sidebar_blank = page.getRange(last_row + 1, 1);
      sidebar_blank.setBackground(color[0]);
      sidebar_blank.protect().setWarningOnly(true);
      
      //Sidebar type row
      var sidebar_type = page.getRange(last_row + 2, 1);
      formatCell_(sidebar_type, color[0], data[category].type);
      
      //Sidebar name row
      var sidebar_name = page.getRange(last_row + 3, 1);
      formatCell_(sidebar_name, color[0], data[category].name);
      
      //Sidebar description row
      var sidebar_desc = page.getRange(last_row + 4, 1);
      formatCell_(sidebar_desc, color[0], 'Description');
      
      //Sidebar amount row
      var sidebar_amnt = page.getRange(last_row + 5, 1);
      formatCell_(sidebar_amnt, color[0], 'Amount');
      
      //Sidebar completed row
      var sidebar_comp = page.getRange(last_row + 6, 1);
      formatCell_(sidebar_comp, color[0], 'Completed');
      
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
      
      //Recalculate row offset
      last_row += 6;
      
    }
    
    //Resize all columns
    page.autoResizeColumns(1, page.getMaxColumns());
    
  }
  
}

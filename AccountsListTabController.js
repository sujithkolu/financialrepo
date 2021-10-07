({
	onInit : function(component,event,helper){
       component.set("v.accountColumns",[
            {
                label : 'Account Name',
                fieldName: 'linkName',
                type: 'url',
                typeAttributes: { label: { fieldName: 'Name' },target: '_blank' } ,
                sortable : true
                
            },
            {
                label : 'Account Owner',
                fieldName : 'AccountOwner',
                type : 'text',
                sortable : true
            },
           {
                label : 'Phone',
                fieldName : 'Phone',
                type : 'Number',
                editable: true
                
            },
            {
                label : 'Website',
                fieldName : 'Website',
                type : 'Email',
                editable: true
               
            },
            {
                label : 'Annual Revenue',
                fieldName : 'AnnualRevenue',
                type : 'number',
                editable: true
                
            }
        ]);
        // call helper function to fetch account data from apex
        helper.getAccountData(component);
    },
    
    
    //Method gets called by onsort action,
    handleSort : function(component,event,helper){
        //Returns the field which has to be sorted
        var sortBy = event.getParam("fieldName");
        //returns the direction of sorting like asc or desc
        var sortDirection = event.getParam("sortDirection");
        //Set the sortBy and SortDirection attributes
        component.set("v.sortBy",sortBy);
        component.set("v.sortDirection",sortDirection);
        // call sortData helper function
        helper.sortData(component,sortBy,sortDirection);
    },
    
    doSearch: function(component,event,helper){
         var action = component.get("c.fetchAccount");
      	action.setParams({
            'srchVal': component.get("v.searchVal")
        });
        
        action.setCallback(this,function(response){
            console.log('test');
            var state = response.getState();
            if(state == "SUCCESS"){
                var accountlst = response.getReturnValue();
                console.log('accountlst'+JSON.stringify(accountlst));
                    //Setting data to be displayed in table
                    for (var i = 0; i < accountlst.length; i++) {
                    var row = accountlst[i];
                    // checking if any account related data in row
                    
                        console.log('Name@@@@' + row.Name);
                        row.AccountOwner = row.Owner.Name;
                    
                    // checking if any owner related data in row
                   
                } 
                
                 accountlst.forEach(function(item){
                    item['linkName'] = '/lightning/r/Account/' +item['Id'] +'/view';
                });
                    component.set("v.accountData",accountlst);
                   
                }
               
           
            
        });
        $A.enqueueAction(action);
        
    },
    
   handleSaveEdition: function (cmp, event, helper) {
        var draftValues = event.getParam('draftValues');
        console.log(draftValues);
        var action = cmp.get("c.updateAccount");      
       	action.setParams({"acc" : draftValues});
        action.setCallback(this, function(response) {
            var state = response.getState();
            $A.get('e.force:refreshView').fire();
            
        });
        $A.enqueueAction(action);
        
    },
    
})
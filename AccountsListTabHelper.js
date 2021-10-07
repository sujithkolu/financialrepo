({
	getAccountData : function(component){
        //Load the Account data from apex
        var action = component.get("c.getAccounts");
        var toastReference = $A.get("e.force:showToast");
        action.setCallback(this,function(response){
            var state = response.getState();
            if(state == "SUCCESS"){
               
                 var accountWrapper = response.getReturnValue();
                
                for (var i = 0; i < accountWrapper.accountsList.length; i++) {
                    var row = accountWrapper.accountsList[i];
                    // checking if any account related data in row
                   
                      
                        row.AccountOwner = row.Owner.Name;
                    
                    // checking if any owner related data in row
                   
                }
                if(accountWrapper.success){
                    
                    accountWrapper.accountsList.forEach(function(item){
                    item['linkName'] = '/lightning/r/Account/' +item['Id'] +'/view';
                });
                    //Setting data to be displayed in table
                    component.set("v.accountData",accountWrapper.accountsList);
                    toastReference.setParams({
                        "type" : "Success",
                        "title" : "Success",
                        "message" : accountWrapper.message,
                        "mode" : "dismissible"
                    });
                } // handel server side erroes, display error msg from response 
                else{
                    toastReference.setParams({
                        "type" : "Error",
                        "title" : "Error",
                        "message" : accountWrapper.message,
                        "mode" : "sticky"
                    }); 
                }
            } // handel callback error 
            else{
                toastReference.setParams({
                    "type" : "Error",
                    "title" : "Error",
                    "message" : 'An error occurred during initialization '+state,
                    "mode" : "sticky"
                });
            }
            toastReference.fire();
        });
        $A.enqueueAction(action);
    },
    
/*    sortData : function(component,fieldName,sortDirection){
        var data = component.get("v.accountData");
        //function to return the value stored in the field
        var key = function(a) { return a[fieldName]; }
        var reverse = sortDirection == 'asc' ? 1: -1;
        
        // to handel number/currency type fields 
        
            data.sort(function(a,b){ 
                var a = key(a) ? key(a).toLowerCase() : '';//To handle null values , uppercase records during sorting
                var b = key(b) ? key(b).toLowerCase() : '';
                return reverse * ((a>b) - (b>a));
            });    
        
        //set sorted data to accountData attribute
        component.set("v.accountData",data);
    } */
    
      sortData: function (cmp, fieldName, sortDirection) {
        var fname = fieldName;
        var data = cmp.get("v.accountData");
        var reverse = sortDirection !== 'asc';
        data.sort(this.sortBy(fieldName, reverse))
        cmp.set("v.accountData", data);
    },
    sortBy: function (field, reverse) {
        var key = function(x) {return x[field]};
        reverse = !reverse ? 1 : -1;
        return function (a, b) {
            return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
        }
    }
})
public class AccountsListController {

    // wrapper class 
    public class AccountWrapper{
        @AuraEnabled
        public String message;
        @AuraEnabled
        public List<Account> accountsList;
        @AuraEnabled
        public Boolean success;
    } 
    
    @AuraEnabled
    public static AccountWrapper getAccounts(){
        AccountWrapper accountWrapper = new AccountWrapper();
        try{
            accountWrapper.accountsList = [SELECT Id,Name,Owner.Name,Phone,Website,AnnualRevenue 
                                           FROM Account WHERE Industry ='Financial Services'
                                          ];
            accountWrapper.message = 'Account records are retrieved/refreshed ';
            accountWrapper.success = true;
        }
        catch(Exception e){
            accountWrapper.message = e.getMessage();
            accountWrapper.success = false;
        }
        return accountWrapper;
    }
    
    @AuraEnabled
    public static List<Account> fetchAccount(string srchVal){
       
         String searchKey =  srchVal + '%';
            List<Account> accList = [SELECT Id,Name,Owner.Name,Phone,Website,AnnualRevenue 
                                           FROM Account WHERE  Name LIKE: searchKey
                                          ];
            system.debug('accList'+accList);
        
        return accList;
    }
    
     @AuraEnabled
    public static void updateAccount(List<Account> acc ){
        update acc;
    }
}
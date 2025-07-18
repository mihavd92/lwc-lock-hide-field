public with sharing class PinUnlockController {
    private static final String ADMIN_PIN = '5555';

    @AuraEnabled
    public static String checkPinAndUnlock(String recordId, String inputPin) {
        PIN_Settings__c settings = PIN_Settings__c.getOrgDefaults();
        String correctUserPin = settings != null ? settings.UserPIN__c : null;

        if (inputPin == ADMIN_PIN) {
            return 'admin_success';
        }
        Contact con = [SELECT Id, IsPasswordCorrect__c FROM Contact WHERE Id = :recordId LIMIT 1];
        Boolean isCorrect = (inputPin != null && inputPin == correctUserPin);
        if (con.IsPasswordCorrect__c != isCorrect) {
            con.IsPasswordCorrect__c = isCorrect;
            update con;
        }
        return isCorrect ? 'user_success' : 'invalid';
    }

    @AuraEnabled
    public static void updateUserPin(String newPin) {
        PIN_Settings__c settings = PIN_Settings__c.getOrgDefaults();
        if (settings == null) {
            settings = new PIN_Settings__c();
        }
        settings.UserPIN__c = newPin;
        upsert settings;
    }

    @AuraEnabled(cacheable=true)
    public static Boolean getIsPasswordCorrect(Id recordId) {
        Contact con = [SELECT IsPasswordCorrect__c FROM Contact WHERE Id = :recordId LIMIT 1];
        return con.IsPasswordCorrect__c;
    }
}

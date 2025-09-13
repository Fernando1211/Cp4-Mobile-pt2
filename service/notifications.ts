import * as Notification from "expo-notifications"

Notification.setNotificationHandler({
    handleNotification:async()=>({
        shouldShowBanner:true,
        shouldShowList:true,
        shouldPlaySound:true, 
        shouldSetBadge:false 
    })
})
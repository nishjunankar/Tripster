let $friends_with_tuples := (
 for $user in doc ("project_data.xml")/tripster/user
     return <FRIENDS_WITH>
    {for $friend in $user/friend
        return
            <tuple>
                <FRIEND>{$user/login/text()}</FRIEND>
                <OTHER_FRIEND>{$friend/text()}</OTHER_FRIEND>
            </tuple>
    }
    </FRIENDS_WITH>)
    
let $trip_tuples := (
    for $tripster in doc ("project_data.xml")/tripster
    return <TRIP>{
        for $user in $tripster/user
        for $trip in $user/trip
        return
            <tuple>
                <T_ID>{$trip/id/text()}</T_ID>
                <LOCATION>{$trip/location/name/text()}</LOCATION>
                <CREATOR>{$user/login/text()}</CREATOR>
                <PRIVACY_FLAG>{if($trip/PRIVACY_FLAG/text()="private"
                              or $trip/PRIVACY_FLAG/text()=1) then 1
                              else 0}</PRIVACY_FLAG>
            </tuple>
    }
    </TRIP>)
    
let $comments_photo_tuples := (
for $tripster in doc ("project_data.xml")/tripster
    return <COMMENTS_PHOTO>{
    for $user in $tripster/user
    for $rateContent in $user/rateContent
    return <tuple>
        <U_ID>{$user/login/text()}</U_ID>
        <P_ID>{$rateContent/contentid/text()}</P_ID>
        <COMMENT_STRING>{$rateContent/comment/text()}</COMMENT_STRING>
    </tuple>
    }
    </COMMENTS_PHOTO>)
    
    
let $location_tuples := (
for $tripster in doc ("project_data.xml")/tripster
   return <LOCATION>{
for $user in $tripster/user
 for $location in $user/trip/location
    return
       <tuple>
           <LOC_NAME>{$location/name/text()}</LOC_NAME>
           <LOCATION_TYPE>{$location/type/text()}</LOCATION_TYPE>
       </tuple>}
    </LOCATION>)
    
return $comments_photo_tuples   

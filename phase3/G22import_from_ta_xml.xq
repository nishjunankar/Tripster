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
    
let $user_tuples := (
for $user in doc("project_data.xml")/tripster/user
return <tuple>
        <U_ID>{$user/login/text()}</U_ID>
        <PASSWORD_HASH>DEFAULT_PASSWORD</PASSWORD_HASH>
        <FIRST_NAME>{fn:substring-before($user/name," ")}</FIRST_NAME>
        <LAST_NAME>{fn:substring-after($user/name," ")}</LAST_NAME>
        <EMAIL>{$user/email/text()}</EMAIL>
        <AFFILIATION>{$user/affiliation/text()}</AFFILIATION>
        </tuple>
)

let $photo_tuples := (
for $user in doc("project_data.xml")/tripster/user
    for $album in $user/trip/album
    for $content in $album/content
    return
    <tuple>
        <P_ID>{$content/id/text()}</P_ID>
        <URL>{$content/url/text()}</URL>
        <PUBLISHED_BY>{$user/login/text()}</PUBLISHED_BY>
        <A_ID>{$album/id/text()}</A_ID>
    </tuple>
)

let $album_tuples := (
for $user in doc("project_data.xml")/tripster/user
    for $album in $user/trip/album
    return
    <tuple>
        <A_ID>{$album/id/text()}</A_ID>
        <NAME>{$album/name/text()}</NAME>
        <CREATOR>{$user/login/text()}</CREATOR>
        <PRIVACY_FLAG>{if ($album/privacyFlag/text() = "private" or $album/privacyFlag = "1") then 1 else 0}</PRIVACY_FLAG>
    </tuple>
)

let $invite_trip_tuples := (
for $user in doc("project_data.xml")/tripster/user
    for $request in $user/request
    return
    <tuple>
        <T_ID>{$request/tripid/text()}</T_ID>
        <INVITED_ID>{$request/friendid/text()}</INVITED_ID>
        <INVITED_BY>{$user/login/text()}</INVITED_BY>
        <ACCEPTED>{if ($request/status/text()="accepted") then 1 else 0}</ACCEPTED>
    </tuple>
      
)

let $album_share_trip_tuples := (
for $user in doc("project_data.xml")/tripster/user
    for $trip in $user/trip
    for $album in $trip/album
    return
    <tuple>
        <A_ID>{$album/id/text()}</A_ID>
        <T_ID>{$trip/id/text()}</T_ID>
    </tuple>
)

let $user_interest_tuples := (
for $user in doc("project_data.xml")/tripster/user
    for $interest in tokenize($user/interests/text(), ',')
    return
    <tuple> 
        <I_ID>{$interest}</I_ID>
        <U_ID>{$user/login/text()}</U_ID>
    </tuple>
)

return 
<database>
    <USERS>{$user_tuples}</USERS>
    {$friends_with_tuples}
    <PHOTO>{$photo_tuples}</PHOTO>
    {$trip_tuples}
    {$location_tuples}
    <ALBUM>{$album_tuples}</ALBUM>
    <INVITE_TRIP>{$invite_trip_tuples}</INVITE_TRIP>
    <ALBUM_SHARE_TRIP>{$album_share_trip_tuples}</ALBUM_SHARE_TRIP>
    <USER_INTEREST>{$user_interest_tuples}</USER_INTEREST>
    {$comments_photo_tuples}
</database>

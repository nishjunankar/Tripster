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
    return
    <tuple> 
        <I_ID>{$user/interests/text()}</I_ID>
        <U_ID>{$user/login/text()}</U_ID>
    </tuple>
)

return $user_interest_tuples


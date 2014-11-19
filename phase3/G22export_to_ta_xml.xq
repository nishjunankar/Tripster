xquery version "1.0";
<tripster xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
xsi:noNamespaceSchemaLocation="ta_tripster.xsd">
<operator>Val Tannen</operator>
<web_url>www.valtannen.com</web_url>
{
for $db in doc ("G22_export.xml")/database
    for $userTuple in doc ("G22_export.xml")/database/USERS/tuple
        return
        <user>
          <login>{$userTuple/U_ID/text()}</login>
          <email>{$userTuple/EMAIL/text()}</email>
          <name>{concat($userTuple/FIRST_NAME/text(), " ", $userTuple/LAST_NAME/text())}</name>
          <affiliation>{$userTuple/AFFILIATION/text()}</affiliation>
          {for $uiTuple in $db/USER_INTEREST/tuple
            where $uiTuple/U_ID/text() = $userTuple/U_ID/text()
            return <interests> {$uiTuple/I_ID/text()} </interests>}
          {for $fwTuple in $db/FRIENDS_WITH/tuple
            where $fwTuple/FRIEND/text() = $userTuple/U_ID/text()
            return <friend> {$fwTuple/OTHER_FRIEND/text()} </friend>}
           {for $tripTuple in $db/TRIP/tuple
            where $tripTuple/CREATOR/text() = $userTuple/U_ID/text()
            return 
            <trip> 
                <id>{$tripTuple/T_ID/text()} </id>
                <name>{$tripTuple/NAME/text()}</name>
                <feature>{"mountain"}</feature>
                {if ($tripTuple/PRIVACY_FLAG/text() = "0")
                then <privacyFlag>{"public"}</privacyFlag>
                else if ($tripTuple/PRIVACY_FLAG/text() = "1")
                then <privacyFlag>{"private"}</privacyFlag>
                else <privacyFlag>{"sharedWithTripMemebers"}</privacyFlag>}
                {for $albumTuple in $db/ALBUM/tuple
                 where $albumTuple/CREATOR/text() = $userTuple/U_ID/text()
                return <album> 
                    <id> {$albumTuple/A_ID/text()}</id>
                    <name> {$albumTuple/NAME/text()}</name>
                    {if ($albumTuple/PRIVACY_FLAG/text() = "0")
                    then <privacyFlag>{"public"}</privacyFlag>
                    else if ($albumTuple/PRIVACY_FLAG/text() = "1")
                    then <privacyFlag>{"private"}</privacyFlag>
                    else <privacyFlag>{"sharedWithTripMemebers"}</privacyFlag>}
                    {for $photoTuple in $db/PHOTO/tuple
                    where $photoTuple/A_ID/text() = $albumTuple/A_ID/text()
                    return <content> 
                    <id>{$photoTuple/P_ID/text()}</id>
                    <source>{"G22"}</source>
                    <type>{"photo"}</type>
                    <url>{$photoTuple/URL/text()}</url>
                    </content>}
                </album>}
                {for $LocationTuple in $db/LOCATION/tuple
                   let $tripLocationID := $tripTuple/LOCATION/text()
                   where ($tripLocationID = $LocationTuple/L_ID/text())
                   return <location>
                        <name>{$LocationTuple/LOC_NAME/text()}</name>
                        <type>{$LocationTuple/LOCATION_TYPE/text()}</type>
                </location>}
             </trip>}
          {for $rlTuple in $db/RATE_LOCATION/tuple
          for $tripTuple in $db/TRIP/tuple
            where $tripTuple/LOCATION/text() = $rlTuple/L_ID 
                and $rlTuple/U_ID/text() = $userTuple/U_ID/text()
            return <rateTrip>
            <tripid>{$tripTuple/T_ID/text()}</tripid>
            <score>{$rlTuple/RATING/text()}</score>
            <comment>{"awesome"}</comment>
          </rateTrip>}
          {for $itTuple in $db/INVITE_TRIP/tuple
          where $itTuple/INVITED_BY/text() = "0" and $itTuple/INVITED_USERS/text() = $userTuple/U_ID/text()
          return <request>
            <invited_by>{$itTuple/INVITED_BY/text()}</invited_by>
            <tripid>{$itTuple/T_ID/text()}</tripid>
            {if ($itTuple/ACCEPTED/text() = "0")
             then <status>{"pending"}</status>
             else if ($itTuple/ACCEPTED/text() = "1")
             then <status>{"accepted"}</status>
             else <status>{"denied"}</status> }
            </request>}
           {for $itTuple in $db/INVITE_TRIP/tuple
          where $itTuple/INVITED_BY/text() = $userTuple/U_ID/text()
          return <invite>
            <tripid>{$itTuple/T_ID/text()}</tripid>
            <friendid>{$itTuple/INVITED_USERS/text()}</friendid>
            {if ($itTuple/ACCEPTED/text() = "0")
             then <status>{"pending"}</status>
             else if ($itTuple/ACCEPTED/text() = "1")
             then <status>{"accepted"}</status>
             else <status>{"denied"}</status> }
            </invite>}
            {for $cpTuple in $db/COMMENTS_PHOTO/tuple
          where $cpTuple/U_ID/text() = $userTuple/U_ID/text()
          return <rateContent>
            <contentid>{$cpTuple/P_ID/text()}</contentid>
            <contentSource>{"G22"}</contentSource>
            <score>5</score>
            <comment>{$cpTuple/COMMENT_STRING/text()}</comment>
            </rateContent>}
    </user>
} </tripster> 

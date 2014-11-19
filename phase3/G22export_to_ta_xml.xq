xquery version "1.0";
(: THIS CASE HANDLES LOCATIONS
for $tuple in doc ("G22_export.xml")/database/LOCATION/tuple
return
    <locationType>
        <name>{$tuple/LOC_NAME/text()}</name>
        <type>{$tuple/LOCATION_TYPE/text()}</type>
    </locationType>:)
    
    (: THIS CASE HANDLES USERS FIX Interests through dream
for $userTuple in doc ("G22_export.xml")/database/USERS/tuple
return
    <userType>
        <login>{$userTuple/U_ID/text()}</login>
        <email>{$userTuple/EMAIL/text()}</email>
        <name>{concat($userTuple/FIRST_NAME/text(), ' ', $userTuple/LAST_NAME/text())}</name>
        <affiliation>{$userTuple/AFFILIATION/text()}</affiliation>
    </userType>:)
    
    
    (: THIS HANDLES ALBUMS FIX PrivacyFlag & content
for $albumTuple in doc ("G22_export.xml")/database/ALBUM/tuple
return
    <albumType>
        <id>{$albumTuple/A_ID/text()}</id>
        <name>{$albumTuple/NAME/text()}</name>
    </albumType>:)
    
    
    (: THIS HANDLES PHOTOS (contentTypes) FIX type
for $photoTuple in doc ("G22_export.xml")/database/PHOTO/tuple
return
    <contentType>
        <id>{$photoTuple/P_ID/text()}</id>
        <source>{'G22'}</source>
        <url>{$photoTuple/URL/text()}</url>
    </contentType> :)
    
(:   THIS CASE HANDLES TRIPS FIX Name, PrivacyFlag, Feature, Album, Invite
for $tuple in doc ("G22_export.xml")/database/TRIP/tuple
return
    <tripType>
        <id>{$tuple/T_ID/text()}</id>
        <location>{for $LocationTuple in doc ("G22_export.xml")/database/LOCATION/tuple
                   let $tripLocationID := $tuple/LOCATION/text()
                   where ($tripLocationID = $LocationTuple/L_ID/text())
                   return 
                        <locationType>
                            <name>{$LocationTuple/LOC_NAME/text()}</name>
                            <type>{$LocationTuple/LOCATION_TYPE/text()}</type>
                        </locationType>}</location>
                        </tripType>:)

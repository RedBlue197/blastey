def create_trip_dynamic_link(link: str, trip_id: uuid.UUID, social_title: str, social_description: str, social_image_link: str):
    settings = get_settings()  # Fetch the current settings
    
    url = f"https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key={settings.FIREBASE_API_KEY}"
    
    # Append trip_id to the link
    full_link = f"{link}?trip_id={trip_id}"
    
    payload = {
        "dynamicLinkInfo": {
            "domainUriPrefix": settings.DOMAIN_URI_PREFIX,
            "link": full_link,
            "androidInfo": {
                "androidPackageName": settings.ANDROID_PACKAGE_NAME,
            },
            "iosInfo": {
                "iosBundleId": settings.IOS_BUNDLE_ID,
                "iosFallbackLink": settings.IOS_FALLBACK_LINK,
            },
            "socialMetaTagInfo": {
                "socialTitle": social_title,
                "socialDescription": social_description,
                "socialImageLink": social_image_link,
            }
        },
        "suffix": {
            "option": "SHORT"  # or "UNGUESSABLE"
        }
    }

    headers = {
        'Content-Type': 'application/json',
    }

    response = requests.post(url, headers=headers, data=json.dumps(payload))

    if response.status_code == 200:
        return response.json()['shortLink']
    else:
        raise Exception(f"Error creating dynamic link: {response.text}")

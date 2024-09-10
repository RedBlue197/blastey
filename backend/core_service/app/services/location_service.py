from geopy.geocoders import Nominatim

def get_location_details(lat, lon):
    # Initialize the geolocator and translator
    geolocator = Nominatim(user_agent="Blastey")
    
    # Get location details
    location = geolocator.reverse(lat+","+ lon)
    
    if not location:
        return None, None
    
    # Extract city and country
    address = location.raw.get('address', {})
    city = address.get('city') or address.get('town') or address.get('village')
    country = address.get('country')
    
    if not city or not country:
        return None, None
    
    return country, city

# # Example usage
# lat = "34.0140605"
# lon = "-4.986517"
# country, city_ar = get_location_details(lat, lon)
# print(f"Country: {country}, City in Arabic: {city_ar}")



export const endpoints= {
    "auth" :
    {
        GET_TOKEN : '/token'
    },
    "trips" :
    {   
        GET:{
            GET_TRIPS : '/trips/',
            GET_TRIP_BY_ID : '/trips/',
            GET_TRIPS_BY_HOST_ID : '/trips/by-host-id/',
        },
        CREATE : {
            CREATE_TRIP:'/trips/create-trip',
            CREATE_TRIP_ITEMS:'/trips/create-trip-items',
            CREATE_TRIP_OPENINGS:'/trips/create-trip-openings',
            CREATE_TRIP_IMAGES:'/trips/create-trip-images',
        }
    },
    
}
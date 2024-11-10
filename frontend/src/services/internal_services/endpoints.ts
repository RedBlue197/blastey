export const endpoints= {
    "auth" :{
        GET:{
            GET_TOKEN : '/token'
        }
    },
    "trips" :{   
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
            CREATE_TRIP_SEARCH:'/trips/create-trip-search',
        },
        UPDATE :{
            UPDATE_TRIP:'/trips/update-trip',
            UPDATE_TRIP_ITEMS:'/trips/update-trip-items',
            UPDATE_TRIP_OPENINGS:'/trips/update-trip-openings',
            UPDATE_TRIP_IMAGES:'/trips/update-trip-images',
        }
    },
    "users":{
        CREATE:{
            CREATE_USER:'/users/create-user'
        },
        UPDATE:{
            UPDATE_USER_EMAIL_VERIFICATION_STATUS:'/users/update-user-email-verification-status'
        },
    }
    
}
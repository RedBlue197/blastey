export const endpoints= {
    "anonymous" :{
        "auth": {
            POST:{
                POST_USER_LOGIN_REQUEST : '/anonymous/auth/login'
            }
        },
        "trips":{
            POST :{
                POST_SEARCH_TRIPS : '/anonymous/trips/create-trip-search'
            }
        }
    },
    "professional" :{
        "auth": {
            POST:{
                POST_USER_LOGIN_REQUEST : '/professional/auth/login'
            }
        },
        "trips":{
            POST :{
                POST_TRIP:'/professional/trips/create-trip',
                POST_TRIP_ITEMS:'/professional/trips/create-trip-items',
                POST_TRIP_OPENINGS:'/professional/trips/create-trip-openings',
                POST_TRIP_IMAGES:'/professional/trips/create-trip-images',
                POST_SEARCH_TRIPS : '/professional/trips/create-trip-search'
            }
        }
    },
    "auth" :{
        GET:{
            GET_TOKEN : '/token'
        }
    },
    "trips" :{   
        GET:{
            GET_TRIPS : '/trips/',
            GET_TRIP_BY_ID : '/trips/by-trip-id/',
            GET_TRIPS_BY_HOST_ID : '/trips/by-host-id/',
            GET_TRIPS_BY_CITY_NAME : '/trips/by-city-name',
        },
        CREATE : {
            CREATE_TRIP:'/trips/create-trip',
            CREATE_TRIP_ITEMS:'/trips/create-trip-items',
            CREATE_TRIP_OPENINGS:'/trips/create-trip-openings',
            CREATE_TRIP_IMAGES:'/trips/create-trip-images',
            CREATE_TRIP_SEARCH:'/create-trip-search',
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
    },
    "newsletters":{
        CREATE:{
            CREATE_NEWSLETTER:'/newsletters/create-newsletter-email'
        }
    }
    
}
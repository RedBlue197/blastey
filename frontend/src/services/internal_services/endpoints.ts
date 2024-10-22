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
            CREATE_TRIP:'/trips/create-trip'
        }
    },
    
}
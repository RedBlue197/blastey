import uuid
from fastapi import HTTPException, UploadFile
from google.cloud import storage
from typing import List
from config import settings  # Adjust the import as necessary
import uuid

def post_trip_images_on_gcs(trip_id: uuid.UUID, files: List[UploadFile]):
    bucket_name = settings.BUCKET_NAME
    service_account_json = settings.SERVICE_ACCOUNT_JSON
    uploaded_images = []

    for file in files:
        if file.content_type.lower() not in ["image/jpeg", "image/png"]:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Only images are allowed")

        try:
            # Initialize a storage client
            client = storage.Client.from_service_account_json(service_account_json)

            # Get the bucket from GCS
            bucket = client.bucket(bucket_name)

            # Check if the bucket exists
            if not bucket.exists():
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Bucket {bucket_name} not found")

            # Generate a UUID for the image
            image_uuid = str(uuid.uuid4())
            blob_name = f"trip_images/{trip_id}/{image_uuid}.jpg"  # Use .jpg or .png as needed
            blob = bucket.blob(blob_name)

            # Upload the file to GCS
            blob.upload_from_file(file.file, content_type=file.content_type)

            # Get the public URL for the uploaded file
            public_url = blob.public_url

            # Collect the UUID and URL
            uploaded_images.append({"uuid": image_uuid, "public_url": public_url})

        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    return uploaded_images  # Return the list of uploaded images with UUIDs and URLs

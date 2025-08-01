from django.contrib.auth import get_user_model
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from appointment import serializers
from django.core.exceptions import ImproperlyConfigured
from rest_framework import status
from appointment.models import Appointment, Record, RecordImage
from knox.auth import TokenAuthentication
from collections import defaultdict
from pytz import timezone
import datetime
from django.core.mail import EmailMessage
import requests
import json
from django.conf import settings # To access GEMINI_API_KEY from settings.py
from rest_framework import status
from rest_framework.response import Response
from rest_framework import viewsets # For ViewSet example
from rest_framework.decorators import action # For custom actions in ViewSet

User = get_user_model()


class AppointmentViewSet(viewsets.GenericViewSet):
    """this viewset is for doing stuff about or related to Appointment"""

    queryset = User.objects.all()

    permission_classes = [
        AllowAny,
    ]

    serializer_class = serializers.EmptySerializer
    serializer_classes = {
        "make_appointment": serializers.AppointmentSerializer,
    }

    @action(
        methods=[
            "POST",
        ],
        detail=False,
        permission_classes=[
            IsAuthenticated,
        ],
        authentication_classes=[
            TokenAuthentication,
        ],
    )
    def make_appointment(self, request):
        """make Appointment"""
        data = request.data
        data["user"] = (
            request.user.pk
        )  # get the user's pk to make Appointment instance.
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        app = serializer.save()
        return Response(data={"appointment_id": app.pk}, status=status.HTTP_201_CREATED)

    @action(
        methods=[
            "GET",
        ],
        detail=False,
        permission_classes=[
            IsAuthenticated,
        ],
        authentication_classes=[
            TokenAuthentication,
        ],
    )
    def get_user_appointments(self, request):
        """get user done and schedueled appointments"""
        data = defaultdict(list)
        now = datetime.datetime.now(tz=timezone("Asia/Damascus"))
        appointments = Appointment.objects.filter(user=request.user).order_by(
            "chosen_date"
        )
        serializer = serializers.AppointmentSerializer(appointments, many=True)
        for appointment in serializer.data:
            print(appointment["chosen_date"])
            date = str(appointment["chosen_date"]).split("T")[
                0
            ]  # Extract the date part
            time = str(appointment["chosen_date"]).split("T")[
                1
            ]  # .split("+")[0]  # Extract the time part
            appointment["time"] = time
            del appointment["chosen_date"]
            data[date].append(appointment)

        data = dict(data)
        return Response(data=data, status=status.HTTP_200_OK)
    @action(
        methods=[
            "GET",
        ],
        detail=False,
        permission_classes=[
            IsAuthenticated,
        ],
        authentication_classes=[
            TokenAuthentication,
        ],
    )
    def get_unavailable_dates(self, request):
        """get the unavailable dates so that you can exceclude them in the frontend app"""
        data = defaultdict(list)
        now = datetime.datetime.now(tz=timezone("Asia/Damascus"))
        appointments = Appointment.objects.filter(chosen_date__gte=now)
        serializer = serializers.AppointmentSerializer(appointments, many=True)
        for appointment in serializer.data:
            print(appointment["chosen_date"])
            date = str(appointment["chosen_date"]).split("T")[
                0
            ]  # Extract the date part
            time = str(appointment["chosen_date"]).split("T")[
                1
            ]  # .split("+")[0]  # Extract the time part
            data[date].append(time)
        data = dict(data)
        return Response(data=data, status=status.HTTP_200_OK)

    @action(
        methods=[
            "GET",
        ],
        detail=False,
        permission_classes=[
            IsAuthenticated,
        ],
        authentication_classes=[
            TokenAuthentication,
        ],
    )
    def list_appointments(self, request):
        data = defaultdict(list)
        now = datetime.datetime.now(tz=timezone("Asia/Damascus"))
        appointments = Appointment.objects.filter(chosen_date__gte=now).order_by(
            "chosen_date"
        )
        serializer = serializers.AppointmentSerializer(appointments, many=True)
        for appointment in serializer.data:
            print(appointment["chosen_date"])
            date = str(appointment["chosen_date"]).split("T")[
                0
            ]  # Extract the date part
            time = str(appointment["chosen_date"]).split("T")[
                1
            ]  # .split("+")[0]  # Extract the time part
            appointment["time"] = time
            del appointment["chosen_date"]
            data[date].append(appointment)

        data = dict(data)
        return Response(data=data, status=status.HTTP_200_OK)

    @action(
        methods=[
            "DELETE",
        ],
        detail=False,
        permission_classes=[
            IsAuthenticated,
        ],
        authentication_classes=[
            TokenAuthentication,
        ],
    )
    def delete(self, request):
        delete_it = Appointment.objects.get(pk=request.query_params.get("id"))
        if request.user.is_staff:
            patient = delete_it.user
            user_name = patient.first_name + " " + patient.last_name
            date = delete_it.chosen_date
            subject = "your appointment has been canceled!"
            message = f"Dear {user_name},\nI hope this message finds you well. I am writing to express my sincerest apologies for the inconvenience caused by the cancellation of your dental appointment scheduled for [{date}]. \nRegrettably, unforeseen circumstances have arisen that necessitate the rescheduling of appointments. While we always strive to maintain our schedule, occasionally, situations beyond our control arise, and we must adjust accordingly."
            email = EmailMessage(subject, message, to=[patient.email])
            email.send()
        delete_it.delete()
        return Response({"message": "Deleted"}, status=status.HTTP_200_OK)

    @action(
        methods=[
            "POST",
        ],
        detail=False,
        permission_classes=[
            IsAuthenticated,
        ],
        authentication_classes=[
            TokenAuthentication,
        ],
    )
    def record(self, request):
        """
        Takes notes about the examination and saves appointment records,
        including X-ray images. It also sends X-ray images to the Gemini API
        for analysis and stores the analysis.

        Expected request.data format for this endpoint:
        {
            "appointment": <appointment_id>, # The ID of the appointment this record belongs to
            "notes": "Some notes about the examination.",
            "images": [
                {
                    "mime_type": "image/jpeg",
                    "encoded_data": "base64_encoded_image_string_without_prefix"
                },
                {
                    "mime_type": "image/png",
                    "encoded_data": "base64_encoded_image_string_without_prefix"
                }
            ]
        }
        """
        # --- Permission Check ---
        # Only allow staff users to create records
        if not request.user.is_staff:
            print(request.user.is_staff) # For debugging: will print False
            return Response(
                data={"message": "You are not allowed to perform this operation."},
                status=status.HTTP_403_FORBIDDEN, # Use 403 Forbidden for permission issues
            )

        # --- Record Creation ---
        # Validate and save the main record (e.g., examination notes)
        # The RecordSerializer expects an 'appointment' ID in the data.
        rec_serializer = serializers.RecordSerializer(data=request.data)
        rec_serializer.is_valid(raise_exception=True) # Raise exception if validation fails
        record = rec_serializer.save() # Save the record instance to the database

        # --- Image Processing and Gemini Analysis ---
        images_data = request.data.get("images", []) # Get the list of images, default to empty list
        saved_image_data = [] # To store serialized data of saved images for the response
        gemini_api_key = settings.GEMINI_API_KEY # Retrieve API key from Django settings

        # Check if Gemini API key is configured. If not, analysis will be skipped.
        if not gemini_api_key:
            print("WARNING: Gemini API key is not configured in settings.py. Image analysis will be skipped.")
            # You might choose to return an error here if image analysis is mandatory:
            # return Response(
            #     {"message": "Gemini API key not configured, cannot analyze images."},
            #     status=status.HTTP_503_SERVICE_UNAVAILABLE
            # )

        for image_item in images_data:
            encoded_data = image_item.get("encoded_data")
            mime_type = image_item.get("mime_type")

            # Validate essential image data presence
            if not encoded_data or not mime_type:
                print(f"Skipping malformed image data: {image_item}")
                continue # Move to the next image if data is incomplete

            # Strip potential data URI prefix (e.g., "data:image/jpeg;base64,")
            # This is common when base64 data comes from web frontends.
            if "," in encoded_data:
                encoded_data = encoded_data.split(",", 1)[1]

            gemini_analysis_text = None # Initialize analysis text for the current image

            # Only attempt Gemini API call if the API key is valid
            if gemini_api_key:
                # Construct the payload for the Gemini API request
                gemini_payload = {
                    "contents": [
                        {
                            "role": "user",
                            "parts": [
                                { "text": "As a dentist, provide a concise, 2-line accurate description and analysis of this dental X-ray image, focusing on any significant findings like bone loss, decay, or restorations." },
                                {
                                    "inlineData": {
                                        "mimeType": mime_type,
                                        "data": encoded_data # The raw base64 string
                                    }
                                }
                            ]
                        }
                    ]
                }

                # Gemini API endpoint URL
                gemini_url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={gemini_api_key}"

                try:
                    # Make the POST request to the Gemini API
                    response = requests.post(
                        gemini_url,
                        headers={"Content-Type": "application/json"},
                        json=gemini_payload,
                        timeout=30 # Set a timeout for the API request (e.g., 30 seconds)
                    )
                    response.raise_for_status() # Raise an HTTPError for bad responses (4xx or 5xx)
                    gemini_result = response.json() # Parse the JSON response from Gemini

                    # Extract the analysis text from the Gemini response structure
                    if gemini_result and gemini_result.get("candidates") and len(gemini_result["candidates"]) > 0 and \
                        gemini_result["candidates"][0].get("content") and \
                        gemini_result["candidates"][0]["content"].get("parts") and \
                        len(gemini_result["candidates"][0]["content"]["parts"]) > 0:
                        gemini_analysis_text = gemini_result["candidates"][0]["content"]["parts"][0].get("text")
                        print(f"Gemini Analysis for image (Record ID: {record.pk}): {gemini_analysis_text[:100]}...") # Log first 100 chars
                    else:
                        print(f"Gemini API response structure unexpected for image (Record ID: {record.pk}): {gemini_result}")
                        gemini_analysis_text = "Analysis could not be retrieved due to unexpected API response structure."

                except requests.exceptions.Timeout:
                    print(f"Gemini API request timed out for image (Record ID: {record.pk}).")
                    gemini_analysis_text = "Image analysis timed out."
                except requests.exceptions.RequestException as e:
                    print(f"Error calling Gemini API for image (Record ID: {record.pk}): {e}")
                    gemini_analysis_text = f"Error during image analysis: {e}"
                except json.JSONDecodeError as e:
                    print(f"Error decoding Gemini API response for image (Record ID: {record.pk}): {e}")
                    gemini_analysis_text = f"Error decoding API response: {e}"
                except Exception as e:
                    print(f"An unexpected error occurred during Gemini analysis for image (Record ID: {record.pk}): {e}")
                    gemini_analysis_text = f"An unexpected error occurred during analysis: {e}"

            # --- Image Saving ---
            # Prepare data for the Image serializer, including the Gemini analysis
            image_data_for_serializer = {
                "mime_type": mime_type,
                "image": image_item["encoded_data"], # Store the original encoded data in your database
                "record": record.pk, # Link to the newly created record
                "gemini_analysis": gemini_analysis_text, # Store the analysis text
            }

            # Validate and save the image instance
            image_serializer = serializers.ImageSerializer(data=image_data_for_serializer)
            image_serializer.is_valid(raise_exception=True) # Raise exception if validation fails
            saved_image_instance = image_serializer.save() # Save the image to the database

            # Serialize the saved image instance to include its ID and analysis for the response
            saved_image_data.append(serializers.ImageSerializer(saved_image_instance).data)

        # --- Final Response ---
        return Response(
            {
                "record": serializers.RecordSerializer(record).data, # Serialize the saved record for the response
                "images": saved_image_data, # List of serialized saved images with analysis
                "message": "Record and images saved successfully. Image analysis attempted.",
                "status": status.HTTP_200_OK,
            },
            status=status.HTTP_200_OK
        )

    @action(
        methods=[
            "GET",
        ],
        detail=False,
        permission_classes=[
            IsAuthenticated,
        ],
        authentication_classes=[
            TokenAuthentication,
        ],
    )
    def get_record(self, request):
        "Get the record of an appointment"
        pk = request.query_params.get("appointment_id", "")
        data = {}
        try:
            record = Record.objects.get(appointment=pk)
            rec_serializer = serializers.RecordSerializer(record)
            data["record"] = rec_serializer.data
        except Record.DoesNotExist:
            data["record"] = "None"


        images = RecordImage.objects.filter(record=record)
        im_serializer = serializers.ImageSerializer(images, many=True)
        data["images"] = im_serializer.data
        return Response(data, status=status.HTTP_200_OK)

    def get_serializer_class(self):
        if not isinstance(self.serializer_classes, dict):
            raise ImproperlyConfigured("Serializer classes must be a dictionary")

        if self.action in self.serializer_classes.keys():
            return self.serializer_classes[self.action]

        return super().get_serializer_class()

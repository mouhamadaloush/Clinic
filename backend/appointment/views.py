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
from django.conf import settings
from django.shortcuts import get_object_or_404

User = get_user_model()


class AppointmentViewSet(viewsets.GenericViewSet):
    """
    A ViewSet for handling appointment and record-related actions.

    This ViewSet provides functionalities for users to book appointments,
    view their schedules, and for staff to manage appointments and patient records.
    """

    queryset = User.objects.all()
    permission_classes = [AllowAny]
    serializer_class = serializers.EmptySerializer
    serializer_classes = {
        "make_appointment": serializers.AppointmentSerializer,
    }

    def _group_appointments_by_date(self, appointments):
        """
        Group appointments by date.

        This method takes a queryset of appointments and groups them into a dictionary
        where keys are dates and values are lists of appointments for that date.

        Parameters:
        - appointments: A queryset of Appointment objects.

        Returns:
        - A dictionary of appointments grouped by date.
        """
        serializer = serializers.AppointmentSerializer(appointments, many=True)
        grouped_data = defaultdict(list)
        for appointment in serializer.data:
            date_str = appointment["chosen_date"]
            date = date_str.split("T")[0]
            time = date_str.split("T")[1]
            appointment["time"] = time
            del appointment["chosen_date"]
            grouped_data[date].append(appointment)
        return dict(grouped_data)

    def _get_gemini_analysis(self, encoded_data, mime_type, record_pk):
        """
        Get image analysis from Gemini API.

        This method sends an encoded image to the Gemini API for analysis and returns
        the analysis text.

        Parameters:
        - encoded_data: Base64-encoded image data.
        - mime_type: The MIME type of the image.
        - record_pk: The primary key of the record associated with the image.

        Returns:
        - A string containing the analysis from Gemini or an error message.
        """
        gemini_api_key = settings.GEMINI_API_KEY
        if not gemini_api_key:
            print("WARNING: Gemini API key is not configured. Skipping analysis.")
            return "Image analysis skipped: API key not configured."

        gemini_payload = {
            "contents": [{
                "role": "user",
                "parts": [
                    {"text": "As a dentist, provide a concise, 2-line accurate description and analysis of this dental X-ray image, focusing on any significant findings like bone loss, decay, or restorations."},
                    {"inlineData": {"mimeType": mime_type, "data": encoded_data}}
                ]
            }]
        }
        gemini_url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={gemini_api_key}"

        try:
            response = requests.post(gemini_url, headers={"Content-Type": "application/json"}, json=gemini_payload, timeout=30)
            response.raise_for_status()
            result = response.json()
            return result.get("candidates", [{}])[0].get("content", {}).get("parts", [{}])[0].get("text", "Analysis not available.")
        except requests.exceptions.RequestException as e:
            print(f"Error calling Gemini API for Record ID {record_pk}: {e}")
            return f"Error during image analysis: {e}"
        except (KeyError, IndexError) as e:
            print(f"Unexpected Gemini API response structure for Record ID {record_pk}: {e}")
            return "Could not parse analysis from API response."

    def _process_and_save_image(self, image_item, record):
        """
        Process and save an image.

        This method processes a single image, sends it for analysis, and saves it
        to the database.

        Parameters:
        - image_item: A dictionary containing the encoded image data and MIME type.
        - record: The Record object to associate the image with.

        Returns:
        - The saved RecordImage object or None if processing fails.
        """
        encoded_data = image_item.get("encoded_data")
        mime_type = image_item.get("mime_type")

        if not encoded_data or not mime_type:
            return None

        if "," in encoded_data:
            encoded_data = encoded_data.split(",", 1)[1]

        gemini_analysis_text = self._get_gemini_analysis(encoded_data, mime_type, record.pk)

        image_data = {
            "mime_type": mime_type,
            "image": encoded_data,
            "record": record.pk,
            "gemini_analysis": gemini_analysis_text,
        }

        image_serializer = serializers.ImageSerializer(data=image_data)
        image_serializer.is_valid(raise_exception=True)
        return image_serializer.save()

    @action(methods=["POST"], detail=False, permission_classes=[IsAuthenticated], authentication_classes=[TokenAuthentication])
    def make_appointment(self, request):
        """
        Make a new appointment.

        This endpoint allows an authenticated user to create a new appointment.

        Permissions:
        - User must be authenticated.

        Request Body:
        {
            "chosen_date": "YYYY-MM-DDTHH:MM:SSZ",
            "reason_of_appointment": "string"
        }
        """
        data = request.data
        data["user"] = request.user.pk
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        appointment = serializer.save()
        return Response({"appointment_id": appointment.pk}, status=status.HTTP_201_CREATED)

    @action(methods=["GET"], detail=False, permission_classes=[IsAuthenticated], authentication_classes=[TokenAuthentication])
    def get_user_appointments(self, request):
        """
        Get user's appointments.

        This endpoint retrieves all appointments for the currently authenticated user,
        grouped by date.

        Permissions:
        - User must be authenticated.
        """
        appointments = Appointment.objects.filter(user=request.user).order_by("chosen_date")
        grouped_data = self._group_appointments_by_date(appointments)
        return Response(data=grouped_data)

    @action(methods=["GET"], detail=False, permission_classes=[IsAuthenticated], authentication_classes=[TokenAuthentication])
    def get_unavailable_dates(self, request):
        """
        Get unavailable appointment dates.

        This endpoint retrieves a list of all upcoming appointment times that are
        already booked, helping users to choose a vacant slot.

        Permissions:
        - User must be authenticated.
        """
        now = datetime.datetime.now(tz=timezone("Asia/Damascus"))
        appointments = Appointment.objects.filter(chosen_date__gte=now)
        serializer = serializers.AppointmentSerializer(appointments, many=True)
        
        data = defaultdict(list)
        for appointment in serializer.data:
            date_str = appointment["chosen_date"]
            date = date_str.split("T")[0]
            time = date_str.split("T")[1]
            data[date].append(time)
            
        return Response(data=dict(data))

    @action(methods=["GET"], detail=False, permission_classes=[IsAuthenticated], authentication_classes=[TokenAuthentication])
    def list_appointments(self, request):
        """
        List all upcoming appointments.

        This endpoint retrieves a list of all upcoming appointments, grouped by date.
        It is intended for staff members to view the schedule.

        Permissions:
        - User must be authenticated and staff.
        """
        now = datetime.datetime.now(tz=timezone("Asia/Damascus"))
        appointments = Appointment.objects.filter(chosen_date__gte=now).order_by("chosen_date")
        grouped_data = self._group_appointments_by_date(appointments)
        return Response(data=grouped_data)

    @action(methods=["DELETE"], detail=False, permission_classes=[IsAuthenticated], authentication_classes=[TokenAuthentication])
    def delete(self, request):
        """
        Delete an appointment by ID.

        This endpoint deletes an appointment by its ID. If the user is a staff member,
        an email notification is sent to the patient about the cancellation.

        Permissions:
        - User must be authenticated.

        Query Parameters:
        - id: The ID of the appointment to delete.
        """
        appointment = get_object_or_404(Appointment, pk=request.query_params.get("id"))

        if request.user.is_staff:
            patient = appointment.user
            user_name = f"{patient.first_name} {patient.last_name}"
            date = appointment.chosen_date
            subject = "Your appointment has been canceled"
            message = f"Dear {user_name},\n\nYour dental appointment scheduled for {date} has been canceled. Please contact us to reschedule.\n\nSincerely,\nThe Clinic"
            email = EmailMessage(subject, message, to=[patient.email])
            email.send()

        appointment.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(methods=["POST"], detail=False, permission_classes=[IsAuthenticated], authentication_classes=[TokenAuthentication])
    def record(self, request):
        """
        Create a medical record.

        This endpoint creates a medical record for an appointment, including textual notes
        and dental X-ray images. Image analysis is performed using the Gemini API.

        Permissions:
        - User must be authenticated and staff.

        Request Body:
        {
            "appointment": <appointment_id>,
            "text_note": "string",
            "images": [
                {
                    "encoded_data": "base64_encoded_image_data",
                    "mime_type": "image/jpeg"
                }
            ]
        }
        """
        if not request.user.is_staff:
            return Response({"message": "You are not allowed to perform this operation."}, status=status.HTTP_403_FORBIDDEN)

        rec_serializer = serializers.RecordSerializer(data=request.data)
        rec_serializer.is_valid(raise_exception=True)
        record = rec_serializer.save()

        images_data = request.data.get("images", [])
        saved_images = []
        for image_item in images_data:
            saved_image = self._process_and_save_image(image_item, record)
            if saved_image:
                saved_images.append(serializers.ImageSerializer(saved_image).data)

        response_data = {
            "record": serializers.RecordSerializer(record).data,
            "images": saved_images,
            "message": "Record and images saved successfully.",
        }
        return Response(response_data, status=status.HTTP_201_CREATED)

    @action(methods=["GET"], detail=False, permission_classes=[IsAuthenticated], authentication_classes=[TokenAuthentication])
    def get_record(self, request):
        """
        Get a medical record.

        This endpoint retrieves the medical record associated with a specific appointment,
        including any attached images.

        Permissions:
        - User must be authenticated.

        Query Parameters:
        - appointment_id: The ID of the appointment to retrieve the record for.
        """
        appointment_id = request.query_params.get("appointment_id")
        record = Record.objects.filter(appointment=appointment_id).first()

        if not record:
            return Response({"record": None, "images": []})

        rec_serializer = serializers.RecordSerializer(record)
        images = RecordImage.objects.filter(record=record)
        im_serializer = serializers.ImageSerializer(images, many=True)

        return Response({
            "record": rec_serializer.data,
            "images": im_serializer.data,
        })

    def get_serializer_class(self):
        """
        Get the appropriate serializer class for the action.

        This method returns the serializer class based on the current action,
        allowing for different serializers to be used for different actions.
        """
        if not isinstance(self.serializer_classes, dict):
            raise ImproperlyConfigured("serializer_classes must be a dictionary")
        return self.serializer_classes.get(self.action, self.serializer_class)

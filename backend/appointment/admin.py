from django.contrib import admin
from django.utils.html import format_html
from .models import Appointment, Record, RecordImage

class RecordImageInline(admin.TabularInline):
    """
    Allows editing of RecordImage models directly within the Record admin page.
    This provides a convenient way to manage all images associated with a record.
    """
    model = RecordImage
    extra = 1  # Number of empty forms to display for adding new images
    readonly_fields = ('image_thumbnail',)
    fields = ('image_thumbnail', 'image', 'mime_type', 'gemini_analysis')

    def image_thumbnail(self, obj):
        """
        Creates a small thumbnail of the image to display in the admin.
        If the image is a valid base64 string, it's rendered; otherwise, a placeholder is shown.
        """
        if obj.image and 'base64,' in obj.image:
            return format_html('<img src="{}" width="150" height="auto" />', obj.image)
        return "No Image"
    image_thumbnail.short_description = 'Image Thumbnail'

class RecordInline(admin.StackedInline):
    """
    Allows editing of a Record model directly within the Appointment admin page.
    This makes it easy to view or create a record when looking at an appointment.
    """
    model = Record
    can_delete = False
    verbose_name_plural = 'Medical Record'
    inlines = [RecordImageInline]

@admin.register(Appointment)
class AppointmentAdmin(admin.ModelAdmin):
    """
    Customizes the admin interface for the Appointment model.
    """
    list_display = ('pk', 'user', 'chosen_date', 'reason_of_appointment', 'has_record')
    list_filter = ('chosen_date',)
    search_fields = ('user__email', 'user__first_name', 'user__last_name', 'reason_of_appointment')
    date_hierarchy = 'chosen_date'
    ordering = ('-chosen_date',)
    inlines = (RecordInline,)

    def has_record(self, obj):
        """
        A custom method to check if an appointment has an associated medical record.
        Returns True if a record exists, False otherwise.
        """
        return hasattr(obj, 'record')
    has_record.boolean = True
    has_record.short_description = 'Has Record?'

@admin.register(Record)
class RecordAdmin(admin.ModelAdmin):
    """
    Customizes the admin interface for the Record model.
    """
    list_display = ('appointment', 'text_note_snippet')
    search_fields = ('appointment__user__email', 'appointment__user__first_name', 'appointment__user__last_name', 'text_note')
    inlines = [RecordImageInline]

    def text_note_snippet(self, obj):
        """
        Returns a shortened version of the text_note for display in the list view.
        """
        return obj.text_note[:50] + '...' if len(obj.text_note) > 50 else obj.text_note
    text_note_snippet.short_description = 'Text Note'

@admin.register(RecordImage)
class RecordImageAdmin(admin.ModelAdmin):
    """
    Customizes the admin interface for the RecordImage model.
    """
    list_display = ('record', 'image_thumbnail', 'mime_type', 'gemini_analysis_snippet')
    list_filter = ('mime_type',)
    search_fields = ('record__appointment__user__email',)
    readonly_fields = ('image_thumbnail',)

    def image_thumbnail(self, obj):
        """
        Creates a small thumbnail of the image to display in the admin.
        """
        if obj.image and 'base64,' in obj.image:
            return format_html('<img src="{}" width="150" height="auto" />', obj.image)
        return "No Image"
    image_thumbnail.short_description = 'Image Thumbnail'

    def gemini_analysis_snippet(self, obj):
        """
        Returns a shortened version of the gemini_analysis for display.
        """
        if obj.gemini_analysis:
            return obj.gemini_analysis[:50] + '...' if len(obj.gemini_analysis) > 50 else obj.gemini_analysis
        return "No Analysis"
    gemini_analysis_snippet.short_description = 'Gemini Analysis'
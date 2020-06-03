from __future__ import absolute_import

from sentry.utils.imports import import_string
from django.conf import settings


event_tmpstore = import_string(settings.SENTRY_EVENT_TMPSTORE)(
    **settings.SENTRY_EVENT_TMPSTORE_OPTIONS
)


__all__ = ["event_tmpstore"]

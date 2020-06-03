from __future__ import absolute_import

from sentry.cache import default_cache

from .base import BaseEventTmpStore


class DefaultEventTmpStore(BaseEventTmpStore):
    def __init__(self, **options):
        super(DefaultEventTmpStore, self).__init__(inner=default_cache, **options)

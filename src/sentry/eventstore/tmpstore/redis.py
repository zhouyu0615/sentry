from __future__ import absolute_import

import logging

from .base import BaseEventTmpStore
from sentry.cache.redis import RedisClusterCache

logger = logging.getLogger(__name__)


class RedisClusterEventTmpStore(BaseEventTmpStore):
    def __init__(self, **options):
        super(RedisClusterEventTmpStore, self).__init__(inner=RedisClusterCache(**options))

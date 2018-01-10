import datetime
import tzlocal
import math
import dateutil
from dateutil import relativedelta

from pytz import timezone

DEFAULT_NAIVE_ZONE = 'UTC'
DEFAULT_LOCAL_ZONE = 'US/Eastern'
DATE_EPSILON = datetime.timedelta(seconds=5)

def tzConv(
        time,
        fromZone=DEFAULT_NAIVE_ZONE,
        toZone=DEFAULT_LOCAL_ZONE,
        naive=False):
    fromZone = timezone(fromZone)
    toZone = timezone(toZone)
    if not time.tzinfo:
        time = fromZone.localize(time)
    result = time.astimezone(toZone)
    if naive:
        result = result.replace(tzinfo=None)
    return result

def tzTrunc(
        time,
        granularity,
        fromZone=DEFAULT_NAIVE_ZONE,
        truncZone=DEFAULT_LOCAL_ZONE,
        toZone=DEFAULT_NAIVE_ZONE,
        naive=False):

    localized = tzConv(time, fromZone, truncZone)
    year = localized.year
    if granularity == 'year':
        month = 1
        day = 1
        hour = 0
    elif granularity == 'month':
        month = localized.month
        day = 1
        hour = 0
    elif granularity == 'day':
        month = localized.month
        day = localized.day
        hour = 0
    elif granularity == 'hour':
        month = localized.month
        day = localized.day
        hour = localized.hour
    else:
        return localized

    dt = datetime.datetime(
        year=year,
        month=month,
        day=day,
        hour=hour,
    )

    return tzConv(
        dt,
        fromZone=truncZone,
        toZone=toZone,
        naive=naive,
    )

def todayStart(
        truncZone=DEFAULT_LOCAL_ZONE,
        toZone=DEFAULT_NAIVE_ZONE,
        naive=False):
    return tzTrunc(
        (datetime.datetime.now()),
        'day',
        truncZone=truncZone,
        toZone=toZone,
        naive=naive,
    )

def yesterdayStart(
        truncZone=DEFAULT_LOCAL_ZONE,
        toZone=DEFAULT_NAIVE_ZONE,
        naive=False):
    return tzTrunc(
        (datetime.datetime.now() - datetime.timedelta(days=1)),
        'day',
        truncZone=truncZone,
        toZone=toZone,
        naive=naive,
    )

def thisMonthStart(
        truncZone=DEFAULT_LOCAL_ZONE,
        toZone=DEFAULT_NAIVE_ZONE,
        naive=False):
    return tzTrunc(
        (datetime.datetime.now()),
        'month',
        truncZone=truncZone,
        toZone=toZone,
        naive=naive,
    )

def lastMonthStart(
        truncZone=DEFAULT_LOCAL_ZONE,
        toZone=DEFAULT_NAIVE_ZONE,
        naive=False):
    return tzTrunc(
        (datetime.datetime.now() - relativedelta.relativedelta(months=1)),
        'month',
        truncZone=truncZone,
        toZone=toZone,
        naive=naive,
    )

def nextMonthStart(
        truncZone=DEFAULT_LOCAL_ZONE,
        toZone=DEFAULT_NAIVE_ZONE,
        naive=False):
    return tzTrunc(
        (datetime.datetime.now() + relativedelta.relativedelta(months=1)),
        'month',
        truncZone=truncZone,
        toZone=toZone,
        naive=naive,
    )

def sameTimePreviousDay(time):
    return time - datetime.timedelta(days=1)

def sameTimeYesterday():
    return sameTimePreviousDay(datetime.datetime.now())

def sameTimePreviousMonth(
        time,
        fromZone=DEFAULT_NAIVE_ZONE,
        diffZone=DEFAULT_LOCAL_ZONE,
        toZone=DEFAULT_NAIVE_ZONE,
        naive=False,
    ):
    localized = tzConv(time, fromZone, diffZone)
    diffed = localized - relativedelta.relativedelta(months=1)
    return tzConv(
        diffed,
        diffZone,
        toZone,
        naive=naive,
    )

def sameTimeLastMonth(
        diffZone=DEFAULT_LOCAL_ZONE,
        toZone=DEFAULT_NAIVE_ZONE,
        naive=False,
    ):
    return sameTimePreviousMonth(
        time=datetime.datetime.now(),
        diffZone=diffZone,
        toZone=toZone,
        naive=naive,
    )

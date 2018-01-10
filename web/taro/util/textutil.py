import datetime
import json
import six

from taro.util import timeutil

def commaNumber(number, limitDecimals=0):
    if number is None:
        return None

    if isinstance(number, six.string_types):
        try:
            number = float(number)
        except ValueError:
            return None
    fmt = "{0:,.%sf}" % limitDecimals
    return fmt.format(number)

def humanDate(value, convertToTarget=True, brief=False):
    if value is None:
        return ""
    else:
        if isinstance(value, datetime.datetime) and convertToTarget:
            value = timeutil.tzConv(value)
        if brief:
            return value.strftime("%m/%d/%y")
        else:
            return value.strftime("%A, %B %d %Y")

def humanDateTime(value, convertToTarget=True, brief=False):
    if value is None:
        return ""
    else:
        if isinstance(value, datetime.datetime) and convertToTarget:
            value = timeutil.tzConv(value)
        if brief:
            return value.strftime("%m/%d/%y %I:%M%p")
        else:
            return value.strftime("%A, %B %d %Y %I:%M%p")

def money(value, cents=True, inPennies=False):
    if value is None:
        return ""

    if isinstance(value, six.string_types):
        value = float(value)

    if inPennies:
        value = float(value)/100

    if cents:
        return '${:0,.2f}'.format(value)
    else:
        return '${:0,.0f}'.format(value)

def phone(value):
    if value is None:
        return None
    else:
        return "(%s) %s-%s" % (value[0:3], value[3:6], value[6:])

def plural(number, singularVersion, pluralVersion=None):
    return "%s %s" % (number,
        pluralName(number, singularVersion, pluralVersion))

def pluralName(number, singularVersion, pluralVersion=None):
    if number == 1:
        return singularVersion
    else:
        return pluralVersion or (singularVersion + "s")

class GoodJsonEncoder(json.JSONEncoder):

    def default(self, obj):
        if isinstance(obj, datetime.datetime):
            return str(obj)
        else:
            return json.JSONEncoder.default(self, obj)

GOOD_JSON_ENCODER = GoodJsonEncoder()
